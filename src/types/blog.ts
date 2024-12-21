export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  language: 'fi' | 'en';
  keyTerms?: {
    fi: string[];
    en: string[];
  };
  excerpt?: string;
  image?: {
    src: string;
    alt: string;
  };
}

export interface BlogListResponse {
  posts: BlogPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export type Language = 'fi' | 'en';

export interface KeyTerms {
  fi: string[];
  en: string[];
}
