import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onQuickView(product);
    }
  };

  return (
    <div className="group bg-slate-700 rounded-lg overflow-hidden border border-slate-600 transition-all duration-300 hover:shadow-lg hover:border-lime-400 flex flex-col justify-between h-full">
      <div 
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400 rounded-t-lg"
        onClick={() => onQuickView(product)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
      >
        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover"/>
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-bold text-sm text-lime-300">{product.name}</h3>
          <p className="text-xs text-slate-300 mt-1 flex-grow">{product.description}</p>
        </div>
      </div>
       <div className="p-3 pt-0">
        {(product.color || product.weight) && (
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            {product.color && <span>{product.color}</span>}
            {product.weight && <span>{product.weight}</span>}
          </div>
        )}
        <div className="text-right font-semibold text-white text-sm">
          ${product.price.toFixed(2)}
        </div>
        <div className="h-9 mt-2 flex items-center">
          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-lime-500 text-slate-900 font-bold py-1 px-3 text-sm rounded-md hover:bg-lime-600 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};