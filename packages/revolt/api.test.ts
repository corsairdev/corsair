/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a
 * token. Every read goes through its operation's output schema.
 *
 * Run with `REVOLT_BOT_TOKEN=... pnpm --filter @corsair-dev/revolt test:live`.
 */

import * as Endpoints from './endpoints/endpoints';
import type { RevoltContext } from './index';

const apiKey = process.env.REVOLT_BOT_TOKEN;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a green one.
	console.warn(
		'REVOLT_BOT_TOKEN is not set: the live Revolt suite is skipped, not passing.',
	);
}

function liveContext(): RevoltContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key` and the credential, so the fixture is cast.
	return {
		key: apiKey,
		options: { credential: 'bot' },
	} as unknown as RevoltContext;
}

describeIfKey('live Revolt API', () => {
	it('reads the account behind the bot token', async () => {
		const result = await Endpoints.userMe(liveContext() as never, {} as never);

		expect(result.user._id).toBeTruthy();
		expect(result.user.username).toBeTruthy();
	});

	it('lists the DM channels', async () => {
		const result = await Endpoints.userDms(liveContext() as never, {} as never);

		expect(Array.isArray(result.channels)).toBe(true);
	});

	it('reads a channel’s messages through the output schema', async () => {
		const dms = await Endpoints.userDms(liveContext() as never, {} as never);
		const channel = dms.channels[0];
		if (!channel?._id) return;

		const result = await Endpoints.messagesList(
			liveContext() as never,
			{
				channel_id: channel._id,
				limit: 2,
			} as never,
		);
		expect(Array.isArray(result.messages)).toBe(true);
	});
});
