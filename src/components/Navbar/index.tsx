import styles from './Navbar.module.scss'

export default function Navbar() {
	return (
        <nav className={styles.navbar}>
            <div className={styles["navbar-brand"]}>My Store</div>
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
