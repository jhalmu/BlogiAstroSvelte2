import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');

// Ensure blog directory exists
mkdirSync(BLOG_DIR, { recursive: true });

// Finnish towns and their descriptions
const finnishTowns = [
  {
    name: 'Porvoo',
    description: 'Historiallinen puutalokaupunki joen varrella',
    highlights: ['Vanha kaupunki', 'Tuomiokirkko', 'Jokiranta']
  },
  {
    name: 'Naantali',
    description: 'Idyllinen merenrantakaupunki',
    highlights: ['Muumimaailma', 'Vanha kaupunki', 'Kultaranta']
  },
  {
    name: 'Rauma',
    description: 'UNESCO-kohteena tunnettu puutalokaupunki',
    highlights: ['Vanha Rauma', 'Pitsiviikot', 'Merimuseo']
  }
  // Add more towns as needed
];

// Travel destinations
const travelDestinations = [
  {
    name: 'Madeira',
    description: 'Ikuisen kevään saari Atlantilla',
    highlights: ['Levadat', 'Funchal', 'Vuoristokylät']
  }
  // Add more destinations as needed
];

// Technology topics
const techTopics = [
  {
    title: 'Go kielen perusteet',
    tags: ['GO', 'ohjelmointi', 'backend'],
    keyTerms: {
      fi: ['rinnakkaisuus', 'goroutine', 'kanavat'],
      en: ['concurrency', 'goroutine', 'channels']
    }
  },
  {
    title: 'Elixir ja Phoenix LiveView',
    tags: ['Elixir', 'Phoenix', 'web-kehitys'],
    keyTerms: {
      fi: ['toiminnallinen ohjelmointi', 'reaaliaikaisuus', 'tilanhallinta'],
      en: ['functional programming', 'real-time', 'state management']
    }
  }
  // Add more tech topics
];

// Genealogy topics
const genealogyTopics = [
  {
    title: 'DNA-sukututkimus Suomessa',
    tags: ['DNA', 'sukututkimus', 'historia'],
    keyTerms: {
      fi: ['Y-DNA', 'mtDNA', 'serkkuvertailu'],
      en: ['Y-DNA', 'mtDNA', 'cousin matching']
    }
  }
  // Add more genealogy topics
];

// More interesting combinations
const mixedTopics = [
  {
    title: 'Valokuvauskohteet Porvoossa',
    description: 'Parhaat paikat luonto- ja kaupunkikuvaukseen historiallisessa Porvoossa',
    highlights: [
      'Vanhan kaupungin valokuvausreitit',
      'Lintujen kuvaus jokirannassa',
      'Historiallisten rakennusten yksityiskohdat',
      'Parhaat ajat kuvaamiseen eri vuodenaikoina'
    ],
    tags: ['valokuvaus', 'Porvoo', 'luonto', 'arkkitehtuuri'],
    keyTerms: {
      fi: ['valokuvaus', 'arkkitehtuuri', 'luontokuvaus'],
      en: ['photography', 'architecture', 'nature photography']
    }
  },
  {
    title: 'DNA-sukututkimus Rauman seudulla',
    description: 'Miten DNA-tutkimus on paljastanut Rauman seudun sukujen historiaa',
    highlights: [
      'Paikallisten DNA-projektien tulokset',
      'Merenkulkijasukujen jäljillä',
      'Kirkonkirjojen ja DNA:n yhdistäminen',
      'Kansainväliset yhteydet'
    ],
    tags: ['DNA', 'sukututkimus', 'Rauma', 'historia'],
    keyTerms: {
      fi: ['DNA-tutkimus', 'sukuhistoria', 'merenkulku'],
      en: ['DNA research', 'genealogy', 'maritime history']
    }
  },
  {
    title: 'Madeiran teknologiaskene',
    description: 'Etätyöskentely ja teknologiayhteisöt Madeiralla',
    highlights: [
      'Coworking-tilat Funchalissa',
      'Tech-meetupit saarella',
      'Etätyöskentelijöiden vinkit',
      'Parhaat työskentelykahvilat'
    ],
    tags: ['Madeira', 'teknologia', 'etätyö', 'yhteisö'],
    keyTerms: {
      fi: ['etätyö', 'teknologiayhteisö', 'coworking'],
      en: ['remote work', 'tech community', 'coworking']
    }
  },
  {
    title: 'Naantalin luontopolut tekoälyn silmin',
    description: 'Tekoälyn hyödyntäminen luontoreittien suunnittelussa ja analysoinnissa',
    highlights: [
      'Tekoälyn tunnistamia kasvilajeja',
      'Optimaaliset reitit eri vuodenaikoina',
      'Luonnon monimuotoisuuden kartoitus',
      'Käyttäjäkokemukset ja palaute'
    ],
    tags: ['Naantali', 'tekoäly', 'luonto', 'teknologia'],
    keyTerms: {
      fi: ['tekoäly', 'luontopolut', 'biodiversiteetti'],
      en: ['AI', 'nature trails', 'biodiversity']
    }
  },
  {
    title: 'Elixir-pohjainen sukupuu-sovellus',
    description: 'Kuinka rakensin sukututkimustyökalun Elixirillä',
    highlights: [
      'Phoenix LiveView käytännössä',
      'Sukupuun visualisointi',
      'DNA-matchien integrointi',
      'Hajautettu tietokanta'
    ],
    tags: ['Elixir', 'ohjelmointi', 'sukututkimus', 'Phoenix'],
    keyTerms: {
      fi: ['ohjelmointi', 'sukupuu', 'tietokanta'],
      en: ['programming', 'family tree', 'database']
    }
  }
];

// Add more mixed topics
const moreMixedTopics = [
  {
    title: 'Tekoälyavusteinen valokuvaus Madeiralla',
    description: 'Kuinka tekoäly auttaa löytämään ja kuvaamaan Madeiran parhaat kohteet',
    highlights: [
      'AI-pohjainen kohdeanalyysi',
      'Parhaat kuvausajat tekoälyn avulla',
      'Kuvien automaattinen analyysi',
      'AI-pohjaiset suodattimet'
    ],
    tags: ['Madeira', 'tekoäly', 'valokuvaus', 'matkailu'],
    keyTerms: {
      fi: ['tekoäly', 'valokuvaus', 'matkakuvaus'],
      en: ['AI', 'photography', 'travel photography']
    }
  },
  {
    title: 'Etätyöpaikat historiallisissa kaupungeissa',
    description: 'Parhaat työskentelypaikat Suomen vanhoissa kaupungeissa',
    highlights: [
      'Historialliset kahvilat työpisteinä',
      'Modernit coworking-tilat vanhoissa rakennuksissa',
      'Nettiyhteydet ja fasiliteetit',
      'Yhteisölliset työtilat'
    ],
    tags: ['etätyö', 'historia', 'kaupungit', 'työskentely'],
    keyTerms: {
      fi: ['etätyö', 'historia', 'työympäristö'],
      en: ['remote work', 'history', 'work environment']
    }
  },
  {
    title: 'DNA-tutkimus merenkulkijakaupungeissa',
    description: 'Miten DNA-tutkimus paljastaa merenkulkijoiden reitit ja sukulaisuussuhteet',
    highlights: [
      'Satamakaupunkien DNA-projektit',
      'Kansainväliset yhteydet',
      'Merimiesrekisterit ja DNA',
      'Sukututkijoiden kokemukset'
    ],
    tags: ['DNA', 'merenkulku', 'historia', 'sukututkimus'],
    keyTerms: {
      fi: ['DNA-tutkimus', 'merenkulku', 'sukuhistoria'],
      en: ['DNA research', 'maritime', 'family history']
    }
  }
];

// Short notes and quick updates
const shortNotes = [
  {
    title: {
      fi: 'Tech-meetupit historiallisissa miljöissä',
      en: 'Tech Meetups in Historical Settings'
    },
    description: {
      fi: 'Vanhojen tilojen hyödyntäminen teknologiatapahtumissa',
      en: 'Utilizing historical spaces for technology events'
    },
    tags: ['tech', 'events', 'history'],
    type: 'short'
  },
  {
    title: {
      fi: 'Tekoälyavusteinen valokuvaus',
      en: 'AI-Assisted Photography'
    },
    description: {
      fi: 'AI:n hyödyntäminen luontokuvauksen apuna',
      en: 'Using AI to enhance nature photography'
    },
    tags: ['ai', 'photography', 'nature'],
    type: 'short'
  },
  {
    title: {
      fi: 'Paikallishistoria modernin teknologian avulla',
      en: 'Local History Through Modern Technology'
    },
    description: {
      fi: 'Digitaaliset työkalut historiallisessa tutkimuksessa',
      en: 'Digital tools in historical research'
    },
    tags: ['history', 'technology', 'research'],
    type: 'short'
  }
];

// Location-specific blog posts
const locationPosts = [
  {
    title: {
      fi: 'Valokuvauskohteet Porvoossa',
      en: 'Photography Spots in Porvoo'
    },
    description: {
      fi: 'Parhaat kuvauspaikat ja -ajat Porvoossa',
      en: 'Best photography locations and times in Porvoo'
    },
    tags: ['photography', 'porvoo', 'travel']
  },
  {
    title: {
      fi: 'DNA-sukututkimus Rauman seudulla',
      en: 'DNA Genealogy Research in Rauma Region'
    },
    description: {
      fi: 'Sukututkimusta ja DNA-analyysejä Rauman alueella',
      en: 'Genealogy and DNA analysis in the Rauma region'
    },
    tags: ['dna', 'genealogy', 'rauma']
  },
  {
    title: {
      fi: 'Madeiran teknologiaskene',
      en: 'Madeira Tech Scene'
    },
    description: {
      fi: 'Teknologiayhteisöt ja tapahtumat Madeiralla',
      en: 'Technology communities and events in Madeira'
    },
    tags: ['technology', 'madeira', 'community']
  },
  {
    title: {
      fi: 'Naantalin luontopolut tekoälyn silmin',
      en: 'Naantali Nature Trails Through AI Lens'
    },
    description: {
      fi: 'Tekoälyavusteinen luontokuvaus Naantalin poluilla',
      en: 'AI-assisted nature photography on Naantali trails'
    },
    tags: ['ai', 'photography', 'nature', 'naantali']
  }
];

// Technology tutorials and guides
const techGuides = [
  {
    title: {
      fi: 'Elixir-pohjainen sukupuu-sovellus',
      en: 'Elixir-based Family Tree Application'
    },
    description: {
      fi: 'Sukututkimussovelluksen rakentaminen Elixirillä',
      en: 'Building a genealogy application with Elixir'
    },
    tags: ['elixir', 'programming', 'genealogy']
  }
];

// City visit guides
const cityGuides = [
  {
    title: {
      fi: 'Vierailu Porvoossa',
      en: 'Visit to Porvoo'
    },
    description: {
      fi: 'Historiallinen kierros Porvoossa',
      en: 'Historical tour in Porvoo'
    },
    tags: ['porvoo', 'travel', 'history']
  },
  {
    title: {
      fi: 'Vierailu Naantalissa',
      en: 'Visit to Naantali'
    },
    description: {
      fi: 'Naantalin nähtävyydet ja historia',
      en: 'Sights and history of Naantali'
    },
    tags: ['naantali', 'travel', 'history']
  },
  {
    title: {
      fi: 'Vierailu Raumassa',
      en: 'Visit to Rauma'
    },
    description: {
      fi: 'Rauman vanha kaupunki ja merenkulkuhistoria',
      en: 'Old Town Rauma and maritime history'
    },
    tags: ['rauma', 'travel', 'history']
  },
  {
    title: {
      fi: 'Matkaopas: Madeira',
      en: 'Travel Guide: Madeira'
    },
    description: {
      fi: 'Madeiran nähtävyydet ja aktiviteetit',
      en: 'Sights and activities in Madeira'
    },
    tags: ['madeira', 'travel', 'guide']
  }
];

// Add DNA research centers
const dnaResearchCenters = {
  'Helsinki': [
    {
      name: 'Institute for Molecular Medicine Finland (FIMM)',
      services: ['DNA sequencing', 'Genetic research', 'Biobank'],
      projects: ['FinnGen', 'Population genetics']
    }
  ],
  'Turku': [
    {
      name: 'Genealogical Society of Finland',
      services: ['DNA testing', 'Research assistance', 'Workshops'],
      resources: ['Historical records', 'DNA databases']
    }
  ]
};

// Series data
const series = [
  {
    name: {
      fi: 'DNA-tutkimus Suomessa',
      en: 'DNA Research in Finland'
    },
    parts: [
      {
        title: {
          fi: 'DNA-tutkimuksen perusteet sukututkimuksessa',
          en: 'Basics of DNA Research in Genealogy'
        },
        description: {
          fi: 'Johdanto DNA-tutkimuksen käyttöön sukututkimuksessa',
          en: 'Introduction to using DNA research in genealogy'
        },
        tags: ['dna', 'genealogy', 'research'],
        partNumber: 1
      },
      {
        title: {
          fi: 'Merenkulkijasukujen DNA-tutkimus',
          en: 'DNA Research of Maritime Families'
        },
        description: {
          fi: 'DNA-tutkimuksen soveltaminen merenkulkijasukujen tutkimukseen',
          en: 'Applying DNA research to maritime family research'
        },
        tags: ['dna', 'genealogy', 'maritime'],
        partNumber: 2
      },
      {
        title: {
          fi: 'Kansainväliset DNA-projektit',
          en: 'International DNA Projects'
        },
        description: {
          fi: 'Osallistuminen kansainvälisiin DNA-tutkimusprojekteihin',
          en: 'Participating in international DNA research projects'
        },
        tags: ['dna', 'genealogy', 'international'],
        partNumber: 3
      }
    ]
  },
  {
    name: {
      fi: 'Teknologia historiallisissa kaupungeissa',
      en: 'Technology in Historical Cities'
    },
    parts: [
      {
        title: {
          fi: 'Modernit työtilat vanhoissa rakennuksissa',
          en: 'Modern Workspaces in Historic Buildings'
        },
        description: {
          fi: 'Vanhojen rakennusten muuntaminen moderneiksi työtiloiksi',
          en: 'Converting old buildings into modern workspaces'
        },
        tags: ['technology', 'history', 'architecture'],
        partNumber: 1
      },
      {
        title: {
          fi: 'Tech-tapahtumat historiallisissa miljöissä',
          en: 'Tech Events in Historical Settings'
        },
        description: {
          fi: 'Teknologiatapahtumien järjestäminen historiallisissa tiloissa',
          en: 'Organizing technology events in historical venues'
        },
        tags: ['technology', 'events', 'history'],
        partNumber: 2
      },
      {
        title: {
          fi: 'Vanhan ja uuden teknologian yhdistäminen',
          en: 'Combining Old and New Technology'
        },
        description: {
          fi: 'Historiallisen ja modernin teknologian integrointi',
          en: 'Integrating historical and modern technology'
        },
        tags: ['technology', 'history', 'innovation'],
        partNumber: 3
      }
    ]
  }
];

// Blog posts
const blogPosts = [
  {
    title: {
      fi: 'Tekoälyavusteinen valokuvaus Madeiralla',
      en: 'AI-Assisted Photography in Madeira'
    },
    description: {
      fi: 'Kuinka tekoäly auttaa valokuvauksessa ja kuvankäsittelyssä Madeiran maisemissa',
      en: 'How AI assists in photography and image processing in Madeira landscapes'
    },
    tags: ['photography', 'ai', 'madeira', 'travel']
  },
  {
    title: {
      fi: 'Etätyöpaikat historiallisissa kaupungeissa',
      en: 'Remote Work Spots in Historical Cities'
    },
    description: {
      fi: 'Modernin työn ja historiallisen ympäristön yhdistäminen',
      en: 'Combining modern work with historical surroundings'
    },
    tags: ['remote-work', 'history', 'architecture']
  },
  {
    title: {
      fi: 'DNA-tutkimus merenkulkijakaupungeissa',
      en: 'DNA Research in Maritime Cities'
    },
    description: {
      fi: 'Merenkulkijasukujen DNA-tutkimus Suomen rannikkokaupungeissa',
      en: 'DNA research of maritime families in Finnish coastal cities'
    },
    tags: ['dna', 'genealogy', 'maritime', 'history']
  }
];

// Platform-specific templates
const socialTemplates = {
  bluesky: {
    series: {
      fi: (post, seriesInfo) => ({
        content: `${post.title} (Osa ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        tags: ['blogisarja', seriesInfo.name.toLowerCase().replace(/[^a-zäöå0-9]/g, ''), ...(post.tags || [])]
      }),
      en: (post, seriesInfo) => ({
        content: `${post.title} (Part ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        tags: ['series', seriesInfo.name.toLowerCase().replace(/[^a-z0-9]/g, ''), ...(post.tags || [])]
      })
    },
    short: {
      fi: (post) => ({
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: post.content,
        tags: post.tags || []
      })
    },
    preview: {
      fi: (post) => ({
        content: `${post.content.substring(0, 250)}...`,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: `${post.content.substring(0, 250)}...`,
        tags: post.tags || []
      })
    },
    full: {
      fi: (post) => ({
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: post.content,
        tags: post.tags || []
      })
    }
  },
  mastodon: {
    series: {
      fi: (post, seriesInfo) => ({
        content: `${post.title} (Osa ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        tags: ['blogisarja', seriesInfo.name.toLowerCase().replace(/[^a-zäöå0-9]/g, ''), ...(post.tags || [])]
      }),
      en: (post, seriesInfo) => ({
        content: `${post.title} (Part ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        tags: ['series', seriesInfo.name.toLowerCase().replace(/[^a-z0-9]/g, ''), ...(post.tags || [])]
      })
    },
    short: {
      fi: (post) => ({
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: post.content,
        tags: post.tags || []
      })
    },
    preview: {
      fi: (post) => ({
        content: `${post.content.substring(0, 450)}...`,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: `${post.content.substring(0, 450)}...`,
        tags: post.tags || []
      })
    },
    full: {
      fi: (post) => ({
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        content: post.content,
        tags: post.tags || []
      })
    }
  },
  linkedin: {
    series: {
      fi: (post, seriesInfo) => ({
        title: `${post.title} (Osa ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        content: post.content,
        tags: ['blogisarja', seriesInfo.name.toLowerCase().replace(/[^a-zäöå0-9]/g, ''), ...(post.tags || [])]
      }),
      en: (post, seriesInfo) => ({
        title: `${post.title} (Part ${seriesInfo.partNumber}/${seriesInfo.totalParts})`,
        content: post.content,
        tags: ['series', seriesInfo.name.toLowerCase().replace(/[^a-z0-9]/g, ''), ...(post.tags || [])]
      })
    },
    short: {
      fi: (post) => ({
        title: post.title,
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        title: post.title,
        content: post.content,
        tags: post.tags || []
      })
    },
    preview: {
      fi: (post) => ({
        title: post.title,
        content: `${post.content.substring(0, 1250)}...`,
        tags: post.tags || []
      }),
      en: (post) => ({
        title: post.title,
        content: `${post.content.substring(0, 1250)}...`,
        tags: post.tags || []
      })
    },
    full: {
      fi: (post) => ({
        title: post.title,
        content: post.content,
        tags: post.tags || []
      }),
      en: (post) => ({
        title: post.title,
        content: post.content,
        tags: post.tags || []
      })
    }
  }
};

// Platform-specific image sizes and formats
const socialImageSizes = {
  bluesky: {
    width: 1200,
    height: 630,
    format: 'jpeg',
    template: (post) => ({
      background: post.coverImage || 'gradient',
      title: post.title,
      subtitle: post.description,
      author: 'Juha Halmu',
      logo: 'logo.png'
    })
  },
  mastodon: {
    width: 1280,
    height: 720,
    format: 'png',
    template: (post) => ({
      background: post.coverImage || 'pattern',
      title: post.title,
      subtitle: post.description,
      author: 'Juha Halmu',
      date: post.date
    })
  },
  linkedin: {
    width: 1200,
    height: 627,
    format: 'jpeg',
    template: (post) => ({
      background: post.coverImage || 'professional',
      title: post.title,
      subtitle: post.description,
      author: 'Juha Halmu',
      website: 'juhahalmu.fi'
    })
  }
};

// Location data for cities and places
const locationData = {
  porvoo: {
    region: 'Uusimaa',
    country: 'Suomi',
    lat: 60.393,
    lon: 25.665,
    highlights: [
      'Vanha Porvoo (Gamla Borga)',
      'Porvoon tuomiokirkko',
      'Runebergin koti',
      'Taidetehdas',
      'Porvoonjoki'
    ]
  },
  naantali: {
    region: 'Varsinais-Suomi',
    country: 'Suomi',
    lat: 60.468,
    lon: 22.026,
    highlights: [
      'Naantalin vanha kaupunki',
      'Naantalin kylpylä',
      'Muumimaailma',
      'Naantalin kirkko',
      'Luonnonmaansaari'
    ]
  },
  rauma: {
    region: 'Satakunta',
    country: 'Suomi',
    lat: 61.128,
    lon: 21.511,
    highlights: [
      'Vanha Rauma (UNESCO)',
      'Rauman merimuseo',
      'Rauman taidemuseo',
      'Pyhän Ristin kirkko',
      'Sammallahdenmäki (UNESCO)'
    ]
  },
  madeira: {
    region: 'Madeira',
    country: 'Portugali',
    lat: 32.760,
    lon: -16.959,
    highlights: [
      'Funchalin vanha kaupunki',
      'Monte Palace Tropical Garden',
      'Pico do Arieiro',
      'Cabo Girão',
      'Levada-vaellusreitit'
    ]
  }
};

// Update social metadata generation with templates
function generateSocialMetadata(post, language) {
  const BLOG_URL = 'https://juhahalmu.fi/blog';
  const postUrl = `${BLOG_URL}/${post.title.toLowerCase().replace(/\s+/g, '-')}-${language}`;
  
  const platforms = {
    bluesky: {
      maxLength: 300,
      imageSize: socialImageSizes.bluesky
    },
    mastodon: {
      maxLength: 500,
      imageSize: socialImageSizes.mastodon
    },
    linkedin: {
      maxLength: 1300,
      imageSize: socialImageSizes.linkedin
    }
  };

  // Determine post type and template
  const getTemplate = (platform) => {
    if (post.series) {
      return (content) => socialTemplates[platform].series[language](content, {
        ...post.series,
        name: post.series.name // Already formatted in generatePost
      });
    }
    if (post.type === 'short') {
      return socialTemplates[platform].short[language];
    }
    return post.content.length > platforms[platform].maxLength
      ? socialTemplates[platform].preview[language]
      : socialTemplates[platform].full[language];
  };

  // Add templates to platforms
  Object.keys(platforms).forEach(platform => {
    platforms[platform].template = getTemplate(platform);
  });

  return {
    bluesky: {
      content: platforms.bluesky.template(post, postUrl),
      image: platforms.bluesky.imageSize.template(post),
      url: postUrl
    },
    mastodon: {
      content: platforms.mastodon.template(post, postUrl),
      visibility: 'public',
      url: postUrl
    },
    linkedin: {
      ...platforms.linkedin.template(post, postUrl),
      image: platforms.linkedin.imageSize.template(post),
      url: postUrl
    }
  };
}

// Content generation helper function
function generateContent(topic, language) {
  const title = typeof topic.title === 'string' ? topic.title : topic.title[language];
  const description = typeof topic.description === 'string' ? topic.description : topic.description[language];

  // Generate location data if place is mentioned in title or tags
  const locationMatch = Object.keys(locationData).find(place => 
    title.toLowerCase().includes(place.toLowerCase()) || 
    topic.tags?.some(tag => tag.toLowerCase().includes(place.toLowerCase()))
  );
  const location = locationMatch ? locationData[locationMatch] : null;

  const highlightsList = topic.highlights ? 
    topic.highlights.map(h => `- ${h}`).join('\n') : 
    '';

  if (topic.type === 'short') {
    return `# ${title}

${description}

${highlightsList ? `## Pääkohdat\n\n${highlightsList}\n` : ''}
${location ? `## Sijainti

- Alue: ${location.region}
- Maa: ${location.country}
- Koordinaatit: ${location.lat}, ${location.lon}

` : ''}---

*${language === 'fi' ? 'Lyhyt muistiinpano teknologiasta ja historiasta. Kirjoitettu tekoälyn avustuksella.' : 
  'A short note about technology and history. Written with AI assistance.'}*`.trim();
  }

  return `# ${title}

${description}

${highlightsList ? `${language === 'fi' ? '## Keskeiset kohdat' : '## Key Points'}\n\n${highlightsList}\n` : ''}
${location ? `${language === 'fi' ? '## Sijainti' : '## Location'}

- ${language === 'fi' ? 'Alue' : 'Region'}: ${location.region}
- ${language === 'fi' ? 'Maa' : 'Country'}: ${location.country}
- ${language === 'fi' ? 'Koordinaatit' : 'Coordinates'}: ${location.lat}, ${location.lon}

${language === 'fi' ? '### Kohokohdat' : '### Highlights'}

${location.highlights.map(h => `- ${h}`).join('\n')}

` : ''}---

*${language === 'fi' ? 
  'Tämän artikkelin on kirjoittanut tekoäly yhteistyössä Juha Halmun kanssa.' : 
  'This article was written by AI in collaboration with Juha Halmu.'}*`.trim();
}

// Update generatePost function to handle template functions
function generatePost(topic, language = 'fi', seriesInfo = null) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
  
  // Generate content based on topic and language
  const content = generateContent(topic, language);
  
  // Get the appropriate title and description based on language
  const title = typeof topic.title === 'string' ? topic.title : topic.title[language];
  const description = typeof topic.description === 'string' ? topic.description : topic.description[language];

  // Format series info if part of a series
  let formattedSeriesInfo = null;
  if (seriesInfo) {
    const seriesName = typeof seriesInfo.name === 'string' ? seriesInfo.name : seriesInfo.name[language];
    formattedSeriesInfo = {
      name: seriesName,
      partNumber: seriesInfo.partNumber,
      totalParts: seriesInfo.totalParts
    };
  }
  
  // Generate social metadata
  const socialMetadata = generateSocialMetadata({
    title,
    description,
    content,
    tags: topic.tags,
    type: topic.type || 'post',
    series: formattedSeriesInfo,
    date: date.toISOString().split('T')[0],
    coverImage: topic.coverImage
  }, language);

  // Add sharing strategy based on content length
  const sharingStrategy = {
    bluesky: {
      type: content.length > 300 ? 'preview' : 'full',
      format: 'text_with_image',
      schedule: 'immediate'
    },
    mastodon: {
      type: content.length > 500 ? 'preview' : 'full',
      format: 'text_with_image',
      schedule: 'immediate'
    },
    linkedin: {
      type: content.length > 1300 ? 'preview' : 'full',
      format: 'article',
      schedule: 'next_morning'
    }
  };

  // Prepare image configurations for YAML
  const imageConfigs = {
    bluesky: {
      ...socialImageSizes.bluesky,
      template: {
        background: topic.coverImage || 'gradient',
        title: title,
        subtitle: description,
        author: 'Juha Halmu',
        logo: 'logo.png'
      }
    },
    mastodon: {
      ...socialImageSizes.mastodon,
      template: {
        background: topic.coverImage || 'pattern',
        title: title,
        subtitle: description,
        author: 'Juha Halmu',
        date: date.toISOString().split('T')[0]
      }
    },
    linkedin: {
      ...socialImageSizes.linkedin,
      template: {
        background: topic.coverImage || 'professional',
        title: title,
        subtitle: description,
        author: 'Juha Halmu',
        website: 'juhahalmu.fi'
      }
    }
  };

  // Generate frontmatter
  const frontmatter = {
    title,
    description,
    pubDate: date.toISOString(),
    author: 'Juha Halmu',
    tags: topic.tags,
    language,
    series: formattedSeriesInfo ? {
      name: formattedSeriesInfo.name,
      part: formattedSeriesInfo.partNumber
    } : null,
    social: {
      bluesky: {
        content: socialMetadata.bluesky.content,
        url: socialMetadata.bluesky.url
      },
      mastodon: {
        content: socialMetadata.mastodon.content,
        visibility: 'public',
        url: socialMetadata.mastodon.url
      },
      linkedin: {
        title: socialMetadata.linkedin.title,
        content: socialMetadata.linkedin.content,
        tags: socialMetadata.linkedin.tags,
        url: socialMetadata.linkedin.url
      }
    },
    shareOn: ['bluesky', 'mastodon', 'linkedin'],
    sharingStrategy,
    images: imageConfigs
  };

  const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${language}${formattedSeriesInfo ? `-part-${formattedSeriesInfo.partNumber}` : ''}.md`;
  
  // Generate the full post content with frontmatter
  const post = `---
${yaml.dump(frontmatter, { noRefs: true })}---

${content}
`;

  // Write the post to a file
  const outputPath = join(BLOG_DIR, filename);
  writeFileSync(outputPath, post);
  
  console.log(`Generated${formattedSeriesInfo ? ' series part ' + formattedSeriesInfo.partNumber : ''} (${language}): ${outputPath}`);
  
  return {
    filename,
    path: outputPath,
    frontmatter,
    content
  };
}

// Helper functions
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

function generateLocationData(place) {
  const locations = {
    'Porvoo': {
      lat: 60.3975,
      lon: 25.6667,
      region: 'Uusimaa',
      country: 'Finland',
      highlights: ['Old Town', 'Cathedral', 'River']
    },
    'Naantali': {
      lat: 60.4667,
      lon: 22.0333,
      region: 'Southwest Finland',
      country: 'Finland',
      highlights: ['Old Town', 'Moominworld', 'Harbor']
    },
    'Rauma': {
      lat: 61.1333,
      lon: 21.5000,
      region: 'Satakunta',
      country: 'Finland',
      highlights: ['Old Rauma', 'Maritime Museum', 'Lace Week']
    },
    'Madeira': {
      lat: 32.7607,
      lon: -16.9595,
      region: 'Autonomous Region',
      country: 'Portugal',
      highlights: ['Levada Walks', 'Funchal', 'Mountain Villages']
    }
  };
  return locations[place] || null;
}

// Update generatePost function
function generateAllPosts() {
  console.log('Generating blog posts...\n');

  // Generate series posts first
  Object.entries(series).forEach(([seriesKey, seriesData]) => {
    console.log(`\nGenerating series: ${typeof seriesData.name === 'string' ? seriesData.name : seriesData.name.en}`);
    seriesData.parts.forEach(part => {
      // Generate Finnish version
      const fiPost = generatePost(part, 'fi', {
        name: seriesData.name,
        partNumber: part.partNumber,
        totalParts: seriesData.parts.length
      });
      console.log(`Generated series part ${part.partNumber} (fi): ${fiPost.path}`);

      // Generate English version
      const enPost = generatePost(part, 'en', {
        name: seriesData.name,
        partNumber: part.partNumber,
        totalParts: seriesData.parts.length
      });
      console.log(`Generated series part ${part.partNumber} (en): ${enPost.path}`);
    });
  });

  // Generate blog posts
  blogPosts.forEach(topic => {
    // Generate Finnish version
    const fiPost = generatePost(topic, 'fi');
    console.log(`Generated (fi): ${fiPost.path}`);

    // Generate English version
    const enPost = generatePost(topic, 'en');
    console.log(`Generated (en): ${enPost.path}`);
  });

  // Generate short notes (Finnish only)
  shortNotes.forEach(topic => {
    const fiPost = generatePost(topic, 'fi');
    console.log(`Generated short note (fi): ${fiPost.path}`);
    
    // Generate English version if available
    if (topic.title.en && topic.description.en) {
      const enPost = generatePost(topic, 'en');
      console.log(`Generated short note (en): ${enPost.path}`);
    }
  });

  // Generate location posts
  locationPosts.forEach(topic => {
    // Generate Finnish version
    const fiPost = generatePost(topic, 'fi');
    console.log(`Generated (fi): ${fiPost.path}`);

    // Generate English version
    const enPost = generatePost(topic, 'en');
    console.log(`Generated (en): ${enPost.path}`);
  });

  // Generate tech guides
  techGuides.forEach(topic => {
    // Generate Finnish version
    const fiPost = generatePost(topic, 'fi');
    console.log(`Generated (fi): ${fiPost.path}`);

    // Generate English version
    const enPost = generatePost(topic, 'en');
    console.log(`Generated (en): ${enPost.path}`);
  });

  // Generate city guides
  cityGuides.forEach(topic => {
    // Generate Finnish version
    const fiPost = generatePost(topic, 'fi');
    console.log(`Generated (fi): ${fiPost.path}`);

    // Generate English version if available
    if (topic.title.en && topic.description.en) {
      const enPost = generatePost(topic, 'en');
      console.log(`Generated (en): ${enPost.path}`);
    }
  });
}

// Run the generator
console.log('Generating blog posts...\n');
generateAllPosts();
