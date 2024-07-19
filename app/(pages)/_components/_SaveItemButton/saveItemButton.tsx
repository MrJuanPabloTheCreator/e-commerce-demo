"use client"

import { Heart } from 'lucide-react'
import styles from "./savedItemButton.module.css"
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa'
import { useSavedItems } from '../../_context/SavedContext'
import { Product } from '@/types'

interface SavedItemButtonProps {
  product: Product
}

const SaveItemButton:React.FC<SavedItemButtonProps> = ({ product }) => {
  const { isItemSaved, addToSavedItems, removeFromSavedItems } = useSavedItems();



  const handleSaveItem = async () => {
    if(!isItemSaved(product.product_id)){
      addToSavedItems(product)
    } else {
      removeFromSavedItems(product.product_id)
    }
  }

  return (
    <button onClick={handleSaveItem} className={styles.buttonContainer}>
      {isItemSaved(product.product_id) ? <FaHeart size={24} style={{ color: '#6D326D' }}/>:
      <Heart size={24} />}
    </button>
  )
}

export default SaveItemButton