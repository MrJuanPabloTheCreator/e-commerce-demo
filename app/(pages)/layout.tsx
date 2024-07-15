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
    </main>
  )
}

export default PagesLayout