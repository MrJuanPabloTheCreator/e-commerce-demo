import PagesNavbar from "./_components/pagesNavbar";
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