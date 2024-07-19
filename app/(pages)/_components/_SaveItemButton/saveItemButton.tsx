"use client"

import { Heart } from 'lucide-react'
import styles from "./savedItemButton.module.css"
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa'
import { useSavedItems } from '../../_context/SavedContext'

interface SavedItemButtonProps {
  productId: string
}

const SaveItemButton:React.FC<SavedItemButtonProps> = ({ productId }) => {
  const { isItemSaved, addToSavedItems, removeFromSavedItems } = useSavedItems();



  const handleSaveItem = async () => {
    if(!isItemSaved(productId)){
      addToSavedItems(productId)
    } else {
      removeFromSavedItems(productId)
    }
  }

  return (
    <button onClick={handleSaveItem} className={styles.buttonContainer}>
      {isItemSaved(productId) ? <FaHeart size={24} style={{ color: 'red' }}/>:
      <Heart size={24} />}
    </button>
  )
}

export default SaveItemButton