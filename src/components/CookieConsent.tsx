import React, { useEffect, useState } from 'react';

const KEY = 'cookie-consent-v1';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem(KEY)) setShow(true); }, []);
  if (!show) return null;
  const decide = (v: 'accepted' | 'rejected') => { localStorage.setItem(KEY, v); setShow(false); };
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-2xl">
      <p className="text-sm text-slate-200 mb-3">We use cookies to improve your experience and analyze site traffic. See our <a href="/privacy" className="text-lime-400 underline">Privacy Policy</a>.</p>
      <div className="flex gap-2">
        <button onClick={() => decide('rejected')} className="flex-1 px-3 py-2 text-sm bg-slate-700 text-white rounded hover:bg-slate-600">Reject</button>
        <button onClick={() => decide('accepted')} className="flex-1 px-3 py-2 text-sm bg-lime-400 text-slate-900 font-bold rounded hover:bg-lime-300">Accept</button>
      </div>
    </div>
  );
}
