// Fixtures are shaped from the OpenAPI spec's own examples
// (https://docs.goshippo.com/spec/shippoapi/public-api.yaml), with the field
// set the plugin types. Where the spec gives no example, the value is the
// documented enum member or an obvious placeholder — no live Shippo token was
// available, so these are not captured responses. The live suite in
// api.test.ts is where real shapes get checked.

export const address = {
	object_id: 'd799c2679e644279b59fe661ac8fa488',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	is_complete: true,
	name: 'Shawn Ippotle',
	company: 'Shippo',
	street_no: '',
	street1: '215 Clayton St.',
	street2: '',
	street3: '',
	city: 'San Francisco',
	state: 'CA',
	zip: '94117',
	country: 'US',
	phone: '+1 555 341 9393',
	email: 'shippotle@shippo.com',
	is_residential: true,
	metadata: '',
	latitude: 37.762,
	longitude: -122.449,
	validation_results: {
		is_valid: true,
		messages: [
			{
				source: 'Shippo Address Validator',
				code: 'Default Match',
				type: 'address_warning',
				text: 'More information, such as an apartment or suite number, may give a more specific address.',
			},
		],
	},
	test: true,
};

/** An address Shippo could not fully match: still rateable, not buyable. */
export const incompleteAddress = {
	...address,
	object_id: '7c2b6f1e1d0a4f0d9a3b2c1d0e9f8a7b',
	is_complete: false,
	validation_results: {
		is_valid: false,
		messages: [
			{
				source: 'USPS',
				code: 'Address Not Found',
				type: 'address_error',
				text: 'The address as submitted could not be found.',
			},
		],
	},
};

export const parcel = {
	object_id: 'adcfdddf8ec64b84ad22772bce3ea37a',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	object_state: 'VALID',
	length: '5',
	width: '5',
	height: '5',
	distance_unit: 'in',
	weight: '12',
	mass_unit: 'lb',
	template: null,
	extra: null,
	metadata: '',
	test: true,
};

/**
 * A real rate shape from the spec: `amount` and `amount_local` are strings, and
 * `servicelevel` is a nested object whose `token` is what a batch sends.
 */
export const rate = {
	object_id: 'ec9f0d3adc9441449c85d315f0997fd5',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	amount: '5.93',
	amount_local: '5.93',
	currency: 'USD',
	currency_local: 'USD',
	provider: 'USPS',
	provider_image_75:
		'https://shippo-static.s3.amazonaws.com/providers/75/USPS.png',
	provider_image_200:
		'https://shippo-static.s3.amazonaws.com/providers/200/USPS.png',
	arrives_by: null,
	attributes: ['CHEAPEST'],
	estimated_days: 2,
	duration_terms: 'Delivery in 1 to 3 business days',
	included_insurance_price: null,
	servicelevel: {
		name: 'Priority Mail',
		token: 'usps_priority',
		terms: '',
		extended_token: 'usps_priority',
		parent_servicelevel: null,
	},
	carrier_account: '078870331023437cb917f5187429b093',
	shipment: 'adcfdddf8ec64b84ad22772bce3ea37a',
	zone: '1',
	messages: [],
	test: true,
};

export const shipment = {
	object_id: 'adcfdddf8ec64b84ad22772bce3ea37a',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	status: 'SUCCESS',
	address_from: address,
	address_to: { ...address, object_id: 'to-address-id', is_residential: false },
	address_return: null,
	parcels: [parcel],
	rates: [rate],
	carrier_accounts: [],
	messages: [],
	metadata: '',
	shipment_date: '2021-03-22T12:00:00Z',
	test: true,
};

/** What an async create answers: the shipment, before any rate exists. */
export const queuedShipment = {
	...shipment,
	status: 'QUEUED',
	rates: [],
};

/** A bought label: the fields that matter, including a signed `label_url`. */
export const transaction = {
	object_id: '915d94940ea54c3a80cbfa328722f5a1',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	object_state: 'VALID',
	status: 'SUCCESS',
	// The rate's *id*, not the rate object — confirmed against a real label.
	rate: 'ec9f0d3adc9441449c85d315f0997fd5',
	parcel: 'adcfdddf8ec64b84ad22772bce3ea37a',
	label_url:
		'https://shippo-delivery.s3.amazonaws.com/70ae8117ee1749e393f249d5b77c45e0.pdf?Signature=vDw1ltcy&Expires=1437093830',
	commercial_invoice_url: null,
	qr_code_url: null,
	label_file_type: 'PDF_4x6',
	tracking_number: '9205590164917312751089',
	// The bare status string, not the tracking-status object `tracks.get`
	// returns — confirmed against a real SUCCESS label.
	tracking_status: 'UNKNOWN',
	tracking_url_provider: 'https://tools.usps.com/go/TrackConfirmAction',
	eta: '2014-07-14T17:45:00Z',
	messages: [],
	metadata: 'Order ID #12345',
	test: true,
};

/** A label still being bought: no `label_url` yet. */
export const queuedTransaction = {
	...transaction,
	object_id: '915d94940ea54c3a80cbfa328722f5a2',
	status: 'QUEUED',
	label_url: null,
	tracking_number: null,
	tracking_status: 'UNKNOWN',
};

/** A label the carrier refused, with the reason in `messages`. */
export const errorTransaction = {
	...transaction,
	object_id: '915d94940ea54c3a80cbfa328722f5a3',
	status: 'ERROR',
	label_url: null,
	messages: [
		{
			source: 'USPS',
			code: 'carrier_error',
			text: 'The address is not valid for this service level.',
		},
	],
};

export const refund = {
	object_id: 'de1b3f1e1d0a4f0d9a3b2c1d0e9f8a7b',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	status: 'SUCCESS',
	transaction: '915d94940ea54c3a80cbfa328722f5a1',
	test: true,
};

/** A tracking status for a number Shippo has already seen. */
export const track = {
	carrier: 'usps',
	tracking_number: '9205590164917312751089',
	address_from: { city: 'Las Vegas', state: 'NV', zip: '89101', country: 'US' },
	address_to: { city: 'Las Vegas', state: 'NV', zip: '89101', country: 'US' },
	eta: '2019-08-24T14:15:22Z',
	original_eta: '2021-07-23T00:00:00Z',
	servicelevel: {
		name: 'Priority Mail Express',
		token: 'usps_priority_express',
		terms: 'ONERATE',
		extended_token: 'usps_priority_express',
		parent_servicelevel: null,
	},
	messages: [],
	metadata: 'Order 000123',
	tracking_status: {
		object_id: 'track-status-id',
		object_created: '2019-08-20T14:15:22Z',
		object_updated: '2019-08-24T14:15:22Z',
		status: 'TRANSIT',
		status_date: '2019-08-23T14:15:22Z',
		status_details: 'Your shipment is on its way.',
		substatus: null,
		location: { city: 'Las Vegas', state: 'NV', zip: '89101', country: 'US' },
	},
	tracking_history: [
		{
			object_id: 'history-1',
			object_created: '2019-08-20T14:15:22Z',
			object_updated: '2019-08-20T14:15:22Z',
			status: 'PRE_TRANSIT',
			status_date: '2019-08-20T14:15:22Z',
			status_details: 'Label created.',
			substatus: null,
			location: null,
		},
	],
};

export const customsItem = {
	object_id: 'd799c2679e644279b59fe661ac8fa488',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-17T00:49:20.631Z',
	object_updated: '2014-07-17T00:49:20.631Z',
	object_state: 'VALID',
	description: 'T-Shirt',
	quantity: 2,
	net_weight: '400',
	mass_unit: 'g',
	value_amount: '20',
	value_currency: 'USD',
	origin_country: 'US',
	tariff_number: '',
	hs_code: '',
	sku_code: '',
	eccn_ear99: '',
	manufacturer_code: '',
	manufacturer_standard_code: '',
	metadata: '',
	test: true,
};

export const customsDeclaration = {
	object_id: 'b3d1a2c4e5f647089a1b2c3d4e5f6071',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-17T00:49:20.631Z',
	object_updated: '2014-07-17T00:49:20.631Z',
	object_state: 'VALID',
	contents_type: 'MERCHANDISE',
	contents_explanation: '',
	non_delivery_option: 'RETURN',
	certify: true,
	certify_signer: 'Shawn Ippotle',
	incoterm: 'DDU',
	eel_pfc: 'NOEEI_30_37_a',
	items: [customsItem],
	address_importer: null,
	metadata: '',
	test: true,
};

export const batch = {
	object_id: '0f1e2d3c4b5a69788796a5b4c3d2e1f0',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	status: 'VALID',
	default_carrier_account: '078870331023437cb917f5187429b093',
	default_servicelevel_token: 'usps_priority',
	label_filetype: 'PDF_4x6',
	metadata: '',
	label_url: [],
	batch_shipments: {
		next: null,
		previous: null,
		results: [
			{
				object_id: 'batch-shipment-id',
				shipment: 'adcfdddf8ec64b84ad22772bce3ea37a',
				transaction: null,
				status: 'VALID',
				carrier_account: '078870331023437cb917f5187429b093',
				servicelevel_token: 'usps_priority',
				messages: [],
				metadata: '',
			},
		],
	},
	object_results: { purchase_failed: 0, purchase_succeeded: 0 },
	test: true,
};

/** A purchased batch answers with its merged label URLs. */
export const purchasedBatch = {
	...batch,
	status: 'PURCHASED',
	label_url: [
		'https://shippo-delivery.s3.amazonaws.com/batch-merged.pdf?Expires=1437093830',
	],
	object_results: { purchase_failed: 0, purchase_succeeded: 1 },
};

export const order = {
	object_id: 'adcfdddf8ec64b84ad22772bce3ea37a',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	order_number: '#1068',
	order_status: 'PAID',
	placed_at: '2014-07-09T02:19:13.174Z',
	currency: 'USD',
	subtotal_price: '12.50',
	total_price: '14.00',
	total_tax: '0.00',
	shipping_cost: '1.50',
	shipping_cost_currency: 'USD',
	shipping_method: 'USPS Priority',
	notes: '',
	weight: '12',
	weight_unit: 'lb',
	from_address: address,
	to_address: { ...address, object_id: 'to-id' },
	line_items: [
		{
			object_id: 'line-item-id',
			title: 'T-Shirt',
			quantity: 2,
			sku: 'HM-123',
			total_price: '12.50',
			currency: 'USD',
			weight: '12',
			weight_unit: 'lb',
			max_dimensions: null,
		},
	],
	transactions: [],
	shop_app: null,
};

export const pickup = {
	object_id: 'b3d1a2c4e5f647089a1b2c3d4e5f6072',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	status: 'CONFIRMED',
	carrier_account: '078870331023437cb917f5187429b093',
	location: {
		object_id: 'd799c2679e644279b59fe661ac8fa488',
		city: 'San Francisco',
		state: 'CA',
		zip: '94117',
		country: 'US',
		building_location_type: 'floor',
	},
	transactions: ['915d94940ea54c3a80cbfa328722f5a1'],
	requested_start_time: '2014-07-21T12:00:00Z',
	requested_end_time: '2014-07-21T18:00:00Z',
	confirmed_start_time: '2014-07-21T13:00:00Z',
	confirmed_end_time: '2014-07-21T17:00:00Z',
	cancel_by_time: '2014-07-21T12:00:00Z',
	confirmation_code: 'KSDJHF',
	timezone: 'America/Los_Angeles',
	messages: [],
	metadata: '',
	is_test: true,
};

export const manifest = {
	object_id: 'c4e5f60718293a4b5c6d7e8f90a1b2c3',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	status: 'SUCCESS',
	carrier_account: '078870331023437cb917f5187429b093',
	shipment_date: '2014-07-21T12:00:00Z',
	transactions: ['915d94940ea54c3a80cbfa328722f5a1'],
	address_from: 'd799c2679e644279b59fe661ac8fa488',
	documents: ['https://shippo-delivery.s3.amazonaws.com/manifest.pdf'],
	errors: [],
};

export const carrierAccount = {
	object_id: '078870331023437cb917f5187429b093',
	object_owner: 'shippotle@shippo.com',
	carrier: 'usps',
	carrier_name: 'USPS',
	account_id: 'shippo_usps_account',
	active: true,
	is_shippo_account: true,
	test: true,
	parameters: { account_number: '1234567890' },
	service_levels: [
		{
			name: 'Priority Mail',
			token: 'usps_priority',
			terms: '',
			extended_token: 'usps_priority',
		},
	],
	metadata: '',
};

export const carrierParcelTemplate = {
	object_id: null,
	carrier: 'USPS',
	name: 'USPS Flat Rate Gift Box',
	token: 'USPS_FlatRateGiftBox',
	length: '12',
	width: '10',
	height: '2',
	distance_unit: 'in',
	weight: null,
	weight_unit: null,
	template: null,
};

export const userParcelTemplate = {
	object_id: 'a1b2c3d4e5f647089a1b2c3d4e5f6071',
	object_owner: 'shippotle@shippo.com',
	object_created: '2014-07-09T02:19:13.174Z',
	object_updated: '2014-07-09T02:19:13.174Z',
	name: 'My 5x5x5 box',
	length: '5',
	width: '5',
	height: '5',
	distance_unit: 'in',
	weight: '12',
	weight_unit: 'lb',
	template: null,
};

export const webhook = {
	object_id: '0e9b1c2d3e4f5061728394a5b6c7d8e9',
	object_owner: 'shippotle@shippo.com',
	object_created: '2021-06-28T15:44:11.647Z',
	object_updated: '2021-06-28T15:44:11.647Z',
	url: 'https://myapp.com/webhooks/shippo',
	event: 'track_updated',
	active: true,
	is_test: false,
};

/** The account-level lists all answer `{ next, previous, results }`. */
export const paged = <T>(results: T[], next: string | null = null) => ({
	next,
	previous: null,
	results,
});

export const errorDetail = { detail: 'Token does not exist' };

/** A 400 field error, which the spec leaves as a bare object. */
export const fieldErrors = {
	address_to: ['is required'],
	country: ['"XX" is not a valid country code.'],
};

/** A 404 for an unknown object: `detail`, not a field map. */
export const notFound = { detail: 'Not found.' };
