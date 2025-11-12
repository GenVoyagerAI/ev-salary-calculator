import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import { Calendar, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readingTime}</span>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            {article.author.avatar ? (
              <div className="relative w-8 h-8 rounded-full mr-3 overflow-hidden">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600 text-xs font-semibold">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {article.author.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
