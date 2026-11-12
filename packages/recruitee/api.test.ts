/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token and company id. Every read goes through its operation's output schema.
 *
 * Run with `RECRUITEE_API_KEY=... RECRUITEE_COMPANY_ID=... pnpm --filter
 * @corsair-dev/recruitee test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RecruiteeContext } from './index';

const apiKey = process.env.RECRUITEE_API_KEY;
const companyId = process.env.RECRUITEE_COMPANY_ID;

const describeIfKey = apiKey && companyId ? describe : describe.skip;

if (!(apiKey && companyId)) {
	// A skipped run must not read as a green one.
	console.warn(
		`RECRUITEE_API_KEY and RECRUITEE_COMPANY_ID are both needed: ${
			apiKey ? 'company id' : 'token'
		} is missing, so the live Recruitee suite is skipped, not passing.`,
	);
}

function liveContext(): RecruiteeContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and the company id, so the fixture is cast.
	return {
		key: apiKey,
		options: { company_id: companyId },
	} as unknown as RecruiteeContext;
}

describeIfKey('live Recruitee API', () => {
	it('lists offers through the output schema', async () => {
		const result = await Endpoints.offersList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.offers)).toBe(true);
	});

	it('lists departments and locations', async () => {
		const departments = await Endpoints.departmentsList(
			liveContext() as never,
			{} as never,
		);
		expect(Array.isArray(departments.departments)).toBe(true);

		const locations = await Endpoints.locationsList(
			liveContext() as never,
			{} as never,
		);
		expect(Array.isArray(locations.locations)).toBe(true);
	});

	it('searches candidates through the output schema', async () => {
		const result = await Endpoints.candidatesList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.candidates)).toBe(true);
	});
});
