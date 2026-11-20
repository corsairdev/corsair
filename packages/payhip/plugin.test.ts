import { AuthMissingError } from 'corsair/core';
import type { InternalPayhipPlugin } from './index';
import { payhip, payhipAuthConfig, payhipEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: {
		authType: string;
		keys: { get_api_key: () => Promise<string | null> };
	},
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

const keyBuilderOf = (candidate: {
	// unknown: keyBuilder sits behind the plugin's optional type parameter, so
	// the test widens it to the shape it actually runs as.
	keyBuilder?: unknown;
}): KeyBuilder => candidate.keyBuilder as KeyBuilder;

function fixture(key?: string | null) {
	// unknown: the runtime key manager carries many more methods than the
	// fixture implements, so the object is widened through unknown.
	return {
		authType: 'api_key',
		key: undefined,
		keys: { get_api_key: () => Promise.resolve(key ?? null) },
		tenantId: 'default',
		// unknown: the runtime key manager carries many more methods than the
		// fixture implements, so the object is widened through unknown.
	} as unknown as Parameters<KeyBuilder>[0];
}

describe('payhip plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPayhipPlugin = payhip({});
		expect(instance.id).toBe('payhip');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 8 operations across 2 groups', () => {
		const groups = payhip({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['coupons', 3],
			['license', 5],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = payhip({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					payhipEndpointSchemas[key as keyof typeof payhipEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks writes and reads with the right risk level', () => {
		const meta = payhip({}).endpointMeta!;
		expect(meta['coupons.create']).toMatchObject({ riskLevel: 'write' });
		expect(meta['license.disable']).toMatchObject({ riskLevel: 'write' });
		expect(meta['license.verify']).toMatchObject({ riskLevel: 'read' });
		expect(meta['coupons.list']).toMatchObject({ riskLevel: 'read' });
	});

	it('stores the product secret beside the API key on the account', () => {
		expect(payhipAuthConfig.api_key.account).toEqual(['product_secret_key']);
	});

	it('registers no webhooks, because Payhip purchase webhooks have no documented signature scheme', () => {
		const instance: InternalPayhipPlugin = payhip({});
		expect(instance.webhooks).toEqual({});
	});
});

describe('payhip keyBuilder', () => {
	it('uses the inline key first', async () => {
		await expect(
			keyBuilderOf(payhip({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(payhip({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(payhip({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
