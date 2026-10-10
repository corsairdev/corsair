import { toSearchQuery } from './search';

describe('toSearchQuery (search wire boundary)', () => {
	it('converts perPage to per_page and keeps q', () => {
		expect(
			toSearchQuery({ q: 'repo:o/r type:issue', perPage: 5, page: 2 }),
		).toEqual({ q: 'repo:o/r type:issue', per_page: 5, page: 2 });
	});

	it('strips internal-only advancedSearch and searchType', () => {
		const out = toSearchQuery({
			q: 'hello',
			perPage: 10,
			advancedSearch: true,
			searchType: 'semantic',
		});

		expect(out).toEqual({ q: 'hello', per_page: 10 });
		expect(out).not.toHaveProperty('advancedSearch');
		expect(out).not.toHaveProperty('advanced_search');
		expect(out).not.toHaveProperty('searchType');
		expect(out).not.toHaveProperty('search_type');
	});
});
