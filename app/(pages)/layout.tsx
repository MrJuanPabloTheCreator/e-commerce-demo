import Footer from "./_components/_Footer/footer";
import PagesNavbar from "./_components/_Navbar/pagesNavbar";
import { CartProvider } from "./_context/CartContext";
import { SavedItemsProvider } from "./_context/SavedContext";
import styles from "./layout.module.css"

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

  return (
    <main>
      <CartProvider>
        <SavedItemsProvider>
          <section className={styles.content}>
            <PagesNavbar/>
            {children}
          </section>
        </SavedItemsProvider>
      </CartProvider>
      <Footer/>
    </main>
  )
}

export default PagesLayout