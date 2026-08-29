import { MarketstackSchema } from './schema';

describe('Marketstack schema', () => {
	it('declares a semver version', () => {
		expect(MarketstackSchema.version).toBeDefined();
		expect(MarketstackSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MarketstackSchema.entities).toBe('object');
		expect(MarketstackSchema.entities).not.toBeNull();
	});
});
