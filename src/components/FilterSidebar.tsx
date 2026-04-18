import React, { useMemo } from 'react';
import { Product } from '../types';

interface FilterSidebarProps {
  products: Product[];
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  resetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ products, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, resetFilters }) => {
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 500;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  return (
    <aside className="lg:w-64 lg:pr-8 lg:sticky lg:top-24 self-start">
      <h2 className="font-teko text-3xl text-white uppercase mb-4">Filters</h2>
      <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-lg p-6">
        {/* Price Filter */}
        <div>
          <label htmlFor="price-range" className="block text-sm font-medium text-slate-300">
            Max Price: <span className="font-bold text-lime-400">${maxPrice}</span>
          </label>
          <input
            id="price-range"
            type="range"
            min="0"
            max={maxProductPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mt-2 accent-lime-500"
          />
        </div>

        {/* Stock Filter */}
        <div className="flex items-center pt-4 border-t border-slate-700/50">
          <input
            id="in-stock"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 text-lime-500 bg-slate-800 focus:ring-lime-500"
          />
          <label htmlFor="in-stock" className="ml-3 text-sm text-slate-300">
            In Stock Only
          </label>
        </div>

        {/* Reset Button */}
         <div className="pt-4 border-t border-slate-700/50">
            <button
                onClick={resetFilters}
                className="w-full btn-3d text-sm"
                >
                Reset Filters
            </button>
        </div>
      </div>
    </aside>
  );
};