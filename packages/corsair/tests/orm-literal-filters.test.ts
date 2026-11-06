import { z } from 'zod';
import { getDataFieldTypes } from '../db/kysely/orm';

// `inspect` lists number, string and boolean filters for enum, literal and
// same-type union fields; search has to apply the same filter type, or a
// numeric `gt`/`equals` on `0 | 1 | 2` falls back to string filters and
// matches every row. The JSON casts behind number and boolean filters are
// Postgres-only, so this checks the type each field resolves to.
describe('search filter type for enum, literal and union fields', () => {
	const types = getDataFieldTypes(
		z.object({
			title: z.string(),
			priority: z.union([z.literal(0), z.literal(1), z.literal(2)]),
			level: z.literal([1, 2, 3]).optional(),
			state: z.enum(['open', 'closed']),
			archived: z.literal([true, false]).nullable(),
			status: z.union([z.literal('a'), z.literal('b'), z.null()]),
			mixed: z.union([z.literal('a'), z.literal(1)]),
			payload: z.object({ id: z.string() }),
		}),
	);

	it('numeric literal unions filter as numbers', () => {
		expect(types.priority).toBe('number');
		expect(types.level).toBe('number');
	});

	it('string enums and string literal unions filter as strings', () => {
		expect(types.state).toBe('string');
		expect(types.status).toBe('string');
		expect(types.title).toBe('string');
	});

	it('boolean literals filter as booleans', () => {
		expect(types.archived).toBe('boolean');
	});

	it('mixed unions and objects get no typed filter', () => {
		expect(types.mixed).toBeUndefined();
		expect(types.payload).toBeUndefined();
	});
});
