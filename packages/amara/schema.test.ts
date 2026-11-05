import { AmaraSchema } from './schema';

describe('Amara schema', () => {
	it('declares a semver version', () => {
		expect(AmaraSchema.version).toBeDefined();
		expect(AmaraSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares video, user, and team entities', () => {
		expect(typeof AmaraSchema.entities).toBe('object');
		expect(AmaraSchema.entities).not.toBeNull();
		expect(AmaraSchema.entities.videos).toBeDefined();
		expect(AmaraSchema.entities.users).toBeDefined();
		expect(AmaraSchema.entities.teams).toBeDefined();
	});
});
