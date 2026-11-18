import { SearchApiSchema } from './schema';
import { SearchApiSearchEntity } from './schema/database';

describe('SearchAPI schema', () => {
	it('declares accounts, locations, and searches', () => {
		expect(SearchApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(SearchApiSchema.entities).sort()).toEqual([
			'accounts',
			'locations',
			'searches',
		]);
	});

	it('rejects a search with no id', () => {
		expect(SearchApiSearchEntity.safeParse({ status: 'Success' }).success).toBe(
			false,
		);
	});
});
