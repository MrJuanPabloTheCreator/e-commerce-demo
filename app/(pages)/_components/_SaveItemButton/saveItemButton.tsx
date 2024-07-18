"use client"

import { Heart } from 'lucide-react'
import styles from "./savedItemButton.module.css"
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa'

interface SavedItemButtonProps {
  productId: string
  isSaved: any;
}

const SaveItemButton:React.FC<SavedItemButtonProps> = ({productId, isSaved}) => {
  const [saved, setSaved] = useState<boolean>(isSaved)

  const handleSaveItem = async () => {
    const updatedSession = await getSession();
    if(updatedSession?.user.id){
      if(!saved){
        const saveItemResponse = await fetch(`/api/user/${updatedSession?.user.id}/saved-items`, {
          method: 'POST',
          body: JSON.stringify({productId})
        })
        const { success } = await saveItemResponse.json()
        if(success){
          setSaved(true)
        } else {
          toast.error('Couldnt save')
        }
      } else {
        const saveItemResponse = await fetch(`api/user/${updatedSession?.user.id}/saved-items`, {
          method: 'DELETE',
          body: JSON.stringify({productId})
        })
        const { success } = await saveItemResponse.json()
        if(success){
          setSaved(false)
        } else {
          toast.error('Couldnt unsave')
        }
      }
    } else {
      // No user save local storage
    }
  }

  return (
    <button onClick={handleSaveItem} className={styles.buttonContainer}>
      {saved ? <FaHeart size={24} style={{ color: 'red' }}/>:
      <Heart size={24} />}
    </button>
  )
}

export default SaveItemButton