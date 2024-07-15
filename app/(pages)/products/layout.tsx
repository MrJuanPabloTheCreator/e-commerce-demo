import styles from "./layout.module.css"

const ProductsLayout = ({
    children,
}:{
    children: React.ReactNode;
}) => {

  return (
    <main>
        {children}
    </main>
  )
}

export default ProductsLayout