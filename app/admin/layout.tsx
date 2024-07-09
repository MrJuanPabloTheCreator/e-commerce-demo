
import LeftNavbar from "./_components/leftNavbar";
import TopNavbar from "./_components/topNavbar";

import styles from './layout.module.css'

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

    return (
        <main className={styles.container}>
            <TopNavbar/>
            <div className={styles.content}>
                <LeftNavbar/>
                {children}
            </div>
        </main>
    )
}

export default PagesLayout