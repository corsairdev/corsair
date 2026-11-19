import {
	baseForBusiness,
	describeStoreganiseError,
	makeStoreganiseRequest,
	StoreganiseAPIError,
} from './client';
import { unauthorized, unit } from './test-fixtures';

const API_KEY = 'sg-secret-test-key';
const BASE = 'https://spaceup.storeganise.com/api/v1';

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
async function failure(
	promise: Promise<unknown>,
): Promise<StoreganiseAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(StoreganiseAPIError);
	if (!(error instanceof StoreganiseAPIError)) throw error;
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

describe('baseForBusiness', () => {
	it('builds the per-tenant API base', () => {
		expect(baseForBusiness('spaceup')).toBe(
			'https://spaceup.storeganise.com/api/v1',
		);
	});

	it('rejects a business code that is not a subdomain slug', () => {
		expect(() => baseForBusiness('evil.example.com')).toThrow(
			'not a subdomain slug',
		);
		expect(() => baseForBusiness('')).toThrow('not a subdomain slug');
		expect(() => baseForBusiness('space up')).toThrow('not a subdomain slug');
	});
});

describe('makeStoreganiseRequest', () => {
	it('authenticates with the literal ApiKey scheme', async () => {
		respond(unit, 200);

		const result = await makeStoreganiseRequest(API_KEY, {
			method: 'GET',
			base: BASE,
			path: '/admin/units',
		});

		expect(result).toEqual(unit);
		const { url, init, headers } = lastCall();
		expect(url).toBe(`${BASE}/admin/units`);
		expect(init.method).toBe('GET');
		// "ApiKey" is the scheme itself; the docs say it must not be replaced.
		expect(headers.get('authorization')).toBe(`ApiKey ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('sends a PUT body as JSON with the right content type', async () => {
		respond({ ...unit, customFields: { myAC_accessCode: '482913' } }, 200);

		await makeStoreganiseRequest(API_KEY, {
			method: 'PUT',
			base: BASE,
			path: '/admin/unit-rentals/5d9f2c8bbf3e2c0017a4b1c3',
			body: { customFields: { myAC_accessCode: '482913' } },
		});

		const { init, headers } = lastCall();
		expect(init.method).toBe('PUT');
		expect(headers.get('content-type')).toBe('application/json');
		expect(String(init.body)).toBe(
			'{"customFields":{"myAC_accessCode":"482913"}}',
		);
	});

	it('does not send a body on GET', async () => {
		respond([], 200);

		await makeStoreganiseRequest(API_KEY, {
			method: 'GET',
			base: BASE,
			path: '/admin/sites',
		});

		expect(lastCall().init.body).toBeUndefined();
	});

	it('extracts the documented error envelope into the message', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeStoreganiseRequest(API_KEY, {
				method: 'GET',
				base: BASE,
				path: '/admin/users',
			}),
		);
		expect(error.message).toBe('Storeganise 401: Not authorized');
		expect(error.status).toBe(401);
		expect(error.body).toEqual(unauthorized);
		expect(error.method).toBe('GET');
	});

	it('falls back to the error type when there is no message', async () => {
		respond({ error: { type: 'Unauthorized' } }, 401);

		const error = await failure(
			makeStoreganiseRequest(API_KEY, {
				method: 'GET',
				base: BASE,
				path: '/admin/users',
			}),
		);
		expect(error.message).toBe('Storeganise 401: Unauthorized');
	});

	it('keeps the status only in the message when the body is not the envelope', async () => {
		respond('Not Found', 404);

		const error = await failure(
			makeStoreganiseRequest(API_KEY, {
				method: 'GET',
				base: BASE,
				path: '/admin/nothing',
			}),
		);
		expect(error.message).toBe('Storeganise 404: Not Found');
	});

	it('copies retryAfter from the response onto the error without retrying, because no rate-limit contract is documented', async () => {
		respond('Too Many Requests', 429, { 'Retry-After': '7' });

		const error = await failure(
			makeStoreganiseRequest(API_KEY, {
				method: 'GET',
				base: BASE,
				path: '/admin/units',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('describeStoreganiseError', () => {
	it('prefers the envelope message', () => {
		expect(describeStoreganiseError(unauthorized, 'fallback')).toBe(
			'Not authorized',
		);
	});

	it('falls back when the body has nothing readable', () => {
		expect(describeStoreganiseError(null, 'fallback')).toBe('fallback');
		expect(describeStoreganiseError({}, 'fallback')).toBe('fallback');
	});
});
