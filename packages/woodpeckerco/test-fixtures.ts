// Response bodies copied from the examples in
// https://developers.woodpecker.co/docs, with made-up people and companies.
// They were not captured from the live API.

export const campaign = {
	id: 1234567,
	name: 'Field teams Q4',
	status: 'RUNNING',
	created: '2025-02-10T13:14:57+0100',
	from_name: 'Maya Ruiz',
	from_names: ['Maya Ruiz', 'Sam Okafor'],
	gdpr_unsubscribe: false,
	folder_name: 'Outbound',
	folder_id: 987,
	from_email: 'maya@fieldkit.example',
	from_emails: ['maya@fieldkit.example', 'sam@fieldkit.example'],
	per_day: 35,
	bcc: '',
	cc: '',
	error: '',
};

export const campaignWithStats = {
	...campaign,
	stats: {
		prospects: 868,
		delivery: 853,
		invalid: 6,
		bounced: 4,
		queue: 3,
		sent: 857,
		check: 21,
		autoreplied: 0,
		opened: 286,
		optout: 3,
		clicked: 0,
		replied: 74,
		interested: 42,
		maybe_later: 11,
		not_interested: 13,
		emails: [{ subject: 'Hello', step: 1, emailSend: 857, open_: '29.3%' }],
	},
	timestamp: '2025-03-01T15:00:30+0100',
};

export const campaignDetail = {
	id: 1234567,
	name: 'Field teams Q4',
	status: 'EDITED',
	bounce_shield_autopaused_at: null,
	email_account_ids: [123456, 123457],
	settings: { timezone: 'Europe/Warsaw', daily_enroll: 30 },
	steps: { id: 'e688d52a-b867-4690-acf2-3809286915b1', type: 'START' },
};

export const prospect = {
	id: 1234567890,
	email: 'jordan@acme-logistics.example',
	first_name: 'Jordan',
	last_name: 'Lee',
	company: 'Acme Logistics',
	organization_id: 654321789,
	industry: 'IT',
	website: 'https://acme-logistics.example',
	linkedin_url: 'https://linkedin.example/jordan-lee',
	tags: '#VIP',
	title: 'CEO',
	phone: '+1 555-0100',
	address: '700 Main Road',
	city: 'Austin',
	state: 'Texas',
	country: 'United States',
	last_contacted: '2025-03-20T14:32:34+0100',
	'last replied': '2025-03-21T08:11:35+0100',
	updated: '2025-03-21T08:11:35+0100',
	encrypted: false,
	snipet1: 'Runs a logistics company',
	snippet1: '',
	snippet15: '',
	snippet_labels: { custom_snippet: 'Runs a logistics company' },
	interested: 'MAYBE_LATER',
	interest_level: { level: 'MAYBE_LATER', ai_detected: false },
	campaign_id: 654321,
	campaign_name: 'Field teams Q4',
	campaign_email: 'maya@fieldkit.example',
	campaign_emails: ['maya@fieldkit.example'],
	followup_after: '2025-03-22T00:00:00+0100',
	campaign_status: 'RUNNING',
	sent_mails: 1,
	status: 'REPLIED',
};

const okStatus = { status: 'OK', code: 'OK', msg: 'OK' };

export const prospectsAdded = {
	prospects: [
		{
			email: 'jordan@acme-logistics.example',
			id: 1091123456,
			prospect: 'DUPLICATE',
		},
		{ email: 'priya@northwind.example', id: 1091123457 },
	],
	status: okStatus,
};

export const prospectsPartiallyAdded = {
	prospects: [
		{ email: 'priya@northwind.example', id: 1091123458 },
		{
			email: 'jordan@acme-logistics.example',
			id: 1091123456,
			prospect: 'DUPLICATE',
			prospect_campaign: 'DUPLICATE',
		},
		{
			email: 'not-an-address.example',
			status: 'ERROR',
			code: 'E_EMAIL',
			msg: 'This looks like invalid email format: not-an-address.example',
		},
	],
	status: okStatus,
};

/** The 400 body when none of the prospects were added. */
export const prospectsNotAdded = {
	prospects: [
		{
			email: 'jordan@acme-logistics.example',
			id: 1091123456,
			prospect: 'DUPLICATE',
			status: 'ERROR',
			code: 'E_INV_STATUS',
			msg: 'Status is other than ACTIVE.',
		},
	],
	status: {
		status: 'ERROR',
		code: 'E_INV_STATUS',
		msg: 'Status is other than ACTIVE.',
	},
};

/** The 200 body v1/prospects sends when nothing matches. */
export const noProspects = {
	message: 'There are no prospects matching the given criteria.',
};

/** v1 errors: `{ status: { status: 'ERROR', code, msg } }`. */
export function v1Error(code: string, msg: string) {
	return { status: { status: 'ERROR', code, msg } };
}

export const v1RateLimited = v1Error(
	'E_TOO_MANY_REQUESTS',
	'Too many requests in one time',
);

export const v1BadKey = v1Error(
	'E_SESSION',
	"The API key you've entered is incorrect or no longer valid.",
);

/** v2's default error: `{ title, status, detail, timestamp }`. */
export function v2Problem(status: number, title: string, detail: string) {
	return { title, status, detail, timestamp: '2025-03-05 17:57:00' };
}

/** v2's domain errors: `{ code, message, details }`. */
export function v2Domain(
	code: string,
	message: string,
	details: string | null = null,
) {
	return { code, message, details };
}
