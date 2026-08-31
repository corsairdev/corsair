/**
 * Client coverage: auth header wiring, body/query transport rules, error
 * wrapping and `tryGetStoredKey` behaviour. `request` is mocked at the
 * `corsair/http` boundary so the tests run with no network access.
 */
const requestMock = jest.fn();

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: unknown[]) => requestMock(...args),
}));

import { ApiError } from 'corsair/http';
import { z } from 'zod';
import {
	makePushbulletRequest,
	PUSHBULLET_API_BASE,
	PushbulletAPIError,
	tryGetStoredKey,
} from './client';

type Config = { BASE: string; TOKEN?: string; HEADERS: Record<string, string> };
type Opts = {
	method: string;
	url: string;
	body?: Record<string, unknown>;
	query?: Record<string, unknown>;
	mediaType?: string;
};

function lastCall(): { config: Config; opts: Opts } {
	const calls = requestMock.mock.calls;
	const [config, opts] = calls[calls.length - 1];
	return { config, opts };
}

function makeApiError(status: number, body: unknown, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: 'pushes', mediaType: undefined },
		{
			url: 'https://api.pushbullet.com/v2/pushes',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		'transport failure',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue({ iden: 'ujx1' });
});

describe('auth and config', () => {
	it('sends the token as Access-Token, not as a bearer TOKEN', async () => {
		await makePushbulletRequest('users/me', 'o.secret');

		const { config, opts } = lastCall();
		expect(config.BASE).toBe(PUSHBULLET_API_BASE);
		expect(config.HEADERS['Access-Token']).toBe('o.secret');
		// Pushbullet does not accept bearer auth; TOKEN must stay unset.
		expect(config.TOKEN).toBeUndefined();
		expect(opts.url).toBe('users/me');
	});

	it('defaults to GET and does not send a body', async () => {
		await makePushbulletRequest('pushes', 'o.secret', {
			query: { limit: 10 },
		});

		const { opts } = lastCall();
		expect(opts.method).toBe('GET');
		expect(opts.body).toBeUndefined();
		expect(opts.mediaType).toBeUndefined();
		expect(opts.query).toEqual({ limit: 10 });
	});

	it('sends a JSON body only for POST', async () => {
		await makePushbulletRequest('pushes', 'o.secret', {
			method: 'POST',
			body: { type: 'note', body: 'hi' },
		});

		const { opts } = lastCall();
		expect(opts.method).toBe('POST');
		expect(opts.body).toEqual({ type: 'note', body: 'hi' });
		expect(opts.mediaType).toBe('application/json');
	});
});

describe('response handling', () => {
	it('returns the parsed response as-is', async () => {
		await expect(
			makePushbulletRequest('pushes/ujx1', 'o.secret'),
		).resolves.toEqual({ iden: 'ujx1' });
	});

	it('validates the response through the output schema', async () => {
		requestMock.mockResolvedValue({ iden: 'ujx1', extra: 'kept' });
		const result = await makePushbulletRequest('pushes/ujx1', 'o.secret', {
			schema: z.object({ iden: z.string() }).loose(),
		});
		expect(result).toEqual({ iden: 'ujx1', extra: 'kept' });

		requestMock.mockResolvedValue({ missing: true });
		await expect(
			makePushbulletRequest('pushes/ujx1', 'o.secret', {
				schema: z.object({ iden: z.string() }).loose(),
			}),
		).rejects.toThrow();
	});
});

describe('error wrapping', () => {
	it('surfaces the structured Pushbullet error message and metadata', async () => {
		requestMock.mockRejectedValue(
			makeApiError(429, { error: { message: 'quota exceeded' } }, 1200),
		);

		await expect(
			makePushbulletRequest('pushes', 'o.secret', { method: 'POST' }),
		).rejects.toMatchObject({
			name: 'PushbulletAPIError',
			message: 'quota exceeded',
			status: 429,
			retryAfter: 1200,
			method: 'POST',
		});
	});

	it('falls back to the transport message when no structured body exists', async () => {
		requestMock.mockRejectedValue(makeApiError(500, {}));

		await expect(
			makePushbulletRequest('pushes', 'o.secret'),
		).rejects.toMatchObject({
			name: 'PushbulletAPIError',
			message: 'transport failure',
			status: 500,
		});
	});

	it('wraps non-Error throwables as PushbulletAPIError', async () => {
		requestMock.mockRejectedValue('network string failure');

		await expect(
			makePushbulletRequest('pushes', 'o.secret'),
		).rejects.toMatchObject({
			name: 'PushbulletAPIError',
			message: 'Unknown error',
		});
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored key', async () => {
		await expect(tryGetStoredKey(async () => 'o.secret')).resolves.toBe(
			'o.secret',
		);
	});

	it('maps null/undefined to undefined without throwing', async () => {
		await expect(tryGetStoredKey(async () => null)).resolves.toBeUndefined();
		await expect(
			tryGetStoredKey(async () => undefined),
		).resolves.toBeUndefined();
	});

	it('treats a missing DEK as "no stored key", not an error', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('No DEK found for account');
			}),
		).resolves.toBeUndefined();
	});

	it('rethrows any other key-manager failure', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('keychain locked');
			}),
		).rejects.toThrow('keychain locked');
	});
});

describe('PushbulletAPIError construction', () => {
	it('keeps fields undefined when the cause is not an ApiError', () => {
		const error = new PushbulletAPIError('boom', 500, {
			cause: new Error('plain'),
		});
		expect(error.status).toBeUndefined();
		expect(error.retryAfter).toBeUndefined();
		expect(error.method).toBeUndefined();
	});
});
