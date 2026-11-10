// Responses in this file come from the examples in Demio's published
// specification (https://api-docs.demio.com), not from a live account: the
// account that would send them needs a paid plan.

export const eventSummary = {
	id: 86,
	labeled_name: '[Standard] Product Walkthrough',
	name: 'Product Walkthrough',
	description: 'A tour of what shipped this quarter.',
	date_id: 1575,
	status: 'scheduled',
	timestamp: 1790000000,
	zone: 'America/New_York',
	registration_url: 'https://my.demio.com/ref/nI7XKRaVfZdj9CyQ',
	automated: null,
};

export const eventDate = {
	date_id: 1575,
	status: 'scheduled',
	timestamp: 1790000000,
	datetime: 'March 15th, 2026 at 2:00PM EDT',
	zone: 'America/New_York',
};

/** An on-demand date: undated inside `events.get`, playable now on its own. */
export const onDemandDateInEvent = {
	date_id: 1604,
	status: 'on-demand',
	timestamp: null,
	datetime: null,
	zone: null,
};

export const onDemandDateDetail = {
	date_id: 1604,
	status: 'running',
	timestamp: 1790086400,
	datetime: 'March 15th, 2026 at 2:00PM EDT',
	zone: 'America/New_York',
};

export const eventDetail = {
	id: 86,
	name: 'Product Walkthrough',
	description: 'A tour of what shipped this quarter.',
	registrants_stay_registered: false,
	registration_url: 'https://my.demio.com/ref/nI7XKRaVfZdj9CyQ',
	automated: null,
	next_date_id: 1575,
	dates: [eventDate],
};

export const registrationResult = {
	hash: '8f14e45fceea167a',
	join_link: 'https://event.demio.com/join/8f14e45fceea167a',
};

export const participant = {
	email: 'jane.doe@example.com',
	name: 'Jane Doe',
	custom_fields: [{ id: 'company', name: 'Company', value: 'Example Inc.' }],
	attended: true,
	status: 'completed',
};

export const participants = { participants: [participant] };

export const pong = { pong: true };

export const pongSandbox = { pong: true, sandbox: true };

/** The pre-endpoint rejection shape. */
export const unauthorized = { messages: ['Authorization failed'] };

/** The endpoint's own failure shape. */
export const eventNotFound = { errors: ['Event not found'] };

export const rateLimited = {
	messages: [
		'You have reached the maximum allowed API requests rate. Max allowed requests to this endpoint per minute: 180',
	],
};

export const dailyLimit = {
	messages: [
		"You've reached your daily limit of API calls. To learn more, access the API section of your account settings.",
	],
};

export const inactiveAccount = { messages: ['Account is not active'] };

export const forbiddenEvent = { errors: ["You haven't access to this Event"] };

export const serverFault = { errors: ['Something went wrong'] };
