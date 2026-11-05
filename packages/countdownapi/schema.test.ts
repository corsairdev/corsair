import { CountdownApiSchema } from './schema';

describe('CountdownApi schema', () => {
	it('declares a semver version', () => {
		expect(CountdownApiSchema.version).toBeDefined();
		expect(CountdownApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(Object.keys(CountdownApiSchema.entities)).toEqual([]);
	});
});
