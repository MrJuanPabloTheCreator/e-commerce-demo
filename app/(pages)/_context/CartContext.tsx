"use client"

import { CartItem } from '@/types/cartItem';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
  cartItems: Map<string, CartItem>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isItemInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [cartItems, setCartItems] = useState<Map<string, CartItem>>(new Map());

  const handleGetSession = async () => {
    const updatedSession = await getSession();
    setSession(updatedSession)
  }

  const initializeCart = async () => {
    const storedCart = localStorage.getItem('cart');
    await handleGetSession();
    if(storedCart) {
      setCartItems(new Map(JSON.parse(storedCart)));
    } else if(!storedCart && session?.user.id){
      
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(Array.from(cartItems.entries())));
    console.log(cartItems)
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevCartItems) => {
      const newCartItems = new Map(prevCartItems);
      const existingItem = newCartItems.get(item.product_id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        newCartItems.set(item.product_id, item);
      }

      return newCartItems;
    });
  };

    const removeFromCart = (id: string) => {
      setCartItems((prevCartItems) => {
        const newCartItems = new Map(prevCartItems);
        newCartItems.delete(id);
        return newCartItems;
      });
    };
    
    const clearCart = () => {
      setCartItems(new Map());
      localStorage.removeItem('cart');
    };

  const isItemInCart = (id: string) => {
    return cartItems.has(id);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isItemInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
