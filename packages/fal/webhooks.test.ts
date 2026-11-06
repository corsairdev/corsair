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
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	afterEach(() => {
		global.fetch = realFetch;
	});

	// The handler only reads ctx for logging, which is mocked.
	const ctx = { key: '' } as unknown as Parameters<typeof completed.handler>[0];

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

	it('answers 401 when the signature does not verify', async () => {
		const request = sign();
		const result = await completed.handler(ctx, {
			...request,
			rawBody: request.rawBody.replace('35683856', '1'),
			payload: completedBody as never,
		});
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('answers 401 when the JWKS cannot be loaded', async () => {
		fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
		const result = await completed.handler(ctx, {
			...sign(),
			payload: completedBody as never,
		});
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect((result as { error?: string }).error).toMatch('signing keys');
	});
});
