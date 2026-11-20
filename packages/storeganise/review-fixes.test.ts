import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeStoreganiseRequest } from './client';
import { storeganise } from './index';

const BASE = 'https://spaceup.storeganise.com/api/v1';
let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// Queued responses come first; any other request fails instead of
	// reaching the real API.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unexpected request in a unit test'));
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

describe('errors (R8)', () => {
	it('rebuild core ApiError without the PUT body that carries access codes', async () => {
		respond({ error: { type: 'BadGateway' } }, 502);

		const error = await failure(
			makeStoreganiseRequest('sg-test-key', {
				method: 'PUT',
				base: BASE,
				path: '/admin/unit-rentals/r1',
				body: { customFields: { myAC_accessCode: '918273' } },
			}),
		);
		expect(error.status).toBe(502);
		expect(error.request.body).toBeUndefined();
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('918273');
	});

	it('keep an email used as a user id out of the error URL', async () => {
		respond({ error: { type: 'NotFound', message: 'Not found' } }, 404);

		const error = await failure(
			makeStoreganiseRequest('sg-test-key', {
				method: 'GET',
				base: BASE,
				path: `/admin/users/${encodeURIComponent('jane@example.com')}`,
			}),
		);
		expect(error.url).not.toContain('jane');
		expect(JSON.stringify(error)).not.toContain('example.com');
	});

	it("don't fall back to core's message, which embeds the whole body", async () => {
		respond({ errors: { email: 'jane@example.com is taken' } }, 400);

		const error = await failure(
			makeStoreganiseRequest('sg-test-key', {
				method: 'GET',
				base: BASE,
				path: '/admin/users',
			}),
		);
		expect(error.message).not.toContain('jane@example.com');
	});

	it('let a transport failure through unchanged', async () => {
		const transport = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(transport);

		await expect(
			makeStoreganiseRequest('sg-test-key', {
				method: 'GET',
				base: BASE,
				path: '/admin/units',
			}),
		).rejects.toBe(transport);
	});
});

describe('keyBuilder', () => {
	it('asks for a connect link when the account has a key but no business code', async () => {
		const plugin = storeganise();
		const keys = {
			get_api_key: jest.fn().mockResolvedValue('sg-test-key'),
			get_business_code: jest.fn().mockResolvedValue(null),
		};
		await expect(
			plugin.keyBuilder?.({ keys, authType: 'api_key' } as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns the key when the business code is stored', async () => {
		const plugin = storeganise();
		const keys = {
			get_api_key: jest.fn().mockResolvedValue('sg-test-key'),
			get_business_code: jest.fn().mockResolvedValue('spaceup'),
		};
		await expect(
			plugin.keyBuilder?.({ keys, authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('sg-test-key');
	});
});
