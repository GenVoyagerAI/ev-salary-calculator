import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/articles/Breadcrumbs';
import ReadingProgress from '@/components/articles/ReadingProgress';
import ShareButtons from '@/components/articles/ShareButtons';
import TableOfContents from '@/components/articles/TableOfContents';
import RelatedArticles from '@/components/articles/RelatedArticles';
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/lib/articles';
import { Calendar, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { TableOfContentsItem } from '@/types/article';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found - SalSacEV',
    };
  }

  return {
    title: `${article.title} - SalSacEV`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author.name],
      tags: article.tags,
    },
    alternates: {
      canonical: `https://www.salsacev.com/articles/${article.slug}`,
    },
  };
}

// Extract headings from markdown content for table of contents
function extractHeadings(content: string): TableOfContentsItem[] {
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].indexOf(' ');
    const title = match[1];
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({ id, title, level });
  }

  return headings;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug);
  const tableOfContents = extractHeadings(article.content);
  const articleUrl = `https://www.salsacev.com/articles/${article.slug}`;

  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ReadingProgress />

      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container-1440 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 mt-8 text-white">
            <div className="flex items-center space-x-2">
              {article.author.avatar ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 text-sm font-bold border-2 border-white">
                  {article.author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{article.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 pt-8">
        <div className="container-1440">
          <Breadcrumbs
            items={[
              { label: 'Articles', href: '/articles' },
              { label: article.title },
            ]}
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="container-1440 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <TableOfContents items={tableOfContents} />
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-7 bg-white rounded-lg p-8 md:p-12 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <MDXRemote
                source={article.content}
                options={{
                  mdxOptions: {
                    rehypePlugins: [],
                  },
                }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar - Share Buttons */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24">
              <ShareButtons title={article.title} url={articleUrl} />
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </div>

      <Footer />
    </div>
  );
}
