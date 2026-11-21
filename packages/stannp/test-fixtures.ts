// Response bodies copied from the examples in the Stannp documentation
// (https://www.stannp.com/stannp-api-llm.md and the pages under
// /us/direct-mail-api/), with made-up people and companies. They were not
// captured from the live API: every unauthenticated probe answers 401 before
// the response shape is visible.

export const balance = { balance: '214.4200' };

export const topup = {
	receipt_pdf: 'https://www.stannp.com/invoice/12345-receipt.pdf',
};

export const validatedAddress = {
	address1: 'Unit 12 Taw Trade Park',
	address2: '',
	address3: '',
	city: 'Barnstaple',
	county: 'Devon',
	postcode: 'EX31 1JZ',
	country: 'GB',
	reference_id: 0,
	dps: '1A',
	udprn: '12345678',
	is_valid: true,
};

// The create examples are test mode; live adds more address fields.
export const mailpieceCreated = {
	pdf: 'https://www.stannp.com/assets/samples/a6-postcard-sample.pdf',
	id: 0,
	created: '2024-01-15T10:30:00+00:00',
	format: '4x6',
	cost: '0.88',
	status: 'test',
};

export const postcard = {
	id: 16818211,
	timestamp: '2019-10-30 00:14:04',
	status: 'cancelled',
	type: 'postcard',
	format: '4x6',
	pdf_file:
		'https://api-us1.stannp.com/v1/storage/get/port/1550016843/pdfs/sample.pdf',
	country: 'US',
	cost: 0,
	addons: '',
	tags: '',
	template_id: 0,
	campaign_id: 0,
	recipient_id: 0,
	firstname: 'John',
	lastname: 'Smith',
	address1: '123 Sample Street',
	address2: '',
	address3: '',
	city: 'Sampletown',
	county: '',
	postcode: 'AB12 3CD',
	transactional: 0,
	class: 0,
	updated: '2019-10-30 00:14:04',
	mailpiece_id: 16818211,
	tracking: [],
	zipcode: '12345',
};

export const letter = {
	...postcard,
	id: 16818210,
	account_id: 5,
	type: 'letter',
	format: 'A4',
};

export const recipient = {
	id: '1943',
	account_id: '5',
	title: 'Mr',
	firstname: 'John',
	lastname: 'Example',
	company: 'Example Co',
	job_title: '',
	address1: '123 Example street',
	address2: '',
	address3: '',
	city: 'New York',
	county: '',
	country: 'US',
	postcode: 'EX12 3AB',
	dps: '',
	email: 'john@example.com',
	phone_number: '+12125551234',
	ref_id: '',
	blacklist: '0',
	created: '2024-01-15 10:30:00',
	updated: '2024-01-15 10:30:00',
};

export const recipientCreated = {
	id: '1941',
	valid: true,
	created: '2024-01-15T10:30:00+00:00',
};

export const group = {
	id: '398',
	account_id: '1',
	name: 'Test Group',
	created: '2015-09-25 11:57:35',
	recipients: '100',
	valid: '98',
	international: '0',
	skipped: '0',
	status: 'ready',
	import_progress: '0',
	is_seeds: '0',
};

export const campaign = {
	id: '222',
	account_id: '9',
	name: 'a5 test',
	template_id: '0',
	type: 'a5-postcard',
	trigger_date: null,
	send_date: null,
	trigger_offset: null,
	created: '2015-04-26T10:40:00Z',
	updated: '2015-04-26T10:40:00Z',
	status: 'draft',
	recipients_group: '0',
	recipients_filter: '',
	recipients_validated: 'valid',
	recipients: '0',
	recipients_not_valid: '0',
	dispatched: '0',
	cost: '0.00',
	voucher_code: '',
	image: null,
};

export const campaignCost = {
	rate: '0.41',
	non_valid_rate: '0.51',
	delivery_rate: '0.00',
	international_rate: '0.00',
	valid: '14.35',
	not_valid: '191.25',
	international: '0.00',
	delivery_charge: '0.00',
	net: '205.60',
	vat: '41.12',
	total: '246.72',
};

export const availableDates = ['2026-10-09', '2026-10-10', '2026-10-11'];

export const reportingSummary = {
	total: 2000,
	received: 0,
	printing: 0,
	handed_over: 0,
	local_delivery: 400,
	delivered: 1599,
	returned: 1,
	cancelled: 0,
};

export const reportingMailpiece = {
	id: '6829954',
	timestamp: '2018-02-11 07:08:55',
	status: 'delivered',
	type: 'postcard',
	format: '4x6',
	pdf_file:
		'https://dash.stannp.com/api/v1/storage/get/bourbon/1518386934/pdf-production/000000000000000-0000000.pdf',
	dispatched: '2018-02-11 15:12:52',
	country: 'US',
	cost: '0.42',
	addons: '',
	tags: 'tag123,tag456',
	zipcode: '10001',
	address: '123 Main Street, New York, NY 10001',
};

export const template = {
	id: '0',
	account_id: '0',
	template_name: 'Template name 1',
	image: '',
	created: '2023-09-06 12:37:21',
	updated: '2023-11-01 09:53:20',
	size: 'US-letter',
	page_count: '1',
	duplex: '1',
	back_image: null,
	template: '',
	is_public: '1',
	is_template: '1',
	version: '3',
	is_hidden: '1',
	shared: '0',
	user_id: '0',
	tags: '',
	versions: '3',
};

export const sms = {
	id: 0,
	recipient_id: 0,
	phone_number: '01234567890',
	from: 'STANNP',
	profile_id: 3,
	usage_campaign_id: 0,
	profile_type: 'sender_id',
	message: 'Hello World',
	message_parts: 1,
	cost: 0.058,
	destination_country: 'GB',
	status: 'test',
	campaign_id: 0,
	created: '2024-07-25T16:16:28+00:00',
	updated: '',
};

export const folder = {
	id: '2',
	name: 'test folder',
	created: '2017-06-27 14:24:07',
};

// Error bodies.
export const badKey = {
	success: false,
	error: 'You do not have authorisation',
};

// ── Webhook payloads ──────────────────────────────────────────────────────

export const webhookValidation = {
	webhook_id: 0,
	event: 'test_url',
	created: '2024-01-15 10:30:00',
	retries: 0,
};

export const mailpieceStatusPayload = {
	webhook_id: 1234,
	event: 'mailpiece_status',
	created: '2024-01-15 10:30:00',
	retries: 0,
	mailpieces: [postcard],
};

export const campaignStatusPayload = {
	webhook_id: 1234,
	event: 'campaign_status',
	created: '2024-01-15 10:30:00',
	retries: 0,
	campaigns: [campaign],
};

export const recipientEventsPayload = {
	webhook_id: 1234,
	event: 'recipient_events',
	created: '2024-01-15 10:30:00',
	retries: 0,
	events: [{ id: '266', name: 'PURCHASE', value: '24.99', conversion: true }],
};
