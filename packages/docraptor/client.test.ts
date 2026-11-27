import util from 'node:util';
import {
	DocRaptorAPIError,
	describeDocRaptorErrorBody,
	makeDocRaptorRequest,
	segment,
} from './client';
import { throttleError, xmlError } from './test-fixtures';

const API_KEY = 'dr-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON, XML or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	const text = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(text, {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'application/xml' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<DocRaptorAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(DocRaptorAPIError);
	if (!(error instanceof DocRaptorAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDocRaptorRequest', () => {
	it('authenticates with the key as the Basic username and an empty password', async () => {
		respond({}, 200);

		await makeDocRaptorRequest(API_KEY, {
			method: 'GET',
			path: '/status/abc',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docraptor.com/status/abc');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(
			`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
		);
		expect(url).not.toContain('user_credentials');
	});

	it('hits the marketing host for site requests', async () => {
		respond([], 200);

		await makeDocRaptorRequest(API_KEY, {
			method: 'GET',
			host: 'site',
			path: '/ips.json',
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://docraptor.com/ips.json');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({}, 200);

		await makeDocRaptorRequest(API_KEY, {
			method: 'POST',
			path: '/async_docs',
			body: { type: 'pdf', test: true },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ type: 'pdf', test: true });
	});

	it('extracts the message from an XML error body', async () => {
		respond(xmlError, 401);

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/status/abc',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Please provide a valid API key.');
		expect(error.method).toBe('GET');
	});

	it('extracts the message from a JSON error body', async () => {
		respond(
			{
				errors: [
					'[Invalid Action Error] Requested document cannot be expired.',
				],
			},
			422,
		);

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'PATCH',
				path: '/expire/abc.json',
			}),
		);
		expect(error.status).toBe(422);
		expect(error.message).toBe(
			'[Invalid Action Error] Requested document cannot be expired.',
		);
	});

	it('falls back to a generic message on an empty error body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/docs.json',
			}),
		);
		expect(error.status).toBe(403);
		expect(error.message).toBeTruthy();
		expect(error.isThrottle).toBe(false);
	});

	it('flags the 403 concurrency throttle by its message', async () => {
		respond(
			xmlError.replace('Please provide a valid API key.', throttleError),
			403,
		);

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/status/abc',
			}),
		);
		expect(error.status).toBe(403);
		expect(error.isThrottle).toBe(true);
	});

	it('reads a Retry-After header into the error on the throttle 403', async () => {
		respond(
			xmlError.replace('Please provide a valid API key.', throttleError),
			403,
			{ 'Retry-After': '2' },
		);

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/status/abc',
			}),
		);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures with the cause kept', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/status/abc',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('keeps the key out of the error, its JSON and its inspect output', async () => {
		// The ApiError body and cause hold request data; neither may be copied
		// onto the thrown error, or they would print through console and inspect.
		respond(xmlError, 401);

		const error = await failure(
			makeDocRaptorRequest(API_KEY, {
				method: 'GET',
				path: '/status/abc',
			}),
		);
		expect(error.message).toBe('Please provide a valid API key.');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
	});
});

describe('describeDocRaptorErrorBody', () => {
	it('joins several XML error messages', () => {
		expect(
			describeDocRaptorErrorBody(
				'<errors><error>first</error><error>second</error></errors>',
				'x',
			),
		).toBe('first; second');
	});

	it('parses a JSON string body', () => {
		expect(describeDocRaptorErrorBody('{"errors":["nope"]}', 'x')).toBe('nope');
	});

	it('returns the trimmed text of an unrecognized string body', () => {
		expect(describeDocRaptorErrorBody('  <html>down</html>  ', 'x')).toBe(
			'<html>down</html>',
		);
	});

	it('falls back on empty and missing bodies', () => {
		expect(describeDocRaptorErrorBody(undefined, 'fallback')).toBe('fallback');
		expect(describeDocRaptorErrorBody('   ', 'fallback')).toBe('fallback');
		expect(describeDocRaptorErrorBody({ errors: [] }, 'fallback')).toBe(
			'fallback',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
