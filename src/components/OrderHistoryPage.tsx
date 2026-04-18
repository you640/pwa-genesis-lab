import React from 'react';
import { Order, PageRoute } from '../types';
import { NotFound } from './NotFound';

interface OrderHistoryPageProps {
    orders: Order[];
    onNavigate: (route: PageRoute, slug?: string | null) => void;
    showToast: (message: string) => void;
}

const getStatusChipClass = (status: Order['status']) => {
    switch (status) {
        case 'Processing':
            return 'bg-blue-500/20 text-blue-300';
        case 'Shipped':
            return 'bg-yellow-500/20 text-yellow-300';
        case 'Delivered':
            return 'bg-green-500/20 text-green-300';
        case 'Cancelled':
            return 'bg-red-500/20 text-red-300';
        default:
            return 'bg-slate-700 text-slate-300';
    }
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, onNavigate, showToast }) => {

    const handleViewDetails = () => {
        showToast('Feature to view order details is coming soon.');
    };

    return (
        <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase text-lime-400 mb-12 text-center lg:text-left">
                    My Order History
                </h1>

                {orders.length > 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                        <div className="hidden md:grid grid-cols-5 gap-4 font-bold text-slate-400 uppercase text-sm px-6 py-4 border-b border-slate-800">
                            <div>Order ID</div>
                            <div>Date</div>
                            <div className="text-right">Total</div>
                            <div className="text-center">Status</div>
                            <div></div>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {orders.map(order => (
                                <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-4 items-center">
                                    <div className="font-bold text-white">
                                        <span className="md:hidden text-slate-400 text-xs uppercase">Order ID: </span>
                                        #{order.id}
                                    </div>
                                    <div className="text-slate-300">
                                        <span className="md:hidden text-slate-400 text-xs uppercase">Date: </span>
                                        {new Date(order.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-right font-semibold text-lime-400">
                                        <span className="md:hidden text-slate-400 text-xs uppercase">Total: </span>
                                        ${order.total.toFixed(2)}
                                    </div>
                                    <div className="text-center">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusChipClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={handleViewDetails} className="btn-3d text-sm px-4 py-2">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <NotFound
                        title="No Orders Yet"
                        message="You have not placed any orders yet. Time to forge your legend!"
                        ctaText="Start Shopping"
                        onCtaClick={() => onNavigate('home')}
                    />
                )}
            </div>
        </main>
    );
};
