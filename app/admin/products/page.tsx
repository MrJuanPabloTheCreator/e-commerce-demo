import ProductsListing from "./_components/productsListing"
import styles from "./products.module.css"

const ProductsPage = () => {
  return (
    <div className={styles.container}>
      <header>
        <h2>Products</h2>
      </header>
      <ProductsListing/>
    </div>
  )
}

export default ProductsPage