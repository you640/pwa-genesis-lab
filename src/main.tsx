import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './legacy-index.css';

const AuthPage = lazy(() => import('./pages/Auth'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancelledPage = lazy(() => import('./pages/PaymentCancelled'));
const AdminPage = lazy(() => import('./pages/Admin'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]">
    <div className="w-10 h-10 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="/*" element={<App />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
