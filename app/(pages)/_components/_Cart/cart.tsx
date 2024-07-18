
import Link from "next/link"
import styles from "./cart.module.css"
import { useCart } from "../../_context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartProps {
  setActiveAction: (action: string | null) => void;
  activeAction: string | null
}

const Cart:React.FC<CartProps> = ({ setActiveAction, activeAction}) => {
  const { cart, addToCart, removeFromCart } = useCart();
  
  const handleToggle = () => {
    setActiveAction(activeAction === 'cart' ? null : 'cart');
  };

  const calculateSubtotal = () => {
    let total = 0;
    cart.map((item) => 
      total += item.price * (1 - item.discount/100)
    )
    return total;
  }

  return (
    <div>
      <button onClick={handleToggle} className={styles.cartButton}>
        <ShoppingCart size={24}/>
      </button>
      {activeAction === "cart" &&
        <div className={styles.dropdownContainer}>
          <h3 className={styles.dropdownHeader}>My Cart</h3>
          <div className={styles.productsContent}>
            {cart.map((item, index) => (
              <div key={index} className={styles.cartItemContainer}>
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
            ))}
          </div>
          <div className={styles.subtotalContainer}>
            <p>Sub-Total (excluding sales tax)</p>
            <strong>${calculateSubtotal().toFixed(2)}</strong>
          </div>
          <div className={styles.actionsContainer}>
            <Link className={styles.actionButton} href={'/cart'}>Go to cart</Link>
            <Link className={styles.actionButton} href={'/checkout'}>Checkout</Link>
          </div>
        </div>
      }
    </div>
  )
}

export default Cart;