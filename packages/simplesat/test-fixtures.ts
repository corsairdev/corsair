/**
 * Shapes taken from Simplesat's OpenAPI document at
 * https://developer.simplesat.io/api. Every list answers
 * `{ next, previous, count, <resource> }`, with full URLs for the page links.
 */

const NEXT = 'https://api.simplesat.io/api/v1/customers?page=2&page_size=50';

export const customer = {
	id: 1,
	external_id: '12345',
	email: 'tester@simplesat.io',
	name: 'Tester McTestFace',
	company: 'Simplesat',
	language: 'en',
	tags: ['asset'],
	custom_attributes: { City: 'San Francisco' },
};

export const customersPage = {
	next: NEXT,
	previous: null,
	count: 65,
	customers: [customer],
};

export const teamMember = {
	id: 1,
	external_id: '1',
	name: 'Tester McTestFace',
	email: 'tester@simplesat.io',
	custom_attributes: { Level: 'Senior' },
	groups: ['Support'],
};

export const survey = {
	id: 1,
	name: 'Follow-up CSAT Survey',
	metric: 'CSAT',
	survey_token: 'z_3OxYijnEkfZSt6hLKxCRxBlu4CPQ9feLUAW4Eaen4',
	survey_type: 'generic_embed',
	brand_name: 'Simplesat',
};

export const surveysPage = {
	next: null,
	previous: null,
	count: 1,
	surveys: [survey],
};

export const question = {
	id: 1,
	survey: { id: 1, name: 'CSAT Survey' },
	order: 1,
	metric: 'csat',
	type: 'multipleChoice',
	text: 'How did we do?',
	rating_scale: true,
	required: true,
	choices: ['2', '3', '4'],
};

export const questionsPage = {
	next: null,
	previous: null,
	count: 1,
	questions: [question],
};

export const answer = {
	id: 1,
	question: { id: 1, text: 'How did we do?', metric: 'csat' },
	choice: '3',
	choice_label: 'Okay, but not great',
	choices: ['Option1', 'Option2'],
	sentiment: 'neutral',
	comment: 'Very slow!',
	follow_up_answer: 'Thank you!',
	follow_up_answer_choice: 'yes',
	follow_up_answer_choices: ['Option1'],
	survey: { id: 1, name: 'CSAT Survey' },
};

export const answersPage = {
	next: 'https://api.simplesat.io/api/v1/answers/search?page=2&page_size=50',
	previous: null,
	count: 65,
	answers: [answer],
};

export const response = {
	id: 1,
	survey_id: 1,
	language: 'en',
	created: '2024-01-01T00:00:00Z',
	modified: '2024-01-02T00:00:00Z',
	ip_address: '203.0.113.10',
	tags: ['asset'],
	ticket: { external_id: '1', subject: 'Coffee machine broken!' },
	team_members: [
		{ email: 'tester@simplesat.io', role: 'Closed by', is_primary: true },
	],
	customer,
	answers: [answer],
};

export const responsesPage = {
	next: null,
	previous: null,
	count: 1,
	responses: [response],
};

/** A bulk write is queued, so it answers a request id rather than records. */
export const bulkQueued = {
	request_id: '11111111-1111-4111-8111-111111111111',
	detail: 'The customers will be created shortly.',
};

/** The live 403 body for a bad key. */
export const authProblem = { detail: 'Invalid Token.' };

/** A 404 body. */
export const notFoundProblem = {
	detail: 'No Customer matches the given query.',
};

/** A 400 that names fields, which is what the bulk and response routes answer. */
export const validationProblem = {
	customers: ['This field is required.'],
	answers: ['This field is required.'],
};
