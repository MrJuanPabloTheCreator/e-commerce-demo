"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

import { Product } from "@/types"
import styles from "./productListing.module.css"
import ProductCard from '@/app/(pages)/_components/_ProductCard/productCard';
import { getSession } from "next-auth/react";

const ProductListing = () => {
    const [productsList, setProductsList] = useState<Product[]>([])
    const searchParamsUrl = useSearchParams();

    const handleGetFilteredProducts = async () => {
        const updatedSession = await getSession();
        if(updatedSession?.user.id){
            console.log('user products')
            const filteredProducts = await fetch(`/api/auth_user_products/${updatedSession.user.id}?${searchParamsUrl}`)
            const { success, products, error } = await filteredProducts.json()
            if(success){
                console.log(products)
                setProductsList(products)
            } else {
                throw new Error(error)
            }
        } else {
            const filteredProducts = await fetch(`/api/products?${searchParamsUrl}`)
            const { success, products, error } = await filteredProducts.json()
            if(success){
                console.log(products)
                setProductsList(products)
            } else {
                throw new Error(error)
            }
        }
    }

    useEffect(() => {
        handleGetFilteredProducts()
    }, [searchParamsUrl])

    return (
        <div className={styles.pageContainer}>
            <div className={styles.productListing}>
                {productsList.length > 0 ? productsList.map((product, index) => (
                <ProductCard key={index} product={product}/>
                )):(
                <div>
                    No Products Results
                </div>
                )}
            </div>
        </div>
    )
}

export default ProductListing