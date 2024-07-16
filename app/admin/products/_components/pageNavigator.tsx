"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from "./_styles/pageNavigator.module.css"

const PageNavigator = () => {
    const [activePage, setActivePage] = useState<number>(0)
    const router = useRouter();
    const searchParams = useSearchParams();
    const offset = searchParams.get('page');

    const handlePageChange = (number: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(activePage + number));
        router.push(`/admin/products?${params.toString()}`)
    }

    useEffect(() => {
        if(offset){
            setActivePage(Number(offset))
        }
    }, [offset])

    return (
        <div className={styles.pagesNavigatorContainer}>
            <div className={styles.navigatorContent}>
                <button className={styles.navigatorContentButton} disabled={activePage === 0} onClick={() => handlePageChange(-10)}>Back</button>
                <div className={styles.numberContainer}>
                    {activePage > 0 && 
                        <button className={styles.navigatorContentNumbers} onClick={() => handlePageChange(-10)}>
                            {(activePage/10)}
                        </button>
                    }
                    <button className={styles.navigatorContentNumbers} style={{ backgroundColor: 'black', color: 'white'}}>
                        {(activePage/10) + 1}
                    </button>
                    <button className={styles.navigatorContentNumbers} onClick={() => handlePageChange(10)}>
                        {(activePage/10) + 2}
                    </button>
                </div>
                <button className={styles.navigatorContentButton} onClick={() => handlePageChange(10)}>Next</button>
            </div>
        </div>
    )
}

export default PageNavigator