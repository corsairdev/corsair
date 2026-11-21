import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describePandadocError,
	makePandadocRequest,
	maskEmails,
} from './client';
import { document, unauthorized } from './test-fixtures';

const API_KEY = 'pd-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
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

describe('makePandadocRequest', () => {
	it('authenticates with the literal API-Key scheme', async () => {
		respond(document, 200);

		await makePandadocRequest(API_KEY, {
			method: 'GET',
			path: '/public/v1/documents',
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pandadoc.com/public/v1/documents');
		expect(sent.headers.get('authorization')).toBe(`API-Key ${API_KEY}`);
		expect(sent.headers.get('accept')).toBe('application/json');
		expect(sent.init.method).toBe('GET');
	});

	it('does not use Bearer or send the key as a query parameter', async () => {
		respond(document, 200);

		await makePandadocRequest(API_KEY, {
			method: 'GET',
			path: '/public/v1/documents',
			query: { page: 2 },
		});

		const sent = lastCall();
		expect(sent.headers.get('authorization')).not.toContain('Bearer');
		expect(sent.url).toContain('page=2');
		expect(sent.url).not.toContain(API_KEY);
	});

	it('sends a JSON body on POST and query parameters on DELETE', async () => {
		respond(undefined, 204);

		await makePandadocRequest(API_KEY, {
			method: 'POST',
			path: '/public/v1/contacts',
			body: { email: 'nobody@example.com' },
		});
		let sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(String(sent.init.body)).toBe(
			JSON.stringify({ email: 'nobody@example.com' }),
		);
		expect(sent.headers.get('content-type')).toBe('application/json');

		respond(undefined, 204);
		await makePandadocRequest(API_KEY, {
			method: 'DELETE',
			path: '/public/v1/documents/XjV64iXRJMerjSpk428QSF',
			query: { forever: true },
		});
		sent = lastCall();
		expect(sent.init.method).toBe('DELETE');
		expect(sent.url).toContain('forever=true');
		expect(sent.init.body).toBeUndefined();
	});

	it('keeps the error status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePandadocRequest(API_KEY, {
				method: 'GET',
				path: '/public/v1/documents',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Authentication credentials');
		expect(error.name).toBe('ApiError');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ type: 'rate_limit_error', detail: 'Slow down' }, 429, {
			'Retry-After': '0',
		});
		respond(document, 200);

		const result = await makePandadocRequest(API_KEY, {
			method: 'GET',
			path: '/public/v1/documents',
		});
		expect(result).toEqual(document);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('keeps no request body or query on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePandadocRequest(API_KEY, {
				method: 'POST',
				path: '/public/v1/documents',
				body: { recipients: [{ email: 'jane@example.com' }] },
				query: { page: 1 },
			}),
		);
		// JSON.stringify(error) hides the non-enumerable cause; util.inspect is
		// what console.error prints, so that is the leak to guard.
		const printed = inspect(error);
		expect(printed).not.toContain('jane@example.com');
		expect(printed).not.toContain('recipients');
		expect(error.message).not.toContain('jane@example.com');
	});

	it('keeps only type and detail from an error body', async () => {
		respond(
			{ type: 'bad_request', detail: 'Invalid contact', phone: '+15555550100' },
			400,
		);
		const error = await failure(
			makePandadocRequest(API_KEY, {
				method: 'POST',
				path: '/public/v1/contacts',
			}),
		);
		expect(error.body).toEqual({
			type: 'bad_request',
			detail: 'Invalid contact',
		});
		expect(inspect(error)).not.toContain('+15555550100');
	});

	it('masks email addresses in error detail', async () => {
		respond(
			{ type: 'bad_request', detail: 'Recipient jane@example.com is invalid' },
			400,
		);

		const error = await failure(
			makePandadocRequest(API_KEY, {
				method: 'POST',
				path: '/public/v1/documents',
			}),
		);
		expect(error.message).toContain('[email]');
		expect(error.message).not.toContain('jane@example.com');
	});

	it('falls back to the status text for a non-JSON error body', async () => {
		respond('Not Found', 404);

		const error = await failure(
			makePandadocRequest(API_KEY, {
				method: 'GET',
				path: '/public/v1/documents/nope/details',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toContain('Not Found');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePandadocRequest(API_KEY, {
				method: 'GET',
				path: '/public/v1/documents',
			}),
		).rejects.toThrow('connection reset');
	});
});

describe('describePandadocError', () => {
	it('reads the documented { type, detail } envelope', () => {
		expect(
			describePandadocError(
				{ type: 'authentication_error', detail: 'No credentials' },
				'fallback',
			),
		).toBe('No credentials');
	});

	it('uses the type when the detail is absent', () => {
		expect(describePandadocError({ type: 'bad_request' }, 'fallback')).toBe(
			'bad_request',
		);
	});

	it('falls back on anything else', () => {
		expect(describePandadocError(null, 'fallback')).toBe('fallback');
		expect(describePandadocError('plain', 'fallback')).toBe('fallback');
	});
});

describe('maskEmails', () => {
	it('masks emails in strings, arrays and objects', () => {
		expect(maskEmails('mail jane@example.com now')).toBe('mail [email] now');
		expect(maskEmails(['a@b.com', 'keep'])).toEqual(['[email]', 'keep']);
		expect(maskEmails({ detail: 'x@y.z', keep: 1 })).toEqual({
			detail: '[email]',
			keep: 1,
		});
		expect(maskEmails(42)).toBe(42);
	});
});
