import { NanonetsSchema } from './schema';

describe('Nanonets schema', () => {
	it('declares a semver version', () => {
		expect(NanonetsSchema.version).toBeDefined();
		expect(NanonetsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because Nanonets answers each request with predictions over uploaded files, not with records to sync', () => {
		expect(NanonetsSchema.entities).toEqual({});
	});
});
