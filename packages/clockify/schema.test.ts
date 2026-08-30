import { ClockifySchema } from './schema';

describe('Clockify schema', () => {
	it('declares a semver version', () => {
		expect(ClockifySchema.version).toBeDefined();
		expect(ClockifySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClockifySchema.entities).toBe('object');
		expect(ClockifySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClockifySchema.entities))).toBe(true);
		for (const entity of Object.values(ClockifySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
