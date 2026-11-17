import { DraftableSchema } from './schema';
import { DraftableComparisonEntity } from './schema/database';

describe('Draftable schema', () => {
	it('declares a semver version and the comparisons entity', () => {
		expect(DraftableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(DraftableSchema.entities)).toEqual(['comparisons']);
	});

	it('accepts a comparison row and rejects one with no identifier', () => {
		const parsed = DraftableComparisonEntity.parse({
			identifier: 'cmp-1',
			ready: true,
			creation_time: '2026-01-01T00:00:00Z',
			public: false,
		});
		expect(parsed.identifier).toBe('cmp-1');
		expect(parsed.ready).toBe(true);
		expect(DraftableComparisonEntity.safeParse({ ready: true }).success).toBe(
			false,
		);
		expect(
			DraftableComparisonEntity.safeParse({ identifier: '' }).success,
		).toBe(false);
	});
});
