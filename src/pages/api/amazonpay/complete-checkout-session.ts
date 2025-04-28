import { webStoreClient } from '@/utils/server/amazonClients'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		return res.status(400).json({ error: `${req.method} requests are not allowed` })
	}
	const { amazonCheckoutSessionId } = req.body

	const response = await webStoreClient.getCheckoutSession(amazonCheckoutSessionId)
	const checkoutSession = response.data as CheckoutSession
	if (checkoutSession.statusDetails.state === 'Open') {
		try {
			const { chargeAmount } = checkoutSession.paymentDetails
			await webStoreClient.completeCheckoutSession(amazonCheckoutSessionId, { chargeAmount })
		} catch (error) {
			res.status(201).json({})
		}
		res.status(201).json({})
	} else {
		res.status(201).json({})
	}
}
