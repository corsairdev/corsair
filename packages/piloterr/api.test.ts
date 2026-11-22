import type { InternalPiloterrPlugin } from './index';
import { piloterr } from './index';

/**
 * Live smoke: usage and job polling are the only free calls, so this suite
 * runs only when PILOTERR_API_KEY is set (a key consumes credits on every
 * other endpoint). Without it the whole suite skips (a skipped run is not
 * a pass). Every answer goes through its output schema so a wrongly typed
 * field fails here rather than for a caller.
 */
const apiKey = process.env.PILOTERR_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn(
		'PILOTERR_API_KEY not set; skipping live smoke tests (create a key at https://app.piloterr.com)',
	);
}

describeIfKey('piloterr live smoke', () => {
	const plugin: InternalPiloterrPlugin = piloterr({ key: apiKey as string });

	// The endpoints read the key off the context; a direct call supplies it
	// rather than going through the runtime.
	const ctx = { key: apiKey as string, options: {} } as never;

	it('reads usage without consuming credits', async () => {
		const usage = await plugin.endpoints!.account.usage(ctx, {});
		expect(typeof usage.remaining).toBe('number');
	});

	it('rejects a missing job with a 404 (live: "Job or content not found")', async () => {
		await expect(
			plugin.endpoints!.account.getJob(ctx, {
				id: '00000000-nonexistent-job',
			}),
		).rejects.toMatchObject({ status: 404 });
	});
});
