"use client"

import Deals from "./_billboards/deals"
import ProductListing from "./_components/_ProductListing/productListing"
import styles from "./page.module.css"

const HomePage = () => {

  return (
    <div className={styles.pageContainer}>
      <Deals/>
      <ProductListing/>
    </div>
  )
}

export default HomePage