import {
	LOOPS_API_BASE,
	LoopsAPIError,
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

		expect(caught).toBeInstanceOf(LoopsAPIError);
		expect((caught as LoopsAPIError).message).toContain(
			'Email already exists',
		);
		expect((caught as LoopsAPIError).envelopeFailure).toBe(true);
	});

	it('parses message, path and transactionalId from an error body', async () => {
		queue(validationErrorResponse, 400);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'POST',
				path: '/v1/transactional',
				body: { email: 'alex@company.com', transactionalId: 'cll42l54f' },
			}),
		);

		expect(caught).toBeInstanceOf(LoopsAPIError);
		expect((caught as LoopsAPIError).message).toContain(
			'Missing required data variable(s): confirmationUrl',
		);
		expect((caught as LoopsAPIError).path).toBe('dataVariables');
		expect((caught as LoopsAPIError).transactionalId).toBe(
			'cll42l54f20i1la0lfooe3z12',
		);
	});

	it('keeps the status from a 401 and does not mark it as a disabled feature', async () => {
		queue(invalidKeyResponse, 401);

		const caught = await captureError(
			makeLoopsRequest('test-key', {
				method: 'GET',
				path: '/v1/api-key',
			}),
		);

		expect((caught as LoopsAPIError).status).toBe(401);
		expect((caught as LoopsAPIError).featureNotEnabled).toBe(false);
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

		expect((caught as LoopsAPIError).status).toBe(401);
		expect((caught as LoopsAPIError).featureNotEnabled).toBe(true);
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

		expect((caught as LoopsAPIError).canReplay).toBe(true);
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

		expect((caught as LoopsAPIError).transport).toBe(true);
		expect((caught as LoopsAPIError).canReplay).toBe(false);
	});

	it('drops the ApiError cause so the request it carries cannot leak the key', async () => {
		queue(invalidKeyResponse, 401);

		const caught = await captureError(
			makeLoopsRequest('secret-key-value', {
				method: 'GET',
				path: '/v1/api-key',
			}),
		);

		expect((caught as LoopsAPIError).message).not.toContain(
			'secret-key-value',
		);
		expect((caught as Error).cause).toBeUndefined();
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
});
