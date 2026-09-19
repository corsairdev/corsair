import { CosmicSchema } from './schema';

describe('Cosmic schema', () => {
	it('declares a semver version', () => {
		expect(CosmicSchema.version).toBeDefined();
		expect(CosmicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(Object.keys(CosmicSchema.entities)).toEqual([]);
	});
});
