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
	user,
	topic: 'product_updates',
};
export const userUnsubscribed = {
	...envelope,
	name: 'user_unsubscribed',
	user,
	topic: 'product_updates',
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

export const relationship = {
	id: 'a1b2c3d4-1111-2222-3333-444455556666',
	properties: { role: 'admin' },
	user,
	company,
	created_at: '2024-03-01T08:00:00Z',
	updated_at: '2024-03-01T08:00:00Z',
};

export const relationshipCreated = {
	...envelope,
	name: 'relationship_created',
	relationship,
};
export const relationshipUpdated = {
	...envelope,
	name: 'relationship_updated',
	relationship,
};

export const formSubmitted = {
	...envelope,
	name: 'form_submitted',
	form: { id: 'form-1', identifier: 'signup', name: 'Signup form' },
	user,
	properties: { company_size: '11-50', role: 'engineering' },
};

export const message = {
	id: 'msg-1',
	identifier: 'welcome_email',
	subject: 'Welcome to Acme',
	status: 'enqueued',
	user,
	created_at: '2024-12-04T14:20:00Z',
	updated_at: '2024-12-04T14:20:00Z',
};

export const messageEnqueued = {
	...envelope,
	name: 'message_enqueued',
	message,
};
export const messageOpened = { ...envelope, name: 'message_opened', message };
export const messageClicked = {
	...envelope,
	name: 'message_clicked',
	message,
	url: 'https://acme.example/pricing',
};
export const messageBounced = { ...envelope, name: 'message_bounced', message };
export const messageReported = {
	...envelope,
	name: 'message_reported',
	message,
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
