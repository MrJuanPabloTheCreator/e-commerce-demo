"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

import { Product } from "@/types"
import ProductCard from "../_components/_ProductCard/productCard"
import styles from "./page.module.css"
import ProductListing from "../_components/_ProductListing/productListing";

const HomePage = () => {

  return (
    <div>
      <ProductListing/>
    </div>
  )
}

export default HomePage