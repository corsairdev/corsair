import { MoneybirdSchema } from './schema';

describe('Moneybird schema', () => {
	it('declares a semver version', () => {
		expect(MoneybirdSchema.version).toBeDefined();
		expect(MoneybirdSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: every operation is a stateless API call against the live
	// administration; Moneybird documents webhooks for change notifications.
	it('stores no entities', () => {
		expect(MoneybirdSchema.entities).toEqual({});
		expect(Array.isArray(MoneybirdSchema.entities)).toBe(false);
	});
});
