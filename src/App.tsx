

import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pageStateToPath, pathToPageState } from './lib/routing';
import { useSEO } from './lib/seo';
import { useAuth } from './contexts/AuthContext';
import { Product, Message, CartItem, Order, Sender, ToastMessage, CartAction, LoadingState, Discount, PageState, PageRoute, BlogPost, AppState, AppAction, User, AuthModalType } from './types';
import { initialBotMessage, chatbotCommands, defaultAdminAvatar, defaultUserAvatar } from './constants';
import { eShopService } from './services/eShopService';
import { geminiService } from './services/geminiService';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Toast } from './components/Toast';
import { ProductModal } from './components/ProductModal';
import { PrestaShopApiTester } from './components/PrestaShopApiTester';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SubstancePage } from './components/SubstancePage';
import { substances } from './services/substanceData';
import { blogPosts } from './services/blogData';
import { ProductListPage } from './components/ProductListPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { BlogArchivePage } from './components/BlogArchivePage';
import { BlogPostPage } from './components/BlogPostPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ProductDisplayCardSkeleton } from './components/skeletons/ProductDisplayCardSkeleton';
import { ProductListPageSkeleton, ProductDetailPageSkeleton, BlogArchivePageSkeleton, BlogPostPageSkeleton } from './components/Skeletons';
import { NotFound } from './components/NotFound';
import { ProductDisplayCard } from './components/ProductDisplayCard';
import { AuthModal } from './components/AuthModal';
import { infoPageData } from './services/infoPageData';
import { InfoPage } from './components/InfoPage';
import { CartPage } from './components/CartPage';
import { SearchPage } from './components/SearchPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { WishlistPage } from './components/WishlistPage';
import { NotifyModal } from './components/NotifyModal';
import { DashboardPage } from './components/DashboardPage';

const initialState: AppState = {
  page: { route: 'home' },
  isPageLoading: false,
  listPageData: { title: '', products: [] },
  detailPageProduct: null,
  detailPagePost: null,
  cart: [],
  discount: null,
  orders: [],
  wishlist: [],
  messages: [initialBotMessage],
  chatLoadingState: false,
  chatActionLoading: false,
  toast: { message: '', visible: false },
  selectedProduct: null,
  isApiTesterOpen: false,
  isScrolled: false,
  user: null,
  authModal: null,
  notifyModalProduct: null,
  isPaused: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, page: action.payload };
    case 'SET_PAGE_LOADING':
      return { ...state, isPageLoading: action.payload };
    case 'SET_LIST_PAGE_DATA':
      return { ...state, listPageData: action.payload, detailPageProduct: null, detailPagePost: null };
    case 'SET_DETAIL_PAGE_PRODUCT':
      return { ...state, detailPageProduct: action.payload, detailPagePost: null };
    case 'SET_DETAIL_PAGE_POST':
      return { ...state, detailPagePost: action.payload, detailPageProduct: null };
    case 'ADD_TO_CART':
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        return { ...state, cart: state.cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
      }
      return { ...state, cart: [...state.cart, { product, quantity }] };
    case 'UPDATE_CART_QUANTITY':
      const { productId, newQuantity } = action.payload;
      if (newQuantity < 1) {
        return { ...state, cart: state.cart.filter(item => item.product.id !== productId) };
      }
      return { ...state, cart: state.cart.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item) };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.product.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [], discount: null };
    case 'APPLY_DISCOUNT':
      return { ...state, discount: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload], cart: [], discount: null };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'TOGGLE_WISHLIST':
      const productIdToToggle = action.payload;
      const isInWishlist = state.wishlist.includes(productIdToToggle);
      return { ...state, wishlist: isInWishlist ? state.wishlist.filter(id => id !== productIdToToggle) : [...state.wishlist, productIdToToggle] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CHAT_LOADING':
      return { ...state, chatLoadingState: action.payload };
    case 'SET_CHAT_ACTION_LOADING':
      return { ...state, chatActionLoading: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: { message: action.payload, visible: true } };
    case 'HIDE_TOAST':
      return { ...state, toast: { ...state.toast, visible: false } };
    case 'OPEN_PRODUCT_MODAL':
      return { ...state, selectedProduct: action.payload };
    case 'CLOSE_PRODUCT_MODAL':
      return { ...state, selectedProduct: null };
    case 'OPEN_NOTIFY_MODAL':
      return { ...state, notifyModalProduct: action.payload };
    case 'CLOSE_NOTIFY_MODAL':
      return { ...state, notifyModalProduct: null };
    case 'OPEN_API_TESTER':
      return { ...state, isApiTesterOpen: true };
    case 'CLOSE_API_TESTER':
      return { ...state, isApiTesterOpen: false };
    case 'SET_SCROLLED':
      return { ...state, isScrolled: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTH_MODAL':
      return { ...state, authModal: action.payload };
    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };
    default:
      return state;
  }
}

const HeroSection = React.memo(() => (
  <section className="relative h-[60vh] bg-black flex items-center justify-center text-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2787&auto=format&fit=crop')",
        animation: 'ken-burns 30s ease-in-out infinite'
      }}
    ></div>
    <div className="relative z-10 p-4">
      <h1
        className="font-teko text-7xl md:text-9xl font-bold uppercase tracking-wider text-white animate-fade-in-up"
        style={{ textShadow: '0px 2px 2px rgba(0,0,0,0.7), 0px 4px 6px rgba(0,0,0,0.4), 0px 8px 12px rgba(0,0,0,0.2)' }}
      >
        Forge Your Legend
      </h1>
      <p
        className="mt-2 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        Elite gear and supplements for the dedicated athlete. No excuses. Only results.
      </p>
    </div>
    <style>{`
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
            opacity: 0;
          }
        `}</style>
  </section>
));

const OurCreedSection = React.memo(() => (
  <section className="bg-black py-16 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-teko text-4xl mt-4 uppercase">Uncompromising Quality</h3>
          <p className="text-slate-400 mt-2">Every product is sourced and tested for maximum purity and potency. We sell what we use.</p>
        </div>
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-lime-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 8.25v7.5A2.25 2.25 0 006.75 18z" />
          </svg>
          <h3 className="font-teko text-4xl mt-4 uppercase">Engineered by Science</h3>
          <p className="text-slate-400 mt-2">Formulations backed by clinical research to deliver tangible results you can see and feel.</p>
        </div>
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          <h3 className="font-teko text-4xl mt-4 uppercase">Hardcore Commitment</h3>
          <p className="text-slate-400 mt-2">We are dedicated to the relentless pursuit of human potential. This is more than a brand, it's a creed.</p>
        </div>
      </div>
    </div>
  </section>
));

interface FeaturedProductsProps {
  isLoading: boolean;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = React.memo(({ isLoading, products, onAddToCart, onQuickView, wishlist, onToggleWishlist }) => (
  <section className="py-16 sm:py-24 bg-[#0c0c0c]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-teko text-5xl md:text-6xl font-bold text-center uppercase text-lime-400">
        Featured Gear
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ProductDisplayCardSkeleton key={i} />
          ))
        ) : (
          products.map((product, i) => (
            <ProductDisplayCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} index={i} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
          ))
        )}
      </div>
    </div>
  </section>
));

const GymStorePage = React.memo(({ onAddToCart, onQuickView, onNavigate, wishlist, onToggleWishlist }: { onAddToCart: (product: Product) => void, onQuickView: (product: Product) => void, onNavigate: (route: PageRoute, slug?: string | null) => void, wishlist: string[], onToggleWishlist: (productId: string) => void }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const allProducts = await eShopService.fetchProductsByFilter({});
      setFeaturedProducts(allProducts.slice(0, 8));
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <main>
      <HeroSection />
      <OurCreedSection />
      <FeaturedProducts isLoading={isLoading} products={featuredProducts} onAddToCart={onAddToCart} onQuickView={onQuickView} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
      <TestimonialsSection />
    </main>
  );
});


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, signOut: authSignOut, isAdmin } = useAuth();
  const initialPage = pathToPageState(location.pathname, location.search);
  const [state, dispatch] = useReducer(appReducer, { ...initialState, page: initialPage });
  const { page, isPageLoading, listPageData, detailPageProduct, detailPagePost, cart, discount, orders, wishlist, messages, chatLoadingState, chatActionLoading, toast, selectedProduct, isApiTesterOpen, isScrolled, user, authModal, notifyModalProduct, isPaused } = state;

  // Sync auth user to reducer
  useEffect(() => {
    if (authUser) {
      dispatch({ type: 'SET_USER', payload: { name: (authUser.user_metadata as any)?.display_name || authUser.email?.split('@')[0] || 'User', email: authUser.email || '' } });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [authUser]);

  // Sync URL -> page state (handles back/forward and direct loads)
  useEffect(() => {
    const next = pathToPageState(location.pathname, location.search);
    if (next.route !== page.route || (next.slug || null) !== (page.slug || null)) {
      dispatch({ type: 'NAVIGATE', payload: next });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useSEO({ page, product: detailPageProduct, post: detailPagePost, listTitle: listPageData.title });

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    dispatch({ type: 'SHOW_TOAST', payload: message });
    toastTimerRef.current = window.setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      dispatch({ type: 'SET_SCROLLED', payload: window.scrollY > 10 });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      document.body.classList.add('animations-paused');
    } else {
      document.body.classList.remove('animations-paused');
    }
  }, [isPaused]);

  const handleNavigate = useCallback((route: PageRoute, slug: string | null = null) => {
    const path = pageStateToPath({ route, slug });
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  useEffect(() => {
    const fetchPageData = async () => {
      dispatch({ type: 'SET_PAGE_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 200));

      if (page.route === 'category' || page.route === 'manufacturer') {
        const filterType = page.route;
        const filterValue = page.slug || '';
        const displayName = eShopService.getDisplayTitle(filterType, filterValue);
        const products = await eShopService.fetchProductsByFilter({ type: filterType, value: filterValue });
        dispatch({ type: 'SET_LIST_PAGE_DATA', payload: { title: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${displayName}`, products: products } });
      } else if (page.route === 'product' && page.slug) {
        const product = await eShopService.fetchProductById(page.slug);
        dispatch({ type: 'SET_DETAIL_PAGE_PRODUCT', payload: product });
      } else if (page.route === 'blog-post' && page.slug) {
        const post = blogPosts.find(p => p.slug === page.slug);
        dispatch({ type: 'SET_DETAIL_PAGE_POST', payload: post || null });
      } else {
        // For pages like home, contact, cart, search, my-orders, etc., that
        // don't load data here, just clear previous page-specific data.
        dispatch({ type: 'SET_DETAIL_PAGE_PRODUCT', payload: null });
        dispatch({ type: 'SET_DETAIL_PAGE_POST', payload: null });
      }
      dispatch({ type: 'SET_PAGE_LOADING', payload: false });
    };

    // Pages that handle their own data fetching
    const selfFetchingPages: PageRoute[] = ['search', 'my-orders', 'wishlist'];

    if (!selfFetchingPages.includes(page.route)) {
      fetchPageData();
    } else {
      // For self-sufficient pages, just turn off the global loader.
      dispatch({ type: 'SET_PAGE_LOADING', payload: false });
    }
  }, [page]);


  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          parsedCart.forEach(item => {
            if (item.product && typeof item.quantity === 'number') {
              dispatch({ type: 'ADD_TO_CART', payload: { product: item.product, quantity: item.quantity } });
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          dispatch({ type: 'SET_WISHLIST', payload: parsedWishlist });
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlist]);

  // Load order history from localStorage or service on initial render
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            dispatch({ type: 'SET_ORDERS', payload: parsedOrders });
            return;
          }
        }
        // If no local orders, load from service (mock data)
        const history = await eShopService.fetchOrderHistory();
        dispatch({ type: 'SET_ORDERS', payload: history });
      } catch (error) {
        console.error("Failed to load orders", error);
      }
    };
    loadOrders();
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      if (orders.length > 0) {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    } catch (error) {
      console.error("Failed to save orders to localStorage", error);
    }
  }, [orders]);


  const addMessage = useCallback((messageData: Omit<Message, 'id' | 'sender' | 'avatarUrl'>, sender: Sender) => {
    const avatarUrl = sender === 'bot' ? defaultAdminAvatar : defaultUserAvatar;
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      sender,
      avatarUrl,
      ...messageData,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  }, []);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    showToast(`Added ${product.name} to cart!`);
  }, [showToast]);

  const handleQuickAdd = useCallback((product: Product) => {
    handleAddToCart(product, 1);
  }, [handleAddToCart]);

  const handleProductQuickView = useCallback((product: Product) => {
    handleNavigate('product', product.id);
  }, [handleNavigate]);

  const handleUpdateCartQuantity = useCallback((productId: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, newQuantity } });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, []);

  const handleToggleWishlist = useCallback((productId: string) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: productId });
    const isAdding = !wishlist.includes(productId);
    showToast(isAdding ? 'Added to wishlist!' : 'Removed from wishlist.');
  }, [wishlist, showToast]);

  const handleOpenModal = useCallback((product: Product) => dispatch({ type: 'OPEN_PRODUCT_MODAL', payload: product }), []);
  const handleCloseModal = useCallback(() => dispatch({ type: 'CLOSE_PRODUCT_MODAL' }), []);

  const handleApplyDiscountCode = useCallback(async (code: string) => {
    if (cart.length === 0) {
      showToast("Add items to your cart before applying a discount.");
      return;
    }
    const result = await eShopService.validateDiscountCode(code);
    if (result.success && result.discount) {
      dispatch({ type: 'APPLY_DISCOUNT', payload: result.discount });
    } else {
      dispatch({ type: 'APPLY_DISCOUNT', payload: null });
    }
    showToast(result.message);
  }, [cart.length, showToast]);

  const handleCheckout = useCallback(() => {
    if (cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * (discount ? (1 - discount.percentage / 100) : 1);
      const newOrder: Order = {
        id: `FORGE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cart,
        total: total,
        date: new Date().toISOString(),
        shippingAddress: user?.email || 'customer@theforge.com',
        status: 'Processing',
        discountApplied: discount || undefined,
      };
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      showToast(`Order #${newOrder.id} placed! Thank you.`);
      handleNavigate('home');
    } else {
      showToast("Your cart is empty.");
    }
  }, [cart, discount, user, showToast, handleNavigate]);

  const executeShopFunction = useCallback(async (name: string, args: any): Promise<void> => {
    let responseText = "Sorry, I couldn't perform that action.";
    let responseProducts: Product[] = [];
    let responseComponent: 'cart' | undefined = undefined;
    let responseCartItems: CartItem[] | undefined = undefined;
    let responseDiscount: Discount | null | undefined = undefined;

    try {
      switch (name) {
        case 'showProducts':
          const { category = 'all' } = args;
          const products = await eShopService.fetchProductsByFilter({ type: 'category', value: category });
          responseText = products.length > 0
            ? `Here are the latest products in the "${category}" category:`
            : `I couldn't find any products in the "${category}" category.`;
          responseProducts = products;
          break;
        case 'addToCart':
          const productToAdd = await eShopService.findProduct(args.productName);
          if (productToAdd) {
            handleAddToCart(productToAdd, args.quantity || 1);
            responseText = `I've added ${args.quantity || 1} x ${productToAdd.name} to your cart. Anything else?`;
          } else {
            responseText = `I'm sorry, I couldn't find a product named "${args.productName}".`;
          }
          break;
        case 'manageCart':
          const { productName, action, quantity } = args as { productName: string; action: CartAction; quantity?: number; };
          const itemIndex = cart.findIndex(item => item.product.name.toLowerCase() === productName.toLowerCase());
          if (itemIndex === -1) {
            responseText = `I couldn't find "${productName}" in your cart.`;
            break;
          }
          const normalizedProductName = cart[itemIndex].product.name;
          if (action === 'remove') {
            handleRemoveFromCart(cart[itemIndex].product.id);
            responseText = `I've removed ${normalizedProductName} from your cart.`;
            showToast(`Removed ${normalizedProductName} from cart.`);
          } else if (action === 'update') {
            if (typeof quantity !== 'number') {
              responseText = `Please provide a valid quantity to update "${normalizedProductName}".`;
              break;
            }
            handleUpdateCartQuantity(cart[itemIndex].product.id, quantity);
            responseText = quantity < 1
              ? `I've removed ${normalizedProductName} from your cart as the quantity was set to zero.`
              : `I've updated the quantity of ${normalizedProductName} to ${quantity}.`;
            showToast(quantity < 1 ? `Removed ${normalizedProductName} from cart.` : `Updated ${normalizedProductName} to ${quantity} in cart.`);
          } else {
            responseText = `I don't know how to perform the action "${action}" on your cart.`;
          }
          break;
        case 'viewCart':
          if (cart.length > 0) {
            responseText = `Here is your shopping cart:`;
            responseComponent = 'cart';
            responseCartItems = cart;
            responseDiscount = discount;
          } else {
            responseText = "Your shopping cart is currently empty.";
          }
          break;
        case 'emptyCart':
          dispatch({ type: 'CLEAR_CART' });
          responseText = "I've emptied your shopping cart.";
          showToast("Your cart is now empty.");
          break;
        case 'placeOrder':
          if (cart.length > 0) {
            dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: true });
            const newOrder = await eShopService.placeOrderInPrestaShop(cart, args.shippingAddress, discount);
            dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: false });
            dispatch({ type: 'ADD_ORDER', payload: newOrder });
            responseText = `Thank you! Your order #${newOrder.id} has been placed. You will receive a confirmation at ${newOrder.shippingAddress}.`;
            showToast(`Order #${newOrder.id} placed successfully!`);
          } else {
            responseText = "You can't place an order with an empty cart.";
          }
          break;
        case 'checkOrderStatus':
          dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: true });
          // Check local state first
          const foundOrder = orders.find(o => o.id.toLowerCase().includes(args.orderId.toLowerCase()));
          // If not found locally, try service (though service only has mocks, local state should have everything)
          const order = foundOrder || await eShopService.checkOrderStatus(args.orderId);

          dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: false });
          responseText = order ? `Order #${order.id} status: ${order.status}.` : `I couldn't find an order with the ID #${args.orderId}.`;
          break;
        case 'viewOrderHistory':
          const history = orders; // Use local state which includes new orders
          if (history.length > 0) {
            responseText = "Here is your order history:\n\n";
            history.forEach(o => {
              responseText += `- Order #${o.id} [${o.status}]: ${o.items.length} items, Total: $${o.total.toFixed(2)}\n`;
            });
          } else {
            responseText = "You haven't placed any orders yet.";
          }
          break;
        case 'applyDiscountCode':
          if (cart.length > 0) {
            const result = await eShopService.validateDiscountCode(args.discountCode);
            if (result.success && result.discount) {
              dispatch({ type: 'APPLY_DISCOUNT', payload: result.discount });
              responseText = result.message + " I've updated your cart total.";
              showToast(result.message);
            } else {
              responseText = result.message;
            }
          } else {
            responseText = "You can only apply a discount code when you have items in your cart.";
          }
          break;
        case 'compareProducts':
          if (!args.productNames || args.productNames.length < 2) {
            responseText = "Please provide at least two product names to compare.";
            break;
          }
          const productsToCompare = await eShopService.compareProductsFromPrestaShop(args.productNames);
          if (productsToCompare.length >= 2) {
            responseText = `Here is a comparison of ${productsToCompare.map(p => p.name).join(' vs ')}:\n\n`;
            productsToCompare.forEach(p => {
              responseText += `**${p.name}**\n`;
              responseText += `- Price: $${p.price.toFixed(2)}\n`;
              responseText += `- Category: ${p.category}\n`;
              if (p.color) responseText += `- Color: ${p.color}\n`;
              if (p.weight) responseText += `- Weight: ${p.weight}\n`;
              if (p.dimensions) responseText += `- Dimensions: ${p.dimensions}\n\n`;
            });
          } else {
            responseText = `I could only find one or none of the products you asked to compare. Please check the names and try again.`;
          }
          break;
        case 'modifyOrder':
          const { orderId, newAddress } = args;
          const modificationAction = args.action as 'cancel' | 'changeAddress';
          dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: true });

          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

          const orderIndex = orders.findIndex(o => o.id.toLowerCase().includes(orderId.toLowerCase()));

          if (orderIndex === -1) {
            responseText = `Order #${orderId} not found.`;
          } else {
            const orderToModify = orders[orderIndex];
            if (modificationAction === 'cancel') {
              if (orderToModify.status === 'Processing') {
                const updatedOrders = [...orders];
                updatedOrders[orderIndex] = { ...orderToModify, status: 'Cancelled' };
                dispatch({ type: 'SET_ORDERS', payload: updatedOrders });
                responseText = `Order #${orderToModify.id} has been cancelled.`;
              } else {
                responseText = `Order #${orderToModify.id} cannot be cancelled as it has already been ${orderToModify.status}.`;
              }
            } else if (modificationAction === 'changeAddress') {
              if (orderToModify.status === 'Processing' && newAddress) {
                const updatedOrders = [...orders];
                updatedOrders[orderIndex] = { ...orderToModify, shippingAddress: newAddress };
                dispatch({ type: 'SET_ORDERS', payload: updatedOrders });
                responseText = `Shipping address for order #${orderToModify.id} has been updated.`;
              } else {
                responseText = `Order #${orderToModify.id} address cannot be changed (must be Processing).`;
              }
            } else {
              responseText = "Invalid modification action.";
            }
          }
          dispatch({ type: 'SET_CHAT_ACTION_LOADING', payload: false });
          showToast(responseText);
          break;
        case 'showHelp':
          responseText = "I can help you with the following:\n\n" +
            "- Show products (e.g., 'show me some laptops')\n" +
            "- Add items to cart (e.g., 'add 2 cosmic keyboards')\n" +
            "- Manage your cart (e.g., 'remove cosmic keyboard')\n" +
            "- View your cart (e.g., 'what's in my cart?')\n" +
            "- Compare products (e.g., 'compare cosmic keyboard and galaxy mouse')\n" +
            "- Apply a discount (e.g., 'apply discount SUMMER20')\n" +
            "- Empty your cart (e.g., 'clear my cart')\n" +
            "- Place an order (e.g., 'checkout to 123 Main St')\n" +
            "- Check order status (e.g., 'status of order 12345?')\n" +
            "- Modify an order (e.g., 'cancel order 12345')\n";
          break;
        default:
          responseText = `I'm not equipped to handle the action: ${name}.`;
      }
    } catch (error) {
      console.error("Error executing shop function:", error);
      responseText = "An error occurred. Please try again.";
    }

    addMessage({ text: responseText, products: responseProducts, componentType: responseComponent, cartItems: responseCartItems, discount: responseDiscount }, 'bot');
  }, [cart, discount, handleAddToCart, showToast, addMessage, handleUpdateCartQuantity, handleRemoveFromCart]);

  const handleSend = useCallback(async (text: string) => {
    addMessage({ text }, 'user');

    const lowercasedText = text.toLowerCase();
    const productKeywords = ['show', 'products', 'find', 'list', 'category', 'gear', 'nutrition', 'supplements', 'apparel', 'equipment'];
    dispatch({ type: 'SET_CHAT_LOADING', payload: productKeywords.some(kw => lowercasedText.includes(kw)) ? 'products' : 'text' });

    try {
      const chatHistory = messages
        .filter(m => m.id !== initialBotMessage.id)
        .map(msg => ({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));

      const result = await geminiService.generateFunctionCall(text, chatHistory, chatbotCommands);

      if (result.functionCalls && result.functionCalls.length > 0) {
        for (const funcCall of result.functionCalls) {
          await executeShopFunction(funcCall.name, funcCall.args);
        }
      } else if (result.text) {
        addMessage({ text: result.text }, 'bot');
      } else {
        addMessage({ text: "I'm not sure how to respond to that. Try asking for 'help'." }, 'bot');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      addMessage({ text: "Sorry, I couldn't process your request right now. Please try again later." }, 'bot');
    } finally {
      dispatch({ type: 'SET_CHAT_LOADING', payload: false });
    }
  }, [messages, executeShopFunction, addMessage]);

  const handleClearChat = useCallback(() => {
    dispatch({ type: 'SET_MESSAGES', payload: [initialBotMessage] });
    showToast("Chat history cleared.");
  }, [showToast]);

  const renderPage = () => {
    if (isPageLoading) {
      switch (page.route) {
        case 'category':
        case 'manufacturer':
        case 'search':
        case 'wishlist':
          return <ProductListPageSkeleton />;
        case 'product':
          return <ProductDetailPageSkeleton />;
        case 'blog':
          return <BlogArchivePageSkeleton />;
        case 'blog-post':
          return <BlogPostPageSkeleton />;
        default:
          return <div className="flex justify-center items-center min-h-screen"><div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div></div>;
      }
    }

    switch (page.route) {
      case 'home':
        return <GymStorePage onAddToCart={handleQuickAdd} onQuickView={handleProductQuickView} onNavigate={handleNavigate} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />;
      case 'substance':
        const substanceData = substances.find(s => s.id === page.slug);
        return substanceData ? <SubstancePage substance={substanceData} /> : <GymStorePage onAddToCart={handleQuickAdd} onQuickView={handleProductQuickView} onNavigate={handleNavigate} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />;
      case 'category':
      case 'manufacturer':
        return <ProductListPage title={listPageData.title} products={listPageData.products} onAddToCart={handleQuickAdd} onQuickView={handleProductQuickView} onNavigate={handleNavigate} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />;
      case 'product':
        return detailPageProduct ?
          <ProductDetailPage
            product={detailPageProduct}
            onAddToCart={handleAddToCart}
            onQuickAddToCart={handleQuickAdd}
            onQuickView={handleProductQuickView}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenNotifyModal={(product) => dispatch({ type: 'OPEN_NOTIFY_MODAL', payload: product })}
          /> :
          <NotFound
            title="Product Not Found"
            message="The gear you're looking for doesn't exist or has been moved."
            onCtaClick={() => handleNavigate('home')}
            ctaText="Return to Homepage"
          />;
      case 'contact':
        return <ContactPage />;
      case 'blog':
        return <BlogArchivePage posts={blogPosts} onNavigate={handleNavigate} />;
      case 'blog-post':
        return detailPagePost ? <BlogPostPage post={detailPagePost} /> :
          <NotFound
            title="Protocol Not Found"
            message="The article you are looking for does not exist."
            onCtaClick={() => handleNavigate('blog')}
            ctaText="View All Protocols"
          />;
      case 'cart':
        return <CartPage
          cart={cart}
          discount={discount}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onApplyDiscountCode={handleApplyDiscountCode}
          onCheckout={handleCheckout}
          onNavigate={handleNavigate}
        />;
      case 'search':
        return <SearchPage
          query={page.slug || ''}
          onAddToCart={handleQuickAdd}
          onQuickView={handleProductQuickView}
          onNavigate={handleNavigate}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />;
      case 'wishlist':
        return user ? (
          <WishlistPage
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleQuickAdd}
            onQuickView={handleProductQuickView}
            onNavigate={handleNavigate}
          />
        ) : (
          <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NotFound
                title="Access Denied"
                message="You must be logged in to view your wishlist."
                onCtaClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' })}
                ctaText="Login Now"
              />
            </div>
          </main>
        );
      case 'my-orders':
        return user ? (
          <OrderHistoryPage
            orders={orders}
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        ) : (
          <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NotFound
                title="Access Denied"
                message="You must be logged in to view your order history."
                onCtaClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' })}
                ctaText="Login Now"
              />
            </div>
          </main>
        );
      case 'dashboard':
        return user ? (
          <DashboardPage
            onNavigate={handleNavigate}
            showToast={showToast}
          />
        ) : (
          <main className="bg-[#0c0c0c] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <NotFound
                title="Access Denied"
                message="You must be logged in to access the admin dashboard."
                onCtaClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' })}
                ctaText="Login Now"
              />
            </div>
          </main>
        );
      case 'terms-of-service':
      case 'privacy-policy':
      case 'shipping-and-returns':
        const pageContent = infoPageData[page.route];
        return pageContent ? <InfoPage title={pageContent.title} content={pageContent.content} /> : <NotFound title="Page Not Found" message="The page you're looking for doesn't exist." onCtaClick={() => handleNavigate('home')} ctaText="Return Home" />;
      default:
        return <GymStorePage onAddToCart={handleQuickAdd} onQuickView={handleProductQuickView} onNavigate={handleNavigate} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Header
        isScrolled={isScrolled}
        onOpenApiTester={() => dispatch({ type: 'OPEN_API_TESTER' })}
        onNavigate={handleNavigate}
        user={user}
        cart={cart}
        onOpenAuthModal={(type) => dispatch({ type: 'SET_AUTH_MODAL', payload: type })}
        onLogout={() => {
          dispatch({ type: 'SET_USER', payload: null });
          showToast("You've been logged out.");
        }}
      />
      <Breadcrumbs pageState={page} product={detailPageProduct} post={detailPagePost} onNavigate={handleNavigate} />
      {renderPage()}
      <Footer onNavigate={handleNavigate} isPaused={isPaused} onTogglePause={() => dispatch({ type: 'TOGGLE_PAUSE' })} />
      <Toast message={toast.message} visible={toast.visible} />
      <ProductModal product={selectedProduct} onClose={handleCloseModal} onAddToCart={(p) => handleAddToCart(p, 1)} />
      {isApiTesterOpen && <PrestaShopApiTester onClose={() => dispatch({ type: 'CLOSE_API_TESTER' })} />}
      <AuthModal
        modalType={authModal}
        onClose={() => dispatch({ type: 'SET_AUTH_MODAL', payload: null })}
        onLogin={(user) => {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTH_MODAL', payload: null });
          showToast(`Welcome back, ${user.name}!`);
        }}
        onRegister={(user) => {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTH_MODAL', payload: null });
          showToast(`Welcome to The Forge, ${user.name}!`);
        }}
      />
      <NotifyModal
        product={notifyModalProduct}
        onClose={() => dispatch({ type: 'CLOSE_NOTIFY_MODAL' })}
        showToast={showToast}
      />
      <ChatbotWidget
        messages={messages}
        cart={cart}
        discount={discount}
        orders={orders}
        loadingState={chatLoadingState}
        isActionLoading={chatActionLoading}
        onSend={handleSend}
        onClearChat={handleClearChat}
        onAddToCart={handleAddToCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onOpenModal={handleOpenModal}
        showToast={showToast}
        addMessage={addMessage}
        executeShopFunction={executeShopFunction}
      />
    </div>
  );
}

export default App;