
import { auth } from "@/auth";
import LeftNavbar from "./_components/leftNavbar";
import TopNavbar from "./_components/topNavbar";

import styles from './layout.module.css'
import { redirect } from 'next/navigation';

const PagesLayout = async ({
    children,
}:{
    children: React.ReactNode;
}) => {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        redirect('/auth/sign-in');
    }

    return (
        <main className={styles.container}>
            <TopNavbar />
            <div className={styles.content}>
                <LeftNavbar/>
                {children}
            </div>
        </main>
    )
}

export default PagesLayout