// Live Gleap API tests. Excluded from default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\\.test\\.ts"); run it with:
//
//   GLEAP_API_KEY=... pnpm test:live
//
// Tests only read-only safe endpoints to verify authentication and connectivity.
import { makeGleapRequest } from './client';
import type {
	BoardsListOutput,
	TeamsListOutput,
	TicketsListOutput,
	UsersGetMeOutput,
} from './endpoints/types';
import {
	BoardsListOutputSchema,
	TeamsListOutputSchema,
	TicketsListOutputSchema,
	UsersGetMeOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.GLEAP_API_KEY ?? '';
if (!LIVE_KEY) {
	console.warn('Skipping Gleap live API tests: GLEAP_API_KEY is not set');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Gleap live API (env-gated)', () => {
	it('GET /users/me retrieves current user profile', async () => {
		const res = await makeGleapRequest<UsersGetMeOutput>(
			'/users/me',
			LIVE_KEY,
			{
				method: 'GET',
			},
		);
		const parsed = UsersGetMeOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});

	it('GET /tickets lists tickets for authenticated project', async () => {
		const res = await makeGleapRequest<TicketsListOutput>(
			'/tickets',
			LIVE_KEY,
			{
				method: 'GET',
				query: { limit: 5 },
			},
		);
		const parsed = TicketsListOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});

	it('GET /ticket-types lists project boards', async () => {
		const res = await makeGleapRequest<BoardsListOutput>(
			'/ticket-types',
			LIVE_KEY,
			{
				method: 'GET',
			},
		);
		const parsed = BoardsListOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});

	it('GET /teams lists project teams', async () => {
		const res = await makeGleapRequest<TeamsListOutput>('/teams', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = TeamsListOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});
});
