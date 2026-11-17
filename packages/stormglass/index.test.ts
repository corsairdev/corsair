import { AuthMissingError } from 'corsair/core';
import { stormglass } from './index';

// The plugin's typed maps are cast to plain records to iterate them in tests.
type Meta = Record<string, { riskLevel: string }>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

describe('Stormglass plugin', () => {
	it('registers ten read operations', () => {
		const meta = stormglass().endpointMeta as unknown as Meta;
		expect(Object.keys(meta).sort()).toEqual([
			'astronomy.get',
			'bio.get',
			'elevation.get',
			'solar.get',
			'stations.area',
			'stations.list',
			'tides.extremes',
			'tides.seaLevel',
			'weather.get',
			'weather.historical',
		]);
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('raises AuthMissingError when no key is stored', async () => {
		const keyBuilder = stormglass().keyBuilder as unknown as KeyBuilder;
		await expect(
			keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('raises AuthMissingError when core has no key manager', async () => {
		const keyBuilder = stormglass().keyBuilder as unknown as KeyBuilder;
		await expect(keyBuilder({}, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
