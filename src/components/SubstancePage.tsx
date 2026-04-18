import React from 'react';
import { Substance } from '../types';

interface SubstancePageProps {
  substance: Substance;
}

export const SubstancePage: React.FC<SubstancePageProps> = ({ substance }) => {
  return (
    <main className="bg-[#0c0c0c] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12">
          <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400">
            {substance.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4 border-b border-slate-700 pb-6 mb-6">
            {substance.seoKeywords.map(keyword => (
              <span key={keyword} className="bg-slate-800 text-lime-400 text-xs font-semibold px-3 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
          <div 
            className="prose prose-invert prose-headings:font-teko prose-headings:text-lime-400 prose-headings:uppercase prose-strong:text-slate-100 prose-a:text-lime-400 hover:prose-a:text-lime-300"
            dangerouslySetInnerHTML={{ __html: substance.content }} 
          />
        </div>
      </div>
    </main>
  );
};
