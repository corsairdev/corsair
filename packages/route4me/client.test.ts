import { ZodError } from 'zod';
import {
	describeRoute4MeError,
	makeRoute4MeRequest,
	ROUTE4ME_ACCEPT,
	ROUTE4ME_V4_BASE,
	ROUTE4ME_V5_BASE,
	Route4MeAPIError,
} from './client';
import * as Dispatch from './endpoints/dispatch';
import {
	ORDER_ID,
	ROUTE_ID,
	V4_AUTH_ERROR,
	V5_AUTH_ERROR,
	V5_NOT_FOUND,
	V5_VALIDATION_ERROR,
} from './test-fixtures';
import {
	captureError,
	invoke,
	lastRequest,
	respond,
	respondRaw,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('targets the v5 host and sends the key as a query parameter', async () => {
		respond(fetchMock, { data: [], meta: {} });

		await makeRoute4MeRequest('secret-key', {
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/routes/list',
			body: { page: 1 },
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://wh.route4me.com');
		expect(request.path).toBe('/modules/api/v5.0/routes/list');
		expect(ROUTE4ME_V5_BASE).toBe('https://wh.route4me.com/modules');
		expect(request.method).toBe('POST');
		expect(request.query).toEqual({ api_key: 'secret-key' });
		expect(request.json()).toEqual({ page: 1 });
		expect(request.contentType).toContain('application/json');
	});

	it('sends Accept: application/json, which the v5 host needs to answer the API', async () => {
		respond(fetchMock, { ok: true });

		await makeRoute4MeRequest('key', {
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/team/users/me',
			replayable: true,
		});

		expect(lastRequest(fetchMock).headers.get('accept')).toBe(ROUTE4ME_ACCEPT);
	});

	it('targets the v4 host for an optimization read', async () => {
		respond(fetchMock, { optimizations: [], totalRecords: 0 });

		await makeRoute4MeRequest('secret-key', {
			host: 'v4',
			method: 'GET',
			path: '/optimization_problem.php',
			query: { limit: 10 },
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.route4me.com');
		expect(request.path).toBe('/api.v4/optimization_problem.php');
		expect(ROUTE4ME_V4_BASE).toBe('https://api.route4me.com/api.v4');
		expect(request.query).toEqual({ limit: '10', api_key: 'secret-key' });
	});

	it('repeats an array query parameter rather than joining it', async () => {
		respond(fetchMock, { results: [], total: 0, fields: [] });

		await makeRoute4MeRequest('key', {
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/address-book/addresses/index/all',
			query: { fields: ['address_id', 'address_1'] },
			replayable: true,
		});

		expect(lastRequest(fetchMock).allQuery('fields')).toEqual([
			'address_id',
			'address_1',
		]);
	});

	it('sends no body and no content type on a read', async () => {
		respond(fetchMock, {});

		await makeRoute4MeRequest('key', {
			host: 'v5',
			method: 'GET',
			path: '/api/v5.0/vehicles',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('GET');
		expect(request.contentType).toBe('');
	});
});

describe('v4 error envelope', () => {
	it('reads errors and error_code out of the v4 body', async () => {
		respond(fetchMock, V4_AUTH_ERROR, 401);

		const error = (await captureError(
			makeRoute4MeRequest('bad', {
				host: 'v4',
				method: 'GET',
				path: '/optimization_problem.php',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		expect(error).toBeInstanceOf(Route4MeAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		expect(error.errors).toEqual(['Invalid API key']);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe('Route4Me 401: Invalid API key');
	});
});

describe('v5 error envelope', () => {
	it('reads the messages array and the code out of the v5 body', async () => {
		respond(fetchMock, V5_AUTH_ERROR, 401);

		const error = (await captureError(
			makeRoute4MeRequest('bad', {
				host: 'v5',
				method: 'GET',
				path: '/api/v5.0/team/users/me',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		expect(error.status).toBe(401);
		expect(error.errors).toEqual(['Unauthenticated']);
		expect(error.isAuthError).toBe(true);
	});

	it('reports the v5 404 body as a missing record', async () => {
		respond(fetchMock, V5_NOT_FOUND, 404);

		const error = (await captureError(
			makeRoute4MeRequest('key', {
				host: 'v5',
				method: 'GET',
				path: '/api/v5.0/routes/ABCDEF',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		expect(error.status).toBe(404);
		expect(error.isNotFound).toBe(true);
		expect(error.message).toContain('Route4Me 404');
		expect(error.message).toContain("can't find this page");
	});

	it('joins a multi-message validation body', async () => {
		respond(fetchMock, V5_VALIDATION_ERROR, 406);

		const error = (await captureError(
			makeRoute4MeRequest('key', {
				host: 'v5',
				method: 'GET',
				path: '/api/v5.0/address-book/addresses/index/all',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		expect(error.status).toBe(406);
		expect(error.errors).toEqual([
			'The given data was invalid.',
			'The display field must be one of all, routed, unrouted.',
		]);
		expect(error.message).toContain(
			'The display field must be one of all, routed, unrouted.',
		);
	});
});

describe('key hygiene', () => {
	it('does not leak the key through the error', async () => {
		respond(fetchMock, V4_AUTH_ERROR, 401);

		const error = (await captureError(
			makeRoute4MeRequest('super-secret-key', {
				host: 'v4',
				method: 'GET',
				path: '/optimization_problem.php',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		// The cause holds the query string, so it is dropped on purpose.
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-key',
		);
	});

	it('keeps the cause for a transport failure, which never carried the key', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRoute4MeRequest('key', {
				host: 'v5',
				method: 'GET',
				path: '/api/v5.0/vehicles',
				replayable: true,
			}),
		)) as Route4MeAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		// A transport failure never reached Route4Me, so a read is replayable.
		expect(error.replayable).toBe(true);
	});

	it('describes the HTML login page without inventing a code', async () => {
		respondRaw(
			fetchMock,
			'<html><title>Redirecting to login</title></html>',
			200,
		);

		// A 200 login page is not an ApiError, so it reaches the shape and then
		// fails the output parse rather than looking like data.
		const error = await captureError(
			invoke(Dispatch.vehiclesList, {}) as Promise<unknown>,
		);

		expect(error).toBeInstanceOf(ZodError);
		expect(error).not.toBeInstanceOf(Route4MeAPIError);
		expect(error.message).not.toContain('Redirecting');
	});

	it('fails the helper when an expected rejection resolves instead', async () => {
		await expect(captureError(Promise.resolve('data'))).rejects.toThrow(
			'the operation resolved',
		);
	});

	it('describes a bodyless error from the fallback message', () => {
		expect(describeRoute4MeError(500, '<html>', 'Request failed')).toBe(
			'Route4Me 500: Request failed',
		);
		expect(describeRoute4MeError(undefined, {}, 'Request failed')).toBe(
			'Request failed',
		);
	});
});

describe('request method tagging', () => {
	it('records the write method so a 5xx is not replayed', async () => {
		respond(fetchMock, V5_VALIDATION_ERROR, 500);

		const error = (await captureError(
			makeRoute4MeRequest('key', {
				host: 'v5',
				method: 'POST',
				path: '/api/v5.0/orders',
				body: { address_1: 'x' },
				replayable: false,
			}),
		)) as Route4MeAPIError;

		expect(error.method).toBe('POST');
		expect(error.replayable).toBe(false);
		expect(error.status).toBe(500);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps the route id out of a path-encoded request', async () => {
		respond(fetchMock, {});

		await makeRoute4MeRequest('key', {
			host: 'v5',
			method: 'GET',
			path: `/api/v5.0/routes/${ROUTE_ID}`,
			replayable: true,
		});

		expect(lastRequest(fetchMock).path).toBe(
			`/modules/api/v5.0/routes/${ROUTE_ID}`,
		);
	});

	it('serialises a numeric id as a string rather than dropping it', async () => {
		respond(fetchMock, {});

		await makeRoute4MeRequest('key', {
			host: 'v5',
			method: 'POST',
			path: '/api/v5.0/orders',
			body: { order_id: ORDER_ID },
			replayable: false,
		});

		expect(lastRequest(fetchMock).json()).toEqual({ order_id: ORDER_ID });
	});
});
