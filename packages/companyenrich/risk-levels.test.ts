import { companyenrich } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`.
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
	])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
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
});
