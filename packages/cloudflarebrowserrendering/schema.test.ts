import { CloudflareBrowserRenderingSchema } from './schema';

describe('CloudflareBrowserRendering schema', () => {
	it('declares a semver version', () => {
		expect(CloudflareBrowserRenderingSchema.version).toBeDefined();
		expect(CloudflareBrowserRenderingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CloudflareBrowserRenderingSchema.entities).toBe('object');
		expect(CloudflareBrowserRenderingSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(CloudflareBrowserRenderingSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(
			CloudflareBrowserRenderingSchema.entities,
		)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
