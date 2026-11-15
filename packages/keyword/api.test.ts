import { createCorsair } from 'corsair/core';
import { KeywordEndpointOutputSchemas as Outputs } from './endpoints/types';
import { keyword } from './index';

// Live smoke tests. They run only with a real token, and every answer goes
// through the operation's output schema before an assertion touches it, so a
// field typed wrongly fails here as well as for a caller. Read-only: nothing
// here adds a keyword, spends a refresh or deletes anything.
const apiKey = process.env.KEYWORD_API_KEY;
const projectName = process.env.KEYWORD_PROJECT_NAME;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	// A skipped run must not read as a pass.
	console.warn('KEYWORD_API_KEY is not set: live tests skipped');
}

describeIfKey('Keyword live API', () => {
	const corsair = createCorsair({
		plugins: [keyword({ key: apiKey })],
	});

	it('lists the projects through the output schema', async () => {
		const parsed = Outputs.projectsList.parse(
			await corsair.keyword.api.projects.list({}),
		);

		expect(Array.isArray(parsed.data)).toBe(true);
		for (const project of parsed.data) {
			expect(typeof project.id).toBe('string');
			// The project's own auth key must never reach a caller.
			expect(project.attributes).not.toHaveProperty('auth');
		}
	}, 30_000);

	it('reads the token’s own account through the output schema', async () => {
		const parsed = Outputs.accountGet.parse(
			await corsair.keyword.api.account.get({}),
		);

		expect(typeof parsed.data.id).toBe('string');
	}, 30_000);

	// A project-scoped read needs a project, so it runs only when one is named.
	// The name is narrowed here rather than at the module level, which is what
	// the test body can see.
	const project = projectName;
	const maybeProjectTest = project ? it : it.skip;

	maybeProjectTest(
		'reads one project’s keywords through the output schema',
		async () => {
			if (!project) return;
			const parsed = Outputs.keywordsList.parse(
				await corsair.keyword.api.keywords.list({
					projectName: project,
					per_page: 10,
				}),
			);

			expect(Array.isArray(parsed.data)).toBe(true);
			for (const entry of parsed.data) {
				expect(entry.attributes).not.toHaveProperty('auth');
			}
		},
		30_000,
	);
});

if (!projectName) {
	// Name the missing variable so a partial run cannot read as complete.
	console.warn(
		'KEYWORD_PROJECT_NAME is not set: the project-scoped live test is skipped',
	);
}
