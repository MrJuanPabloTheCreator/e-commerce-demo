import React from 'react'

import styles from "./productModal.module.css"
import { Product } from '@/types';
import Image from 'next/image';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../../_context/CartContext';
import SaveItemButton from '../_SaveItemButton/saveItemButton';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    setActiveProductModal: (value: string | null) => void;
}

const ProductModal:React.FC<ProductCardProps> = ({product, setActiveProductModal}) => {
    const { cartItems, addToCart, updateItem, removeFromCart, isItemInCart } = useCart()

    const item = cartItems.get(product.product_id);
    const quantity = item ? item.quantity : 0;

    const handleRemoveFromCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        removeFromCart(product.product_id)
    }

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        addToCart({...product, quantity: 1});
    };

    const handleUpdateItem = (addition: number) => {
        if(quantity + addition <= 0){
            removeFromCart(product.product_id)
        } else {
            updateItem({...product, quantity: quantity + addition})
        }
    }

    return (
        <div className={styles.productModalContainer}>
            <div className={styles.productModalCard}>
                <div className={styles.productImageContainer}>
                    <Image src={product.image_url} alt="Product Image" fill className={styles.productImage}/>
                    <SaveItemButton product={product}/>
                </div>
                <section className={styles.productDetailsContainer}>
                    <div className={styles.productDetails}>
                        <h3>{product.description}</h3>
                        <div className={styles.productPrice}>
                            {product.discount > 0 && <strong style={product.discount > 0 ? { color: 'red'}:{}}>${(product.price * (1 - product.discount/100)).toFixed(2)}</strong>}
                            <strong style={product.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)'}:{}}>${product.price}</strong>
                        </div>
                        <p>by {product.product_name}</p>
                        {product.color_id &&
                            <div className={styles.colorPreview}>
                                <p>color</p>
                                <span style={{backgroundColor: product.color_id}} className={styles.productColor}/>
                            </div>
                        }
                        <p>Units Left: {product.stock}</p>
                    </div>

                    {isItemInCart(product.product_id) ? 
                        <div className={styles.actionsContainer}>
                            <button onClick={handleRemoveFromCart} className={styles.dropProductButton}>
                                <Trash2 size={28}/>
                            </button>
                            <div className={styles.quantityContainer}>
                                <button className={styles.decreaseButton} onClick={() => handleUpdateItem(-1)}>
                                    <Minus />
                                </button> 
                                <span className={styles.quantity}>{quantity}</span>
                                <button className={styles.increaseButton} onClick={() => handleUpdateItem(+1)}>
                                    <Plus />
                                </button>
                            </div>
                            <Link className={styles.actionButton} href={'/cart'}>Go to cart</Link>
                        </div>
                    : 
                        <button onClick={handleAddToCart} className={styles.addToCartButton}>Add to Cart</button>
                    }
                    
                </section>
                <button className={styles.productDetailsExit} onClick={() => setActiveProductModal(null)}>
                    <X size={20}/>
                </button>
            </div>
        </div>
    )
}

export default ProductModal