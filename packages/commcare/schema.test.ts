import { CommCareSchema } from './schema';

describe('CommCare schema', () => {
	it('declares a semver version', () => {
		expect(CommCareSchema.version).toBeDefined();
		expect(CommCareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: forms and cases are read through the live API', () => {
		expect(CommCareSchema.entities).toEqual({});
	});
});
