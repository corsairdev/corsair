import { AuthMissingError } from 'corsair/core';
import type { MiroKeyBuilderContext } from './index';
import { MiroAPIError, miro } from './index';

const OPERATIONS = [
	'boards.copy',
	'boards.create',
	'boards.get',
	'boards.list',
	'boards.remove',
	'boards.update',
	'cards.create',
	'cards.update',
	'connectors.create',
	'connectors.get',
	'connectors.list',
	'connectors.remove',
	'connectors.update',
	'embeds.create',
	'embeds.update',
	'frames.create',
	'frames.update',
	'items.get',
	'items.list',
	'items.remove',
	'members.get',
	'members.list',
	'members.remove',
	'members.share',
	'members.update',
	'shapes.create',
	'shapes.update',
	'stickyNotes.create',
	'stickyNotes.update',
	'tags.attach',
	'tags.create',
	'tags.get',
	'tags.items',
	'tags.list',
	'tags.ofItem',
	'tags.remove',
	'tags.removeFromItem',
	'tags.update',
	'texts.create',
	'texts.update',
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
	ctx: MiroKeyBuilderContext,
	source: string,
) => Promise<string>;

const INLINE_KEY = 'inline-token';

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
	} as unknown as MiroKeyBuilderContext;
}

describe('miro plugin', () => {
	const plugin = miro();
	const endpoints = plugin.endpoints as EndpointsView;
	const meta = plugin.endpointMeta as unknown as MetaView; // unknown: widening a readonly const map.
	const schemas = plugin.endpointSchemas as unknown as SchemaView; // unknown: see meta.
	// keyBuilder is optional on the plugin type; it is always supplied here.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		// unknown: optional on the plugin type.
		candidate.keyBuilder as KeyBuilder; // unknown: optional on the plugin type.

	it('has the id the constants file registers', () => {
		expect(plugin.id).toBe('miro');
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers every operation in the chosen surface', () => {
		expect(flatten(endpoints)).toEqual([...OPERATIONS]);
	});

	it('declares the risk each operation really carries', () => {
		// Reads.
		for (const operation of [
			'boards.list',
			'boards.get',
			'members.list',
			'members.get',
			'items.list',
			'items.get',
			'connectors.list',
			'connectors.get',
			'tags.list',
			'tags.get',
			'tags.ofItem',
			'tags.items',
		] as const) {
			expect(meta[operation]?.riskLevel).toBe('read');
		}
		// Writes.
		for (const operation of [
			'boards.create',
			'boards.update',
			'boards.copy',
			'members.share',
			'members.update',
			'stickyNotes.create',
			'shapes.update',
			'tags.attach',
		] as const) {
			expect(meta[operation]?.riskLevel).toBe('write');
		}
	});

	it('marks every delete destructive and irreversible', () => {
		for (const operation of [
			'boards.remove',
			'members.remove',
			'items.remove',
			'connectors.remove',
			'tags.remove',
			'tags.removeFromItem',
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

	it('exposes no webhook route, because the REST API sends none', () => {
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
		it('prefers the inline token over the stored one', async () => {
			const configured = miro({ key: INLINE_KEY });
			await expect(
				keyBuilderOf(configured)(keyContext('stored'), 'endpoint'),
			).resolves.toBe(INLINE_KEY);
		});

		it('falls back to the stored token', async () => {
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
		expect(MiroAPIError.prototype).toBeInstanceOf(Error);
	});
});
