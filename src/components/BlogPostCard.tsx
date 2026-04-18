import React from 'react';
import { BlogPost } from '../types';

interface BlogPostCardProps {
    post: BlogPost;
    onClick: () => void;
    index: number;
}

const _BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick, index }) => (
    <div 
      className="group relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-lime-500 transition-all duration-300 animate-fade-in-stagger"
      style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="relative aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-teko text-3xl text-slate-100 group-hover:text-lime-400 transition-colors">{post.title}</h3>
            <p className="text-sm text-slate-400 mt-1">By {post.author} on {post.date}</p>
            <p className="text-slate-300 mt-4 flex-grow">{post.excerpt}</p>
            <div className="mt-6">
                <button onClick={onClick} className="font-semibold text-lime-400 hover:text-lime-300 transition-colors">
                    Read Protocol &rarr;
                </button>
            </div>
        </div>
    </div>
);


export const BlogPostCard = React.memo(_BlogPostCard);