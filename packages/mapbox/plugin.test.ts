import { AuthMissingError } from 'corsair/core';
import { MAPBOX_PROFILES } from './endpoints/types';
import { mapbox, mapboxEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof mapbox>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'directions.route',
	'geocoding.forward',
	'geocoding.reverse',
	'isochrone.get',
	'matrix.calculate',
	'tilequery.query',
	'trips.optimize',
];

describe('mapbox plugin definition', () => {
	const plugin = mapbox();

	it('registers as mapbox with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('mapbox');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the seven operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('describes every endpoint and marks all of them read, since none changes Mapbox', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			expect(entry.riskLevel).toBe('read');
			expect(entry.irreversible).toBeUndefined();
		}
	});

	it('declares no job, because no operation starts an async job', () => {
		for (const entry of Object.values(plugin.endpointMeta ?? {})) {
			expect(entry.job).toBeUndefined();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(mapboxEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(mapboxEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('lists the four documented routing profiles', () => {
		expect([...MAPBOX_PROFILES].sort()).toEqual([
			'mapbox/cycling',
			'mapbox/driving',
			'mapbox/driving-traffic',
			'mapbox/walking',
		]);
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = mapbox({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('mapbox key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(mapbox({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(mapbox(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(mapbox(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			mapbox().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
