"use client"

import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

import styles from "./page.module.css"
import ProductCard from "../_components/_ProductCard/productCard";
import { Product } from "@/types";
import { useSavedItems } from "../_context/SavedContext";

const SavedItemsPage = () => {
    const { savedItems } = useSavedItems();

    const savedProductsArray = Array.from(savedItems.values());

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Saved Items</h1>
            </div>
            <div className={styles.productListing}>
                {savedProductsArray.length > 0 ? savedProductsArray.map((product, index) => (
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