import { useEffect, useState } from "react"
import { waitForGlobalVariable } from "./"

export function useAmazonPayScript() {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    useEffect(() => {
        const amazonPayScript = document.createElement('script')
        amazonPayScript.src = 'https://static-na.payments-amazon.com/checkout.js'
        amazonPayScript.async = true
        amazonPayScript.onload = () => {
            waitForGlobalVariable('amazon').then(() => setIsScriptLoaded(true))
        }
        document.head.appendChild(amazonPayScript)
    }, [])
    return isScriptLoaded
}