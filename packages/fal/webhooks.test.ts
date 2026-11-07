import crypto from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { fal } from './index';
import {
	completedBody,
	createFalSigner,
	REQUEST_ID,
	USER_ID,
} from './test-fixtures';
import { completed } from './webhooks/requests';
import { matchFalTenantWebhook } from './webhooks/tenant-matcher';
import {
	FAL_JWKS_URL,
	falJsonDumps,
	fetchFalJwks,
	matchRequestCompleted,
	resetFalJwksCache,
	verifyFalWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const { jwks: JWKS, sign } = createFalSigner();
const NOW_MS = 1_793_994_415_000;
const NOW_S = NOW_MS / 1000;

describe('verifyFalWebhookSignature', () => {
	it('accepts a body signed by any key in the JWKS', async () => {
		await expect(
			verifyFalWebhookSignature(sign({ timestampSeconds: NOW_S }), {
				jwks: JWKS,
				now: NOW_MS,
			}),
		).resolves.toEqual({ valid: true });
	});

	it('accepts base64url keys too', async () => {
		const urlKeys = JWKS.map((k) => ({
			...k,
			x: k.x?.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
		}));
		await expect(
			verifyFalWebhookSignature(sign({ timestampSeconds: NOW_S }), {
				jwks: urlKeys,
				now: NOW_MS,
			}),
		).resolves.toEqual({ valid: true });
	});

	it('rejects a changed body', async () => {
		const request = sign({ timestampSeconds: NOW_S });
		const result = await verifyFalWebhookSignature(
			{ ...request, rawBody: request.rawBody.replace('35683856', '1') },
			{ jwks: JWKS, now: NOW_MS },
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid fal webhook signature',
		});
	});

	it('rejects a signature from a key fal does not publish', async () => {
		const stranger = crypto.generateKeyPairSync('ed25519');
		const result = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S, privateKey: stranger.privateKey }),
			{ jwks: JWKS, now: NOW_MS },
		);
		expect(result.valid).toBe(false);
	});

	it('rejects a timestamp more than 5 minutes away', async () => {
		const result = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S - 301 }),
			{ jwks: JWKS, now: NOW_MS },
		);
		expect(result.error).toMatch('5 minute window');
	});

	it('verifies a body that was parsed and re-serialised by JS', async () => {
		const request = sign({ timestampSeconds: NOW_S });
		await expect(
			verifyFalWebhookSignature(
				{ ...request, rawBody: JSON.stringify(request.body) },
				{ jwks: JWKS, now: NOW_MS },
			),
		).resolves.toEqual({ valid: true });
	});

	it('trusts a delivery Hub already verified', async () => {
		await expect(
			verifyFalWebhookSignature(
				{ headers: {}, rawBody: undefined, hubVerified: true },
				{ jwks: [], now: NOW_MS },
			),
		).resolves.toEqual({ valid: true });
	});

	it('rejects missing headers and a missing raw body', async () => {
		const request = sign({ timestampSeconds: NOW_S });
		const { 'x-fal-webhook-user-id': _userId, ...headers } = request.headers;
		expect(
			(
				await verifyFalWebhookSignature(
					{ ...request, headers },
					{ jwks: JWKS, now: NOW_MS },
				)
			).error,
		).toBe('Missing fal webhook signature headers');
		expect(
			(
				await verifyFalWebhookSignature(
					{ ...request, rawBody: undefined },
					{ jwks: JWKS, now: NOW_MS },
				)
			).error,
		).toBe('Missing raw body for fal signature verification');
	});
});

describe('fal key rotation', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
		resetFalJwksCache();
	});

	it('refetches the keys once when a cached set misses a new key', async () => {
		resetFalJwksCache();
		const { jwks: oldKeys } = createFalSigner();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ keys: oldKeys }),
			})
			.mockResolvedValueOnce({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;

		// Cache the old keys, then a delivery signed with the rotated key arrives
		// two minutes later.
		await fetchFalJwks(NOW_MS - 120_000);
		const result = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		expect(result).toEqual({ valid: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it.each([
		['an empty key list', { keys: [] }],
		['no keys field', {}],
		['keys that are not Ed25519', { keys: [{ kty: 'RSA', n: 'abc' }] }],
		[
			'an X25519 key (OKP with a 32-byte x too)',
			{
				keys: [
					{
						kty: 'OKP',
						crv: 'X25519',
						x: Buffer.alloc(32, 7).toString('base64'),
					},
				],
			},
		],
		[
			'a key without kty and crv',
			{ keys: [{ x: Buffer.alloc(32, 7).toString('base64') }] },
		],
	])('treats %s as a failed load and asks for a retry', async (_case, body) => {
		resetFalJwksCache();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => body })
			.mockResolvedValue({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;

		const first = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		expect(first).toMatchObject({ valid: false, retryable: true });
		expect((first as { error?: string }).error).toMatch('usable Ed25519 key');

		// Nothing was cached: after the minute, the keys load and it verifies.
		const later = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S + 61 }),
			{ now: NOW_MS + 61_000 },
		);
		expect(later).toEqual({ valid: true });
	});

	it('shares one fetch between deliveries that arrive together', async () => {
		resetFalJwksCache();
		const fetchMock = jest
			.fn()
			.mockResolvedValue({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;

		const results = await Promise.all(
			[1, 2, 3].map(() =>
				verifyFalWebhookSignature(sign({ timestampSeconds: NOW_S }), {
					now: NOW_MS,
				}),
			),
		);
		expect(results).toEqual([
			{ valid: true },
			{ valid: true },
			{ valid: true },
		]);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('waits a minute after a failed fetch before trying again', async () => {
		resetFalJwksCache();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({ ok: false, status: 503 })
			.mockResolvedValue({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;

		const first = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		const soon = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS + 30_000 },
		);
		expect(first).toMatchObject({ valid: false, retryable: true });
		expect(soon).toMatchObject({ valid: false, retryable: true });
		expect(fetchMock).toHaveBeenCalledTimes(1);

		const later = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S + 61 }),
			{ now: NOW_MS + 61_000 },
		);
		expect(later).toEqual({ valid: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('verifies with cached keys while a refresh is failing', async () => {
		resetFalJwksCache();
		let failRefresh: (value: unknown) => void = () => undefined;
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => ({ keys: JWKS }) })
			.mockReturnValueOnce(
				new Promise((resolve) => {
					failRefresh = resolve;
				}),
			);
		global.fetch = fetchMock as unknown as typeof fetch;
		await fetchFalJwks(NOW_MS - 120_000);

		// A forged delivery starts a refresh; a real one arrives meanwhile.
		const stranger = crypto.generateKeyPairSync('ed25519');
		const forged = verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S, privateKey: stranger.privateKey }),
			{ now: NOW_MS },
		);
		const real = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		failRefresh({ ok: false, status: 503 });

		expect(real).toEqual({ valid: true });
		expect(await forged).toMatchObject({ valid: false, retryable: true });
	});

	it('asks for a retry, not a refusal, for a rotated key after a failed refresh', async () => {
		resetFalJwksCache();
		const { jwks: oldKeys } = createFalSigner();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ keys: oldKeys }),
			})
			.mockResolvedValue({ ok: false, status: 503 });
		global.fetch = fetchMock as unknown as typeof fetch;
		await fetchFalJwks(NOW_MS - 120_000);

		const first = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		const duringCooldown = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S + 30 }),
			{ now: NOW_MS + 30_000 },
		);
		expect(first).toMatchObject({ valid: false, retryable: true });
		expect(duringCooldown).toMatchObject({ valid: false, retryable: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('does not refetch more than once a minute for bad signatures', async () => {
		resetFalJwksCache();
		const fetchMock = jest
			.fn()
			.mockResolvedValue({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;
		const stranger = crypto.generateKeyPairSync('ed25519');
		const forged = sign({
			timestampSeconds: NOW_S,
			privateKey: stranger.privateKey,
		});

		await verifyFalWebhookSignature(forged, { now: NOW_MS });
		await verifyFalWebhookSignature(forged, { now: NOW_MS + 10_000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('asks for a retry when fal rotates within a minute of a load', async () => {
		resetFalJwksCache();
		const { jwks: oldKeys } = createFalSigner();
		const fetchMock = jest
			.fn()
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ keys: oldKeys }),
			})
			.mockResolvedValue({ ok: true, json: async () => ({ keys: JWKS }) });
		global.fetch = fetchMock as unknown as typeof fetch;
		await fetchFalJwks(NOW_MS - 30_000);

		// Signed with the rotated key 30 s after the load: no refetch allowed yet.
		const soon = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S }),
			{ now: NOW_MS },
		);
		expect(soon).toMatchObject({ valid: false, retryable: true });
		expect(fetchMock).toHaveBeenCalledTimes(1);

		// fal's retry after the minute refetches and verifies.
		const retried = await verifyFalWebhookSignature(
			sign({ timestampSeconds: NOW_S + 40 }),
			{ now: NOW_MS + 40_000 },
		);
		expect(retried).toEqual({ valid: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('falJsonDumps', () => {
	it('writes JSON the way fal (Python json.dumps, sorted keys) does', () => {
		expect(falJsonDumps(completedBody)).toBe(sign().rawBody);
		expect(
			falJsonDumps({ z: [1, 2.5, true, null], a: { prompt: 'café 🌅' } }),
		).toBe(
			'{"a": {"prompt": "caf\\u00e9 \\ud83c\\udf05"}, "z": [1, 2.5, true, null]}',
		);
		expect(falJsonDumps({})).toBe('{}');
	});

	it('gives up on integers JS cannot hold exactly', () => {
		expect(falJsonDumps({ seed: 196619188014358660 })).toBeNull();
	});
});

describe('requests.completed', () => {
	const realFetch = global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		resetFalJwksCache();
		mockLog.mockClear();
		fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ keys: JWKS }),
		});
		// unknown: a jest mock standing in for fetch.
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	afterEach(() => {
		global.fetch = realFetch;
	});

	// The handler only reads ctx for logging, which is mocked.
	// unknown: the handler reads ctx only for logging (mocked) and keys.
	const ctx = { key: '' } as unknown as Parameters<typeof completed.handler>[0];
	const withUserId = (userId: string) =>
		// unknown: a context whose key manager stores a fal user id for the account.
		({
			key: '',
			keys: { get_user_id: async () => userId },
		}) as unknown as Parameters<typeof completed.handler>[0];

	it('matches fal webhooks only', () => {
		const request = sign();
		expect(matchRequestCompleted(request)).toBe(true);
		expect(fal().pluginWebhookMatcher?.(request)).toBe(true);
		expect(matchRequestCompleted({ headers: {}, body: request.body })).toBe(
			false,
		);
		expect(
			matchRequestCompleted({ headers: request.headers, body: { hello: 1 } }),
		).toBe(false);
	});

	it('routes to the tenant by fal user id', () => {
		expect(matchFalTenantWebhook(sign())).toEqual({
			linkType: 'user_id',
			externalId: USER_ID,
		});
		expect(matchFalTenantWebhook({ headers: {}, body: {} })).toBeNull();
	});

	it('verifies against the fetched JWKS and returns the event', async () => {
		const request = sign();
		const result = await completed.handler(ctx, {
			...request,
			payload: completedBody as never,
		});
		expect(fetchMock).toHaveBeenCalledWith(FAL_JWKS_URL, expect.anything());
		expect(result).toEqual({ success: true, data: completedBody });
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'fal.webhook.requests.completed',
			{ requestId: REQUEST_ID, status: 'OK' },
			'completed',
		);

		// The key set is cached: a second webhook does not fetch it again.
		await completed.handler(ctx, {
			...request,
			payload: completedBody as never,
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('answers 401 when the signature does not verify against keys just refetched', async () => {
		// Keys loaded two minutes ago: the miss may refetch, and still fails.
		await fetchFalJwks(Date.now() - 120_000);
		const request = sign();
		const result = await completed.handler(ctx, {
			...request,
			rawBody: request.rawBody.replace('35683856', '1'),
			payload: completedBody as never,
		});
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('throws when the JWKS cannot be loaded, so fal delivers again', async () => {
		fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
		await expect(
			completed.handler(ctx, { ...sign(), payload: completedBody as never }),
		).rejects.toThrow("Could not load fal's signing keys");
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('accepts a delivery for the fal user stored on the account', async () => {
		const result = await completed.handler(withUserId(USER_ID), {
			...sign(),
			payload: completedBody as never,
		});
		expect(result).toEqual({ success: true, data: completedBody });
	});

	it.each([
		['no stored id (null)', async () => null],
		['no stored id (undefined)', async () => undefined],
		['an empty stored id', async () => ''],
		[
			'an account without stored keys (getter throws)',
			async () => {
				throw new Error('No DEK found for account');
			},
		],
	])('accepts a delivery when the account has %s', async (_case, getUserId) => {
		// unknown: a context whose key manager answers get_user_id as given.
		const context = {
			key: '',
			keys: { get_user_id: getUserId },
		} as unknown as Parameters<typeof completed.handler>[0];
		const result = await completed.handler(context, {
			...sign(),
			payload: completedBody as never,
		});
		expect(result).toEqual({ success: true, data: completedBody });
	});

	it('refuses a delivery made for a different fal account', async () => {
		const result = await completed.handler(withUserId('github|someone-else'), {
			...sign(),
			payload: completedBody as never,
		});
		expect(result).toMatchObject({ success: false, statusCode: 403 });
		expect(mockLog).not.toHaveBeenCalled();
	});
});
