import { makeThinkificRequest } from './client';
import { ThinkificOperationOutputSchemas } from './endpoints/schemas';

const apiKey = process.env.THINKIFIC_API_KEY;
const subdomain = process.env.THINKIFIC_SUBDOMAIN;
const hasLiveCredentials = Boolean(apiKey && subdomain);
const liveTest = hasLiveCredentials ? test : test.skip;

if (!hasLiveCredentials) {
	console.warn(
		'Skipping Thinkific live smoke test: set THINKIFIC_API_KEY and THINKIFIC_SUBDOMAIN to enable the read-only courses request.',
	);
}

describe('Thinkific live API smoke test', () => {
	liveTest(
		'reads and validates one page of courses without printing account data',
		async () => {
			if (!apiKey || !subdomain) {
				throw new Error(
					'Thinkific live credentials disappeared during the test',
				);
			}

			const response = await makeThinkificRequest(
				'courses',
				apiKey,
				subdomain,
				{
					method: 'GET',
					query: { page: 1, limit: 1 },
				},
			);
			const parsed =
				ThinkificOperationOutputSchemas.courses_list.parse(response);
			expect(parsed).toBeDefined();
		},
	);
});
