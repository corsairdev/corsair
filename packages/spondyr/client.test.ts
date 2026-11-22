import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeSpondyrError,
	makeSpondyrRequest,
	SPONDYR_API_BASE,
} from './client';
import { badCredentials, noCredentials } from './test-fixtures';
import { captureError } from './test-helpers';

const CREDENTIALS = { apiKey: 'sp-key', applicationToken: 'sp-token' };

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url: String(url),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined, // unknown: asserted inline.
	};
}

beforeEach(() => {
	// Queued responses answer the expected calls; anything past them fails instead of reaching Spondyr.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unexpected request to Spondyr');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeSpondyrRequest', () => {
	it('sends both credentials as headers, not in the URL', async () => {
		respond({ APIStatus: 'OK' });

		await makeSpondyrRequest(CREDENTIALS, {
			method: 'GET',
			path: 'TransactionTypes',
		});

		const sent = lastRequest();
		expect(sent.url).toBe(`${SPONDYR_API_BASE}/TransactionTypes`);
		expect(sent.headers.get('apikey')).toBe('sp-key');
		expect(sent.headers.get('applicationtoken')).toBe('sp-token');
		// The key and token must not appear in the query string, where a proxy
		// log or an ApiError would capture them.
		expect(sent.url).not.toContain('sp-key');
		expect(sent.url).not.toContain('sp-token');
	});

	it('serializes a query string for the read routes', async () => {
		respond({ APIStatus: 'OK', Data: [] });

		await makeSpondyrRequest(CREDENTIALS, {
			method: 'GET',
			path: 'Templates',
			query: { TransactionType: 'Customer Orders', Page: 2, Empty: undefined },
		});

		const url = new URL(lastRequest().url);
		expect(url.searchParams.get('TransactionType')).toBe('Customer Orders');
		expect(url.searchParams.get('Page')).toBe('2');
		expect(url.searchParams.has('Empty')).toBe(false);
	});

	it('sends a JSON body on a write', async () => {
		respond({ APIStatus: 'OK' });

		await makeSpondyrRequest(CREDENTIALS, {
			method: 'POST',
			path: 'Spondyr',
			body: { EventType: 'OrderPlaced' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ EventType: 'OrderPlaced' });
	});

	it('sends no body on a DELETE that carries only a query', async () => {
		respond({ APIStatus: 'OK' });

		await makeSpondyrRequest(CREDENTIALS, {
			method: 'DELETE',
			path: 'Template',
			query: { Template: 'Order Confirmation' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('turns a 400 into an ApiError that carries the provider message', async () => {
		respond(badCredentials, 400);

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'GET',
				path: 'TransactionTypes',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).name).toBe('ApiError');
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).message).toContain('API Key is invalid');
		expect((error as ApiError).body).toMatchObject({ APIStatus: 'ERROR' });
	});

	it('reads the missing-credential message the same way', async () => {
		respond(noCredentials, 400);

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'GET',
				path: 'Templates',
			}),
		);

		expect((error as ApiError).message).toContain('API Key not specified');
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({}, 429, { 'Retry-After': '5' });

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'GET',
				path: 'TransactionTypes',
			}),
		);

		expect((error as ApiError).retryAfter).toBe(5000);
		expect((error as ApiError).status).toBe(429);
	});

	it('records the method so writes are not replayed on a 5xx', async () => {
		respond({}, 500);

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'POST',
				path: 'Spondyr',
				body: {},
			}),
		);

		expect((error as ApiError).request.method).toBe('POST');
	});

	it('redacts document data Spondyr quotes back in an error message', () => {
		// Trimmed from a live status call made right after a send (11-23).
		const message =
			'An unexpected error was encountered!  Conversion failed when converting the nvarchar value \'{"OrderNumber":12345,"Customer":{"Email":"jane@example.com"}}\' to data type int.';
		const described = describeSpondyrError(
			404,
			{ APIStatus: 'ERROR', ErrorMessage: message },
			'x',
		);
		expect(described.message).not.toContain('jane@example.com');
		expect(described.message).toContain("'<document data>' to data type int.");
		expect(
			describeSpondyrError(400, { ErrorMessage: "Name 'Order' exists" }, 'x')
				.message,
		).toBe("Spondyr 400: Name 'Order' exists");
	});

	it('keeps document data out of a failed request', async () => {
		respond(badCredentials, 400);

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'POST',
				path: 'Spondyr',
				body: {
					EventType: 'New Order',
					Data: { Customer_Email: 'jane@example.com' },
				},
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('jane@example.com');
	});

	it('never puts either credential in the message or its inspection', async () => {
		respond(badCredentials, 400);

		const error = await captureError(
			makeSpondyrRequest(CREDENTIALS, {
				method: 'GET',
				path: 'TransactionTypes',
			}),
		);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain('sp-key');
			expect(text).not.toContain('sp-token');
		}
	});
});

describe('describeSpondyrError', () => {
	it('prefers ErrorMessage', () => {
		expect(describeSpondyrError(400, badCredentials, 'x')).toEqual({
			message: 'Spondyr 400: API Key is invalid! Application Token is invalid!',
			apiStatus: 'ERROR',
		});
	});

	it('falls back to the routing Message when there is no ErrorMessage', () => {
		expect(
			describeSpondyrError(404, { Message: 'No HTTP resource was found' }, 'x')
				.message,
		).toBe('Spondyr 404: No HTTP resource was found');
	});

	it('uses the fallback for a body with neither field', () => {
		expect(describeSpondyrError(500, '<html>', 'Server Error').message).toBe(
			'Spondyr 500: Server Error',
		);
		expect(describeSpondyrError(undefined, null, 'offline').message).toBe(
			'offline',
		);
	});

	it('leaves apiStatus undefined when the body does not carry one', () => {
		expect(describeSpondyrError(500, {}, 'x').apiStatus).toBeUndefined();
	});
});
