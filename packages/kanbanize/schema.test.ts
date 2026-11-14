import { KanbanizeSchema } from './schema';

describe('Kanbanize schema', () => {
	it('declares a semver version', () => {
		expect(KanbanizeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation reads Businessmap live', () => {
		expect(KanbanizeSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KanbanizeSchema.entities)).toBe(false);
	});
});
