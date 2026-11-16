import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { isSimplesatAuthError, segment } from './client';
import {
	Answers,
	Customers,
	Questions,
	Responses,
	Surveys,
	TeamMembers,
} from './endpoints';
import type { UnknownJson } from './json';
import {
	answer,
	answersPage,
	authProblem,
	bulkQueued,
	customer,
	customersPage,
	notFoundProblem,
	question,
	questionsPage,
	response,
	responsesPage,
	survey,
	surveysPage,
	teamMember,
	validationProblem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'simplesat-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: UnknownJson, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		search: parsed.search,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body
			? (JSON.parse(String(init.body)) as UnknownJson)
			: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.simplesat.io');
	expect(sent.headers.get('x-simplesat-token')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('customers', () => {
	it('lists with the documented filters and renames the array to results', async () => {
		respond(customersPage);

		const result = await invoke(Customers.list, {
			page_size: 50,
			subscribed: true,
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/customers');
		expect(lastRequest().query).toEqual({
			page_size: '50',
			subscribed: 'true',
		});
		expect(result).toMatchObject({
			count: 65,
			results: [customer],
		});
		// The full page URL becomes a path, so it can be replayed as `next`.
		expect((result as { next: string }).next).toBe(
			'/api/v1/customers?page=2&page_size=50',
		);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplesat.customers.list',
			{ count: 1, total: 65 },
			'completed',
		);
	});

	it('follows a next path without resending the filters', async () => {
		respond(customersPage);

		await invoke(Customers.list, {
			next: '/api/v1/customers?page=2&page_size=50',
			subscribed: false,
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/v1/customers');
		expect(sent.search).toBe('?page=2&page_size=50');
	});

	it('refuses a next link on another host, so the token never leaves the API', async () => {
		await expect(
			invoke(Customers.list, { next: 'https://evil.example/steal' }),
		).rejects.toThrow(/needs the `next` path Simplesat returned/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a page_size above the documented maximum of 250', async () => {
		await expect(invoke(Customers.list, { page_size: 251 })).rejects.toThrow(
			/page_size/,
		);
	});

	it('gets one customer', async () => {
		respond(customer);

		const result = await invoke(Customers.get, { customer_id: '1' });

		expect(lastRequest().path).toBe('/api/v1/customers/1');
		expect(result).toEqual(customer);
	});

	it('creates a customer', async () => {
		respond(customer, 201);

		await invoke(Customers.create, {
			external_id: '12345',
			email: 'tester@simplesat.io',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			external_id: '12345',
			email: 'tester@simplesat.io',
		});
	});

	it('rejects a create with neither external_id nor email, which Simplesat cannot match', async () => {
		await expect(invoke(Customers.create, { name: 'Tester' })).rejects.toThrow(
			/Send external_id or email/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates one customer by PUT', async () => {
		respond(customer);

		await invoke(Customers.update, { customer_id: '1', name: 'Renamed' });

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/v1/customers/1');
		expect(sent.body).toEqual({ name: 'Renamed' });
	});

	it('queues a bulk write and returns the request id', async () => {
		respond(bulkQueued);

		const result = await invoke(Customers.bulk, {
			customers: [{ external_id: '1' }, { external_id: '2' }],
		});

		expect(lastRequest().path).toBe('/api/v1/customers/bulk');
		expect(result).toMatchObject({ request_id: bulkQueued.request_id });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplesat.customers.bulk',
			{ submitted: 2, requestId: bulkQueued.request_id },
			'completed',
		);
	});

	it('rejects an empty bulk write', async () => {
		await expect(invoke(Customers.bulk, { customers: [] })).rejects.toThrow(
			/customers/,
		);
	});
});

describe('teamMembers', () => {
	it('gets and creates', async () => {
		respond(teamMember);
		expect(await invoke(TeamMembers.get, { team_member_id: '1' })).toEqual(
			teamMember,
		);
		expect(lastRequest().path).toBe('/api/v1/team-members/1');

		respond(teamMember, 201);
		await invoke(TeamMembers.create, {
			email: 'tester@simplesat.io',
			name: 'Tester McTestFace',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v1/team-members',
		});
	});
});

describe('surveys', () => {
	it('lists surveys', async () => {
		respond(surveysPage);

		const result = await invoke(Surveys.list, { name: 'CSAT' });

		expect(lastRequest().path).toBe('/api/v1/surveys');
		expect(lastRequest().query).toEqual({ name: 'CSAT' });
		expect(result).toMatchObject({ count: 1, results: [survey] });
	});

	it('emails a survey to one customer', async () => {
		respond({ detail: 'Survey is scheduled to be sent' });

		const result = await invoke(Surveys.email, {
			survey_token: survey.survey_token,
			customer: { email: 'tester@simplesat.io' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v1/surveys/${survey.survey_token}/email`);
		expect(sent.body).toEqual({ customer: { email: 'tester@simplesat.io' } });
		expect(result).toMatchObject({
			detail: 'Survey is scheduled to be sent',
		});
	});

	it('rejects an email send with no customer email', async () => {
		await expect(
			invoke(Surveys.email, {
				survey_token: 't',
				customer: {},
			}),
		).rejects.toThrow(/email/);
	});
});

describe('questions', () => {
	it('lists the questions for a survey', async () => {
		respond(questionsPage);

		const result = await invoke(Questions.list, {
			survey_id: 1,
			metric: 'csat',
		});

		expect(lastRequest().query).toEqual({ survey_id: '1', metric: 'csat' });
		expect(result).toMatchObject({ count: 1, results: [question] });
	});
});

describe('answers', () => {
	it('searches with a POST body', async () => {
		respond(answersPage);

		const result = await invoke(Answers.search, {
			start_date: '2024-01-01T00:00:00Z',
			filters: [{ key: 'sentiment', values: ['positive'], comparison: 'is' }],
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/answers/search');
		expect(sent.body).toEqual({
			start_date: '2024-01-01T00:00:00Z',
			filters: [{ key: 'sentiment', values: ['positive'], comparison: 'is' }],
		});
		expect(result).toMatchObject({ count: 65, results: [answer] });
	});

	it('follows a next path with a GET, not another POST', async () => {
		respond(answersPage);

		await invoke(Answers.search, {
			next: '/api/v1/answers/search?page=2&page_size=50',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/v1/answers/search');
		expect(sent.search).toBe('?page=2&page_size=50');
		expect(sent.body).toBeUndefined();
	});

	it('gets one answer', async () => {
		respond(answer);

		expect(await invoke(Answers.get, { answer_id: '1' })).toEqual(answer);
		expect(lastRequest().path).toBe('/api/v1/answers/1');
	});

	it('updates an answer', async () => {
		respond(answer);

		await invoke(Answers.update, { answer_id: '1', sentiment: 'positive' });

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/v1/answers/1');
		expect(sent.body).toEqual({ sentiment: 'positive' });
	});
});

describe('responses', () => {
	it('searches with the date filters', async () => {
		respond(responsesPage);

		await invoke(Responses.search, {
			created_start_date: '2024-01-01T00:00:00Z',
			filters: [
				{
					key: 'customer.email',
					values: ['tester@simplesat.io'],
					comparison: 'is',
				},
			],
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/responses/search');
		expect(sent.body).toEqual({
			created_start_date: '2024-01-01T00:00:00Z',
			filters: [
				{
					key: 'customer.email',
					values: ['tester@simplesat.io'],
					comparison: 'is',
				},
			],
		});
	});

	it('creates or updates a response', async () => {
		respond(response);

		const result = await invoke(Responses.create, {
			survey_id: 1,
			answers: [{ question_id: 1, choice: '3' }],
			customer: { email: 'tester@simplesat.io' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v1/responses/create-or-update');
		expect(sent.body).toEqual({
			survey_id: 1,
			answers: [{ question_id: 1, choice: '3' }],
			customer: { email: 'tester@simplesat.io' },
		});
		expect(result).toMatchObject({ id: 1 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simplesat.responses.create',
			{ responseId: 1, surveyId: 1, answers: 1 },
			'completed',
		);
	});

	it('rejects a response with no survey_id, which the API requires', async () => {
		await expect(
			invoke(Responses.create, { answers: [{ question_id: 1 }] }),
		).rejects.toThrow(/survey_id/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an answer with no question_id', async () => {
		await expect(
			invoke(Responses.create, { survey_id: 1, answers: [{ choice: '3' }] }),
		).rejects.toThrow(/question_id/);
	});

	it('gets one response', async () => {
		respond(response);

		expect(await invoke(Responses.get, { response_id: '1' })).toEqual(response);
		expect(lastRequest().path).toBe('/api/v1/responses/1');
	});

	it('updates one response', async () => {
		respond(response);

		await invoke(Responses.update, {
			response_id: '1',
			survey_id: 1,
			answers: [{ question_id: 1, sentiment: 'positive' }],
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/v1/responses/1/update');
		expect(sent.body).toEqual({
			survey_id: 1,
			answers: [{ question_id: 1, sentiment: 'positive' }],
		});
	});
});

describe('client error handling', () => {
	it('treats a 403 Invalid Token as an auth error, which is Simplesat’s shape', async () => {
		respond(authProblem, 403);
		const util = await import('node:util');

		const error = await invoke(Surveys.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(403);
		expect(failure.body).toMatchObject({ detail: 'Invalid Token.' });
		expect(isSimplesatAuthError(failure)).toBe(true);
		expect(failure.message).toContain('Invalid Token.');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('reads a 404 as not found rather than an auth problem', async () => {
		respond(notFoundProblem, 404);

		const error = await invoke(Customers.get, { customer_id: '9' }).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const failure = error as ApiError;
		expect(failure.status).toBe(404);
		expect(isSimplesatAuthError(failure)).toBe(false);
	});

	it('reads the field map from a 400', async () => {
		respond(validationProblem, 400);

		const error = await invoke(Customers.bulk, {
			customers: [{ external_id: '1' }],
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const failure = error as ApiError;
		expect(failure.body).toEqual(validationProblem);
		expect(failure.message).toContain('customers: This field is required.');
		// The request body (customer data) is not kept on the error.
		expect(failure.request.body).toBeUndefined();
	});

	it('masks a customer addressed by email in the error', async () => {
		respond(notFoundProblem, 404);

		const error = await invoke(Customers.get, {
			customer_id: 'jane@acme.com',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(JSON.stringify(error)).not.toContain('jane');
		expect((error as ApiError).request.url).toBe(
			'/api/v1/customers/[identifier]',
		);
	});

	it('encodes a path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('page links', () => {
	it('refuses a next link that is not a string', async () => {
		respond({ customers: [], next: 42, previous: null, count: 1 });

		await expect(invoke(Customers.list, {})).rejects.toThrow(/next link/);
	});

	it('refuses a next link on another host', async () => {
		respond({
			customers: [],
			next: 'https://evil.example/api/v1/customers?page=2',
			previous: null,
			count: 1,
		});

		await expect(invoke(Customers.list, {})).rejects.toThrow(
			/api.simplesat.io/,
		);
	});
});
