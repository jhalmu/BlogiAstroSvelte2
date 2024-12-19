interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  alt: string;
  src: string;
  srcSet: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
  };
}

interface PexelsApiResponse {
  photos: Array<{
    id: number;
    width: number;
    height: number;
    url: string;
    alt: string;
    src: {
      original: string;
      large2x: string;
      large: string;
      medium: string;
    };
    avg_color: string;
  }>;
}

interface ImageOptions {
  tags?: string[];
  baseColor?: string;
  minAspectRatio?: number;
  maxAspectRatio?: number;
  excludeTags?: string[];  // Tags to exclude from search
  minWidth?: number;       // Minimum image width
  minHeight?: number;      // Minimum image height
  preferredColors?: string[]; // List of preferred colors
  orientation?: 'landscape' | 'portrait' | 'square';
}

export async function getPexelsImage({ 
  tags = ['blog'], 
  minAspectRatio = 1.3,
  maxAspectRatio = 2.0,
  excludeTags = [],
  minWidth = 1000,
  minHeight = 600,
  preferredColors = [],
  orientation = 'landscape'
}: ImageOptions): Promise<PexelsImage | null> {
  try {
    const PEXELS_API_KEY = import.meta.env.PEXELS_API_KEY;
    
    if (!PEXELS_API_KEY) {
      console.error('Missing Pexels API key');
      return null;
    }

    // Build query by including tags and excluding unwanted tags
    const includeTerms = tags.join(' ');
    const excludeTerms = excludeTags.map(tag => `-${tag}`).join(' ');
    const query = `${includeTerms} ${excludeTerms}`.trim();

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=${orientation}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data: PexelsApiResponse = await response.json();

    if (!data.photos || data.photos.length === 0) {
      console.warn('No photos found, trying with default tags');
      return getPexelsImage({ 
        tags: ['blog'], 
        minAspectRatio, 
        maxAspectRatio,
        minWidth,
        minHeight,
        orientation 
      });
    }

    // Filter photos based on all criteria
    const validPhotos = data.photos.filter((photo) => {
      // Check minimum dimensions
      if (photo.width < minWidth || photo.height < minHeight) return false;

      // Check aspect ratio if specified
      if (minAspectRatio && maxAspectRatio) {
        const aspectRatio = photo.width / photo.height;
        if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) return false;
      }

      // If preferred colors are specified, check if the photo's dominant color matches
      if (preferredColors.length > 0 && photo.avg_color) {
        const photoColor = photo.avg_color.toLowerCase();
        const matchesPreferredColor = preferredColors.some(color => 
          photoColor.includes(color.toLowerCase())
        );
        if (!matchesPreferredColor) return false;
      }

      return true;
    });

    if (validPhotos.length === 0) {
      console.warn('No photos match the specified criteria');
      return null;
    }

    // Select a random photo from the filtered results
    const randomPhoto = validPhotos[Math.floor(Math.random() * validPhotos.length)];

    return {
      id: randomPhoto.id,
      width: randomPhoto.width,
      height: randomPhoto.height,
      url: randomPhoto.url,
      alt: randomPhoto.alt || 'Blog post hero image',
      src: randomPhoto.src.large2x,
      srcSet: {
        original: randomPhoto.src.original,
        large2x: randomPhoto.src.large2x,
        large: randomPhoto.src.large,
        medium: randomPhoto.src.medium
      }
    };

  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}
