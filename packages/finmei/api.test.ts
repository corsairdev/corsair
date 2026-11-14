// Live Finmei API tests. Excluded from default runs by
// `testPathIgnorePatterns` in `jest.config.cjs`; run explicitly via:
//   FINMEI_API_KEY=... pnpm test:live
//
// These tests execute only read-only operations against an authenticated account
// and never print the API key or mutate data.

import { makeFinmeiRequest } from './client';
import type {
	FinmeiCurrency,
	FinmeiExpense,
	FinmeiInvoice,
	FinmeiProfile,
} from './endpoints/types';
import {
	FinmeiListCurrenciesOutputSchema,
	FinmeiListExpensesOutputSchema,
	FinmeiListInvoicesOutputSchema,
	FinmeiProfileOutputSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.FINMEI_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Finmei live API tests: FINMEI_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Finmei live API (env-gated smoke tests)', () => {
	it('GET /profile retrieves business profile', async () => {
		// `unknown` because response is validated at runtime.
		const res: unknown = await makeFinmeiRequest<{ data: FinmeiProfile }>(
			'/profile',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = FinmeiProfileOutputSchema.parse(res);
		expect(typeof parsed.data.business_id).toBe('string');
	});

	it('GET /currencies lists supported currencies', async () => {
		// `unknown` because response is validated at runtime.
		const res: unknown = await makeFinmeiRequest<{ data: FinmeiCurrency[] }>(
			'/currencies',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = FinmeiListCurrenciesOutputSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
		expect(parsed.data.length).toBeGreaterThan(0);
	});

	it('GET /invoices lists invoices for authenticated business', async () => {
		// `unknown` because response is validated at runtime.
		const res: unknown = await makeFinmeiRequest<{ data: FinmeiInvoice[] }>(
			'/invoices',
			LIVE_KEY,
			{ method: 'GET', query: { per_page: 5 } },
		);

		const parsed = FinmeiListInvoicesOutputSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('GET /expenses lists expenses for authenticated business', async () => {
		// `unknown` because response is validated at runtime.
		const res: unknown = await makeFinmeiRequest<{ data: FinmeiExpense[] }>(
			'/expenses',
			LIVE_KEY,
			{ method: 'GET', query: { per_page: 5 } },
		);

		const parsed = FinmeiListExpensesOutputSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
