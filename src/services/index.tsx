type PayloadAndSignatureResponse = {
	payloadJSON: string
	signature: string
	price: string
}

export async function getAmazonButtonData(originUrl: string, productId: string): Promise<PayloadAndSignatureResponse> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/generate-payload?originUrl=${originUrl}&productId=${productId}`, {
		method: 'GET'
	})
	if (!response.ok) {
		throw new Error('Failed to fetch button payload and signature')
	}
	const payloadAndSignatureResponse = await response.json()
	return payloadAndSignatureResponse
}

type CheckoutSessionResponse = CheckoutSession

export async function getCheckoutSession(amazonCheckoutSessionId: string): Promise<CheckoutSessionResponse> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/checkout-session?amazonCheckoutSessionId=${amazonCheckoutSessionId}`, {
		method: 'GET'
	})
	if (!response.ok) {
		throw new Error('Failed to fetch checkout session')
	}
	const checkoutSessionResponse = await response.json()
	return checkoutSessionResponse as CheckoutSessionResponse
}
