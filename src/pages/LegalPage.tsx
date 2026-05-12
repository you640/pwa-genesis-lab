import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CONTENT: Record<string, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: `We respect your privacy. We collect only the information necessary to process your orders and improve our services: contact details, shipping address, order history and minimal analytics.

You can request export or deletion of your personal data at any time from your dashboard or by emailing privacy@example.com.

We never sell your personal data. We use cookies to remember your cart and preferences and (with consent) for anonymous analytics.`,
  },
  terms: {
    title: 'Terms of Service',
    body: `By using this website you agree to these terms. All products are sold "as is". Pricing, availability and specifications may change without notice.

You are responsible for the accuracy of the information you provide during checkout. Orders may be cancelled if fraudulent activity is detected.

Disputes are governed by the laws of the country in which the seller is registered.`,
  },
  refund: {
    title: 'Refund Policy',
    body: `Unopened items can be returned within 14 days of delivery for a full refund (excluding shipping). Return shipping is paid by the customer unless the item is defective.

Refunds are issued to the original payment method within 5–10 business days after we receive and inspect the returned item.`,
  },
  shipping: {
    title: 'Shipping Policy',
    body: `We ship worldwide. Standard delivery takes 5–10 business days, express 2–3 business days. You receive a tracking number by email once your order is dispatched.

Customs duties and import taxes are the responsibility of the customer and are not included in the order total.`,
  },
};

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = CONTENT[slug || ''] || { title: 'Not found', body: 'This page does not exist.' };
  return (
    <main className="min-h-screen bg-[#0c0c0c] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-lime-400 text-sm">← Home</Link>
        <h1 className="font-teko text-5xl text-lime-400 uppercase mt-4 mb-6">{data.title}</h1>
        <article className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line">{data.body}</article>
      </div>
    </main>
  );
}
