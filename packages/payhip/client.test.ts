import { inspect } from 'node:util';
import {
	describePayhipError,
	makePayhipRequest,
	PayhipAPIError,
} from './client';
import { authFail, coupon } from './test-fixtures';

const API_KEY = 'ph-test-key';
const PRODUCT_SECRET = 'prod-secret';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<PayhipAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PayhipAPIError);
	if (!(error instanceof PayhipAPIError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePayhipRequest', () => {
	it('sends both credential headers; each route reads the one it needs', async () => {
		respond({ data: coupon }, 200);

		await makePayhipRequest(
			API_KEY,
			{ method: 'GET', path: '/api/v2/coupons', auth: 'account' },
			PRODUCT_SECRET,
		);

		const sent = lastCall();
		expect(sent.url).toBe('https://payhip.com/api/v2/coupons');
		expect(sent.headers.get('payhip-api-key')).toBe(API_KEY);
		expect(sent.headers.get('product-secret-key')).toBe(PRODUCT_SECRET);
	});

	it('sends form-encoded bodies, not JSON', async () => {
		respond({ data: coupon }, 200);

		await makePayhipRequest(
			API_KEY,
			{
				method: 'POST',
				path: '/api/v2/coupons',
				auth: 'account',
				form: { code: 'example123', percent_off: '25' },
			},
			undefined,
		);

		const sent = lastCall();
		expect(String(sent.init.body)).toBe('code=example123&percent_off=25');
		expect(sent.headers.get('content-type')).toContain(
			'application/x-www-form-urlencoded',
		);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(authFail, 401);

		const error = await failure(
			makePayhipRequest(
				API_KEY,
				{ method: 'GET', path: '/api/v2/coupons', auth: 'account' },
				undefined,
			),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('failed to authenticate');
		expect(error.name).toBe('PayhipAPIError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(authFail, 401);

		const error = await failure(
			makePayhipRequest(
				API_KEY,
				{
					method: 'PUT',
					path: '/api/v2/license/disable',
					auth: 'product',
					form: { license_key: 'WTKP4-66NL5-HMKQW-GFSCZ' },
				},
				PRODUCT_SECRET,
			),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('WTKP4');
		expect(error.message).not.toContain('WTKP4');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePayhipRequest(
				API_KEY,
				{ method: 'GET', path: '/api/v2/coupons', auth: 'account' },
				undefined,
			),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond({ data: { coupons: [coupon] } }, 200);

		const result = await makePayhipRequest(
			API_KEY,
			{ method: 'GET', path: '/api/v2/coupons', auth: 'account' },
			undefined,
		);
		expect(result).toEqual({ data: { coupons: [coupon] } });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePayhipError', () => {
	it('reads the documented { code, message, success } envelope', () => {
		expect(describePayhipError(authFail, 'fallback')).toBe(
			'failed to authenticate',
		);
	});

	it('falls back on anything else', () => {
		expect(describePayhipError(null, 'fallback')).toBe('fallback');
	});
});
