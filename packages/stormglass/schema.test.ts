import { StormglassSchema } from './schema';
import { StormglassStationEntity } from './schema/database';

describe('Stormglass schema', () => {
	it('declares stations, points, extremes, and quotas', () => {
		expect(StormglassSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(StormglassSchema.entities).sort()).toEqual([
			'extremes',
			'points',
			'quotas',
			'stations',
		]);
	});

	it('rejects a station with no id', () => {
		expect(
			StormglassStationEntity.safeParse({ name: 'boulogne' }).success,
		).toBe(false);
	});
});
