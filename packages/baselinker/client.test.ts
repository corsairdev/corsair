import type { BaseLinkerAPIError } from './client';
import { makeBaseLinkerRequest } from './client';

const TOKEN = 'fake-baselinker-token-for-tests-only';
const originalFetch = global.fetch;

type RecordedCall = { url: string; init: RequestInit };
let lastCall: RecordedCall | undefined;

function mockResponse(body: unknown, status = 200) {
	global.fetch = (async (url: string, init: RequestInit) => {
		lastCall = { url, init };
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? 'OK' : 'Error',
			url,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

function recorded(): RecordedCall {
	if (!lastCall) throw new Error('No request was recorded');
	return lastCall;
}

function header(name: string): string | null {
	return new Headers(recorded().init.headers).get(name);
}

afterAll(() => {
	global.fetch = originalFetch;
});

beforeEach(() => {
	lastCall = undefined;
});

describe('makeBaseLinkerRequest', () => {
	it('posts every method to the canonical connector endpoint', async () => {
		mockResponse({ status: 'SUCCESS', inventories: [] });
		await makeBaseLinkerRequest('getInventories', TOKEN);

		expect(recorded().url).toBe('https://api.baselinker.com/connector.php');
		expect(recorded().init.method).toBe('POST');
		expect(header('Content-Type')).toBe('application/x-www-form-urlencoded');
	});

	it('authenticates only with X-BLToken', async () => {
		mockResponse({ status: 'SUCCESS' });
		await makeBaseLinkerRequest('getInventories', TOKEN);

		expect(header('X-BLToken')).toBe(TOKEN);
		expect(header('Authorization')).toBeNull();
		expect(recorded().url).not.toContain(TOKEN);
	});

	it('form-encodes the method and JSON parameters', async () => {
		mockResponse({ status: 'SUCCESS', orders: [] });
		await makeBaseLinkerRequest('getOrders', TOKEN, {
			date_from: 1_700_000_000,
			include_custom_extra_fields: false,
		});

		const form = new URLSearchParams(String(recorded().init.body));
		expect(form.get('method')).toBe('getOrders');
		expect(JSON.parse(form.get('parameters') ?? '')).toEqual({
			date_from: 1_700_000_000,
			include_custom_extra_fields: false,
		});
	});

	it('removes undefined values recursively while preserving false and zero', async () => {
		mockResponse({ status: 'SUCCESS' });
		await makeBaseLinkerRequest('setOrderFields', TOKEN, {
			order_id: 42,
			star: 0,
			want_invoice: false,
			ignored: undefined,
			nested: { kept: 'yes', ignored: undefined },
		});

		const form = new URLSearchParams(String(recorded().init.body));
		expect(JSON.parse(form.get('parameters') ?? '')).toEqual({
			order_id: 42,
			star: 0,
			want_invoice: false,
			nested: { kept: 'yes' },
		});
	});

	it('turns BaseLinker logical errors returned with HTTP 200 into errors', async () => {
		mockResponse({
			status: 'ERROR',
			error_code: 'ERROR_INVALID_PARAMETERS',
			error_message: 'Invalid parameters',
		});

		await expect(makeBaseLinkerRequest('getOrders', TOKEN, {})).rejects.toEqual(
			expect.objectContaining<BaseLinkerAPIError>({
				name: 'BaseLinkerAPIError',
				message: 'Invalid parameters',
				code: 'ERROR_INVALID_PARAMETERS',
				method: 'getOrders',
			}),
		);
	});
});
