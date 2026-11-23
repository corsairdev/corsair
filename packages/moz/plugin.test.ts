import { AuthMissingError } from 'corsair/core';
import type { MozKeyBuilderContext } from './index';
import { moz, mozEndpointSchemas } from './index';
import { MozSchema } from './schema';

const operations = [
	'quota.lookup',
	'locales.list',
	'metrics.fetch',
	'metrics.fetchMultiple',
	'links.list',
	'links.intersect',
	'linkingDomains.list',
	'anchorText.list',
	'topPages.list',
	'competitors.fetch',
	'jobs.lookup',
];

type KeyBuilder = (
	ctx: MozKeyBuilderContext,
	source: string,
) => Promise<string>;

// A fixture cannot be typed as KeyBuilderContext directly: keys must be a
// full AccountKeyManager, and this test only implements get_api_key.
function keyContext(storedKey: string | null) {
	return {
		authType: 'api_key',
		keys: { get_api_key: jest.fn().mockResolvedValue(storedKey) },
	} as unknown as MozKeyBuilderContext;
}

describe('moz plugin', () => {
	const plugin = moz();
	// unknown: a plugin config under test only carries keyBuilder; the real
	// shape is Corsair's internal plugin record.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	it('registers the id and api_key auth', () => {
		expect(plugin.id).toBe('moz');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('lists exactly the documented operations', () => {
		const listed = Object.keys(plugin.endpointMeta ?? {}).sort();
		expect(listed).toEqual(operations.sort());
	});

	it('covers every operation with input and output schemas', () => {
		expect(Object.keys(mozEndpointSchemas).sort()).toEqual(operations.sort());
		for (const schemas of Object.values(mozEndpointSchemas)) {
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
		}
	});

	it('marks every operation read; nothing in this API writes', () => {
		for (const [op, meta] of Object.entries(plugin.endpointMeta ?? {})) {
			expect(meta.riskLevel).toBe('read');
			if (op !== 'competitors.fetch') {
				expect(meta.job).toBeUndefined();
			}
		}
	});

	it('declares the competitor job reading jobs.lookup', () => {
		const job = plugin.endpointMeta?.['competitors.fetch']?.job;
		expect(job).toMatchObject({
			idPath: 'async_call.id',
			status: {
				op: 'jobs.lookup',
				idArg: 'id',
				statusPath: 'async_call.status',
				done: ['complete'],
				failed: [],
			},
		});
	});

	it('prefers the inline key over the stored key', async () => {
		const configured = moz({ key: 'option-key' });
		await expect(
			keyBuilderOf(configured)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('option-key');
	});

	it('falls back to the stored key', async () => {
		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(
			keyBuilderOf(plugin)(keyContext(null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('exposes the schema version and no entities', () => {
		expect(MozSchema.version).toBe('1.0.0');
		expect(Array.isArray(MozSchema.entities)).toBe(false);
	});
});
