type PayloadAndSignatureResponse = {
	payloadJSON: string
	signature: string
	price: string
}

type FinalizeCheckoutSessionResquest = {
	amazonCheckoutSessionId: string
	billingAddress: Address
	paymentDescriptor: string
}

export async function getAmazonButtonData(originUrl: string, product: Product): Promise<PayloadAndSignatureResponse> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/checkout-session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ product, originUrl })
	})
	if (!response.ok) {
		throw new Error('Failed to fetch button payload and signature')
	}
	const payloadAndSignatureResponse = await response.json()
	return payloadAndSignatureResponse
}

type CheckoutSessionResponse = CheckoutSession

export async function getCheckoutSession(amazonCheckoutSessionId: string): Promise<CheckoutSessionResponse> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/checkout-session?amazonCheckoutSessionId=${amazonCheckoutSessionId}`,
		{
			method: 'GET'
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch checkout session')
	}
	const checkoutSessionResponse = await response.json()
	return checkoutSessionResponse as CheckoutSessionResponse
}

export async function completeCheckoutSession(amazonCheckoutSessionId: string): Promise<any> {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/complete-checkout-session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			amazonCheckoutSessionId
		})
	})
	if (!response.ok) {
		throw new Error('Failed to complete checkout session')
	}
	const completeCheckoutSessionResponse = await response.json()
	return completeCheckoutSessionResponse
}

export async function finalizeCheckoutSession(payload: FinalizeCheckoutSessionResquest) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/amazonpay/finalize-checkout-session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})
	if (!response.ok) {
		throw new Error('Failed to complete checkout session')
	}
	const finalizeCheckoutSessionResponse = await response.json()
	return finalizeCheckoutSessionResponse
}
