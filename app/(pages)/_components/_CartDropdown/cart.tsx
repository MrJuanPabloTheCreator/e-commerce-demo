
import Link from "next/link"
import styles from "./cart.module.css"

const CartDropdown = () => {
  return (
    <div className={styles.dropdownContainer}>
      <div>Items</div>
      <Link href={'/cart'}>Checkout</Link>
    </div>
  )
}

export default CartDropdown