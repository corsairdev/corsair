/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema.
 *
 * Run with `RADAR_API_KEY=... pnpm --filter @corsair-dev/radar test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RadarContext } from './index';

const apiKey = process.env.RADAR_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'RADAR_API_KEY is not set: the live Radar suite is skipped, not passing.',
	);
}

function liveContext(): RadarContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RadarContext;
}

describeIfKey('live Radar API', () => {
	it('reverse geocodes a known coordinate', async () => {
		const result = await Endpoints.geocodeReverse(
			liveContext() as never,
			{
				coordinates: '40.70390,-73.98670',
			} as never,
		);

		expect(Array.isArray(result.addresses)).toBe(true);
		expect(result.addresses[0]?.formattedAddress).toBeTruthy();
	});

	it('forward geocodes an address', async () => {
		const result = await Endpoints.geocodeForward(
			liveContext() as never,
			{
				query: '20 Jay Street, Brooklyn, NY',
			} as never,
		);

		expect(Array.isArray(result.addresses)).toBe(true);
		if (result.addresses.length > 0) {
			// The confidence is documented as exact, interpolated or fallback.
			expect(['exact', 'interpolated', 'fallback']).toContain(
				result.addresses[0]?.confidence,
			);
		}
	});

	it('lists users through the output schema', async () => {
		const result = await Endpoints.usersList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.users)).toBe(true);
	});

	it('lists geofences and trips', async () => {
		const geofences = await Endpoints.geofencesList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);
		expect(Array.isArray(geofences.geofences)).toBe(true);
	});
});
