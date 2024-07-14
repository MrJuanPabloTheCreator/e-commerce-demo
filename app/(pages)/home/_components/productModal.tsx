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
                    <button onClick={() => setActiveProductModal(null)}>
                        <X size={20}/>
                    </button>
                    <h2>{product.product_name}</h2>
                    <strong>${product.price}</strong>
                    <p>{product.description}</p>
                    <div className={styles.colorPreview}>
                        <p>color</p>
                        <span style={{backgroundColor: product.color_id}} className={styles.productColor}/>
                    </div>
                    <p>Units Left: {product.stock}</p>
                    
                </section>
            </div>
        </div>
    )
}

export default ProductModal