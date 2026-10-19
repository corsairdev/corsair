import { makePDLRequest } from './client';
import {
	AutocompleteOutputSchema,
	CompanyCleanOutputSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.PDL_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('PDL live API', () => {
	jest.setTimeout(120_000);

	it('autocompletes a job title prefix', async () => {
		const suggestions = AutocompleteOutputSchema.parse(
			await makePDLRequest('/v5/autocomplete', TEST_API_KEY, {
				query: { field: 'job_title', text: 'engin', size: 5 },
			}),
		);
		expect(suggestions.status).toBe(200);
		expect(suggestions.fields).toContain('job_title');
		expect(suggestions.data.length).toBeGreaterThan(0);
		expect(suggestions.data.length).toBeLessThanOrEqual(5);
		expect(
			suggestions.data.some((entry) =>
				entry.name.toLowerCase().includes('engin'),
			),
		).toBe(true);
	});

	it('cleans a company website without charge', async () => {
		const cleaned = CompanyCleanOutputSchema.parse(
			await makePDLRequest('/v5/company/clean', TEST_API_KEY, {
				query: { website: 'peopledatalabs.com' },
			}),
		);
		expect(cleaned.status).toBe(200);
		const cleanedName =
			typeof cleaned.name === 'string' ? cleaned.name : undefined;
		expect(cleanedName?.toLowerCase()).toContain('people data labs');
	});
});
