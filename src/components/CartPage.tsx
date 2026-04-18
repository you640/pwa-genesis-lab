import React, { useState, FormEvent } from 'react';
import { CartItem, Discount, PageRoute } from '../types';
import { NotFound } from './NotFound';
import { GeminiButton } from './GeminiButton';

interface CartPageProps {
    cart: CartItem[];
    discount: Discount | null;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onApplyDiscountCode: (code: string) => Promise<void>;
    onCheckout: () => void;
    onNavigate: (route: PageRoute, slug?: string | null) => void;
}

const CartItemRow: React.FC<{
    item: CartItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onNavigate: (route: PageRoute, slug?: string | null) => void;
}> = ({ item, onUpdateQuantity, onRemoveItem, onNavigate }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-b border-slate-800">
        <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg cursor-pointer flex-shrink-0"
            onClick={() => onNavigate('product', item.product.id)}
        />
        <div className="flex-grow text-center sm:text-left">
            <button onClick={() => onNavigate('product', item.product.id)} className="text-left w-full">
                <h3 className="text-lg font-bold text-slate-100 hover:text-lime-400 transition-colors">{item.product.name}</h3>
            </button>
            <p className="text-sm text-slate-400">${item.product.price.toFixed(2)} each</p>
            <button onClick={() => onRemoveItem(item.product.id)} className="text-sm text-red-500 hover:text-red-400 mt-2">
                Remove
            </button>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="btn-3d-round-sm w-8 h-8 text-lg">-</button>
            <span className="font-bold text-white w-10 text-center text-lg">{item.quantity}</span>
            <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="btn-3d-round-sm w-8 h-8 text-lg">+</button>
        </div>
        <div className="w-28 text-right">
            <p className="text-lg font-semibold text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
        </div>
    </div>
);

export const CartPage: React.FC<CartPageProps> = ({ cart, discount, onUpdateQuantity, onRemoveItem, onApplyDiscountCode, onCheckout, onNavigate }) => {
    const [discountCode, setDiscountCode] = useState('');

    const handleDiscountSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (discountCode.trim()) {
            onApplyDiscountCode(discountCode);
            setDiscountCode('');
        }
    };

    if (cart.length === 0) {
        return (
            <main className="bg-[#0c0c0c] py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <NotFound
                        title="Your Forge is Empty"
                        message="Looks like you haven't added any gear to your cart yet. It's time to forge your legend."
                        ctaText="Browse Products"
                        onCtaClick={() => onNavigate('category', 'all')}
                    />
                </div>
            </main>
        );
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountAmount = discount ? subtotal * (discount.percentage / 100) : 0;
    const total = subtotal - discountAmount;

    return (
        <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 mb-8 text-center lg:text-left">
                    Shopping Cart
                </h1>

                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2">
                        {cart.map(item => (
                            <CartItemRow
                                key={item.product.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemoveItem={onRemoveItem}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </div>

                    <aside className="lg:col-span-1 mt-12 lg:mt-0">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 lg:sticky lg:top-28">
                            <h2 className="font-teko text-3xl text-white uppercase border-b border-slate-700 pb-4">
                                Order Summary
                            </h2>
                            <div className="mt-6 space-y-4 text-slate-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({discount.code} - {discount.percentage}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-2xl font-bold text-white border-t border-slate-700 pt-4">
                                    <span>Total</span>
                                    <span className="text-lime-400">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <form onSubmit={handleDiscountSubmit} className="mt-8">
                                <label htmlFor="discount-code" className="block text-sm font-medium text-slate-400">
                                    Discount Code
                                </label>
                                <div className="mt-1 flex group">
                                    <input
                                        type="text"
                                        id="discount-code"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                                        placeholder="FORGE10"
                                    />
                                    <button type="submit" className="bg-slate-700 text-lime-400 font-bold px-4 py-2 rounded-r-md hover:bg-slate-600 transition-colors group-focus-within:ring-2 group-focus-within:ring-lime-500">
                                        Apply
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8">
                                <GeminiButton
                                    onClick={onCheckout}
                                    size="lg"
                                    fullWidth
                                >
                                    💳 Proceed to Checkout
                                </GeminiButton>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};