"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from "./paginator.module.css"
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginatorProps {
    disableNext: boolean;
}

const Paginator:React.FC<PaginatorProps> = ({disableNext}) => {
    const [activePage, setActivePage] = useState<number>(0)
    const router = useRouter();
    const searchParams = useSearchParams();
    const path = usePathname();
    const offset = searchParams.get('page');

    const handlePageChange = (number: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(activePage + number));
        router.push(`${path}?${params.toString()}`)
    }

    useEffect(() => {
        if(offset){
            setActivePage(Number(offset))
        }
    }, [offset])

    return (
        <div className={styles.pagesNavigatorContainer}>
            <div className={styles.navigatorContent}>
                <button className={styles.navigatorContentButton} disabled={activePage === 0} onClick={() => handlePageChange(-1)}>
                    <ChevronsLeft size={32}/>
                </button>
                <div className={styles.numberContainer}>
                    {activePage > 0 && 
                        <button className={styles.navigatorContentNumbers} onClick={() => handlePageChange(-1)}>
                            {(activePage)}
                        </button>
                    }
                    <button className={styles.navigatorContentNumbers} style={{ backgroundColor: '#6D326D', color: 'white'}}>
                        {(activePage) + 1}
                    </button>
                    {!disableNext &&
                        <button className={styles.navigatorContentNumbers} onClick={() => handlePageChange(1)}>
                            {(activePage) + 2}
                        </button>
                    }
                </div>
                <button className={styles.navigatorContentButton} onClick={() => handlePageChange(1)} disabled={disableNext}>
                    <ChevronsRight size={32}/>
                </button>
            </div>
        </div>
    )
}

export default Paginator;