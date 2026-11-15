// Live Hub Planner API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\\.test\\.ts"); run it with:
//
//   HUBPLANNER_API_KEY=... pnpm test:live
//
// Read-only queries to prevent unintended data modification during test verification.
import { makeHubPlannerRequest } from './client';
import type { Booking, Project, Resource } from './endpoints/types';
import {
	BookingsListResponseSchema,
	ProjectsListResponseSchema,
	ResourcesListResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.HUBPLANNER_API_KEY ?? '';
const hasLiveKey = LIVE_KEY.length > 0;

if (!hasLiveKey) {
	console.warn('Skipping live tests: HUBPLANNER_API_KEY is not set');
}

const describeLive = hasLiveKey ? describe : describe.skip;

describeLive('Hub Planner live API (env-gated smoke tests)', () => {
	it('GET /project retrieves project list', async () => {
		const res = await makeHubPlannerRequest<Project[]>('/project', LIVE_KEY, {
			method: 'GET',
			query: { limit: 5 },
		});

		const parsed = ProjectsListResponseSchema.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('GET /resource retrieves resource list', async () => {
		const res = await makeHubPlannerRequest<Resource[]>('/resource', LIVE_KEY, {
			method: 'GET',
			query: { limit: 5 },
		});

		const parsed = ResourcesListResponseSchema.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('GET /booking retrieves bookings', async () => {
		const res = await makeHubPlannerRequest<Booking[]>('/booking', LIVE_KEY, {
			method: 'GET',
			query: { limit: 5 },
		});

		const parsed = BookingsListResponseSchema.parse(res);
		expect(Array.isArray(parsed)).toBe(true);
	});
});
