import { StorerocketEndpointOutputSchemas as Outputs } from './endpoints/types';
import { storerocket } from './index';

/**
 * Live smoke test against the documented reads. Set STOREROCKET_TOKEN to
 * run it; without the variable the whole suite skips (a skipped run is not
 * a pass). Every read goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const describeIfKey = process.env.STOREROCKET_TOKEN ? describe : describe.skip;

if (!process.env.STOREROCKET_TOKEN) {
	console.warn(
		'Storerocket live smoke skipped: set STOREROCKET_TOKEN to run it.',
	);
}

describeIfKey('storerocket live smoke', () => {
	const token = process.env.STOREROCKET_TOKEN as string;

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: token } as never;
	const plugin = storerocket({ key: token });

	it('reads the token profile through its output schema', async () => {
		const result = await plugin.endpoints!.users.get(ctx, {});
		Outputs.usersGet.parse(result);
	});

	it('lists projects through its output schema', async () => {
		const result = await plugin.endpoints!.projects.list(ctx, {});
		Outputs.projectsList.parse(result);
	});

	it('lists locations of the first project through its output schema', async () => {
		const { data: projects } = await plugin.endpoints!.projects.list(ctx, {});
		if (projects.length === 0) return;
		const result = await plugin.endpoints!.locations.list(ctx, {
			projectId: projects[0]!.id as string,
			limit: 5,
		});
		Outputs.locationsList.parse(result);
	});
});
