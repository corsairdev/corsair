import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const VPNDETECTION_API_BASE = 'https://api.vpndetection.io';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type VpndetectionQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type VpndetectionRequest = {
	method: 'GET' | 'POST';
	/** A path template such as `/api/v1/iam/apikeys/{id}/rotate`. */
	path: string;
	pathParams?: Record<string, string>;
	query?: VpndetectionQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: unknown;
};

function configFor(apiKey: string): OpenAPIConfig {
	return {
		BASE: VPNDETECTION_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Every route reads `Authorization: Bearer`; the account, organization
		// and key routes read nothing else, so the key never goes as a header
		// variant or in the query.
		TOKEN: apiKey || undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

/**
 * One call to the VPNDetection API. Lookups answer without a key; every
 * other route needs one. Core's `ApiError` passes through unchanged.
 */
export async function vpndetectionRequest<T>(
	apiKey: string,
	{ method, path, pathParams, query, body }: VpndetectionRequest,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: pathParams,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<T>(configFor(apiKey), requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		throw error instanceof ApiError ? withoutRequestData(error, path) : error;
	}
}

/**
 * Core's ApiError keeps the request: the looked-up address in the path, the
 * visitor's User-Agent in the query, the batch of addresses in the body. They
 * are a visitor's data, so the error is rebuilt with only the path template
 * (R8 allows this), keeping status, body and the rate-limit fields.
 */
function withoutRequestData(error: ApiError, template: string): ApiError {
	return new ApiError(
		{ method: error.request.method, url: template },
		{
			url: `${VPNDETECTION_API_BASE}${template}`,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * Looks up one address, or the caller's own with no `ip`. The API answers
 * without a key; a key, when set, goes as a bearer token and adds the fields
 * its plan includes.
 */
export async function makeVpndetectionRequest<T>(
	apiKey: string,
	ip?: string,
	userAgent?: string,
): Promise<T> {
	return vpndetectionRequest<T>(apiKey, {
		method: 'GET',
		path: ip ? '/{ip}' : '/myip',
		pathParams: ip ? { ip } : undefined,
		query: userAgent ? { user_agent: userAgent } : undefined,
	});
}

// The shared transport aborts after 20 seconds; the download call matches it.
const DOWNLOAD_TIMEOUT_MS = 20_000;

// unknown: an error body is untrusted JSON (`{"rc": "NOT_LICENSED"}`) or text.
async function readErrorBody(response: Response): Promise<unknown> {
	const text = await response.text();
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/**
 * `GET /api/v1/database/download` answers 302 to a time-limited link on
 * object storage. The redirect is not followed (a database file runs to
 * hundreds of megabytes): the link comes back for the caller to download.
 * Any other answer becomes core's `ApiError`, with the URL's key-free form.
 */
export async function resolveVpndetectionDownload(
	apiKey: string,
	query: VpndetectionQuery,
): Promise<string> {
	const url = new URL('/api/v1/database/download', VPNDETECTION_API_BASE);
	for (const [name, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(name, String(value));
	}
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
		redirect: 'manual',
		signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
	});
	const location = response.headers.get('location');
	if (response.status >= 300 && response.status < 400 && location) {
		// The redirect's own body is never read; release the connection.
		await response.body?.cancel().catch(() => undefined);
		return location;
	}
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: '/api/v1/database/download',
		query,
	};
	const retryAfter = Number(response.headers.get('retry-after'));
	throw new ApiError(
		requestOptions,
		{
			url: url.toString(),
			ok: false,
			status: response.status,
			statusText: response.statusText,
			body: await readErrorBody(response),
		},
		response.ok
			? 'VPNDetection answered the download without a redirect'
			: `VPNDetection download failed (${response.status})`,
		Number.isFinite(retryAfter) && retryAfter > 0 ? { retryAfter } : undefined,
	);
}
