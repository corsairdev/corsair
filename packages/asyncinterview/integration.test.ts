/**
 * Live checks against app.asyncinterview.ai.
 * Run with ASYNC_INTERVIEW_API_KEY set. Skipped in CI.
 */
import { asyncinterview } from './index';

const KEY = process.env.ASYNC_INTERVIEW_API_KEY;
const maybe = KEY ? describe : describe.skip;

maybe('AsyncInterview live API', () => {
	const plugin = asyncinterview({ key: KEY });
	const ctx = {
		key: KEY,
		plugin,
		db: {
			jobs: {
				upsertByEntityId: async () => undefined,
				deleteByEntityId: async () => true,
			},
			interviews: {
				upsertByEntityId: async () => undefined,
				deleteByEntityId: async () => true,
			},
		},
	} as never;

	it('lists jobs with numeric ids', async () => {
		const jobs = await plugin.endpoints!.jobs.list(ctx, {});
		expect(Array.isArray(jobs)).toBe(true);
		if (jobs[0]) {
			expect(typeof jobs[0].id).toBe('number');
			expect(jobs[0].title).toEqual(expect.any(String));
		}
	});

	it('lists interview responses', async () => {
		const rows = await plugin.endpoints!.jobs.listResponses(ctx, {});
		expect(Array.isArray(rows)).toBe(true);
		if (rows[0]) {
			expect(typeof rows[0]?.id).toBe('number');
			expect(typeof rows[0]?.job_id).toBe('number');
		}
	});
});
