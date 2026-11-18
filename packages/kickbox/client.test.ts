import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeKickboxError,
	kickboxErrorCode,
	makeKickboxRequest,
	readFailure,
} from './client';

const API_KEY = 'kb-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
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
		query: parsed.searchParams.toString(),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('readFailure', () => {
	it('reads the code and message of a failure envelope', () => {
		expect(
			readFailure({
				success: false,
				code: 'FORBIDDEN',
				message: 'Invalid API key',
			}),
		).toEqual({
			success: false,
			code: 'FORBIDDEN',
			message: 'Invalid API key',
		});
	});

	it('leaves success undefined when the body does not say', () => {
		expect(readFailure({ result: 'deliverable' })).toEqual({
			success: undefined,
			code: undefined,
			message: undefined,
		});
	});

	it.each([[undefined], [null], [{}], [[]], ['text']])(
		'returns an empty result for %j',
		(body) => {
			expect(readFailure(body)).toEqual({
				success: undefined,
				code: undefined,
				message: undefined,
			});
		},
	);
});

describe('describeKickboxError', () => {
	it('puts the status and code in front of the message', () => {
		expect(
			describeKickboxError(
				403,
				{ success: false, code: 'FORBIDDEN', message: 'Invalid API key' },
				'x',
			),
		).toBe('Kickbox 403 FORBIDDEN: Invalid API key');
	});

	it('uses only the code when no status is known', () => {
		expect(
			describeKickboxError(
				undefined,
				{ success: false, code: 'INSUFFICIENT_BALANCE', message: 'No credits' },
				'x',
			),
		).toBe('Kickbox INSUFFICIENT_BALANCE: No credits');
	});

	it('uses the fallback when the body has no message', () => {
		expect(describeKickboxError(503, undefined, 'Service Unavailable')).toBe(
			'Kickbox 503: Service Unavailable',
		);
	});
});

describe('makeKickboxRequest', () => {
	it('sends no auth header, since the key travels in the query', async () => {
		respond({ result: 'deliverable', success: true });

		await makeKickboxRequest(API_KEY, {
			method: 'GET',
			base: 'https://api.kickbox.com',
			path: '/v2/verify',
			query: { email: 't@example.com', apikey: API_KEY },
		});

		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('addresses the base it is given', async () => {
		respond({ disposable: false });

		await makeKickboxRequest(API_KEY, {
			method: 'GET',
			base: 'https://open.kickbox.com',
			path: '/v1/disposable/google.com',
		});

		expect(lastRequest().origin).toBe('https://open.kickbox.com');
	});

	it('returns a success body as it arrived', async () => {
		respond({ result: 'deliverable', success: true });

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).resolves.toEqual({ result: 'deliverable', success: true });
	});

	it('turns a 200 that says success false into an error', async () => {
		respond({ success: false, code: 'FORBIDDEN', message: 'Invalid API key' });

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).rejects.toMatchObject({
			name: 'KickboxAPIError',
			status: 200,
			code: 'FORBIDDEN',
			message: 'Kickbox FORBIDDEN: Invalid API key',
			method: 'GET',
		});
	});

	it('keeps an ordinary success body without a success field', async () => {
		respond({ disposable: true });

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://open.kickbox.com',
				path: '/v1/disposable/x.com',
			}),
		).resolves.toEqual({ disposable: true });
	});

	it('keeps a request failure’s status and code', async () => {
		respond(
			{ success: false, code: 'FORBIDDEN', message: 'Invalid API key' },
			403,
		);

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 403,
			body: { code: 'FORBIDDEN' },
		});
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ success: false, message: 'Slow' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			}),
		);

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 7000 });
	});

	it('stays core ApiError without the address Kickbox echoes or the key', async () => {
		respond(
			{
				success: false,
				code: 'BAD_REQUEST',
				message: 'Invalid email: person@private.example',
			},
			400,
		);

		const error = await makeKickboxRequest(API_KEY, {
			method: 'GET',
			base: 'https://api.kickbox.com',
			path: '/v2/verify',
			query: { email: 'person@private.example', apikey: API_KEY },
			// unknown: a rejected request can carry any thrown value.
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(kickboxErrorCode(error)).toBe('BAD_REQUEST');
		expect(error).toMatchObject({
			message: 'Kickbox 400 BAD_REQUEST: request failed',
		});
		expect(inspect(error, { depth: 10 })).not.toContain('Invalid email');
		expect(inspect(error, { depth: 10 })).not.toContain('person@private');
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKickboxRequest(API_KEY, {
			method: 'GET',
			base: 'https://api.kickbox.com',
			path: '/v2/verify',
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({ transport: true, message: 'fetch failed' });
		expect(error.cause).toBe(dropped);
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});

	it('marks a failure on the verification host as paid', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://api.kickbox.com',
				path: '/v2/verify',
			}),
		).rejects.toMatchObject({ paid: true });
	});

	it('marks a failure on the open host as free', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			makeKickboxRequest(API_KEY, {
				method: 'GET',
				base: 'https://open.kickbox.com',
				path: '/v1/disposable/google.com',
			}),
		).rejects.toMatchObject({ paid: false });
	});
});
