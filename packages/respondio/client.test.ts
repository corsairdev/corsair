import {
	contactIdentifier,
	describeRespondioError,
	makeRespondioRequest,
	RESPONDIO_API_BASE,
	RespondioAPIError,
	segment,
} from './client';
import { CONTACT, RATE_LIMITED, UN_AUTHORIZED } from './test-fixtures';

const TOKEN = 'respondio-secret-token';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<RespondioAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RespondioAPIError);
	if (!(error instanceof RespondioAPIError)) throw error;
	return error;
}

describe('respond.io client', () => {
	it('points at the documented v2 host', () => {
		expect(RESPONDIO_API_BASE).toBe('https://api.respond.io/v2');
	});

	it('sends the token as a Bearer token', async () => {
		respond(CONTACT, 200);

		await makeRespondioRequest(TOKEN, {
			method: 'GET',
			path: '/contact/id:12345',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.respond.io/v2/contact/id:12345');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('serialises a body as JSON', async () => {
		respond({ messageId: 1 }, 200);

		await makeRespondioRequest(TOKEN, {
			method: 'POST',
			path: '/contact/id:1/message',
			body: { message: { type: 'text', text: 'hi' } },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			message: { type: 'text', text: 'hi' },
		});
	});

	it('reads the numeric code and message from a 401', async () => {
		respond(UN_AUTHORIZED, 401);

		const error = await failure(
			makeRespondioRequest(TOKEN, {
				method: 'GET',
				path: '/contact/id:1',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		// The code repeats the status, so it is not repeated in the message.
		expect(error.message).toBe('respond.io 401: UN_AUTHORIZED');
		expect(error.isAuthError).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeRespondioRequest(TOKEN, {
				method: 'POST',
				path: '/contact/id:1/message',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(2000);
	});

	it('reads a 449 as unprocessable, which is not a rate limit', async () => {
		respond({ code: 449, message: 'Outside the 24 hour window' }, 449);

		const error = await failure(
			makeRespondioRequest(TOKEN, {
				method: 'POST',
				path: '/contact/id:1/message',
				replayable: false,
			}),
		);

		expect(error.isUnprocessable).toBe(true);
		expect(error.status).toBe(449);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRespondioRequest(TOKEN, {
				method: 'GET',
				path: '/contact/id:1',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(UN_AUTHORIZED, 401);

		const error = await failure(
			makeRespondioRequest(TOKEN, {
				method: 'GET',
				path: '/contact/id:1',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('contactIdentifier', () => {
	it('builds an id: identifier by default', () => {
		expect(contactIdentifier(12345)).toBe('id%3A12345');
	});

	it('builds an email: identifier', () => {
		expect(contactIdentifier('a@b.com', 'email')).toBe('email%3Aa%40b.com');
	});

	it('builds a phone: identifier', () => {
		expect(contactIdentifier('+60123456789', 'phone')).toBe(
			'phone%3A%2B60123456789',
		);
	});

	it('passes an already-prefixed value through without double-prefixing', () => {
		expect(contactIdentifier('email:a@b.com')).toBe('email%3Aa%40b.com');
		expect(contactIdentifier('phone:+60123456789')).toBe(
			'phone%3A%2B60123456789',
		);
	});

	it('does not mistake a value containing a colon for a prefix', () => {
		// Only id:, email: and phone: count as prefixes.
		expect(contactIdentifier('http://x', 'email')).toBe(
			'email%3Ahttp%3A%2F%2Fx',
		);
	});
});

describe('segment', () => {
	it('encodes a value', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('stringifies a number', () => {
		expect(segment(42)).toBe('42');
	});
});

describe('describeRespondioError', () => {
	it('adds a code only when it differs from the status', () => {
		expect(
			describeRespondioError(502, { code: 500, message: 'Down' }, 'x'),
		).toBe('respond.io 502 500: Down');
	});

	it('falls back to the supplied message', () => {
		expect(describeRespondioError(500, null, 'Server error')).toBe(
			'respond.io 500: Server error',
		);
	});

	it('returns the bare message with no status', () => {
		expect(describeRespondioError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
