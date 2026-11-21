import { logEventFromContext } from 'corsair/core';
import { Coupons, License } from './endpoints';
import {
	coupon,
	couponsList,
	disabledLicenseKey,
	licenseKey,
	usedLicenseKey,
} from './test-fixtures';

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
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	secret = PRODUCT_SECRET,
) {
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_product_secret_key: () => Promise.resolve(secret) },
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('coupons', () => {
	it('create POSTs the form-encoded coupon body', async () => {
		respond({ data: coupon }, 200);
		await invoke(Coupons.create, {
			code: 'example123',
			coupon_type: 'single',
			product_key: 'PtRJw',
			percent_off: 25,
			usage_limit: 10,
		});
		const sent = lastRequest();
		expect(sent.origin).toBe('https://payhip.com');
		expect(sent.path).toBe('/api/v2/coupons');
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('payhip-api-key')).toBe(API_KEY);
		// Field order follows the schema's key order, not the doc example's.
		expect(sent.body).toBe(
			'code=example123&coupon_type=single&percent_off=25&product_key=PtRJw&usage_limit=10',
		);
	});

	it('list GETs coupons with limit and offset', async () => {
		respond(couponsList);
		await invoke(Coupons.list, { limit: 10, offset: 5 });
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v2/coupons');
		expect(sent.query['limit']).toBe('10');
		expect(sent.query['offset']).toBe('5');
	});

	it('get reads one coupon by id', async () => {
		respond({ data: coupon });
		await invoke(Coupons.get, { couponId: 1495522137 });
		expect(lastRequest().path).toBe('/api/v2/coupons/1495522137');
	});
});

describe('license keys', () => {
	it('verify GETs the license state with the product secret header', async () => {
		respond(licenseKey);
		await invoke(License.verify, { license_key: 'WTKP4-66NL5-HMKQW-GFSCZ' });
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v2/license/verify');
		expect(sent.query['license_key']).toBe('WTKP4-66NL5-HMKQW-GFSCZ');
		expect(sent.headers.get('product-secret-key')).toBe(PRODUCT_SECRET);
		expect(sent.headers.has('payhip-api-key')).toBe(false);
	});

	it('disable PUTs the form-encoded license key', async () => {
		respond(disabledLicenseKey);
		const result = (await invoke(License.disable, {
			license_key: 'WTKP4-66NL5-HMKQW-GFSCZ',
		})) as { data: { enabled: boolean } };
		expect(result.data.enabled).toBe(false);
		const sent = lastRequest();
		expect(sent.path).toBe('/api/v2/license/disable');
		expect(sent.body).toBe('license_key=WTKP4-66NL5-HMKQW-GFSCZ');
	});

	it('enable PUTs to the enable route', async () => {
		respond(licenseKey);
		await invoke(License.enable, { license_key: 'WTKP4-66NL5-HMKQW-GFSCZ' });
		expect(lastRequest().path).toBe('/api/v2/license/enable');
	});

	it('increaseUsage PUTs to the usage route', async () => {
		respond(usedLicenseKey);
		const result = (await invoke(License.increaseUsage, {
			license_key: 'WTKP4-66NL5-HMKQW-GFSCZ',
		})) as { data: { uses: number } };
		expect(result.data.uses).toBe(2);
		expect(lastRequest().path).toBe('/api/v2/license/usage');
	});

	it('decreaseUsage PUTs to the decrease route', async () => {
		respond(usedLicenseKey);
		await invoke(License.decreaseUsage, {
			license_key: 'WTKP4-66NL5-HMKQW-GFSCZ',
		});
		expect(lastRequest().path).toBe('/api/v2/license/decrease');
	});

	it('refuses a license call when no product secret is stored', async () => {
		await expect(
			invoke(License.verify, { license_key: 'WTKP4' }, ''),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
