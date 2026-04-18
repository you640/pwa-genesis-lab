import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchBarProps {
  onSearch: (query: string) => Promise<Product[]>;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAddToCart, onQuickView }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    const searchResults = await onSearch(searchQuery);
    setResults(searchResults);
    setShowResults(true);
    setIsSearching(false);
  }, [onSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(query);
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [query, performSearch]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);


  const handleProductAdded = (product: Product) => {
      onAddToCart(product);
      setQuery(''); 
      setShowResults(false);
  };
  
  const handleQuickView = (product: Product) => {
      onQuickView(product);
      setQuery('');
      setShowResults(false);
  };

  return (
    <div className="relative px-4 pb-2" ref={searchRef}>
      <div className="flex items-center bg-slate-900 rounded-md p-2 border border-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500 mr-2">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
        />
      </div>
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-10 mx-4 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
           {isSearching ? (
             <div className="flex justify-center items-center p-4">
               <div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : results.length > 0 ? (
             <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {results.map(product => (
                      <ProductCard key={product.id} product={product} onAddToCart={handleProductAdded} onQuickView={handleQuickView} />
                  ))}
             </div>
           ) : (
             <div className="p-4 text-center text-slate-400">
                No results found.
             </div>
           )}
        </div>
      )}
    </div>
  );
};
