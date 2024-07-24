"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

import { Product } from "@/types"
import styles from "./productListing.module.css"
import ProductCard from '@/app/(pages)/_components/_ProductCard/productCard';
import Paginator from "../_Pagination/paginator";
import SkeletonCard from "../_SkeletonCard/skeletonCard";
import { categories } from "@/constants";

const ProductListing = () => {
    const [loading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState<Product[]>([])
    const searchParamsUrl = useSearchParams();
    const category = searchParamsUrl.get('c');
    
    let categoryName = null;
    if(Number(category) > 0 && Number(category) < 10){
        categoryName = categories[Number(category)-1].name;
    }

    const handleGetFilteredProducts = async () => {
        try {
            const filteredProducts = await fetch(`/api/products?${searchParamsUrl}`)
            const { success, products, error } = await filteredProducts.json()
            if(success){
                setProductsList(products)
            } else {
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetFilteredProducts()
    }, [searchParamsUrl])

    return (
        <div className={styles.pageContainer}>
            {categoryName && <h1 className={styles.productListingTitle}>{categoryName}</h1>}
            <div className={styles.productListing}>
                {loading && 
                    Array.from({ length: 12 }).map((_, index) => (
                        <SkeletonCard key={index}/>
                    ))
                }

                {productsList.length > 0 ? productsList.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                )):(
                    <div>No products found</div>
                )}

            </div>
            <Paginator disableNext={productsList.length < 12}/>
        </div>
    )
}

export default ProductListing