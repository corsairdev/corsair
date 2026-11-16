// Live HoneyHive API tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`.
// Run with:
//   HONEYHIVE_API_KEY=... pnpm test:live

import { makeHoneyHiveRequest } from './client';
import type {
	ConfigurationsListResponse,
	MetricsListResponse,
} from './endpoints/types';
import {
	ConfigurationsListResponseSchema,
	MetricsListResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.HONEYHIVE_API_KEY ?? process.env.HH_API_KEY ?? '';
if (!LIVE_KEY) {
	console.warn(
		'Skipping live tests: HONEYHIVE_API_KEY or HH_API_KEY is not set',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('HoneyHive live API read-only smoke tests (env-gated)', () => {
	it('GET /v1/configurations lists existing configurations', async () => {
		const res = await makeHoneyHiveRequest<ConfigurationsListResponse>(
			'/v1/configurations',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = ConfigurationsListResponseSchema.parse(res);
		expect(parsed).toBeDefined();
		if (parsed.configurations) {
			expect(Array.isArray(parsed.configurations)).toBe(true);
		}
	});

	it('GET /v1/metrics lists existing metrics and evaluators', async () => {
		const res = await makeHoneyHiveRequest<MetricsListResponse>(
			'/v1/metrics',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = MetricsListResponseSchema.parse(res);
		expect(parsed).toBeDefined();
		if (parsed.metrics) {
			expect(Array.isArray(parsed.metrics)).toBe(true);
		}
	});
});
