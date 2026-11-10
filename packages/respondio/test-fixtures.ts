/**
 * Response bodies for the tests, from the Stoplight project behind
 * https://developers.respond.io/docs/api and its documented examples.
 */

export const CONTACT = {
	id: 12345,
	firstName: 'Muhammad',
	lastName: 'Mahin',
	phone: '+60123456789',
	email: 'test@example.com',
	language: 'ms',
	profilePic: 'https://cdn.respond.io/profile_avatar.png',
	countryCode: 'MY',
	custom_fields: [{ name: 'Company Website', value: 'https://example.com' }],
	status: 'open',
	tags: ['new_customer', 'sales'],
	assignee: {
		id: 67890,
		firstName: 'Jane',
		lastName: 'Doe',
		email: 'jane@example.com',
	},
	lifecycle: 'Hot Lead',
	created_at: 1663274081,
	isBlocked: false,
};

export const CONTACTS = {
	items: [CONTACT, { ...CONTACT, id: 12346, email: 'other@example.com' }],
	pagination: {
		next: 'https://api.respond.io/v2/contact/list?cursorId=10',
		previous: null,
	},
};

// The write routes answer a code and a message, not the record.
export const ACK = { code: '200', message: 'Contact added successfully!' };

export const COMMENT = {
	contactId: 12345,
	text: 'You just commented from the API',
	created_at: 1662979868,
};

export const CONTACT_ID = { contactId: 12345 };

export const MESSAGE_SENT = { messageId: 1262965213 };

export const MESSAGE = {
	messageId: 1262965213,
	channelMessageId: 123,
	contactId: 12345,
	channelId: 42,
	traffic: 'outgoing',
	message: {
		type: 'text',
		text: 'There has been an update in your account...',
	},
	status: [
		{ status: 'delivered', timestamp: 1662979868 },
		{ status: 'read', timestamp: 1662979900 },
	],
	sender: { type: 'api' },
};

export const MESSAGES = {
	items: [MESSAGE, { ...MESSAGE, messageId: 1262965214, traffic: 'incoming' }],
	pagination: {
		next: 'https://api.respond.io/contact/id:12345/message/list?limit=10&cursorId=10',
		previous:
			'https://api.respond.io/contact/id:12345/message/list?limit=10&cursorId=-10',
	},
};

// With includeComments, each item carries a type of message or comment.
export const MESSAGES_WITH_COMMENTS = {
	items: [
		{ type: 'message', messageId: 1262965213, traffic: 'outgoing' },
		{
			type: 'comment',
			contactId: 12345,
			text: 'A note',
			created_at: 1662979868,
		},
	],
	pagination: { next: null, previous: null },
};

// A page can be empty while next is still set.
export const MESSAGES_EMPTY_PAGE_WITH_NEXT = {
	items: [],
	pagination: {
		next: 'https://api.respond.io/contact/x/message/list?cursorId=20',
	},
};

export const USERS = {
	items: [
		{
			id: 67890,
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
		},
	],
	pagination: { next: null, previous: null },
};

export const CHANNELS = {
	items: [
		{
			id: 42,
			name: 'WhatsApp Business',
			source: 'whatsapp',
			status: 'connected',
			created_at: 1663274081,
		},
	],
	pagination: { next: null, previous: null },
};

export const TEMPLATES = {
	items: [
		{
			id: 1,
			name: 'order_update',
			language: 'en',
			status: 'approved',
			category: 'UTILITY',
		},
	],
	pagination: { next: null, previous: null },
};

export const CLOSING_NOTES = {
	items: [
		{ id: 1, name: 'Resolved', category: 'Support' },
		{ id: 2, name: 'Duplicate', category: 'Support' },
	],
	pagination: { next: null, previous: null },
};

export const CUSTOM_FIELDS = {
	items: [
		{ id: 1, name: 'Company Website', type: 'url' },
		{ id: 2, name: 'Plan', type: 'list', options: ['free', 'pro'] },
		{ id: 3, name: 'Renewal', type: 'date' },
	],
	pagination: { next: null, previous: null },
};

export const CONTACT_CHANNELS = {
	items: [
		{
			id: 42,
			name: 'WhatsApp Business',
			source: 'whatsapp',
			status: 'connected',
		},
	],
	pagination: { next: null, previous: null },
};

// The documented error bodies.
export const UN_AUTHORIZED = { code: 401, message: 'UN_AUTHORIZED' };
export const VALIDATION_ERROR = { code: 400, message: 'Validation error.' };
export const NOT_FOUND = { code: 404, message: 'Contact not found.' };
export const RATE_LIMITED = { code: 429, message: 'Too Many Requests' };
export const FORBIDDEN = { code: 403, message: 'Forbidden' };
export const UNPROCESSABLE = {
	code: 449,
	message: 'Message cannot be sent outside the 24 hour window',
};
export const SERVER_ERROR = { code: 500, message: 'Internal Server Error' };
