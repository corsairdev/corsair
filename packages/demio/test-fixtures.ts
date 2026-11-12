// Responses in this file are recorded from the live API on a real account, so
// they carry the fields Demio actually sends rather than the ones its examples
// show. Recorded: /ping, /events, /event/{id}, /event/{id}/date/{date_id} and
// /report/{date_id}/participants.

export const ping = { pong: true };

export const pingSandbox = { pong: true, sandbox: true };

export const eventSummary = {
	id: 1021731,
	labeled_name: '[Single Series] My First Webinar Experience on Demio',
	name: 'My First Webinar Experience on Demio',
	description: null,
	date_id: 6801720,
	status: 'scheduled',
	timestamp: 1794330000,
	zone: 'America/New_York',
	registration_url: 'https://my.demio.com/ref/E31EpDkHHIHZwjQS',
	automated: null,
};

export const eventDetail = {
	id: 1021731,
	name: 'My First Webinar Experience on Demio',
	description: null,
	registrants_stay_registered: false,
	registration_url: 'https://my.demio.com/ref/E31EpDkHHIHZwjQS',
	automated: null,
	next_date_id: 6801720,
	dates: [
		{
			date_id: 6801720,
			status: 'scheduled',
			timestamp: 1794330000,
			datetime: 'November 10th, 2026 at 12:00PM EST',
			zone: 'America/New_York',
		},
	],
};

export const eventDate = {
	date_id: 6801720,
	status: 'scheduled',
	timestamp: 1794330000,
	datetime: 'November 10th, 2026 at 12:00PM EST',
	zone: 'America/New_York',
};

/**
 * The documented on-demand shape. Kept beside the recorded ones because this
 * account has no on-demand event, so it could not be recorded.
 */
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

export const registrationResult = {
	hash: '8f14e45fceea167a',
	join_link: 'https://event.demio.com/join/8f14e45fceea167a',
};

/** A registrant as the live report returns one. */
export const participant = {
	email: 'simulation+dave@demio.com',
	name: 'Dave',
	custom_fields: [],
	attended: false,
	status: 'did not attend',
};

/** A registrant who filled a custom field in, from the documented example. */
export const participantWithCustomField = {
	email: 'jane.doe@example.com',
	name: 'Jane Doe',
	custom_fields: [{ id: 'company', name: 'Company', value: 'Example Inc.' }],
	attended: true,
	status: 'completed',
};

export const participants = { participants: [participant] };

export const pong = { pong: true };

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

// The shapes below were recorded from the live API; the published specification
// does not document the 422 or the unverified-email message.

/** Omitting both `id` and `ref_url` on a registration. */
export const notEnoughParams = { errors: ['Not enough params.'] };

/** A registration against an account whose owner has not verified their email. */
export const emailNotVerified = {
	errors: ['Your email is not verified. Please, verify your email address.'],
};

/** An id that does not exist answers the same body as a forbidden one. */
export const noAccessToEvent = { errors: ["You haven't access to this Event"] };

export const noAccessToSession = {
	errors: ["You haven't access to this Event Session"],
};
