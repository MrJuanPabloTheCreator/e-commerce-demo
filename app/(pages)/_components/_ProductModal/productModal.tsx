import React from 'react'

import styles from "./productModal.module.css"
import { Product } from '@/types';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    setActiveProductModal: (value: string | null) => void;
}

const ProductModal:React.FC<ProductCardProps> = ({product, setActiveProductModal}) => {
    return (
        <div className={styles.productModalContainer} onClick={() => setActiveProductModal(null)}>
            <div className={styles.productModalCard}>
                <div className={styles.productImageContainer}>
                    <Image src={product.image_url} alt="Product Image" fill className={styles.productImage}/>
                </div>
                <section className={styles.productDetails}>
                    <h3>{product.description}</h3>
                    <div className={styles.productPrice}>
                        {product.discount > 0 && <strong style={product.discount > 0 ? { color: 'red'}:{}}>${(product.price * (1 - product.discount/100)).toFixed(2)}</strong>}
                        <strong style={product.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)'}:{}}>${product.price}</strong>
                    </div>
                    <p>by {product.product_name}</p>
                    <div className={styles.colorPreview}>
                        <p>color</p>
                        <span style={{backgroundColor: product.color_id}} className={styles.productColor}/>
                    </div>
                    <p>Units Left: {product.stock}</p>

                    <button>Add to cart</button>
                    
                </section>
                <button className={styles.productDetailsExit} onClick={() => setActiveProductModal(null)}>
                    <X size={20}/>
                </button>
            </div>
        </div>
    )
}

export default ProductModal