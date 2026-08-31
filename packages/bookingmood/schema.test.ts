import { describe, expect, it } from '@jest/globals';
import { BookingmoodSchema } from './schema';

describe('Bookingmood schema', () => {
	it('declares a semver version', () => {
		expect(BookingmoodSchema.version).toBeDefined();
		expect(BookingmoodSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BookingmoodSchema.entities).toBe('object');
		expect(BookingmoodSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BookingmoodSchema.entities))).toBe(true);
		for (const entity of Object.values(BookingmoodSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
