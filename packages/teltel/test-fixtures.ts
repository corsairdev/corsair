// Fixtures built from the response schemas in TelTEL's published API document
// (https://apidoc.teltel.io). Every payload is wrapped in `data`, the deletes
// and updates report under `meta`, and the balance entries are floats.

// The live shape (11-16): `data` is one object, not the spec's list.
export const balanceResponse = {
	data: {
		credit: -9.99,
		credit_limit: 200,
		balance: 190.01,
	},
};

export const smsSendResponse = { data: { id: '1832256' } };

export const smsSendBulkResponse = {
	data: [
		{ id: '109', index: 0 },
		{ id: '110', index: 1 },
	],
};

// A bulk send can answer 207 with a split of successes and errors.
export const smsSendBulkPartial = {
	data: {
		success: [{ id: '109', index: 0 }],
		errors: [
			{ index: 1, title: 'Invalid number', detail: 'Not a reachable number.' },
		],
	},
};

export const smsReport = {
	id: 1832256,
	from: '37126118199',
	to: '37126118198',
	// The spec's shape: numeric ids and mobile codes.
	country: { id: 109, name: 'Latvia', iso: 'LV', mcc: 247 },
	operator: { id: 1, name: 'LMT', mnc: 1 },
	created_at: '2024-03-01 10:00:00',
	delivered: '2024-03-01 10:00:02',
	multipart: false,
	parts: 1,
	price: 0.03,
	sum: 0.03,
	state: 'delivered',
	detailed_state: 'DELIVRD',
	message: 'Hello from TelTEL',
	campaign_id: null,
	error_msg: null,
};

export const smsReportsListResponse = { data: [smsReport] };

export const smsReportResponse = { data: smsReport };

export const inboxMessage = {
	id: 991,
	from: '37126118198',
	to: '37126118199',
	state: 'received',
	received_at: '2024-03-01 11:00:00',
	message: 'Reply from a customer',
	error_msg: null,
	sms_handler_email: null,
	sms_handler_url: 'https://example.com/handler',
};

export const inboxListResponse = { data: [inboxMessage] };

export const inboxMessageResponse = { data: inboxMessage };

export const campaign = {
	id: 781,
	title: 'Spring sale',
	from: '37126118199',
	contact_groups: [5, 6],
	message: 'Spring sale starts now',
	rate: 60,
	unicode: false,
	state: 'draft',
	type: 'sms',
	created_at: '2024-03-01 09:00:00',
};

export const campaignsListResponse = { data: [campaign] };

export const campaignResponse = { data: campaign };

export const campaignCreateResponse = {
	data: { id: 781, title: 'Spring sale' },
};

export const campaignActionResponse = {
	data: { id: 761, action: 'start' },
};

export const contact = {
	id: 981,
	group_id: 5,
	phone: '37121234567',
	param_1: 'Param 1',
	param_2: null,
	param_3: null,
	param_4: null,
	param_5: null,
};

export const contactsListResponse = { data: [contact] };

export const contactResponse = { data: contact };

export const contactCreateResponse = {
	data: { id: 981, phone: '37121234567' },
};

export const contactsBulkResponse = { data: [{ id: 981 }, { id: 982 }] };

export const contactGroup = {
	id: 5,
	name: 'Customers',
	total_contacts: 120,
	created: '2024-01-01 00:00:00',
};

export const contactGroupsListResponse = { data: [contactGroup] };

export const contactGroupResponse = { data: contactGroup };

export const deletedResponse = { meta: { deleted: true } };

export const updatedResponse = { meta: { updated: true } };

export const call = {
	call_id: '1632136720.2983796.44.41',
	starttime: '2021-09-20 14:18:44',
	stoptime: '2021-09-20 14:18:48',
	direction: 'outbound',
	type: 'click2call',
	status: 'completed',
	duration_sec: 4,
	waiting_sec: 1,
	handle_sec: 3,
	rate: 0.05,
	cost: 0.0033,
	// user_id is a number or null in the spec.
	caller: {
		number: '37126111111',
		type: 'phone',
		cid: '37126111111',
		dnid: '',
		user_id: 21312,
	},
	callee: { number: '37126111112', type: 'phone', user_id: null },
	extra_prefix: null,
	hangup_by: 'caller',
	hangup_value: 'normal',
	call_flow: 'basic',
	audio_url: 'https://example.com/calls/1632136720.mp3',
};

export const callsListResponse = { data: [call] };

export const callCreateResponse = {
	data: { status: 200, message: 'Callback created.' },
};

export const phoneNumber = {
	id: 115,
	activated: 1,
	iduser: null,
	country_id: 115,
	country_name: 'Latvia',
	did: '37126118199',
	overphone: null,
	description: 'Support line',
	monthly_price: 1.5,
	reservation_date: '2024-01-01 00:00:00',
	release_date: null,
	next_payment_date: '2024-04-01 00:00:00',
	month_payed: 1,
	auto_renew: 1,
	sms_support: 1,
	sms_handler_url: 'https://example.com/handler',
	sms_handler_email: 'support@example.com',
	spam_score: 0,
	spam_checked_at: null,
	spam_score_details: null,
	groups: [{ id: 5 }],
	users: [],
};

export const numbersListResponse = { data: [phoneNumber] };

export const numberResponse = { data: phoneNumber };

export const numberCountry = {
	id: 115,
	name: 'Latvia',
	prefix: '371',
	sms_support: 1,
	needs_verification: 0,
};

export const numberCountriesListResponse = { data: [numberCountry] };

export const numberCountryResponse = { data: numberCountry };

export const priceGroup = {
	price_group_id: 1525,
	country_id: 115,
	name: 'Mobile (Bite, LMT, Tele2)',
	prefix: '37126',
};

export const priceGroupsListResponse = { data: [priceGroup] };

export const user = {
	id: 21312,
	name: 'u8172616',
	realname: 'John Doe',
	email: 'john.doe@company.com',
	// TelTEL returns each user's key; the plugin drops it.
	api_key: 'user-api-key-must-not-leak',
};

export const usersListResponse = { data: [user] };

// A failure: 401 means no credential, 403 means one was sent and refused.
export const unauthenticatedResponse = {
	errors: [{ code: '40100', title: 'Unauthenticated.', detail: null }],
};

export const forbiddenResponse = {
	errors: [{ code: '40300', title: 'Forbidden', detail: null }],
};

export const badRequestResponse = {
	errors: [
		{
			code: '40000',
			title: 'Bad request.',
			detail: 'The number is not in international format.',
		},
	],
};
