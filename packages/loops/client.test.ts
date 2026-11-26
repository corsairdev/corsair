import { ApiError } from 'corsair/http';
import {
	isFeatureNotEnabled,
	isReplayable,
	LOOPS_API_BASE,
	makeLoopsRequest,
} from './client';
import {
	apiKeyResponse,
	contactResponse,
	invalidKeyResponse,
	validationErrorResponse,
} from './test-fixtures';
import {
	captureError,
	currentFetch,
	installFetchMock,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// unknown: response bodies are arbitrary JSON, so each test states its own.
function queue(body: unknown, status = 200): void {
	currentFetch().mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

describe('Loops client', () => {
	it('targets app.loops.so/api', () => {
		expect(LOOPS_API_BASE).toBe('https://app.loops.so/api');
	});

	it('sends the key as a bearer header, never as a query param', async () => {
		queue(apiKeyResponse);

		await makeLoopsRequest('test-key', {
			method: 'GET',
			path: '/v1/api-key',
		});

		const [url, init] = currentFetch().mock.calls[0]!;
		expect(String(url)).toBe(`${LOOPS_API_BASE}/v1/api-key`);
		expect(new Headers(init!.headers).get('Authorization')).toBe(
			'Bearer test-key',
		);
		expect(String(url)).not.toContain('test-key');
	});

	it('returns a bare array body untouched', async () => {
		queue([contactResponse]);

		const raw = await makeLoopsRequest('test-key', {
			method: 'GET',
			path: '/v1/contacts/find',
			query: { email: 'alex@company.com' },
		});

		expect(raw).toEqual([contactResponse]);
	});

	it('treats a 2xx success:false envelope as a failure', async () => {
		queue({ success: false, message: 'Email already exists' });

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/contacts/create',
				body: { email: 'alex@company.com' },
			}),
		);

		expect(caught).toBeInstanceOf(ApiError);
		expect((caught as ApiError).message).toContain('Email already exists');
		expect((caught as ApiError).status).toBe(200);
	});

	it('keeps the message and the error body, and strips the request body', async () => {
		queue(validationErrorResponse, 400);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/transactional',
				body: { email: 'alex@company.com', transactionalId: 'cll42l54f' },
			}),
		);

		expect(caught).toBeInstanceOf(ApiError);
		const error = caught as ApiError;
		expect(error.message).toContain(
			'Missing required data variable(s): confirmationUrl',
		);
		expect(error.body).toMatchObject({
			error: { path: 'dataVariables' },
			transactionalId: 'cll42l54f20i1la0lfooe3z12',
		});
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error.request)).not.toContain('alex@company.com');
	});

	it('keeps the status from a 401 and does not mark it as a disabled feature', async () => {
		queue(invalidKeyResponse, 401);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'GET',
				path: '/v1/api-key',
			}),
		);

		expect((caught as ApiError).status).toBe(401);
		expect(isFeatureNotEnabled(caught as Error)).toBe(false);
	});

	it('flags a 401 that says the feature is off, so it reads differently from a bad key', async () => {
		queue(
			{
				success: false,
				message: 'Invalid API key or content API not enabled for this team',
			},
			401,
		);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'GET',
				path: '/v1/campaigns',
			}),
		);

		expect((caught as ApiError).status).toBe(401);
		expect(isFeatureNotEnabled(caught as Error)).toBe(true);
	});

	it('marks a request carrying an idempotency key as replay-safe', async () => {
		queue({ success: true });

		await makeLoopsRequest('test-key', {
			method: 'POST',
			path: '/v1/transactional',
			body: { email: 'alex@company.com', transactionalId: 'cll42l54f' },
			idempotencyKey: '0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
		});

		const [, init] = currentFetch().mock.calls[0]!;
		expect(new Headers(init!.headers).get('Idempotency-Key')).toBe(
			'0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
		);

		currentFetch().mockRejectedValueOnce(new TypeError('fetch failed'));
		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/transactional',
				body: { email: 'alex@company.com', transactionalId: 'cll42l54f' },
				idempotencyKey: '0e8e17e0-3e73-4c8b-b7c9-2a5a6d3f9c1d',
			}),
		);

		expect(isReplayable(caught as Error)).toBe(true);
	});

	it('marks a keyed POST as non-replayable when it carries no idempotency key', async () => {
		currentFetch().mockRejectedValueOnce(new TypeError('fetch failed'));

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/events/send',
				body: { eventName: 'signup', email: 'alex@company.com' },
			}),
		);

		expect(caught).toBeInstanceOf(TypeError);
		expect(isReplayable(caught as Error)).toBe(false);
	});

	it('keeps the key out of the error', async () => {
		queue(invalidKeyResponse, 401);

		const caught = await captureError(
			makeLoopsRequest('secret-key-value', {
				method: 'GET',
				path: '/v1/api-key',
			}),
		);

		expect(JSON.stringify(caught)).not.toContain('secret-key-value');
		expect((caught as ApiError).message).not.toContain('secret-key-value');
		expect((caught as ApiError).request.headers).toBeUndefined();
	});

	it('does not retry inside the client: rate limiting belongs to error-handlers.ts', async () => {
		const spy = currentFetch();
		spy.mockResolvedValue(
			new Response(JSON.stringify({ success: false, message: 'Rate limit' }), {
				status: 429,
			}),
		);

		await expect(
			makeLoopsRequest('test-key', { method: 'GET', path: '/v1/lists' }),
		).rejects.toMatchObject({ status: 429 });
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('cuts the idempotency key Loops quotes in a 409 out of the error', async () => {
		const key = 'receipt:alex@company.com';
		queue(
			{
				success: false,
				message: `Idempotency key ${key} has already been used`,
			},
			409,
		);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/transactional',
				body: { email: 'alex@company.com', transactionalId: 'cll42l54f' },
				idempotencyKey: key,
			}),
		);

		expect((caught as ApiError).status).toBe(409);
		expect(JSON.stringify(caught)).not.toContain(key);
		expect((caught as ApiError).message).not.toContain(key);
		expect((caught as ApiError).message).toContain('[idempotency key]');
	});
});
