import { makeVaquillRequest } from './client';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './endpoints/types';

const TEST_API_KEY = process.env.VAQUILL_API_KEY ?? '';
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Vaquill live API', () => {
	jest.setTimeout(180_000);

	it('reports the credit balance', async () => {
		const balance = VaquillEndpointOutputSchemas.creditsBalance.parse(
			await makeVaquillRequest('/credits/balance', TEST_API_KEY),
		);
		expect(balance.creditsRemaining).toBeGreaterThanOrEqual(0);
	});

	it('lists covered corpora and jurisdictions', async () => {
		const coverage = VaquillEndpointOutputSchemas.coverage.parse(
			await makeVaquillRequest('/us/statutes/coverage', TEST_API_KEY),
		);
		expect(coverage.data.corpusTypes.length).toBeGreaterThan(0);
		expect(coverage.data.jurisdictions.length).toBeGreaterThan(0);
		expect(
			coverage.data.corpusTypes.some((corpus) => corpus.token === 'USC'),
		).toBe(true);
	});

	it('counts the United States Code corpus', async () => {
		const input = VaquillEndpointInputSchemas.count.parse({
			corpusType: 'USC',
		});
		const counted = VaquillEndpointOutputSchemas.count.parse(
			await makeVaquillRequest('/us/statutes/count', TEST_API_KEY, {
				method: 'POST',
				body: input,
			}),
		);
		expect(counted.count).toBeGreaterThan(0);
	});
});
