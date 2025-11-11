export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

export interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: Author;
  tags: string[];
  readingTime?: string;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  content: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}
