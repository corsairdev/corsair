import { createCorsair } from 'corsair/core';
import { NeuronwriterEndpointOutputSchemas as Outputs } from './endpoints/types';
import { neuronwriter } from './index';

/**
 * Live smoke test. Read-only: nothing here starts an analysis, which would
 * spend one Content Writer credit from the account's monthly limit, and nothing
 * imports content, which would write a revision.
 *
 * Skipped unless NEURONWRITER_API_KEY is set, and the skip is logged so it
 * cannot read as a pass. The API needs a Gold plan or higher.
 */
const apiKey = process.env.NEURONWRITER_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NEURONWRITER_API_KEY is not set: live tests skipped');
}

describeIfKey('NEURONwriter live API', () => {
	const corsair = createCorsair({
		plugins: [neuronwriter({ key: apiKey })],
	});

	it('lists projects through the output schema', async () => {
		const parsed = Outputs.projectsList.parse(
			await corsair.neuronwriter.api.projects.list({}),
		);

		expect(Array.isArray(parsed.projects)).toBe(true);
		for (const project of parsed.projects) {
			expect(typeof project.project).toBe('string');
			expect(typeof project.name).toBe('string');
		}
	}, 30_000);

	it('lists queries in the first project through the output schema', async () => {
		const { projects } = Outputs.projectsList.parse(
			await corsair.neuronwriter.api.projects.list({}),
		);
		const project = projects[0]?.project;
		// An account with no projects has nothing to list here.
		if (!project) return;

		const parsed = Outputs.queriesList.parse(
			await corsair.neuronwriter.api.queries.list({ project }),
		);
		expect(Array.isArray(parsed.queries)).toBe(true);
		for (const query of parsed.queries) {
			expect(typeof query.query).toBe('string');
		}
	}, 30_000);

	it('reads a finished analysis and its content through the output schemas', async () => {
		const { projects } = Outputs.projectsList.parse(
			await corsair.neuronwriter.api.projects.list({}),
		);
		const project = projects[0]?.project;
		if (!project) return;

		const { queries } = Outputs.queriesList.parse(
			await corsair.neuronwriter.api.queries.list({
				project,
				status: 'ready',
			}),
		);
		const query = queries[0]?.query;
		// A project with no ready query has nothing to read.
		if (!query) return;

		// The analysis itself, which must be ready because it was filtered so.
		const analysis = Outputs.analysisGet.parse(
			await corsair.neuronwriter.api.analysis.get({ query }),
		);
		expect(analysis.status).toBe('ready');
		expect(typeof analysis.metrics?.word_count?.target).toBe('number');

		// And its last saved revision.
		const content = Outputs.contentGet.parse(
			await corsair.neuronwriter.api.content.get({ query }),
		);
		expect(typeof content.content).toBe('string');
	}, 60_000);
});
