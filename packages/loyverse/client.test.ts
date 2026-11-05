/**
 * Covers the transport: the bearer header, the versioned base, the separate
 * unauthenticated metadata base, the raw-binary image upload, and the rate-limit
 * retry. Network access is mocked, so this runs in CI.
 *
 * Every value here is fictional.
 */
import { ApiError } from 'corsair/http';
import {
	LOYVERSE_API_BASE,
	LOYVERSE_IMAGE_MEDIA_TYPE,
	LOYVERSE_ROOT_BASE,
	makeLoyverseMetadataRequest,
	makeLoyverseRequest,
	uploadLoyverseImage,
} from './client';

const TOKEN = 'test-token';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
	rawBody?: unknown;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;
let attempts = 0;

/**
 * Installs a fetch stub that answers each call with the next response in the
 * list, repeating the last one once the list is exhausted. The cast is the usual
 * one for replacing a global: the stub implements only the slice of the `fetch`
 * contract `request` actually reads.
 */
function mockFetchSequence(responses: MockResponse[]) {
	captured = undefined;
	attempts = 0;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		// `request` may hand fetch either a plain object or a `Headers`
		// instance; both are normalised to lower-cased keys here, because an
		// assertion against a raw object would silently pass on the other shape.
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
			rawBody: init?.body,
		};

		const response =
			responses[Math.min(attempts, responses.length - 1)] ??
			({} as MockResponse);
		attempts++;

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...response.headers,
			}),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

function mockFetch(response: MockResponse) {
	mockFetchSequence([response]);
}

describe('makeLoyverseRequest', () => {
	it('sends the bearer token against the versioned base', async () => {
		mockFetch({ body: { id: 'item-1' } });

		await makeLoyverseRequest('items', TOKEN);

		expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
		expect(captured?.url).toBe(`${LOYVERSE_API_BASE}/items`);
		expect(captured?.method).toBe('GET');
	});

	it('pins the versioned base to v1.0', () => {
		expect(LOYVERSE_API_BASE).toBe('https://api.loyverse.com/v1.0');
	});

	/**
	 * Harvest rejects a request with no `User-Agent`; Loyverse does not require
	 * one. Asserted so that adding one later is a deliberate change rather than
	 * a copied habit.
	 */
	it('sends no user agent and no account header', async () => {
		mockFetch({ body: {} });

		await makeLoyverseRequest('items', TOKEN);

		expect(captured?.headers['user-agent']).toBeUndefined();
		expect(captured?.headers['harvest-account-id']).toBeUndefined();
	});

	it('sends a JSON content type and serialises the body on a POST', async () => {
		mockFetch({ body: { id: 'category-1' } });

		await makeLoyverseRequest('categories', TOKEN, {
			method: 'POST',
			body: { name: 'Beverages' },
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toContain('application/json');
		expect(captured?.body).toBe(JSON.stringify({ name: 'Beverages' }));
	});

	it('does not send a body on a GET even when one is supplied', async () => {
		mockFetch({ body: {} });

		await makeLoyverseRequest('items', TOKEN, {
			method: 'GET',
			body: { ignored: true },
		});

		expect(captured?.body).toBeUndefined();
	});

	it('does not send a body on a DELETE', async () => {
		mockFetch({ body: { deleted_object_ids: ['item-1'] } });

		await makeLoyverseRequest('items/item-1', TOKEN, { method: 'DELETE' });

		expect(captured?.method).toBe('DELETE');
		expect(captured?.body).toBeUndefined();
	});

	it('appends query parameters', async () => {
		mockFetch({ body: { items: [] } });

		await makeLoyverseRequest('items', TOKEN, {
			query: { limit: 250, cursor: 'abc' },
		});

		expect(captured?.url).toContain('limit=250');
		expect(captured?.url).toContain('cursor=abc');
	});

	it('surfaces a failure as an ApiError carrying the status', async () => {
		mockFetch({
			status: 404,
			body: {
				errors: [
					{
						code: 'NOT_FOUND',
						details: "The resource with ID 'item-1' was not found",
						field: 'id',
					},
				],
			},
		});

		await expect(makeLoyverseRequest('items/item-1', TOKEN)).rejects.toThrow(
			ApiError,
		);
	});

	/**
	 * 402 is the lapsed-subscription status. It matters that it arrives as a
	 * distinguishable status rather than a generic failure, because
	 * `error-handlers.ts` matches on it to avoid retrying a fault no retry can
	 * fix.
	 */
	it('preserves a 402 so the subscription handler can match it', async () => {
		mockFetch({
			status: 402,
			body: { errors: [{ code: 'PAYMENT_REQUIRED', details: 'lapsed' }] },
		});

		await expect(makeLoyverseRequest('items', TOKEN)).rejects.toMatchObject({
			status: 402,
		});
	});

	it('retries a 429 and succeeds on the following attempt', async () => {
		mockFetchSequence([
			{
				status: 429,
				headers: { 'Retry-After': '1' },
				body: { errors: [{ code: 'RATE_LIMITED', details: 'slow down' }] },
			},
			{ status: 200, body: { items: [] } },
		]);

		const result = await makeLoyverseRequest<{ items: unknown[] }>(
			'items',
			TOKEN,
		);

		expect(result.items).toEqual([]);
		expect(attempts).toBe(2);
	});
});

describe('uploadLoyverseImage', () => {
	/**
	 * The upload is a raw binary body, not multipart. Loyverse answers a
	 * multipart request with 500, so this is asserted rather than assumed: the
	 * body must reach fetch as a Blob and the content type must be the image
	 * type, with no multipart boundary anywhere.
	 */
	it('sends the bytes as a raw binary body with an image content type', async () => {
		mockFetch({ status: 201, body: {} });
		const image = new Blob([Buffer.from('fake-png-bytes')], {
			type: LOYVERSE_IMAGE_MEDIA_TYPE,
		});

		await uploadLoyverseImage('items/item-1/image', TOKEN, image);

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(`${LOYVERSE_API_BASE}/items/item-1/image`);
		expect(captured?.headers['content-type']).toBe(LOYVERSE_IMAGE_MEDIA_TYPE);
		expect(captured?.headers['content-type']).not.toContain('multipart');
		expect(captured?.rawBody).toBeInstanceOf(Blob);
	});

	it('still sends the bearer token', async () => {
		mockFetch({ status: 201, body: {} });

		await uploadLoyverseImage(
			'items/item-1/image',
			TOKEN,
			new Blob([Buffer.from('x')], { type: LOYVERSE_IMAGE_MEDIA_TYPE }),
		);

		expect(captured?.headers.authorization).toBe(`Bearer ${TOKEN}`);
	});

	it('documents the media type it uploads as', () => {
		expect(LOYVERSE_IMAGE_MEDIA_TYPE).toBe('image/png');
	});
});

describe('makeLoyverseMetadataRequest', () => {
	/**
	 * The OIDC documents sit on the bare host, outside `/v1.0`. Getting this
	 * wrong produces a 404 that looks like a missing resource, so both the base
	 * and the absence of a credential are asserted.
	 */
	it('uses the unversioned base', async () => {
		mockFetch({ body: { issuer: 'https://example.com' } });

		await makeLoyverseMetadataRequest('.well-known/openid-configuration');

		expect(captured?.url).toBe(
			`${LOYVERSE_ROOT_BASE}/.well-known/openid-configuration`,
		);
		expect(captured?.url).not.toContain('/v1.0');
	});

	it('sends no authorization header', async () => {
		mockFetch({ body: { keys: [] } });

		await makeLoyverseMetadataRequest('.well-known/jwks.json');

		expect(captured?.headers.authorization).toBeUndefined();
	});

	it('reads JWKS from the advertised path, not the path in the spec', async () => {
		mockFetch({ body: { keys: [] } });

		await makeLoyverseMetadataRequest('.well-known/jwks.json');

		// The published spec documents /oidc/jwks, which returns 404 live.
		expect(captured?.url).toContain('/.well-known/jwks.json');
		expect(captured?.url).not.toContain('/oidc/jwks');
	});
});
