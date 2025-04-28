import { amazonPayClient, webStoreClient } from '@/utils/server/amazonClients'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === 'GET') {
			return getCheckoutSession(req, res)
		}
		if (req.method === 'POST') {
			return createCheckoutSession(req, res)
		}
		res.setHeader('Allow', ['GET', 'POST'])
		return res.status(400).json({ error: `${req.method} requests are not allowed` })
	} catch (error) {
		console.error('Error processing checkout session:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
}

async function getCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
	const { amazonCheckoutSessionId } = req.query
	if (!amazonCheckoutSessionId) {
		return res.status(400).json({ error: 'amazonCheckoutSessionId is required' })
	}

	const response = await webStoreClient.getCheckoutSession(amazonCheckoutSessionId)

	//TODO: Handle the response and update the checkout session in your database if needed
	// Handle update price
	const payload = {
		merchantMetadata: {
			merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
			merchantStoreName: 'AmazonTestStoreFront',
			noteToBuyer: 'merchantNoteForBuyer',
			customInformation: ''
		}
	}
	const updateSessionResponse = await webStoreClient.updateCheckoutSession(amazonCheckoutSessionId, payload)
	res.status(200).json(response.data)
}

async function createCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
	const { originUrl, product } = req.body
	if (!originUrl) {
		res.status(400).json({ error: 'originUrl is required' })
		return
	}
	if (!product) {
		res.status(400).json({ error: 'product is required' })
		return
	}
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ error: `Method ${req.method} not allowed` })
		return
	}

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
	// const signature = amazonPayClient.generateButtonSignature(payload)
	const signature = amazonPayClient.generateButtonSignature(payload)
	const payloadJSON = JSON.stringify(payload)

	res.status(200).json({ signature, payloadJSON, price: product.price.toFixed(2) })
}
