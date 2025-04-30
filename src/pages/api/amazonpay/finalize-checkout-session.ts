import { webStoreClient } from '@/utils/server/amazonClients'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		return res.status(400).json({ error: `${req.method} requests are not allowed` })
	}
	const { amazonCheckoutSessionId, billingAddress, paymentDescriptor } = req.body

	const response = await webStoreClient.getCheckoutSession(amazonCheckoutSessionId)
	const checkoutSession = response.data as CheckoutSession
	if (checkoutSession.statusDetails.state === 'Open') {
		try {
			const { chargeAmount } = checkoutSession.paymentDetails
			const headers = {
				'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
			}

			await webStoreClient.finalizeCheckoutSession(
				amazonCheckoutSessionId,
				{
					billingAddress,
                    shippingAddress: checkoutSession.shippingAddress,
					chargeAmount,
                    paymentIntent: 'AuthorizeWithCapture'
				},
				headers
			)
		} catch (error) {
			res.status(202).send({ status: 'ok' })
		}
		res.status(202).send({ status: 'ok' })
	} else {
		res.status(202).send({ status: 'ok' })
	}
}
