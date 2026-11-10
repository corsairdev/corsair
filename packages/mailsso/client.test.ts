import { inspect } from 'node:util';
import {
	MAILSSO_API_BASE,
	MailssoAPIError,
	MailssoSubscriptionRequiredError,
	makeMailssoRequest,
	readJobInProgress,
	segment,
} from './client';
import {
	batchCreatedFixture,
	batchProcessingFixture,
	batchTooSmallBody,
	singleRiskyFixture,
	subscriptionRequiredBody,
	unauthorizedBody,
} from './test-fixtures';
import type { JsonValue } from './test-helpers';
import { API_KEY, captureError, jsonResponse } from './test-helpers';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
	};
}

describe('makeMailssoRequest', () => {
	it('targets api.mails.so', () => {
		expect(MAILSSO_API_BASE).toBe('https://api.mails.so');
	});

	it('sends the key in x-mails-api-key and as no other credential', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

		await makeMailssoRequest(API_KEY, {
			method: 'GET',
			path: '/v1/validate',
			query: { email: 'hello@mails.so' },
		});

		const call = lastCall();
		expect(call.headers.get('x-mails-api-key')).toBe(API_KEY);
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.headers.get('accept')).toBe('application/json');
		expect(call.url).not.toContain(API_KEY);
		expect(call.parsed.searchParams.has('key')).toBe(false);
		expect(call.parsed.searchParams.has('api_key')).toBe(false);
	});

	it('sends a GET with no body and a POST with a JSON body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));
		await makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' });
		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().init.body).toBeUndefined();

		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));
		await makeMailssoRequest(API_KEY, {
			method: 'POST',
			path: '/v1/batch',
			body: { emails: ['a@example.com', 'b@example.com'] },
		});
		const post = lastCall();
		expect(post.init.method).toBe('POST');
		expect(post.headers.get('content-type')).toContain('application/json');
		expect(JSON.parse(String(post.init.body))).toEqual({
			emails: ['a@example.com', 'b@example.com'],
		});
	});

	it('returns the body untouched, enveloped or bare', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));
		const enveloped = await makeMailssoRequest(API_KEY, {
			method: 'GET',
			path: '/v1/validate',
		});
		expect(enveloped).toEqual(singleRiskyFixture);

		fetchMock.mockResolvedValueOnce(jsonResponse(batchCreatedFixture));
		const bare = await makeMailssoRequest(API_KEY, {
			method: 'POST',
			path: '/v1/batch',
			body: { emails: ['a@example.com', 'b@example.com'] },
		});
		expect(bare).toEqual(batchCreatedFixture);
	});

	it('reads the message from the error field of a 401', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(unauthorizedBody, 401));

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({
			message: 'Unauthorized',
			status: 401,
			method: 'GET',
			transport: false,
		});
		expect(caught).not.toBeInstanceOf(MailssoSubscriptionRequiredError);
	});

	it('reads error_code from a batch error', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchTooSmallBody, 400));

		const caught = await captureError(
			makeMailssoRequest(API_KEY, {
				method: 'POST',
				path: '/v1/batch',
				body: { emails: ['a@example.com', 'a@example.com'] },
			}),
		);

		expect(caught).toMatchObject({
			status: 400,
			code: 'BATCH_TOO_SMALL',
			method: 'POST',
		});
	});

	it('tells the paid-plan error from a bad key by its message, not its 401', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(subscriptionRequiredBody, 401),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, {
				method: 'POST',
				path: '/v1/batch',
				body: { emails: ['a@example.com', 'b@example.com'] },
			}),
		);

		expect(caught).toBeInstanceOf(MailssoSubscriptionRequiredError);
		expect(caught).toMatchObject({
			name: 'MailssoSubscriptionRequiredError',
			status: 401,
		});
	});

	it('also recognises the paid-plan message on another status', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(subscriptionRequiredBody, 403),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'POST', path: '/v1/batch' }),
		);

		expect(caught).toBeInstanceOf(MailssoSubscriptionRequiredError);
	});

	it('fails a 200 whose body carries an error, keeping its code', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ data: null, error: 'Quota used.', error_code: 'QUOTA' }),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({
			message: 'Quota used.',
			status: 200,
			code: 'QUOTA',
			method: 'GET',
		});
	});

	it('returns a running job as it came when the read allows in-progress', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchProcessingFixture, 202));

		await expect(
			makeMailssoRequest(API_KEY, {
				method: 'GET',
				path: `/v1/batch/${batchProcessingFixture.data.id}`,
				allowInProgress: true,
			}),
		).resolves.toEqual(batchProcessingFixture);
	});

	it('fails the progress note on any request that did not allow it', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(batchProcessingFixture, 202));

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(caught).toMatchObject({
			message: 'Job is still processing',
			status: 200,
		});
	});

	it('fails an error that only resembles the progress note', async () => {
		const bodies: JsonValue[] = [
			{ data: null, error: 'Job is still processing' },
			{ data: { status: 'processing' }, error: 'Job is still processing' },
			{ data: { id: 'x', status: 'failed' }, error: 'Job failed' },
		];
		for (const body of bodies) {
			fetchMock.mockResolvedValueOnce(jsonResponse(body, 202));
			const caught = await captureError(
				makeMailssoRequest(API_KEY, {
					method: 'GET',
					path: '/v1/batch/x',
					allowInProgress: true,
				}),
			);
			expect(caught).toBeInstanceOf(MailssoAPIError);
		}
	});

	it('reads the job out of the progress note, and nothing else', () => {
		expect(readJobInProgress(batchProcessingFixture)).toEqual(
			batchProcessingFixture.data,
		);
		expect(readJobInProgress(batchCreatedFixture)).toBeUndefined();
		expect(readJobInProgress(null)).toBeUndefined();
		expect(
			readJobInProgress({ data: { id: 'x', status: 'completed' } }),
		).toBeUndefined();
	});

	it('does not fail a 200 whose error is null', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(singleRiskyFixture));

		await expect(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		).resolves.toEqual(singleRiskyFixture);
	});

	it('describes a non-JSON 502 by its status', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<html>Bad gateway</html>', {
				status: 502,
				headers: { 'Content-Type': 'text/html' },
			}),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({ status: 502 });
		expect((caught as MailssoAPIError).message).toContain('502');
	});

	it('makes one attempt on a 429 and reads Retry-After into the error', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ data: null, error: 'Slow down' }, 429, {
				'Retry-After': '4',
			}),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(caught).toMatchObject({
			status: 429,
			retryAfter: 4000,
			message: 'Slow down',
		});
		expect((caught as MailssoAPIError).isRateLimit).toBe(true);
	});

	it('leaves retryAfter unset when a 429 has no header', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({ data: null, error: 'Slow down' }, 429),
		);

		const caught = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect((caught as MailssoAPIError).retryAfter).toBeUndefined();
	});

	it('flags a dropped connection as a transport failure and keeps the cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const caught = await captureError(
			makeMailssoRequest(API_KEY, {
				method: 'POST',
				path: '/v1/batch',
				body: { emails: ['a@example.com', 'b@example.com'] },
			}),
		);

		expect(caught).toBeInstanceOf(MailssoAPIError);
		expect(caught).toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
		expect((caught as MailssoAPIError).status).toBeUndefined();
		expect((caught as MailssoAPIError).cause).toBeInstanceOf(TypeError);
	});

	it('never prints the key through the message or util.inspect', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(unauthorizedBody, 401));
		const rejected = await captureError(
			makeMailssoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/validate',
				query: { email: 'hello@mails.so' },
			}),
		);
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const dropped = await captureError(
			makeMailssoRequest(API_KEY, { method: 'GET', path: '/v1/validate' }),
		);

		for (const caught of [rejected, dropped]) {
			expect((caught as MailssoAPIError).message).not.toContain(API_KEY);
			expect(inspect(caught, { depth: 6 })).not.toContain(API_KEY);
			expect(JSON.stringify(caught)).not.toContain(API_KEY);
		}
	});
});

describe('segment', () => {
	it('encodes characters that would change the path', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(42)).toBe('42');
	});
});
