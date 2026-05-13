import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Discount } from '@/types';

const LS_DISCOUNT = 'appliedDiscount';

const readDiscount = (): Discount | null => {
  try { const r = localStorage.getItem(LS_DISCOUNT); return r ? JSON.parse(r) : null; } catch { return null; }
};

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const [discount, setDiscount] = useState<Discount | null>(readDiscount());
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discountAmount = discount ? subtotal * (discount.percentage / 100) : 0;
  const total = subtotal - discountAmount;

  const applyDiscount = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setApplying(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-discount', { body: { code: code.trim() } });
      if (error) throw error;
      if (!data?.success) {
        toast({ title: 'Invalid code', description: data?.message || 'Discount code is not valid', variant: 'destructive' });
        return;
      }
      setDiscount(data.discount);
      localStorage.setItem(LS_DISCOUNT, JSON.stringify(data.discount));
      toast({ title: 'Discount applied', description: data.message });
      setCode('');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setApplying(false);
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
    localStorage.removeItem(LS_DISCOUNT);
  };

  const handleCheckout = () => navigate('/checkout');

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-teko text-5xl uppercase text-lime-400 mb-4">Your Cart Is Empty</h1>
          <p className="text-slate-400 mb-8">Add some gear to get started.</p>
          <Link to="/" className="inline-block bg-lime-400 text-black font-bold px-8 py-3 rounded-md hover:bg-lime-300 transition">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c] py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-teko text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-lime-400 mb-8">
          Shopping Cart
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <section className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg p-4">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white">{item.product.name}</h3>
                  <p className="text-sm text-slate-400">€{item.product.price.toFixed(2)} each</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-sm text-red-400 hover:text-red-300 mt-2">
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">−</button>
                  <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded bg-slate-800 text-white hover:bg-slate-700">+</button>
                </div>
                <div className="w-24 text-right font-semibold text-white">
                  €{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </section>

          <aside className="mt-8 lg:mt-0">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 lg:sticky lg:top-28">
              <h2 className="font-teko text-3xl text-white uppercase border-b border-slate-700 pb-4">
                Order Summary
              </h2>
              <div className="mt-6 space-y-3 text-slate-300">
                <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
                {discount && (
                  <div className="flex justify-between text-green-400">
                    <span>
                      {discount.code} (−{discount.percentage}%)
                      <button onClick={removeDiscount} className="ml-2 text-xs text-red-400 hover:underline">remove</button>
                    </span>
                    <span>−€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-white border-t border-slate-700 pt-4">
                  <span>Total</span><span className="text-lime-400">€{total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={applyDiscount} className="mt-6">
                <label htmlFor="discount-code" className="block text-sm text-slate-400 mb-1">Discount Code</label>
                <div className="flex">
                  <input
                    id="discount-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="FORGE10"
                    className="flex-grow bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                  <button type="submit" disabled={applying} className="bg-slate-700 text-lime-400 font-bold px-4 rounded-r-md hover:bg-slate-600 disabled:opacity-50">
                    {applying ? '…' : 'Apply'}
                  </button>
                </div>
              </form>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full bg-lime-400 text-black font-bold py-3 rounded-md hover:bg-lime-300 transition"
              >
                Proceed to Checkout →
              </button>
              <Link to="/" className="block text-center text-sm text-slate-400 hover:text-lime-400 mt-4">
                ← Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
