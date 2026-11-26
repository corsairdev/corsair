/**
 * Response bodies built from the examples on developers.mailerlite.com
 * (llms-full.txt). Field names are the provider's own spellings. Where the
 * docs contradict themselves, the probes decided: subscriber `open_rate` is a
 * plain number while groups carry the `{ float, string }` object, and both are
 * typed as documented per resource.
 */

export const subscriber = {
	id: '31986843064993537',
	email: 'dummy@example.com',
	status: 'active',
	source: 'api',
	sent: 0,
	opens_count: 0,
	clicks_count: 0,
	open_rate: 0,
	click_rate: 0,
	ip_address: null,
	subscribed_at: '2021-09-01 14:03:50',
	unsubscribed_at: null,
	created_at: '2021-09-01 14:03:50',
	updated_at: '2021-09-01 14:03:50',
	fields: {
		city: null,
		company: null,
		country: null,
		last_name: 'Testerson',
		name: 'Dummy',
		phone: null,
		state: null,
		z_i_p: null,
	},
	opted_in_at: null,
	optin_ip: null,
};

export const subscribersListResponse = {
	data: [subscriber],
	links: {
		first: null,
		last: null,
		prev: 'https://connect.mailerlite.com/api/subscribers?cursor=eyJwcmV2',
		next: 'https://connect.mailerlite.com/api/subscribers?cursor=eyJuZXh0',
	},
	meta: {
		path: 'https://connect.mailerlite.com/api/subscribers',
		per_page: 25,
		next_cursor: 'eyJuZXh0',
		prev_cursor: 'eyJwcmV2',
	},
};

export const group = {
	id: '1',
	name: 'dummy group',
	active_count: 0,
	sent_count: 0,
	opens_count: 0,
	open_rate: { float: 0, string: '0%' },
	clicks_count: 0,
	click_rate: { float: 0, string: '0%' },
	unsubscribed_count: 0,
	unconfirmed_count: 0,
	bounced_count: 0,
	junk_count: 0,
	created_at: '2022-05-24 11:52:55',
};

export const groupsListResponse = {
	data: [group],
	links: {
		first: 'https://connect.mailerlite.com/api/groups?page=1',
		last: 'https://connect.mailerlite.com/api/groups?page=1',
		prev: null,
		next: null,
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		links: [
			{ url: null, label: '&laquo; Previous', active: false },
			{
				url: 'https://connect.mailerlite.com/api/groups?page=1',
				label: '1',
				active: true,
			},
		],
		path: 'https://connect.mailerlite.com/api/groups',
		per_page: 100,
		to: 1,
		total: 1,
	},
};

export const field = {
	id: '1',
	name: 'new field',
	key: 'new_field',
	type: 'text',
};

export const fieldsListResponse = {
	data: [field],
	links: {
		first: 'https://connect.mailerlite.com/api/fields?page=1',
		last: 'https://connect.mailerlite.com/api/fields?page=1',
		prev: null,
		next: null,
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		links: [
			{
				url: 'https://connect.mailerlite.com/api/fields?page=1',
				label: '1',
				active: true,
			},
		],
		path: 'https://connect.mailerlite.com/api/fields',
		per_page: 100,
		to: 1,
		total: 1,
	},
};

export const campaign = {
	id: '1',
	account_id: '1',
	name: 'Dummy campaign',
	type: 'regular',
	status: 'sent',
	missing_data: [],
	settings: {
		track_opens: true,
		use_google_analytics: false,
		ecommerce_tracking: false,
	},
	delivery_schedule: 'instant',
	language_id: '4',
	created_at: '2022-07-26 15:07:52',
	updated_at: '2022-07-26 15:12:17',
	scheduled_for: '2022-07-26 15:11:51',
	queued_at: '2022-07-26 15:12:04',
	started_at: '2022-07-26 15:12:04',
	finished_at: '2022-07-26 15:12:17',
	stopped_at: null,
	emails: [
		{
			id: '1',
			subject: 'hello',
			from: 'dummy@mailerlite.io',
			from_name: 'Dummy Testerson',
			reply_to: 'reply-to@mailerlite.io',
			is_designed: true,
			created_at: '2022-07-26 15:08:15',
			updated_at: '2022-07-26 15:15:29',
		},
	],
	used_in_automations: false,
};

export const campaignsListResponse = {
	data: [{ ...campaign, status: 'draft', started_at: null, finished_at: null }],
	links: {
		first: 'https://connect.mailerlite.com/api/campaigns?page=1',
		last: 'https://connect.mailerlite.com/api/campaigns?page=1',
		prev: null,
		next: null,
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		links: [],
		path: 'https://connect.mailerlite.com/api/campaigns',
		per_page: 25,
		to: 1,
		total: 1,
	},
};

export const subscriberActivity = {
	id: '66201001018787256',
	opens_count: 1,
	clicks_count: 0,
	subscriber: {
		id: '56152210168350162',
		email: 'dummy@mailerlite.com',
		status: 'active',
		sent: 13,
		opens_count: 1,
		clicks_count: 0,
		open_rate: 7.69,
		click_rate: 0,
	},
};

export const subscriberActivityResponse = {
	data: [subscriberActivity],
	links: {
		first:
			'https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1',
		last: 'https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1',
		prev: null,
		next: null,
	},
	meta: {
		current_page: 1,
		from: 1,
		last_page: 1,
		links: [
			{
				url: 'https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity?page=1',
				label: '1',
				active: true,
			},
		],
		path: 'https://connect.mailerlite.com/api/campaigns/66200823885989563/reports/subscriber-activity',
		per_page: 50,
		to: 1,
		total: 1,
		aggregations: {
			sum: 11,
			opened: 1,
			unopened: 10,
			clicked: 0,
			unsubscribed: 0,
			forwarded: 0,
			hardbounced: 0,
			softbounced: 0,
			junk: 0,
		},
	},
};

// ── error bodies, live-verified envelope shapes ──────────────────────────

export const unauthenticatedError = { message: 'Unauthenticated.' };

export const notFoundError = { message: 'Resource does not exist.' };

export const validationError = {
	message: 'The given data was invalid.',
	errors: {
		email: ['The email must be a valid email address.'],
	},
};

export const tooManyAttemptsError = { message: 'Too Many Attempts.' };
