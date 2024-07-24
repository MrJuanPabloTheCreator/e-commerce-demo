
import styles from "./skeletonCard.module.css"

const SkeletonCard = () => {
  return (
    <div className={styles.skeletonCard}>
        <span className={styles.skeleton} style={{ height: '10rem', width:'100%' }}/>
        <span className={styles.skeleton} style={{ height: '1rem', width:'100%' }}/>
        <span className={styles.skeleton} style={{ height: '1rem', width:'80%' }}/>
        <span className={styles.skeleton} style={{ height: '1rem', width:'30%' }}/>
    </div>
  )
}

export default SkeletonCard