import styles from './Navbar.module.scss'
import { useRouter } from 'next/router'

export default function Navbar() {
    const router = useRouter()
    const handleHomeClick = (event: React.MouseEvent) => {
        event.preventDefault()
        router.push('/')
    }
	return (
        <nav className={styles.navbar}>
            <a className={styles["navbar-brand"]} href='/' onClick={handleHomeClick}>My Store</a>
            <ul className={styles["navbar-menu"]}>
                <li className={styles["navbar-item"]}>
                    <a href="#home">Home</a>
                </li>
                <li className={styles["navbar-item"]}>
                    <a href="#about">About</a>
                </li>
                <li className={styles["navbar-item"]}>
                    <a href="#contact">Contact</a>
                </li>
            </ul>
        </nav>
	)
}
