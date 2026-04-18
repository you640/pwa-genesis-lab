import React from 'react';

interface NotFoundProps {
    title: string;
    message: string;
    ctaText: string;
    onCtaClick: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ title, message, ctaText, onCtaClick }) => {
    return (
        <div className="text-center text-slate-400 py-20">
            <div className="flex justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center bg-slate-800 rounded-full border-2 border-slate-700">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-200">{title}</h2>
            <p className="mt-2 max-w-md mx-auto">{message}</p>
            <button
                onClick={onCtaClick}
                className="btn-3d primary mt-8"
            >
                {ctaText}
            </button>
        </div>
    );
};
