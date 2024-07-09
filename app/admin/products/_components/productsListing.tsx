"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import ProductsNavbar from "./productsNavbar"
import styles from "./_styles/products.module.css"
import Image from "next/image"
import { EllipsisVertical } from "lucide-react"
import { deleteProduct } from "../actions/deleteProduct"
import UpdateProductModal from "./updateProductModal"

export interface Product {
  category_id: string;
  category_name: string;
  category_description: string;

  color_id: string;
  color_label: string;

  product_id: string;
  product_name: string;
  stock: number;
  created_at: string;
  price: number;
  discount: string;
  image_url: string;
  updated_at: string;
  description: string;
}

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
        await deleteProduct(product.product_id);
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
      {productsList.length > 0 ? productsList.map((product, index) => 
        <div className={styles.itemContainer}>
          <div className={styles.imageContainer}>
            <Image src={product.image_url} alt="product image" fill className={styles.image}/>
          </div>
          <ul key={index}>
            <li>{product.product_name}</li>
            <li>{product.category_name}</li>
            <li>{product.color_label}</li>
            <li>{product.stock}</li>
            <li>{product.price}</li>
            <li>{product.discount}</li>
          </ul>
          <button className={styles.actionsButton} onClick={() => setActionDropdown(actionDropdown === product.product_id ? null : product.product_id)}>
            <EllipsisVertical />
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