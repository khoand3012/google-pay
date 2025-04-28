import { getCheckoutSession } from '@/services'
import React, { use, useEffect } from 'react'
import styles from '@/styles/CheckoutReviewPage.module.scss'
import { useAmazonPayScript } from '@/utils/client'
import Head from 'next/head'
type CheckoutReviewPageProps = {
	checkoutSession: CheckoutSession
}

export async function getServerSideProps({ query }: { query: { amazonCheckoutSessionId: string } }) {
	const checkoutSession = await getCheckoutSession(query.amazonCheckoutSessionId)
	return {
		props: {
			checkoutSession
		}
	}
}

export default function CheckoutReviewPage(props: CheckoutReviewPageProps) {
	const { checkoutSession } = props
	const { shippingAddress, billingAddress, paymentPreferences, paymentDetails } = checkoutSession
	const isScriptLoaded = useAmazonPayScript()
	useEffect(() => {
		if (!isScriptLoaded) return
		if (!window.amazon && !window.amazon.Pay) return
		window.amazon.Pay.bindChangeAction('#change-address', {
			amazonCheckoutSessionId: checkoutSession.checkoutSessionId,
			changeAction: 'changeAddress'
		})
		window.amazon.Pay.bindChangeAction('#change-payment', {
			amazonCheckoutSessionId: checkoutSession.checkoutSessionId,
			changeAction: 'changePayment'
		})
	}, [isScriptLoaded])

	function handleSubmitOrders(event: React.MouseEvent) {
		event.stopPropagation()
		event.preventDefault()
		if (!window.amazon || !window.amazon.Pay) return
		const { amazonPayRedirectUrl } = checkoutSession.webCheckoutDetails
		if (amazonPayRedirectUrl) {
			window.location.href = amazonPayRedirectUrl
		}
	}

	return (
		<>
			<Head>
				<title>Checkout Review Page</title>
				<meta name="description" content="Checkout Review Page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles['checkout-review-page']}>
				<h1>Checkout Review Page</h1>
				<div className={styles['checkout-addresses']}>
					<div className={styles['shipping-address']}>
						<h2>Shipping Address</h2>
						<div className={styles['separator']}></div>
						<span>{shippingAddress.name}</span>
						<span>{shippingAddress.addressLine1}</span>
						{shippingAddress.addressLine2 && <span>{shippingAddress.addressLine2}</span>}
						{shippingAddress.addressLine3 && <span>{shippingAddress.addressLine3}</span>}
						<button id="change-address" className={styles['change']}>
							&gt; Change billing/shipping address
						</button>
					</div>
					{billingAddress && (
						<div className={styles['billing-address']}>
							<h2>Billing Address</h2>
							<div className={styles['separator']}></div>
							<span>{billingAddress.name}</span>
							<span>{billingAddress.addressLine1}</span>
							{billingAddress.addressLine2 && <span>{billingAddress.addressLine2}</span>}
							{billingAddress.addressLine3 && <span>{billingAddress.addressLine3}</span>}
						</div>
					)}
				</div>
				<div className={styles['payment-method']}>
					<h2>Payment Method</h2>
					<div className={styles['separator']}></div>
					<span>Current Selection: Amazon Pay</span>
					{paymentPreferences &&
						paymentPreferences.length > 0 &&
						paymentPreferences.map((paymentPreference, index) => (
							<div key={index}>
								<span>{paymentPreference.paymentDescriptor}</span>
							</div>
						))}
					<button id="change-payment" className={styles['change']}>
						&gt; Change payment method
					</button>
				</div>
				<div className={styles['order-summary']}>
					<h2>Order Summary</h2>
					<div className={styles['separator']}></div>
					<span>
						{`Order Total: ${paymentDetails.chargeAmount?.amount} ${paymentDetails.chargeAmount?.currencyCode}`}
					</span>
					<span>Shipping: XXXXXX</span>
					<span>Net Total: XXXXXX</span>
					<span>
						<b>
							{`Grand Total: ${paymentDetails.chargeAmount?.amount} ${paymentDetails.chargeAmount?.currencyCode}`}
						</b>
					</span>
				</div>

				<button className={styles['submit-order']} onClick={handleSubmitOrders}>
					Submit Order
				</button>
			</div>
		</>
	)
}
