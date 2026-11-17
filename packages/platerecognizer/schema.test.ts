import { PlateRecognizerSchema } from './schema';
import { PlateRecognizerUsageEntity } from './schema/database';

describe('Plate Recognizer schema', () => {
	it('declares a semver version and the usage entity', () => {
		expect(PlateRecognizerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PlateRecognizerSchema.entities)).toEqual(['usage']);
	});

	it('accepts a usage period and rejects one with no id', () => {
		const parsed = PlateRecognizerUsageEntity.parse({
			id: '2019-01',
			year: 2019,
			month: 1,
			calls: 128,
			resetsOn: '2019-01-14T00:00:00Z',
			totalCalls: 2500,
		});
		expect(parsed.id).toBe('2019-01');
		expect(
			PlateRecognizerUsageEntity.safeParse({ year: 2019, month: 1 }).success,
		).toBe(false);
	});
});
