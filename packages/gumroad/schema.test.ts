import { GumroadSchema } from './schema';

describe('Gumroad schema', () => {
	it('declares a semver version', () => {
		expect(GumroadSchema.version).toBe('1.0.0');
	});

	it('persists no entities', () => {
		expect(GumroadSchema.entities).toEqual({});
	});
});
