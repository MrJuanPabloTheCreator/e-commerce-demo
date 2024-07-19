"use client"

import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SavedItemsContextType {
  savedItems: Set<string>;
  addToSavedItems: (id: string) => void;
  removeFromSavedItems: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  clearSavedItems: () => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null)
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

    const handleGetSession = async () => {
        const updatedSession = await getSession();
        setSession(updatedSession)
        return updatedSession;
    }

    const initializeSavedItems = async () => {
        const storedSavedItems = localStorage.getItem('savedItems');
        const updatedSession = await handleGetSession();

        if (storedSavedItems && updatedSession?.user.id) {
            const localSavedItems = new Set(JSON.parse(storedSavedItems) as string[]);
            const getSavedItemsResponse = await fetch(`/api/user/${updatedSession?.user.id}/saved-items`)
            const { success, ids: serverSavedItemsIds, error } = await getSavedItemsResponse.json()
            if(success){
                // combine local and db
                const combinedSavedItems = new Set<string>(serverSavedItemsIds);
                localSavedItems.forEach(id => combinedSavedItems.add(id));
                setSavedItems(combinedSavedItems);
                localStorage.removeItem('savedItems');
            } else {
                setSavedItems(localSavedItems);
            }

        } else if (!storedSavedItems && updatedSession?.user.id){
            const getSavedItemsResponse = await fetch(`/api/user/${updatedSession?.user.id}/saved-items`)
            const { success, ids: serverSavedItemsIds, error } = await getSavedItemsResponse.json()
            if(success){
                setSavedItems(new Set(serverSavedItemsIds))
            }       

        } else if (storedSavedItems && !updatedSession?.user.id){
            setSavedItems(new Set(JSON.parse(storedSavedItems)));
        }
    }

    useEffect(() => {
        initializeSavedItems()
    }, []);

    useEffect(() => {
        if(!session?.user.id){
            localStorage.setItem('savedItems', JSON.stringify(Array.from(savedItems)));
        }
    }, [savedItems]);

    const addToSavedItems = async (id: string) => {
        if(session?.user.id){
            const addItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
              method: 'POST',
              body: JSON.stringify({productId: id})
            })
            const { success, error } = await addItemResponse.json()

            if(success){
                setSavedItems((prevItems) => new Set(prevItems).add(id));
            } else {
                console.log(error)
            }

        } else {
            setSavedItems((prevItems) => new Set(prevItems).add(id));
        }
    };

    const removeFromSavedItems = async (id: string) => {
        const newItems = new Set(savedItems);

        if(session?.user.id){
            const deleteItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
                method: 'DELETE',
                body: JSON.stringify({ productId: id })
            })
            const { success, error } = await deleteItemResponse.json()

            if(success){
                newItems.delete(id);
                setSavedItems(newItems);
            } else {
                console.log(error)
            } 

        } else {
            newItems.delete(id);
            setSavedItems(newItems);
        }
    };

    const clearSavedItems = async () => {

        if(session?.user.id){
            const deleteItemResponse = await fetch(`/api/user/${session.user.id}/saved-items`, {
                method: 'DELETE'
            })
            const { success, error } = await deleteItemResponse.json()

            if(success){
                setSavedItems(new Set());
            } else {
                console.log(error)
            } 

        } else {
            setSavedItems(new Set());
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
