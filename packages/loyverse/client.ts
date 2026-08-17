import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * The versioned API base. The version is part of the path rather than a header.
 *
 * @see https://developer.loyverse.com/docs/
 */
const LOYVERSE_API_BASE = 'https://api.loyverse.com/v1.0';

/**
 * OpenID Connect metadata sits on the same host but **outside** the versioned
 * base, and is served without authentication.
 *
 * The published spec documents JWKS at `/oidc/jwks`, which returns 404. The
 * working URL is the `jwks_uri` advertised by the discovery document itself,
 * confirmed live on 2026-08-13.
 */
const LOYVERSE_ROOT_BASE = 'https://api.loyverse.com';

/**
 * Loyverse documents 300 requests per 300 seconds per account and answers 429
 * `RATE_LIMITED` once that is exceeded.
 *
 * Two limits of this configuration are worth stating plainly rather than
 * implying they were measured:
 *
 * - Successful responses carry **no** rate-limit headers of any kind, so the
 *   client cannot pace itself proactively and can only react to a 429.
 * - A 429 could not be induced during development - 400 requests inside about
 *   60 seconds were all answered normally - so `Retry-After` is configured from
 *   the documented contract and has not been observed on a real throttle. If
 *   Loyverse omits the header, the backoff below still applies.
 */
const LOYVERSE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type LoyverseRequestOptions = {
	method?: 'GET' | 'POST' | 'DELETE';
	/**
	 * The JSON request body, serialised as given.
	 *
	 * The values are `unknown` rather than a union of what Loyverse accepts because
	 * bodies here are assembled by the endpoints from their own already-validated
	 * input schemas, and those shapes vary widely - a receipt nests line items,
	 * their taxes, discounts and modifiers several levels deep. Narrowing at this
	 * boundary would restate every one of those shapes in a second place, where the
	 * two could drift apart. Validation belongs to the endpoint input schemas in
	 * `endpoints/types.ts`; this type deliberately says only "already-checked JSON".
	 *
	 * An array is accepted because a few endpoints take a bare collection.
	 */
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(base: string, accessToken?: string): OpenAPIConfig {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

	return {
		BASE: base,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};
}

/**
 * Issues a Loyverse request with bearer auth and rate-limit retries.
 *
 * Loyverse reports failures with real status codes - 400, 401, 402, 403, 404,
 * 415, 429, 500 - and a consistent
 * `{"errors":[{"code","details","field"}]}` body, so no response-body
 * inspection is needed to tell success from failure and the shared `request`
 * helper's error handling applies unchanged.
 *
 * Unlike Harvest there is no second credential and no required `User-Agent`;
 * the token alone identifies the account.
 */
export async function makeLoyverseRequest<T>(
	endpoint: string,
	accessToken: string,
	options: LoyverseRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	return await request<T>(
		buildConfig(LOYVERSE_API_BASE, accessToken),
		requestOptions,
		{ rateLimitConfig: LOYVERSE_RATE_LIMIT_CONFIG },
	);
}

/**
 * Image media types accepted for an item image upload.
 *
 * The catalog names both PNG and JPEG. The published spec documents only
 * `image/png`, and in practice the API does not appear to validate the declared
 * type against the bytes - PNG bytes labelled `image/jpeg`, and even a request
 * with no content type at all, were all accepted with 201. The caller still
 * declares one so the request is well formed rather than relying on that.
 */
export const LOYVERSE_IMAGE_MEDIA_TYPES = ['image/png', 'image/jpeg'] as const;
export type LoyverseImageMediaType =
	(typeof LOYVERSE_IMAGE_MEDIA_TYPES)[number];

/** Default when a caller does not say which format it is sending. */
export const LOYVERSE_IMAGE_MEDIA_TYPE: LoyverseImageMediaType = 'image/png';

/**
 * Uploads an item image as a **raw binary body**, not as multipart.
 *
 * This is worth stating because it is easy to get wrong in both directions.
 * Loyverse expects the image bytes as the entire request body with an image
 * content type; a `multipart/form-data` request is answered with
 * 500 INTERNAL_ERROR. Verified live on 2026-08-13: raw bytes returned 201 and
 * populated `image_url`, while the same bytes sent as multipart failed.
 *
 * The shared helper passes a `Blob` body through untouched and takes the
 * content type from `mediaType`, so no header has to be set by hand here.
 *
 * A very small image is also rejected with 500 rather than a 4xx - a 1x1 PNG
 * fails where a 64x64 one succeeds - so a failure here is not necessarily a
 * caller error. 415 UNSUPPORTED_MEDIA_TYPE is the documented media-type
 * failure.
 */
export async function uploadLoyverseImage<T>(
	endpoint: string,
	accessToken: string,
	image: Blob,
	mediaType: LoyverseImageMediaType = LOYVERSE_IMAGE_MEDIA_TYPE,
): Promise<T> {
	return await request<T>(
		buildConfig(LOYVERSE_API_BASE, accessToken),
		{
			method: 'POST',
			url: endpoint,
			body: image,
			mediaType,
		},
		{ rateLimitConfig: LOYVERSE_RATE_LIMIT_CONFIG },
	);
}

/**
 * Reads an unauthenticated OpenID Connect metadata document.
 *
 * These two operations are the only ones that do not use the versioned base and
 * the only ones that send no credential. They are still routed through the
 * shared helper so they inherit the same 20 second timeout and retry behaviour
 * as everything else.
 */
export async function makeLoyverseMetadataRequest<T>(
	endpoint: string,
): Promise<T> {
	return await request<T>(
		buildConfig(LOYVERSE_ROOT_BASE),
		{ method: 'GET', url: endpoint, mediaType: 'application/json' },
		{ rateLimitConfig: LOYVERSE_RATE_LIMIT_CONFIG },
	);
}

export { LOYVERSE_API_BASE, LOYVERSE_RATE_LIMIT_CONFIG, LOYVERSE_ROOT_BASE };
