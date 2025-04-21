import Image from 'next/image'
import styles from '@/styles/ProductPage.module.scss'
import { createPortal } from 'react-dom'
import Toast from '@/components/Toast'
import { useState } from 'react'
interface IProductPageProps {
	product: Product
}

export async function getStaticPaths() {
	const products = await fetch('https://dummyjson.com/products?limit=6')
		.then(res => res.json())
		.then(data => data.products)
	const paths = products.map((product: Product) => ({
		params: { id: product.id.toString() }
	}))
	return {
		paths,
		fallback: true // false or "blocking"
	}
}

export async function getStaticProps(context: any) {
	const { params } = context
	const { id } = params
	const product = await fetch(`https://dummyjson.com/products/${id}`)
		.then(res => res.json())
		.catch(err => console.error(err))

	return {
		props: { product },
		revalidate: 10
	}
}

export default function ProductPage({ product }: IProductPageProps) {
	const [displayToast, setDisplayToast] = useState(false)
	const handleAddToCart = (event: React.MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
		setDisplayToast(true)
	}
	if (!product) return <div>Loading...</div>
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
			<div className={styles['product-page']}>
				<div className={styles['product-image-container']}>
					<Image
						src={product.images[0]}
						alt={product.title}
						height={450}
						width={450}
						placeholder="blur"
						blurDataURL={product.thumbnail}
					/>
				</div>
				<div className={styles['product-data']}>
					<h1 className={styles['product-title']}>{product.title}</h1>
					<p className={styles['product-description']}>{product.description}</p>
					<p className={styles['product-price']}>${product.price}</p>
					<p className={styles['product-category']}>{product.category}</p>
					<p className={styles['product-stock']}>{product.stock} in stock</p>
					<button onClick={handleAddToCart} className={styles['add-to-cart']}>Add to Cart</button>
				</div>
			</div>
		</>
	)
}
