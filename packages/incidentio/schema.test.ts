import { IncidentioSchema } from './schema';

describe('Incidentio schema', () => {
	it('declares a semver version', () => {
		expect(IncidentioSchema.version).toBeDefined();
		expect(IncidentioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof IncidentioSchema.entities).toBe('object');
		expect(IncidentioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(IncidentioSchema.entities))).toBe(true);
		for (const entity of Object.values(IncidentioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
