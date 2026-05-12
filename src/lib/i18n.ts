import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'cart.empty': 'Cart is empty',
      'cart.checkout': 'Checkout',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.logout': 'Logout',
      'nav.orders': 'My Orders',
      'nav.wishlist': 'My Wishlist',
      'nav.dashboard': 'Dashboard',
      'product.add': 'Add to cart',
      'product.notify': 'Notify me',
      'product.outOfStock': 'Out of stock',
      'checkout.title': 'Checkout',
      'checkout.place': 'Place order',
    },
  },
  sk: {
    translation: {
      'cart.empty': 'Košík je prázdny',
      'cart.checkout': 'Pokladňa',
      'nav.login': 'Prihlásiť',
      'nav.register': 'Registrácia',
      'nav.logout': 'Odhlásiť',
      'nav.orders': 'Moje objednávky',
      'nav.wishlist': 'Obľúbené',
      'nav.dashboard': 'Účet',
      'product.add': 'Pridať do košíka',
      'product.notify': 'Upozorniť ma',
      'product.outOfStock': 'Vypredané',
      'checkout.title': 'Pokladňa',
      'checkout.place': 'Odoslať objednávku',
    },
  },
};

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('lng') : null;

i18n.use(initReactI18next).init({
  resources,
  lng: stored || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
