import React from 'react';

export const BlogPostCardSkeleton: React.FC = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col animate-pulse">
        <div className="relative aspect-w-16 aspect-h-9 w-full bg-slate-800"></div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="h-8 bg-slate-800 rounded-md w-full"></div>
            <div className="h-4 bg-slate-800 rounded-md w-1/2 mt-3"></div>
            <div className="mt-4 space-y-2 flex-grow">
                <div className="h-4 bg-slate-800 rounded-md w-full"></div>
                <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
            </div>
            <div className="mt-6">
                 <div className="h-5 bg-slate-800 rounded-md w-1/3"></div>
            </div>
        </div>
    </div>
);
