import { AuthMissingError } from 'corsair/core';
import type { KlazifyKeyBuilderContext } from './index';
import { klazify, klazifyAuthConfig, klazifyEndpointSchemas } from './index';

const OPERATIONS = [
	'categorize.all',
	'categorize.realtime',
	'categories.iab',
	'company.get',
	'tech.get',
	'logo.get',
	'domain.get',
	'similarDomains.get',
	'traffic.get',
	'categories.listV1',
	'categories.listV2',
	'discovery.search',
] as const;

type KeyBuilder = (
	ctx: KlazifyKeyBuilderContext,
	source: string,
) => Promise<string>;

describe('klazify plugin', () => {
	const plugin = klazify();
	// unknown: keyBuilder is not on the plugin's public surface, so the narrow
	// cast below is what reaches its call signature.
	const keyBuilderOf = (candidate: { keyBuilder?: unknown }): KeyBuilder =>
		candidate.keyBuilder as KeyBuilder;

	/**
	 * A metadata entry that must exist. `endpointMeta` is optional and its
	 * entries are partial, so this narrows both before anything is asserted on.
	 */
	function metaEntry(operation: (typeof OPERATIONS)[number]) {
		const entry = plugin.endpointMeta?.[operation];
		if (!entry) throw new Error(`Expected "${operation}" in endpointMeta`);
		return entry;
	}

	it('registers every advertised operation', () => {
		const endpoints = plugin.endpoints;
		if (!endpoints) throw new Error('Expected plugin.endpoints to be set');
		const registered = Object.entries(endpoints)
			.flatMap(([group, members]) =>
				Object.keys(members).map((name) => `${group}.${name}`),
			)
			.sort();

		expect(registered).toEqual([...OPERATIONS].sort());
	});

	it('declares input and output schemas for each operation', () => {
		expect(Object.keys(klazifyEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const operation of OPERATIONS) {
			const entry = klazifyEndpointSchemas[operation];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('describes each operation without generator placeholder text', () => {
		for (const operation of OPERATIONS) {
			const { description } = metaEntry(operation);
			expect(description).toBeDefined();
			expect(description?.length ?? 0).toBeGreaterThan(20);
			expect(description).not.toMatch(/example resource/i);
		}
	});

	// Klazify only reads and classifies; nothing here changes state at the
	// provider, so every operation is a read and none needs an approval prompt.
	it('classifies every operation as a read', () => {
		for (const operation of OPERATIONS) {
			expect(metaEntry(operation).riskLevel).toBe('read');
		}
	});

	// Klazify authenticates with one Bearer token and has no OAuth flow, so
	// advertising one would offer a connection that cannot complete.
	it('offers api_key auth only', () => {
		expect(Object.keys(klazifyAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('receives no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
	});

	describe('keyBuilder', () => {
		/**
		 * A context carrying only what the key builder reads, typed as the real
		 * `KlazifyKeyBuilderContext` rather than asserted into it. The key manager
		 * members the builder never calls are stubbed so the type is satisfied
		 * without a cast.
		 */
		const keyContext = (apiKey?: string): KlazifyKeyBuilderContext => ({
			authType: 'api_key',
			options: {},
			tenantId: 'default',
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: async () => apiKey ?? null,
				get_webhook_signature: async () => null,
				set_api_key: async () => undefined,
				set_webhook_signature: async () => undefined,
			},
		});

		it('returns the explicitly configured key', async () => {
			const configured = klazify({ key: 'inline-token' });

			await expect(
				keyBuilderOf(configured)(keyContext(), 'endpoint'),
			).resolves.toBe('inline-token');
		});

		it('falls back to the stored key', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext('stored-token'), 'endpoint'),
			).resolves.toBe('stored-token');
		});

		// Failing open would send `Bearer undefined` and surface Klazify's
		// generic 401 instead of Corsair's disconnected-auth flow.
		it('throws when no key is stored', async () => {
			await expect(
				keyBuilderOf(plugin)(keyContext(undefined), 'endpoint'),
			).rejects.toBeInstanceOf(AuthMissingError);
		});
	});
});
