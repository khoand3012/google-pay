import { webStoreClient } from '@/utils/server/amazonClients'
import { NextApiRequest, NextApiResponse } from 'next'
// import { v4 as uuidv4 } from 'uuid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method === 'GET') {
			const { amazonCheckoutSessionId } = req.query
			if (!amazonCheckoutSessionId) {
				return res.status(400).json({ error: 'amazonCheckoutSessionId is required' })
			}

			const response = await webStoreClient.getCheckoutSession(amazonCheckoutSessionId)
			// Handle update price
			// const payload = {
			// 	merchantMetadata: {
			// 		merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
			// 		merchantStoreName: 'AmazonTestStoreFront',
			// 		noteToBuyer: 'merchantNoteForBuyer',
			// 		customInformation: ''
			// 	}
			// }
			// await webStoreClient.updateCheckoutSession(amazonCheckoutSessionId, payload)
			return res.status(200).json(response.data)
		} else {
			res.setHeader('Allow', ['GET'])
			return res.status(405).json({ error: `Method ${req.method} not allowed` })
		}
	} catch (error) {
		console.error('Error processing checkout session:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
}
