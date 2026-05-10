import { PageRoute, PageState } from '../types';

const STATIC: Record<string, PageRoute> = {
  '': 'home',
  'contact': 'contact',
  'cart': 'cart',
  'blog': 'blog',
  'my-orders': 'my-orders',
  'wishlist': 'wishlist',
  'dashboard': 'dashboard',
  'terms-of-service': 'terms-of-service',
  'privacy-policy': 'privacy-policy',
  'shipping-and-returns': 'shipping-and-returns',
};

export function pageStateToPath(page: PageState): string {
  const slug = page.slug ? encodeURIComponent(page.slug) : '';
  switch (page.route) {
    case 'home': return '/';
    case 'category': return slug ? `/category/${slug}` : '/category/all';
    case 'manufacturer': return slug ? `/manufacturer/${slug}` : '/manufacturer/all';
    case 'product': return `/product/${slug}`;
    case 'substance': return `/substance/${slug}`;
    case 'blog-post': return `/blog/${slug}`;
    case 'search': return `/search?q=${slug}`;
    default: return `/${page.route}`;
  }
}

export function pathToPageState(pathname: string, search: string): PageState {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (clean === '') return { route: 'home' };

  const [first, ...rest] = clean.split('/');
  const second = rest.join('/');

  if (first === 'category' || first === 'manufacturer' || first === 'product' || first === 'substance') {
    return { route: first as PageRoute, slug: second ? decodeURIComponent(second) : null };
  }
  if (first === 'blog' && second) {
    return { route: 'blog-post', slug: decodeURIComponent(second) };
  }
  if (first === 'search') {
    const q = new URLSearchParams(search).get('q') || '';
    return { route: 'search', slug: q };
  }
  if (STATIC[first]) {
    return { route: STATIC[first] };
  }
  return { route: 'home' };
}
