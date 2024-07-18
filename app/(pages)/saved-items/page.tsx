"use client"

import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

import styles from "./page.module.css"
import ProductCard from "../_components/_ProductCard/productCard";
import { Product } from "@/types";

const SavedItemsPage = () => {
    const [savedItems, setSavedItems] = useState<Product[]>([])
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchSavedItems = async (userId: string) => {
        const savedItems = await fetch(`/api/user/${userId}/saved-items`)
        const { success, items, error } = await savedItems.json();
        if(success){
            setSavedItems(items)
        } else {
            throw new Error(error.message)
        }
    }

    const handleGetSession = async () => {
        const updatedSession = await getSession();
        if(updatedSession?.user.id){
            await fetchSavedItems(updatedSession?.user.id);
            setSession(updatedSession);
        }
        setLoading(false)  
    }
    
    useEffect(() => {
        handleGetSession();   
    }, []);

    if(loading){
        return <div>Loading</div>
    }

    if(!loading && !session?.user.id){
        return (
            <div className={styles.noUserContainer}>
                <h2>We couldn't find any records</h2>
                <h4>Log in to access your saved items</h4>
                <button className={styles.signInButton} onClick={() => signIn()}>Sign In</button>
            </div>
        )
    }

    if(!loading && session?.user.id){
        return (
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>Saved Items</h1>
                </div>
                <div className={styles.productListing}>
                    {savedItems.length > 0 ? savedItems.map((product, index) => (
                        <ProductCard key={index} product={product}/>
                    )):(
                        <div>
                            No Products Saved
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default SavedItemsPage