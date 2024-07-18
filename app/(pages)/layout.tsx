import Footer from "./_components/_Footer/footer";
import PagesNavbar from "./_components/_Navbar/pagesNavbar";
import { CartProvider } from "./_context/CartContext";
import styles from "./layout.module.css"

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

  return (
    <main>
      <CartProvider>
        <section className={styles.content}>
          <PagesNavbar/>
          {children}
        </section>
      </CartProvider>
      <Footer/>
    </main>
  )
}

export default PagesLayout