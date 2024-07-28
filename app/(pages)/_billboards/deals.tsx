
import Image from "next/image"
import styles from "./deals.module.css"
import ProductCard from "../_components/_ProductCard/productCard"
import { useEffect, useState } from "react"
import { Product } from "@/types"
import ProductModal from "../_components/_ProductModal/productModal"

const Deals = () => {
  const [products, setProducts] = useState<Product[] | null>(null)

  const handleGetDeals = async () => {
    const dealsResponse = await fetch('/api/deals');
    const { success, products, error } = await dealsResponse.json();
    if(success){
      setProducts(products)
    }
  }
  
  useEffect(() => {
    handleGetDeals();
  },[])

  return (
    <div className={styles.billboardContainer}>

      <section className={styles.billboardInfo}>
        <div>
          <h1>Seasonal Pet Deals</h1>
          <h2>The Time to Save is Now!</h2>
        </div>
        <button className={styles.shopNowButton}>
          Shop Now
        </button>
      </section>

      <section className={styles.dealsContainer}>
        {products && products.map((product, index) => (
          <div className={styles.productContainer} key={index}>
            <button className={styles.productImageContainer}>
                <Image src={product.image_url} alt="Product Image" fill className={styles.productImage}/>
            </button>  
            <div className={styles.productPrice}>
              {product.discount > 0 && <strong style={product.discount > 0 ? { color: 'red'}:{}}>${(product.price * (1 - product.discount/100)).toFixed(2)}</strong>}
              <strong style={product.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(135, 135, 135)', fontSize: '0.9rem'}:{}}>${product.price}</strong>
            </div>
          </div>
        ))}
      </section>

      <div className={styles.imageContainer}>
        <Image src={'/billboard_1.png'} fill alt="Billboard Image" style={{objectFit: 'contain'}}/>
      </div>

    </div>
  )
}

export default Deals