export type Sender = 'user' | 'bot';

export interface Message {
  id: number;
  text: string;
  sender: Sender;
  products?: Product[];
  avatarUrl?: string;
  componentType?: 'cart';
  cartItems?: CartItem[];
  discount?: Discount | null;
}

export interface ToastMessage {
  message: string;
  visible: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  manufacturer?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  discountApplied?: Discount;
}

export type CartAction = 'remove' | 'update';

export type LoadingState = 'text' | 'products' | false;

export interface Discount {
  code: string;
  percentage: number;
}

export interface Substance {
  id: string;
  title: string;
  seoKeywords: string[];
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string;
}

export type PageRoute = 'home' | 'substance' | 'category' | 'manufacturer' | 'contact' | 'product' | 'blog' | 'blog-post' | 'terms-of-service' | 'privacy-policy' | 'shipping-and-returns' | 'cart' | 'search' | 'my-orders' | 'wishlist' | 'dashboard';

export interface PageState {
  route: PageRoute;
  slug?: string | null;
}

export interface User {
  name: string;
  email: string;
}

export type AuthModalType = 'login' | 'register' | null;


// --- REDUCER TYPES ---

export interface AppState {
  // Page state
  page: PageState;
  isPageLoading: boolean;
  listPageData: { title: string; products: Product[] };
  detailPageProduct: Product | null;
  detailPagePost: BlogPost | null;

  // Cart and Order state
  cart: CartItem[];
  discount: Discount | null;
  orders: Order[];
  wishlist: string[]; // Array of product IDs

  // Chat state
  messages: Message[];
  chatLoadingState: LoadingState;
  chatActionLoading: boolean;

  // UI state
  toast: ToastMessage;
  selectedProduct: Product | null; // For quick view modal
  isApiTesterOpen: boolean;
  isScrolled: boolean;
  notifyModalProduct: Product | null;

  // Auth state
  user: User | null;
  authModal: AuthModalType;
  isPaused: boolean;
}

export type AppAction =
  | { type: 'NAVIGATE'; payload: PageState }
  | { type: 'SET_PAGE_LOADING'; payload: boolean }
  | { type: 'SET_LIST_PAGE_DATA'; payload: { title: string; products: Product[] } }
  | { type: 'SET_DETAIL_PAGE_PRODUCT'; payload: Product | null }
  | { type: 'SET_DETAIL_PAGE_POST'; payload: BlogPost | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; newQuantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: Discount | null }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_WISHLIST'; payload: string[] }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_CHAT_LOADING'; payload: LoadingState }
  | { type: 'SET_CHAT_ACTION_LOADING'; payload: boolean }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'OPEN_PRODUCT_MODAL'; payload: Product }
  | { type: 'CLOSE_PRODUCT_MODAL' }
  | { type: 'OPEN_NOTIFY_MODAL'; payload: Product }
  | { type: 'CLOSE_NOTIFY_MODAL' }
  | { type: 'OPEN_API_TESTER' }
  | { type: 'CLOSE_API_TESTER' }
  | { type: 'SET_SCROLLED'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_MODAL'; payload: AuthModalType }
  | { type: 'TOGGLE_PAUSE' };