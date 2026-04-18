import React from 'react';

const prompts = [
    "Show me some supplements",
    "What are your best sellers?",
    "Compare Masteron vs Winstrol",
    "What's in my cart?",
];

interface SuggestedPromptsProps {
    onPromptClick: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onPromptClick }) => {
    return (
        <div className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-2">
                {prompts.map(prompt => (
                    <button
                        key={prompt}
                        onClick={() => onPromptClick(prompt)}
                        className="text-left text-sm text-slate-200 bg-slate-700/50 hover:bg-slate-700 p-3 rounded-md transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
