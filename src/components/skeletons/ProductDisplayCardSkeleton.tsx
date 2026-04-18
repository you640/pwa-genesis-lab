import React from 'react';

export const ProductDisplayCardSkeleton: React.FC = () => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col animate-pulse">
      <div className="relative aspect-w-1 aspect-h-1 w-full bg-slate-800"></div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-slate-800 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-800 rounded-md w-1/3 mt-2"></div>
        <div className="flex justify-between items-baseline mt-4">
          <div className="h-7 bg-slate-800 rounded-md w-1/4"></div>
          <div className="h-10 bg-slate-800 rounded-md w-1/2"></div>
        </div>
      </div>
    </div>
);
