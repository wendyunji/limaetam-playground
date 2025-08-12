export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
  author?: string;
  coverImage?: string;
}

export interface PostMetadata {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  author?: string;
  coverImage?: string;
}