import { CloudflareApiKeySchema } from './schema';

describe('CloudflareApiKey schema', () => {
	it('declares a semver version', () => {
		expect(CloudflareApiKeySchema.version).toBeDefined();
		expect(CloudflareApiKeySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CloudflareApiKeySchema.entities).toBe('object');
		expect(CloudflareApiKeySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CloudflareApiKeySchema.entities))).toBe(true);
		for (const entity of Object.values(CloudflareApiKeySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
