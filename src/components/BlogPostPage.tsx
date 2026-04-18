import React from 'react';
import { BlogPost } from '../types';

interface BlogPostPageProps {
  post: BlogPost;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  return (
    <main className="bg-black py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12">
          <header className="border-b border-slate-700 pb-6 mb-8">
            <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 leading-tight">
              {post.title}
            </h1>
            <div className="mt-4 text-slate-400">
              <span>By {post.author}</span> &bull; <span>{post.date}</span>
            </div>
          </header>

          <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden mb-8">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover" 
              loading="lazy"
              decoding="async"
            />
          </div>

          <div 
            className="prose prose-lg prose-invert max-w-none 
                       prose-headings:font-teko prose-headings:text-lime-400 prose-headings:uppercase 
                       prose-strong:text-slate-100 
                       prose-a:text-lime-400 hover:prose-a:text-lime-300
                       prose-p:text-slate-300
                       prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </main>
  );
};