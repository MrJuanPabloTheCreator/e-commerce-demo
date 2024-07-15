"use client"

import styles from "./page.module.css"
import SpeciesNavbar from "./_components/speciesNavbar"
import ProductListing from "./_components/productListing"

const ProductsPage = () => {
  
  return (
    <div className={styles.pageContainer}>
      <SpeciesNavbar/>
      <ProductListing/>
    </div>
  )
}

export default ProductsPage