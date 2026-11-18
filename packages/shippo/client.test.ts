import { makeShippoRequest, ShippoAPIError, segment } from './client';
import { errorDetail, fieldErrors, notFound, shipment } from './test-fixtures';
import { createHarness } from './test-helpers';

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

// unknown: response bodies come from the fixtures above and from inline
// literals, so the helper cannot take a narrower type.
function respond(body: unknown, status = 200) {
	return new Response(status === 204 ? null : JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function lastRequest() {
	const [url, init] = h.fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the caller serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

describe('makeShippoRequest', () => {
	it('sends `Authorization: ShippoToken …`, not Bearer', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(shipment));

		await makeShippoRequest('shippo_test_abc123', {
			method: 'GET',
			path: '/shipments/1',
		});

		const sent = lastRequest();
		expect(sent.origin).toBe('https://api.goshippo.com');
		expect(sent.path).toBe('/shipments/1');
		expect(sent.headers.get('authorization')).toBe(
			'ShippoToken shippo_test_abc123',
		);
		// A Bearer header would authenticate nothing here.
		expect(sent.headers.get('authorization')).not.toContain('Bearer');
	});

	it('always sends SHIPPO-API-VERSION, so behaviour cannot drift to latest', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(shipment));

		await makeShippoRequest('key', { method: 'GET', path: '/shipments/1' });

		expect(lastRequest().headers.get('shippo-api-version')).toBe('2018-02-08');
	});

	it('sends SHIPPO-ACCOUNT-ID only when a managed account is named', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(shipment));
		await makeShippoRequest('key', { method: 'GET', path: '/shipments/1' });
		expect(lastRequest().headers.get('shippo-account-id')).toBeNull();

		h.fetchMock.mockResolvedValueOnce(respond(shipment));
		await makeShippoRequest('key', {
			method: 'GET',
			path: '/shipments/1',
			shippoAccountId: 'managed-account-id',
		});
		expect(lastRequest().headers.get('shippo-account-id')).toBe(
			'managed-account-id',
		);
	});

	it('serializes a JSON body with the matching media type', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(shipment));

		await makeShippoRequest('key', {
			method: 'POST',
			path: '/shipments',
			body: { address_from: 'id', address_to: 'id2' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ address_from: 'id', address_to: 'id2' });
	});

	it('omits undefined query values rather than sending "undefined"', async () => {
		h.fetchMock.mockResolvedValueOnce(respond({ results: [] }));

		await makeShippoRequest('key', {
			method: 'GET',
			path: '/addresses',
			query: { page: undefined, results: 10 },
		});

		expect(lastRequest().query).toEqual({ results: '10' });
	});

	it('turns the 401 `{ detail }` envelope into an INVALID_TOKEN error', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(errorDetail, 401));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('key', { method: 'GET', path: '/addresses' }),
		);

		expect(error).toBeInstanceOf(ShippoAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_TOKEN');
		expect(error.message).toBe('Shippo 401: Token does not exist');
	});

	it('reads a 400 field-error body into `fieldErrors`', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(fieldErrors, 400));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('key', {
				method: 'POST',
				path: '/shipments',
				body: {},
			}),
		);

		expect(error.status).toBe(400);
		expect(error.code).toBe('VALIDATION_ERROR');
		expect(error.fieldErrors).toEqual({
			address_to: ['is required'],
			country: ['"XX" is not a valid country code.'],
		});
		// The message names the field, not just "Bad Request".
		expect(error.message).toContain('address_to: is required');
	});

	it('keeps `detail` out of `fieldErrors` on a 404', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(notFound, 404));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('key', { method: 'GET', path: '/shipments/nope' }),
		);

		expect(error.status).toBe(404);
		expect(error.fieldErrors).toBeUndefined();
		expect(error.message).toBe('Shippo 404: Not found.');
	});

	it('flags a 429 as a rate limit so error-handlers can retry it', async () => {
		h.fetchMock.mockResolvedValueOnce(respond({ detail: 'Throttled' }, 429));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('key', { method: 'GET', path: '/addresses' }),
		);

		expect(error.isRateLimit).toBe(true);
	});

	it('never puts the token in the message or an inspect dump', async () => {
		h.fetchMock.mockResolvedValueOnce(respond(errorDetail, 401));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('shippo_live_supersecret', {
				method: 'GET',
				path: '/addresses',
			}),
		);

		expect(error.message).not.toContain('supersecret');
		expect(JSON.stringify(error)).not.toContain('supersecret');
		expect(require('node:util').inspect(error)).not.toContain('supersecret');
	});

	it('wraps a transport failure and keeps the method for replay decisions', async () => {
		h.fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await h.failure<ShippoAPIError>(
			makeShippoRequest('key', { method: 'POST', path: '/transactions' }),
		);

		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.message).toBe('fetch failed');
	});
});

describe('segment', () => {
	it('encodes a path segment so an id cannot change the route', () => {
		expect(segment('1/../carrier_accounts')).toBe('1%2F..%2Fcarrier_accounts');
		expect(segment('usps')).toBe('usps');
	});
});
