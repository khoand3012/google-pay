import React from 'react'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import styles from './Footer.module.scss'

export default function Footer() {
	return (
		<footer className={styles['footer']}>
			<p>&copy; {new Date().getFullYear()} Khoa Nguyen. All rights reserved.</p>
			<div className={styles['social-media-icons']}>
				<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
					<Facebook />
				</a>
				<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
					<Twitter />
				</a>
				<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
					<Instagram />
				</a>
			</div>
		</footer>
	)
}
