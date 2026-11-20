/**
 * Response fixtures shaped after the PersistIQ OpenAPI spec
 * (persistiq.com/api-docs/v1/swagger.json).
 */

export const unauthorized = {
	status: 'error',
	error: {
		reason: 'unauthorized',
		message:
			"Failed to find api key: invalid.  Did you set header 'x-api-key' correctly?",
	},
};

export const PAGE = { has_more: false, next_page: null };

export const user = {
	id: 'u_1',
	name: 'Jane Roe',
	email: 'jane@example.com',
};

export const lead = {
	id: 'l_1',
	status: 'Replied',
	data: { email: 'john@example.com', first_name: 'John' },
	creator_id: 'u_1',
	owner_id: 'u_1',
	bounced: false,
	optedout: false,
	sent_count: 3,
	replied_count: 1,
	last_sent_at: '2025-11-20T10:00:00.000Z',
};

export const campaign = {
	id: 'c_1',
	name: 'Q4 outbound',
};

export const leadField = {
	id: 'f_1',
	label: 'First Name',
};

export const leadStatus = {
	id: 's_1',
	name: 'Replied',
};

export const dncDomain = {
	id: 'd_1',
	domain: 'example.com',
};

export const event = {
	id: 'e_1',
	event_type: 'email_sent',
	data: { lead_id: 'l_1' },
	created_at: '2025-11-20T10:00:00.000Z',
};

export const tag = {
	id: 't_1',
	name: 'priority',
};

export const webhookSettings = {
	url: 'https://example.com/webhooks/persistiq',
	enabled: true,
};

export const reply = {
	id: 'r_1',
};
