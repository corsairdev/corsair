import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describePasscreatorError, makePasscreatorRequest } from './client';
import { pass, writeResult } from './test-fixtures';

const API_KEY = 'pc-test-key';

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

describe('makePasscreatorRequest', () => {
	it('authenticates with the raw key in the Authorization header, no scheme word', async () => {
		respond([writeResult], 200);

		await makePasscreatorRequest(API_KEY, {
			method: 'GET',
			path: '/api/pass-template',
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://app.passcreator.com/api/pass-template');
		expect(sent.headers.get('authorization')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).not.toContain('Bearer');
	});

	it('sends a JSON body on POST and PUT, none on DELETE', async () => {
		respond(writeResult, 200);
		await makePasscreatorRequest(API_KEY, {
			method: 'PUT',
			path: '/api/pass/uid1',
			query: { zapierStyle: true },
			body: { firstname: 'John' },
		});
		let sent = lastCall();
		expect(sent.url).toContain('zapierStyle=true');
		expect(String(sent.init.body)).toBe(JSON.stringify({ firstname: 'John' }));

		respond(writeResult, 200);
		await makePasscreatorRequest(API_KEY, {
			method: 'DELETE',
			path: '/api/pass/uid1',
		});
		sent = lastCall();
		expect(sent.init.body).toBeUndefined();
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(
			{ success: false, description: 'Unauthorized', errors: ['bad key'] },
			401,
		);

		const error = await failure(
			makePasscreatorRequest(API_KEY, {
				method: 'GET',
				path: '/api/pass-template',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Unauthorized');
		expect(error.name).toBe('ApiError');
	});

	it('masks the recipient email in the path of a failed sendEmail', async () => {
		respond({ ErrorMessage: 'Pass not found' }, 404);
		const error = await failure(
			makePasscreatorRequest('key', {
				method: 'POST',
				path: `/api/pass/deliver/uid1/email/${encodeURIComponent('jane@example.com')}`,
			}),
		);
		expect(error.name).toBe('ApiError');
		expect(error.url).toBe('/api/pass/deliver/uid1/email/[email]');
		expect(inspect(error, { depth: 5 })).not.toContain('jane');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond({ success: false, description: 'Validation failed' }, 400);

		const error = await failure(
			makePasscreatorRequest(API_KEY, {
				method: 'POST',
				path: '/api/pass',
				body: { firstname: 'Secret', buyerEmail: 'jane@example.com' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('jane@example.com');
		expect(error.message).not.toContain('jane@example.com');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePasscreatorRequest(API_KEY, {
				method: 'GET',
				path: '/api/pass-template',
			}),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ description: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond([pass], 200);

		const result = await makePasscreatorRequest(API_KEY, {
			method: 'GET',
			path: '/api/pass/list/t1',
		});
		expect(result).toEqual([pass]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePasscreatorError', () => {
	it('reads the documented { success, description } envelope', () => {
		expect(
			describePasscreatorError(
				{ success: false, description: 'Template not found', errors: [] },
				'fallback',
			),
		).toBe('Template not found');
	});

	it('falls back on anything else', () => {
		expect(describePasscreatorError(null, 'fallback')).toBe('fallback');
	});
});
