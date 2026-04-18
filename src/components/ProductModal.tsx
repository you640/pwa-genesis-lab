import React from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-full max-w-2xl m-4 transform transition-all duration-300 ease-out animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4">
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white z-10" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="grid md:grid-cols-2 gap-6">
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg"/>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-lime-400">{product.name}</h2>
              <p className="text-lg font-semibold text-white mt-1">${product.price.toFixed(2)}</p>
              <p className="text-sm text-slate-300 mt-4 flex-grow">{product.description}</p>
              <div className="text-xs text-slate-400 mt-4 space-y-1">
                 {product.category && <p><span className="font-semibold text-slate-300">Category:</span> {product.category}</p>}
                 {product.color && <p><span className="font-semibold text-slate-300">Color:</span> {product.color}</p>}
                 {product.weight && <p><span className="font-semibold text-slate-300">Weight:</span> {product.weight}</p>}
                 {product.dimensions && <p><span className="font-semibold text-slate-300">Dimensions:</span> {product.dimensions}</p>}
              </div>
              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="btn-3d primary w-full mt-6 py-3 px-4"
              >
                Add to Cart
              </button>
            </div>
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
