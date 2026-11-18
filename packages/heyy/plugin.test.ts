import { AuthMissingError } from 'corsair/core';
import type { HeyyKeyBuilderContext } from './index';
import { HeyyAPIError, heyy } from './index';

const OPERATIONS = [
	'apiWebhooks.create',
	'apiWebhooks.remove',
	'apiWebhooks.search',
	'apiWebhooks.update',
	'attributes.create',
	'attributes.remove',
	'attributes.search',
	'automations.search',
	'channels.search',
	'contacts.create',
	'contacts.search',
	'labels.create',
	'labels.remove',
	'labels.search',
	'messageTemplates.search',
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
	ctx: HeyyKeyBuilderContext,
	source: string,
) => Promise<string>;

const INLINE_KEY = 'inline-key';

/** Reads a field that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

function flatten(endpoints: EndpointsView): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

// A fixture cannot be typed as KeyBuilderContext directly: `keys` must be a
// full AccountKeyManager. Only get_api_key is read here.
function keyContext(stored: string | undefined) {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => stored,
		},
		// unknown: a partial AccountKeyManager, which the runtime never builds.
	} as unknown as HeyyKeyBuilderContext;
}

describe('heyy plugin', () => {
	const plugin = heyy();
	const endpoints = plugin.endpoints as EndpointsView;
	const meta = plugin.endpointMeta as unknown as MetaView; // unknown: widening a readonly const map.
	const schemas = plugin.endpointSchemas as unknown as SchemaView; // unknown: see meta.
	// keyBuilder is optional on the plugin type; it is always supplied here.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		// unknown: optional on the plugin type.
		candidate.keyBuilder as KeyBuilder; // unknown: optional on the plugin type.

	it('says attributes.remove fails on an unknown id instead of listing it', () => {
		// Live run 11-11: only the attribute delete answers 404 for a missing id.
		expect(meta['attributes.remove']?.description).toMatch(/404/);
	});

	it('has the id the constants file registers', () => {
		expect(plugin.id).toBe('heyy');
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers the operations the board lists', () => {
		expect(flatten(endpoints)).toEqual([...OPERATIONS]);
	});

	it('names only the channel types the v3 spec has', () => {
		// openapi-v3.json: whatsapp, instagram, sms, messenger, live_chat. No email.
		expect(meta['channels.search']?.description).not.toMatch(/email/i);
		expect(meta['channels.search']?.description).toMatch(/Messenger/);
	});

	it('declares the risk each operation really carries', () => {
		expect(meta['contacts.search']?.riskLevel).toBe('read');
		expect(meta['contacts.create']?.riskLevel).toBe('write');
		expect(meta['labels.create']?.riskLevel).toBe('write');
		expect(meta['labels.search']?.riskLevel).toBe('read');
		expect(meta['apiWebhooks.update']?.riskLevel).toBe('write');

		// A delete cannot be undone by another call.
		for (const operation of [
			'attributes.remove',
			'labels.remove',
			'apiWebhooks.remove',
		] as const) {
			expect(meta[operation]?.riskLevel).toBe('destructive');
			expect(meta[operation]?.irreversible).toBe(true);
		}
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

	it('exposes no webhook route, because Heyy signs nothing', () => {
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
			const configured = heyy({ key: INLINE_KEY });
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

		it('reads only get_api_key from the key manager', async () => {
			const calls: string[] = [];
			const ctx = keyContext('stored');
			// unknown: the fixture carries only get_api_key, not a full manager.
			const keys = ctx.keys as unknown as {
				get_api_key: () => Promise<string | null>;
			};
			keys.get_api_key = async () => {
				calls.push('get_api_key');
				return 'stored';
			};

			await keyBuilderOf(plugin)(ctx, 'endpoint');
			expect(calls).toEqual(['get_api_key']);
		});
	});
});

describe('exports', () => {
	it('exports the error class so callers can narrow a failure', () => {
		expect(HeyyAPIError.prototype).toBeInstanceOf(Error);
	});
});
