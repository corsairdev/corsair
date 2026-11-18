import { LEMONSQUEEZY_API_BASE, makeLemonSqueezyRequest } from './client';
import { captureError } from './test-errors';

// Live smoke tests. CI skips `api.test.ts` by design, and so does the plugin
// gate; run it with `pnpm --filter @corsair-dev/lemonsqueezy test:live`.
//
// Every call here is read-only: the store lists, the account, and one resource
// by id. Nothing is created, refunded or cancelled, so a run costs nothing and
// changes nothing in the store.
const KEY = process.env.LEMONSQUEEZY_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'LEMONSQUEEZY_API_KEY is not set; the live Lemon Squeezy suite is skipped',
	);
}

type ListDocument = {
	data: { type: string; id: string }[];
	meta: {
		page: { currentPage: number; lastPage: number; total?: number | null };
	};
};

describeIfKey('Lemon Squeezy live', () => {
	const apiKey = KEY as string;

	it('reads the account behind the key', async () => {
		const body = await makeLemonSqueezyRequest<{
			data: { id: string; attributes: { email?: string | null } };
		}>(apiKey, { method: 'GET', path: '/v1/users/me' });

		expect(body.data.id).toBeTruthy();
		expect(typeof body.data.attributes.email).toBe('string');
	});

	it('lists stores and reads the first one back', async () => {
		const list = await makeLemonSqueezyRequest<ListDocument>(apiKey, {
			method: 'GET',
			path: '/v1/stores',
		});
		expect(Array.isArray(list.data)).toBe(true);
		expect(list.meta.page.currentPage).toBe(1);

		const first = list.data[0];
		if (!first) {
			// A key with no store is a valid account; nothing to read back.
			expect(list.data).toEqual([]);
			return;
		}
		const store = await makeLemonSqueezyRequest<{
			data: { id: string; attributes: { currency?: string | null } };
		}>(apiKey, { method: 'GET', path: `/v1/stores/${first.id}` });
		expect(store.data.id).toBe(first.id);
	});

	it('lists every catalog collection', async () => {
		// The empty collections are the point: this proves each route exists and
		// answers JSON:API, which is what an invented path would fail.
		for (const path of [
			'/v1/products',
			'/v1/variants',
			'/v1/prices',
			'/v1/files',
			'/v1/orders',
			'/v1/order-items',
			'/v1/customers',
			'/v1/subscriptions',
			'/v1/subscription-items',
			'/v1/subscription-invoices',
			'/v1/discounts',
			'/v1/discount-redemptions',
			'/v1/license-keys',
			'/v1/license-key-instances',
			'/v1/checkouts',
			'/v1/webhooks',
			'/v1/usage-records',
			'/v1/affiliates',
		]) {
			const body = await makeLemonSqueezyRequest<ListDocument>(apiKey, {
				method: 'GET',
				path,
			});
			expect({ path, isList: Array.isArray(body.data) }).toEqual({
				path,
				isList: true,
			});
			expect(body.meta.page.currentPage).toBe(1);
		}
	});

	it('rejects a page size over the documented cap', async () => {
		const error = await captureError(
			makeLemonSqueezyRequest(apiKey, {
				method: 'GET',
				path: '/v1/customers',
				query: { 'page[size]': 101 },
			}),
		);

		expect((error as { status?: number }).status).toBe(400);
		expect((error as Error).message).toContain('page.size');
	});

	it('rejects a bad key with a 401', async () => {
		const error = await captureError(
			makeLemonSqueezyRequest('bogus-key', {
				method: 'GET',
				path: '/v1/stores',
			}),
		);
		expect((error as { status?: number }).status).toBe(401);
	});

	it('points at the documented host', () => {
		expect(LEMONSQUEEZY_API_BASE).toBe('https://api.lemonsqueezy.com');
	});
});
