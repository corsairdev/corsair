import { CustomjsAPIError } from './client';

describe('CustomjsAPIError', () => {
	it('carries the status, method and replay flag it was given', () => {
		const error = new CustomjsAPIError('CustomJS 400: Bad body', {
			method: 'POST',
			replayable: false,
			status: 400,
			providerMessage: 'Bad body',
		});

		expect(error).toMatchObject({
			name: 'CustomjsAPIError',
			status: 400,
			method: 'POST',
			replayable: false,
			providerMessage: 'Bad body',
			isTransportError: false,
			isAuthError: false,
			isRateLimit: false,
		});
	});

	// The rate limit is a 403, the same status a bad key gets, so the body is the
	// only thing that separates them.
	it('reads an exhausted window as a rate limit, not an auth failure', () => {
		const error = new CustomjsAPIError('CustomJS 403: Too Many Requests', {
			method: 'POST',
			replayable: true,
			status: 403,
			providerMessage: 'Too Many Requests',
		});

		expect(error.isRateLimit).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('reads a 403 naming the key as an auth failure', () => {
		const error = new CustomjsAPIError('CustomJS 403: Api Key is invalid', {
			method: 'POST',
			replayable: true,
			status: 403,
			providerMessage: 'Api Key is invalid',
		});

		expect(error.isAuthError).toBe(true);
		expect(error.isRateLimit).toBe(false);
	});

	it('treats a 429 as a rate limit whatever the body says', () => {
		const error = new CustomjsAPIError('CustomJS 429: slow down', {
			method: 'POST',
			replayable: true,
			status: 429,
		});

		expect(error.isRateLimit).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	// A script that throws "rate limit exceeded" comes back as a 5xx. Reading that
	// as a rate limit would retry a call that must not be replayed.
	it('does not read rate-limit text on a 5xx as a rate limit', () => {
		const error = new CustomjsAPIError('CustomJS 500: rate limit exceeded', {
			method: 'POST',
			replayable: false,
			status: 500,
			providerMessage: 'rate limit exceeded',
		});

		expect(error.isRateLimit).toBe(false);
		expect(error.isAuthError).toBe(false);
	});

	it('treats a 401 as an auth failure', () => {
		const error = new CustomjsAPIError('CustomJS 401: Unauthorized', {
			method: 'GET',
			replayable: true,
			status: 401,
		});

		expect(error.isAuthError).toBe(true);
	});

	// A failure with no status never reached the provider, which is what makes a
	// replay of a read safe.
	it('marks a failure without a status as a transport error', () => {
		const error = new CustomjsAPIError('fetch failed', {
			method: 'POST',
			replayable: true,
		});

		expect(error.isTransportError).toBe(true);
		expect(error.status).toBeUndefined();
	});

	// The plugin never attaches the request body, so a key sent in one cannot leak
	// through inspect or JSON.stringify. `cause` is non-enumerable, so asserting
	// on JSON alone would prove nothing.
	it('keeps a cause out of the enumerable fields', () => {
		const cause = new Error('socket hang up');
		const error = new CustomjsAPIError('CustomJS request failed', {
			method: 'POST',
			replayable: true,
			cause,
		});

		expect(JSON.stringify(error)).not.toContain('socket hang up');
		expect(Object.keys(error)).not.toContain('cause');
		expect(error.cause).toBe(cause);
	});

	it('does not carry the request body, so a key in it cannot leak', () => {
		const error = new CustomjsAPIError('CustomJS 400: Bad body', {
			method: 'POST',
			replayable: false,
			status: 400,
		});

		expect(Object.keys(error)).not.toContain('body');
		expect(require('node:util').inspect(error)).not.toContain('x-api-key');
	});
});
