import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 animate-pulse h-full">
      <div className="w-full h-32 bg-slate-600"></div>
      <div className="p-3">
        <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-600 rounded w-full mb-1"></div>
        <div className="h-3 bg-slate-600 rounded w-1/2"></div>
        <div className="h-9 mt-6"></div>
      </div>
    </div>
  );
};
