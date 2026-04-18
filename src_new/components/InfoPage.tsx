import React from 'react';

interface InfoPageProps {
  title: string;
  content: string;
}

export const InfoPage: React.FC<InfoPageProps> = ({ title, content }) => {
  return (
    <main className="bg-black py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-slate-900 border border-slate-800 rounded-lg p-8 md:p-12">
          <header className="border-b border-slate-700 pb-6 mb-8">
            <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 leading-tight">
              {title}
            </h1>
          </header>

          <div 
            className="prose prose-lg prose-invert max-w-none 
                       prose-headings:font-teko prose-headings:text-lime-400 prose-headings:uppercase 
                       prose-strong:text-slate-100 
                       prose-a:text-lime-400 hover:prose-a:text-lime-300
                       prose-p:text-slate-300
                       prose-li:text-slate-300
                       prose-ul:text-slate-300
                       prose-ol:text-slate-300"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </article>
      </div>
    </main>
  );
};