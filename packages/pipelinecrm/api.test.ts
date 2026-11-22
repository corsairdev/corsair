import type { InternalPipelineCrmPlugin } from './index';
import { pipelinecrm } from './index';

/**
 * Live smoke: read-only, few calls. PIPELINE_CRM_API_TOKEN is an API token
 * from the Pipeline CRM profile (pcrm_live_…); without it the whole suite
 * skips (a skipped run is not a pass). Every answer goes through its
 * output schema so a wrongly typed field fails here rather than for a
 * caller.
 */
const token = process.env.PIPELINE_CRM_API_TOKEN;
const describeIfKey = token ? describe : describe.skip;

if (!token) {
	console.warn(
		'PIPELINE_CRM_API_TOKEN not set; skipping live smoke tests (create an API token in the Pipeline CRM profile)',
	);
}

describeIfKey('pipelinecrm live smoke', () => {
	const plugin: InternalPipelineCrmPlugin = pipelinecrm({
		key: token as string,
	});

	// The endpoints read the token off the context; a direct call supplies
	// it rather than going through the runtime.
	const ctx = { key: token as string, options: {} } as never;

	it('lists deals through the output schema', async () => {
		const page = await plugin.endpoints!.deals.list(ctx, { perPage: 5 });
		expect(Array.isArray(page.entries)).toBe(true);
	});

	it('lists users through the output schema', async () => {
		const page = await plugin.endpoints!.users.list(ctx, {});
		expect(Array.isArray(page.entries)).toBe(true);
	});

	it('reads stage totals through the output schema', async () => {
		const totals = await plugin.endpoints!.deals.totalsByStage(ctx, {});
		expect(Array.isArray(totals)).toBe(true);
	});
});
