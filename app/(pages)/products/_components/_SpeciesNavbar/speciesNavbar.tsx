"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { species } from "@/constants"
import styles from "./speciesNavbar.module.css"

const SpeciesNavbar = () => {
    const [activeSpecie, setActiveSpecie] = useState<string | null>(null)

    const router = useRouter();
    const searchParams = useSearchParams();
    const specieSelected = searchParams.get('specie');

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if(activeSpecie){
            params.set("specie", activeSpecie);
        } else {
            params.delete("specie");
        }

        router.push(`/products?${params}`)
    }, [activeSpecie, searchParams, router])

    return (
        <div className={styles.speciesContainer}>
            {species.map((specie, index) => 
                <button 
                    key={index}
                    className={styles.specieCard} 
                    onClick={() => setActiveSpecie(activeSpecie === specie.name ? null: specie.name)} 
                    style={specieSelected === specie.name ? { backgroundColor: '#6D326D', color: 'white' } : { backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#6D326D' }}
                >
                    <div key={index} className={styles.specieImageContainer}>
                        <Image src={species[index].image} fill alt="image" className={styles.specieImage}/>
                    </div>
                    <h4>{specie.name}</h4>
                </button>
            )}
        </div>
    )
}

export default SpeciesNavbar