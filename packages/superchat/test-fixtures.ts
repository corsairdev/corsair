/**
 * Shapes taken from Superchat's published OpenAPI document and examples at
 * https://developers.superchat.com/reference. Values keep every documented
 * field type honest, including the nulls the API sends.
 */

export const pagination = {
	next_cursor: 'ct_next',
	previous_cursor: null,
	next_url: 'https://api.superchat.com/v1.0/contacts?after=ct_next',
	previous_url: null,
};

export const contact = {
	id: 'ct_1aBMS9FKwvSDjljRJI1aZ',
	first_name: 'Jane',
	last_name: 'Smith',
	gender: 'diverse',
	handles: [
		{ id: 'hd_1', type: 'mail', value: 'jane@example.com' },
		{ id: 'hd_2', type: 'phone', value: '+4915100000000' },
	],
	custom_attributes: [{ identifier: 'plan', type: 'text', value: 'pro' }],
	created_at: '2026-03-10T16:15:50Z',
	updated_at: '2026-03-11T09:00:00Z',
};

export const contactsPage = {
	url: '/v1.0/contacts',
	results: [contact],
	pagination,
};

export const contactList = {
	id: 'cl_1aBMS9FKwvSDjljRJI1aZ',
	name: 'Newsletter Subscribers',
	description: 'Contacts subscribed to the newsletter',
	url: '/v1.0/contact-lists/cl_1aBMS9FKwvSDjljRJI1aZ',
};

export const contactListsPage = {
	url: '/v1.0/contact-lists',
	results: [contactList],
	pagination,
};

export const conversation = {
	id: 'cv_1aBMS9FKwvSDjljRJI1aZ',
	status: 'open',
	channel: { id: 'mc_1', type: 'whats_app' },
	inbox: { id: 'in_1', name: 'Support' },
	labels: [],
	assigned_users: [],
	contacts: [],
	snoozed_until: null,
	time_window: { start: null, end: null },
	url: '/v1.0/conversations/cv_1aBMS9FKwvSDjljRJI1aZ',
};

export const conversationsPage = {
	url: '/v1.0/conversations',
	results: [conversation],
	pagination,
};

export const message = {
	id: 'me_1aBMS9FKwvSDjljRJI1aZ',
	status: 'sent',
	conversation_id: 'cv_1aBMS9FKwvSDjljRJI1aZ',
	in_reply_to: null,
	content: { type: 'text', body: 'Hello!' },
	to: [{ identifier: 'jane@example.com' }],
	from: { channel_id: 'mc_1', name: 'Acme Support' },
	created_at: '2026-03-10T16:15:50Z',
	updated_at: '2026-03-10T16:15:50Z',
	direction: 'outbound',
	url: '/v1.0/messages/me_1',
};

export const messagesPage = {
	url: '/v1.0/conversations/cv_1/messages',
	results: [message],
	pagination,
};

export const channel = {
	id: 'mc_1aBMS9FKwvSDjljRJI1aZ',
	type: 'whats_app',
	name: 'Acme WhatsApp',
	inbox_id: 'in_1',
};

export const channelsPage = {
	url: '/v1.0/channels',
	results: [channel],
	pagination,
};

export const inbox = {
	id: 'in_1aBMS9FKwvSDjljRJI1aZ',
	name: 'Support',
	url: '/v1.0/inboxes/in_1',
};

export const inboxesPage = {
	url: '/v1.0/inboxes',
	results: [inbox],
	pagination,
};

/** The live 401 for a missing key. */
export const missingKeyProblem = {
	exception: 'ApplicationException',
	exceptionCode: 'MethodNotAllowedException',
	userErrorMessage: 'Methode nicht erlaubt',
};
