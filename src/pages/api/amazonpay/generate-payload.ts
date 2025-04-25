import type { NextApiRequest, NextApiResponse } from 'next'
import { amazonPayClient } from '@/utils/server/amazonClients'

type ResponseData = {
	payloadJSON?: string
	signature?: string
	price?: string
	error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const { originUrl } = req.query
	if (!originUrl) {
		res.status(400).json({ error: 'originUrl is required' })
		return
	}
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET'])
		res.status(405).json({ error: `Method ${req.method} not allowed` })
		return
	}
	const product: Product = await fetch(`https://dummyjson.com/products/${req.query.productId}`)
		.then(res => res.json())
		.catch(err => console.error(err))
	const payload = {
		webCheckoutDetails: {
			checkoutResultReturnUrl: `${originUrl}/thankyou`,
			checkoutReviewReturnUrl: `${originUrl}/checkout/review`
		},
		storeId: process.env.NEXT_PUBLIC_AMZ_STORE_ID,
		paymentDetails: {
			paymentIntent: 'AuthorizeWithCapture',
			chargeAmount: {
				amount: product.price.toFixed(2),
				currencyCode: 'USD'
			}
		}
	} as CheckoutSessionPayload
	const signature = amazonPayClient.generateButtonSignature(payload)
	const payloadJSON = JSON.stringify(payload)

	res.status(200).json({ signature, payloadJSON, price: product.price.toFixed(2) })
}
