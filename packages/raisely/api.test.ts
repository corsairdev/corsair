/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema.
 *
 * Run with `RAISELY_API_KEY=... pnpm --filter @corsair-dev/raisely test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RaiselyContext } from './index';

const apiKey = process.env.RAISELY_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'RAISELY_API_KEY is not set: the live Raisely suite is skipped, not passing.',
	);
}

function liveContext(): RaiselyContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as RaiselyContext;
}

describeIfKey('live Raisely API', () => {
	it('lists campaigns through the output schema', async () => {
		const result = await Endpoints.campaignsList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.campaigns)).toBe(true);
		expect(result.next_offset).not.toBe('');
	});

	it('reads the first campaign back by uuid and lists its profiles', async () => {
		const page = await Endpoints.campaignsList(
			liveContext() as never,
			{
				limit: 1,
			} as never,
		);

		const first = page.campaigns[0];
		if (first?.uuid === undefined) return;

		const one = await Endpoints.campaignsGet(
			liveContext() as never,
			{
				campaign: first.uuid,
			} as never,
		);
		expect(one.campaign.uuid).toBe(first.uuid);

		const profiles = await Endpoints.profilesList(
			liveContext() as never,
			{
				campaign: first.uuid,
				limit: 2,
			} as never,
		);
		expect(Array.isArray(profiles.profiles)).toBe(true);
	});

	it('lists donations through the output schema', async () => {
		const result = await Endpoints.donationsList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.donations)).toBe(true);
	});

	it('lists designations through the output schema', async () => {
		const result = await Endpoints.designationsList(
			liveContext() as never,
			{
				limit: 2,
			} as never,
		);

		expect(Array.isArray(result.designations)).toBe(true);
	});
});
