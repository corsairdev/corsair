import { GiteaSchema } from './schema';

describe('gitea schema', () => {
	it('declares a semver version', () => {
		expect(GiteaSchema.version).toBeDefined();
		expect(GiteaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: no operation syncs provider data into Corsair', () => {
		// The plugin reads and writes Gitea through the API on demand; nothing
		// needs a local copy, so the entity map stays empty on purpose.
		expect(GiteaSchema.entities).toEqual({});
		expect(Array.isArray(GiteaSchema.entities)).toBe(false);
	});
});
