import { SimpleanalyticsSchema } from './schema';

describe('Simpleanalytics schema', () => {
	it('declares a semver version', () => {
		expect(SimpleanalyticsSchema.version).toBeDefined();
		expect(SimpleanalyticsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because no sync is useful', () => {
		expect(SimpleanalyticsSchema.entities).toEqual({});
	});
});
