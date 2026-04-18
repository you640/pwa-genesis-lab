import React, { useState, useEffect } from 'react';
import { PageRoute, Product } from '../types';
import { eShopService } from '../services/eShopService';
import { ProductTableSkeleton, CustomerTableSkeleton, StatsCardSkeleton } from './skeletons/DashboardSkeletons';
import { GeminiButton } from './GeminiButton';

interface DashboardPageProps {
    onNavigate: (route: PageRoute, slug?: string | null) => void;
    showToast: (message: string) => void;
}

type DashboardTab = 'overview' | 'products' | 'customers' | 'email' | 'database';

type ConnectionStatus = 'connected' | 'disconnected' | 'retrying';

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, showToast }) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const [products, setProducts] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
    const [lastError, setLastError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Email form state
    const [emailTo, setEmailTo] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Database export/import state
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // RETRY MECHANISM: Auto-retry after 5 seconds on failure
    useEffect(() => {
        if (connectionStatus === 'retrying') {
            const timer = setTimeout(() => {
                console.log(`🔄 Retry attempt ${retryCount + 1}...`);
                loadData();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [connectionStatus, retryCount]);

    const loadData = async () => {
        setIsLoading(true);
        setLastError(null);

        try {
            // Fetch products from backend
            const productsRes = await fetch('http://localhost:3001/api/products');

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData);
                setConnectionStatus('connected');
                setRetryCount(0);
                console.log('✅ Products loaded successfully');
            } else {
                throw new Error(`Backend returned ${productsRes.status}: ${productsRes.statusText}`);
            }

            // Fetch customers from backend
            const customersRes = await fetch('http://localhost:3001/api/customers');
            if (customersRes.ok) {
                const customersData = await customersRes.json();
                setCustomers(customersData);
                console.log('✅ Customers loaded successfully');
            }
        } catch (error: any) {
            console.error("❌ Failed to fetch data from backend:", error.message);
            setLastError(error.message);
            setConnectionStatus('disconnected');

            // Fallback to mock data
            const allProducts = await eShopService.fetchProductsByFilter({ type: 'category', value: 'all' });
            setProducts(allProducts);

            // Auto-retry logic
            if (retryCount < 3) {
                setConnectionStatus('retrying');
                setRetryCount(prev => prev + 1);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            const res = await fetch('http://localhost:3001/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                setEmailTo('');
                setEmailSubject('');
                setEmailBody('');
            } else {
                showToast('Failed to send email');
            }
        } catch (error) {
            showToast('Error sending email (Backend offline?)');
        }
        setIsSending(false);
    };

    const handleExportDatabase = async () => {
        setIsExporting(true);
        setExportError(null);

        try {
            const res = await fetch('http://localhost:3001/api/database/export', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                showToast(`✅ Database exported: ${data.file} (${data.size})`);
                setExportError(null);
            } else {
                const errorMsg = `Export failed: ${data.error}`;
                setExportError(data.details || data.error);
                showToast(errorMsg);
                console.error('❌ Export Error Details:', data);
            }
        } catch (error: any) {
            const errorMsg = 'Error exporting database (Backend offline?)';
            setExportError(error.message);
            showToast(errorMsg);
            console.error('❌ Export Exception:', error);
        }
        setIsExporting(false);
    };

    const handleImportCustomers = async () => {
        setIsImporting(true);
        try {
            const res = await fetch('http://localhost:3001/api/database/import-customers', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showToast(data.message);
                // Refresh customers list
                const customersRes = await fetch('http://localhost:3001/api/customers');
                if (customersRes.ok) {
                    const customersData = await customersRes.json();
                    setCustomers(customersData);
                }
            } else {
                showToast('Failed to import customers: ' + data.error);
            }
        } catch (error) {
            showToast('Error importing customers (Backend offline?)');
        }
        setIsImporting(false);
    };

    // CONNECTION STATUS BANNER
    const renderConnectionStatus = () => {
        if (connectionStatus === 'connected') return null;

        return (
            <div className={`mb-6 p-4 rounded-lg border-2 flex items-start gap-3 ${connectionStatus === 'retrying'
                ? 'bg-yellow-500/10 border-yellow-500/50'
                : 'bg-red-500/10 border-red-500/50'
                }`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 flex-shrink-0 ${connectionStatus === 'retrying' ? 'text-yellow-400 animate-spin' : 'text-red-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {connectionStatus === 'retrying' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    )}
                </svg>
                <div className="flex-1">
                    <div className={`font-bold ${connectionStatus === 'retrying' ? 'text-yellow-300' : 'text-red-300'}`}>
                        {connectionStatus === 'retrying' ? '🔄 Reconnecting...' : '❌ Database Connection Lost'}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                        {connectionStatus === 'retrying'
                            ? `Retry attempt ${retryCount}/3 in progress...`
                            : lastError || 'Backend server is not responding'}
                    </div>
                    {connectionStatus === 'disconnected' && (
                        <button
                            onClick={() => {
                                setRetryCount(0);
                                setConnectionStatus('retrying');
                            }}
                            className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm font-medium transition-colors"
                        >
                            Retry Now
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderSidebar = () => (
        <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2">
            <div className="text-2xl font-teko text-lime-400 mb-6 px-4">ADMIN PANEL</div>
            <button
                onClick={() => setActiveTab('overview')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                Overview
            </button>
            <button
                onClick={() => setActiveTab('products')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'products' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                Products
            </button>
            <button
                onClick={() => setActiveTab('customers')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'customers' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                Customers (CRM)
            </button>
            <button
                onClick={() => setActiveTab('email')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'email' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                Email System
            </button>
            <button
                onClick={() => setActiveTab('database')}
                className={`text-left px-4 py-3 rounded-md transition-colors ${activeTab === 'database' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
                Database
            </button>
        </div>
    );

    const renderOverview = () => (
        <div className="space-y-6">
            {renderConnectionStatus()}
            <h2 className="text-3xl font-teko text-white">System Overview</h2>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-sm uppercase">Total Products</div>
                        <div className="text-4xl font-bold text-lime-400 mt-2">{products.length}</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-sm uppercase">Total Customers</div>
                        <div className="text-4xl font-bold text-blue-400 mt-2">{customers.length}</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <div className="text-slate-400 text-sm uppercase">Revenue</div>
                        <div className="text-4xl font-bold text-purple-400 mt-2">$142,590</div>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                            <div>
                                <div className="text-white font-medium">New Order #{1000 + i}</div>
                                <div className="text-slate-400 text-sm">Placed by Customer #{50 + i}</div>
                            </div>
                            <div className="text-slate-500 text-sm">2 mins ago</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="space-y-6">
            {renderConnectionStatus()}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-teko text-white">Product Management</h2>
                <GeminiButton
                    size="sm"
                    onClick={() => showToast('Create Product modal would open here')}
                >
                    + Add Product
                </GeminiButton>
            </div>

            {isLoading ? (
                <ProductTableSkeleton />
            ) : (
                <>
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {products.slice(0, 10).map((product: any) => (
                                    <tr key={product.id} className="hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.custom_id || product.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{product.name || product.title}</td>
                                        <td className="px-6 py-4 text-lime-400">${product.price}</td>
                                        <td className="px-6 py-4">
                                            {product.stock > 0 || product.inStock ? (
                                                <span className="text-green-400">In Stock ({product.stock})</span>
                                            ) : (
                                                <span className="text-red-400">Out of Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">{product.status || 'Active'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                                            <button className="text-red-400 hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="md:hidden space-y-4">
                        {products.slice(0, 10).map((product: any) => (
                            <div key={product.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-medium text-white text-lg">{product.name || product.title}</div>
                                        <div className="text-xs text-slate-500 font-mono">ID: {product.custom_id || product.id}</div>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">{product.status || 'Active'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <div className="text-xs text-slate-400">Price</div>
                                        <div className="text-lime-400 font-bold">${product.price}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400">Stock</div>
                                        <div className={product.stock > 0 || product.inStock ? 'text-green-400' : 'text-red-400'}>
                                            {product.stock > 0 || product.inStock ? `${product.stock} units` : 'Out of Stock'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30">Edit</button>
                                    <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    const renderCustomers = () => (
        <div className="space-y-6">
            {renderConnectionStatus()}
            <h2 className="text-3xl font-teko text-white">Customer CRM</h2>

            {isLoading ? (
                <CustomerTableSkeleton />
            ) : (
                <>
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Total Spent</th>
                                    <th className="px-6 py-3">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {customers.length > 0 ? customers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-white">{customer.name}</td>
                                        <td className="px-6 py-4">{customer.email}</td>
                                        <td className="px-6 py-4 text-lime-400">${customer.spent}</td>
                                        <td className="px-6 py-4 text-slate-400">{customer.last_order ? new Date(customer.last_order).toLocaleDateString() : 'Never'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            <div className="text-slate-500">No customers found</div>
                                            <div className="text-sm text-slate-600 mt-1">Import CSV data or check backend connection</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="md:hidden space-y-4">
                        {customers.length > 0 ? customers.map((customer: any) => (
                            <div key={customer.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="font-medium text-white text-lg mb-2">{customer.name}</div>
                                <div className="text-sm text-slate-400 mb-3">{customer.email}</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-slate-400">Total Spent</div>
                                        <div className="text-lime-400 font-bold">${customer.spent}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400">Last Order</div>
                                        <div className="text-slate-300">{customer.last_order ? new Date(customer.last_order).toLocaleDateString() : 'Never'}</div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                                <div className="text-slate-500">No customers found</div>
                                <div className="text-sm text-slate-600 mt-1">Import CSV data or check backend connection</div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );

    const renderEmail = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-teko text-white">Email System (SMTP)</h2>
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-2xl">
                <form onSubmit={handleSendEmail} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">To:</label>
                        <input
                            type="email"
                            required
                            value={emailTo}
                            onChange={e => setEmailTo(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                            placeholder="customer@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Subject:</label>
                        <input
                            type="text"
                            required
                            value={emailSubject}
                            onChange={e => setEmailSubject(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                            placeholder="Order Update"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Message:</label>
                        <textarea
                            required
                            value={emailBody}
                            onChange={e => setEmailBody(e.target.value)}
                            rows={6}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                            placeholder="Type your message here..."
                        />
                    </div>
                    <GeminiButton
                        onClick={(e: any) => { void handleSendEmail(e); }}
                        type="submit"
                        disabled={isSending}
                        fullWidth
                        size="lg"
                    >
                        {isSending ? '📧 Sending...' : '📧 Send Email'}
                    </GeminiButton>
                </form>
            </div>
        </div>
    );

    const renderDatabase = () => (
        <div className="space-y-6">
            {renderConnectionStatus()}
            <h2 className="text-3xl font-teko text-white">Database Management</h2>

            {exportError && (
                <div className="bg-red-500/10 border-2 border-red-500/50 p-4 rounded-lg">
                    <div className="font-bold text-red-300 mb-1">❌ Export Error</div>
                    <div className="text-sm text-slate-400 font-mono">{exportError}</div>
                </div>
            )}

            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-lg font-bold text-white">shop_production</div>
                        <div className="text-slate-400 text-sm">MySQL Database</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${connectionStatus === 'connected'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                        }`}>
                        {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-900 rounded border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1">Last Backup</div>
                        <div className="text-white font-mono">2023-11-24 02:00:00</div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1">Database Size</div>
                        <div className="text-white font-mono">42.5 MB</div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8">
                    <GeminiButton
                        onClick={handleExportDatabase}
                        disabled={isExporting}
                        variant="secondary"
                        size="lg"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        {isExporting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Database
                            </>
                        )}
                    </GeminiButton>

                    <GeminiButton
                        onClick={handleImportCustomers}
                        disabled={isImporting}
                        variant="primary"
                        size="lg"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        {isImporting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Importing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Import CSV
                            </>
                        )}
                    </GeminiButton>
                </div>
            </div>
        </div>
    );

    return (
        <main className="bg-[#0c0c0c] min-h-screen pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {renderSidebar()}
                    <div className="flex-1">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'products' && renderProducts()}
                        {activeTab === 'customers' && renderCustomers()}
                        {activeTab === 'email' && renderEmail()}
                        {activeTab === 'database' && renderDatabase()}
                    </div>
                </div>
            </div>
        </main>
    );
};
