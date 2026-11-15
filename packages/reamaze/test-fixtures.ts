/**
 * Fixtures for the Re:amaze shapes.
 *
 * The list wrappers, the bare arrays and the report key names were checked
 * against `acme.reamaze.io`: notes, incidents and systems answer a
 * bare array, `reports/volume` keys a map by date, `reports/tags` keys a map by
 * tag name, and `channels` sends only `total_count`.
 *
 * Bodies are the documented shapes otherwise, which is enough because the
 * output schemas are `.loose()`.
 */

export const conversation = {
	subject: 'Knock, knock?',
	slug: 'knock-knock',
	status: 0,
	created_at: '2026-11-01T00:00:01.001-07:00',
	tag_list: ['joke'],
	message: { body: "Who's there?" },
	last_customer_message: {
		body: 'Insert joke here',
		created_at: '2026-11-01T01:00:01.001-07:00',
	},
	author: { name: 'bob', email: 'bob@example.com' },
	assignee: null,
	category: {
		name: 'Support',
		slug: 'support',
		email: 'support@example.com',
		channel: 1,
	},
	followers: [{ name: 'bob', email: 'bob@example.com' }],
};

export const conversationsResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	conversations: [conversation],
};

export const conversationResponse = {
	...conversation,
	last_staff_message: {
		body: "Who's there?",
		created_at: '2026-11-01T01:00:01.001-07:00',
	},
	data: { custom_attribute: 'custom data' },
};

export const createdConversationResponse = {
	...conversation,
	slug: 'printer-offline',
	subject: 'Printer offline',
};

export const updatedConversationResponse = {
	...conversation,
	status: 2,
	tag_list: ['joke', 'resolved'],
};

export const message = {
	body: "I'm sorry, Dave. I'm afraid I can't do that.",
	visibility: 0,
	origin: 1,
	origin_id: '1234567890',
	created_at: '2026-11-01T21:58:53.286-07:00',
	user: { name: 'HAL', email: 'hal@example.com' },
	recipients: [{ name: 'Dave', email: 'dave@example.com' }],
	attachments: [
		{
			file_file_name: 'secret.png',
			file_content_type: 'image/png',
			file_file_size: 69892,
			thumb_url: 'https://example.com/secret_thumbnail.png',
			url: 'https://example.com/thumbnail.png',
			image: true,
		},
	],
	conversation: {
		subject: 'Do you read me?',
		slug: 'do-you-read-me',
		created_at: '2026-11-01T21:58:53.204-07:00',
		category: {
			name: 'Suggestions',
			slug: 'suggestions',
			email: 'suggestions@example.com',
			channel: 1,
		},
	},
};

export const messagesResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	messages: [message],
};

export const createdMessageResponse = {
	...message,
	body: 'This is the body of the new message you just posted!',
	visibility: 0,
};

export const contact = {
	name: 'John Doe',
	email: 'bob@example.com',
	friendly_name: 'Johnny',
	notes: [{ id: 1, note: 'this is a note' }],
};

export const contactsResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	contacts: [contact],
};

export const createdContactResponse = {
	contact: {
		id: '123',
		name: 'bob',
		email: 'bob@example.com',
		external_avatar_url: 'https://www.example.com/avatar.png',
		notes: [{ content: 'Some note' }, { content: 'Some other note' }],
		data: { custom_attribute: 'custom data' },
	},
};

export const updatedContactResponse = {
	contact: {
		id: '123',
		name: 'bob',
		friendly_name: 'Bobby',
		email: 'bob@example.com',
		data: { custom_attribute: 'custom data' },
	},
};

export const identitiesResponse = {
	identities: [
		{ type: 'email', identifier: 'johndoe@example.com' },
		{ type: 'mobile', identifier: '+15550100001' },
	],
};

/** Verified live: a bare array, not `{ notes: [...] }`. */
export const notesResponse = [
	{
		id: 123,
		note: 'this is a note',
		created_at: '2026-11-01T15:55:35.121-06:00',
		updated_at: '2026-11-01T15:55:35.121-06:00',
		creator: { name: 'Bob Jones', email: 'bob@mail.com' },
	},
	{
		id: 456,
		note: 'another note',
		created_at: '2026-11-01T15:55:35.121-06:00',
		updated_at: '2026-11-01T15:55:35.121-06:00',
		creator: { name: 'Sally Smith', email: 'sally@mail.com' },
	},
];

/** Verified live: an instance with no notes answers `[]`. */
export const emptyNotesResponse: (typeof notesResponse)[number][] = [];

export const channel = {
	name: 'Support',
	slug: 'support',
	email: 'support@example.reamaze.com',
	created_at: '2026-11-01T04:39:23.000Z',
	updated_at: '2026-11-01T04:39:23.000Z',
	channel: 1,
	visibility: 0,
	spam_filter_enabled: false,
	reply_from_origin: false,
	verified: true,
	verification_email: 'hello@example.com',
	last_verified: '2026-11-01T04:39:23.000Z',
	settings_reply_from_name: 'channel',
	settings_signature: '- Example Signature',
	brand: { name: 'Example', url: 'example' },
};

/** Verified live: only `total_count`, with no `page_size` or `page_count`. */
export const channelsResponse = {
	total_count: 1,
	channels: [channel],
};

export const channelResponse = channel;

export const article = {
	title: 'Advantage of the Union in Respect to Economy in Government',
	body: '...',
	slug: 'advantage-of-the-union',
	status: 0,
	created_at: '2026-11-01T10:17:28.000-07:00',
	updated_at: '2026-11-01T10:17:28.000-07:00',
	url: 'https://example.reamaze.io/hc/en-us/articles/advantage-of-the-union',
	author: {
		name: 'Alexander Hamilton',
		email: 'alexander.hamilton@reamaze.com',
	},
	topic: {
		name: 'The Federalist Papers',
		slug: 'the-federalist-papers',
	},
};

export const articlesResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	articles: [article],
};

export const articleResponse = article;

/** Verified live: a map of date to conversation count. */
export const volumeResponse = {
	conversation_counts: { '2026-11-08': 3, '2026-11-09': 5 },
	start_date: '2026-10-11',
	end_date: '2026-11-09',
};

/** Verified live: `response_times` plus `summary`, not `report`. */
export const responseTimeResponse = {
	response_times: { '2026-11-08': 600, '2026-11-09': 1200 },
	summary: {
		averages: { in_range: 593, this_month: 468, this_week: 652 },
		trends: {
			last_30_days: { average: 273, change_rate: -0.2759 },
			last_7_days: { average: 467, change_rate: 0.081 },
		},
		ratio: { under_1_hour: 0.4083, under_1_day: 0.775, under_1_week: 0.89 },
	},
	start_date: '2026-10-11',
	end_date: '2026-11-09',
};

/** Verified live: `report`, keyed by staff display name. */
export const staffReportResponse = {
	report: {
		'John Doe': {
			response_count: 449,
			response_time_seconds: 1200.0,
			appreciations_count: 38,
			responses_trend: { '2026-11-08': 9, '2026-11-09': 28 },
		},
	},
	start_date: '2026-10-11',
	end_date: '2026-11-09',
};

/** Verified live: `tags` is a map of tag name to count, not an array. */
export const tagsReportResponse = {
	tags: { 'Reamaze Tutorial': 5, Billing: 2 },
	start_date: '2026-10-11',
	end_date: '2026-11-09',
};

/** Verified live: `channels`, not `report`. */
export const channelSummaryResponse = {
	channels: {
		'12345': {
			channel: {
				id: 12345,
				name: 'Support (US)',
				channel_type: 1,
				channel_type_name: 'Email',
			},
			brand: { id: '123', name: 'Reamaze US', url: 'reamaze-us' },
			staff_responses: 15,
			customer_responses: 10,
			average_response_time_seconds: 90,
			appreciations: 5,
			active_conversations: 10,
			resolved_conversations: 5,
			archived_conversations: 1,
			average_satisfaction_rating: 4.9,
			average_thread_size: 2.6,
		},
	},
	start_date: '2026-10-11',
	end_date: '2026-11-09',
};

export const responseTemplate = {
	id: 123,
	name: 'Returns Instructions',
	body: '...',
	response_template_group: { id: 12, name: 'Returns' },
};

export const responseTemplatesResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	response_templates: [responseTemplate],
};

export const responseTemplateResponse = responseTemplate;

export const staff = {
	name: 'Jean Super Agent',
	email: 'jean@example.com',
	created_at: '2026-11-01T12:13:14.123Z',
	role: { admin: true },
};

export const staffResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	staff: [staff],
};

export const createdStaffResponse = {
	...staff,
	email: 'new.agent@example.com',
};

export const satisfactionRating = {
	id: '456',
	rating: 5,
	comment: 'Excellent service!',
	user_id: '123',
	assignee_id: '789',
	conversation_id: '556',
	created_at: '2026-11-08T10:30:00.000Z',
	updated_at: '2026-11-08T10:30:00.000Z',
};

export const satisfactionRatingsResponse = {
	page_size: 30,
	page_count: 1,
	total_count: 1,
	satisfaction_ratings: [satisfactionRating],
};

export const incident = {
	id: 'inc-1',
	title: 'Shipments have run into some issues',
	created_at: '2026-11-01T21:57:36.732-07:00',
	updated_at: '2026-11-01T21:58:14.112-07:00',
	status: 'investigating',
	updates: [
		{
			id: 'upd-1',
			status: 'investigating',
			message: 'One of our outbound shipment providers has run into issues',
		},
	],
	incidents_systems: [
		{
			id: 'is-1',
			system_id: 'sys-1',
			status: 'partial_outage',
			system: { id: 'sys-1', title: 'Shipment Providers' },
		},
	],
};

/** Verified live: a bare array, empty on an instance with no incidents. */
export const incidentsResponse = [incident];

export const emptyIncidentsResponse: (typeof incident)[] = [];

export const incidentResponse = incident;

export const createdIncidentResponse = { ...incident, id: 'inc-2' };

export const system = {
	id: 'sys-1',
	title: 'Neat',
	account_id: 787258272,
	brand_id: 787258272,
	created_at: '2026-11-01T11:05:20.424-08:00',
	updated_at: '2026-11-01T11:05:20.424-08:00',
	status: 'partial_outage',
	active_incidents: [incident],
};

/** Verified live: a bare array, empty on an instance with no systems. */
export const systemsResponse = [system];

export const emptySystemsResponse: (typeof system)[] = [];

/** Verified live, 404 for an unknown resource. */
export const notFoundResourceBody = { errors: 'Not Found' };

/** Verified live, 404 for a route that does not exist. */
export const notFoundRouteBody = { status: 404, error: 'Not Found' };

/** Verified live, 422 with a map of field to messages. */
export const validationErrorBody = {
	errors: {
		'logins.email': ["can't be blank"],
		name: ["can't be blank"],
	},
};

/** Verified live, 403 from a user whose role lacks access_reports. */
export const forbiddenBody = {
	errors: 'You do not have permission to access this resource',
};
