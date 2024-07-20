"use client"

import styles from "./page.module.css"
import SpeciesNavbar from "./_components/_SpeciesNavbar/speciesNavbar"
import ProductListing from "../_components/_ProductListing/productListing"
import Paginator from "../_components/_Pagination/paginator"

const ProductsPage = () => {
  
  return (
    <div className={styles.pageContainer}>
      <SpeciesNavbar/>
      <ProductListing/>
    </div>
  )
}

export default ProductsPage