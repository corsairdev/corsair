import { AuthMissingError } from 'corsair/core';
import type { KlaviyoKeyBuilderContext } from './index';
import { KlaviyoAPIError, klaviyo } from './index';

const OPERATIONS = [
	'events.create',
	'events.get',
	'events.list',
	'lists.addProfiles',
	'lists.create',
	'lists.get',
	'lists.list',
	'lists.profiles',
	'lists.remove',
	'lists.removeProfiles',
	'lists.update',
	'metrics.aggregate',
	'metrics.get',
	'metrics.list',
	'profiles.create',
	'profiles.get',
	'profiles.list',
	'profiles.subscribe',
	'profiles.update',
	'segments.create',
	'segments.get',
	'segments.list',
	'segments.profiles',
	'segments.remove',
	'segments.update',
	'tagGroups.create',
	'tagGroups.list',
	'tagGroups.remove',
	'tags.create',
	'tags.get',
	'tags.list',
	'tags.remove',
	'tags.update',
	'webhookTopics.list',
	'webhooks.create',
	'webhooks.get',
	'webhooks.list',
	'webhooks.remove',
	'webhooks.update',
] as const;

// unknown: a schema pair is a zod schema, and the assertions only check that one
// is present, never parse through it.
type SchemaPair = { input?: unknown; output?: unknown };
type SchemaView = Record<string, SchemaPair>;
type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
};
type MetaView = Record<string, EndpointMeta>;
type EndpointsView = Record<string, Record<string, unknown>>; // unknown: leaves are functions of differing types.
type KeyBuilder = (
	ctx: KlaviyoKeyBuilderContext,
	source: string,
) => Promise<string>;

const INLINE_KEY = 'pk_inline';

/** Reads a field that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined)
		throw new Error(`Expected "${key}" to be registered`);
	return value;
}

function flatten(endpoints: EndpointsView): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

// A fixture cannot be typed as KeyBuilderContext directly: `keys` must be a full
// AccountKeyManager. Only get_api_key is read here.
function keyContext(stored: string | undefined) {
	return {
		authType: 'api_key',
		keys: { get_api_key: async () => stored },
		// unknown: a partial AccountKeyManager, which the runtime never builds.
	} as unknown as KlaviyoKeyBuilderContext;
}

describe('klaviyo plugin', () => {
	const plugin = klaviyo();
	const endpoints = plugin.endpoints as EndpointsView;
	const meta = plugin.endpointMeta as unknown as MetaView; // unknown: widening a readonly const map.
	const schemas = plugin.endpointSchemas as unknown as SchemaView; // unknown: see meta.
	// keyBuilder is optional on the plugin type; it is always supplied here.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		// unknown: optional on the plugin type.
		candidate.keyBuilder as KeyBuilder; // unknown: optional on the plugin type.

	it('has the id the constants file registers', () => {
		expect(plugin.id).toBe('klaviyo');
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers every operation in the chosen surface', () => {
		expect(flatten(endpoints)).toEqual([...OPERATIONS]);
	});

	it('marks every delete destructive and irreversible', () => {
		for (const operation of [
			'lists.remove',
			'lists.removeProfiles',
			'segments.remove',
			'webhooks.remove',
			'tags.remove',
			'tagGroups.remove',
		] as const) {
			expect(meta[operation]?.riskLevel).toBe('destructive');
			expect(meta[operation]?.irreversible).toBe(true);
		}
	});

	it('declares reads as read and creates as write', () => {
		expect(meta['profiles.list']?.riskLevel).toBe('read');
		expect(meta['events.create']?.riskLevel).toBe('write');
		expect(meta['profiles.subscribe']?.riskLevel).toBe('write');
		expect(meta['metrics.aggregate']?.riskLevel).toBe('read');
	});

	it('documents every operation', () => {
		for (const [operation, entry] of Object.entries(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
			expect(operation).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('supplies an input and an output schema for every operation', () => {
		expect(Object.keys(schemas).sort()).toEqual(Object.keys(meta).sort());
		for (const operation of OPERATIONS) {
			const pair = required(schemas, operation);
			expect(pair.input).toBeDefined();
			expect(pair.output).toBeDefined();
		}
	});

	it('exposes no inbound webhook route', () => {
		expect(plugin.webhooks).toEqual({});
		const matcher = plugin.pluginWebhookMatcher;
		expect(matcher).toBeDefined();
		expect(matcher?.({} as never)).toBe(false);
	});

	it('registers an error handler map with DEFAULT last', () => {
		const handlers = plugin.errorHandlers as Record<string, unknown>; // unknown: key order is all this reads.
		expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
	});

	describe('keyBuilder', () => {
		it('prefers the inline key over the stored one', async () => {
			const configured = klaviyo({ key: INLINE_KEY });
			await expect(
				keyBuilderOf(configured)(keyContext('stored'), 'endpoint'),
			).resolves.toBe(INLINE_KEY);
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored'), 'endpoint'),
			).resolves.toBe('stored');
		});

		it('throws AuthMissingError when neither exists', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});

describe('exports', () => {
	it('exports the error class so callers can narrow a failure', () => {
		expect(KlaviyoAPIError.prototype).toBeInstanceOf(Error);
	});
});
