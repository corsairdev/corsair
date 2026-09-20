import { AgiledSchema } from './schema';

describe('Agiled schema', () => {
	it('declares a semver version', () => {
		expect(AgiledSchema.version).toBeDefined();
		expect(AgiledSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(AgiledSchema.entities).toEqual({});
	});
});
