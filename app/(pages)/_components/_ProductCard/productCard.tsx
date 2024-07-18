
import { Product } from "@/types";
import Image from "next/image";

import styles from "./productCard.module.css"
import { useEffect, useState } from "react";
import ProductModal from "../_ProductModal/productModal";
import SaveItemButton from "../_SaveItemButton/saveItemButton";
import { useCart } from "../../_context/CartContext";

interface ProductCardProps {
    product: Product;
}

const ProductCard:React.FC<ProductCardProps> = ({product}) => {
    const [activeProductModal, setActiveProductModal] = useState<string | null>(null)
    const { cartItems, addToCart, removeFromCart, isItemInCart } = useCart();
    // const [itemInCart, setItemInCart] = useState(false)

    const handleRemoveFromCart = () => {
        removeFromCart(product.product_id)
    }

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: 1 });
    };

    // useEffect(() => {
    //     const existingItem = cart.some((cartItem) => cartItem.product_id === product.product_id);
    //     setItemInCart(existingItem)
    // },[cart, product.product_id])

    return (
        <div className={styles.cardContainer}>
            <SaveItemButton productId={product.product_id} isSaved={product.is_saved}/>
            <button className={styles.productImageContainer} onClick={() => setActiveProductModal(product.product_id)}>
                <Image src={product.image_url} alt="Product Image" fill className={styles.productImage}/>
            </button>
            <p>{product.description}</p>
            <div className={styles.productPrice}>
                {product.discount > 0 && <strong style={product.discount > 0 ? { color: 'red'}:{}}>${(product.price * (1 - product.discount/100)).toFixed(2)}</strong>}
                <strong style={product.discount > 0 ? { textDecoration: 'line-through', color: 'rgb(155, 155, 155)'}:{}}>${product.price}</strong>
            </div>
            {isItemInCart(product.product_id) ? <button onClick={handleRemoveFromCart}>Added</button> : <button onClick={handleAddToCart}>Add to Cart</button>}
            {activeProductModal === product.product_id && <ProductModal product={product} setActiveProductModal={setActiveProductModal}/>}
        </div>
    )
}

export default ProductCard