
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
    <div className={styles.layoutContainer}>
      {children}
    </div>
  );
}

export default AuthLayout;