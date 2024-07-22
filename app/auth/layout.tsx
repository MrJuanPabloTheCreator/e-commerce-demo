
import { Metadata } from "next";
import styles from "./layout.module.css"

export const metadata: Metadata = {
  title: "Auth"
};

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className={styles.layoutContainer} style={{ backgroundImage: "url('/auth-background-image.jpeg')", 
      backgroundSize: 'cover', backgroundPosition: 'center calc(100% + 135px)', width: '100%',height: '100vh'}}
    >
      {children}
    </div>
  );
}

export default AuthLayout;