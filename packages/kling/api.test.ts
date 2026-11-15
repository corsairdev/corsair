// Live Kling API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   KLING_API_KEY=... pnpm test:live
//
// The checks below are read-only (a single cursor query) so the file never
// spends generation credits, and it skips cleanly when no key is exported.
import { KLING_API_BASE, makeKlingRequest } from './client';
import type { KlingCursorTaskListOutput } from './endpoints/types';
import { KlingCursorTaskListResponseSchema } from './endpoints/types';

const LIVE = process.env.KLING_API_KEY ?? '';
const describeLive = LIVE.length > 0 ? describe : describe.skip;

describeLive('kling live API (env-gated)', () => {
	it('exposes the documented Singapore base URL', () => {
		expect(KLING_API_BASE).toBe('https://api-singapore.klingai.com');
	});

	it('POST /tasks returns the cursor task list envelope', async () => {
		const res = await makeKlingRequest<KlingCursorTaskListOutput>(
			'/tasks',
			LIVE,
			{ method: 'POST', body: { limit: 1 } },
		);

		const parsed = KlingCursorTaskListResponseSchema.parse(res);
		expect(typeof parsed.code).toBe('number');
		expect(Array.isArray(parsed.data.result)).toBe(true);
	});
});
