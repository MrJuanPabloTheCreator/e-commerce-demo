"use client"

import { Product } from '@/types';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SavedItemsContextType {
  savedItems: Map<string, Product>;
  addToSavedItems: (product: Product) => void;
  removeFromSavedItems: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  clearSavedItems: () => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [savedItems, setSavedItems] = useState<Map<string, Product>>(new Map());

    const handleGetSession = async () => {
        const updatedSession = await getSession();
        setSession(updatedSession)
        return updatedSession;
    }

    const initializeSavedItems = async () => {
        const storedSavedItems = localStorage.getItem('savedItems');
        const updatedSession = await handleGetSession();

        if (storedSavedItems && updatedSession?.user.id) {
            const localSavedItems = JSON.parse(storedSavedItems) as [string, Product][];
            const getSavedItemsResponse = await fetch(`/api/user/${updatedSession?.user.id}/saved-items`)
            const { success, items, error } = await getSavedItemsResponse.json()
            if(success){
                // combine local and db
                const combinedSavedItems = new Map<string, Product>(items.map((item: Product) => [item.product_id, item]));

                const newLocalItems: [string, Product][] = [];

                localSavedItems.forEach(([id, product]) => {
                    if (!combinedSavedItems.has(id)) {
                        newLocalItems.push([id, product]);
                    }
                });

                if(newLocalItems.length > 0){
                    console.log('executed!')
                    const newLocalItemIds = newLocalItems.map(([id, _]) => id);
                    const addItemResponse = await fetch(`/api/user/${updatedSession.user.id}/sync-saved-items`, {
                        method: 'POST',
                        body: JSON.stringify({savedItemsIds: newLocalItemIds})
                    })
                    const { success, error } = await addItemResponse.json()
                    if(success){
                        newLocalItems.forEach(([id, product]) => {
                            combinedSavedItems.set(id, product)
                        })
                    }
                }

                setSavedItems(combinedSavedItems);
                localStorage.removeItem('savedItems');
            } else {
                setSavedItems(new Map<string, Product>(localSavedItems));
            }

        } else if (!storedSavedItems && updatedSession?.user.id){
            const getSavedItemsResponse = await fetch(`/api/user/${updatedSession?.user.id}/saved-items`)
            const { success, items, error } = await getSavedItemsResponse.json()
            if(success){
                console.log('items', items)
                setSavedItems(new Map<string, Product>(items.map((item: Product) => [item.product_id, item])));
            }       

        } else if (storedSavedItems && !updatedSession?.user.id){
            const localSavedItems = JSON.parse(storedSavedItems) as [string, Product][];
            setSavedItems(new Map<string, Product>(localSavedItems));
        }
    }

    useEffect(() => {
        initializeSavedItems()
    }, []);

    useEffect(() => {
        if(!session?.user.id){
            localStorage.setItem('savedItems', JSON.stringify(Array.from(savedItems.entries())));
        }
    }, [savedItems]);

    const addToSavedItems = async (product: Product) => {
        if(session?.user.id){
            const addItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
              method: 'POST',
              body: JSON.stringify({productId: product.product_id})
            })
            const { success, error } = await addItemResponse.json()

            if(success){
                setSavedItems((prevItems) => {
                    const newItems = new Map(prevItems);
                    newItems.set(product.product_id, product);
                    return newItems;
                });
            } else {
                console.log(error)
            }

        } else {
            setSavedItems((prevItems) => {
                const newItems = new Map(prevItems);
                newItems.set(product.product_id, product);
                return newItems;
            });
        }
    };

    const removeFromSavedItems = async (id: string) => {

        if(session?.user.id){
            const deleteItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
                method: 'DELETE',
                body: JSON.stringify({ productId: id })
            })
            const { success, error } = await deleteItemResponse.json()

            if(success){
                setSavedItems((prevItems) => {
                    const newItems = new Map(prevItems);
                    newItems.delete(id);
                    return newItems;
                });
            } else {
                console.log(error)
            } 

        } else {
            setSavedItems((prevItems) => {
                const newItems = new Map(prevItems);
                newItems.delete(id);
                return newItems;
            });
        }
    };

    const clearSavedItems = async () => {

        if(session?.user.id){
            const deleteItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
                method: 'DELETE'
            })
            const { success, error } = await deleteItemResponse.json()

            if(success){
                setSavedItems(new Map());
            } else {
                console.log(error)
            } 

        } else {
            setSavedItems(new Map());
        }
        localStorage.removeItem('savedItems');
    };

    const isItemSaved = (id: string) => {
        return savedItems.has(id);
    };

    return (
        <SavedItemsContext.Provider value={{ savedItems, addToSavedItems, removeFromSavedItems, isItemSaved, clearSavedItems }}>
        {children}
        </SavedItemsContext.Provider>
    );
};

export const useSavedItems = () => {
    const context = useContext(SavedItemsContext);
    if (context === undefined) {
        throw new Error('useSavedItems must be used within a SavedItemsProvider');
    }
    return context;
};
