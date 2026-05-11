import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const orderId = params.get('order_id');

  useEffect(() => {
    if (sessionId && orderId) {
      // Best-effort verification ping (webhook will also handle it)
      supabase.functions.invoke('verify-payment', { body: { session_id: sessionId, order_id: orderId } }).catch(() => {});
    }
  }, [sessionId, orderId]);

  return (
    <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="font-teko text-5xl text-lime-400 uppercase mb-4">Payment successful</h1>
        <p className="text-slate-300 mb-8">Your order has been confirmed and is being prepared. You'll receive a confirmation email shortly.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/my-orders" className="bg-lime-500 text-slate-900 font-bold px-6 py-3 rounded-md hover:bg-lime-400">View my orders</Link>
          <Link to="/category/all" className="bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700">Continue shopping</Link>
        </div>
      </div>
    </main>
  );
}
