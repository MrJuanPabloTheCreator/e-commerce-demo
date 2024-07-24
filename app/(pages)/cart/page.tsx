"use client"

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../_context/CartContext";
import styles from "./page.module.css"
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types/cartItem";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, updateItem } = useCart();

  const cartItemsArray = Array.from(cartItems.values());

  const handleGetProductQuantity = (item: CartItem) => {
    const quantity = item ? item.quantity : 0;
    return quantity;
  }

  const handleRemoveFromCart = (e: React.MouseEvent<HTMLButtonElement>, productId: string) => {
    e.preventDefault()
    removeFromCart(productId)
  }

  const handleUpdateItem = (addition: number, product: CartItem) => {
    const quantity = handleGetProductQuantity(product)
    if(quantity + addition <= 0){
      removeFromCart(product.product_id)
    } else {
      updateItem({...product, quantity: quantity + addition})
    }
  }

  const calculateTotal = () => {
    let total = 0;
    cartItemsArray.map((item) => 
      total += item.price * item.quantity
    )
    return total
  }

  const calculateSubtotal = () => {
    let total = 0;
    cartItemsArray.map((item) => 
      total += (item.price * (1 - item.discount/100)) * item.quantity
    )
    return total;
  }

  const totalSavings = () => {
    return calculateTotal() - calculateSubtotal()
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>My Cart</h1>
      </div>
      <div className={styles.cartContent}>
        <div className={styles.productsContent}>
          {cartItemsArray.length > 0 ? cartItemsArray.map((item, index) => (
            <div key={index} className={styles.cartItemContainer}>
              <div className={styles.imageContainer}>
                <Image src={item.image_url} alt={"Image"} fill style={{objectFit: 'contain'}}/>
              </div>
              <div className={styles.productDetailsContainer}>
                <div className={styles.productDetails}>
                  <div className={styles.productPrice}>
                    {item.discount > 0 && <strong style={item.discount > 0 ? { color: 'red'}:{}}>${(item.price * (1 - item.discount/100)).toFixed(2)}</strong>}
                    <strong style={item.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)', fontSize: '0.75rem'}:{}}>${item.price}</strong>
                  </div>
                  <p style={{fontSize: '0.85rem'}}>{item.description}</p>
                  <p style={{fontSize: '0.85rem'}}>Qty: {item.quantity}</p>
                </div>
                <div className={styles.actionsContainer}>
                  <button onClick={(e) => handleRemoveFromCart(e, item.product_id)} className={styles.dropProductButton}>
                      <Trash2 size={28}/>
                  </button>
                  <div className={styles.quantityContainer}>
                      <button className={styles.decreaseButton} onClick={() => handleUpdateItem(-1, item)}>
                          <Minus />
                      </button> 
                      <span className={styles.quantity}>{handleGetProductQuantity(item)}</span>
                      <button className={styles.increaseButton} onClick={() => handleUpdateItem(+1, item)}>
                          <Plus />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          )): 
            <div>
              No products in your cart
            </div>
          }
        </div>
        {cartItemsArray.length > 0 &&
          <div className={styles.summaryContainer}>
            <div>
              <div className={styles.summaryDescription}>
                <strong>Subtotal</strong>
                <strong style={{textDecoration: 'line-through'}}>${calculateTotal().toFixed(2)}</strong>
              </div>
              <div className={styles.summaryDescription}>
                <strong>Savings</strong>
                <strong style={{color: 'red'}}>-${totalSavings().toFixed(2)}</strong>
              </div>
              <div className={styles.summaryDescription}>
                <p></p>
                <strong style={{color: 'green'}}>${calculateSubtotal().toFixed(2)}</strong>
              </div>
            </div>
            <div className={styles.summaryDescription2}>
              <strong>Taxes</strong>
              <p style={{fontSize: '0.87.5rem'}}>Calculated at checkout</p>
            </div>
            <div className={styles.summaryDescription2}>
              <strong>Shipping</strong>
              <p style={{fontSize: '0.87.5rem'}}>Calculated at checkout</p>
            </div>
            <div className={styles.summaryDescription2}>
              <strong>Estimated Total</strong>
              <strong style={{color: 'green'}}>${calculateSubtotal().toFixed(2)}</strong>
            </div>
            <Link href={'/checkout'} className={styles.checkout}>
              Continue to checkout
            </Link>
          </div>
        }
      </div>    
    </div>
  )
}

export default CartPage