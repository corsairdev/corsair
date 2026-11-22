import { logEventFromContext } from 'corsair/core';
import { Coupons, License } from './endpoints';
import { coupon, licenseKey } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'ph-test-key';
const PRODUCT_SECRET = 'prod-secret';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_product_secret_key: () => Promise.resolve(PRODUCT_SECRET) },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a created coupon', async () => {
		respond({ data: coupon });
		const result = (await invoke(Coupons.create, {
			code: 'example123',
			coupon_type: 'single',
			product_key: 'PtRJw',
			percent_off: 25,
		})) as { data: { code?: string } };
		expect(result.data.code).toBe('example123');
	});

	it('parses a coupon page', async () => {
		respond({ data: { coupons: [coupon] } });
		const page = (await invoke(Coupons.list, {})) as {
			data: { coupons: Array<{ id: number }> };
		};
		expect(page.data.coupons[0]?.id).toBe(1495522137);
	});

	it('parses a verified license key', async () => {
		respond(licenseKey);
		const result = (await invoke(License.verify, {
			license_key: 'WTKP4-66NL5-HMKQW-GFSCZ',
		})) as { data: { enabled?: boolean; uses?: number } };
		expect(result.data.enabled).toBe(true);
		expect(result.data.uses).toBe(0);
	});

	it('rejects a license answer with no data object', async () => {
		respond({ success: true });
		await rejects(License.verify, { license_key: 'x' }, 'data');
	});
});

describe('input validation', () => {
	it('rejects a coupon with neither percent_off nor amount_off', async () => {
		await rejects(
			Coupons.create,
			{ code: 'x', coupon_type: 'multi' },
			'percent_off or amount_off',
		);
	});

	it('rejects a coupon with both percent_off and amount_off', async () => {
		await rejects(
			Coupons.create,
			{ code: 'x', coupon_type: 'multi', percent_off: 10, amount_off: 500 },
			'not both',
		);
	});

	it('rejects a single-product coupon without a product_key', async () => {
		await rejects(
			Coupons.create,
			{ code: 'x', coupon_type: 'single', percent_off: 10 },
			'product_key is required',
		);
	});

	it('rejects a collection coupon without a collection_id', async () => {
		await rejects(
			Coupons.create,
			{ code: 'x', coupon_type: 'collection', percent_off: 10 },
			'collection_id is required',
		);
	});

	it('rejects a percent_off above 100', async () => {
		await rejects(
			Coupons.create,
			{ code: 'x', coupon_type: 'multi', percent_off: 150 },
			'100',
		);
	});
});
