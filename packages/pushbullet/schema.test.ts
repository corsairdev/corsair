/**
 * Registry integrity, auth wiring, error policy and input validation.
 */
import { PushbulletAPIError } from './client';
import {
	PushbulletEndpointInputSchemas,
	PushbulletEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { pushbullet } from './index';
import { PushbulletSchema } from './schema';

const EXPECTED_OPERATION_COUNT = 15;

/** Builds the error shape makePushbulletRequest actually throws. */
function wrapped(status: number, message = 'failed', retryAfter?: number) {
	const error = new PushbulletAPIError(message, status);
	Object.assign(error, { status, retryAfter });
	return error as Error;
}

describe('registry', () => {
	it(`registers ${EXPECTED_OPERATION_COUNT} operations`, () => {
		expect(Object.keys(PushbulletEndpointInputSchemas)).toHaveLength(
			EXPECTED_OPERATION_COUNT,
		);
	});

	it('pairs every input schema with an output schema', () => {
		expect(Object.keys(PushbulletEndpointOutputSchemas).sort()).toEqual(
			Object.keys(PushbulletEndpointInputSchemas).sort(),
		);
	});

	it('exposes every operation through the nested tree', () => {
		const plugin = pushbullet({ key: 'o.test' });
		const groups: Record<string, Record<string, unknown>> = plugin.endpoints ??
		{};
		const ops = Object.values(groups).flatMap((g) => Object.keys(g));
		expect(ops).toHaveLength(EXPECTED_OPERATION_COUNT);
	});

	it('gives every operation a schema and metadata entry', () => {
		const plugin = pushbullet({ key: 'o.test' });
		const schemas = plugin.endpointSchemas as Record<string, unknown>;
		const meta = plugin.endpointMeta as Record<string, unknown>;
		const groups: Record<string, Record<string, unknown>> = plugin.endpoints ??
		{};
		for (const [group, ops] of Object.entries(groups)) {
			for (const op of Object.keys(ops)) {
				expect(schemas[`${group}.${op}`]).toBeDefined();
				expect(meta[`${group}.${op}`]).toBeDefined();
			}
		}
	});

	it('marks destructive deletes as destructive', () => {
		const plugin = pushbullet({ key: 'o.test' });
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(meta['pushes.deleteAll']?.riskLevel).toBe('destructive');
		expect(meta['pushes.list']?.riskLevel).toBe('read');
	});

	it('caches pushes and devices only', () => {
		expect(Object.keys(PushbulletSchema.entities).sort()).toEqual([
			'devices',
			'pushes',
		]);
	});
});

describe('auth', () => {
	it('defaults to api_key', () => {
		const plugin = pushbullet();
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.authConfig ?? {})).toEqual([
			'api_key',
			'oauth_2',
		]);
	});

	it('declares no webhooks', () => {
		const plugin = pushbullet();
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('prefers a configured key over stored credentials', async () => {
		const plugin = pushbullet({ key: 'explicit' });
		const ctx = { keys: { get_api_key: async () => 'stored' } } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'explicit',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = pushbullet();
		const ctx = { keys: { get_api_key: async () => 'stored' } } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe('stored');
	});

	it('raises when no key exists anywhere', async () => {
		const plugin = pushbullet();
		const ctx = { keys: { get_api_key: async () => null } } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
	});

	it('declares the OAuth2 scheme from the OSS page with no extra fields', () => {
		const authConfig = pushbullet().authConfig as Record<
			string,
			{ account: readonly string[] }
		>;
		const oauthScheme = authConfig.oauth_2;
		expect(oauthScheme).toBeDefined();
		expect(oauthScheme?.account).toEqual([]);
	});

	it('exposes the verified Pushbullet OAuth endpoints and no scopes', () => {
		// Contract with https://docs.pushbullet.com/#oauth — a typo in either
		// URL would break every OAuth connect at runtime.
		expect(pushbullet().oauthConfig).toMatchObject({
			providerName: 'Pushbullet',
			authUrl: 'https://www.pushbullet.com/authorize',
			tokenUrl: 'https://api.pushbullet.com/oauth2/token',
			scopes: [],
			requiresRegisteredRedirect: true,
		});
	});

	it('oauth_2 returns the stored access token without touching the api key', async () => {
		const plugin = pushbullet({ authType: 'oauth_2' });
		const ctx = {
			authType: 'oauth_2',
			keys: {
				get_access_token: async () => 'o.oauth-token',
				get_api_key: async () => {
					throw new Error('get_api_key must not be called');
				},
			},
		} as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'o.oauth-token',
		);
	});

	it('oauth_2 raises when no access token is stored', async () => {
		const plugin = pushbullet({ authType: 'oauth_2' });
		const ctx = {
			authType: 'oauth_2',
			keys: { get_access_token: async () => null },
		} as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow();
	});
});

describe('error policy', () => {
	it('matches a wrapped 429 by status, not message text', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'slow down')),
		).toBe(true);
	});

	it('never retries a 429 — the transport already retried it', async () => {
		// corsair/http retries 429 three times honoring Retry-After
		// (DEFAULT_RATE_LIMIT_CONFIG); plugin-level retries would both
		// amplify those attempts and replay unsafe writes.
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'slow down')),
		).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('never retries an auth failure', async () => {
		// The handler deliberately warns operators that the token is bad; that
		// warning is production behaviour, so it is silenced here rather than
		// printed into every test run.
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			expect(errorHandlers.AUTH_ERROR.match(wrapped(401))).toBe(true);
			expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
			expect(warn).toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});

	it('retries a 5xx but not a 404', () => {
		expect(errorHandlers.SERVER_ERROR.match(wrapped(503))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(wrapped(404))).toBe(false);
		expect(errorHandlers.NOT_FOUND_ERROR.match(wrapped(404))).toBe(true);
	});
});

describe('input validation', () => {
	it('rejects a link push with no url', () => {
		const r = PushbulletEndpointInputSchemas.pushesCreate.safeParse({
			type: 'link',
			title: 'no url',
		});
		expect(r.success).toBe(false);
	});

	it('accepts a link push with a url', () => {
		const r = PushbulletEndpointInputSchemas.pushesCreate.safeParse({
			type: 'link',
			url: 'https://example.test',
		});
		expect(r.success).toBe(true);
	});

	it('rejects a file push missing file_url', () => {
		const r = PushbulletEndpointInputSchemas.pushesCreate.safeParse({
			type: 'file',
			file_name: 'a.png',
		});
		expect(r.success).toBe(false);
	});

	it('rejects an unknown push type', () => {
		const r = PushbulletEndpointInputSchemas.pushesCreate.safeParse({
			type: 'sms',
		});
		expect(r.success).toBe(false);
	});

	it('caps list pagination at the Pushbullet maximum', () => {
		const r = PushbulletEndpointInputSchemas.pushesList.safeParse({
			limit: 900,
		});
		expect(r.success).toBe(false);
	});

	it('rejects a chat created with a malformed email', () => {
		const r = PushbulletEndpointInputSchemas.chatsCreate.safeParse({
			email: 'not-an-email',
		});
		expect(r.success).toBe(false);
	});
});

describe('upload reservation validation', () => {
	it('rejects a reservation whose upload_url is unusable', () => {
		// An empty upload_url would let the reservation "succeed" while the
		// caller cannot upload any bytes to it.
		const r = PushbulletEndpointOutputSchemas.filesUploadRequest.safeParse({
			file_name: 'a.png',
			file_type: 'image/png',
			upload_url: '',
			file_url: 'https://pushbullet.test/a.png',
		});
		expect(r.success).toBe(false);
	});

	it('rejects a reservation whose file_url is unusable', () => {
		const r = PushbulletEndpointOutputSchemas.filesUploadRequest.safeParse({
			file_name: 'a.png',
			file_type: 'image/png',
			upload_url: 'https://pushbullet.test/upload',
			file_url: 'not a url',
		});
		expect(r.success).toBe(false);
	});

	it('accepts a reservation with usable URLs', () => {
		const r = PushbulletEndpointOutputSchemas.filesUploadRequest.safeParse({
			file_name: 'a.png',
			file_type: 'image/png',
			upload_url: 'https://upload.pushbullet.test/s3',
			file_url: 'https://file.pushbullet.test/a.png',
		});
		expect(r.success).toBe(true);
	});
});

describe('retry safety for non-idempotent writes', () => {
	/** Builds the error shape the client throws, carrying the HTTP method. */
	function wrappedWithMethod(status: number, method: string) {
		const error = new PushbulletAPIError('server error', status);
		Object.assign(error, { status, method });
		return error as Error;
	}

	it('never replays a failed POST, which may already have been applied', async () => {
		// A 5xx does not mean Pushbullet rejected the request - it may have
		// created the push and then failed to respond. Replaying would duplicate.
		const result = await errorHandlers.SERVER_ERROR.handler(
			wrappedWithMethod(503, 'POST'),
		);
		expect(result.maxRetries).toBe(0);
	});

	it('retries a failed GET, which is idempotent', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler(
			wrappedWithMethod(503, 'GET'),
		);
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	it('retries a failed DELETE, which is idempotent', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler(
			wrappedWithMethod(500, 'DELETE'),
		);
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	it('never replays a rate-limited POST — the transport already retried it', async () => {
		// Same reasoning as the 5xx POST case, but for a 429: the request
		// escaped the transport after four attempts, so re-running the
		// endpoint here would only add more replays of an unsafe write.
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(wrappedWithMethod(429, 'POST')),
		).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('treats an unknown method as unsafe to replay', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler(
			wrapped(503, 'no method recorded'),
		);
		expect(result.maxRetries).toBe(0);
	});
});
