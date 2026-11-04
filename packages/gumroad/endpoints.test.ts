import { logEventFromContext } from 'corsair/core';
import { GumroadAPIError } from './client';
import { Licenses, Products, Sales, Subscribers } from './endpoints';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './endpoints/types';
import type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
	GumroadOperation,
} from './endpoints/types';
import {
	errorBody,
	product,
	purchase,
	sale,
	subscriber,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'gr-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	// jest types mock calls as any[]; this narrows fetch's (url, init)
	// signature for the last recorded call.
	const call = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url: new URL(call[0]),
		init: call[1],
		headers: new Headers(call[1].headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('endpoint dispatch', () => {
	it('products.list GETs /products with no query', async () => {
		respond({ success: true, products: [product] });

		const result = await invoke(Products.list, {});

		expect(result).toMatchObject({
			success: true,
			products: [{ id: 'A-m3CDDC5dlrSdKZp0RFhA==', name: 'Pencil Icon PSD' }],
		});
		const { url, init } = lastRequest();
		expect(url.pathname).toBe('/v2/products');
		expect(url.search).toBe('');
		expect(init.method).toBe('GET');
	});

	it('products.get embeds the id in the path, encoded', async () => {
		respond({ success: true, product });

		await invoke(Products.get, { id: 'A-m3CDDC5dlrSdKZp0RFhA==' });

		const { url } = lastRequest();
		expect(url.pathname).toBe('/v2/products/A-m3CDDC5dlrSdKZp0RFhA%3D%3D');
	});

	it('sales.list sends every filter and the page cursor', async () => {
		respond({ success: true, sales: [sale] });

		const result = await invoke(Sales.list, {
			after: '2020-09-03',
			before: '2021-09-03',
			product_id: '32-nPainqpLj1B_WIwVlMw==',
			email: 'calvin@gumroad.com',
			order_id: 'FO8TXN-abc',
			name: 'Calvin',
			license_key: '83DB262A-C19D3B06-A5235A6B-8C079166',
			page_key: '20230119081040000000-123456',
		});

		const { url } = lastRequest();
		expect(url.pathname).toBe('/v2/sales');
		expect(url.searchParams.get('after')).toBe('2020-09-03');
		expect(url.searchParams.get('before')).toBe('2021-09-03');
		expect(url.searchParams.get('product_id')).toBe('32-nPainqpLj1B_WIwVlMw==');
		expect(url.searchParams.get('email')).toBe('calvin@gumroad.com');
		expect(url.searchParams.get('order_id')).toBe('FO8TXN-abc');
		expect(url.searchParams.get('name')).toBe('Calvin');
		expect(url.searchParams.get('license_key')).toBe(
			'83DB262A-C19D3B06-A5235A6B-8C079166',
		);
		expect(url.searchParams.get('page_key')).toBe(
			'20230119081040000000-123456',
		);
		expect(result).toMatchObject({
			sales: [{ id: 'B28UKN-dvxYabdavG97Y-Q==' }],
		});
		expect(result.next_page_key).toBeUndefined();
	});

	it('sales.list omits unset filters from the query', async () => {
		respond({ success: true, sales: [] });

		await invoke(Sales.list, {});

		expect(lastRequest().url.search).toBe('');
	});

	it('sales.get embeds the id in the path', async () => {
		respond({ success: true, sale });

		const result = await invoke(Sales.get, { id: 'B28UKN-dvxYabdavG97Y-Q==' });

		expect(lastRequest().url.pathname).toBe(
			'/v2/sales/B28UKN-dvxYabdavG97Y-Q%3D%3D',
		);
		expect(result).toMatchObject({
			sale: { id: 'B28UKN-dvxYabdavG97Y-Q==', refunded: false },
		});
	});

	it('subscribers.list sends the product path and its filters', async () => {
		respond({
			success: true,
			next_page_key: '20241004235318372406-857093235',
			subscribers: [subscriber],
		});

		const result = await invoke(Subscribers.list, {
			product_id: '0ssD7adjRklGBjS5cwlWPq==',
			email: 'calvin@gumroad.com',
			paginated: 'true',
			page_key: '20241004235318372406-857093235',
		});

		const { url } = lastRequest();
		expect(url.pathname).toBe(
			'/v2/products/0ssD7adjRklGBjS5cwlWPq%3D%3D/subscribers',
		);
		expect(url.searchParams.get('email')).toBe('calvin@gumroad.com');
		expect(url.searchParams.get('paginated')).toBe('true');
		expect(url.searchParams.get('page_key')).toBe(
			'20241004235318372406-857093235',
		);
		expect(result).toMatchObject({
			next_page_key: '20241004235318372406-857093235',
			subscribers: [{ status: 'alive' }],
		});
	});

	it('licenses.verify POSTs a form body and defaults the use counter on', async () => {
		respond({ success: true, uses: 3, purchase });

		const result = await invoke(Licenses.verify, {
			product_id: '32-nPAicqbLj8B_WswVlMw==',
			license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
		});

		const { init, headers } = lastRequest();
		expect(init.method).toBe('POST');
		expect(headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
		expect(init.body).toBe(
			'product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD&increment_uses_count=true',
		);
		expect(result).toMatchObject({
			uses: 3,
			purchase: { email: 'customer@example.com', refunded: false },
		});
	});

	it('licenses.verify passes increment_uses_count=false through', async () => {
		respond({ success: true, uses: 3, purchase });

		await invoke(Licenses.verify, {
			product_id: '32-nPAicqbLj8B_WswVlMw==',
			license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
			increment_uses_count: 'false',
		});

		expect(String(lastRequest().init.body)).toContain(
			'increment_uses_count=false',
		);
	});

	it('throws the documented 404 error body for a missing license', async () => {
		respond(
			errorBody('That license does not exist for the provided product.'),
			404,
		);

		await expect(
			invoke(Licenses.verify, {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
			}),
		).rejects.toBeInstanceOf(GumroadAPIError);
	});

	it('throws for a success:false envelope inside a 200 body', async () => {
		respond({ success: false, message: 'The product could not be found.' });

		await expect(
			invoke(Products.get, { id: 'A-m3CDDC5dlrSdKZp0RFhA==' }),
		).rejects.toThrow('The product could not be found.');
	});

	it('logs the event path without filters or bodies', async () => {
		respond({ success: true, sales: [sale] });

		await invoke(Sales.list, {
			email: 'calvin@gumroad.com',
			license_key: '83DB262A-C19D3B06-A5235A6B-8C079166',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gumroad.sales.list',
			{ path: '/sales' },
			'completed',
		);
		const logged = JSON.stringify(mockLog.mock.calls[0]);
		expect(logged).not.toContain('calvin@gumroad.com');
		expect(logged).not.toContain('83DB262A');
	});

	it('parses empty result arrays and missing page cursors', async () => {
		respond({ success: true, sales: [] });

		const result = await invoke(Sales.list, {});

		expect(result).toEqual({ success: true, sales: [] });
	});

	it('passes undocumented vendor fields through on loose outputs', async () => {
		// Loose outputs keep an index signature, so the extra key survives.
		const parsed = GumroadEndpointOutputSchemas.subscribersList.parse({
			success: true,
			subscribers: [{ ...subscriber, new_vendor_field: 'x' }],
		});

		expect(parsed.subscribers[0]?.new_vendor_field).toBe('x');
	});
});

describe('input schemas: accept and reject', () => {
	const verify = Licenses.verify as AnyEndpoint;

	it('accepts the documented date format and rejects others', () => {
		expect(
			GumroadEndpointInputSchemas.salesList.safeParse({
				after: '2020-09-03',
			}).success,
		).toBe(true);
		expect(
			GumroadEndpointInputSchemas.salesList.safeParse({ after: '2020-9-3' })
				.success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.salesList.safeParse({
				after: '03-09-2020',
			}).success,
		).toBe(false);
	});

	it('accepts only the documented "true"/"false" flag strings', () => {
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: 'p==',
				paginated: 'true',
			}).success,
		).toBe(true);
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: 'p==',
				paginated: 'false',
			}).success,
		).toBe(true);
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: 'p==',
				paginated: 'yes',
			}).success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: 'p==',
				paginated: true,
			}).success,
		).toBe(false);
	});

	it('rejects unknown filter keys on strict filter inputs', () => {
		expect(
			GumroadEndpointInputSchemas.salesList.safeParse({ product: 'x' })
				.success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: 'p==',
				customer_email: 'x',
			}).success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.licensesVerify.safeParse({
				product_id: 'p==',
				license_key: 'k',
				uses: 1,
			}).success,
		).toBe(false);
	});

	it('tolerates extra keys on the no-arg products.list input', () => {
		expect(
			GumroadEndpointInputSchemas.productsList.safeParse({
				harmless: 'extra',
			}).success,
		).toBe(true);
	});

	it('rejects empty ids and license keys before any request', async () => {
		expect(
			GumroadEndpointInputSchemas.productsGet.safeParse({ id: '' }).success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.salesGet.safeParse({ id: '' }).success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.subscribersList.safeParse({
				product_id: '',
			}).success,
		).toBe(false);
		await expect(
			invoke(verify, { product_id: '', license_key: 'k' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires both license fields', () => {
		expect(
			GumroadEndpointInputSchemas.licensesVerify.safeParse({
				product_id: 'p==',
			}).success,
		).toBe(false);
		expect(
			GumroadEndpointInputSchemas.licensesVerify.safeParse({
				license_key: 'k',
			}).success,
		).toBe(false);
	});
});

describe('output schemas parse the documented envelopes', () => {
	// unknown: each output schema parses its own payload shape.
	const outputs: Array<[GumroadOperation, unknown]> = [
		['productsList', { success: true, products: [product] }],
		['productsGet', { success: true, product }],
		['salesList', { success: true, sales: [sale], next_page_key: 'k-1' }],
		['salesGet', { success: true, sale }],
		['subscribersList', { success: true, subscribers: [subscriber] }],
		['licensesVerify', { success: true, uses: 3, purchase }],
	];

	it('accepts every documented envelope', () => {
		for (const [operation, payload] of outputs) {
			expect(
				GumroadEndpointOutputSchemas[operation].safeParse(payload).success,
			).toBe(true);
		}
	});

	it('accepts empty list results with no cursor keys', () => {
		expect(
			GumroadEndpointOutputSchemas.salesList.safeParse({
				success: true,
				sales: [],
			}).success,
		).toBe(true);
	});

	it('keeps per-operation types tied together for handlers', () => {
		// Compile-time pairing: each endpoint's input and output flow through
		// the registry types the handlers are typed with.
		type Check<K extends GumroadOperation> = [
			GumroadEndpointInputs[K],
			GumroadEndpointOutputs[K],
		];
		const check: Check<'licensesVerify'> = [
			{ product_id: 'p==', license_key: 'k' },
			{ success: true, uses: 0, purchase },
		];
		expect(check[0].license_key).toBe('k');
	});
});
