declare var amazon

declare module '@amazonpay/amazon-pay-api-sdk-nodejs'

type Product = {
	id: number
	title: string
	description: string
	category: string
	price: number
	discountPercentage: number
	rating: number
	stock: number
	tags: string[]
	brand: string
	sku: string
	weight: number
	dimensions: {
		width: number
		height: number
		depth: number
	}
	warrantyInformation: string
	shippingInformation: string
	availabilityStatus: string
	reviews: {
		rating: number
		comment: string
		date: string
		reviewerName: string
		reviewerEmail: string
	}[]
	returnPolicy: string
	minimumOrderQuantity: number
	meta: {
		createdAt: string
		updatedAt: string
		barcode: string
		qrCode: string
	}
	images: string[]
	thumbnail: string
}

type ButtonConfig = {
	/**
	 * * For `createCheckoutSessionConfig`, Amazon Pay will use this value to create a Checkout Session object. This is the same as the request body for the {@link https://developer.amazon.com/docs/amazon-pay-api-v2/checkout-session.html#create-checkout-session|Create Checkout Session} API.
	 * * For `signInConfig`, Amazon Pay will this value to determine which buyer details to share and where to redirect the buyer after they sign in.
	 */
	payloadJSON: string
	/** String used to verify the identity of the requestor and protect the data during transit. */
	signature: string
	/**
	 * * String used to identify the hashing algorithm used to sign the request. This value on the front-end should be in sync with the signing algorithm value used in the back-end code or SDK.
	 * * Possible values: `AMZN-PAY-RSASSA-PSS-V2` and `AMZN-PAY-RSASSA-PSS`
	 * * `AMZN-PAY-RSASSA-PSS-V2` is the default value and is recommended for all new integrations.
	 */
	algorithm?: 'AMZN-PAY-RSASSA-PSS-V2' | 'AMZN-PAY-RSASSA-PSS'
	/** * Credential provided by Amazon Pay. See {@link https://developer.amazon.com/docs/amazon-pay-checkout/get-set-up-for-integration.html#4-get-your-publickeyid|Get your publicKeyId} for more info */
	publicKeyId: string
}

type Price = {
	/** Transaction amount */
	amount: string
	/** Transaction currency code in ISO 4217 format. Example: `USD` */
	currencyCode: string
}

/** Configuration for the Amazon Pay Button. */
type AmazonPayButtonConfig = {
	/** Amazon Pay merchant account identifier */
	merchantId: string
	/** Create Checkout Session configuration. This is a required field if you use `PayAndShip` or `PayOnly` productType */
	createCheckoutSessionConfig?: ButtonConfig
	/** Amazon Sign-in configuration. This is a required field if you use `SignIn` productType */
	signInConfig?: ButtonConfig
	/** Placement of the Amazon Pay button on your website. */
	placement: 'Home' | 'Product' | 'Cart' | 'Checkout' | 'Other'
	/** Credential provided by Amazon Pay. See {@link https://developer.amazon.com/docs/amazon-pay-checkout/get-set-up-for-integration.html#4-get-your-publickeyid|Get your publicKeyId} for more info */
	publicKeyId: string
	/** * Ledger currency provided during registration for the given merchant identifier.
	 * * Supported values: `USD`, `EUR`, `GBP`, `JPY`
	 */
	ledgerCurrency: string
	/** This is the estimated checkout order amount, it does not have to match the final order amount if the buyer updates their order after starting checkout. Amazon Pay will use this value to assess transaction risk and prevent buyers from selecting payment methods that can't be used to process the order. */
	estimatedOrderAmount?: Price
	/**
	 * Product type selected for checkout. Supported values:
	 * * `PayAndShip` - Offer checkout using buyer's Amazon wallet and address book. Select this product type if you need the buyer's shipping details
	 * * `PayOnly` - Offer checkout using only the buyer's Amazon wallet. Select this product type if you do not need the buyer's shipping details
	 * * `SignIn` - Offer Amazon Sign-in. Select this product type if you need buyer details before the buyer starts Amazon Pay checkout. See Amazon Sign-in for more information.
	 * * Default value: `PayAndShip` */
	productType?: 'PayAndShip' | 'PayOnly' | 'SignIn'
	/** Color of the Amazon Pay button. Default value: `Gold` */
	buttonColor?: 'Gold' | 'LightGray' | 'DarkGray'
	/** Language used to render the button and text on Amazon Pay hosted pages. Please note that supported language(s) is dependent on the region that your Amazon Pay account was registered for. */
	checkoutLanguage?: 'en_US' | 'en_GB' | 'de_DE' | 'fr_FR' | 'it_IT' | 'es_ES' | 'ja_JP'
	/**
	 * * Sets button to Sandbox environment.
	 * * You do not have to set this parameter if your `publicKeyId` has an environment prefix (for example: `SANDBOX-AFVX7ULWSGBZ5535PCUQOY7B`)
	 * * Default value: `false`
	 * */
	sandbox?: boolean
}

type WebCheckoutDetails = {
	/** Checkout review URL provided by the merchant. Amazon Pay will redirect to this URL after the buyer selects their preferred payment instrument and shipping address. */
	checkoutReviewReturnUrl?: string
	/** Checkout result URL provided by the merchant. Amazon Pay will redirect to this URL after completing the transaction. */
	checkoutResultReturnUrl?: string
	/** Checkout cancellation URL provided by the merchant. Amazon Pay will redirect to this URL if the buyer cancels checkout on any Amazon Pay hosted page. */
	checkoutCancelUrl?: string
	/** Specify whether the buyer will return to your website to review their order before completing checkout. Supported values:
	 * * `ProcessOrder` - Buyer will complete checkout on the Amazon Pay hosted page immediately after clicking on the Amazon Pay button. paymentDetails is required when using `ProcessOrder`. addressDetails is also required if you use `ProcessOrder` with productType set to `PayAndShip`.
	 */
	checkoutMode?: string
}

type AddressRestrictions = {
	/** Specifies whether addresses that match restrictions configuration should or should not be restricted */
	type?: string
	/** Hash of country-level restrictions that determine which addresses should or should not be restricted based on addressRestrictions.type parameter. */
	restrictions?: string
}

type DeliverySpecifications = {
	/** Rule-based restrictions. Note: Amazon will only validate this value in Sandbox. This parameter is ignored in the Live environment if an unsupported value is used.
	 * * Supported values:
	 * * `RestrictPOBoxes` -  Marks PO box addresses in US, CA, GB, FR, DE, ES, PT, IT, AU as restricted.
	 * * `RestrictPackstations` - Marks packstation addresses in DE as restricted.
	 */
	specialRestrictions?: ('RestrictPOBoxes' | 'RestrictPackstations')[]
	addressRestrictions?: AddressRestrictions
}

type PaymentDetails = {
	/** Payment flow for charging the buyer.
	 * Supported values:
	 * * `Confirm` - Create a Charge Permission to authorize and capture funds at a later time.
	 * * `Authorize` - Authorize funds immediately and capture at a later time.
	 * * `AuthorizeWithCapture` - Authorize and capture funds immediately. If you use this paymentIntent you can't set canHandlePendingAuthorization to `true`.
	 */
	paymentIntent?: 'Confirm' | 'Authorize' | 'AuthorizeWithCapture'
	/** Boolean that indicates whether merchant can handle pending response.
	 * If set to `true`:
	 * * One-time checkout: Dynamic authorization is enabled. The Charge will either be in an "Authorized", "Declined", or "AuthorizationInitiated" state.
	 * If the Charge is in an "AuthorizationInitiated" state, Amazon Pay will process the authorization asynchronously and you will receive authorization results within 24 hours.
	 * See {@link https://developer.amazon.com/docs/amazon-pay-checkout/asynchronous-processing.html|asynchronous processing} and {@link https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#states-and-reason-codes|Charge states} for more info.
	 * * Recurring checkout: Amazon Pay will process the authorization asynchronously and you will receive authorization results within 24 hours.
	 * See {@link https://developer.amazon.com/docs/amazon-pay-checkout/asynchronous-processing.html|asynchronous processing} for more info
	 */
	canHandlePendingAuthorization?: boolean
	/** Amount to be processed using paymentIntent during checkout */
	chargeAmount?: Price
	/** The total order amount. Only use if you need to split the order to capture additional payment after checkout is complete */
	totalOrderAmount?: Price
	/** The currency that the buyer will be charged in ISO 4217 format. Example: `USD` */
	presentmentCurrency?: string
	/** Description shown on the buyer payment instrument statement. You can only use this parameter if paymentIntent is set to `AuthorizeWithCapture` */
	softDescriptor?: string
}

type RecurringMetaData = {
	/** Frequency at which the buyer will be charged using a recurring Charge Permission. You should specify a frequency even if you expect ad hoc charges. */
	frequency?: {
		/** Frequency unit for each billing cycle. For multiple subscriptions, specify the frequency unit for the shortest billing cycle.
		 * Only use Variable if you charge the buyer on an irregular cadence, see {@link https://developer.amazon.com/docs/amazon-pay-checkout/advanced-subscription-use-cases.html#handling-variable-cadence | handling variable cadence} for more info */
		unit?: 'Year' | 'Month' | 'Week' | 'Day' | 'Variable'
		/** Number of frequency units per billing cycle. For example, to specify a weekly cycle set unit to `Week` and value to `1`. You must set value to `0` if you're using variable unit. */
		value: string
	}
	/** Amount the buyer will be charged for each recurring cycle. Set to null if amount varies. */
	amount?: Price
}

type MerchantMetaData = {
	merchantReferenceId?: string
	merchantStoreName?: string
	noteToBuyer?: string
	customInformation?: string
}

/** Payload for the Create Amazon Checkout Session request. */
type CheckoutSessionPayload = {
	/** URLs associated to the Checkout Session used to complete checkout. The URLs must use HTTPS protocol. */
	webCheckoutDetails: WebCheckoutDetails
	/** Amazon Pay store ID. */
	storeId: string
	/** The buyer details that you're requesting access to. Specify whether you need shipping address using button productType parameter in Step 4.
	 * * Default value: all buyer information except billing address is requested if the scopes parameter is not set.
	 */
	scopes?: ('name' | 'email' | 'phoneNumber' | 'billingAddress')[]
	/** The type of Charge Permission requested. */
	chargePermissionType?: 'OneTime' | 'Recurring'
	/** Specify shipping restrictions to prevent buyers from selecting unsupported addresses from their Amazon address book. */
	deliverySpecifications?: DeliverySpecifications
	/** Payment details specified by the merchant, such as the amount and method for charging the buyer. */
	paymentDetails?: PaymentDetails
	/** Metadata about how the recurring Charge Permission will be used.
	 * Amazon Pay only uses this information to calculate the Charge Permission expiration date and in buyer communication.
	 * Note that it is still your responsibility to call {@link https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#create-charge|Create Charge} to charge the buyer for each billing cycle. */
	recurringMetadata?: RecurringMetaData
	merchantMetadata?: MerchantMetaData
}

type Buyer = {
	buyerId: string
	name: string
	email: string
	phoneNumber: string
	primeMembershipTypes?: string[]
}

type Address = {
	name: string
	addressLine1: string
	addressLine2?: string
	addressLine3?: string
	city: string
	county: string
	district?: string
	stateOrRegion: string
	postalCode: string
	countryCode: string
	phoneNumber: string
}

type StatusDetails = {
	state: string
	reasonCode: string
	reasonDescription: string
	lastUpdatedTimestamp: string
}

type PaymentPreference = {
	paymentDescriptor: string
}

type Constraint = {
	constraintId:
		| 'CheckoutResultReturnUrlNotSet'
		| 'ChargeAmountNotSet'
		| 'PaymentIntentNotSet'
		| 'BuyerNotAssociated'
		| 'RecurringFrequencyNotSet'
	description: string
}

type CheckoutSession = {
	checkoutSessionId: string
	chargePermissionType: 'OneTime' | 'Recurring'
	recurringMetadata?: RecurringMetaData
	webCheckoutDetails: WebCheckoutDetails
	paymentDetails: PaymentDetails
	merchantMetadata: MerchantMetaData
	platformId: string
	providerMetadata: string
	buyer: Buyer
	shippingAddress: Address
	billingAddress: Address
	paymentPreferences: PaymentPreference[]
	statusDetails: StatusDetails
	constraints: Constraint[]
	creationTimestamp: Date
	chargePermissionId: string
	chargeId: string
	storeId: string
	deliverySpecifications: DeliverySpecifications
	releaseEnvironment: string
	supplementaryData: string
	checkoutButtonText
}
