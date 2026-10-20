// Live Octen API tests. These spend account credits, so the file is excluded
// from the default run by `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it explicitly with:
//
//   OCTEN_API_KEY=... pnpm test:live
//
// Without OCTEN_API_KEY every test below is skipped, so `pnpm test` stays green.
import { makeOctenRequest } from './client';
import {
	EmbeddingResponseSchema,
	ExtractResponseSchema,
	SearchResponseSchema,
} from './endpoints/types';

const LIVE = process.env.OCTEN_API_KEY ?? '';
const describeLive = LIVE.length > 0 ? describe : describe.skip;

describeLive('octen live API (env-gated)', () => {
	it('POST /search returns web results', async () => {
		const res = await makeOctenRequest('/search', LIVE, {
			method: 'POST',
			body: { query: 'Octen AI search API', count: 3 },
		});

		const parsed = SearchResponseSchema.parse(res);
		expect((parsed.results ?? []).length).toBeGreaterThan(0);
	});

	it('POST /extract returns page content for one URL', async () => {
		const res = await makeOctenRequest('/extract', LIVE, {
			method: 'POST',
			body: { urls: ['https://octen.ai'], format: 'markdown' },
		});

		const parsed = ExtractResponseSchema.parse(res);
		expect((parsed.results ?? []).length).toBeGreaterThan(0);
		expect(parsed.results?.[0]?.url).toContain('octen.ai');
	});

	it('POST /embedding returns vectors for one input', async () => {
		const res = await makeOctenRequest('/embedding', LIVE, {
			method: 'POST',
			body: { input: ['hello world'], model: 'octen-embedding-4b' },
		});

		const parsed = EmbeddingResponseSchema.parse(res);
		expect((parsed.results ?? []).length).toBe(1);
		expect((parsed.results?.[0]?.embedding ?? []).length).toBeGreaterThan(0);
	});
});
