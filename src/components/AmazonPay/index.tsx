import { useEffect, useState } from 'react'

interface IAmazonPayButtonProps {
	signature: string
	createCheckoutSessionPayload: string
}

function useAmazonPayButton() {
	const [isScriptLoaded, setIsScriptLoaded] = useState(false)
	useEffect(() => {
		const amazonPayScript = document.createElement('script')
		amazonPayScript.src = 'https://static-na.payments-amazon.com/checkout.js'
		amazonPayScript.async = true
		amazonPayScript.onload = () => {
			setIsScriptLoaded(true)
		}
		document.head.appendChild(amazonPayScript)
	}, [])
}

export default function AmazonPayButton(props: IAmazonPayButtonProps) {}
