import { WorksnapsSchema } from './schema';

describe('Worksnaps schema', () => {
	it('declares a semver version', () => {
		expect(WorksnapsSchema.version).toBeDefined();
		expect(WorksnapsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WorksnapsSchema.entities).toBe('object');
		expect(WorksnapsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WorksnapsSchema.entities))).toBe(true);
		for (const entity of Object.values(WorksnapsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since logged time changes with every entry', () => {
		// A project's totals move whenever anyone logs time, so a stored copy
		// would disagree with the reports.
		expect(Object.keys(WorksnapsSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
