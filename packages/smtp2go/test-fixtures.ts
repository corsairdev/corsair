// Response fixtures from the documented examples on developers.smtp2go.com
// and from the live error probes recorded in the build notes. Each one keeps
// the provider's own field spellings.

export const REQUEST_ID = 'aa253464-0bd0-467a-b24b-6159dcd7be60';

export const sendOk = {
	request_id: REQUEST_ID,
	data: {
		succeeded: 1,
		failed: 0,
		failures: [],
		email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
	},
};

export const sendPartialFailure = {
	request_id: REQUEST_ID,
	data: {
		succeeded: 1,
		failed: 1,
		failures: [{ email_address: 'bad@example.com', error: 'rejected' }],
		email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
	},
};

export const sendScheduled = {
	request_id: REQUEST_ID,
	data: {
		succeeded: 1,
		failed: 0,
		failures: [],
		email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
		schedule_id: 'caa928f4-24ec-4a68-bcfc-1fd2596342f0',
	},
};

export const sendMimeOk = {
	request_id: REQUEST_ID,
	data: {
		failed: 0,
		failures: [],
		succeeded: 1,
		email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
	},
};

export const batchOk = {
	request_id: REQUEST_ID,
	data: [
		{ email_id: '123456-1234-12' },
		{ schedule_id: '188262b6-f6cc-4c98-bbe6-84c39d1c0ef4' },
	],
};

export const sentEmail = {
	sender: 'test@example.com',
	email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
	smtpcode: 250,
	response: '250 2.0.0 OK 1466989602 87si22895035pfn.73 - gsmtp',
	process_status: 'completed',
	host: 'gmail-smtp-in.l.google.com [74.125.200.27]',
	recipient: 'test2@example.com',
	delivered_at: '2016-06-27 01:06:42.668336+00:00',
	opens: [
		{
			user_agent: 'Mozilla/5.0 (iPad; CPU OS 9_3_5 like Mac OS X)',
			opened_at: '2018-04-02 19:26:53.010729+00:00',
			read_secs: '10',
			recipient: 'test2@example.com',
			ip_address: 'x.x.x.x',
		},
	],
	total_opens: 1,
	status: 'delivered',
};

export const sentSearchOk = {
	request_id: '84fe4a7e-1487-4ddf-92cb-4c6f8e6b2070',
	data: { count: 1, emails: [sentEmail], continue_token: null },
};

export const scheduledEmail = {
	schedule_id: '4d3b03a7-8663-4592-899a-b479ba6fcba9',
	schedule: '2025-06-30T23:11:56Z',
	sender: 'test@example.com',
	subject: 'test 1',
	recipients: 'test@example2.com',
	client_ip: '127.0.0.1',
};

export const scheduledSearchOk = {
	request_id: 'c2dca1b4-89b9-4dc7-bd82-a86b83b29d84',
	data: [
		scheduledEmail,
		{ ...scheduledEmail, schedule_id: '188262b6-f6cc-4c98-bbe6-84c39d1c0ef4' },
	],
};

export const cancelScheduledOk = {
	request_id: REQUEST_ID,
	data: { schedule_id: '4d3b03a7-8663-4592-899a-b479ba6fcba9', removed: true },
};

export const activityEvent = {
	from: 'rob@example.co.uk',
	recipient: 'jo@another_example.com',
	subaccount_name: 'Master account',
	email_id: '1u0SwL-B9zBpi9ffUq-JAB2',
	date: '2022-11-12T07:44:58Z',
	event: 'delivered',
	subject: 'My Test Email',
	username: 'api-5BFDE1E62529',
	sender: 'rob@example.co.uk',
	to: 'jo@another_example.com',
	bcc: 'audit@example.co.uk',
	smtp_response: '250 Message received',
	host: '136.143.191.44',
	headers: 'Content-Type: text/html',
	custom_headers: { 'X-MyCustomID': '01HMSACEHXHDG4X1CZV89SQMP7' },
};

export const activitySearchOk = {
	request_id: REQUEST_ID,
	data: { events: [activityEvent], total_events: 1, continue_token: null },
};

export const suppressionRow = {
	block_description: '',
	complaint: '',
	email_address: 'temp@example.com',
	reason: 'manual',
	subject: null,
	timestamp: '2022-11-14 07:54:45',
};

export const suppressionListOk = {
	request_id: '0d782ff6-63f2-11ed-9e11-f23c92160e3c',
	data: { continue_token: null, results: [suppressionRow], total_results: 1 },
};

export const suppressionAddOk = {
	request_id: REQUEST_ID,
	data: {
		added: true,
		block_description: '',
		email_address: 'temp@example.com',
	},
};

export const suppressionRemoveOk = {
	request_id: 'be4811ac-63f2-11ed-ab1c-f23c9216bfec',
	data: {
		suppressions: [
			{ email_address: 'temp@test.com', reason: 'manual', removed: true },
			{ email_address: 'temp@test.com', reason: 'spam', removed: false },
		],
	},
};

export const domainDetail = {
	fulldomain: 'example.com',
	subdomain: null,
	domain: 'example',
	suffix: 'com',
	dkim_selector: 's123456',
	dkim_verified: true,
	dkim_status: '',
	dkim_value: 'dkim.smtp2go.net',
	rpath_selector: 'em744766',
	rpath_verified: true,
	rpath_status: '',
	rpath_value: 'return.smtp2go.net',
	setup_link: 'https://app.smtp2go.com/setup/example.com',
};

export const tracker = {
	fulldomain: 'link.example.com',
	subdomain: 'link',
	domain: 'example',
	suffix: 'com',
	cname_verified: true,
	cname_status: '',
	cname_value: 'track.smtp2go.net',
	enabled: true,
};

export const domainsListOk = {
	request_id: 'e023461c-8c86-11e9-b984-408d5cce2644',
	data: {
		domains: [
			{
				domain: domainDetail,
				trackers: [tracker],
				subaccount_access: { subaccounts: [], future_subaccounts: false },
			},
		],
	},
};

export const domainsAddOk = {
	request_id: REQUEST_ID,
	data: { domains: [{ domain: domainDetail, trackers: [tracker] }] },
};

export const domainsVerifyOk = {
	request_id: REQUEST_ID,
	data: {
		domains: [
			{
				domain: { ...domainDetail, dkim_verified: true, rpath_verified: true },
				trackers: [{ ...tracker, cname_verified: false }],
			},
		],
	},
};

export const domainsRemoveOk = {
	request_id: '117607da-8c88-11e9-96fa-408d5cce2644',
	data: { domains: [] },
};

export const statsBouncesOk = {
	request_id: 'ee9b9484-63eb-11ed-8da7-f23c9216ce11',
	data: {
		emails: 1,
		rejects: 0,
		softbounces: 0,
		hardbounces: 0,
		bounce_percent: '0.00',
	},
};

export const statsCycleOk = {
	request_id: '4b84c952-9bca-432f-a68e-585e4c7a969c',
	data: {
		cycle_start: '2022-11-01 00:00:00+00:00',
		cycle_end: '2022-11-30 00:00:00+00:00',
		cycle_used: 1,
		cycle_remaining: 9999,
		cycle_max: 10000,
	},
};

export const statsSpamOk = {
	request_id: REQUEST_ID,
	data: { emails: 1, rejects: 0, spams: 0, spam_percent: '0.00' },
};

export const statsUnsubsOk = {
	request_id: REQUEST_ID,
	data: { emails: 1, rejects: 0, unsubscribes: 0, unsubscribe_percent: '0.00' },
};

export const statsHistoryOk = {
	request_id: REQUEST_ID,
	data: {
		count: 1,
		history: [
			{
				used: 1,
				bytecount: 1022,
				avgsize: 1022,
				email_address: 'test3@example.com',
				lastip: '82.1.149.48',
				bounces: 0,
				clicks: 0,
				opens: 0,
				rejects: 0,
				spam: 0,
				unsubscribes: 0,
			},
		],
	},
};

export const statsSummaryOk = {
	request_id: '72f48187-64d9-4a2f-ba9c-527a2a7911f7',
	data: {
		spam_emails: 0,
		cycle_start: '2022-11-01 00:00:00+00:00',
		cycle_end: '2022-11-30 00:00:00+00:00',
		cycle_used: 1,
		cycle_remaining: 9999,
		cycle_max: 10000,
		email_count: 1,
		bounce_rejects: 0,
		softbounces: 0,
		hardbounces: 0,
		bounce_percent: '0.00',
		spam_rejects: 0,
		spam_percent: '0.00',
		unsubscribes: 0,
		unsubscribe_percent: '0.0',
		opens: 0,
		clicks: 0,
		rejects: 0,
	},
};

export const templateSummary = {
	name: 'Order receipt',
	id: '5355878',
	subject: 'Order receipt for {{ product_name }}',
	tags: ['one', 'two'],
	last_updated: '2024-01-01 12:00:00',
};

export const templateSearchOk = {
	request_id: '13ab6f3a-ddea-11eb-b4ce-1002b51e60a4',
	data: { continue_token: null, templates: [templateSummary], total_count: 1 },
};

export const templateViewOk = {
	request_id: 'b0107930-6410-11ed-b1a0-f23c9216bf47',
	data: {
		name: 'Shiny new name',
		id: 'testid',
		subject: 'Shiny new Subject',
		tags: ['tag1', 'tag2'],
		html_body: '<p>Hello {{ variable }}</p>',
		text_body: 'Hello {{ variable }}',
		template_variables: { variable: 'strawberries' },
		last_updated: '2024-01-01 12:00:00',
	},
};

export const templateAddOk = {
	request_id: REQUEST_ID,
	data: {
		template_name: 'Shiny new name',
		id: 'testid',
		subject: 'Shiny new Subject',
		html_body: 'Shiny HTML body. This is a {{ variable }}',
		text_body: 'Shiny Text body',
		template_variables: { variable: 'strawberries' },
		tags: ['tagged'],
	},
};

export const templateEditOk = {
	request_id: REQUEST_ID,
	data: {
		id: 'testid',
		template_name: 'Shiny new name',
		subject: 'Shiny new Subject',
		html_body: 'Shiny HTML body. This is a {{ variable }}',
		text_body: 'Shiny Text body',
		template_variables: { variable: 'strawberries' },
		tags: ['tagged'],
		last_updated: '2024-01-01 12:00:00',
	},
};

export const templateDeleteOk = {
	request_id: '0ad5c75a-640f-11ed-83e8-f23c9216bf70',
	data: "Successfully deleted template 'example'",
};

export const webhookViewOk = {
	request_id: 'f3e50113-deb2-4e54-9675-2ea497c3732e',
	data: {
		url: 'https://example.com/webhook',
		id: 4317,
		events: ['spam'],
		sms_events: [],
		headers: [],
		usernames: [],
		output_format: 'json',
		disabled: false,
	},
};

export const webhookAddOk = {
	request_id: REQUEST_ID,
	data: {
		url: 'https://example.com/test-webhook',
		id: 4320,
		events: ['processed'],
		headers: 'X-Test-Header',
		usernames: 'MyUser1',
		sms_events: ['sending'],
		output_format: 'json',
	},
};

export const webhookEditOk = {
	request_id: REQUEST_ID,
	data: {
		url: 'https://example.com/test-webhook-2',
		id: 4320,
		events: ['processed', 'open', 'spam'],
		headers: 'X-Test-Header',
		usernames: 'MyUser1',
		sms_events: [],
		output_format: 'form',
	},
};

export const webhookRemoveOk = {
	request_id: REQUEST_ID,
	data: {
		url: 'https://example.com/webhook',
		id: 4317,
		events: ['spam'],
		sms_events: [],
		headers: [],
		usernames: [],
		output_format: 'json',
	},
};

// Error envelopes, verbatim from the live probes and the spec's examples.

export const missingKeyError = {
	request_id: '1df683c7-fc83-4358-ba48-59ac799c1277',
	data: {
		error:
			"The 'api_key' parameter was not found in the request payload or in the 'X-Smtp2go-Api-Key' header or it wasn't in the correct format 'api-[A-Za-z0-9]{32}'; this is required for an API call to function.",
		error_code: 'E_ApiResponseCodes.INVALID_IN_PAYLOAD',
	},
};

export const unknownKeyError = {
	request_id: '69b7b8fd-309d-44af-9fc5-6b3b72fe6439',
	data: {
		error:
			"An API User matching the passed 'api_key' was not found, Please check the key is correct and try again.",
		error_code: 'E_ApiResponseCodes.API_EXCEPTION',
	},
};

export const fieldValidationError = {
	request_id: REQUEST_ID,
	data: {
		error:
			'An error occurred processing the json data you sent with the request.',
		error_code: 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD',
		field_validation_errors: {
			fieldname: 'to',
			message:
				"The field 'to' was expecting a value but was empty or missing from the request.",
		},
	},
};

export const modelValidationError = {
	request_id: 'da9627ab-3555-405a-841b-6b58641d29b5',
	data: {
		error:
			'An error occurred processing the json data you sent with the request.',
		error_code: 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD',
		model_validation_errors:
			"Model Validation failed: Either 'text_body', 'html_body' or 'template_id' must be passed",
	},
};

export const permissionDeniedError = {
	request_id: '22e5acba-43bf-11e6-ae42-408d5cce2644',
	data: {
		error_code: 'E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED',
		error: 'You do not have permission to access this API endpoint',
	},
};

// The bare `{ error, error_code }` shape without the data wrapper, shown in
// some docs pages.
export const bareError = {
	error: 'Bare failure',
	error_code: 'E_ApiResponseCodes.API_EXCEPTION',
};
