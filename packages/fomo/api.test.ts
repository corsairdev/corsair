// Live Fomo API smoke tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`; run explicitly with:
//
//   FOMO_API_KEY=... pnpm test:live
//
// Tests in this file are read-only to avoid side-effects on live accounts.
import { makeFomoRequest } from './client';
import type {
	ApplicationGetOutput,
	EventsListOutput,
	TemplatesListOutput,
} from './endpoints/types';
import {
	ApplicationGetOutputSchema,
	EventsListOutputSchema,
	TemplatesListOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.FOMO_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Fomo live API tests: FOMO_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Fomo live API smoke tests (env-gated)', () => {
	it('GET /applications/me retrieves application settings', async () => {
		const res = await makeFomoRequest<ApplicationGetOutput>(
			'/applications/me',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = ApplicationGetOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});

	it('GET /applications/me/events lists events', async () => {
		const res = await makeFomoRequest<EventsListOutput>(
			'/applications/me/events',
			LIVE_KEY,
			{ method: 'GET', query: { per: 5 } },
		);

		const parsed = EventsListOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});

	it('GET /applications/me/event_types lists templates', async () => {
		const res = await makeFomoRequest<TemplatesListOutput>(
			'/applications/me/event_types',
			LIVE_KEY,
			{ method: 'GET', query: { per: 5 } },
		);

		const parsed = TemplatesListOutputSchema.parse(res);
		expect(parsed).toBeDefined();
	});
});
