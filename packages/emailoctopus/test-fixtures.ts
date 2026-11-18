export const list = {
	id: 'list-1',
	name: 'New clients list',
	double_opt_in: false,
	fields: [{ label: 'Email address', tag: 'EmailAddress', type: 'text' }],
	tags: ['vip'],
	counts: [{ pending: 0, subscribed: 2, unsubscribed: 0 }],
	created_at: '2026-07-15T08:39:44+00:00',
};

export const contact = {
	id: 'contact-1',
	email_address: 'otto@example.com',
	fields: { referral: 'Otto', how_many_pets: 2 },
	tags: ['vip'],
	status: 'subscribed',
	created_at: '2026-07-15T08:39:44+00:00',
};

export const tag = { tag: 'vip' };

export const field = {
	label: 'Hometown',
	tag: 'Hometown',
	type: 'text',
	fallback: 'Unknown',
};

export const campaign = {
	id: 'campaign-1',
	status: 'sent',
	name: 'June newsletter',
	subject: 'Hello',
	to: ['list-1'],
	from: { name: 'Otto', email_address: 'otto@example.com' },
	content: { html: '<p>Hi</p>' },
	created_at: '2026-07-15T08:39:44+00:00',
	sent_at: '2026-07-16T08:39:44+00:00',
};

export const page = <T>(item: T) => ({
	data: [item],
	paging: { next: null },
});

export const problem = {
	title: 'An error occurred.',
	detail: 'Bad request.',
	status: 400,
	type: 'https://emailoctopus.com/api-documentation/v2#bad-request',
};
