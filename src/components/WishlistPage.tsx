import React, { useState, useEffect } from 'react';
import { Product, PageRoute } from '../types';
import { eShopService } from '../services/eShopService';
import { ProductDisplayCard } from './ProductDisplayCard';
import { NotFound } from './NotFound';
import { ProductListPageSkeleton } from './Skeletons';

interface WishlistPageProps {
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (route: PageRoute, slug?: string | null) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, onToggleWishlist, onAddToCart, onQuickView, onNavigate }) => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setIsLoading(true);
      const products = await eShopService.fetchProductsByIds(wishlist);
      setWishlistProducts(products);
      setIsLoading(false);
    };

    if (wishlist.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
      setIsLoading(false);
    }
  }, [wishlist]);
  
  if (isLoading) {
    return <ProductListPageSkeleton />;
  }

  return (
    <main className="bg-[#0c0c0c] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 text-center lg:text-left mb-12">
          My Wishlist
        </h1>
        
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
            {wishlistProducts.map((product, i) => (
              <ProductDisplayCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onQuickView={onQuickView} 
                index={i} 
                wishlist={wishlist} 
                onToggleWishlist={onToggleWishlist} 
              />
            ))}
          </div>
        ) : (
          <NotFound 
            title="Your Wishlist is Empty"
            message="Start exploring and add the gear that will define your legacy."
            onCtaClick={() => onNavigate('category', 'all')}
            ctaText="Browse All Products"
          />
        )}
      </div>
    </main>
  );
};