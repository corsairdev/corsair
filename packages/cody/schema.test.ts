import { CodySchema } from './schema';

describe('Cody schema', () => {
	it('declares a semver version', () => {
		expect(CodySchema.version).toBeDefined();
		expect(CodySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(Object.keys(CodySchema.entities)).toEqual([]);
	});
});
