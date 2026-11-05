import { WinstonaiSchema } from './schema';

describe('Winstonai schema', () => {
	it('declares a semver version', () => {
		expect(WinstonaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities object map', () => {
		expect(WinstonaiSchema.entities).toEqual({});
		expect(Array.isArray(WinstonaiSchema.entities)).toBe(false);
	});
});
