import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Article, ArticleFrontmatter } from '@/types/article';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  // Get file names under /content/articles
  const fileNames = fs.readdirSync(articlesDirectory);

  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".mdx" from file name to get slug
      const slug = fileName.replace(/\.mdx$/, '');

      // Read markdown file as string
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);

      // Calculate reading time
      const stats = readingTime(content);

      return {
        slug,
        content,
        ...(data as ArticleFrontmatter),
        readingTime: stats.text,
      };
    });

  // Sort articles by date (newest first)
  return allArticles.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      content,
      ...(data as ArticleFrontmatter),
      readingTime: stats.text,
    };
  } catch (error) {
    return null;
  }
}

export function getArticlesByTag(tag: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const allArticles = getAllArticles();
  const tags = new Set<string>();

  allArticles.forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const allArticles = getAllArticles();

  // Filter out current article and calculate relevance score
  const scoredArticles = allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      // Score based on shared tags
      const sharedTags = article.tags.filter((tag) =>
        currentArticle.tags.includes(tag)
      );
      return {
        article,
        score: sharedTags.length,
      };
    })
    .filter((item) => item.score > 0) // Only articles with at least one shared tag
    .sort((a, b) => b.score - a.score); // Sort by score descending

  // Return top articles by score, then by date
  return scoredArticles.slice(0, limit).map((item) => item.article);
}
