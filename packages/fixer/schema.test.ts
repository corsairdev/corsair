import { FixerSchema } from './schema';

describe('Fixer schema', () => {
	it('declares a semver version', () => {
		expect(FixerSchema.version).toBe('1.0.0');
	});

	it('declares an entities map', () => {
		expect(FixerSchema.entities).toBeDefined();
	});
});
