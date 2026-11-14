/**
 * Response bodies for the tests, transcribed from the examples in the API
 * reference at https://www.retently.com/docs/api/. Where a route's sample is
 * abbreviated in the docs, the fixture keeps the documented fields and marks
 * the omission.
 */

export const PING = {
	code: 200,
	message: 'Success.',
	data: {
		account: {
			id: '5f00000000000000000abcde',
			name: 'Acme Inc',
			createdAt: '2024-06-01T09:00:00Z',
			timezone: 'America/New_York',
		},
		plan: {
			code: 'cp_starter_monthly_demo',
			billingCycle: 'monthly',
			renewsAt: '2026-05-01T09:00:00Z',
			credits: {
				surveys: {
					period: 'monthly',
					periodStart: '2026-04-01T09:00:00Z',
					periodEnd: '2026-05-01T09:00:00Z',
					included: 5000,
					purchased: 1000,
					limit: 6000,
					used: 1234,
					remaining: 4766,
					dailyLimit: 500,
				},
			},
		},
		usage: {
			contacts: 12500,
			feedback: 842,
			outbox: 7610,
			queue: 45,
			suppressions: 12,
		},
		cache: { updatedAt: '2026-04-17T10:00:00Z' },
	},
};

export const CUSTOMER = {
	id: '6827fb27bf618a02f1234567',
	email: 'jimsmith@acme.com',
	firstName: 'Jim',
	lastName: 'Smith',
	companyName: 'Acme',
	companyId: '65a58a858ee7f75a51234567',
	jobTitle: 'Customer Experience Manager',
	phoneNumber: '61060000000',
	location: {
		countryCode: 'US',
		region: 'New York',
		country: 'United States',
		city: '',
		state: null,
		zipCode: '',
		timezone: 'America/New_York',
	},
	tags: ['foo', 'bar'],
	integrationsLists: [
		{ name: 'Contacts', source: 'Salesforce' },
		{ name: 'Users', source: 'Intercom' },
	],
	createdDate: '2025-05-17T02:57:43.910Z',
	updatedDate: '2025-05-17T02:57:43.910Z',
	properties: [
		{
			label: 'Business model',
			name: 'business_model',
			type: 'text',
			value: 'b2b',
		},
		{
			label: 'Total Account ARR',
			name: 'total_account_arr',
			type: 'number',
			value: 4860,
		},
		{ label: 'Sign up', name: 'sign_up', type: 'date', value: '11/20/25' },
	],
	isInQueue: true,
	isInQueueSetAt: '2025-12-20T20:45:31.019Z',
	lastSurveySent: {
		openedDate: '2025-07-16T20:45:31.019Z',
		surveyId: '6877e322c9a0c6059d112345',
		metric: 'NPS',
		receivedDate: '2025-07-16T17:36:34.647Z',
		status: 'RESPONDED',
		campaignId: '5f175ef8ba2fca1a50c12345',
		resent: true,
		sentBy: 'campaign_worker',
		channel: 'email',
		isNegative: false,
		isNeutral: false,
		isPositive: true,
		respondedDate: '2025-07-16T20:45:31.019Z',
	},
	isEmailDeliverable: true,
	surveySubscriptionStatus: {
		isOptedOut: true,
		optOutDate: '2025-07-28T20:26:14.379Z',
		optOutMessage: 'Unsubscribed by owner.',
		optOutBy: 'owner',
		isSuppressed: false,
		suppressedDate: null,
		suppressedReason: null,
	},
	syncId: 'salesforce257-85743',
	isAtRisk: false,
	source: 'Salesforce',
	isAnonymous: false,
};

export const CUSTOMERS = {
	message: 'Success.',
	code: 200,
	data: {
		subscribers: [CUSTOMER],
		page: 1,
		pages: 1,
		limit: 20,
		sort: '-createdDate',
		total: 1,
	},
};

// A live GET /customers/{id} (11-12) puts the customer straight in `data`; the
// docs sample shows a `subscribers` array instead. Values here are made up.
export const CUSTOMER_GET = {
	message: 'Success.',
	code: 200,
	data: {
		id: '5a9d595701c85b38114b5a1',
		email: 'john@example.com',
		firstName: 'John',
		lastName: 'Smith',
		companyName: 'ACME',
		companyId: null,
		jobTitle: null,
		phoneNumber: null,
		location: {
			countryCode: null,
			region: null,
			country: null,
			city: null,
			state: null,
			zipCode: null,
			timezone: null,
		},
		tags: ['foo'],
		integrationsLists: [],
		createdDate: '2026-11-12T10:00:00.000Z',
		updatedDate: '2026-11-12T10:00:00.000Z',
		properties: [
			{
				label: 'Subscription name',
				name: 'subscription_name',
				type: 'string',
				value: 'Professional plan',
			},
		],
		isInQueue: false,
		isInQueueSetAt: null,
		lastSurveySent: {
			openedDate: null,
			surveyId: null,
			metric: null,
			receivedDate: null,
			status: null,
			campaignId: null,
			resent: false,
			sentBy: null,
			channel: 'email',
			isNegative: false,
			isNeutral: false,
			isPositive: false,
			respondedDate: null,
		},
		isEmailDeliverable: true,
		surveySubscriptionStatus: {
			isOptedOut: false,
			optOutDate: null,
			optOutMessage: null,
			optOutBy: null,
			isSuppressed: false,
			suppressedDate: null,
			suppressedReason: null,
		},
		syncId: null,
		isAtRisk: false,
		source: 'API',
		isAnonymous: false,
	},
};

// A live POST /customers (11-12) keys `data` by email, one result per
// customer, rather than the `subscribers` array the docs sample shows.
export const CUSTOMERS_UPSERTED = {
	message: 'Request successfully sent.',
	code: 200,
	data: {
		'johnsmith@example.com': {
			id: '6a1f00000000000000000001',
			email: 'johnsmith@example.com',
			first_name: 'John',
			last_name: '',
			to: '',
			company: 'ACME',
			properties: [
				{
					name: 'subscription',
					label: 'Subscription',
					dataType: 'string',
					source: 'API',
					value: 'Free trial',
					valueNumber: null,
					valueDate: null,
					valueBoolean: null,
					valueArray: [],
				},
			],
			tags: ['foo'],
			status: 'created',
			reason: '',
		},
	},
};

// A live GET /customers/{id} or /feedback/{id} for an id that does not exist
// answers HTTP 200 with the 404 only in the envelope.
export const CUSTOMER_NOT_FOUND_IN_200 = {
	message: 'Customers not found.',
	code: 404,
	data: null,
};

export const CUSTOMERS_UNSUBSCRIBED = {
	message: 'Customers was successfully unsubscribed.',
	code: 200,
	data: [{ email: 'john.smith@example.com', unsubscribed: true }],
};

export const CUSTOMERS_RESUBSCRIBED = {
	success: true,
	code: 200,
	message:
		"Partial: 1 resubscribed, 1 already subscribed, 2 skipped, 1 not found. Check 'data' array for details.",
	data: [
		{ email: 'john.smith@example.com', status: 'resubscribed' },
		{ email: 'jane.doe@example.com', status: 'already_subscribed' },
		{
			email: 'self@example.com',
			status: 'skipped',
			reason: 'self-unsubscribed',
		},
		{ email: 'bounced@example.com', status: 'skipped', reason: 'bounced' },
		{ email: 'missing@example.com', status: 'not_found' },
		{
			email: 'ok-but-suppressed@example.com',
			status: 'resubscribed',
			suppressed: true,
		},
	],
};

export const CUSTOMERS_DELETED = {
	message: 'Customers were successfully deleted.',
	code: 200,
	data: [{ email: 'john.smith@example.com', deleted: true }],
};

export const COMPANY = {
	id: '60444db01eeeb6bf89799999',
	createdDate: '2021-05-25T01:06:56.070Z',
	domain: 'acme.com',
	companyName: 'ACME',
	industryName: 'E-commerce',
	tags: ['SMB', 'example'],
	cxMetrics: { NPS: 71, CSAT: 53, CES: 22, STAR: null },
	contactsCount: 195,
};

export const COMPANIES = {
	code: 200,
	message: 'Success.',
	data: {
		total: 3792,
		page: 1,
		limit: 20,
		sort: '-createdDate',
		companies: [COMPANY],
	},
};

export const COMPANY_GET = {
	code: 200,
	message: 'Success.',
	data: COMPANY,
};

export const FEEDBACK = {
	id: '5f1faaa4b4e2e4963e41893b',
	surveyId: '6877e322c9a0c6059d112345',
	customerId: '5ebc15b0cb0d12fd815c5cda',
	email: 'john@example.com',
	firstName: 'John',
	lastName: 'Smith',
	companyName: 'ACME',
	companyId: '60444db01eeeb6bf89799999',
	jobTitle: 'Marketing',
	country: 'USA',
	state: 'California',
	city: 'San Francisco',
	tags: ['foo', 'baz'],
	customProps: [
		{ name: 'subscription', type: 'string', value: 'Professional' },
		{ name: 'signed_up', type: 'date', value: '2020-05-22T00:00:00.000Z' },
	],
	campaignName: 'CSAT regular email campaign',
	campaignId: '60d983411991aad3dc2da064',
	createdDate: '2018-03-27T09:45:41.697Z',
	score: 5,
	comment: 'I love everything about your product.',
	checkbox: true,
	additionalQuestions: [
		{
			type: 'RATING',
			questionText:
				'How likely are you to recommend our company to a friend or colleague?',
			metricsType: 'NPS',
			answer: 10,
		},
		{
			type: 'MULTIPLE_OPTIONS',
			questionText: 'What is the main reason for your score?',
			answer: 'Support',
		},
	],
	feedbackTags: ['product', 'customer support'],
	feedbackTopics: [
		{ name: 'Usability', sentiment: 'positive' },
		{ name: 'Onboarding', sentiment: 'neutral' },
		{ name: 'Pricing', sentiment: 'positive' },
	],
	feedbackTagsNew: ['Product 1', 'Order status', 'Case number'],
	notes: [
		{
			author: 'Ann Doe',
			content: 'I have followed up with John and we have scheduled a demo call',
			metricsType: 'NPS',
			date: '2020-06-28T04:35:15.482Z',
		},
	],
	status: '',
	assigned: 'Ann Doe',
	ratingCategory: 'Positive',
	resolved: true,
	channel: 'email',
	metricsType: 'CSAT',
	isBogus: false,
	isSubmitted: true,
};

export const FEEDBACKS = {
	message: 'Success.',
	code: 200,
	data: {
		responses: [FEEDBACK],
		page: 1,
		pages: 101,
		limit: 10,
		total: 1007,
	},
};

export const FEEDBACK_GET = {
	message: 'Success.',
	code: 200,
	data: {
		responses: [FEEDBACK],
		page: 1,
		pages: 1,
		limit: 1,
		total: 1,
	},
};

export const FEEDBACK_IMPORTED = {
	success: true,
	code: 200,
	message:
		'3 imported, 1 skipped, 1 failed. Docs: https://www.retently.com/docs/api/#api-import-feedback',
	data: {
		imported: 3,
		skipped: 1,
		failed: 1,
		customersCreated: 2,
		customersUpdated: 1,
		warnings: [
			{
				email: 'john.smith@example.com',
				reason:
					"MULTIPLE_OPTIONS answer for question 'b1c2d3e4-0003' was resolved by option text (provide option uuids to avoid ambiguity)",
			},
		],
		details: {
			skipped: [
				{
					email: 'jane.doe@example.com',
					reason: 'Duplicate feedback within 30 days',
				},
			],
			failed: [
				{
					email: 'invalid-email',
					reason: 'Invalid score for nps',
					field: 'score',
				},
			],
		},
	},
};

export const CAMPAIGNS = {
	code: 200,
	message: 'Success.',
	campaigns: [
		{
			id: '62729a9d76fa98be',
			name: 'NPS transactional email campaign',
			isActive: true,
			templateId: '627276f4997e',
			metric: 'NPS',
			type: 'transactional',
			channel: 'email',
		},
	],
};

export const REPORT = {
	campaignId: '5f1ec45y27b8313876299999',
	trend: [
		{
			day: '2022-12-01',
			promoters: 292,
			passives: 194,
			detractors: 25,
			total: 511,
			ratingDistribution: { '1': 4, '5': 2, '8': 7, '10': 15 },
			score: 52,
		},
	],
	last: {
		promoters: 292,
		passives: 194,
		detractors: 24,
		total: 512,
		score: 52,
		ratingDistribution: { '1': 4, '5': 2, '8': 7, '10': 15 },
	},
	deliveryStats: {
		totalCount: 2500,
		opened: 800,
		responded: 512,
		optedOut: 0,
		isBounced: 0,
	},
	questionsStats: [
		{
			uuid: 'djxpv6to-p1n2-z9zl-1q71',
			title: 'Additional CSAT rating question',
			isStarred: true,
			position: 1,
			isOnMain: true,
			metricsType: 'CSAT',
			stats: {
				last: {
					day: '2022-12-02',
					promoters: 0,
					passives: 0,
					detractors: 1,
					responded: 1,
					opened: 1,
					skipped: 0,
					total: 1,
					scoreSum: 1,
					score: 1,
				},
				first: {
					day: '2022-12-01',
					promoters: 0,
					passives: 0,
					detractors: 1,
					responded: 1,
					opened: 1,
					skipped: 0,
					total: 1,
					scoreSum: 1,
					score: 1,
				},
			},
		},
	],
	name: 'Recurring NPS email campaign',
	isActive: true,
	metric: 'NPS',
	type: 'regular',
};

export const REPORTS = {
	code: 200,
	message: 'Success.',
	data: [REPORT],
};

export const SURVEY = {
	surveyId: '6877e322c9a0c6059d112345',
	email: 'john@example.com',
	customerId: '5ebc15b0cb0d12fd811e4hgw',
	firstName: 'John',
	lastName: 'Smith',
	companyName: 'ACME',
	companyId: '60444db01eeeb6bf89799999',
	// A JSON-encoded array, sent as a string rather than a real array.
	personTags: '[]',
	sentDate: '2019-09-13T11:51:31.295Z',
	channel: 'email',
	campaign: 'Regular email NPS campaign',
	campaignId: '60d983411991aad3dc4rv145',
	surveyTemplateId: '60588921dabc1c6b6dg12419',
	subject: 'How likely are you to recommend ACME to your friends?',
	sentBy: 'manual',
	status: 'RESPONDED',
	detailedStatus: {
		isOpened: true,
		openedDate: '2019-09-13T11:51:48.805Z',
		isResponded: true,
		respondedDate: '2019-09-13T11:51:48.805Z',
		hasFeedback: true,
		isOptedOut: false,
		isBounced: false,
	},
	responseId: '6877e322c9a0c6059d112345',
};

export const OUTBOX = {
	message: 'Success.',
	code: 200,
	data: {
		surveys: [
			SURVEY,
			{
				...SURVEY,
				surveyId: undefined,
				sentBy: 'autoreply',
				status: 'OPENED',
				detailedStatus: {
					...SURVEY.detailedStatus,
					isResponded: false,
					respondedDate: '',
					hasFeedback: false,
				},
				additionalRecipients: [
					{
						email: 'ann@example.com',
						type: 'cc',
						mandrillMessageId: '3ec992d239754081bca1f9ad1572hf93',
					},
					{
						email: 'dan@example.com',
						type: 'bcc',
						mandrillMessageId: '3ec992d239754081bca1f9ad1572h332',
					},
				],
				mandrillMessageId: '3ec992d239754081bca1f9ad1572hf71',
			},
		],
		page: 1,
		pages: 1,
		limit: 2,
		sort: '-surveyCreatedDate',
		total: 2,
	},
};

export const TEMPLATES = {
	code: 200,
	message: 'Success.',
	templates: [
		{
			id: '628765bf8743956',
			name: 'Default NPS in-app template',
			channel: 'inapp',
			metric: 'STAR',
		},
	],
};

export const TEMPLATE = {
	code: 200,
	message: 'Success.',
	data: {
		id: '628765bf87439560a1b2c3d4',
		name: 'Default NPS email template',
		channel: 'email',
		metric: 'NPS',
		surveyQuestions: [
			{
				uuid: 'b1c2d3e4-0001',
				type: 'OPEN_ENDED',
				title: 'What is the main reason for your score?',
				isMain: true,
			},
			{
				uuid: 'b1c2d3e4-0002',
				type: 'RATING',
				title: 'How satisfied are you with our support?',
				isMain: false,
			},
			{
				uuid: 'b1c2d3e4-0003',
				type: 'MULTIPLE_OPTIONS',
				title: 'Which features do you use most?',
				isMain: false,
				options: [
					{ uuid: 'opt-1', text: 'Reporting' },
					{ uuid: 'opt-2', text: 'Integrations' },
					{ uuid: 'opt-3', text: 'Automation' },
				],
			},
		],
	},
};

export const SURVEY_QUEUED = {
	success: true,
	code: 200,
	message: 'Success.',
	status: 'queued',
};

export const BAD_KEY = { message: 'Account not found', code: 401, data: null };

export const INVALID_KEY = {
	message: 'Invalid API key.',
	code: 401,
	data: null,
};

export const READ_ONLY_KEY = {
	success: false,
	status: 'error',
	code: 403,
	message: 'This API key does not have write permission.',
};

export const NOT_TRANSACTIONAL = {
	success: false,
	status: 'error',
	code: 400,
	message: 'Campaign 5a9d595701c85b37224ab2d0 is not transactional',
};

export const CAMPAIGN_NOT_FOUND = {
	success: false,
	status: 'error',
	code: 404,
	message: 'Campaign 5a9d595701c85b37224ab2d0 could not be found.',
};

export const TEMPLATE_NOT_FOUND = {
	code: 404,
	message: 'Template not found.',
};

export const RATE_LIMITED = {
	success: false,
	status: 'error',
	code: 429,
	message: 'Too many requests.',
};

export const SYNC_TOO_BROAD = {
	success: false,
	code: 413,
	message:
		'1342 customers matched, which exceeds the per-call ceiling of 1000. Narrow the filter or page over `customers` ID batches.',
	data: { matched: { customers: 1342 } },
};

export const SERVER_ERROR = { message: 'Internal server error', code: 500 };
