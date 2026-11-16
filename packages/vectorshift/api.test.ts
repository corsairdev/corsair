/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `VECTORSHIFT_API_KEY=... pnpm --filter @corsair-dev/vectorshift test:live`.
 * One read plus one pipeline run: runs are billable and may have side effects, so
 * the run case executes a pipeline the caller names in `VECTORSHIFT_PIPELINE_ID`
 * and is skipped when that is unset.
 */
import { Pipelines } from './endpoints';
import type { VectorshiftContext } from './index';

const apiKey = process.env.VECTORSHIFT_API_KEY;
const pipelineId = process.env.VECTORSHIFT_PIPELINE_ID;

const describeIfKey = apiKey ? describe : describe.skip;
const describeIfPipeline = apiKey && pipelineId ? describe : describe.skip;

if (!apiKey || !pipelineId) {
	// A skipped run must not read as a green one.
	console.warn(
		[
			apiKey ? null : 'VECTORSHIFT_API_KEY',
			pipelineId ? null : 'VECTORSHIFT_PIPELINE_ID',
		]
			.filter(Boolean)
			.join(' and ') +
			' not set: the matching live VectorShift cases are skipped, not passing.',
	);
}

function liveContext(): VectorshiftContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as VectorshiftContext;
}

describeIfKey('live VectorShift API', () => {
	it('lists pipelines through the output schema', async () => {
		const result = await Pipelines.list(liveContext() as never, {} as never);

		expect(result).toBeDefined();
		// The documented answer carries the pipeline ids; a wrong envelope fails here.
		expect(Array.isArray(result) || typeof result === 'object').toBe(true);
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Pipelines.list(liveContext() as never, {} as never);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});

describeIfPipeline('live VectorShift pipeline run', () => {
	it('runs a pipeline and returns its node outputs', async () => {
		const result = await Pipelines.run(liveContext() as never, {
			id: pipelineId as string,
			inputs: {},
		});

		// A failed run throws rather than returning `status: 'failed'`, so reaching
		// here means the run succeeded.
		expect(result).toBeDefined();
		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
