import { companyenrich } from './index';

// R8 in .github/PLUGIN_PR_RULES.md marks sends, purchases, paid generation jobs
// and irreversible changes `destructive`. Every CompanyEnrich operation is a
// lookup or search that only returns data, so all stay `read`, including the
// ones that use credits per call (the Ahrefs plugin keeps its metered reads as
// `read` the same way). Costs are stated in each description.
const meta = companyenrich().endpointMeta as Record<
	string,
	{ riskLevel: string }
>;

describe('companyenrich risk levels', () => {
	it.each([
		'companies.get',
		'companies.enrichByDomain',
		'companies.enrichByProperties',
		'companies.enrichBatch',
		'companies.workforce',
		'companies.search',
		'people.get',
		'people.enrich',
		'people.findEmail',
		'people.search',
	])('keeps credit-using lookup %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});

	it.each([
		'companies.autocomplete',
		'companies.searchCount',
		'companies.searchPreview',
		'people.searchCount',
		'people.searchPreview',
		'geo.regions',
		'geo.getCountry',
		'geo.searchCountries',
		'geo.searchStates',
		'geo.searchCities',
		'industries.list',
		'keywords.autocomplete',
		'technologies.autocomplete',
		'positions.autocomplete',
		'account.me',
	])('keeps free read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});

	it('has no destructive operation', () => {
		expect(
			Object.entries(meta)
				.filter(([, m]) => m.riskLevel !== 'read')
				.map(([op]) => op),
		).toEqual([]);
	});
});
