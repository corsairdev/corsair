import { AuthMissingError } from 'corsair/core';
import type { InternalPerigonPlugin } from './index';
import { perigon, perigonEndpointSchemas } from './index';

type KeyBuilder = (
	ctx: {
		authType: string;
		keys: { get_api_key: () => Promise<string | null> };
	},
	source: 'endpoint' | 'webhook',
) => string | Promise<string>;

const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
	// unknown: keyBuilder sits behind the plugin's optional type parameter, so
	// the test widens it to the shape it actually runs as.
	candidate.keyBuilder as KeyBuilder;

function fixture(key?: string | null) {
	// unknown: the runtime key manager carries many more methods than the
	// fixture implements, so the object is widened through unknown.
	return {
		authType: 'api_key',
		key: undefined,
		keys: { get_api_key: () => Promise.resolve(key ?? null) },
		tenantId: 'default',
	} as unknown as Parameters<KeyBuilder>[0];
}

describe('perigon plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalPerigonPlugin = perigon({});
		expect(instance.id).toBe('perigon');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 6 operations across 6 groups', () => {
		const groups = perigon({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['articles', 1],
			['stories', 1],
			['journalists', 1],
			['people', 1],
			['companies', 1],
			['limits', 1],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = perigon({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					perigonEndpointSchemas[key as keyof typeof perigonEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks every operation a read', () => {
		const meta = perigon({}).endpointMeta!;
		for (const key of [
			'articles.list',
			'stories.list',
			'journalists.list',
			'people.list',
			'companies.list',
			'limits.get',
		] as const) {
			expect(meta[key]).toMatchObject({ riskLevel: 'read' });
		}
	});

	it('registers no webhooks, because Perigon documents none for these routes', () => {
		const instance: InternalPerigonPlugin = perigon({});
		expect(instance.webhooks).toEqual({});
	});
});

describe('perigon keyBuilder', () => {
	it('uses the inline key first', async () => {
		await expect(
			keyBuilderOf(perigon({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(perigon({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(perigon({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
