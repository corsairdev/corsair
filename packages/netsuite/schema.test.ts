import { NetSuiteEndpointOutputSchemas } from './endpoints/types';
import { NetSuiteSchema } from './schema';

describe('NetSuite schema', () => {
	it('declares a semver version', () => {
		expect(NetSuiteSchema.version).toBeDefined();
		expect(NetSuiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NetSuiteSchema.entities).toBe('object');
		expect(NetSuiteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NetSuiteSchema.entities))).toBe(true);
		expect(Object.keys(NetSuiteSchema.entities)).toHaveLength(13);
		for (const entity of Object.values(NetSuiteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates types of known response fields in output schemas', () => {
		const tokenOutput = NetSuiteEndpointOutputSchemas.oauth2TokenRefresh;
		expect(tokenOutput.safeParse({ access_token: 'valid-token' }).success).toBe(
			true,
		);
		expect(tokenOutput.safeParse({ access_token: 12345 }).success).toBe(false);
		expect(tokenOutput.safeParse({ expires_in: 'not-a-number' }).success).toBe(
			false,
		);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
