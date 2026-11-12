/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * key. Every read goes through its operation's output schema.
 *
 * Run with `REFERRALROCK_API_KEY=... pnpm --filter @corsair-dev/referralrock test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { ReferralrockContext } from './index';

const apiKey = process.env.REFERRALROCK_API_KEY;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'REFERRALROCK_API_KEY is not set: the live Referral Rock suite is skipped, not passing.',
	);
}

function liveContext(): ReferralrockContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as ReferralrockContext;
}

describeIfKey('live Referral Rock API', () => {
	it('lists programs through the output schema', async () => {
		const result = await Endpoints.programsList(
			liveContext() as never,
			{} as never,
		);

		expect(Array.isArray(result.programs)).toBe(true);
		expect(result.programs[0]?.name).toBeTruthy();
	});

	it('lists members through the output schema', async () => {
		const result = await Endpoints.membersList(
			liveContext() as never,
			{
				count: 2,
			} as never,
		);

		expect(Array.isArray(result.members)).toBe(true);
		expect(result.next_offset).not.toBe('');
	});

	it('lists referrals and rewards', async () => {
		const referrals = await Endpoints.referralsList(
			liveContext() as never,
			{
				count: 2,
			} as never,
		);
		expect(Array.isArray(referrals.referrals)).toBe(true);

		const rewards = await Endpoints.rewardsList(
			liveContext() as never,
			{
				count: 2,
			} as never,
		);
		expect(Array.isArray(rewards.rewards)).toBe(true);
	});
});
