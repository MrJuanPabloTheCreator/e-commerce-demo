
import { Product } from "@/types";
import Image from "next/image";

import styles from "./productCard.module.css"
import { useState } from "react";
import ProductModal from "./productModal";

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
            <p>{product.product_name}</p>
            <strong>${product.price}</strong>
            {activeProductModal === product.product_id && <ProductModal product={product} setActiveProductModal={setActiveProductModal}/>}
        </div>
    )
}

export default ProductCard