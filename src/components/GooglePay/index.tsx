import GooglePayButton from '@google-pay/button-react'

interface IGooglePayProps {
	price: number
}

export default function GooglePay(props: IGooglePayProps) {
	const { price } = props

	const handleLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
		console.log('load payment data', paymentData)
	}

	const paymentRequest = {
		apiVersion: 2,
		apiVersionMinor: 0,
		merchantInfo: {
			merchantId: '',
			merchantName: ''
		},
		allowedPaymentMethods: [
			{
				type: 'CARD',
				parameters: {
					allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
					allowedCardNetworks: ['MASTERCARD', 'VISA']
				},
				tokenizationSpecification: {
					type: 'PAYMENT_GATEWAY',
					parameters: {
						gateway: 'example',
						merchantId: ''
					}
				}
			}
		],
		transactionInfo: {
			totalPriceStatus: 'FINAL',
			totalPriceLabel: 'Total',
			totalPrice: price.toFixed(2),
			currencyCode: 'USD',
			countryCode: 'US'
		}
	} satisfies google.payments.api.PaymentDataRequest

	return (
		<GooglePayButton
			buttonType="checkout"
            buttonSizeMode='fill'
			environment="TEST"
			paymentRequest={paymentRequest}
			onLoadPaymentData={handleLoadPaymentData}
		/>
	)
}
