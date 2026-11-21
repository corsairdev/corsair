import { ApiError } from 'corsair/http';
import { describePiggyError, makePiggyRequest } from './client';
import { notFound, unauthenticated } from './test-fixtures';

const TOKEN = 'pat-test-token';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePiggyRequest', () => {
	it('authenticates as a Bearer token under /api/v3', async () => {
		respond(contactsAnswer(), 200);

		await makePiggyRequest(TOKEN, {
			method: 'GET',
			path: '/api/v3/oauth/clients/contacts',
			query: { page: 2 },
		});

		const sent = lastCall();
		expect(sent.url).toBe(
			'https://api.leat.com/api/v3/oauth/clients/contacts?page=2',
		);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(sent.headers.get('accept')).toBe('application/json');
	});

	it('sends a JSON body with the right media type on POST', async () => {
		respond({ data: { uuid: 'x' }, meta: [] }, 201);

		await makePiggyRequest(TOKEN, {
			method: 'POST',
			path: '/api/v3/oauth/clients/contacts',
			body: { email: 'a@b.sea' },
		});

		const sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(sent.init.body).toBe(JSON.stringify({ email: 'a@b.sea' }));
		expect(sent.headers.get('content-type')).toContain('application/json');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makePiggyRequest(TOKEN, {
				method: 'GET',
				path: '/api/v3/oauth/clients/contacts',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Piggy 401: Unauthenticated.');
		expect(error.request.method).toBe('GET');
		expect(error.name).toBe('ApiError');
		expect(error.url).toBe('/api/v3/oauth/clients/contacts');
	});

	it('keeps the documented error envelope detail on a 400', async () => {
		respond(notFound, 404);

		const error = await failure(
			makePiggyRequest(TOKEN, {
				method: 'GET',
				path: '/api/v3/oauth/clients/contacts/nope',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Piggy 404: Object not found');
	});

	it('drops the request body from the rebuilt error', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makePiggyRequest(TOKEN, {
				method: 'POST',
				path: '/api/v3/oauth/clients/contacts',
				body: { email: 'secret@bikinibottom.sea' },
			}),
		);
		const printed = JSON.stringify(error.request);
		expect(printed).not.toContain('secret@bikinibottom.sea');
		expect(error.request.method).toBe('POST');
	});
});

function contactsAnswer() {
	return {
		data: [],
		meta: { page: 1, limit: 10, last_page: 1, total: 0 },
	};
}

describe('describePiggyError', () => {
	it('prefers the documented message field', () => {
		expect(describePiggyError(notFound, 'fallback')).toBe('Object not found');
	});

	it('falls back on the bare auth body', () => {
		expect(describePiggyError(unauthenticated, 'fallback')).toBe(
			'Unauthenticated.',
		);
		expect(describePiggyError(null, 'fallback')).toBe('fallback');
	});
});
