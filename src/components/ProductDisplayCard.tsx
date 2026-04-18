import React from 'react';
import { Product } from '../types';

interface ProductDisplayCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onQuickView: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
    index?: number;
}

const _ProductDisplayCard: React.FC<ProductDisplayCardProps> = ({ product, onAddToCart, onQuickView, wishlist, onToggleWishlist, index }) => {
    const isWishlisted = wishlist.includes(product.id);
    
    return (
        <div 
            className="group relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-lime-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-lime-500/10 animate-fade-in-stagger"
            style={{ animationDelay: `${(index || 0) * 80}ms` }}
        >
          <div className="relative">
            <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/0c0c0c/e5e7eb?text=No+Image'; }}
                loading="lazy"
                decoding="async"
              />
              {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="font-teko text-2xl text-red-500 uppercase tracking-widest">Out of Stock</span>
                  </div>
              )}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/50 hover:bg-slate-800 transition-colors"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-lime-400' : 'text-slate-400 hover:text-white'}`}>
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-22.045 22.045 0 01-2.582-1.901 20.758 20.758 0 01-1.162-.682A4.5 4.5 0 012 10.337V5.5a4.5 4.5 0 014.5-4.5h3.663a4.5 4.5 0 014.5 4.5v4.837a4.5 4.5 0 01-1.348 3.166l-1.162.682a22.045 22.045 0 01-2.582 1.901 22.045 22.045 0 01-2.582 1.9l-.019.01-.005.003h-.002z" />
                </svg>
            </button>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-slate-100 h-14">{product.name}</h3>
            {product.manufacturer && <p className="text-xs text-slate-500 font-semibold uppercase">{product.manufacturer}</p>}
            <div className="flex justify-between items-baseline mt-4">
              <p className="text-xl font-semibold text-lime-400">${product.price.toFixed(2)}</p>
              <button 
                onClick={() => onAddToCart(product)} 
                disabled={!product.inStock}
                className="btn-3d primary text-sm"
              >
                  {product.inStock ? 'Quick Add' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
    );
};

export const ProductDisplayCard = React.memo(_ProductDisplayCard);