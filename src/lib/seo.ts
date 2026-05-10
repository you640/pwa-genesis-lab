import { useEffect } from 'react';
import { PageState, Product, BlogPost } from '../types';

const SITE = 'The Forge';
const DEFAULT_DESC = 'Elite gear and supplements for the dedicated athlete. Forge your legend.';

interface SEOInput {
  page: PageState;
  product: Product | null;
  post: BlogPost | null;
  listTitle?: string;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function compute({ page, product, post, listTitle }: SEOInput): { title: string; description: string } {
  switch (page.route) {
    case 'home':
      return { title: `${SITE} – Forge Your Legend`, description: DEFAULT_DESC };
    case 'product':
      if (product) return {
        title: `${product.name} – ${SITE}`,
        description: (product.description || `Buy ${product.name} at ${SITE}.`).slice(0, 155),
      };
      return { title: `Product – ${SITE}`, description: DEFAULT_DESC };
    case 'category':
    case 'manufacturer':
      return {
        title: `${listTitle || page.slug || 'Products'} – ${SITE}`,
        description: `Browse ${listTitle || page.slug || 'all products'} at ${SITE}.`,
      };
    case 'blog':
      return { title: `Protocols – ${SITE}`, description: 'Articles on elite training, nutrition and supplement science.' };
    case 'blog-post':
      if (post) return { title: `${post.title} – ${SITE}`, description: post.excerpt.slice(0, 155) };
      return { title: `Protocol – ${SITE}`, description: DEFAULT_DESC };
    case 'cart':
      return { title: `Shopping Cart – ${SITE}`, description: 'Review the items in your shopping cart.' };
    case 'wishlist':
      return { title: `Wishlist – ${SITE}`, description: 'Your saved products.' };
    case 'my-orders':
      return { title: `My Orders – ${SITE}`, description: 'Your order history.' };
    case 'contact':
      return { title: `Contact – ${SITE}`, description: 'Get in touch with The Forge team.' };
    case 'search':
      return { title: `Search "${page.slug || ''}" – ${SITE}`, description: `Search results for ${page.slug || ''}.` };
    case 'substance':
      return { title: `${page.slug} – ${SITE}`, description: `Information about ${page.slug}.` };
    case 'dashboard':
      return { title: `Dashboard – ${SITE}`, description: 'Admin dashboard.' };
    case 'terms-of-service':
      return { title: `Terms of Service – ${SITE}`, description: 'Terms of service.' };
    case 'privacy-policy':
      return { title: `Privacy Policy – ${SITE}`, description: 'Privacy policy.' };
    case 'shipping-and-returns':
      return { title: `Shipping & Returns – ${SITE}`, description: 'Shipping and returns information.' };
    default:
      return { title: SITE, description: DEFAULT_DESC };
  }
}

export function useSEO(input: SEOInput) {
  useEffect(() => {
    const { title, description } = compute(input);
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', window.location.href, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setCanonical(window.location.origin + window.location.pathname);
  }, [input.page.route, input.page.slug, input.product?.id, input.post?.id, input.listTitle]);
}
