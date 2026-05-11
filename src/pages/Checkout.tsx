import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { eShopService } from '@/services/eShopService';
import type { Discount } from '@/types';

type Step = 'address' | 'shipping' | 'payment' | 'review';

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard (5–10 days)', cost: 9.99 },
  { id: 'express', name: 'Express (2–3 days)', cost: 24.99 },
  { id: 'overnight', name: 'Overnight', cost: 49.99 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading, clearCart } = useCart();

  const [step, setStep] = useState<Step>('address');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');

  // Shipping & payment
  const [shippingId, setShippingId] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');

  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [discountMsg, setDiscountMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate(`/auth?redirect=${encodeURIComponent('/checkout')}`, { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.display_name && !name) setName(profile.display_name);
  }, [profile, name]);

  if (authLoading || cartLoading) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-teko text-4xl text-lime-400 uppercase mb-4">Cart is empty</h1>
          <Link to="/category/all" className="text-lime-400 underline">Browse products</Link>
        </div>
      </main>
    );
  }

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingId)?.cost || 0;
  const discountAmount = discount ? subtotal * (discount.percentage / 100) : 0;
  const total = subtotal - discountAmount + shippingCost;

  const applyDiscount = async () => {
    setDiscountMsg(null);
    const res = await eShopService.validateDiscountCode(discountCode);
    setDiscountMsg(res.message);
    if (res.success && res.discount) setDiscount(res.discount);
  };

  const placeOrder = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-order', {
        body: {
          items: cart.map((i) => ({ legacy_id: i.product.id, quantity: i.quantity })),
          shipping: { name, street, city, zip, country, phone },
          shipping_method: shippingId,
          shipping_cost: shippingCost,
          payment_method: paymentMethod,
          discount_code: discount?.code || null,
        },
      });
      if (fnError) throw new Error(fnError.message);
      if (!data?.order_id) throw new Error(data?.error || 'Failed to create order.');

      if (paymentMethod === 'stripe') {
        // Initiate Stripe checkout
        const { data: payData, error: payErr } = await supabase.functions.invoke('create-payment', {
          body: { order_id: data.order_id },
        });
        if (payErr) throw new Error(payErr.message);
        if (payData?.url) {
          window.location.href = payData.url;
          return;
        }
        throw new Error('Could not start payment.');
      }

      await clearCart();
      navigate(`/my-orders`, { replace: true });
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8 text-xs uppercase tracking-wide">
      {(['address', 'shipping', 'payment', 'review'] as Step[]).map((s, idx) => (
        <React.Fragment key={s}>
          <span className={step === s ? 'text-lime-400 font-bold' : 'text-slate-500'}>{idx + 1}. {s}</span>
          {idx < 3 && <span className="text-slate-700">›</span>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0c0c0c] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-teko text-5xl text-lime-400 uppercase mb-2">Checkout</h1>
        <StepIndicator />

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6">
            {step === 'address' && (
              <div className="space-y-4">
                <h2 className="font-teko text-2xl text-white uppercase">Shipping address</h2>
                <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input" placeholder="Street and number" value={street} onChange={(e) => setStreet(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className="input" placeholder="ZIP / postal" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
                <input className="input" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                <input className="input" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button
                  onClick={() => setStep('shipping')}
                  disabled={!name || !street || !city || !zip || !country}
                  className="btn-next"
                >Continue</button>
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-4">
                <h2 className="font-teko text-2xl text-white uppercase">Shipping method</h2>
                {SHIPPING_OPTIONS.map((opt) => (
                  <label key={opt.id} className={`flex justify-between items-center p-4 border rounded-md cursor-pointer ${shippingId === opt.id ? 'border-lime-500 bg-slate-800' : 'border-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingId === opt.id} onChange={() => setShippingId(opt.id)} />
                      <span>{opt.name}</span>
                    </div>
                    <span className="font-bold text-lime-400">${opt.cost.toFixed(2)}</span>
                  </label>
                ))}
                <div className="flex gap-3">
                  <button onClick={() => setStep('address')} className="btn-back">Back</button>
                  <button onClick={() => setStep('payment')} className="btn-next flex-1">Continue</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-4">
                <h2 className="font-teko text-2xl text-white uppercase">Payment method</h2>
                <label className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer ${paymentMethod === 'stripe' ? 'border-lime-500 bg-slate-800' : 'border-slate-700'}`}>
                  <input type="radio" name="pay" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                  <div>
                    <div className="font-semibold">Credit / Debit card</div>
                    <div className="text-xs text-slate-400">Secure payment via Stripe</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer ${paymentMethod === 'cod' ? 'border-lime-500 bg-slate-800' : 'border-slate-700'}`}>
                  <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <div>
                    <div className="font-semibold">Cash on delivery</div>
                    <div className="text-xs text-slate-400">Pay when your order arrives</div>
                  </div>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="btn-back">Back</button>
                  <button onClick={() => setStep('review')} className="btn-next flex-1">Continue</button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <h2 className="font-teko text-2xl text-white uppercase">Review</h2>
                <div className="text-sm text-slate-300 space-y-1">
                  <div><span className="text-slate-500">Ship to:</span> {name}, {street}, {city} {zip}, {country}</div>
                  <div><span className="text-slate-500">Method:</span> {SHIPPING_OPTIONS.find((o) => o.id === shippingId)?.name}</div>
                  <div><span className="text-slate-500">Pay:</span> {paymentMethod === 'stripe' ? 'Credit / Debit card' : 'Cash on delivery'}</div>
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="btn-back">Back</button>
                  <button onClick={placeOrder} disabled={submitting} className="btn-next flex-1">
                    {submitting ? 'Placing order…' : paymentMethod === 'stripe' ? 'Pay & place order' : 'Place order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 lg:sticky lg:top-8">
              <h3 className="font-teko text-2xl text-white uppercase mb-4 border-b border-slate-700 pb-2">Order</h3>
              <ul className="space-y-2 text-sm max-h-72 overflow-y-auto">
                {cart.map((i) => (
                  <li key={i.product.id} className="flex justify-between gap-2">
                    <span className="text-slate-300 truncate">{i.product.name} × {i.quantity}</span>
                    <span className="text-white">${(i.product.price * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount && <div className="flex justify-between text-green-400"><span>Discount {discount.code}</span><span>-${discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-800"><span>Total</span><span className="text-lime-400">${total.toFixed(2)}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <input className="input flex-1" placeholder="Discount code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value.toUpperCase())} />
                <button onClick={applyDiscount} className="bg-slate-700 hover:bg-slate-600 text-lime-400 font-bold px-3 rounded-md text-sm">Apply</button>
              </div>
              {discountMsg && <div className="text-xs mt-2 text-slate-400">{discountMsg}</div>}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .input { width: 100%; background: rgb(30 41 59); border: 1px solid rgb(51 65 85); color: white; padding: 0.625rem 1rem; border-radius: 0.375rem; outline: none; }
        .input:focus { box-shadow: 0 0 0 2px rgb(132 204 22); }
        .btn-next { background: rgb(132 204 22); color: rgb(15 23 42); font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 0.375rem; transition: background 0.2s; }
        .btn-next:hover:not(:disabled) { background: rgb(163 230 53); }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-back { background: rgb(30 41 59); color: white; padding: 0.75rem 1.5rem; border-radius: 0.375rem; }
      `}</style>
    </main>
  );
}
