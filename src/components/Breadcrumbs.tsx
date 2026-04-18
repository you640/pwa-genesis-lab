import React from 'react';
import { PageState, Product, PageRoute, BlogPost } from '../types';
import { eShopService, slugify } from '../services/eShopService';

interface BreadcrumbsProps {
    pageState: PageState;
    product: Product | null;
    post: BlogPost | null;
    onNavigate: (route: PageRoute, slug?: string | null) => void;
}

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-500">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
);

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pageState, product, post, onNavigate }) => {
    if (pageState.route === 'home') {
        return null; // No breadcrumbs on the homepage
    }

    const breadcrumbs = [{ label: 'Home', route: 'home' as PageRoute, slug: null }];

    switch (pageState.route) {
        case 'category':
        case 'manufacturer':
            breadcrumbs.push({ label: 'Products', route: 'category', slug: 'all' });
            if (pageState.slug) {
                const title = eShopService.getDisplayTitle(pageState.route, pageState.slug);
                breadcrumbs.push({ label: title, route: pageState.route, slug: pageState.slug });
            }
            break;
        case 'product':
            if (product) {
                breadcrumbs.push({ label: 'Products', route: 'category', slug: 'all' });
                breadcrumbs.push({ label: product.category, route: 'category', slug: slugify(product.category) });
                breadcrumbs.push({ label: product.name, route: 'product', slug: product.id });
            }
            break;
        case 'substance':
             breadcrumbs.push({ label: 'Substances', route: 'home', slug: null }); // Or a dedicated substance list page
             // Find substance title if possible, otherwise use slug
             breadcrumbs.push({ label: pageState.slug || 'Substance', route: 'substance', slug: pageState.slug });
            break;
        case 'contact':
            breadcrumbs.push({ label: 'Contact', route: 'contact', slug: null });
            break;
        case 'blog':
            breadcrumbs.push({ label: 'Protocols', route: 'blog', slug: null });
            break;
        case 'blog-post':
            breadcrumbs.push({ label: 'Protocols', route: 'blog', slug: null });
            if (post) {
                breadcrumbs.push({ label: post.title, route: 'blog-post', slug: post.slug });
            }
            break;
        case 'cart':
            breadcrumbs.push({ label: 'Shopping Cart', route: 'cart', slug: null });
            break;
        case 'search':
            breadcrumbs.push({ label: `Search Results for "${pageState.slug}"`, route: 'search', slug: pageState.slug });
            break;
        case 'my-orders':
            breadcrumbs.push({ label: 'My Orders', route: 'my-orders', slug: null });
            break;
        case 'wishlist':
            breadcrumbs.push({ label: 'My Wishlist', route: 'wishlist', slug: null });
            break;
        case 'terms-of-service':
        case 'privacy-policy':
        case 'shipping-and-returns':
            const routeTitle = pageState.route.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            breadcrumbs.push({ label: routeTitle, route: pageState.route, slug: null });
            break;
    }
    
    // In case the last breadcrumb is a duplicate of the previous one (e.g. for /category/all)
    if (breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 1].label === breadcrumbs[breadcrumbs.length - 2].label) {
        breadcrumbs.pop();
    }
    
    return (
        <nav className="bg-black border-b border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="flex items-center">
                            {index > 0 && <span className="mx-2"><ChevronRight /></span>}
                            {index === breadcrumbs.length - 1 ? (
                                <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{crumb.label}</span>
                            ) : (
                                <button
                                    onClick={() => onNavigate(crumb.route, crumb.slug)}
                                    className="text-slate-400 hover:text-lime-400 transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
};