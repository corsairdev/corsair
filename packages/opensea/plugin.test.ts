import { AuthMissingError } from 'corsair/core';
import type { OpenseaKeyBuilderContext } from './index';
import { opensea, openseaAuthConfig, openseaEndpointSchemas } from './index';

const OPERATIONS = [
	'chains.list',
	'collections.list',
	'collections.get',
	'collections.stats',
	'collections.top',
	'collections.trending',
	'collection.nfts',
	'contract.nfts',
	'nfts.get',
	'nfts.owners',
	'events.list',
	'events.collection',
	'collections.floorPrices',
	'collections.holders',
	'accounts.get',
	'accounts.portfolio',
	'orders.get',
	'listings.all',
	'offers.all',
	'offers.best',
	'search.search',
	'traits.list',
	'listings.best',
	'offers.collection',
] as const;

/** Reads a member that must exist, so a missing one fails as an assertion. */
function required<T>(source: Record<string, T>, key: string): T {
	const value = source[key];
	if (value === undefined) {
		throw new Error(`Expected "${key}" to be registered`);
	}
	return value;
}

describe('opensea plugin', () => {
	const plugin = opensea();
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const meta = plugin.endpointMeta as NonNullable<typeof plugin.endpointMeta>;
	const handlers = plugin.errorHandlers as NonNullable<
		typeof plugin.errorHandlers
	>;

	it('uses the documented id and auth type', () => {
		expect(plugin.id).toBe('opensea');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares only an api_key auth config with no account extras', () => {
		// Two credentials on an api_key integration would throw at runtime: core
		// only installs the integration getters for oauth_2.
		expect(Object.keys(openseaAuthConfig)).toEqual(['api_key']);
		expect(openseaAuthConfig.api_key).toEqual({});
	});

	it('registers every advertised operation and nothing else', () => {
		const paths: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			for (const name of Object.keys(members)) {
				paths.push(`${group}.${name}`);
			}
		}
		expect(paths.sort()).toEqual([...OPERATIONS].sort());
	});

	it('has a schema entry for every operation', () => {
		expect(Object.keys(openseaEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('has metadata for every operation', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
	});

	it('describes every operation in more than a few words', () => {
		for (const [name, entry] of Object.entries(meta)) {
			expect({ name, tooShort: (entry.description ?? '').length < 40 }).toEqual(
				{
					name,
					tooShort: false,
				},
			);
		}
	});

	it('marks every operation as a read', () => {
		// This build implements no writes: no fulfillment, listing or transfer
		// route is registered, so nothing may claim a write risk.
		for (const [name, entry] of Object.entries(meta)) {
			expect({ name, risk: entry.riskLevel }).toEqual({ name, risk: 'read' });
		}
	});

	it('registers no webhooks: OpenSea sends none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {},
				body: {},
				query: {},
			} as never),
		).toBe(false);
	});

	it('has no tenant matcher or oauth link resolver', () => {
		expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
		expect(plugin.oauthWebhookTenantLinkResolver).toBeUndefined();
	});

	describe('keyBuilder', () => {
		// Safe: a full AccountKeyManager implements get_dek, issue_new_dek and the
		// rest; the builder only reads the api key, so one method is supplied.
		const contextWith = (stored?: string) =>
			({
				authType: 'api_key',
				keys: { get_api_key: async () => stored },
				// Safe: only get_api_key is read; the real manager has the rest.
			}) as unknown as OpenseaKeyBuilderContext;

		function builderOf(options: Parameters<typeof opensea>[0]) {
			const builder = opensea(options).keyBuilder;
			if (!builder) throw new Error('Expected a keyBuilder');
			return builder;
		}

		it('prefers an inline key over the stored one', async () => {
			await expect(
				builderOf({ key: 'inline-key' })(contextWith('stored-key'), 'endpoint'),
			).resolves.toBe('inline-key');
		});

		it('falls back to the stored key', async () => {
			await expect(
				builderOf(undefined)(contextWith('stored-key'), 'endpoint'),
			).resolves.toBe('stored-key');
		});

		it('throws AuthMissingError when neither exists', async () => {
			await expect(
				builderOf(undefined)(contextWith(undefined), 'endpoint'),
			).rejects.toThrow(AuthMissingError);
		});

		it('refuses a webhook source rather than handing it the API key', async () => {
			await expect(
				builderOf({ key: 'inline-key' })(contextWith('stored-key'), 'webhook'),
			).rejects.toThrow(AuthMissingError);
		});
	});

	describe('error handlers', () => {
		it('keeps DEFAULT last after the plugin builds its map', () => {
			expect(Object.keys(handlers).at(-1)).toBe('DEFAULT');
		});

		it('starts with the caller handlers so an override can take effect', () => {
			const custom = opensea({
				errorHandlers: {
					MINE: {
						match: () => false,
						handler: async () => ({ maxRetries: 0 }),
					},
				},
			});
			const merged = custom.errorHandlers as NonNullable<
				typeof custom.errorHandlers
			>;
			expect(Object.keys(merged)[0]).toBe('MINE');
			expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
		});
	});
});
