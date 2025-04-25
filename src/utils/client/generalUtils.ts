export function waitForGlobalVariable(variable: string, interval = 300, maxRetries = 100): Promise<any> {
	return new Promise<any>(resolve => {
		let retries = 0
		const waitFunction = setInterval(() => {
			if ((window as any)[variable]) {
				clearInterval(waitFunction)
				resolve((window as any)[variable])
				return
			}
			if (retries >= maxRetries) {
				clearInterval(waitFunction)
				resolve(null)
				return
			}
			retries++
		}, interval)
	})
}
