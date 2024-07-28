
import Link from "next/link"
import styles from "./cart.module.css"
import { useCart } from "../../_context/CartContext";
import { ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";

interface CartProps {
  setActiveAction: (action: string | null) => void;
  activeAction: string | null
}

const Cart:React.FC<CartProps> = ({ setActiveAction, activeAction}) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  
  const handleToggle = () => {
    setActiveAction(activeAction === 'cart' ? null : 'cart');
  };

  const cartItemsArray = Array.from(cartItems.values());

  const calculateSubtotal = () => {
    let total = 0;
    cartItemsArray.map((item) => 
      total += (item.price * (1 - item.discount/100)) * item.quantity
    )
    return total;
  }

  const totalQuantity = cartItemsArray.reduce((sum, item) => sum += item.quantity, 0);

  return (
    <div>
      <button onClick={handleToggle} className={styles.cartButton}>
        {cartItems.size > 0 && <span className={styles.cartItemsQuantity}>{totalQuantity}</span>}
        <ShoppingCart size={24}/>
      </button>
      {activeAction === "cart" &&
        <div className={styles.dropdownContainer}>
          <h3 className={styles.dropdownHeader}>My Cart</h3>
          <button className={styles.closeButton} onClick={() => setActiveAction(null)}>
            <X size={20}/>
          </button>
          <div className={styles.productsContent}>
            {cartItemsArray.length > 0 ? cartItemsArray.map((item, index) => (
              <div key={index} className={styles.cartItemContainer} onClick={() => setActiveAction(null)}>
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
                <button onClick={() => removeFromCart(item.product_id)} className={styles.dropProductButton}>
                  <Trash2 size={20}/>
                </button>
              </div>
            )): 
              <div style={{padding: '0.5rem'}}>
                No products in your cart
              </div>
            }
          </div>
          {cartItemsArray.length > 0 &&
            <div className={styles.subtotalContainer}>
              <p>Sub-Total (excluding sales tax)</p>
              <strong style={{color: 'green'}}>${calculateSubtotal().toFixed(2)}</strong>
            </div>
          }
          {cartItemsArray.length > 0 && <div className={styles.actionsContainer}>
            <Link className={styles.actionButton} href={'/cart'} onClick={() => setActiveAction(null)}>Go to cart</Link>
            <Link className={styles.actionButton} href={'/checkout'} onClick={() => setActiveAction(null)}>Checkout</Link>
          </div>}
        </div>
      }
    </div>
  )
}

export default Cart;