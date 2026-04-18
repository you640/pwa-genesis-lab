import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isActionLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isActionLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };
  
  const isDisabled = isLoading || isActionLoading;

  return (
    <div className="p-4 border-t border-slate-700">
      <div className="flex items-center bg-slate-700 rounded-md p-2 border border-slate-600">
        <input
          type="text"
          className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none px-2"
          placeholder="Ask about supplements or equipment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
        />
        <button
          onClick={handleSend}
          disabled={isDisabled}
          className="btn-3d primary p-0 transition-colors w-10 h-10 flex items-center justify-center rounded-lg"
          aria-label="Send message"
        >
          {isActionLoading ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-900 -rotate-45">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L10.999 7.55a.75.75 0 000-1.1l-6.43-3.161z" />
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L10.999 7.55a.75.75 0 000-1.1l-6.43-3.161zm-.43-1.036a1.5 1.5 0 011.652-1.9l6.43 3.161a1.5 1.5 0 010 2.2l-6.43 3.161a1.5 1.5 0 01-1.9-1.652l1.414-4.95z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
