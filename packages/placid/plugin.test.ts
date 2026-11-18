import { AuthMissingError } from 'corsair/core';
import {
	PlacidEndpointInputSchemas,
	PlacidEndpointOutputSchemas,
} from './endpoints/types';
import { placid, placidEndpointSchemas } from './index';

const OPERATIONS = [
	'images.create',
	'images.get',
	'images.delete',
	'pdfs.create',
	'pdfs.merge',
	'pdfs.get',
	'pdfs.delete',
	'videos.create',
	'videos.get',
	'videos.delete',
	'templates.list',
	'templates.create',
	'templates.get',
	'templates.update',
	'templates.delete',
	'collections.list',
	'collections.create',
	'collections.get',
	'collections.update',
	'collections.delete',
	'media.upload',
	'fonts.list',
	'fonts.get',
	'fonts.create',
	'fonts.update',
	'fonts.delete',
];

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof placid>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

describe('placid plugin definition', () => {
	const plugin = placid();

	it('registers as placid with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('placid');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-placid-signature': 'anything' },
			} as never),
		).toBe(false);
	});

	it('exposes exactly the 26 documented operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...OPERATIONS].sort());
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
		for (const [name, entry] of Object.entries(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
			expect(entry.description?.length).toBeGreaterThan(10);
			// A description that only repeats the name tells a reviewer nothing.
			expect(entry.description).not.toBe(name);
		}
	});

	it('registers a schema pair for every operation', () => {
		expect(Object.keys(placidEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	// The registry is what core parses with, so each entry must be the same
	// schema object as the exported pair, not a re-created equivalent.
	it('maps each operation to the exported input and output schema objects', () => {
		for (const operation of OPERATIONS) {
			const [group, action] = operation.split('.') as [string, string];
			// The registry key is `${group}.${action}`; the schema maps use
			// camelCase, e.g. `templates.delete` becomes `templatesDelete`.
			const schemaKey = `${group}${action.charAt(0).toUpperCase()}${action.slice(1)}`;
			const entry = placidEndpointSchemas[
				operation as keyof typeof placidEndpointSchemas
			] as {
				input: unknown;
				output: unknown;
			};

			expect(entry.input).toBe(
				PlacidEndpointInputSchemas[
					schemaKey as keyof typeof PlacidEndpointInputSchemas
				],
			);
			expect(entry.output).toBe(
				PlacidEndpointOutputSchemas[
					schemaKey as keyof typeof PlacidEndpointOutputSchemas
				],
			);
		}
	});

	it('marks the deletes destructive and the getters read', () => {
		const meta = plugin.endpointMeta ?? {};

		for (const name of [
			'images.delete',
			'pdfs.delete',
			'videos.delete',
			'templates.delete',
			'collections.delete',
			'fonts.delete',
		]) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('destructive');
		}
		for (const name of ['images.get', 'pdfs.get', 'videos.get', 'fonts.get']) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('nests operations by resource', () => {
		const groups = Object.keys(plugin.endpoints ?? {}).sort();

		expect(groups).toEqual(
			[
				'collections',
				'fonts',
				'images',
				'media',
				'pdfs',
				'templates',
				'videos',
			].sort(),
		);
		// Reading the nested shape through `plugin.endpoints` widens to {}, so
		// the operation names are asserted from the flat list above instead.
		expect(groups).toHaveLength(7);
	});
});

describe('keyBuilder', () => {
	it('prefers the key passed in the options', async () => {
		const plugin = placid({ key: 'from-options' });

		await expect(buildKey(plugin, keyContext('from-store'))).resolves.toBe(
			'from-options',
		);
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(placid(), keyContext('from-store'))).resolves.toBe(
			'from-store',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(buildKey(placid(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError for the webhook source, which it does not serve', async () => {
		await expect(
			buildKey(placid(), keyContext('from-store'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
