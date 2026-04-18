import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { eShopService } from '../services/eShopService';
import { ProductDisplayCard } from './ProductDisplayCard';
import { ProductDisplayCardSkeleton } from './skeletons/ProductDisplayCardSkeleton';
import { GeminiButton } from './GeminiButton';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuickAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenNotifyModal: (product: Product) => void;
}

const ProductJsonLd: React.FC<{ product: Product }> = ({ product }) => {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.manufacturer || 'THE FORGE',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href, // Current page URL
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, onQuickAddToCart, onQuickView, wishlist, onToggleWishlist, onOpenNotifyModal }) => {
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  const isWishlisted = wishlist.includes(product.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRelated = async () => {
      setIsLoadingRelated(true);
      const related = await eShopService.fetchRelatedProducts(product);
      setRelatedProducts(related);
      setIsLoadingRelated(false);
    };

    fetchRelated();
    setQuantity(1);
  }, [product]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <>
      <main className="bg-[#0c0c0c] py-12 sm:py-16">
        <ProductJsonLd product={product} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 md:p-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Image gallery */}
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center rounded-lg"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/0c0c0c/e5e7eb?text=No+Image'; }}
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Product info */}
            <div className="mt-8 lg:mt-0 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-teko text-4xl md:text-5xl font-bold text-lime-400 flex-1">{product.name}</h1>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex-shrink-0"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-lime-400' : 'text-slate-400 hover:text-white'}`}>
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9-22.045 22.045 0 01-2.582-1.901 20.758 20.758 0 01-1.162-.682A4.5 4.5 0 012 10.337V5.5a4.5 4.5 0 014.5-4.5h3.663a4.5 4.5 0 014.5 4.5v4.837a4.5 4.5 0 01-1.348 3.166l-1.162.682a22.045 22.045 0 01-2.582 1.901 22.045 22.045 0 01-2.582 1.9l-.019.01-.005.003h-.002z" />
                  </svg>
                </button>
              </div>
              <p className="text-3xl text-white mt-2">${product.price.toFixed(2)}</p>

              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mt-6 text-slate-300 space-y-4">
                <p>{product.description}</p>
              </div>

              <div className="mt-auto pt-8">
                {product.inStock ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <button onClick={() => handleQuantityChange(-1)} className="btn-3d rounded-l-md rounded-r-none px-4 py-3 text-lime-400" aria-label="Decrease quantity">-</button>
                      <span className="px-4 py-3 font-bold text-white w-16 text-center bg-slate-800 border-y border-slate-700" aria-live="polite">{quantity}</span>
                      <button onClick={() => handleQuantityChange(1)} className="btn-3d rounded-r-md rounded-l-none px-4 py-3 text-lime-400" aria-label="Increase quantity">+</button>
                    </div>
                    <GeminiButton
                      onClick={handleAddToCartClick}
                      size="lg"
                      className="flex-1"
                    >
                      🛒 Add to Cart
                    </GeminiButton>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenNotifyModal(product)}
                    className="btn-3d w-full py-3 px-6"
                  >
                    Notify Me When Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="py-16 sm:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-teko text-5xl font-bold text-center uppercase text-white">You Might Also Like</h2>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {isLoadingRelated ? (
              Array.from({ length: 4 }).map((_, i) => <ProductDisplayCardSkeleton key={i} />)
            ) : (
              relatedProducts.map((related, i) => (
                <ProductDisplayCard key={related.id} product={related} onAddToCart={onQuickAddToCart} onQuickView={onQuickView} index={i} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};