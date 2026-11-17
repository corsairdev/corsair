import { SuperchatSchema } from './schema';

describe('Superchat schema', () => {
	it('declares a semver version', () => {
		expect(SuperchatSchema.version).toBeDefined();
		expect(SuperchatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SuperchatSchema.entities).toEqual({});
	});
});
