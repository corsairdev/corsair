import { ApiError } from 'corsair/http';
import { z } from 'zod';
import {
	ClickSendAPIError,
	getClickSendCredentials,
	makeClickSendRequest,
} from './client';

const USERNAME = 'testuser';
const API_KEY = 'test-api-key-123';

const fetchSpy = jest.spyOn(globalThis, 'fetch');

// unknown justification: test fixtures stand in for arbitrary provider JSON;
// they are serialized straight into a Response, never inspected as objects.
function jsonResponse(payload: unknown, status = 200): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

// unknown justification: envelope `data` fixtures mirror arbitrary provider
// payloads; they travel through the real client parser, never inspected here.
function successEnvelope(data: unknown): Response {
	return jsonResponse({
		http_code: 200,
		response_code: 'SUCCESS',
		response_msg: 'ok',
		data,
	});
}

const DataSchema = z.object({ value: z.string() });

// unknown justification: promise rejections carry untyped values by design;
// this helper is the single place that captures them, and callers only assert
// with toBeInstanceOf/toMatchObject, never narrowing the value.
async function captureError(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

beforeEach(() => {
	fetchSpy.mockReset();
});

describe('getClickSendCredentials', () => {
	it('reads username and apiKey from options', async () => {
		const creds = await getClickSendCredentials({
			options: { username: '  alice  ', apiKey: '  key-1  ' },
		});
		expect(creds).toEqual({ username: 'alice', apiKey: 'key-1' });
	});

	it('splits a username:key combo key', async () => {
		const creds = await getClickSendCredentials({ key: 'bob:secret-2' });
		expect(creds).toEqual({ username: 'bob', apiKey: 'secret-2' });
	});

	it('treats a bare key as the apiKey', async () => {
		const creds = await getClickSendCredentials({ key: 'only-key' });
		expect(creds).toEqual({ username: '', apiKey: 'only-key' });
	});

	it('falls back to keys.get_username for the username', async () => {
		const creds = await getClickSendCredentials({
			key: 'only-key',
			keys: {
				get_username: () => Promise.resolve('carol'),
			},
		});
		expect(creds).toEqual({ username: 'carol', apiKey: 'only-key' });
	});
});

describe('makeClickSendRequest', () => {
	it('sends Basic auth and unwraps validated data', async () => {
		fetchSpy.mockImplementation(() =>
			Promise.resolve(successEnvelope({ value: 'hi' })),
		);
		const result = await makeClickSendRequest('sms/send', USERNAME, API_KEY, {
			method: 'POST',
			responseSchema: DataSchema,
		});
		expect(result).toEqual({ value: 'hi' });
		const call = fetchSpy.mock.calls[fetchSpy.mock.calls.length - 1];
		if (!call) {
			throw new Error('expected a fetch call');
		}
		const [url, init] = call;
		expect(String(url)).toBe('https://rest.clicksend.com/v3/sms/send');
		expect(init?.method).toBe('POST');
		const headers = init?.headers;
		// Headers instance check: request.ts always builds a Headers object.
		const authorization =
			headers instanceof Headers ? headers.get('Authorization') : undefined;
		expect(authorization).toBe(
			`Basic ${Buffer.from(`${USERNAME}:${API_KEY}`).toString('base64')}`,
		);
	});

	it('sends query params on GET requests', async () => {
		fetchSpy.mockImplementation(() =>
			Promise.resolve(successEnvelope({ value: 'hi' })),
		);
		await makeClickSendRequest('sms/history', USERNAME, API_KEY, {
			method: 'GET',
			query: { page: 2, limit: 15 },
			responseSchema: DataSchema,
		});
		const call = fetchSpy.mock.calls[fetchSpy.mock.calls.length - 1];
		if (!call) {
			throw new Error('expected a fetch call');
		}
		expect(String(call[0])).toContain('/v3/sms/history');
		expect(String(call[0])).toContain('page=2');
	});

	it('throws MISSING_CREDENTIALS when credentials are absent', async () => {
		const error = await captureError(
			makeClickSendRequest('sms/send', '', '', {
				method: 'POST',
				responseSchema: DataSchema,
			}),
		);
		expect(error).toBeInstanceOf(ClickSendAPIError);
		expect(error).toMatchObject({
			status: 401,
			code: 'MISSING_CREDENTIALS',
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('rejects credentials containing newlines (header injection)', async () => {
		const error = await captureError(
			makeClickSendRequest('sms/send', 'user\r\nInject: x', API_KEY, {
				method: 'POST',
				responseSchema: DataSchema,
			}),
		);
		expect(error).toBeInstanceOf(ClickSendAPIError);
		expect(error).toMatchObject({
			status: 400,
			code: 'INVALID_CREDENTIALS_FORMAT',
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('maps envelope application errors to ClickSendAPIError', async () => {
		fetchSpy.mockImplementation(() =>
			Promise.resolve(
				jsonResponse({
					http_code: 400,
					response_code: 'INVALID_RECIPIENT',
					response_msg: 'The destination number is invalid.',
				}),
			),
		);
		const error = await captureError(
			makeClickSendRequest('sms/send', USERNAME, API_KEY, {
				method: 'POST',
				responseSchema: DataSchema,
			}),
		);
		expect(error).toBeInstanceOf(ClickSendAPIError);
		expect(error).toMatchObject({
			status: 400,
			code: 'INVALID_RECIPIENT',
		});
	});

	it('wraps response schema mismatches in ClickSendAPIError', async () => {
		fetchSpy.mockImplementation(() =>
			Promise.resolve(successEnvelope({ value: 42 })),
		);
		await expect(
			makeClickSendRequest('sms/send', USERNAME, API_KEY, {
				method: 'POST',
				responseSchema: DataSchema,
			}),
		).rejects.toBeInstanceOf(ClickSendAPIError);
	});

	it('rethrows transport ApiError unchanged', async () => {
		fetchSpy.mockImplementation(() =>
			Promise.resolve(jsonResponse({ message: 'Server exploded' }, 500)),
		);
		await expect(
			makeClickSendRequest('account', USERNAME, API_KEY, {
				method: 'GET',
				responseSchema: DataSchema,
			}),
		).rejects.toBeInstanceOf(ApiError);
	});
});
