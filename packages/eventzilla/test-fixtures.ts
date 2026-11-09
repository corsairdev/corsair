/**
 * Captured from the live API (`https://www.eventzillaapi.net/api/v2`), not
 * copied from the docs' examples: the docs and the API disagree in several
 * places that matter, each noted below.
 */

/**
 * The docs' own response samples. Where a sample is the only evidence of a
 * shape it is marked as such; everything marked `live` was actually received.
 */
export const eventListFixture = {
	pagination: [{ offset: 0, limit: 20, total: 1 }],
	events: [
		{
			id: 2138988852,
			title: 'Chicago SaaS Growth Summit',
			description:
				'A one-day conference for SaaS founders, operators, and revenue leaders.',
			currency: 'USD',
			start_date: '2026-05-20T00:00:00',
			start_time: '09:00',
			end_date: '2026-05-20T00:00:00',
			end_time: '17:00',
			time_zone: 'UTC',
			tickets_sold: 48,
			tickets_total: 250,
			status: 'Live',
			show_remaining: true,
			twitter_hashtag: '#SaaSGrowthUS',
			utc_offset: '+00:00',
			invite_code: '',
			url: 'https://www.eventzilla.net/e/chicago-saas-growth-summit-2026-2138988852',
			logo_url: 'https://cdn.eventzilla.net/images/events/saas-growth-logo.png',
			bgimage_url:
				'https://cdn.eventzilla.net/images/events/saas-growth-background.jpg',
			venue: 'McCormick Place, Chicago, IL, USA',
			dateid: 2138985706,
			categories: 'Business,Conferences,Networking',
			language: 'en',
			description_html:
				'<p>A one-day conference for SaaS founders, operators, and revenue leaders.</p>',
			timezone_code: 'UTC',
		},
	],
} as const;

export const singleEventFixture = { events: eventListFixture.events } as const;

/**
 * `is_attended` is the string `"No"` — the reference types it as a string, and
 * a boolean schema would fail here. `questionid` is absent from the answer
 * object even though the schema allows it.
 */
export const attendeesFixture = {
	attendees: [
		{
			first_name: 'Amelia',
			last_name: 'Chen',
			ticket_type: 'Early bird admission',
			bar_code: 'EZ202605200001',
			is_attended: 'No',
			questions: [{ questions: 'Company', answer: 'Northstar SaaS' }],
			transaction_ref: '20260520145-178028',
			id: 2139049165,
			transaction_date: '2026-05-01T10:15:00',
			transaction_amount: 99,
			event_date: '2026-05-20T09:00:00',
			transaction_status: 'Confirmed',
			user_id: 42628,
			event_id: 2138988852,
			title: 'Chicago SaaS Growth Summit',
			email: 'amelia.chen@example.com',
			buyer_first_name: 'Amelia',
			buyer_last_name: 'Chen',
			promo_code: '',
			payment_type: 'Card',
		},
	],
} as const;

/** `comments` arrives as `""` on a list, though the schema calls it an object. */
export const transactionsFixture = {
	pagination: [{ offset: 0, limit: 20, total: 1 }],
	transactions: [
		{
			transaction_ref: '20260520145-178028',
			checkout_id: 2138868785,
			transaction_date: '2026-05-20T14:20:20',
			transaction_amount: 198,
			tickets_in_transaction: 2,
			event_date: '2026-05-20T09:00:00',
			transaction_status: 'Confirmed',
			user_id: 42628,
			event_id: 2138988852,
			title: 'Chicago SaaS Growth Summit',
			email: 'amelia.chen@example.com',
			buyer_first_name: 'Amelia',
			buyer_last_name: 'Chen',
			promo_code: '',
			payment_type: 'Card',
			comments: '',
			transaction_tax: 18,
			transaction_discount: 0,
			eventzilla_fee: 5.63,
		},
	],
} as const;

export const ticketTypesFixture = {
	tickets: [
		{
			id: 2138120411,
			title: 'Early bird admission',
			quantity_total: 150,
			price: 99,
			description: 'Discounted admission for early registrations.',
			sales_start_date: '2026-02-05T00:00:00',
			sales_start_time: '09:00',
			sales_end_date: '2026-04-20T00:00:00',
			sales_end_time: '23:00',
			group_discount: 0,
			group_percentage: 0,
			group_price: 0,
			additional_instructions: 'Please bring a valid photo ID for check-in.',
			unlock_code: '',
			ticket_type: 'Paid',
			boxoffice_only: false,
			is_visible: true,
			limit_minimum: 1,
			limit_maximum: 10,
			allow_partial_payment: false,
			partial_payment_installments: 0,
			partial_payment_frequency: '',
			partial_payment_amount: 0,
		},
	],
	donation: [],
} as const;

export const categoriesFixture = {
	categories: [
		{ category: 'Business' },
		{ category: 'Conferences' },
		{ category: 'Networking' },
		{ category: 'Training' },
	],
} as const;

export const usersFixture = {
	pagination: [{ offset: 0, limit: 20, total: 1 }],
	users: [
		{
			id: 2130004479,
			username: 'events@example.com',
			first_name: 'Maya',
			last_name: 'Patel',
			company: 'Northstar Events',
			address_line1: '123 Eagle Street',
			address_line2: '',
			zip_code: '4000',
			address_locality: 'Chicago',
			address_region: 'IL',
			address_country: 'United States',
			email: 'maya.patel@example.com',
			timezone: 'UTC',
			website: 'https://www.northstarevents.example',
			phone_primary: '+61 7 3000 1234',
			avatar_url: '',
			facebook_id: '',
			twitter_id: '',
			last_seen: '2026-05-20T08:21:37',
			user_type: 'organizer',
		},
	],
} as const;

/** `transaction`, not `transactions`, and no pagination. */
export const transactionLookupFixture = {
	transaction: transactionsFixture.transactions,
} as const;

/** `"USD 99.00"` where the list route sends the number 99. */
export const checkoutPrepareFixture = {
	payment_options: [
		{ payment_id: 2138979179, paymentoption_name: 'stripe' },
		{ payment_id: 2138979165, paymentoption_name: 'Free ticket only' },
	],
	tickettypes: [
		{
			ticket_type_id: 2138120411,
			ticket_type_name: 'Early bird admission',
			ticket_type_price: 'USD 99.00',
			ticket_type_min_limit: 1,
			ticket_type_max_limit: 10,
			ticket_type_avail_quantity: 102,
			ticket_type_onsale: true,
			ticket_type_description: 'Discounted admission for early registrations.',
		},
	],
	questions: [
		{
			question_id: 2138360281,
			question_type: 'txt',
			question_text: 'Company',
			question_choices: [],
			question_waiver: '',
			has_subquestion: false,
			subquestion_rules: [],
		},
	],
	discount_enabled: true,
	tax_enabled: true,
	tax: [{ tax_type: 'inclusive', tax_name: 'GST', tax_value: '10%' }],
} as const;

export const checkoutCreatedFixture = {
	checkout_id: 21388601015,
	transaction_ref: '20260520145-178028',
	transaction_total: 198,
	transaction_tax: 18,
	transaction_discount: 0,
	transaction_status: 'Incomplete',
	eventzilla_fee: 5.63,
	currency: 'USD',
	tickets: [
		{
			ticket_price_id: 1362622,
			ticket_type_id: 2138120411,
			ticket_type_name: 'Early bird admission',
		},
		{
			ticket_price_id: 1362623,
			ticket_type_id: 2138120411,
			ticket_type_name: 'Early bird admission',
		},
	],
} as const;

export const checkoutConfirmedFixture = {
	...checkoutCreatedFixture,
	transaction_status: 'confirmed',
	confirmation_email_sent: false,
	// The confirm sample has no `tickets` array; the schema allows its absence.
} as const;

export const ticketTypeFixture = {
	ticket_type_id: 2138120411,
	ticket_type_name: 'Early bird admission',
	quantity_total: 200,
	ticket_type_description: 'Discounted admission for early registrations.',
	sales_start_date: '2026-02-05T00:00:00',
	sales_start_time: '09:00',
	sales_end_date: '2026-04-20T00:00:00',
	sales_end_time: '23:00',
	additional_instructions: 'Please bring a valid photo ID for check-in.',
	unlock_code: '',
	boxoffice_only: false,
	is_visible: true,
	limit_minimum: 1,
	limit_maximum: 10,
} as const;

/**
 * Captured live: the payload is nested under `checkinstatus`, whose fields are
 * lowercased without underscores and can be `null`. The reference documents a
 * flat shape, which is wrong.
 */
export const checkinFixture = {
	checkinstatus: {
		firstname: 'Amelia',
		lastname: 'Chen',
		eventtitle: 'Chicago SaaS Growth Summit',
		orderref: '20260520145-178028',
		email: 'amelia.chen@example.com',
		status: 'Checkin',
	},
} as const;

/** Captured live for an unknown barcode: 200, every field null. */
export const checkinUnknownBarcodeFixture = {
	checkinstatus: {
		firstname: null,
		lastname: null,
		eventtitle: null,
		orderref: null,
		email: null,
		status: null,
	},
} as const;

/** Captured live: a failed check-in that still answers HTTP 200. */
export const checkinRevertedFixture = {
	checkinstatus: {
		firstname: '',
		lastname: '',
		eventtitle: '',
		orderref: '',
		email: '',
		status: 'Already Reverted checked in',
	},
} as const;

/** Captured live: how an empty list is answered, with no resource array at all. */
export const noEventsFixture = { message: 'No events found' } as const;
export const noTransactionsFixture = {
	message: 'No transactions found',
} as const;

/** Captured live: `GET /users/{id}` answers `user`, singular. */
export const singleUserFixture = { user: usersFixture.users } as const;

export const orderConfirmedFixture = { orderconfirm: 'success' } as const;
export const orderCancelledFixture = { ordercancel: 'success' } as const;
export const salesToggledFixture = { eventstatus: 'published' } as const;

// ── Errors, captured live ─────────────────────────────────────────────────

/** GET /events with no key. HTTP 401, `application/json`. */
export const keyRejectedBody = {
	message: 'API Key is not authorized',
} as const;

/** POST /attendee/checkin — the docs' path, which the API does not serve. */
export const unknownRouteBody = {
	message: 'Missing Authentication Token',
} as const;

/**
 * GET /categories with no key: **HTTP 200** and this body, rather than the 401
 * every other route sends. A keyless caller reads a success status with an
 * error body.
 */
export const categoriesKeyRejectedBody = {
	message: 'API Key is not authorized',
} as const;
