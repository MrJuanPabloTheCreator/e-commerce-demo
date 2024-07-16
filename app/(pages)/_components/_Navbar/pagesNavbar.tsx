"use client"

import { CircleUserRound, Heart, Search, ShoppingCart, SlidersHorizontal } from "lucide-react"
import styles from "./navbar.module.css"
import { useEffect, useState } from "react"
import Filter from "../_Filter/filter"
import { categories } from "@/constants"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import CartDropdown from "../_CartDropdown/cart"
import UserButton from "../_UserButton/userButton"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"

const PagesNavbar = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [displayFilters, setDisplayFilters] = useState(false)
  const [activeNav, setActiveNav] = useState<number | null>(null)

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('c')

  useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("c", String(activeNav));
      router.push(`/products?${params}`)
  }, [activeNav])

  const handleGetSession = async () => {
    const updatedSession = await getSession();
    setSession(updatedSession)
    console.log(updatedSession)
  }

  useEffect(() => {
      handleGetSession();     
  }, []);

  return (
    <div className={styles.navbarContainer}>

      <section className={styles.topNavbarContainer}>
        <Link className={styles.leftSideTopNav} href={'/home'}>
          <h1>Paw</h1>
          <div className={styles.imageContainer}>
            <Image src={'/logo2.png'} alt="Store Logo" width={50} height={50} className={styles.logoImage}/>
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
          <Heart size={24}/>
          <UserButton user={session?.user}/>
          <button className={styles.shoppingCart} onClick={() => setActiveAction(activeAction === 'cart' ? null : 'cart')}>
            <ShoppingCart size={24}/>
          </button>
          {activeAction === 'cart' && <CartDropdown />}
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
        {/* <button className={styles.filterToggleButton} onClick={() => setDisplayFilters(!displayFilters)}>
          {displayFilters ? 'Hide Filters':'Show Filters'}
          <SlidersHorizontal size={20} />
        </button> */}
        {displayFilters && (
          <div className={styles.filtersContainer}>
            <Filter/>
          </div>
        )}
      </section>

    </div>
  )
}

export default PagesNavbar