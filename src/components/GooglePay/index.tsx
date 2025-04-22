import GooglePayButton, { ReadyToPayChangeResponse } from '@google-pay/button-react'
import { useRouter } from 'next/router'

interface IGooglePayProps {
	price: number
}

export default function GooglePay(props: IGooglePayProps) {
	const { price } = props
	const router = useRouter()

	const handleLoadPaymentData = (paymentData: google.payments.api.PaymentData) => {
		console.log('Load payment data', paymentData)
		router.push('/thankyou')
	}

	const handlePaymentAuthorized = (paymentData: google.payments.api.PaymentData) => {
		console.log('Payment Authorized Success', paymentData)
		return { transactionState: 'SUCCESS' as google.payments.api.TransactionState }
	}

	const handlePaymentDataChanged = (paymentData: google.payments.api.IntermediatePaymentData) => {
		console.log('Payment Data Changed', paymentData)
		let finalPrice = price
		if (paymentData.shippingAddress?.countryCode === 'CA') {
			finalPrice += 1
		}
		return Promise.resolve({
			newTransactionInfo: {
				totalPriceStatus: 'FINAL',
				totalPrice: finalPrice.toFixed(2)
			}
		} as google.payments.api.PaymentDataRequestUpdate)
	}

	const handleReadyToPayChange = (result: ReadyToPayChangeResponse) => {
		console.log('Ready to Pay Change', result)
		if (!result.paymentMethodPresent) {
			console.error('There is no payment method present')
		} else if (!result.isButtonVisible) {
			console.log('Button is not visible')
		} else if (result.isReadyToPay) {
			console.log('Ready to Pay')
		}
		else {
			console.log('Not Ready to Pay')
		}
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
						gateway: 'stripe',
						'stripe:version': '2018-11-31',
						'stripe:publishableKey':
							'pk_test_51HyAhmDb09aRJdbR4ZEiy1vw2wmcOQvO9VhTc2g9Nc1vGmR6nIm0JSWDeOeAKSG8cVkrlAMIlIJdJiV2OVqpSGmv00YVIPZGXy'
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
		},
		shippingAddressRequired: true,
		shippingAddressParameters: {
			allowedCountryCodes: ['US', 'CA'],
			phoneNumberRequired: true
		},
		callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS']
	} satisfies google.payments.api.PaymentDataRequest

	return (
		<GooglePayButton
			buttonType="checkout"
			buttonSizeMode="fill"
			environment="TEST"
			paymentRequest={paymentRequest}
			onLoadPaymentData={handleLoadPaymentData}
			existingPaymentMethodRequired={false}
			onPaymentAuthorized={handlePaymentAuthorized}
			onPaymentDataChanged={handlePaymentDataChanged}
			onReadyToPayChange={handleReadyToPayChange}
		/>
	)
}
