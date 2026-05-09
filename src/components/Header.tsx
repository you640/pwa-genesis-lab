import React, { useState, useEffect, useRef, useCallback } from 'react';
import { substances } from '../services/substanceData';
import { PageRoute, Product, User, CartItem } from '../types';
import { eShopService } from '../services/eShopService';

interface HeaderProps {
    isScrolled: boolean;
    onOpenApiTester: () => void;
    onNavigate: (route: PageRoute, slug?: string | null) => void;
    user: User | null;
    cart: CartItem[];
    onOpenAuthModal: (type: 'login' | 'register') => void;
    onLogout: () => void;
}

// Utility to create a URL-friendly slug from a string
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const DiamondIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-lime-400 mr-2 flex-shrink-0 mt-1">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
);

const SearchResultCard: React.FC<{ product: Product; onSelect: (product: Product) => void; isActive: boolean; }> = ({ product, onSelect, isActive }) => {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (isActive) {
            ref.current?.scrollIntoView({ block: 'nearest' });
        }
    }, [isActive]);

    return (
        <button
            ref={ref}
            onClick={() => onSelect(product)}
            className={`flex items-center w-full p-2 text-left hover:bg-slate-800 transition-colors rounded-lg ${isActive ? 'search-result-active' : ''}`}
            aria-label={`View details for ${product.name}`}
        >
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/0c0c0c/e5e7eb?text=N/A'; }}
            />
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold text-slate-100 truncate">{product.name}</p>
                <p className="text-sm text-lime-400">${product.price.toFixed(2)}</p>
            </div>
        </button>
    );
};


export const Header: React.FC<HeaderProps> = ({ isScrolled, onOpenApiTester, onNavigate, user, onOpenAuthModal, onLogout, cart }) => {
    const [isManufacturersMenuOpen, setIsManufacturersMenuOpen] = useState(false);
    const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
    const [isSubstancesMenuOpen, setIsSubstancesMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [animateBadge, setAnimateBadge] = useState(false);

    // State and logic for search bar
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const substanceMenuRef = useRef<HTMLDivElement>(null);
    const manufacturerMenuRef = useRef<HTMLDivElement>(null);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const prevTotalItems = useRef(totalItems);

    // Effect to animate cart badge when items are added
    useEffect(() => {
        if (totalItems > prevTotalItems.current) {
            setAnimateBadge(true);
            const timer = setTimeout(() => setAnimateBadge(false), 300); // Corresponds to animation duration
            return () => clearTimeout(timer);
        }
        prevTotalItems.current = totalItems;
    }, [totalItems]);

    // Click outside handler for profile menu and mega menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
                setIsCategoriesMenuOpen(false);
            }
            if (substanceMenuRef.current && !substanceMenuRef.current.contains(event.target as Node)) {
                setIsSubstancesMenuOpen(false);
            }
            if (manufacturerMenuRef.current && !manufacturerMenuRef.current.contains(event.target as Node)) {
                setIsManufacturersMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }
        setIsSearching(true);
        const searchResults = await eShopService.searchProducts(searchQuery);
        setResults(searchResults);
        setShowResults(searchQuery.trim().length > 0);
        setIsSearching(false);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            performSearch(query);
        }, 300); // Debounce time

        return () => {
            clearTimeout(handler);
        };
    }, [query, performSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            handleNavigateAndCloseMenus('search', query.trim());
            setQuery('');
            setShowResults(false);
        } else if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    const handleProductSelectAndClear = (product: Product) => {
        onNavigate('product', product.id);
        setQuery('');
        setShowResults(false);
        setIsMobileMenuOpen(false);
    };

    const handleNavigateAndCloseMenus = (route: PageRoute, slug: string | null = null) => {
        onNavigate(route, slug);
        setIsCategoriesMenuOpen(false);
        setIsManufacturersMenuOpen(false);
        setIsSubstancesMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    const handleLogoutAndCloseMenus = () => {
        onLogout();
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
    }

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const MobileMenu = () => (
        <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Menu Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col animate-slide-in-right">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-teko text-3xl text-lime-400">MENU</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close menu">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div ref={searchRef} className="relative mb-6">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                            <svg className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                        </span>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 pl-10 pr-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                            placeholder="Search for gear..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => { if (query) setShowResults(true); }}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    {showResults && (
                        <div className="absolute top-full left-0 z-20 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                            {isSearching ? <div className="p-4 text-center"><div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto"></div></div> :
                                results.length > 0 ? <div className="p-2 space-y-1">{results.map((p) => <SearchResultCard key={p.id} product={p} onSelect={handleProductSelectAndClear} isActive={false} />)}</div> :
                                    <div className="p-4 text-center text-slate-400">No results.</div>}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow flex flex-col space-y-4 text-lg overflow-y-auto">
                    <button onClick={() => handleNavigateAndCloseMenus('home')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">Home</button>
                    <button onClick={() => handleNavigateAndCloseMenus('cart')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left flex items-center">
                        Shopping Cart
                        {totalItems > 0 && (
                            <span className="ml-auto bg-lime-500 text-slate-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <button onClick={() => handleNavigateAndCloseMenus('category', 'all')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">All Categories</button>
                    <button onClick={() => handleNavigateAndCloseMenus('blog')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">Protocols</button>
                    <button onClick={() => handleNavigateAndCloseMenus('contact')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">Contact</button>
                </nav>

                {/* Auth section */}
                {user ? (
                    <div className="mt-auto pt-6 border-t border-slate-700">
                        <div className="mb-4">
                            <p className="font-semibold text-white truncate">{user.name}</p>
                            <p className="text-sm text-slate-400 truncate">{user.email}</p>
                        </div>
                        <nav className="flex flex-col space-y-3 mb-4 text-lg">
                            <button onClick={() => handleNavigateAndCloseMenus('my-orders')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">My Orders</button>
                            <button onClick={() => handleNavigateAndCloseMenus('wishlist')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold text-left">My Wishlist</button>
                            <button className="text-slate-500 text-left cursor-not-allowed">Profile Settings</button>
                        </nav>
                        <button onClick={handleLogoutAndCloseMenus} className="w-full btn-3d text-center py-3">Logout</button>
                    </div>
                ) : (
                    <div className="mt-auto pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
                        <button onClick={() => { onOpenAuthModal('login'); setIsMobileMenuOpen(false); }} className="w-full btn-3d text-center py-3">Login</button>
                        <button onClick={() => { onOpenAuthModal('register'); setIsMobileMenuOpen(false); }} className="w-full btn-3d primary text-center py-3">Register</button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${isScrolled ? 'scrolled-header' : 'bg-black/80 border-slate-800'}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Left side: Logo + Nav */}
                    <div className="flex items-center gap-10">
                        <div className="flex-shrink-0">
                            <button onClick={() => handleNavigateAndCloseMenus('home')} className="font-teko text-4xl font-bold text-lime-400 uppercase transition-colors hover:text-white">
                                The Forge
                            </button>
                        </div>
                        <div className="hidden lg:flex items-center space-x-8">
                            {/* ALL CATEGORIES MEGA MENU */}
                            <div
                                className="relative"
                                ref={categoryMenuRef}
                            >
                                <button
                                    onClick={() => setIsCategoriesMenuOpen(prev => !prev)}
                                    className="text-slate-300 hover:text-lime-400 transition-colors font-semibold flex items-center"
                                >
                                    All Categories
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ml-1 transition-transform duration-300 ${isCategoriesMenuOpen ? 'rotate-180' : ''}`}>
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isCategoriesMenuOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-4xl">
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-8 grid grid-cols-2 gap-x-8 gap-y-4 animate-fade-in-down">
                                            {categories.map(name => (
                                                <button key={name} onClick={() => handleNavigateAndCloseMenus('category', slugify(name))} className="text-slate-400 hover:text-lime-400 transition-colors flex items-start text-left">
                                                    <DiamondIcon />
                                                    <span>{name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ACTIVE SUBSTANCE MEGA MENU */}
                            <div
                                className="relative"
                                ref={substanceMenuRef}
                            >
                                <button
                                    onClick={() => setIsSubstancesMenuOpen(prev => !prev)}
                                    className="text-slate-300 hover:text-lime-400 transition-colors font-semibold flex items-center"
                                >
                                    Active Substance
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ml-1 transition-transform duration-300 ${isSubstancesMenuOpen ? 'rotate-180' : ''}`}>
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isSubstancesMenuOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-5xl">
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-8 grid grid-cols-4 gap-x-8 gap-y-4 animate-fade-in-down">
                                            {substances.map(substance => (
                                                <button key={substance.id} onClick={() => handleNavigateAndCloseMenus('substance', substance.id)} className="text-slate-400 hover:text-lime-400 transition-colors flex items-start text-sm text-left">
                                                    <DiamondIcon />
                                                    <span>{substance.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MANUFACTURERS MEGA MENU */}
                            <div
                                className="relative"
                                ref={manufacturerMenuRef}
                            >
                                <button
                                    onClick={() => setIsManufacturersMenuOpen(prev => !prev)}
                                    className="text-slate-300 hover:text-lime-400 transition-colors font-semibold flex items-center"
                                >
                                    Manufacturers
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ml-1 transition-transform duration-300 ${isManufacturersMenuOpen ? 'rotate-180' : ''}`}>
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isManufacturersMenuOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-screen max-w-xl">
                                        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-8 grid grid-cols-2 gap-x-8 gap-y-4 animate-fade-in-down">
                                            {manufacturers.map(name => (
                                                <button key={name} onClick={() => handleNavigateAndCloseMenus('manufacturer', slugify(name))} className="text-slate-400 hover:text-lime-400 transition-colors flex items-start text-left">
                                                    <DiamondIcon />
                                                    <span>{name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleNavigateAndCloseMenus('blog')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold">Protocols</button>
                            <button onClick={() => handleNavigateAndCloseMenus('contact')} className="text-slate-300 hover:text-lime-400 transition-colors font-semibold">Contact</button>
                        </div>
                    </div>

                    {/* Right side: Search + Auth + Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden lg:block" ref={searchRef}>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                                    <svg className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                                </span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-10 pr-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all duration-300 w-48 focus:w-64"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => { if (query) setShowResults(true); }}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            {showResults && (
                                <div className="absolute top-full right-0 z-20 mt-4 w-screen max-w-md">
                                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                                        {isSearching ? <div className="p-4 text-center"><div className="w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto"></div></div> :
                                            results.length > 0 ? <div className="p-2 space-y-1">{results.map((p) => <SearchResultCard key={p.id} product={p} onSelect={handleProductSelectAndClear} isActive={false} />)}</div> :
                                                <div className="p-4 text-center text-slate-400">No results found.</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={() => onNavigate('cart')} className="relative text-slate-300 hover:text-lime-400 transition-colors p-2 rounded-full hidden lg:block" aria-label={`View shopping cart with ${totalItems} items`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.849l1.85-6.994a.75.75 0 00-.73-.91H5.617M6 18h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 006 18z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900 ${animateBadge ? 'animate-badge-pop' : ''}`}>
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="hidden lg:block relative" ref={profileMenuRef}>
                                <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 hover:border-lime-500" aria-label="Open user menu">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg>
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-lg z-20 animate-fade-in-down">
                                        <div className="px-4 py-3 border-b border-slate-800">
                                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                            <p className="text-sm text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        <ul className="py-1">
                                            <li><button onClick={() => handleNavigateAndCloseMenus('my-orders')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-lime-400">My Orders</button></li>
                                            <li><button onClick={() => handleNavigateAndCloseMenus('wishlist')} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-lime-400">My Wishlist</button></li>
                                            <li><button onClick={() => handleNavigateAndCloseMenus('dashboard')} className="w-full text-left px-4 py-2 text-sm text-lime-400 hover:bg-slate-800 hover:text-lime-300">Admin Dashboard</button></li>
                                            <li><button className="w-full text-left px-4 py-2 text-sm text-slate-500 cursor-not-allowed">Profile Settings</button></li>
                                            <li><button onClick={handleLogoutAndCloseMenus} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-lime-400">Logout</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <button onClick={() => onOpenAuthModal('login')} className="px-4 py-2 text-slate-300 hover:text-lime-400 font-semibold transition-colors">Login</button>
                                <button onClick={() => onOpenAuthModal('register')} className="btn-3d primary text-sm">Register</button>
                            </div>
                        )}

                        <div className="lg:hidden flex items-center gap-2">
                            <button onClick={() => onNavigate('cart')} className="relative text-slate-300 hover:text-lime-400 transition-colors p-2 rounded-full" aria-label={`View shopping cart with ${totalItems} items`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.849l1.85-6.994a.75.75 0 00-.73-.91H5.617M6 18h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 006 18z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span className={`absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900 ${animateBadge ? 'animate-badge-pop' : ''}`}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-slate-300 hover:text-lime-400 transition-colors"
                                aria-label="Open menu"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {isMobileMenuOpen && <MobileMenu />}
        </header>
    );
};