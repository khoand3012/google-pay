import Image from 'next/image'
import styles from './ProductCard.module.scss'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Toast from '../Toast'
import { useRouter } from 'next/router'

interface IProductCardProps {
	product: Product
}

export default function ProductCard({ product }: IProductCardProps) {
	const [displayToast, setDisplayToast] = useState(false)
	const router = useRouter()

	const handleAddToCart = (event: React.MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setDisplayToast(true)
	}

	const handleClickProductLink = (event: React.MouseEvent) => {
		event.preventDefault()
		router.push(`/product/${product.id}`)
	}


	return (
		<>
			{displayToast &&
				createPortal(
					<Toast
						message={`${product.title} has been added to your cart`}
						duration={3500}
						onClose={() => setDisplayToast(false)}
						type="success"
					/>,
					document.body
				)}
			<a className={styles['product-card']} onClick={handleClickProductLink} href={`/product/${product.id}`}>
				<Image
					className={styles['product-image']}
					alt={product.title}
					src={product.thumbnail}
					width={200}
					height={200}
					placeholder='blur'
					blurDataURL={product.thumbnail}
					fill={false}
				></Image>
				<h2 className={styles['product-title']}>{product.title}</h2>
				{product.tags && (
					<div className={styles['product-tag-container']}>
						{product.tags.map((tag, index) => (
							<span key={index} className={styles['product-tag']}>
								{tag}
							</span>
						))}
					</div>
				)}
				<p className={styles['product-price']}>${product.price}</p>
				<button onClick={handleAddToCart} className={styles['add-to-cart-button']}>
					Add to Cart
				</button>
			</a>
		</>
	)
}
