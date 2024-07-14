"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

import { Product } from "@/types"
import ProductCard from "./_components/productCard";
import styles from "./page.module.css"

const HomePage = () => {
  const [productsList, setProductsList] = useState<Product[]>([])
  const searchParamsUrl = useSearchParams();

  const handleGetFilteredProducts = async () => {
    const filteredProducts = await fetch(`/api/products?${searchParamsUrl}`)
    const { success, products, error } = await filteredProducts.json()
    if(success){
      console.log(products)
      setProductsList(products)
    } else {
      throw new Error(error)
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
            No Products
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage