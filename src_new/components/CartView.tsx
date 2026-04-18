import React from 'react';
import { CartItem, Discount, Product } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  discount?: Discount | null;
  onCheckout: () => void;
  onQuickView: (product: Product) => void;
}

export const CartView: React.FC<CartViewProps> = ({ items, onUpdateQuantity, onRemoveItem, discount, onCheckout, onQuickView }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = discount ? subtotal * (discount.percentage / 100) : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="bg-slate-700 text-slate-200 w-full max-w-md">
      <div className="p-4 border-b border-slate-600">
        <h3 className="font-bold text-lg text-lime-400">Your Cart</h3>
      </div>
      <div className="p-4 max-h-64 overflow-y-auto">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 py-3 border-b border-slate-600 last:border-b-0">
              <button 
                onClick={() => onQuickView(item.product)} 
                className="flex items-center gap-4 text-left group focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-slate-700 rounded-lg flex-grow"
                aria-label={`View details for ${item.product.name}`}
              >
                <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0"/>
                <div className="flex-grow">
                    <p className="font-semibold text-sm group-hover:text-lime-400 transition-colors">{item.product.name}</p>
                    <p className="text-xs text-slate-400">${item.product.price.toFixed(2)}</p>
                </div>
              </button>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button aria-label={`Decrease quantity of ${item.product.name}`} onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="btn-3d-round-sm">-</button>
                <span>{item.quantity}</span>
                <button aria-label={`Increase quantity of ${item.product.name}`} onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="btn-3d-round-sm">+</button>
              </div>
              <button onClick={() => onRemoveItem(item.product.id)} className="text-slate-500 hover:text-red-500 flex-shrink-0" aria-label={`Remove ${item.product.name} from cart`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-center py-8">
            <p className="font-semibold text-lg">Your Forge is empty.</p>
            <p className="text-sm mt-1">Add some gear to start building your legend.</p>
          </div>
        )}
      </div>
       <div className="p-4 bg-slate-800 rounded-b-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Subtotal:</span>
              <span className="text-slate-300">${subtotal.toFixed(2)}</span>
            </div>
            {discount && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Discount ({discount.code}):</span>
                <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold border-t border-slate-700 pt-2 mt-2">
              <span className="text-slate-300 text-lg">Total:</span>
              <span className="font-teko text-lime-400 text-3xl">${total.toFixed(2)}</span>
            </div>
          </div>
          {items.length > 0 && (
            <div className="mt-4">
              <button 
                onClick={onCheckout}
                className="btn-3d primary w-full py-3 px-4"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
    </div>
  );
};
