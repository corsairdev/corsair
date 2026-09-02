import { BoldsignSchema } from './schema';

describe('Boldsign schema', () => {
	it('declares a semver version', () => {
		expect(BoldsignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares core entities for docs and metadata', () => {
		expect(BoldsignSchema.entities.documents).toBeDefined();
		expect(BoldsignSchema.entities.brands).toBeDefined();
		expect(BoldsignSchema.entities.custom_fields).toBeDefined();
	});
});
