"use client"

import { CircleUserRound, Heart, Menu, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"

import { categories } from "@/constants"
import styles from "./navbar.module.css"
import UserButton from "../../_components/_UserButton/userButton"
import Cart from "../../_components/_Cart/cart"

const MobileNavbar = () => {
  const [activeMenu, setActiveMenu] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState<number | null>(null)

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('c')
  const page = searchParams.get('page')

  useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      if(activeNav){
        params.set("c", String(activeNav));
        params.set("page", String(0))
        router.push(`/products?${params}`)
      }
  }, [activeNav])

  const handleGetSession = async () => {
    const updatedSession = await getSession();
    setSession(updatedSession)
  }

  useEffect(() => {
      handleGetSession();     
  }, []);

  return (
    <div className={styles.navbarContainer}>

      <section className={styles.navbarContent}>
        <button className={styles.menuButton} onClick={() => setActiveMenu(!activeMenu)}>
          <Menu size={24}/>
        </button>

        <Link className={styles.logoContainer} href={'/'}>
          <h1>Paw</h1>
          <div className={styles.imageContainer}>
            <Image src={'/logo2.png'} alt="Store Logo" fill className={styles.logoImage}/>
          </div>
          <h1>Paradise</h1>
        </Link>

        <div className={styles.rightSideContent}>
          <button className={styles.heartButton} onClick={() => router.push('/saved-items')}>
            <Heart size={24}/>
            <p>Saved Items</p>
          </button>
          <UserButton user={session?.user} setActiveAction={setActiveAction} activeAction={activeAction}/>
          <Cart setActiveAction={setActiveAction} activeAction={activeAction}/>
        </div>
      </section>

      <section className={`${styles.menuContainer} ${activeMenu ? styles.open : styles.close}`}>
        <header className={styles.menuHeader}>
          <div className={styles.menuLogo}>
            <h1>Paw</h1>
            <div className={styles.imageContainer}>
              <Image src={'/logo2.png'} alt="Store Logo" fill className={styles.logoImage}/>
            </div>
            <h1>Paradise</h1>
          </div>
          <button onClick={() => setActiveMenu(false)}>
            <X size={24}/>
          </button>
        </header>
        <nav className={styles.categories}>
          <button onClick={() => (setActiveNav(null), setActiveMenu(false), router.push('/'))}>
            Home
          </button>
          {categories.map((category, index) => 
            <button onClick={() => (setActiveNav(category.id), setActiveMenu(false))}  key={index} style={category.id === Number(selectedCategory) ? { backgroundColor: '#6D326D', color: 'white' } : {}}>
              {category.name}
            </button>
          )}
        </nav>
      </section>  
      
    </div>
  )
}

export default MobileNavbar