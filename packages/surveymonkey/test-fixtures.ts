/**
 * Fixtures for the SurveyMonkey shapes.
 *
 * Every body here comes from the vendor's own documentation repo,
 * https://github.com/SurveyMonkey/public_api_docs. Two details there matter for
 * the tests: every id is a **string** even when it looks numeric, and every list
 * is wrapped in `{ data, page, per_page, total, links }`.
 */

export const survey = {
	title: 'My Survey',
	nickname: '',
	category: '',
	language: 'en',
	question_count: 1,
	page_count: 1,
	date_created: '2015-10-06T12:56:55',
	date_modified: '2015-10-06T12:56:55',
	id: '1234',
	href: 'https://api.surveymonkey.com/v3/surveys/1234',
	buttons_text: {
		done_button: 'Done',
		prev_button: 'Prev',
		exit_button: 'Exit',
		next_button: 'Next',
	},
	custom_variables: { name: 'label' },
	footer: true,
	folder_id: '1234',
	preview: 'https://www.surveymonkey.com/r/Preview/',
	edit_url: 'https://www.surveymonkey.com/create/',
	collect_url: 'https://www.surveymonkey.com/collect/list',
	analyze_url: 'https://www.surveymonkey.com/analyze/',
	summary_url: 'https://www.surveymonkey.com/summary/',
};

export const surveyList = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [survey],
	links: { self: 'https://api.surveymonkey.com/v3/surveys?page=1&per_page=50' },
};

export const page = {
	id: '5678',
	title: 'Page 1',
	description: 'The only page',
	position: 1,
	question_count: 1,
	href: 'https://api.surveymonkey.com/v3/surveys/1234/pages/5678',
};

export const pageList = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [page],
};

export const question = {
	id: '9012',
	headings: [{ heading: 'A question about primates.' }],
	family: 'single_choice',
	subtype: 'vertical',
	position: 1,
	required: {
		text: 'This question is required!',
		type: 'at_least',
		amount: '1',
	},
	visible: true,
	href: 'https://api.surveymonkey.com/v3/surveys/1234/pages/5678/questions/9012',
	answers: {
		choices: [
			{ id: '111', position: 1, visible: true, text: 'Ape' },
			{ id: '222', position: 2, visible: true, text: 'Monkey' },
		],
	},
};

export const questionList = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [question],
};

export const collector = {
	status: 'open',
	id: '1234',
	type: 'weblink',
	name: 'My Collector',
	thank_you_message: 'Thank you for taking my survey.',
	disqualification_message: 'Thank you for taking my survey.',
	disqualification_url: 'https://www.surveymonkey.com',
	close_date: '2038-01-01T00:00:00+00:00',
	closed_page_message: 'This survey is currently closed.',
	redirect_url: 'https://www.surveymonkey.com',
	display_survey_results: false,
	edit_response_type: 'until_complete',
	anonymous_type: 'not_anonymous',
	allow_multiple_responses: false,
	date_modified: '2015-10-06T12:56:55+00:00',
	url: 'https://www.surveymonkey.com/r/2Q3RXZB',
	open: true,
	date_created: '2015-10-06T12:56:55+00:00',
	password_enabled: false,
	sender_email: null,
	response_limit: null,
	redirect_type: 'url',
	href: 'https://api.surveymonkey.com/v3/collectors/1234',
};

export const collectorList = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [collector],
};

export const message = {
	id: '2345',
	status: 'not_sent',
	type: 'invite',
	subject: 'Please take my survey',
	body: 'It only takes a minute.',
	is_branding_enabled: true,
	date_created: '2015-10-06T12:56:55+00:00',
	date_modified: '2015-10-06T12:56:55+00:00',
	href: 'https://api.surveymonkey.com/v3/collectors/1234/messages/2345',
};

export const recipient = {
	id: '3456',
	email: 'bob@example.com',
	first_name: 'Bob',
	last_name: 'Tester',
	href: 'https://api.surveymonkey.com/v3/collectors/1234/messages/2345/recipients/3456',
	survey_response_status: 'not_responded',
	mail_status: 'sent',
};

export const responseSummary = {
	href: 'https://api.surveymonkey.com/v3/surveys/1234/responses/5001',
	id: '5001',
};

export const response = {
	id: '5001',
	href: 'https://api.surveymonkey.com/v3/surveys/1234/responses/5001',
	survey_id: '1234',
	collector_id: '1234',
	recipient_id: '3456',
	total_time: 42,
	custom_value: 'order-99',
	edit_url: 'https://www.surveymonkey.com/r/2Q3RXZB',
	analyze_url: 'https://www.surveymonkey.com/analyze/',
	ip_address: '127.0.0.1',
	language: 'en',
	custom_variables: { name: 'label' },
	collection_mode: 'default',
	response_status: 'completed',
	date_created: '2015-10-06T12:56:55+00:00',
	date_modified: '2015-10-06T12:56:55+00:00',
	pages: [
		{
			id: '5678',
			questions: [
				{
					id: '9012',
					answers: [{ choice_id: '111' }],
				},
			],
		},
	],
};

export const responseList = {
	per_page: 50,
	total: 1,
	data: [responseSummary],
	page: 1,
	links: {
		self: 'https://api.surveymonkey.com/v3/surveys/1234/responses?page=1&per_page=50',
	},
};

export const bulkResponseList = {
	per_page: 100,
	total: 1,
	data: [response],
	page: 1,
};

export const contactList = {
	name: 'My Contact List',
	id: '1234',
	href: 'https://api.surveymonkey.com/v3/contact_lists/1234',
};

export const contactListWrapper = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [contactList],
};

export const contact = {
	id: '1234',
	first_name: 'John',
	last_name: 'Doe',
	email: 'test@surveymonkey.com',
	status: 'active',
	href: 'https://api.surveymonkey.com/v3/contacts/1234',
	custom_fields: { '1': 'value' },
};

export const contactWrapper = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [contact],
};

export const contactField = {
	id: '1',
	label: 'Customer id',
	type: 'string',
	href: 'https://api.surveymonkey.com/v3/contact_fields/1',
};

export const webhook = {
	id: '1234',
	name: 'My Webhook',
	event_type: 'response_completed',
	object_type: 'survey',
	object_ids: ['1234', '5678'],
	subscription_url: 'https://surveymonkey.com/webhook_reciever',
	href: 'https://api.surveymonkey.com/v3/webhooks/1234',
};

export const webhookWrapper = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [webhook],
};

export const user = {
	id: '1234',
	username: 'agent',
	first_name: 'Sarah',
	last_name: 'Caring',
	email: 'sarah@example.com',
	account_type: 'premier',
	language: 'en',
	href: 'https://api.surveymonkey.com/v3/users/1234',
};

export const folder = {
	id: '1234',
	title: 'My Folder',
	href: 'https://api.surveymonkey.com/v3/survey_folders/1234',
};

export const folderWrapper = {
	page: 1,
	per_page: 50,
	total: 1,
	data: [folder],
};
