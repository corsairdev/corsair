import { VirustotalSchema } from './schema';

describe('VirusTotal schema', () => {
	it('declares a semver version', () => {
		expect(VirustotalSchema.version).toBeDefined();
		expect(VirustotalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof VirustotalSchema.entities).toBe('object');
		expect(VirustotalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(VirustotalSchema.entities))).toBe(true);
		for (const entity of Object.values(VirustotalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since verdicts change with every analysis', () => {
		// A file's engine verdicts change whenever it is rescanned, and a domain
		// or IP's reputation moves with new reports, so a stored copy would go
		// stale silently.
		expect(Object.keys(VirustotalSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
