// Webhook and Push API bodies built from
// https://userlist.com/docs/developers/webhooks/ and
// https://userlist.com/docs/developers/push-api/, with made-up people.

export const user = {
	id: '3d70d1d4-484a-4e72-8857-916ee525214e',
	identifier: 'user-123',
	email: 'user-123@example.com',
	properties: { first_name: 'Delaney', last_name: 'Jones' },
	signed_up_at: '2024-01-15T10:30:00Z',
	last_seen_at: '2024-12-04T14:22:00Z',
	created_at: '2024-01-15T10:30:00Z',
	updated_at: '2024-12-04T14:22:00Z',
};

const envelope = {
	id: '0ed1e6d0-ba8b-4194-8999-4e7fe4821a2c',
	scope: 'userlist',
	occurred_at: '2024-12-04T14:20:00Z',
	created_at: '2024-12-04T14:20:15Z',
	updated_at: '2024-12-04T14:20:15Z',
};

export const userCreated = { ...envelope, name: 'user_created', user };
export const userUpdated = { ...envelope, name: 'user_updated', user };
export const userSubscribed = {
	...envelope,
	name: 'user_subscribed',
	// The topic travels in the event's own properties, not at the top level.
	properties: {
		topic_id: '6f1c2b8e-0a4d-4b7e-9c33-2d5e8f7a1b90',
		topic_name: 'Product updates',
	},
	user,
};
export const userUnsubscribed = {
	...envelope,
	name: 'user_unsubscribed',
	properties: {
		topic_id: '6f1c2b8e-0a4d-4b7e-9c33-2d5e8f7a1b90',
		topic_name: 'Product updates',
	},
	user,
};

export const company = {
	id: '5b2f9c31-0d44-4e11-9a77-c2e3d4f5a6b7',
	identifier: 'company-42',
	name: 'Acme Inc.',
	properties: { plan: 'plus' },
	signed_up_at: '2024-02-01T09:00:00Z',
	created_at: '2024-02-01T09:00:00Z',
	updated_at: '2024-02-01T09:00:00Z',
};

export const companyCreated = { ...envelope, name: 'company_created', company };
export const companyUpdated = { ...envelope, name: 'company_updated', company };

/** The relationship itself carries only its id and properties. */
export const relationship = {
	id: 'a1b2c3d4-1111-2222-3333-444455556666',
	properties: { role: 'admin' },
	created_at: '2024-03-01T08:00:00Z',
	updated_at: '2024-03-01T08:00:00Z',
};

// The user and the company sit beside the relationship, at the top level.
export const relationshipCreated = {
	...envelope,
	name: 'relationship_created',
	user,
	company,
	relationship,
};
export const relationshipUpdated = {
	...envelope,
	name: 'relationship_updated',
	user,
	company,
	relationship,
};

/** The answers are the event's properties. */
export const formSubmitted = {
	...envelope,
	name: 'form_submitted',
	user,
	properties: { company_size: '11-50', role: 'engineering' },
};

/** Message events name the message in `properties` and carry the recipient. */
const messageProperties = {
	message_id: '019eff22-ab1d-7ba2-854e-5d32fae11e60',
	subject: 'Welcome to Acme',
};

export const messageEnqueued = {
	...envelope,
	name: 'message_enqueued',
	properties: messageProperties,
	user,
};
export const messageOpened = {
	...envelope,
	name: 'message_opened',
	properties: messageProperties,
	user,
};
export const messageClicked = {
	...envelope,
	name: 'message_clicked',
	properties: { ...messageProperties, url: 'https://acme.example/pricing' },
	user,
};
export const messageBounced = {
	...envelope,
	name: 'message_bounced',
	properties: {
		...messageProperties,
		bounce_type: 'hard',
		bounce_reason: 'Mailbox does not exist',
	},
	user,
};
export const messageReported = {
	...envelope,
	name: 'message_reported',
	properties: messageProperties,
	user,
};

/** A payload that matches an event name but lacks the required object. */
export const malformed = { ...envelope, name: 'user_created' };

/** The error body every Push API failure uses. */
export const unauthorized = {
	status: 401,
	code: 'unauthorized',
	errors: ['You are not authorized to do this.'],
};

export const unprocessable = {
	status: 422,
	code: 'unprocessable_content',
	errors: ['User must exist', 'Email is invalid'],
};

export const tooLarge = {
	status: 413,
	code: 'payload_too_large',
	errors: ['The payload is too large.'],
};

export const rateLimited = {
	status: 429,
	code: 'too_many_requests',
	errors: ['Rate limit exceeded.'],
};
