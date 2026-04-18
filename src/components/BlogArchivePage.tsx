import React from 'react';
import { BlogPost, PageRoute } from '../types';
import { BlogPostCard } from './BlogPostCard';

interface BlogArchivePageProps {
  posts: BlogPost[];
  onNavigate: (route: PageRoute, slug?: string | null) => void;
}

export const BlogArchivePage: React.FC<BlogArchivePageProps> = ({ posts, onNavigate }) => {
  return (
    <main className="bg-[#0c0c0c] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400">
                The Forge Protocols
            </h1>
            <p className="mt-2 text-lg text-slate-400 max-w-3xl mx-auto">
                In-depth articles on elite training, nutrition, and supplement science. This is the blueprint for building a legend.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <BlogPostCard 
              key={post.id} 
              post={post} 
              onClick={() => onNavigate('blog-post', post.slug)} 
              index={i}
            />
          ))}
        </div>
      </div>
    </main>
  );
};