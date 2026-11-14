import { SatisMeterSchema } from './schema';

describe('SatisMeter schema', () => {
	it('declares a semver version', () => {
		expect(SatisMeterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores nothing locally', () => {
		// Responses, users and statistics are the provider's live record. A local
		// copy would go stale and would duplicate personal data (email, IP,
		// traits) that `users.remove` exists to erase.
		expect(Array.isArray(SatisMeterSchema.entities)).toBe(false);
		expect(SatisMeterSchema.entities).toEqual({});
	});
});
