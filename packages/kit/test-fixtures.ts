// Shapes taken from Kit's OpenAPI document
// (https://developers.kit.com/api-reference/v4.json) and its live 401 body.

export const pagination = {
	has_previous_page: false,
	has_next_page: true,
	start_cursor: 'WzEwMDBd',
	end_cursor: 'WzIwMDBd',
	per_page: 500,
};

export const subscriber = {
	id: 1001,
	first_name: 'Jordan',
	email_address: 'jordan@acme.example',
	state: 'active',
	created_at: '2026-10-01T08:00:00Z',
	fields: { last_name: 'Lee', company: 'Acme' },
	canceled_at: null,
};

export const subscribers = {
	subscribers: [
		subscriber,
		{ ...subscriber, id: 1002, email_address: 'priya@acme.example' },
	],
	pagination,
};

export const subscriberDetail = {
	subscriber: {
		...subscriber,
		location: {
			city: 'Austin',
			state: 'Texas',
			country: 'US',
			latitude: 30.27,
			longitude: -97.74,
			timezone: 'America/Chicago',
		},
		attribution: {
			referrer: 'https://acme.example/blog',
			utm_source: 'newsletter',
			utm_medium: 'email',
			utm_campaign: 'launch',
			utm_term: null,
			utm_content: null,
			source_type: 'form',
			source_name: 'Landing page',
			source_mechanism: 'form',
			source_mechanism_id: 7,
		},
		tags: [{ id: 31, name: 'customer' }],
	},
};

export const subscriberCreated = {
	subscriber,
	warnings: ['unknown_field'],
};

export const account = {
	user: { id: 42, email: 'owner@acme.example' },
	account: {
		id: 900,
		name: 'Acme',
		plan_type: 'creator',
		primary_email_address: 'owner@acme.example',
		created_at: '2025-01-01T00:00:00Z',
		timezone: {
			name: 'America/Chicago',
			friendly_name: 'Central Time',
			utc_offset: '-06:00',
		},
		sending_addresses: [
			{
				email_address: 'owner@acme.example',
				from_name: 'Acme',
				status: 'verified',
				is_default: true,
				is_verified: true,
				is_dmarc_configured: true,
			},
		],
		plan: {
			plan_type: 'creator',
			interval: 'monthly',
			subscriber_limit: 10000,
			on_trial: false,
			trial_lapse_date: null,
			renews_at: '2026-12-01T00:00:00Z',
			cancels_at: null,
		},
	},
};

export const tag = {
	id: 31,
	name: 'customer',
	created_at: '2026-09-01T00:00:00Z',
	subscriber_count: 128,
};

export const tags = {
	tags: [tag, { ...tag, id: 32, name: 'lead' }],
	pagination,
};

export const tagResponse = { tag };

export const customField = {
	id: 7,
	name: 'Last name',
	key: 'last_name',
	label: 'Last name',
};

export const customFields = {
	custom_fields: [customField, { ...customField, id: 8, key: 'company' }],
	pagination,
};

export const customFieldResponse = { custom_field: customField };

export const form = {
	id: 12,
	name: 'Newsletter signup',
	created_at: '2026-08-01T00:00:00Z',
	type: 'form',
	format: null,
	embed_js: '<script src="https://acme.kit.com/12/index.js"></script>',
	embed_url: 'https://acme.kit.com/12',
	archived: false,
	uid: 'abc123',
	subscriber_count: 540,
};

export const forms = { forms: [form], pagination };

export const formSubscriber = {
	subscriber: { ...subscriber, added_at: '2026-11-12T10:00:00Z' },
};

/** The 401 body Kit sends for a bad key. */
export const invalidKey = { errors: ['The API key is invalid'] };

/** The 401 it sends when no key arrived at all. */
export const missingKey = { errors: ['Authentication Failed'] };

/** A refused field, with more than one reason. */
export const unprocessable = {
	errors: ['Email address is invalid', 'Custom field last_name does not exist'],
};

/** A tag or subscriber that is not there. */
export const notFound = { errors: ['Not Found'] };

/** A payload Kit will not accept for its size. */
export const payloadTooLarge = { errors: ['Payload too large'] };

/** A key whose account cannot make this call. */
export const forbidden = { errors: ['Forbidden'] };
