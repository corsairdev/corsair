import {
	describePingdomError,
	makePingdomRequest,
	PingdomAPIError,
} from './client';
import { unauthorized } from './test-fixtures';

const TOKEN = 'pd-test-token';

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
async function failure(promise: Promise<unknown>): Promise<PingdomAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PingdomAPIError);
	if (!(error instanceof PingdomAPIError)) throw error;
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

describe('makePingdomRequest', () => {
	it('authenticates as a Bearer token under /api/3.1', async () => {
		respond({ checks: [] }, 200);

		await makePingdomRequest(TOKEN, {
			method: 'GET',
			path: '/api/3.1/checks',
			query: { limit: 5 },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pingdom.com/api/3.1/checks?limit=5');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('sends JSON bodies with the media type on writes', async () => {
		respond({ message: 'ok' }, 200);

		await makePingdomRequest(TOKEN, {
			method: 'POST',
			path: '/api/3.1/alerting/teams',
			body: { name: 'API Team', member_ids: [1] },
		});

		const sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(sent.init.body).toBe(
			JSON.stringify({ name: 'API Team', member_ids: [1] }),
		);
		expect(sent.headers.get('content-type')).toContain('application/json');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePingdomRequest(TOKEN, { method: 'GET', path: '/api/3.1/checks' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Pingdom 401: Please provide a valid API token');
		expect(error.method).toBe('GET');
		expect(error.url).toBe('/api/3.1/checks');
	});

	it('drops the request body from the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePingdomRequest(TOKEN, {
				method: 'POST',
				path: '/api/3.1/checks',
				body: { name: 'secret check', host: 'internal.example.com' },
			}),
		);
		const printed = JSON.stringify(error.request);
		expect(printed).not.toContain('internal.example.com');
	});
});

describe('describePingdomError', () => {
	it('extracts the errormessage field of the documented envelope', () => {
		expect(describePingdomError(unauthorized, 'fallback')).toBe(
			'Please provide a valid API token',
		);
	});

	it('falls back on unknown bodies', () => {
		expect(describePingdomError(null, 'fallback')).toBe('fallback');
		expect(describePingdomError({ message: 'plain' }, 'fallback')).toBe(
			'plain',
		);
	});
});
