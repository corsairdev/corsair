import { createCorsair } from 'corsair/core';
import { NewrelicEndpointOutputSchemas as Outputs } from './endpoints/types';
import { newrelic } from './index';

/**
 * Live smoke test. Every answer goes through its output schema before an
 * assertion touches it, so a field typed wrongly fails here as well as for a
 * caller.
 *
 * Read-only: nothing here creates or deletes a policy. A NRQL query costs
 * nothing beyond the call itself.
 *
 * Skipped unless NEWRELIC_API_KEY is set, and the skip is logged so it cannot
 * read as a pass. An EU account also needs NEWRELIC_REGION=eu, because a key is
 * only valid in its own data centre.
 */
const apiKey = process.env.NEWRELIC_API_KEY;
const region = process.env.NEWRELIC_REGION === 'eu' ? 'eu' : 'us';
const accountId = Number(process.env.NEWRELIC_ACCOUNT_ID ?? '');
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) console.warn('NEWRELIC_API_KEY is not set: live tests skipped');
if (!process.env.NEWRELIC_ACCOUNT_ID) {
	console.warn('NEWRELIC_ACCOUNT_ID is not set: the NRQL test is skipped');
}

describeIfKey('New Relic live API', () => {
	const corsair = createCorsair({
		plugins: [newrelic({ key: apiKey })],
	});

	it('lists applications through the output schema', async () => {
		const parsed = Outputs.applicationsList.parse(
			await corsair.newrelic.api.applications.list({ region }),
		);

		expect(Array.isArray(parsed.applications)).toBe(true);
		for (const app of parsed.applications) {
			expect(typeof app.id).toBe('number');
			expect(typeof app.name).toBe('string');
			// A colour such as green, orange (yellow), red, gray or unknown.
			expect(typeof app.health_status).toBe('string');
		}
	}, 30_000);

	it('lists alert policies through the output schema', async () => {
		const parsed = Outputs.policiesList.parse(
			await corsair.newrelic.api.alerts.policies({ region }),
		);

		expect(Array.isArray(parsed.policies)).toBe(true);
		for (const policy of parsed.policies) {
			expect(typeof policy.id).toBe('number');
			expect(typeof policy.name).toBe('string');
		}
	}, 30_000);

	it('reads conditions for the first policy when one exists', async () => {
		const { policies } = Outputs.policiesList.parse(
			await corsair.newrelic.api.alerts.policies({ region }),
		);
		const policyId = policies[0]?.id;
		// An account with no policies has nothing to read here.
		if (!policyId) return;

		const parsed = Outputs.conditionsList.parse(
			await corsair.newrelic.api.alerts.conditions({ region, policyId }),
		);
		expect(Array.isArray(parsed.conditions)).toBe(true);
	}, 30_000);

	it('reads metric series for the first app when one exists', async () => {
		const { applications: apps } = Outputs.applicationsList.parse(
			await corsair.newrelic.api.applications.list({ region }),
		);
		const applicationId = apps[0]?.id;
		if (!applicationId) return;

		const parsed = Outputs.metricsData.parse(
			await corsair.newrelic.api.metrics.get({
				region,
				applicationId,
				names: ['Apdex'],
				summarize: true,
			}),
		);
		expect(Array.isArray(parsed.metric_data.metrics)).toBe(true);
	}, 30_000);

	it('runs a NRQL query through the output schema', async () => {
		if (!accountId) return;

		const parsed = Outputs.queryNrql.parse(
			await corsair.newrelic.api.query.nrql({
				region,
				accountId,
				query: 'SELECT count(*) FROM Transaction SINCE 1 hour ago',
			}),
		);
		expect(Array.isArray(parsed.results)).toBe(true);
	}, 30_000);
});
