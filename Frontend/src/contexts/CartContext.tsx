import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Mattress } from '../lib/mockData';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (mattress: Mattress, options: { size: string; firmness: string; height: string }) => void;
  removeFromCart: (mattressId: string, options: { size: string; firmness: string; height: string }) => void;
  updateQuantity: (mattressId: string, options: { size: string; firmness: string; height: string }, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (mattress: Mattress, options: { size: string; firmness: string; height: string }) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.mattress.id === mattress.id &&
          item.selectedOptions.size === options.size &&
          item.selectedOptions.firmness === options.firmness &&
          item.selectedOptions.height === options.height
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { mattress, quantity: 1, selectedOptions: options }];
      }
    });
  };

  const removeFromCart = (mattressId: string, options: { size: string; firmness: string; height: string }) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.mattress.id === mattressId &&
            item.selectedOptions.size === options.size &&
            item.selectedOptions.firmness === options.firmness &&
            item.selectedOptions.height === options.height
          )
      )
    );
  };

  const updateQuantity = (mattressId: string, options: { size: string; firmness: string; height: string }, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mattressId, options);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.mattress.id === mattressId &&
        item.selectedOptions.size === options.size &&
        item.selectedOptions.firmness === options.firmness &&
        item.selectedOptions.height === options.height
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Calculate price based on selected options
      let price = item.mattress.price;
      
      // Size multiplier
      if (item.selectedOptions.size === 'Queen') price *= 1.3;
      else if (item.selectedOptions.size === 'King') price *= 1.5;
      else if (item.selectedOptions.size === 'Custom') price *= 1.4;
      
      // Height multiplier
      if (item.selectedOptions.height === '8 inch') price *= 1.1;
      else if (item.selectedOptions.height === '10 inch') price *= 1.2;
      
      return total + Math.round(price) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
