import React, { useState, useEffect } from 'react'
import styles from './Toast.module.scss'

interface IToastProps {
	message: string
	duration?: number
	onClose?: () => void
	type?: 'success' | 'error' | 'info'
}

export default function Toast({ message, duration = 3000, onClose, type = 'success' }: IToastProps) {
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false)
			if (onClose) onClose()
		}, duration)

		return () => clearTimeout(timer)
	}, [duration, onClose])

	if (!visible) return null

	return <div className={[styles['toast'], styles[`toast--${type}`]].join(' ')}>{message}</div>
}
