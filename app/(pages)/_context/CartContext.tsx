"use client"

import { CartItem } from '@/types/cartItem';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
  cartItems: Map<string, CartItem>;
  updateItem: (item: CartItem) => void;
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
    return updatedSession;
  }

  const initializeCart = async () => {
    const storedCart = localStorage.getItem('cart');
    const updatedSession = await handleGetSession();
    
    if(storedCart && updatedSession?.user.id) {
      // merge both data storages into db
      const localCartItems = JSON.parse(storedCart);
      const getCartResponse = await fetch(`/api/user/${updatedSession?.user.id}/cart`)
      const { success, items: serverCartItems, error } = await getCartResponse.json()
      console.log(success)
      if (success) {
        // Merge localCartItems and serverCartItems
        const mergedCartItems = new Map();

        // Add server items to mergedCartItems
        serverCartItems.forEach((item: CartItem) => {
          mergedCartItems.set(item.product_id, item);
        });

        // Add local items, merging quantities if item already exists
        localCartItems.forEach((localItem: CartItem) => {
            if (mergedCartItems.has(localItem.product_id)) {
                const existingItem = mergedCartItems.get(localItem.product_id);
                existingItem.quantity += localItem.quantity;
            } else {
                mergedCartItems.set(localItem.product_id, localItem);
            }
        });

        setCartItems(mergedCartItems);
        localStorage.removeItem('cart'); // Clear local storage after merging
      }

    } else if(!storedCart && updatedSession?.user.id){
      const getCartResponse = await fetch(`/api/user/${updatedSession.user.id}/cart`)
      const { success, items, error } = await getCartResponse.json()

      if(success){
        setCartItems(new Map(items.map((item: CartItem) => [item.product_id, item])));
      }

    } else if(storedCart && !updatedSession?.user.id){
      // unauthenticated user
      setCartItems(new Map(JSON.parse(storedCart).map((item: CartItem) => [item.product_id, item])));
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  useEffect(() => {
    if(!session?.user.id){
      // update cart locally
      localStorage.setItem('cart', JSON.stringify(Array.from(cartItems.entries())));
    }
    console.log(cartItems)
  }, [cartItems]);

  const updateItem = async (item: CartItem) => {
    const newCartItems = new Map(cartItems);
    const existingItem = newCartItems.get(item.product_id);

    if(session?.user.id && existingItem){
      // update in db
      const removeItemResponse = await fetch(`/api/user/${session.user.id}/cart`, {
        method: 'PATCH',
        body: JSON.stringify({productId: item.product_id, quantity: item.quantity})
      })
      const { success, error } = await removeItemResponse.json()
      if(success){
        existingItem.quantity = item.quantity;
      } else {
        console.log('error updating item in db cart')
      }
    } else if(existingItem) {
      existingItem.quantity = item.quantity;
    }

    setCartItems(newCartItems)
  }

  const addToCart = async (item: CartItem) => {
    const newCartItems = new Map(cartItems);

      // post item into db
    if(session?.user.id){
      const postItemResponse = await fetch(`/api/user/${session.user.id}/cart`, {
        method: 'POST',
        body: JSON.stringify({productId: item.product_id, quantity: item.quantity})
      })
      const { success, error } = await postItemResponse.json()
      if(success){
        // set context only if insertiong was succesful
        newCartItems.set(item.product_id, item);
      } else {
        console.log('error posting item into db cart')
      }
    } else {
      newCartItems.set(item.product_id, item);
    }

    setCartItems(newCartItems)
  };

    const removeFromCart = async (id: string) => {
      // if user then delete from db
      if(session?.user.id){
        const removeItemResponse = await fetch(`/api/user/${session.user.id}/cart`, {
          method: 'DELETE',
          body: JSON.stringify({productId: id})
        })
        const { success, error } = await removeItemResponse.json()
        if(success){
          console.log('removed')
          setCartItems((prevCartItems) => {
            const newCartItems = new Map(prevCartItems);
            newCartItems.delete(id);
            return newCartItems;
          });
        }
      } else {
        setCartItems((prevCartItems) => {
          const newCartItems = new Map(prevCartItems);
          newCartItems.delete(id);
          return newCartItems;
        });
      }
    };
    
    const clearCart = async () => {
      if(session?.user.id){
        const removeItemResponse = await fetch(`/api/user/${session.user.id}/cart`, {
          method: 'DELETE',
        })
        const { success, error } = await removeItemResponse.json()
        if(success){
          console.log('removed')
          setCartItems(new Map());
        }
      } else {
        setCartItems(new Map());
      }
      localStorage.removeItem('cart');
    };

  const isItemInCart = (id: string) => {
    return cartItems.has(id);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateItem, addToCart, removeFromCart, clearCart, isItemInCart }}>
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
