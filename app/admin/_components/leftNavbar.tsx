import Link from "next/link"
import { Lamp, LayoutDashboard, Truck } from "lucide-react"

import styles from "./leftNavbar.module.css"


const leftNavbarOption = [
  { label: "Dashboard", value: "dashboard", icon: <LayoutDashboard size={24}/> },
  { label: "Products", value: "products", icon: <Lamp size={24}/> },
  { label: "Orders", value: "orders", icon: <Truck size={24}/> }
]

const LeftNavbar = () => {

  return (
    <div className={styles.container}>
      {leftNavbarOption.map((option, index) => (
        <Link key={index} href={`/admin/${option.value}`} className={styles.button} >
          <span>{option.icon}</span>
          <p>{option.label}</p>
        </Link>
      ))}
    </div>
  )
}

export default LeftNavbar