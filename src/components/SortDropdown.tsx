import React from 'react';

export type SortOrder = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

interface SortDropdownProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-sm font-medium text-slate-400">
        Sort by:
      </label>
      <select
        id="sort-by"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        className="bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-lime-500"
      >
        <option value="default">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Alphabetical (A-Z)</option>
      </select>
    </div>
  );
};