import { DatabricksSchema } from './schema';

describe('Databricks schema', () => {
	it('declares a semver version', () => {
		expect(DatabricksSchema.version).toBe('0.1.0');
	});

	it('declares an entities map', () => {
		expect(DatabricksSchema.entities).toBeDefined();
		expect(DatabricksSchema.entities.cluster).toBeDefined();
		expect(DatabricksSchema.entities.job).toBeDefined();
		expect(DatabricksSchema.entities.catalog).toBeDefined();
		expect(DatabricksSchema.entities.warehouse).toBeDefined();
	});
});
