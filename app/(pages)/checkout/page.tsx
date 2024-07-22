"use client"

import React, { useEffect, useState } from 'react'

import styles from "./page.module.css"
import { useCart } from '../_context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const [deliveryOption, setDeliveryOption] = useState(1);
  const [order, setOrder] = useState({
    client : {
      name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zipcode: '',
      number: '',
      email: ''
    },
    deliveryOption: 'pick_up',
    items: Array.from(cartItems.keys()),
    totalPrice: 0
  });

  const cartItemsArray = Array.from(cartItems.values());

  const calculateDelivery = () => {
    let deliveryFee = 0;
    switch (deliveryOption) {
      case 1:
          deliveryFee = 10.00;
        break;
      
      case 2:
          deliveryFee = 15.00;
        break
      case 3: 
        deliveryFee = 0.00;
        break
    }
    return deliveryFee
  }

  const calculateSubtotal = () => {
    let total = 0;
    cartItemsArray.map((item) => 
      total += (item.price * (1 - item.discount/100)) * item.quantity
    )
    return total;
  }

  const calculateTaxes = () => {
    return (calculateSubtotal() + calculateDelivery()) * 0.0775
  }

  const calculateTotal = () => {
    const total = calculateSubtotal() + calculateTaxes() + calculateDelivery()
    return total;
  }

  useEffect(() => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      totalPrice: calculateTotal()
    }));
  }, [deliveryOption, cartItems]);

  return (
    <div className={styles.pageContainer}>
      <header>
        <Link className={styles.logoContainer} href={'/'}>
          <h1 style={{fontSize: '1.5rem'}}>Paw</h1>
          <Image src={'/logo2.png'} alt="Store Logo" width={65} height={65} className={styles.logoImage}/>
          <h1 style={{fontSize: '1.5rem'}}>Paradise</h1>
        </Link>
        <h1>CHECKOUT</h1>
      </header>
      <div className={styles.detailsContainer}>
        <div className={styles.userDetails}>

          <section className={styles.userDetailsSection}>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <h2>Delivery Address</h2>
              <button className={styles.newAddressButton}>New
                <Plus size={20}/>
              </button>
            </div>
            <div className={styles.addressContainer}>
              <div className={styles.buttonsContainer}>
                <button className={styles.editAddressButton}>Edit
                  <Pencil size={20}/>
                </button>
                <button 
                  className={styles.addressButton}
                  style={{backgroundColor: 'green'}}
                />
              </div>
              <p>Name...</p>
              <p>Address 1...</p>
              <p>Address 2...</p>
              <p>City...</p>
              <p>State...</p>
              <p>Postal Code...</p>
              <p>Number...</p>
              <p>Email...</p>
            </div>
          </section>

          <section className={styles.userDetailsSection}>

            <h2>Delivery Options</h2>

            <div className={styles.deliveryOption}>
              <h4>$10.00 - Standard Shipping</h4>
              <p>Recieve your items in the next 7 days</p>
              <button 
                className={styles.deliveryButton} onClick={() => setDeliveryOption(1)}
                style={deliveryOption === 1 ? {backgroundColor: 'green'}:{backgroundColor: 'white'}}
              />
            </div>

            <div className={styles.deliveryOption}>
              <h4>$15.00 - Express Delivery</h4>
              <p>Recieve your items in the next 3 days</p>
              <button 
                className={styles.deliveryButton} onClick={() => setDeliveryOption(2)}
                style={deliveryOption === 2 ? {backgroundColor: 'green'}:{backgroundColor: 'white'}}
              />
            </div>

            <div className={styles.deliveryOption}>
              <h4>Free - Pick up at store</h4>
              <p>Come pick it up at a nerby store</p>
              <button 
                className={styles.deliveryButton} onClick={() => setDeliveryOption(3)}
                style={deliveryOption === 3 ? {backgroundColor: 'green'}:{backgroundColor: 'white'}}
              />
            </div>

          </section>

          <section className={styles.userDetailsSection}>
            <h2>Payment</h2>

            <div>
              <h3 style={{paddingBottom: '1rem'}}>Billing Address</h3>
              <div className={styles.addressContainer}>
                <div className={styles.buttonsContainer}>
                  <button className={styles.editAddressButton}>Edit
                    <Pencil size={20}/>
                  </button>
                  <button 
                    className={styles.addressButton}
                    style={{backgroundColor: 'green'}}
                  />
                </div>
                <p>Name...</p>
                <p>Address 1...</p>
                <p>Address 2...</p>
                <p>City...</p>
                <p>State...</p>
                <p>Postal Code...</p>
                <p>Number...</p>
                <p>Email...</p>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
              <h3 style={{padding: '1rem 0rem'}}>Select Payment Option</h3>
              <div className={styles.creditCardContainer}>
                <div style={{display: 'flex', alignItems:'center', justifyContent: 'space-between', width: '100%'}}>
                  <h4>Credit Card</h4>
                  <button 
                    className={styles.addressButton}
                    style={{backgroundColor: 'green'}}
                  />
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                  <h5>Card Number</h5>
                  <input/>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <h5>Name on card</h5>
                    <input/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <h5>Expire date</h5>
                    <input/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                    <h5>CVV</h5>
                    <input/>
                  </div>
                </div>

              </div>
            </div>
            
          </section>
          <button className={styles.confirmButton}>
            Buy Now
          </button>
        </div>
        <div className={styles.summaryContainer}>
          <h2>Summary</h2>
          <div className={styles.itemsContainer}>
            {cartItemsArray.length > 0 && cartItemsArray.map((item, index) => (
              <div key={index} className={styles.itemContainer}>
                <div className={styles.imageContainer}>
                  <Image src={item.image_url} alt={"Image"} fill style={{objectFit: 'contain'}}/>
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productPrice}>
                    {item.discount > 0 && <strong style={item.discount > 0 ? { color: 'red'}:{}}>${(item.price * (1 - item.discount/100)).toFixed(2)}</strong>}
                    <strong style={item.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)', fontSize: '0.75rem'}:{}}>${item.price}</strong>
                  </div>
                  <p style={{fontSize: '0.85rem'}}>{item.description}</p>
                  <p style={{fontSize: '0.85rem'}}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.priceDetailsContainer}>
            <div>
              <div className={styles.priceDetails}>
                <strong>Subtotal</strong>
                <strong>${calculateSubtotal().toFixed(2)}</strong>
              </div>
            </div>
            <div className={styles.priceDetails}>
              <strong>Shipping</strong>
              <strong>${calculateDelivery().toFixed(2)}</strong>
            </div>
            <div className={styles.priceDetails}>
              <strong>Sales Tax</strong>
              <strong>${calculateTaxes().toFixed(2)}</strong>
            </div>
            <div className={styles.priceDetails}>
              <strong>Total to pay</strong>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
          <button className={styles.confirmButton2}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage