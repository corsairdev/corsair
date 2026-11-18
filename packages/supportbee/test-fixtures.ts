/**
 * Fixtures for the SupportBee shapes.
 *
 * Every body here is copied from the OpenAPI document embedded in
 * https://supportbee.com/docs/api/reference, so the field names, the wrappers
 * and the misspelled `asignee` key are the vendor's. The output schemas are
 * `.loose()`, so a field the vendor adds later still parses.
 */

export const ticket = {
	id: 1,
	subject: 'Welcome to SupportBee',
	replies_count: 0,
	comments_count: 0,
	last_activity_at: '2001-02-15T04:05:06+07:00',
	created_at: '2001-02-15T04:05:06+07:00',
	unanswered: true,
	archived: false,
	spam: false,
	summary: 'test -- Regards, Agent',
	source: ['test@company.com'],
	cc: [],
	bcc: [],
	labels: [],
	requester: {
		id: 21,
		email: 'test@company.com',
		name: 'Robert Requester',
		role: 'customer',
		agent: false,
		picture: [{ thumb20: 'https://secure.gravatar.com/avatar/user.png' }],
	},
};

export const ticketsResponse = {
	total: 1,
	current_page: 1,
	per_page: 15,
	total_pages: 1,
	tickets: [ticket],
};

export const reply = {
	id: 1,
	created_at: '2001-02-15T04:05:06+07:00',
	summary: 'Reply Content',
	cc: [],
	bcc: [],
	ticket: { replies_count: 2, comments_count: 0 },
	replier: {
		id: 1,
		email: 'person2@example.com',
		name: 'Agent Argentus',
		agent: true,
		picture: { thumb20: 'https://secure.gravatar.com/avatar/user.png' },
	},
	content: {
		body: 'Reply Content',
		html: null,
		attachments: [],
	},
};

export const comment = {
	id: 1,
	created_at: '2001-02-15T04:05:06+07:00',
	ticket: { replies_count: 0, comments_count: 1 },
	commenter: {
		id: 1,
		email: 'person2@example.com',
		name: 'Agent1',
		agent: true,
		picture: { thumb20: 'https://secure.gravatar.com/avatar/user.png' },
	},
	content: { text: 'test', html: 'test' },
};

export const draft = {
	id: 1,
	cc: [{ email: 'person@example.com', name: '' }],
	bcc: [],
	last_saved_by: {
		id: 1,
		email: 'person2@example.com',
		name: 'Agent1',
		agent: true,
	},
	last_saved_at: '2001-02-15T04:05:06+07:00',
	content: { text: 'Draft reply content', html: null },
};

export const user = {
	id: 1,
	type: 'user',
	email: 'person2@example.com',
	first_name: 'Sarah',
	last_name: 'Caring',
	name: 'Sarah Caring',
	role: 'agent',
	agent: true,
	two_factor_authentication_enabled: true,
	picture: { thumb20: 'https://secure.gravatar.com/avatar/user.png' },
	email_domains: [],
	members_count: 0,
	active_tickets_count: 0,
	requested_tickets_count: 0,
	teams: [{ id: 2, name: 'Team 1' }],
};

export const team = {
	id: 2,
	name: 'Team 1',
	picture: { thumb20: 'https://secure.gravatar.com/avatar/team.png' },
};

export const snippet = {
	id: 4,
	created_at: '2001-02-15T04:05:06+07:00',
	name: 'Facebook Link',
	tags: 'facebook, link',
	content: { text: 'Facebook', html: '' },
};

export const forwardingAddress = {
	id: 1,
	forward_to: 'rluwmwqanfrivrggh@supportbeemail.com',
	from: 'example@example.com',
	name: 'Company Inc',
};

export const attachment = {
	id: 2,
	created_at: '2001-02-15T04:05:06+07:00',
	filename: 'logo.jpg',
	content_type: 'image/jpeg; charset=UTF-8; name=logo.jpg',
	url: {
		original: 'http://company.example.com/attachments/2',
		thumb: 'http://company.example.com/attachments/2?version=thumb',
	},
};

export const auditEntry = {
	action: 'Commented',
	actor: {
		name: 'John Doe',
		profile_picture_url: 'https://secure.gravatar.com/avatar/example.png',
	},
	url: '#comments/1',
	severity: 'info',
	happened_at: '2026-03-18T09:23:47Z',
};

export const dataPoint = { value: '42', timestamp: '1360627200' };
