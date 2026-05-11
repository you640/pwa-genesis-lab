import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="font-teko text-5xl text-yellow-400 uppercase mb-4">Payment cancelled</h1>
        <p className="text-slate-300 mb-8">Your order is on hold. Try again or contact support if you need help.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/checkout" className="bg-lime-500 text-slate-900 font-bold px-6 py-3 rounded-md hover:bg-lime-400">Retry checkout</Link>
          <Link to="/cart" className="bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700">Back to cart</Link>
        </div>
      </div>
    </main>
  );
}
