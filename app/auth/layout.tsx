
import styles from "./layout.module.css"

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={styles.layoutContainer} style={{ backgroundImage: "url('/b-image4.jpeg')", 
      backgroundSize: 'cover', backgroundPosition: 'center', width: '100%',height: '100vh',}}
    >
      {children}
    </div>
  );
}

export default AuthLayout;