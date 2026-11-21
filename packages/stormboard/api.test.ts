import { StormboardEndpointOutputSchemas as Outputs } from './endpoints/types';
import { stormboard } from './index';

/**
 * Live smoke test against the documented reads. Set STORMBOARD_API_KEY to
 * run it; without the variable the whole suite skips (a skipped run is not
 * a pass). Every read goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const describeIfKey = process.env.STORMBOARD_API_KEY ? describe : describe.skip;

if (!process.env.STORMBOARD_API_KEY) {
	console.warn(
		'Stormboard live smoke skipped: set STORMBOARD_API_KEY to run it.',
	);
}

describeIfKey('stormboard live smoke', () => {
	const apiKey = process.env.STORMBOARD_API_KEY as string;
	const plugin = stormboard({ key: apiKey });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey } as never;

	it('checks authentication through its output schema', async () => {
		const result = await plugin.endpoints!.users.test(ctx, {});
		Outputs.usersTest.parse(result);
	});

	it('reads the profile through its output schema', async () => {
		const result = await plugin.endpoints!.users.getProfile(ctx, {});
		Outputs.usersGetProfile.parse(result);
	});

	it('lists storms through its output schema and one storm page of ideas', async () => {
		const result = await plugin.endpoints!.storms.list(ctx, { results: 5 });
		Outputs.stormsList.parse(result);
		const first = result.storms[0];
		if (!first) return;
		const ideas = await plugin.endpoints!.storms.listIdeas(ctx, {
			stormId: first.id as number,
		});
		Outputs.stormsListIdeas.parse(ideas);
	});

	it('lists the invite inbox through its output schema', async () => {
		const result = await plugin.endpoints!.storms.listInvites(ctx, {});
		Outputs.stormsListInvites.parse(result);
	});
});
