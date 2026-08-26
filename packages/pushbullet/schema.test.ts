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
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
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
});

describe('error policy', () => {
	it('matches a wrapped 429 by status, not message text', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(wrapped(429, 'slow down')),
		).toBe(true);
	});

	it('surfaces the provider Retry-After', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			wrapped(429, 'slow down', 15_000),
		);
		expect(result.headersRetryAfterMs).toBe(15_000);
	});

	it('never retries an auth failure', async () => {
		expect(errorHandlers.AUTH_ERROR.match(wrapped(401))).toBe(true);
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
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
