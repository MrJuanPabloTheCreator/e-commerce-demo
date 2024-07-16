"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import ProductsNavbar from "./productsNavbar"
import styles from "./_styles/products.module.css"
import Image from "next/image"
import { EllipsisVertical } from "lucide-react"
import { deleteProduct } from "../actions/deleteProduct"
import UpdateProductModal from "./updateProductModal"
import { Product } from "@/types"
import toast from "react-hot-toast"

const dropDownActions = [
  {action: 'Archive', icon: ''},
  {action: 'Edit', icon: ''},
  {action: 'Delete', icon: ''}
]

const ProductsListing = () => {
  const [updateProduct, setUpdateProduct] = useState<Product| null>(null)
  const [actionDropdown, setActionDropdown] = useState<string | null>(null)
  const [productsList, setProductsList] = useState<Product[]>([])
  const searchParamsUrl = useSearchParams();

  const handleGetFilteredProducts = async () => {
    const filteredProducts = await fetch(`/api/products?${searchParamsUrl}`)
    const { success, products, error } = await filteredProducts.json()
    if(success){
      console.log(products)
      setProductsList(products)
    } else {
      throw new Error(error)
    }
  }

  const performAction = async (action: string, product: Product) => {
    switch (action) {
      case 'Archive':
        
        break;
      case 'Edit':
        setUpdateProduct(product)
        break;
      case 'Delete':
        const { success, error } = await deleteProduct(product.product_id);
        if(success){
          toast.success('Product deleted succesfully!')
        } else {
          toast.error(error)
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleGetFilteredProducts()
  }, [searchParamsUrl])

  return (
    <div className={styles.productsListingContainer}>
      <ProductsNavbar/>
      <div className={styles.listingLabels}>
        <ul>
          <li>
            Product name
          </li>
          <li>Category</li>
          <li>Color</li>
          <li>Stock</li>
          <li>Price</li>
          <li>Discount %</li>
        </ul>
        <span/>
      </div>
      {productsList.length > 0 ? productsList.map((product, index) => 
        <div className={styles.itemContainer}>
          <ul key={index}>
            <li style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <div className={styles.imageContainer}>
                <Image src={product.image_url} alt="product image" fill className={styles.image}/>
              </div>
              {product.product_name}
            </li>
            <li>{product.category_name}</li>
            <li>{product.color_label}</li>
            <li>{product.stock}</li>
            <li>${product.price}</li>
            <li>{product.discount}%</li>
          </ul>
          <button className={styles.actionsButton} onClick={() => setActionDropdown(actionDropdown === product.product_id ? null : product.product_id)}>
            <EllipsisVertical size={20}/>
          </button>
          {actionDropdown === product.product_id && 
            <div className={styles.actionDropdown}>
              {dropDownActions.map((a, i) => 
                <button key={i} onClick={() => performAction(a.action, product)}>
                  {a.action}
                </button>
              )}
            </div>
          }
        </div>
      ):(
        <>No results</>
      )}
      {updateProduct != null &&
        <div className={styles.productModal}>
          <UpdateProductModal selectedProduct={updateProduct} setProductModal={setUpdateProduct}/>
        </div>
      }
    </div>
  )
}

export default ProductsListing