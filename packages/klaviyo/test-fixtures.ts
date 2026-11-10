/**
 * Fixtures follow Klaviyo's stable spec
 * (github.com/klaviyo/openapi, revision 2026-10-15) and the JSON:API shape its
 * own error guide shows. There was no API key for this build, so nothing here
 * is claimed as a captured live response.
 */

export const profile = {
	type: 'profile',
	id: '01H8XYZABC123',
	attributes: {
		email: 'jordan@acme.com',
		phone_number: '+15550100',
		external_id: 'acme-42',
		first_name: 'Jordan',
		last_name: 'Reyes',
		organization: 'Acme',
		locale: 'en-US',
		title: 'Head of Growth',
		image: 'https://example.com/jordan.png',
		location: { city: 'Austin', region: 'TX', country: 'US' },
		properties: { plan: 'pro' },
		created: '2026-01-15T10:00:00+00:00',
		updated: '2026-02-01T11:00:00+00:00',
	},
	links: { self: 'https://a.klaviyo.com/api/profiles/01H8XYZABC123' },
};

/** A profile with every optional field absent. */
export const profileSparse = {
	type: 'profile',
	id: '01H8XYZSPARSE',
	attributes: {
		email: null,
		first_name: null,
		last_name: null,
		location: null,
		properties: null,
		created: '2026-01-15T10:00:00+00:00',
	},
};

export const profilesListResponse = {
	data: [profile, profileSparse],
	links: {
		self: 'https://a.klaviyo.com/api/profiles',
		next: 'https://a.klaviyo.com/api/profiles/?page%5Bcursor%5D=bmV4dDo6aWQ6Ok43dW1iVw',
		prev: null,
	},
};

export const profileResponse = { data: profile };

export const list = {
	type: 'list',
	id: 'R7QkZp',
	attributes: {
		name: 'Newsletter',
		created: '2026-01-01T09:00:00+00:00',
		updated: '2026-02-01T09:00:00+00:00',
	},
	links: { self: 'https://a.klaviyo.com/api/lists/R7QkZp' },
};

export const listsListResponse = {
	data: [list],
	links: { self: 'https://a.klaviyo.com/api/lists', next: null, prev: null },
};

export const listResponse = { data: list };

export const segment = {
	type: 'segment',
	id: 'SgXy12',
	attributes: {
		name: 'Engaged 30 days',
		created: '2026-01-01T09:00:00+00:00',
		updated: '2026-02-01T09:00:00+00:00',
		is_active: true,
	},
};

export const segmentsListResponse = {
	data: [segment],
	links: { self: 'https://a.klaviyo.com/api/segments', next: null, prev: null },
};

export const segmentResponse = { data: segment };

export const event = {
	type: 'event',
	id: 'Ev123',
	attributes: {
		timestamp: 1767225600,
		event_properties: { OrderId: 'ABC-1', Total: 129.5 },
		datetime: '2026-01-01T00:00:00+00:00',
		uuid: 'a1b2c3',
	},
	relationships: {
		profile: { data: { type: 'profile', id: '01H8XYZABC123' } },
		metric: { data: { type: 'metric', id: 'Mt123' } },
	},
};

export const eventsListResponse = {
	data: [event],
	links: { self: 'https://a.klaviyo.com/api/events', next: null, prev: null },
};

export const eventResponse = { data: event };

export const metric = {
	type: 'metric',
	id: 'Mt123',
	attributes: {
		name: 'Placed Order',
		created: '2026-01-01T09:00:00+00:00',
		updated: '2026-01-01T09:00:00+00:00',
		integration: { name: 'Shopify', category: 'eCommerce' },
	},
};

export const metricsListResponse = {
	data: [metric],
	links: { self: 'https://a.klaviyo.com/api/metrics', next: null, prev: null },
};

export const metricResponse = { data: metric };

/** The aggregate route answers date buckets, not resources. */
/** The report shape of the spec: `dates` are strings, the series sit in `data`. */
export const metricAggregateResponse = {
	data: {
		type: 'metric-aggregate',
		id: 'Mt123',
		attributes: {
			dates: ['2026-01-01T00:00:00+00:00', '2026-01-02T00:00:00+00:00'],
			data: [{ dimensions: [], measurements: { count: [3, 5] } }],
		},
		links: { self: 'https://a.klaviyo.com/api/metric-aggregates' },
	},
	links: { self: 'https://a.klaviyo.com/api/metric-aggregates' },
};

export const webhook = {
	type: 'webhook',
	id: 'Wh123',
	attributes: {
		name: 'Order events',
		description: 'Sends orders to our queue',
		endpoint_url: 'https://example.com/klaviyo/events',
		enabled: true,
		created_at: '2026-01-01T09:00:00+00:00',
		updated_at: '2026-01-01T09:00:00+00:00',
	},
};

export const webhooksListResponse = {
	data: [webhook],
	links: { self: 'https://a.klaviyo.com/api/webhooks', next: null },
};

export const webhookResponse = { data: webhook };

export const webhookTopic = {
	type: 'webhook-topic',
	id: 'Placed Order',
	attributes: { name: 'Placed Order', description: 'When an order is placed' },
};

export const webhookTopicsListResponse = {
	data: [webhookTopic],
	links: { self: 'https://a.klaviyo.com/api/webhook-topics', next: null },
};

export const tag = {
	type: 'tag',
	id: 'Tg123',
	attributes: { name: 'priority', created: '2026-01-01T09:00:00+00:00' },
};

export const tagsListResponse = {
	data: [tag],
	links: { self: 'https://a.klaviyo.com/api/tags', next: null },
};

export const tagResponse = { data: tag };

export const tagGroup = {
	type: 'tag-group',
	id: 'TgG123',
	attributes: { name: 'Campaign type', exclusive: false, default: false },
};

export const tagGroupsListResponse = {
	data: [tagGroup],
	links: { self: 'https://a.klaviyo.com/api/tag-groups', next: null },
};

export const tagGroupResponse = { data: tagGroup };

/** A bulk job answers 202 with its id. */
/** A 401, as the live API answers a bad key. */
export const authenticationFailed = {
	errors: [
		{
			id: 'bcaaae81-da30-4737-950e-9ae529413d0a',
			status: 401,
			code: 'authentication_failed',
			title: 'Incorrect authentication credentials.',
			detail: 'Incorrect authentication credentials.',
			source: { pointer: '/data/' },
		},
	],
};

/** A 400 with a field pointer. */
export const invalidField = {
	errors: [
		{
			id: 'abc',
			status: 400,
			code: 'invalid',
			title: 'Invalid input.',
			detail: 'email is not a valid email address.',
			source: { pointer: '/data/attributes/email' },
		},
	],
};

/** A 429. */
export const rateLimited = {
	errors: [
		{
			id: 'def',
			status: 429,
			code: 'rate_limit_exceeded',
			title: 'Rate limit exceeded.',
			detail: 'You have exceeded the rate limit for this endpoint.',
		},
	],
};

/** Two errors at once, which Klaviyo does for a body with several faults. */
export const multipleErrors = {
	errors: [
		{ status: 400, code: 'invalid', title: 'Invalid input.', detail: 'One.' },
		{ status: 400, code: 'invalid', title: 'Invalid input.', detail: 'Two.' },
	],
};
