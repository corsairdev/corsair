import { GlobalpingSchema } from './schema';
import { GlobalpingMeasurementEntity } from './schema/database';

describe('Globalping schema', () => {
	it('declares limits, measurements, and health', () => {
		expect(GlobalpingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(GlobalpingSchema.entities).sort()).toEqual([
			'health',
			'limits',
			'measurements',
		]);
	});

	it('rejects a measurement with no id', () => {
		expect(
			GlobalpingMeasurementEntity.safeParse({ status: 'finished' }).success,
		).toBe(false);
	});
});
