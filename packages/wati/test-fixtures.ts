// Response bodies built from the V3 contract pages linked from
// https://docs.wati.io/llms.txt, with made-up ids and numbers.

export const contact = {
	id: '507f1f77bcf86cd799439011',
	wa_id: '1234567890',
	name: 'John Doe',
	phone: '+1234567890',
	photo: 'https://example.com/photos/johndoe.jpg',
	created: '2024-01-15T10:30:00Z',
	last_updated: '2024-02-10T14:45:00Z',
	contact_status: 'active',
	source: 'manual',
	channel_id: 'channel_123',
	opted_in: true,
	allow_broadcast: true,
	allow_sms: false,
	teams: ['Team A'],
	custom_params: [
		{ name: 'age', value: '30' },
		{ name: 'city', value: 'New York' },
	],
};

export const contactList = {
	contact_list: [contact],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const conversation = {
	id: 'conv-1',
	contact_id: '65b73810e2bd04aa867b5f7d',
	contact_name: 'John Doe',
	channel_type: 'whatsapp',
	started_date: '2025-01-15T10:30:00Z',
	last_updated: '2025-01-16T08:00:00Z',
};

export const conversationList = {
	conversation_list: [conversation],
	page_number: 1,
	page_size: 20,
};

export const message = {
	text: 'Thanks!',
	type: 'text',
	timestamp: '2026-07-14T16:15:38.3978844Z',
	owner: false,
	status: 'delivered',
	avatar_url: null,
	assigned_id: '6858f59a3374901cc1c8223f',
	operator_name: null,
	bot_type: 'regular',
	local_message_id: '88aed3c93a050b3c53978463',
	id: 'msg-1',
	created: '2026-07-14T16:15:38.3978836Z',
	conversation_id: 'conv-1',
	ticket_id: '68aed3c93a050b3c53978463',
	event_type: 'message',
};

export const messageList = {
	message_list: [message],
	page_number: 1,
	page_size: 20,
	channel_id: 'channel_123',
};

/** What a text or file send answers: the queued message, as an object. */
export const sent = {
	message: {
		...message,
		id: 'msg-2',
		text: 'Your order shipped.',
		owner: true,
		status: 'sending',
	},
};

/** What a template send answers. */
export const templateSent = {
	success: true,
	broadcast_id: 'broadcast_123456',
	recipients: [
		{ local_message_id: 'local-1', phone_number: '1234567890', errors: [] },
	],
};

/** A template send WATI refused for one recipient, still inside an HTTP 200. */
export const templateSentWithErrors = {
	success: false,
	broadcast_id: null,
	error: 'Template not approved',
	recipients: [
		{
			local_message_id: null,
			phone_number: '1234567890',
			errors: ['Template not approved'],
		},
	],
};

export const template = {
	id: 'tpl-1',
	name: 'order_update',
	category: 'UTILITY',
	sub_category: 'STANDARD',
	hsm: 'Hello {{1}}, your order shipped.',
	custom_params: [{ name: 'name', value: 'customer_name' }],
	status: 'APPROVED',
	language_option: {
		key: 'English (US)',
		value: 'en_US',
		text: 'English (US)',
	},
	last_modified: '2024-01-15T10:30:00Z',
	type: 'TEXT',
	body: 'Hello {{1}}, your order shipped.',
	buttons: [],
	carousel_cards: [],
};

export const templateList = {
	templates: [template],
	page_number: 1,
	page_size: 20,
	total: 1,
};

export const channel = {
	id: '65b761a8e46b7808776e19b6',
	name: 'Support',
	channel: 'WhatsApp',
};

export const channelList = { channels: [channel] };

export const credits = {
	credit: 12.5,
	welcomeCredit: 0,
	remainingFreeConversationsCount: 1000,
	currency: 'USD',
	autoChargeEnabled: false,
};

export const broadcast = {
	id: 'bc-1',
	channel_id: 'channel-456',
	name: 'June promo',
	status: 'COMPLETED',
	template_id: 'template-789',
	fallback_templates: [],
	created: '2024-06-01T00:00:00Z',
	last_updated: '2024-06-02T00:00:00Z',
	scheduled_at: '2024-06-01T09:00:00Z',
	statistics: {
		total_recipients: 100,
		total_sent: 100,
		total_delivered: 95,
		total_read: 60,
		total_failed: 5,
	},
};

export const broadcastList = {
	broadcasts: [broadcast],
	page_number: 1,
	page_size: 20,
	total: 1,
};

export const recipient = {
	id: 'recipient-123',
	contact_id: 'contact-456',
	contact_name: 'John Doe',
	contact_phone: '+1234567890',
	status: 'read',
	local_message_id: 'local-msg-789',
	message_id: 'msg-101112',
	custom_params: [{ name: 'firstName', value: 'John' }],
	created: '2024-06-01T09:00:00Z',
};

export const recipientList = {
	recipients: [recipient],
	page_number: 1,
	page_size: 20,
	total_count: 1,
};

export const segment = {
	id: 'seg-1',
	name: 'Active customers',
	tag: 'customers',
	hitCount: 420,
	status: 1,
	created: '2024-01-01T00:00:00Z',
	lastUpdated: '2024-02-01T00:00:00Z',
	source: 0,
	refreshType: 0,
	useUploadedContact: false,
};

export const segmentList = {
	segments: [segment],
	pageNumber: 1,
	pageSize: 20,
	total: 1,
};

export const segmentEvaluation = {
	contacts: [contact],
	pageNumber: 1,
	pageSize: 20,
	total: 420,
	hasNextPage: true,
	hasPreviousPage: false,
};

export const webhook = {
	id: 'wh-1',
	phoneNumber: '1234567890',
	url: 'https://acme.example/hooks/wati',
	status: 'Enabled',
	// The V3 reference names this field `eventTypes`.
	eventTypes: ['message', 'contact'],
	created: '2024-01-01T00:00:00Z',
};

/** The V3 list answers a bare array, with no envelope or paging. */
export const webhookList = [webhook];

export const deleted = {
	contactId: '507f1f77bcf86cd799439011',
	deleted: true,
	cleanupCompleted: true,
};

export const webhookDeleted = { id: 'wh-1' };

export const contactCount = { contact_count: 100 };

/** The error bodies the API sends. */
export const missingToken = {
	error: 'missing_token',
	code: 401,
	message:
		"No access token was provided. Send your API key as 'Authorization: Bearer <key>'.",
	timestamp: '2026-11-11T05:42:55.3689141Z',
};

export const invalidToken = {
	error: 'invalid_token',
	code: 401,
	message: 'The bearer token is invalid, malformed, or has expired.',
	timestamp: '2026-11-11T05:42:55.5588199Z',
};

export const forbidden = {
	error: 'forbidden',
	code: 403,
	message: 'The token does not have contactsv3:write.',
	timestamp: '2026-11-11T05:42:55.5588199Z',
};

export const badRequest = {
	error: 'bad_request',
	code: 400,
	message: 'whatsapp_number is required',
	timestamp: '2026-11-11T05:42:55.5588199Z',
};

export const rateLimited = {
	error: 'rate_limited',
	code: 429,
	message: 'Too many requests.',
	timestamp: '2026-11-11T05:42:55.5588199Z',
};
