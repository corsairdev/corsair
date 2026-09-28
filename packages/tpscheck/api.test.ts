// Live TPSCheck API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   TPSCHECK_API_KEY=... pnpm test:live
//
// Per the docs, /status and /credits are free while /check and /batch
// consume one credit per number, so this file never runs on an exported
// key by accident.
import { makeTpscheckRequest } from './client';
import type {
	BatchResponse,
	CheckResponse,
	CreditsResponse,
	StatusResponse,
} from './endpoints/types';
import {
	BatchResponseSchema,
	CheckResponseSchema,
	CreditsResponseSchema,
	StatusResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.TPSCHECK_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('tpscheck live API (env-gated)', () => {
	it('GET /status is public and returns the version payload', async () => {
		const res = await makeTpscheckRequest<StatusResponse>(
			'/status',
			undefined,
			{ method: 'GET' },
		);

		const parsed = StatusResponseSchema.parse(res);
		expect(parsed.status).toBe('ok');
		expect(typeof parsed.version).toBe('string');
	});

	it('GET /credits returns usage for the live key', async () => {
		const res = await makeTpscheckRequest<CreditsResponse>(
			'/credits',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = CreditsResponseSchema.parse(res);
		expect(typeof parsed.requests_used).toBe('number');
		expect(typeof parsed.requests_remaining).toBe('number');
		expect(typeof parsed.monthly_limit).toBe('number');
		expect(typeof parsed.plan).toBe('string');
	});

	it('POST /check verifies a single number', async () => {
		const res = await makeTpscheckRequest<CheckResponse>('/check', LIVE_KEY, {
			method: 'POST',
			body: { phone: '01829 830730' },
			query: { version: '2' },
		});

		const parsed = CheckResponseSchema.parse(res);
		expect(typeof parsed.valid).toBe('boolean');
		expect(typeof parsed.input).toBe('string');
	});

	it('POST /batch verifies multiple numbers', async () => {
		const res = await makeTpscheckRequest<BatchResponse>('/batch', LIVE_KEY, {
			method: 'POST',
			body: { phones: ['01564 331484', '01953 498974'] },
			query: { version: '2' },
		});

		const parsed = BatchResponseSchema.parse(res);
		expect(parsed.results.length).toBe(2);
		for (const result of parsed.results) {
			expect(typeof result.valid).toBe('boolean');
		}
	});
});
