import React from 'react';

export const ProductTableSkeleton: React.FC = () => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse">
        <table className="w-full text-left">
            <thead className="bg-slate-900">
                <tr>
                    {['ID', 'Name', 'Price', 'Stock', 'Status', 'Actions'].map((header, i) => (
                        <th key={i} className="px-6 py-3">
                            <div className="h-3 bg-slate-700 rounded w-16"></div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-12"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-5 bg-slate-700 rounded-full w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-24"></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const CustomerTableSkeleton: React.FC = () => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse">
        <table className="w-full text-left">
            <thead className="bg-slate-900">
                <tr>
                    {['Name', 'Email', 'Total Spent', 'Last Order'].map((header, i) => (
                        <th key={i} className="px-6 py-3">
                            <div className="h-3 bg-slate-700 rounded w-20"></div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-40"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-3 bg-slate-700 rounded w-24"></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const StatsCardSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 animate-pulse">
        <div className="h-3 bg-slate-700 rounded w-24 mb-3"></div>
        <div className="h-8 bg-slate-700 rounded w-16"></div>
    </div>
);
