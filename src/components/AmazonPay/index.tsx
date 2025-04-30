import { finalizeCheckoutSession, getAmazonButtonData } from '@/services'
import { useEffect } from 'react'
import styles from './AmazonPay.module.scss'
import { useAmazonPayScript } from '@/utils/client'
import { useRouter } from 'next/router'

type AmazonPayButtonProps = {
	product: Product
	onCheckoutComplete: () => void
}

export default function AmazonPayButton(props: AmazonPayButtonProps) {
	const { product, onCheckoutComplete } = props
	const isScriptLoaded = useAmazonPayScript()
	const router = useRouter()

	const handleCheckoutPayload: CartDetails = {
		totalBaseAmount: {
			amount: product.price.toFixed(2),
			currencyCode: 'USD'
		},
		totalTaxAmount: {
			amount: '2.00',
			currencyCode: 'USD'
		},
		totalShippingAmount: {
			amount: '5.00',
			currencyCode: 'USD'
		},
		totalChargeAmount: {
			amount: (product.price + 6).toFixed(2),
			currencyCode: 'USD'
		},
		totalDiscountAmount: {
			amount: '1.00',
			currencyCode: 'USD'
		},
		lineItems: [
			{
				id: product.sku,
				listPrice: {
					amount: product.price.toFixed(2),
					currencyCode: 'USD'
				},
				quantity: '1',
				title: product.title,
				totalListPrice: {
					amount: product.price.toFixed(2),
					currencyCode: 'USD'
				},
				discountedPrice: {
					amount: (product.price - 1).toFixed(2),
					currencyCode: 'USD'
				}
			}
		],
		deliveryOptions: [
			{
				id: 'AB Express',
				isDefault: true,
				price: {
					amount: '5.00',
					currencyCode: 'USD'
				},
				shippingMethod: { shippingMethodCode: 'air1', shippingMethodName: 'Air' }
			},
			{
				id: 'GiaoHangNhanh Express',
				isDefault: false,
				price: {
					amount: '3.00',
					currencyCode: 'USD'
				},
				shippingMethod: { shippingMethodCode: 'ship1', shippingMethodName: 'Ship' }
			}
		]
	}

	useEffect(() => {
		if (!isScriptLoaded) return
		if (!window.amazon && !window.amazon.Pay) return

		if (amazon && amazon.Pay !== null) {
			const checkoutSessionConfig = {
				storeId: process.env.NEXT_PUBLIC_AMZ_STORE_ID,
				scopes: ['name', 'email', 'phoneNumber', 'billingAddress'],
				paymentDetails: {
					paymentIntent: 'AuthorizeWithCapture',
				}
			}
			amazon.Pay.renderJSButton('#amazon-pay-button', {
				merchantId: process.env.NEXT_PUBLIC_AMZ_MERCHANT_ID,
				ledgerCurrency: 'USD',
				sandbox: process.env.NEXT_PUBLIC_AMZ_SANDBOX === 'true',
				checkoutLanguage: 'en_US',
				productType: 'PayAndShip',
				placement: 'Other',
				buttonColor: 'Gold',
				estimatedOrderAmount: { amount: '109.99', currencyCode: 'USD' },
				checkoutSessionConfig,
				// add placeholders for event handlers for user interaction
				/** Invokes when initiated checkout and authenticated **/
				onInitCheckout: function (event: any) {
					console.log('🚀 ~ onInitCheckout ~ event:', event)
					// return initial cart details, total amount, tax, delivery options
					return handleCheckoutPayload
				},
				/** Invokes when customer has selected different shipping address **/
				onShippingAddressSelection: function (event: any) {
					console.log('🚀 ~ onShippingAddressSelection ~ event:', event)
					return handleCheckoutPayload
					// return updated cart details, total amount, tax, delivery options
				},
				/** Invokes when customer has selected different shipping Method **/
				onDeliveryOptionSelection: function (event: any) {
					console.log('🚀 ~ onDeliveryOptionSelection ~ event:', event)
					return handleCheckoutPayload
					// return updated cart details, total amount, tax, delivery options
				},
				/** Invokes when customer clicks Pay Now **/
				onCompleteCheckout: async function (event: any) {
					console.log('🚀 ~ onCompleteCheckout ~ event:', event)
					try {
						await finalizeCheckoutSession({
							amazonCheckoutSessionId: event.amazonCheckoutSessionId,
							billingAddress: event.billingAddress,
							paymentDescriptor: event.paymentDescriptor
						})
						onCheckoutComplete && onCheckoutComplete()
					} catch (err) {
						console.log('🚀 ~ useEffect ~ err:', err)
						return {
							status: 'error',
							reasonCode: 'unknownError'
						}
					}
					// Amazon Pay provides checkout session id, final billing address and payment descriptor.
				},

				/** Invokes when customer abandons the checkout **/
				onCancel: function (event: any) {
					// take customer back to cart page or product details page based on merchant checkout
				}
			})
		}
	}, [isScriptLoaded, router])
	return <div id="amazon-pay-button" className={styles['amazon-pay-button']}></div>
}
