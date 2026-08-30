import { FixerSchema } from './schema';
import { FixerRateSnapshotEntity } from './schema/database';

describe('Fixer schema', () => {
	it('declares a semver version', () => {
		expect(FixerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares a rates entity backed by official Fixer JSON fields', () => {
		expect(Object.keys(FixerSchema.entities)).toEqual(['rates']);
		expect(typeof FixerSchema.entities.rates.parse).toBe('function');

		const parsed = FixerRateSnapshotEntity.parse({
			base: 'EUR',
			date: '2026-08-27',
			timestamp: 1756252800,
			rates: { USD: 1.1, GBP: 0.86 },
			captured_at: new Date('2026-08-27T00:00:00.000Z'),
		});
		expect(parsed.base).toBe('EUR');
		expect(parsed.rates.USD).toBe(1.1);
	});
});
