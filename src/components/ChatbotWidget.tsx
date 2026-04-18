import React, { useState, useCallback } from 'react';
import { Message, Product, CartItem, Order, Sender, LoadingState, Discount } from '../types';
import { defaultAdminAvatar } from '../constants';
import { eShopService } from '../services/eShopService';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { SearchBar } from './SearchBar';
import { Avatar } from './Avatar';
import { SuggestedPrompts } from './SuggestedPrompts';

interface ChatbotWidgetProps {
    messages: Message[];
    cart: CartItem[];
    discount: Discount | null;
    orders: Order[];
    loadingState: LoadingState;
    isActionLoading: boolean;
    onSend: (text: string) => Promise<void>;
    onClearChat: () => void;
    onAddToCart: (product: Product, quantity?: number) => void;
    onUpdateCartQuantity: (productId: string, newQuantity: number) => void;
    onRemoveFromCart: (productId: string) => void;
    onOpenModal: (product: Product) => void;
    showToast: (message: string) => void;
    addMessage: (messageData: Omit<Message, 'id' | 'sender' | 'avatarUrl'>, sender: Sender) => void;
    executeShopFunction: (name: string, args: any) => Promise<void>;
}

export function ChatbotWidget(props: ChatbotWidgetProps) {
  const { 
    messages, 
    loadingState,
    isActionLoading,
    onSend,
    onClearChat,
    onAddToCart,
    onUpdateCartQuantity,
    onRemoveFromCart,
    onOpenModal,
   } = props;
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length > 1) {
      const results = await eShopService.searchProducts(query);
      return results;
    } else {
      return [];
    }
  }, []);

  const handleCheckout = useCallback(() => {
    onSend("I'm ready to checkout.");
  }, [onSend]);

  const ChatBubble = () => (
    <button
      onClick={() => setIsChatOpen(true)}
      className="fixed bottom-5 right-5 z-40 w-16 h-16 bg-lime-500 rounded-full shadow-lg flex items-center justify-center text-slate-900 hover:bg-lime-600 transition-all animate-pulse-glow"
      aria-label="Open Chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.755 2.755a.75.75 0 01-1.06 0L8.84 15.99a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
      </svg>
    </button>
  );

  const ChatWindow = () => (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-5">
       <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setIsChatOpen(false)}></div>
       <div className="text-white font-sans flex flex-col w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-slate-800 rounded-none sm:rounded-lg shadow-2xl border border-slate-700 relative animate-slide-in">
        <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
             <Avatar sender="bot" imageUrl={defaultAdminAvatar} />
             <div>
                <h1 className="text-lg font-bold text-lime-400">AI Shopping Assistant</h1>
                <p className="text-xs text-slate-400">Powered by Gemini</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClearChat} className="text-slate-400 hover:text-red-500" aria-label="Clear chat history">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
            </button>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </header>
        {/* <SearchBar onSearch={handleSearch} onAddToCart={onAddToCart} onQuickView={onOpenModal} /> */}
        <MessageList 
          messages={messages} 
          loadingState={loadingState} 
          onAddToCart={onAddToCart} 
          onQuickView={onOpenModal} 
          botAvatarUrl={defaultAdminAvatar} 
          onUpdateCartQuantity={onUpdateCartQuantity}
          onRemoveFromCart={onRemoveFromCart}
          onCheckout={handleCheckout}
        />
        {messages.length <= 2 && !loadingState && (
          <SuggestedPrompts onPromptClick={onSend} />
        )}
        <ChatInput onSend={onSend} isLoading={loadingState !== false} isActionLoading={isActionLoading} />
      </div>
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );

  return (
    <div className="font-sans">
      {!isChatOpen ? <ChatBubble /> : <ChatWindow />}
    </div>
  );
}