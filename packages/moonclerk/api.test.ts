import { ApiError } from 'corsair/http';
import type { MoonClerkContext } from './index';
import { moonclerk } from './index';

// Live suite: runs against the real API when MOONCLERK_API_KEY is set.
// CI skips files named *api.test.ts.
const key = process.env.MOONCLERK_API_KEY;
const live = key ? describe : describe.skip;
if (!key) {
	console.warn(
		'MOONCLERK_API_KEY is not set; skipping the MoonClerk live suite',
	);
}

const endpoints = moonclerk().endpoints;
const ctx = { key } as MoonClerkContext;
// An id no account has, to check the get routes answer 404 rather than 401.
const MISSING_ID = 999999999;

live('MoonClerk live API', () => {
	it('forms.list returns the forms envelope', async () => {
		const result = await endpoints.forms.list(ctx, { count: 5 });
		expect(Array.isArray(result.forms)).toBe(true);
	});
	it('customers.list returns the customers envelope', async () => {
		const result = await endpoints.customers.list(ctx, {
			count: 5,
			status: 'active',
		});
		expect(Array.isArray(result.customers)).toBe(true);
	});
	it('payments.list returns the payments envelope', async () => {
		const result = await endpoints.payments.list(ctx, {
			count: 5,
			date_from: '2026-01-01',
		});
		expect(Array.isArray(result.payments)).toBe(true);
	});
	it.each([
		['forms.get', () => endpoints.forms.get(ctx, { id: MISSING_ID })],
		['customers.get', () => endpoints.customers.get(ctx, { id: MISSING_ID })],
		['payments.get', () => endpoints.payments.get(ctx, { id: MISSING_ID })],
	])('%s answers 404 for an unknown id', async (_name, call) => {
		const error = await call().then(
			() => undefined,
			(e: unknown) => e,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
	});
});
