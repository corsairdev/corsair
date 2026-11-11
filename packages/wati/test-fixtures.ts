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
	conversation_id: 'conv-1',
	wa_id: '1234567890',
	contact_name: 'John Doe',
	phone: '+1234567890',
	channel_id: 'channel_123',
	channel_type: 'whatsapp',
	last_message: 'Thanks!',
	last_message_timestamp: '2024-06-01T13:02:00Z',
	unread_count: 0,
	status: 'open',
	assigned_operator: null,
	assigned_team: null,
	tags: [],
};

export const conversationList = {
	conversation_list: [conversation],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const message = {
	id: 'msg-1',
	message_id: 'msg-1',
	conversation_id: 'conv-1',
	wa_id: '1234567890',
	message_type: 'text',
	text: 'Thanks!',
	status: 'delivered',
	timestamp: '2024-06-01T13:02:00Z',
	from_me: false,
	operator: null,
	template_name: null,
	media_url: null,
};

export const messageList = {
	message_list: [message],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const sent = {
	result: 'success',
	message: 'Message sent',
	success: true,
	id: 'msg-2',
	local_message_id: 'local-1',
};

export const template = {
	id: 'tpl-1',
	name: 'order_update',
	language: 'en',
	status: 'APPROVED',
	category: 'UTILITY',
	components: [],
	created: '2024-01-01T00:00:00Z',
	updated: '2024-02-01T00:00:00Z',
};

export const templateList = {
	messageTemplates: [template],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const channel = {
	id: 'channel_123',
	channel_id: 'channel_123',
	name: 'Support line',
	type: 'whatsapp',
	status: 'connected',
	phone_number: '+1234567890',
};

export const channelList = { channels: [channel] };

export const credits = { credits: 1200, balance: 1200 };

export const broadcast = {
	id: 'bc-1',
	broadcast_id: 'bc-1',
	name: 'June promo',
	status: 'COMPLETED',
	template_name: 'june_promo',
	created: '2024-06-01T00:00:00Z',
	scheduled: '2024-06-01T09:00:00Z',
	sent: 100,
	delivered: 95,
	read: 60,
	failed: 5,
};

export const broadcastList = {
	broadcasts: [broadcast],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const recipient = {
	wa_id: '1234567890',
	phone: '+1234567890',
	name: 'John Doe',
	status: 'read',
	sent: '2024-06-01T09:00:00Z',
	delivered: '2024-06-01T09:00:02Z',
	read: '2024-06-01T09:05:00Z',
	error: null,
};

export const recipientList = {
	recipients: [recipient],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const segment = {
	id: 'seg-1',
	segmentId: 'seg-1',
	name: 'Active customers',
	contact_count: 420,
	created: '2024-01-01T00:00:00Z',
};

export const segmentList = {
	segments: [segment],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const segmentEvaluation = { count: 420, contacts: [contact] };

export const webhook = {
	id: 'wh-1',
	url: 'https://acme.example/hooks/wati',
	name: 'Acme hook',
	events: ['message', 'contact'],
	status: 'active',
	created: '2024-01-01T00:00:00Z',
};

export const webhookList = {
	webhooks: [webhook],
	page_number: 1,
	page_size: 20,
	total: 1,
	total_pages: 1,
};

export const deleted = { success: true, message: 'Deleted' };

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
