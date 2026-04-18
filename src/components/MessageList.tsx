import React, { useEffect, useRef } from 'react';
import { Message, Product, LoadingState, CartItem, Discount } from '../types';
import { ProductCard } from './ProductCard';
import { Avatar } from './Avatar';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { CartView } from './CartView';

interface MessageListProps {
  messages: Message[];
  loadingState: LoadingState;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
  botAvatarUrl?: string;
}

const MessageBubble: React.FC<{message: Message; children: React.ReactNode}> = ({ message, children }) => {
  const isCart = message.componentType === 'cart';
  const bubbleStyles = message.sender === 'user'
    ? 'bg-lime-500 text-slate-900 rounded-br-none'
    : 'bg-slate-700 text-slate-200 rounded-bl-none';

  return (
    <div className={`
      max-w-md rounded-lg shadow-lg 
      ${!isCart ? bubbleStyles : ''}
      ${isCart ? 'p-0 overflow-hidden w-full' : 'p-3'}
    `}>
      {children}
    </div>
  );
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loadingState, onAddToCart, onQuickView, botAvatarUrl, onUpdateCartQuantity, onRemoveFromCart, onCheckout }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const renderLoadingIndicator = () => {
    if (loadingState === 'products') {
      return (
        <div className="flex my-3 items-end gap-2 justify-start">
           <Avatar sender='bot' imageUrl={botAvatarUrl} />
           <div className="max-w-md w-full">
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
        </div>
      );
    }
    if (loadingState === 'text') {
       return (
         <div className="flex my-3 justify-start items-end gap-2">
            <Avatar sender='bot' imageUrl={botAvatarUrl} />
            <div className="max-w-md p-3 rounded-lg bg-slate-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
         </div>
      );
    }
    return null;
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className={`flex my-3 items-end gap-2 animate-message-slide-in ${message.sender === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
          <Avatar sender={message.sender} imageUrl={message.avatarUrl} />
          <MessageBubble message={message}>
            {message.componentType === 'cart' && message.cartItems ? (
              <CartView 
                items={message.cartItems} 
                onUpdateQuantity={onUpdateCartQuantity}
                onRemoveItem={onRemoveFromCart}
                discount={message.discount}
                onCheckout={onCheckout}
                onQuickView={onQuickView}
              />
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}

            {message.products && message.products.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {message.products.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onQuickView={onQuickView} />
                ))}
              </div>
            )}
          </MessageBubble>
        </div>
      ))}
      {loadingState && renderLoadingIndicator()}
      <div ref={messagesEndRef} />
    </div>
  );
};
