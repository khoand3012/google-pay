import { getAmazonButtonData } from '@/services'
import { useEffect } from 'react'
import styles from './AmazonPay.module.scss'
import { useAmazonPayScript } from '@/utils/client'

const amazonPublicKeyId = process.env.NEXT_PUBLIC_AMZ_PUBLIC_KEY_ID || ''
const amazonIsSandbox = process.env.NEXT_PUBLIC_AMZ_SANDBOX === 'true'
const amazonMerchantId = process.env.NEXT_PUBLIC_AMZ_MERCHANT_ID || ''

type AmazonPayButtonProps = {
	productId: string
}

export default function AmazonPayButton(props: AmazonPayButtonProps) {
	const isScriptLoaded = useAmazonPayScript()
	useEffect(() => {
		if (!isScriptLoaded) return
		if (!window.amazon && !window.amazon.Pay) return

		if (amazon && amazon.Pay !== null) {
			const amazonPayButtonConfig: AmazonPayButtonConfig = {
				merchantId: amazonMerchantId,
				publicKeyId: amazonPublicKeyId,
				ledgerCurrency: 'USD',
				checkoutLanguage: 'en_US',
				productType: 'PayAndShip',
				buttonColor: 'Gold',
				sandbox: amazonIsSandbox,
				placement: 'Product'
			}

			const amazonPayButton = amazon.Pay.renderButton('#amazon-pay-button', amazonPayButtonConfig)

			amazonPayButton.onClick(async function () {
				const { payloadJSON, signature, price } = await getAmazonButtonData(
					window.location.origin,
					props.productId
				)
				amazonPayButton.initCheckout({
					estimatedOrderAmount: { amount: price, currencyCode: 'USD' },
					createCheckoutSessionConfig: {
						payloadJSON,
						signature,
						algorithm: 'AMZN-PAY-RSASSA-PSS-V2',
						publicKeyId: amazonPublicKeyId
					}
				} as Partial<CheckoutSession>)
			})
		}
	}, [isScriptLoaded])
	return <div id="amazon-pay-button" className={styles['amazon-pay-button']}></div>
}
