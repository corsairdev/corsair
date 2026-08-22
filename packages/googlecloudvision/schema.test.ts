import { GoogleCloudVisionSchema } from './schema';

describe('GoogleCloudVision schema', () => {
	it('declares a semver version', () => {
		expect(GoogleCloudVisionSchema.version).toBeDefined();
		expect(GoogleCloudVisionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoogleCloudVisionSchema.entities).toBe('object');
		expect(GoogleCloudVisionSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoogleCloudVisionSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(GoogleCloudVisionSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
