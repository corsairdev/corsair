// Live LaunchDarkly API tests. Excluded from default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\\.test\\.ts"); run with:
//
//   LAUNCHDARKLY_API_KEY=... pnpm test:live
//
import { makeLaunchDarklyRequest } from './client';
import {
	ProjectsListOutputSchema,
	RootGetOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.LAUNCHDARKLY_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping authenticated LaunchDarkly live tests: LAUNCHDARKLY_API_KEY is unset.',
	);
}

describe('launchdarkly live API smoke tests', () => {
	it('GET /api/v2 is public and returns the root link collection', async () => {
		// `unknown` because live HTTP response is narrowed by Zod schema parse.
		const res: unknown = await makeLaunchDarklyRequest('/api/v2', undefined, {
			method: 'GET',
		});

		const parsed = RootGetOutputSchema.parse(res);
		expect(parsed.links).toBeDefined();
		expect(typeof parsed.links).toBe('object');
	});

	describeLive('authenticated read-only smoke (env-gated)', () => {
		it('GET /api/v2/projects retrieves projects collection', async () => {
			// `unknown` because live HTTP response is narrowed by Zod schema parse.
			const res: unknown = await makeLaunchDarklyRequest(
				'/api/v2/projects',
				LIVE_KEY,
				{
					method: 'GET',
					query: { limit: 5 },
				},
			);

			const parsed = ProjectsListOutputSchema.parse(res);
			expect(Array.isArray(parsed.items)).toBe(true);
		});
	});
});
