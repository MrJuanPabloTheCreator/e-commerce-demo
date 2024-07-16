import Footer from "./_components/_Footer/footer";
import PagesNavbar from "./_components/_Navbar/pagesNavbar";
import styles from "./layout.module.css"

const PagesLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

  return (
    <main>
        <PagesNavbar/>
        {children}
        <Footer/>
    </main>
  )
}

export default PagesLayout