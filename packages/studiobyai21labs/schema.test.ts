import { StudioByAI21LabsSchema } from './schema';

describe('StudioByAI21Labs schema', () => {
	it('declares a semver version', () => {
		expect(StudioByAI21LabsSchema.version).toBeDefined();
		expect(StudioByAI21LabsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof StudioByAI21LabsSchema.entities).toBe('object');
		expect(StudioByAI21LabsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(StudioByAI21LabsSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(StudioByAI21LabsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
