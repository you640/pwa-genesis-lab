import React from 'react';
import { ProductDisplayCardSkeleton } from './skeletons/ProductDisplayCardSkeleton';
import { BlogPostCardSkeleton } from './skeletons/BlogPostCardSkeleton';

export const ProductListPageSkeleton: React.FC = () => (
    <div className="bg-[#0c0c0c] py-16 sm:py-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 bg-slate-800 rounded-md w-2/3 md:w-1/3 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductDisplayCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
);

export const ProductDetailPageSkeleton: React.FC = () => (
    <main className="bg-[#0c0c0c] py-12 sm:py-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 md:p-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="aspect-w-1 aspect-h-1 bg-slate-800 rounded-lg"></div>
          <div className="mt-8 lg:mt-0 flex flex-col">
            <div className="h-12 bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-8 bg-slate-800 rounded-md w-1/4 mt-4"></div>
            <div className="h-6 bg-slate-800 rounded-full w-24 mt-4"></div>
            <div className="mt-6 space-y-3">
              <div className="h-4 bg-slate-800 rounded-md w-full"></div>
              <div className="h-4 bg-slate-800 rounded-md w-full"></div>
              <div className="h-4 bg-slate-800 rounded-md w-2/3"></div>
            </div>
            <div className="mt-auto pt-8">
              <div className="h-14 bg-slate-800 rounded-md w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
);

export const BlogArchivePageSkeleton: React.FC = () => (
    <main className="bg-[#0c0c0c] py-16 sm:py-24 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <div className="h-14 bg-slate-800 rounded-md w-2/3 md:w-1/3 mx-auto"></div>
            <div className="mt-4 space-y-2 max-w-3xl mx-auto">
                <div className="h-4 bg-slate-800 rounded-md w-full"></div>
                <div className="h-4 bg-slate-800 rounded-md w-3/4 mx-auto"></div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogPostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
);

export const BlogPostPageSkeleton: React.FC = () => (
    <main className="bg-black py-16 sm:py-24 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12">
          <header className="border-b border-slate-700 pb-6 mb-8">
            <div className="h-12 bg-slate-800 rounded-md w-full"></div>
            <div className="h-10 bg-slate-800 rounded-md w-3/4 mt-2"></div>
            <div className="h-4 bg-slate-800 rounded-md w-1/3 mt-6"></div>
          </header>
          <div className="aspect-w-16 aspect-h-9 w-full rounded-lg bg-slate-800 mb-8"></div>
          <div className="space-y-4">
            <div className="h-5 bg-slate-800 rounded-md w-full"></div>
            <div className="h-5 bg-slate-800 rounded-md w-full"></div>
            <div className="h-5 bg-slate-800 rounded-md w-5/6"></div>
            <div className="h-12"></div>
            <div className="h-5 bg-slate-800 rounded-md w-1/3"></div>
            <div className="h-5 bg-slate-800 rounded-md w-full"></div>
            <div className="h-5 bg-slate-800 rounded-md w-3/4"></div>
          </div>
        </article>
      </div>
    </main>
);