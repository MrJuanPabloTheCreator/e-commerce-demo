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

  const syncDB = () => {

  }

  const initializeCart = async () => {
    const storedCart = localStorage.getItem('cart');
    const updatedSession = await handleGetSession();
    
    if(storedCart && updatedSession?.user.id) {
      console.log('merging')
      // merge both data storages into db
      const localCartItems = JSON.parse(storedCart);
      const getCartResponse = await fetch(`/api/user/${updatedSession?.user.id}/cart`)
      const { success, items, error } = await getCartResponse.json()
      if (success) {
        const mergedCartItems = new Map<string, CartItem>(items.map((item: CartItem) => [item.product_id, item]));

        let newItems:[string, CartItem][] = [];
        let updateProducts:[string, number][] = []

        // Separate existing items from non existing items in the db
        localCartItems.forEach(([local_id, local_item]:[string, CartItem]) => {
          if (mergedCartItems.has(local_item.product_id)) {
            const existingItem: any = mergedCartItems.get(local_item.product_id);
            updateProducts.push([local_id, existingItem.quantity + local_item.quantity])
          } else {
            newItems.push([local_item.product_id, local_item])
          }
        });

        // Update quantity of local stored cart items into db
        if(updateProducts.length > 0){
          const postItemResponse = await fetch(`/api/user/${updatedSession.user.id}/sync-cart`, {
            method: 'PATCH',
            body: JSON.stringify({ updateProducts: updateProducts })
          })
          const { success, error } = await postItemResponse.json()
          if(success){
            updateProducts.forEach(([local_id, quantity]) => {
              const existingItem: any = mergedCartItems.get(local_id);
              existingItem.quantity = quantity;
            })

          } else {
            console.log('error posting item into db cart')
          }
        }

        // Post local stored cart items into db
        if(newItems.length > 0){
          const postItemResponse = await fetch(`/api/user/${updatedSession.user.id}/sync-cart`, {
            method: 'POST',
            body: JSON.stringify({ newProducts: newItems })
          })
          const { success, error } = await postItemResponse.json()
          if(success){
            newItems.forEach(([local_id, local_item]) => {
              mergedCartItems.set(local_id, local_item);
            })

          } else {
            console.log('error posting item into db cart')
          }
        }

        setCartItems(mergedCartItems);
        localStorage.removeItem('cart');
      }

    } else if(!storedCart && updatedSession?.user.id){
      const getCartResponse = await fetch(`/api/user/${updatedSession.user.id}/cart`)
      const { success, items, error } = await getCartResponse.json()

      if(success){
        setCartItems(new Map(items.map((item: CartItem) => [item.product_id, item])));
      }

    } else if(storedCart && !updatedSession?.user.id){
      console.log('third')
      // unauthenticated user
      const parsedCart = JSON.parse(storedCart);
      const newMap = new Map<string, CartItem>(parsedCart)
      setCartItems(newMap);
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  useEffect(() => {
    if(!session?.user.id && cartItems.size > 0){
      // update cart locally
      localStorage.setItem('cart', JSON.stringify(Array.from(cartItems.entries())));
    }
    // console.log(cartItems)
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
