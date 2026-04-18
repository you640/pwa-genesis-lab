import React, { useState, useMemo, useEffect } from 'react';
import { Product, PageRoute } from '../types';
import { ProductDisplayCard } from './ProductDisplayCard';
import { NotFound } from './NotFound';
import { FilterSidebar } from './FilterSidebar';
import { SortDropdown, SortOrder } from './SortDropdown';

interface ProductListPageProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (route: PageRoute, slug?: string | null) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ title, products, onAddToCart, onQuickView, onNavigate, wishlist, onToggleWishlist }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 500; // A reasonable default max
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [products]);

  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  // When the list of products changes (e.g., navigating to a new category),
  // reset the max price slider to the new maximum.
  useEffect(() => {
    setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);

  const resetFilters = () => {
    setInStockOnly(false);
    setMaxPrice(maxProductPrice);
    setSortOrder('default');
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply filters
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }
    
    result = result.filter(p => p.price <= maxPrice);

    // Apply sorting
    switch (sortOrder) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'default' order is the order from the API
        break;
    }

    return result;
  }, [products, sortOrder, inStockOnly, maxPrice]);

  return (
    <main className="bg-[#0c0c0c] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between mb-8">
            <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 text-center lg:text-left">
            {title}
            </h1>
            <div className="mt-4 lg:mt-0 flex justify-center lg:justify-end">
                <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block">
            <FilterSidebar 
                products={products}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                resetFilters={resetFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
             {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 gap-x-8">
                    {filteredAndSortedProducts.map((product, i) => (
                    <ProductDisplayCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} index={i} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
                    ))}
                </div>
                ) : (
                <NotFound 
                    title="No Products Found"
                    message="There are currently no products matching your selection. Try adjusting your filters or check back later."
                    onCtaClick={resetFilters}
                    ctaText="Reset Filters"
                    />
                )}
          </div>
        </div>
      </div>
    </main>
  );
};