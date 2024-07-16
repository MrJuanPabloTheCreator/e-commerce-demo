
import { Product } from "@/types";
import Image from "next/image";

import styles from "./productCard.module.css"
import { useState } from "react";
import ProductModal from "../_ProductModal/productModal";

interface ProductCardProps {
    product: Product;
}

const ProductCard:React.FC<ProductCardProps> = ({product}) => {
    const [activeProductModal, setActiveProductModal] = useState<string | null>(null)

    return (
        <div className={styles.cardContainer}>
            <button className={styles.productImageContainer} onClick={() => setActiveProductModal(product.product_id)}>
                <Image src={product.image_url} alt="Product Image" fill className={styles.productImage}/>
            </button>
            <p>{product.description}</p>
            <div className={styles.productPrice}>
                {product.discount > 0 && <strong style={product.discount > 0 ? { color: 'red'}:{}}>${(product.price * (1 - product.discount/100)).toFixed(2)}</strong>}
                <strong style={product.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)'}:{}}>${product.price}</strong>
            </div>
            {activeProductModal === product.product_id && <ProductModal product={product} setActiveProductModal={setActiveProductModal}/>}
        </div>
    )
}

export default ProductCard