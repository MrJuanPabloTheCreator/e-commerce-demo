"use client"

import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

import styles from "./page.module.css"
import ProductCard from "../_components/_ProductCard/productCard";
import { Product } from "@/types";
import { useSavedItems } from "../_context/SavedContext";

const SavedItemsPage = () => {
    const [savedProducts, setSavedProducts] = useState<Product[]>([])
    const { savedItems } = useSavedItems();
    const [loading, setLoading] = useState(true)

    // const fetchSavedItems = async () => {
    //     const savedItemsResponse = await fetch(`/api/user/products/${savedItems}`)
    //     const { success, items, error } = await savedItemsResponse.json();
    //     if(success){
    //         setSavedProducts(items)
    //     } else {
    //         throw new Error(error.message)
    //     }
    //     setLoading(false)
    // }

    // useEffect(() => {
    //     fetchSavedItems()
    // },[savedItems])

    if(loading){
        return <div>Loading</div>
    } 

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Saved Items</h1>
            </div>
            <div className={styles.productListing}>
                {savedProducts.length > 0 ? savedProducts.map((product, index) => (
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

export default SavedItemsPage