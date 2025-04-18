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
	return (
		<div className="product-page">
			<h1>Product Page</h1>
			<p>Product ID: {product.id}</p>
			<p>Product Name: {product.title}</p>
		</div>
	)
}
