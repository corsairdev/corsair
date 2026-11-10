import { inspect } from 'node:util';
import {
	DemioAPIError,
	makeDemioRequest,
	packDemioCredentials,
	parseDemioCredentials,
	segment,
} from './client';

const CREDENTIALS = { apiKey: 'demio-key', apiSecret: 'demio-secret' };

let fetchMock: jest.SpyInstance;

// unknown: a failure body is whatever JSON the fake server sends.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<DemioAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(DemioAPIError);
	if (!(error instanceof DemioAPIError)) throw error;
	return error;
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('credentials', () => {
	it('round-trips the key and secret through the packed key', () => {
		const packed = packDemioCredentials(CREDENTIALS);
		expect(parseDemioCredentials(packed)).toEqual(CREDENTIALS);
	});

	// Demio needs both headers on every call, so a half-filled pair is no pair.
	it('rejects a key that is not a packed pair', () => {
		expect(parseDemioCredentials('just-a-key')).toBeNull();
		expect(parseDemioCredentials(undefined)).toBeNull();
		expect(parseDemioCredentials('')).toBeNull();
		expect(parseDemioCredentials('{"apiKey":"only-key"}')).toBeNull();
		expect(parseDemioCredentials('{"apiKey":"","apiSecret":"s"}')).toBeNull();
	});

	it('rejects a packed pair that is not JSON', () => {
		expect(parseDemioCredentials('{not json')).toBeNull();
	});
});

describe('segment', () => {
	it('encodes a value so it cannot escape its path position', () => {
		expect(segment(86)).toBe('86');
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('makeDemioRequest', () => {
	it('sends both credential headers and neither Authorization nor a token', async () => {
		respond([{ id: 86 }], 200);

		const result = await makeDemioRequest(CREDENTIALS, {
			method: 'GET',
			path: '/events',
		});

		expect(result).toEqual([{ id: 86 }]);
		const { url, init, headers } = lastRequest();
		expect(url).toBe('https://my.demio.com/api/v1/events');
		expect(init.method).toBe('GET');
		expect(headers.get('api-key')).toBe(CREDENTIALS.apiKey);
		expect(headers.get('api-secret')).toBe(CREDENTIALS.apiSecret);
		// Demio ignores a bearer token, so nothing may fall back to one.
		expect(headers.get('authorization')).toBeNull();
	});

	it('omits a query value that is undefined rather than sending the word', async () => {
		respond([], 200);

		await makeDemioRequest(CREDENTIALS, {
			method: 'GET',
			path: '/events',
			query: { type: undefined },
		});

		expect(lastRequest().url).toBe('https://my.demio.com/api/v1/events');
	});

	it('serialises a body as JSON and sets the content type', async () => {
		respond(
			{ hash: 'abc', join_link: 'https://event.demio.com/join/abc' },
			201,
		);

		await makeDemioRequest(CREDENTIALS, {
			method: 'POST',
			path: '/event/register',
			body: { id: 86, name: 'Jane Doe', email: 'jane@example.com' },
		});

		const { init, headers } = lastRequest();
		expect(init.method).toBe('POST');
		expect(headers.get('content-type')).toContain('application/json');
		expect(JSON.parse(String(init.body))).toEqual({
			id: 86,
			name: 'Jane Doe',
			email: 'jane@example.com',
		});
	});

	// Demio answers 417 for a rate limit, which the transport does not recognise
	// on its own. Reading the header is the only way a caller learns the wait.
	it('reports a 417 as a rate limit with its Retry-After in ms', async () => {
		respond(
			{ messages: ['You have reached the maximum allowed API requests rate.'] },
			417,
			{ 'Retry-After': '30' },
		);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/events' }),
		);

		expect(error.status).toBe(417);
		expect(error.isRateLimit).toBe(true);
		expect(error.isDailyLimit).toBe(false);
		expect(error.retryAfter).toBe(30_000);
	});

	// The daily allowance answers the same status, so only the message separates
	// it from a per-minute limit.
	it('tells a spent daily allowance apart from a per-minute limit', async () => {
		respond(
			{
				messages: [
					"You've reached your daily limit of API calls. To learn more, access the API section of your account settings.",
				],
			},
			417,
		);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/events' }),
		);

		expect(error.isDailyLimit).toBe(true);
		expect(error.isRateLimit).toBe(true);
	});

	it('reads the messages shape a rejected credential arrives in', async () => {
		respond({ messages: ['Authorization failed'] }, 401);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/events' }),
		);

		expect(error.status).toBe(401);
		expect(error.messages).toEqual(['Authorization failed']);
		expect(error.errors).toEqual([]);
		expect(error.message).toContain('Authorization failed');
	});

	it('reads the errors shape a missing event id arrives in', async () => {
		respond({ errors: ['Event not found'] }, 404);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/event/86' }),
		);

		expect(error.status).toBe(404);
		expect(error.errors).toEqual(['Event not found']);
		expect(error.messages).toEqual([]);
	});

	it('keeps the request method so a write is not replayed', async () => {
		respond({ errors: ['Something went wrong'] }, 500);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, {
				method: 'POST',
				path: '/event/register',
				body: { name: 'Jane Doe', email: 'jane@example.com' },
			}),
		);

		expect(error.method).toBe('POST');
		expect(error.status).toBe(500);
	});

	// The key and secret travel in headers, which ApiError never prints, so the
	// message and the inspected error must not carry either value.
	it('never prints a credential in the error', async () => {
		respond({ messages: ['Authorization failed'] }, 401);

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/events' }),
		);
		const inspected = inspect(error);

		expect(error.message).not.toContain(CREDENTIALS.apiKey);
		expect(error.message).not.toContain(CREDENTIALS.apiSecret);
		expect(inspected).not.toContain(CREDENTIALS.apiKey);
		expect(inspected).not.toContain(CREDENTIALS.apiSecret);
	});

	it('wraps a transport failure and keeps no response', async () => {
		fetchMock.mockRejectedValueOnce(new Error('socket hang up'));

		const error = await failure(
			makeDemioRequest(CREDENTIALS, { method: 'GET', path: '/events' }),
		);

		expect(error.status).toBe(0);
		expect(error.message).toContain('socket hang up');
		expect(error.messages).toEqual([]);
	});
});
