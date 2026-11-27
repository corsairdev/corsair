import { AuthMissingError } from 'corsair/core';
import type { OmnisendKeyBuilderContext } from './index';
import { OmnisendAPIError, omnisend } from './index';

const OPERATIONS = [
	'batches.create',
	'batches.get',
	'batches.list',
	'batches.listItems',
	'campaigns.cancel',
	'campaigns.copy',
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.getUtm',
	'campaigns.list',
	'campaigns.restoreToDraft',
	'campaigns.send',
	'campaigns.sendTestEmail',
	'campaigns.setUtm',
	'campaigns.update',
	'categories.create',
	'categories.delete',
	'categories.get',
	'categories.list',
	'categories.update',
	'contacts.addTags',
	'contacts.get',
	'contacts.list',
	'contacts.removeTags',
	'contacts.update',
	'contacts.updateByEmail',
	'contacts.upsert',
	'emailContent.get',
	'emailContent.render',
	'emailContent.replace',
	'events.defineSchema',
	'events.queryMetadata',
	'events.send',
	'events.updateSchema',
	'products.create',
	'products.delete',
	'products.get',
	'products.list',
	'products.replace',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.importFromHtml',
	'templates.list',
	'templates.render',
	'templates.replace',
] as const;

// unknown: a schema pair is a zod schema, and the assertions only check that one
// is present, never parse through it.
type SchemaPair = { input?: unknown; output?: unknown };
type SchemaView = Record<string, SchemaPair>;
type EndpointMeta = {
	riskLevel: string;
	description: string;
	irreversible?: boolean;
	job?: unknown;
};
type MetaView = Record<string, EndpointMeta>;
type EndpointsView = Record<string, Record<string, unknown>>; // unknown: leaves are functions of differing types.
type KeyBuilder = (
	ctx: OmnisendKeyBuilderContext,
	source: string,
) => Promise<string>;

const INLINE_KEY = 'omnisend_inline';

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
	} as unknown as OmnisendKeyBuilderContext;
}

describe('omnisend plugin', () => {
	const plugin = omnisend();
	const endpoints = plugin.endpoints as EndpointsView;
	const meta = plugin.endpointMeta as unknown as MetaView; // unknown: widening a readonly const map.
	const schemas = plugin.endpointSchemas as unknown as SchemaView; // unknown: see meta.
	// keyBuilder is optional on the plugin type; it is always supplied here.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		// unknown: optional on the plugin type.
		candidate.keyBuilder as KeyBuilder; // unknown: optional on the plugin type.

	it('has the id the constants file registers', () => {
		expect(plugin.id).toBe('omnisend');
	});

	it('defaults to api_key auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('registers every operation in the chosen surface', () => {
		expect(flatten(endpoints)).toEqual([...OPERATIONS]);
	});

	it('marks every delete destructive and irreversible', () => {
		for (const operation of [
			'campaigns.delete',
			'categories.delete',
			'products.delete',
			'templates.delete',
		] as const) {
			expect(meta[operation]?.riskLevel).toBe('destructive');
			expect(meta[operation]?.irreversible).toBe(true);
		}
	});

	it('marks the two undoable writes irreversible', () => {
		// A sent campaign cannot be recalled, and an event can never be edited
		// or deleted.
		expect(meta['campaigns.send']?.irreversible).toBe(true);
		expect(meta['events.send']?.irreversible).toBe(true);
	});

	it('declares reads as read and creates as write', () => {
		expect(meta['contacts.list']?.riskLevel).toBe('read');
		expect(meta['contacts.upsert']?.riskLevel).toBe('write');
		expect(meta['templates.render']?.riskLevel).toBe('read');
		expect(meta['emailContent.render']?.riskLevel).toBe('read');
	});

	it('declares a job on batches.create', () => {
		const job = required(meta, 'batches.create').job as {
			idPath: string;
			status: {
				op: string;
				idArg: string;
				statusPath: string;
				done: string[];
				failed: string[];
			};
			cancel?: unknown;
		};
		expect(job.idPath).toBe('batchID');
		expect(job.status.op).toBe('batches.get');
		expect(job.status.idArg).toBe('id');
		expect(job.status.statusPath).toBe('status');
		// No cancel exists: Omnisend documents none.
		expect(job.cancel).toBeUndefined();
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
			const configured = omnisend({ key: INLINE_KEY });
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
		expect(OmnisendAPIError.prototype).toBeInstanceOf(Error);
	});
});
