import React from 'react'
import styles from '@/styles/ThankyouPage.module.scss'
import Image from 'next/image'
import { completeCheckoutSession } from '@/services'

type ThankYouPageProps = {
	props: {}
}

export async function getServerSideProps({ query }: { query: { amazonCheckoutSessionId: string } }) {
	const { amazonCheckoutSessionId } = query
	const completeCheckoutSessionResponse = await completeCheckoutSession(amazonCheckoutSessionId)
	return {
		props: { response: completeCheckoutSessionResponse }
	}
}

export default function ThankYouPage(props: any) {
	return (
		<div className={styles['thank-you']}>
			<Image alt="checkmark" src={'/checkmark.svg'} height={450} width={450} />
			<h1>Thank You!</h1>
			<p>Your purchase was successful. We appreciate your order!</p>
			<p>If you have any questions, feel free to contact our support team.</p>
		</div>
	)
}
