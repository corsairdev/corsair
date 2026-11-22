import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describeParsioError, makeParsioRequest } from './client';
import { parsedDocument, unauthorized } from './test-fixtures';

const API_KEY = 'prsio-test-key';

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

describe('makeParsioRequest', () => {
	it('authenticates in the X-API-Key header', async () => {
		respond([parsedDocument], 200);

		await makeParsioRequest(API_KEY, { method: 'GET', path: '/mailboxes' });

		const sent = lastCall();
		expect(sent.url).toBe('https://api.parsio.io/mailboxes');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	});

	it('sends a JSON body on POST and on DELETE (webhooks.delete takes ids)', async () => {
		respond(undefined, 204);

		await makeParsioRequest(API_KEY, {
			method: 'POST',
			path: '/mailboxes/create',
			body: { name: 'Invoices' },
		});
		let sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(String(sent.init.body)).toBe(JSON.stringify({ name: 'Invoices' }));
		expect(sent.headers.get('content-type')).toContain('application/json');

		respond(undefined, 204);
		await makeParsioRequest(API_KEY, {
			method: 'DELETE',
			path: '/webhooks',
			body: { ids: ['wh_1'] },
		});
		sent = lastCall();
		expect(sent.init.method).toBe('DELETE');
		expect(String(sent.init.body)).toBe(JSON.stringify({ ids: ['wh_1'] }));
	});

	it('sends multipart form data when formData is set', async () => {
		respond(parsedDocument, 200);
		const blob = new Blob([Buffer.from('PDF')], {
			type: 'application/octet-stream',
		});

		await makeParsioRequest(API_KEY, {
			method: 'POST',
			path: '/mailboxes/mbx_1/upload-sync',
			formData: { file: blob, filename: 'receipt.pdf' },
		});

		const sent = lastCall();
		expect(sent.init.method).toBe('POST');
		// The multipart content-type with its boundary is set by fetch itself;
		// the mock sees the FormData object in the body slot.
		expect(sent.init.body).toBeInstanceOf(FormData);
		const form = sent.init.body as FormData;
		expect(form.get('filename')).toBe('receipt.pdf');
		// unknown: FormDataEntryValue is File | string in the DOM types, while
		// undici hands back the Blob that was appended.
		const file = form.get('file') as unknown as File;
		expect(file.size).toBe(3);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeParsioRequest(API_KEY, { method: 'GET', path: '/mailboxes' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Unauthorized');
		expect(error.name).toBe('ApiError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeParsioRequest(API_KEY, {
				method: 'POST',
				path: '/mailboxes/mbx_1/doc-sync',
				body: { text: 'Invoice from jane@example.com, total 42.00' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('jane@example.com');
		expect(error.message).not.toContain('jane@example.com');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makeParsioRequest(API_KEY, { method: 'GET', path: '/mailboxes' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ statusCode: 429, message: 'Slow down' }, 429, {
			'Retry-After': '0',
		});
		respond([parsedDocument], 200);

		const result = await makeParsioRequest(API_KEY, {
			method: 'GET',
			path: '/docs/DOC_ID',
		});
		expect(result).toEqual([parsedDocument]);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describeParsioError', () => {
	it('reads the documented { statusCode, message } envelope', () => {
		expect(
			describeParsioError(
				{ statusCode: 401, message: 'Unauthorized' },
				'fallback',
			),
		).toBe('Unauthorized');
	});

	it('falls back on anything else', () => {
		expect(describeParsioError(null, 'fallback')).toBe('fallback');
	});
});
