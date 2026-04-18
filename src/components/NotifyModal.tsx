import React, { useState, FormEvent } from 'react';
import { Product } from '../types';

interface NotifyModalProps {
  product: Product | null;
  onClose: () => void;
  showToast: (message: string) => void;
}

export const NotifyModal: React.FC<NotifyModalProps> = ({ product, onClose, showToast }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (product && email) {
      // In a real app, you'd send this to your backend.
      console.log(`Notification request for ${product.name} from ${email}`);
      showToast(`Success! We will notify you at ${email} when ${product.name} is back in stock.`);
      onClose();
    }
  };
  
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-modal-title"
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 w-full max-w-md m-4 transform transition-all duration-300 ease-out animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="text-center">
                 <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg mx-auto mb-4 border-2 border-slate-700"/>
                <h2 id="notify-modal-title" className="font-teko text-4xl text-lime-400">Back In Stock Alert</h2>
                <p className="text-slate-300 mt-2">
                    Enter your email below to be notified when <strong>{product.name}</strong> is available again.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                     <div>
                        <label htmlFor="notify-email" className="sr-only">Email address</label>
                        <input
                            id="notify-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="your.email@example.com"
                            className="py-3 px-4 block w-full shadow-sm bg-slate-800 border border-slate-700 rounded-md focus:ring-lime-500 focus:border-lime-500 text-white text-center"
                        />
                    </div>
                    <button type="submit" className="btn-3d primary w-full text-base py-3">
                        Notify Me
                    </button>
                </form>
            </div>
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
      `}</style>
    </div>
  );
};