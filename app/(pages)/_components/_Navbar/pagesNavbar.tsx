"use client"

import { CircleUserRound, Heart, Search, ShoppingCart, SlidersHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"

import UserButton from "../_UserButton/userButton"
import Cart from "../_Cart/cart"
import Filter from "../_Filter/filter"
import { categories } from "@/constants"
import styles from "./navbar.module.css"

const PagesNavbar = () => {
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

      <section className={styles.topNavbarContainer}>
        <Link className={styles.leftSideTopNav} href={'/'}>
          <h1>Paw</h1>
          <div className={styles.imageContainer}>
            <Image src={'/logo2.png'} alt="Store Logo" fill className={styles.logoImage}/>
          </div>
          <h1>Paradise</h1>
        </Link>
        <div className={styles.searchbar}>
          <input 
            className={styles.searchbar}
            placeholder="Search"
          />
          <Search />
        </div>
        <div className={styles.rightSideTopNav}>
          <button className={styles.rightNavButton} onClick={() => router.push('/saved-items')}>
            <Heart size={24}/>
            <p className={styles.rightNavP}>Saved Items</p>
          </button>
          <UserButton user={session?.user} setActiveAction={setActiveAction} activeAction={activeAction}/>
          <Cart setActiveAction={setActiveAction} activeAction={activeAction}/>
        </div>
      </section>

      <section className={styles.bottomNavbarContainer}>
        <nav className={styles.categories}>
          {categories.map((category, index) => 
            <button onClick={() => setActiveNav(category.id)}  key={index} style={category.id === Number(selectedCategory) ? { backgroundColor: '#6D326D', color: 'white' } : {}}>
              {category.name}
            </button>
          )}
        </nav>
      </section>

    </div>
  )
}

export default PagesNavbar