// Fixtures built from the schemas in Telnyx's published OpenAPI document
// (https://github.com/team-telnyx/openapi). Every response is `{ data }`, and
// a list adds `meta` with the page counters.

export const meta = {
	total_pages: 2,
	total_results: 30,
	page_number: 1,
	page_size: 20,
};

export const message = {
	record_type: 'message',
	direction: 'outbound',
	id: '40385f64-5717-4562-b3fc-2c963f66afa6',
	type: 'SMS',
	messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
	organization_id: 'org-1',
	from: {
		phone_number: '+13125550001',
		carrier: 'Telnyx',
		line_type: 'Wireline',
	},
	to: [
		{ phone_number: '+13125550002', status: 'delivered', carrier: 'T-Mobile' },
	],
	text: 'Hello from Telnyx',
	num_chars: 18,
	encoding: 'GSM-7',
	parts: 1,
	// Telnyx sends the cost as an object with a string amount.
	cost: { amount: '0.004', currency: 'USD' },
	sent_at: '2024-03-01T10:00:00Z',
	completed_at: '2024-03-01T10:00:02Z',
	errors: [],
};

export const messageResponse = { data: message };

export const messagingProfile = {
	id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
	record_type: 'messaging_profile',
	name: 'Primary profile',
	enabled: true,
	webhook_url: 'https://example.com/webhooks/telnyx',
	webhook_failover_url: null,
	webhook_api_version: '2',
	whitelisted_destinations: ['US', 'CA'],
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-01-02T00:00:00Z',
};

export const messagingProfileResponse = { data: messagingProfile };

export const messagingProfilesList = {
	data: [messagingProfile],
	meta,
};

export const phoneNumber = {
	id: '1293384261075731499',
	record_type: 'phone_number',
	phone_number: '+13125550001',
	country_code: 'US',
	status: 'active',
	connection_id: '1293384261075731500',
	connection_name: 'Call control app',
	connection_type: 'call_control',
	messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
	messaging_profile_name: 'Primary profile',
	billing_group_id: null,
	number_type: 'local',
	emergency_enabled: false,
	emergency_address_id: null,
	purchased_at: '2024-01-01T00:00:00Z',
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-01-01T00:00:00Z',
	tags: ['support'],
};

export const phoneNumberResponse = { data: phoneNumber };

export const phoneNumbersList = { data: [phoneNumber], meta };

export const availablePhoneNumber = {
	phone_number: '+13125550199',
	record_type: 'available_phone_number',
	region_information: [{ region_type: 'country_code', region_name: 'US' }],
	// Costs are strings, with a currency.
	cost_information: {
		upfront_cost: '1.00',
		monthly_cost: '1.00',
		currency: 'USD',
	},
	features: [{ name: 'sms' }, { name: 'voice' }],
};

export const availablePhoneNumbersList = {
	data: [availablePhoneNumber],
	meta,
};

export const call = {
	record_type: 'call',
	call_control_id: 'v3:abc123',
	call_leg_id: 'leg-1',
	call_session_id: 'session-1',
	connection_id: '1293384261075731500',
	from: '+13125550001',
	to: '+13125550002',
	is_alive: true,
	call_state: 'active',
	direction: 'outgoing',
	started_at: '2024-03-01T10:00:00Z',
	answered_at: '2024-03-01T10:00:02Z',
	ended_at: null,
	client_state: null,
};

export const callResponse = { data: call };

export const callActionResult = { data: { result: 'ok' } };

export const callControlApplication = {
	id: '1293384261075731500',
	record_type: 'call_control_application',
	application_name: 'Voice app',
	active: true,
	anchorsite_override: 'Latency',
	webhook_event_url: 'https://example.com/webhooks/calls',
	webhook_event_failover_url: null,
	webhook_api_version: '2',
	first_command_timeout: false,
	first_command_timeout_secs: 30,
	inbound: { channel_limit: 10 },
	outbound: { channel_limit: 10 },
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-01-01T00:00:00Z',
};

export const callControlApplicationResponse = { data: callControlApplication };

export const callControlApplicationsList = {
	data: [callControlApplication],
	meta,
};

// The failure envelope: an array of entries, each with a code, title and
// detail. A refused key and an unknown resource use the same shape.
export const unauthorizedResponse = {
	errors: [
		{
			code: '10009',
			title: 'Authentication failed',
			detail: 'Could not authenticate with the provided credentials.',
			meta: { url: 'https://developers.telnyx.com/docs/overview/errors/10009' },
		},
	],
};

export const notFoundResponse = {
	errors: [
		{
			code: '10005',
			title: 'Resource not found',
			detail: 'The requested resource or URL could not be found.',
		},
	],
};

export const insufficientBalanceResponse = {
	errors: [
		{
			code: '20100',
			title: 'Insufficient funds',
			detail: 'The account balance is too low for this request.',
		},
	],
};
