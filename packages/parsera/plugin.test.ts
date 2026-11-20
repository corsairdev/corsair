import { AuthMissingError } from 'corsair/core';
import type { InternalParseraPlugin } from './index';
import { parsera, parseraEndpointSchemas } from './index';

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

describe('parsera plugin', () => {
	it('declares the plugin id and api_key auth', () => {
		const instance: InternalParseraPlugin = parsera({});
		expect(instance.id).toBe('parsera');
		expect(instance.options?.authType).toBe('api_key');
	});

	it('exposes 15 operations across 3 groups', () => {
		const groups = parsera({}).endpoints!;
		const totals = Object.entries(groups).map(
			([group, ops]) => [group, Object.keys(ops).length] as const,
		);
		expect(totals).toEqual([
			['extractor', 5],
			['agent', 7],
			['scrapers', 3],
		]);
	});

	it('registers a schema and meta for every operation', () => {
		const instance = parsera({});
		const meta = instance.endpointMeta!;
		for (const [group, ops] of Object.entries(instance.endpoints!)) {
			for (const op of Object.keys(ops)) {
				const key = `${group}.${op}`;
				expect(
					parseraEndpointSchemas[key as keyof typeof parseraEndpointSchemas],
				).toBeDefined();
				expect(meta[key as keyof typeof meta]).toBeDefined();
			}
		}
	});

	it('marks deletes destructive and extraction runs as writes', () => {
		const meta = parsera({}).endpointMeta!;
		for (const key of [
			'extractor.deleteScraper',
			'agent.deleteScraper',
		] as const) {
			expect(meta[key]).toMatchObject({
				riskLevel: 'destructive',
				irreversible: true,
			});
		}
		expect(meta['extractor.extract']).toMatchObject({ riskLevel: 'write' });
		expect(meta['scrapers.run']).toMatchObject({ riskLevel: 'write' });
		expect(meta['agent.getTask']).toMatchObject({ riskLevel: 'read' });
	});

	it('registers no webhooks, because Parsera only posts extraction results to the callback_url the caller sets per run', () => {
		const instance: InternalParseraPlugin = parsera({});
		expect(instance.webhooks).toEqual({});
		expect(instance.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});
});

describe('parsera keyBuilder', () => {
	it('uses the inline key first', async () => {
		await expect(
			keyBuilderOf(parsera({ key: 'inline-key' }))(
				fixture('stored-key'),
				'endpoint',
			),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(parsera({}))(fixture('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key exists', async () => {
		await expect(
			keyBuilderOf(parsera({}))(fixture(null), 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
