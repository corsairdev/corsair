/**
 * Response fixtures shaped after the Persona API reference, version
 * 2023-01-05 (docs.withpersona.com/2023-01-05/api-reference): JSON:API
 * objects with kebab-case attribute keys.
 */

export const authRequired = {
	errors: [{ title: 'Must be authenticated to access this endpoint' }],
};

export const account = {
	type: 'account',
	id: 'act_ABC123',
	attributes: {
		'reference-id': 'user-42',
		'account-type-name': 'User',
		'account-status': 'Default',
		'created-at': '2025-11-20T10:00:00.000Z',
		'updated-at': '2025-11-20T10:00:00.000Z',
		'redacted-at': null,
		tags: ['vip'],
		fields: { name: { type: 'hash', value: null } },
		'name-first': 'Jane',
		'name-last': 'Example',
		'email-address': 'jane@example.com',
	},
	relationships: {
		'account-type': { data: { type: 'account-type', id: 'acttp_1' } },
	},
};

export const inquiry = {
	type: 'inquiry',
	id: 'inq_ABC123',
	attributes: {
		status: 'completed',
		'reference-id': 'user-42',
		note: null,
		tags: [],
		fields: {},
		'created-at': '2025-11-20T10:00:00.000Z',
		'completed-at': '2025-11-20T10:05:00.000Z',
		'expires-at': null,
	},
	relationships: {
		'inquiry-template': { data: { type: 'inquiry-template', id: 'itmpl_1' } },
	},
};

export const inquirySession = {
	type: 'inquiry-session',
	id: 'iqse_ABC123',
	attributes: {
		status: 'new',
		'created-at': '2025-11-20T10:00:00.000Z',
		'started-at': null,
		'expired-at': null,
	},
};

export const inquiryTemplate = {
	type: 'inquiry-template',
	id: 'itmpl_1',
	attributes: { name: 'KYC Basic', status: 'active' },
};

export const templateVersion = {
	type: 'inquiry-template-version',
	id: 'itmplv_1',
	attributes: { 'name-display': 'v1', status: 'published', live: true },
};

export const webhookConfig = {
	type: 'webhook',
	id: 'wbh_ABC123',
	attributes: {
		status: 'enabled',
		url: 'https://example.com/webhooks/persona',
		name: 'Main',
		description: null,
		'enabled-events': ['inquiry.approved'],
		'api-version': '2023-01-05',
		'api-key-inflection': 'kebab',
	},
};

export const webhookWithSecret = {
	...webhookConfig,
	attributes: {
		...webhookConfig.attributes,
		secret: 'wbhsec_new_value',
		secrets: [{ value: 'wbhsec_new_value', 'expires-at': null }],
	},
};

export const LINKS = {
	prev: null,
	next: '/api/v1/inquiries?page%5Bafter%5D=inq_ABC123',
};

export const oneTimeLinkMeta = {
	'one-time-link': 'https://withpersona.com/verify?code=abc',
	'one-time-link-short': 'https://perso.na/abc',
};

/** A webhook delivery body, as Persona posts it. */
export const webhookEvent = {
	data: {
		type: 'event',
		id: 'evt_ABC123',
		attributes: {
			name: 'inquiry.approved',
			payload: { data: inquiry },
			'created-at': '2025-11-20T10:06:00.000Z',
		},
	},
};
