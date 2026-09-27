/**
 * Live Workable API tests — read-only, type-safe, env-gated.
 *
 * Needs `WORKABLE_API_KEY` (Settings > Integrations > Apps token) and
 * `WORKABLE_SUBDOMAIN` (the `<subdomain>` in https://<subdomain>.workable.com).
 * Without both, the suite skips so CI stays hermetic — no live key is ever
 * committed (R6). Every response is validated with the endpoint zod output
 * schema, so a passing run proves the schemas match the real API.
 *
 * @see https://workable.readme.io/reference/generate-an-access-token
 */
import { makeWorkablePublicRequest, makeWorkableRequest } from './client';
import { WorkableEndpointOutputSchemas } from './endpoints/types';

const LIVE_TOKEN: string = process.env.WORKABLE_API_KEY ?? '';
const LIVE_SUBDOMAIN: string = process.env.WORKABLE_SUBDOMAIN ?? '';
const RUN_LIVE: boolean = LIVE_TOKEN.length > 0 && LIVE_SUBDOMAIN.length > 0;
const describeLive = RUN_LIVE ? describe : describe.skip;

describeLive('Workable live API (read-only)', () => {
	it('departments.list matches the output schema', async () => {
		const raw = await makeWorkableRequest(
			'/departments',
			LIVE_TOKEN,
			LIVE_SUBDOMAIN,
		);
		const parsed = WorkableEndpointOutputSchemas.departmentsList.parse(raw);
		expect(Array.isArray(parsed.departments)).toBe(true);
	});

	it('jobs.list matches the output schema', async () => {
		const raw = await makeWorkableRequest('/jobs', LIVE_TOKEN, LIVE_SUBDOMAIN, {
			query: { limit: 10 },
		});
		const parsed = WorkableEndpointOutputSchemas.jobsList.parse(raw);
		expect(Array.isArray(parsed.jobs)).toBe(true);
	});

	it('members.list matches the output schema', async () => {
		const raw = await makeWorkableRequest(
			'/members',
			LIVE_TOKEN,
			LIVE_SUBDOMAIN,
			{
				query: { limit: 10 },
			},
		);
		const parsed = WorkableEndpointOutputSchemas.membersList.parse(raw);
		expect(Array.isArray(parsed.members)).toBe(true);
	});

	it('candidates.list matches the output schema', async () => {
		const raw = await makeWorkableRequest(
			'/candidates',
			LIVE_TOKEN,
			LIVE_SUBDOMAIN,
			{
				query: { limit: 10 },
			},
		);
		const parsed = WorkableEndpointOutputSchemas.candidatesList.parse(raw);
		expect(Array.isArray(parsed.candidates)).toBe(true);
	});

	it('stages.list matches the output schema', async () => {
		const raw = await makeWorkableRequest(
			'/stages',
			LIVE_TOKEN,
			LIVE_SUBDOMAIN,
		);
		const parsed = WorkableEndpointOutputSchemas.stagesList.parse(raw);
		expect(parsed).toBeDefined();
	});

	it('subscriptions.list matches the output schema', async () => {
		const raw = await makeWorkableRequest(
			'/subscriptions',
			LIVE_TOKEN,
			LIVE_SUBDOMAIN,
		);
		const parsed = WorkableEndpointOutputSchemas.subscriptionsList.parse(raw);
		expect(parsed).toBeDefined();
	});

	it('public job board matches the output schema without authentication', async () => {
		const raw = await makeWorkablePublicRequest(LIVE_SUBDOMAIN);
		const parsed = WorkableEndpointOutputSchemas.publicJobsList.parse(raw);
		expect(parsed).toBeDefined();
	});

	it('public locations match the output schema without authentication', async () => {
		const raw = await makeWorkablePublicRequest(
			LIVE_SUBDOMAIN,
			undefined,
			'/locations',
		);
		const parsed = WorkableEndpointOutputSchemas.publicLocationsList.parse(raw);
		expect(Array.isArray(parsed)).toBe(true);
	});
});

describe('Workable live API guard', () => {
	it('documents the env-gated skip instead of failing without credentials', () => {
		expect(typeof RUN_LIVE).toBe('boolean');
		if (RUN_LIVE) {
			expect(LIVE_TOKEN.length).toBeGreaterThan(0);
			expect(LIVE_SUBDOMAIN.length).toBeGreaterThan(0);
		} else {
			expect(LIVE_TOKEN.length === 0 || LIVE_SUBDOMAIN.length === 0).toBe(true);
		}
	});
});
