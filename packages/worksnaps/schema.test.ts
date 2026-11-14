import { WorksnapsEndpointOutputSchemas } from './endpoints/types';
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

describe('list collections', () => {
	it('checks rows read out of a wrapper object like rows in a bare array', () => {
		const result = WorksnapsEndpointOutputSchemas.projectsList.parse({
			projects: { project: [{ id: '7', name: 'Deck' }], total: '1' },
		});
		const row = result.projects[0];
		expect(row?.id).toBe(7);
		// @ts-expect-error a row id is a number after parsing, not a string.
		const asString: string = row?.id;
		expect(asString).toBe(7);
		expect(() =>
			WorksnapsEndpointOutputSchemas.projectsList.parse({
				projects: { project: [{ id: 'not-a-number' }], total: '1' },
			}),
		).toThrow();
	});
});
