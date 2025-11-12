import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/articles/ArticleCard';
import { getAllArticles, getAllTags } from '@/lib/articles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles | EV Salary Sacrifice & BIK Tax Guides - SalSacEV',
  description: 'Expert articles and guides on EV salary sacrifice, BIK tax rates, electric company cars, and maximizing your tax savings in the UK.',
  alternates: {
    canonical: 'https://www.salsacev.com/articles',
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-black py-20">
        <div className="container-1440">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center">
            Articles
          </h1>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container-1440 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="container-1440 pb-16">
        <div className="flex justify-center items-center space-x-4 text-lg">
          {tags.map((tag, index) => (
            <span key={tag} className="flex items-center">
              <span className="font-medium">{tag}</span>
              {index < tags.length - 1 && (
                <span className="mx-4">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
