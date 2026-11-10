import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type GongJsonValue =
	| string
	| number
	| boolean
	| null
	| GongJsonValue[]
	| { [key: string]: GongJsonValue | undefined };

export type GongJsonObject = { [key: string]: GongJsonValue | undefined };

// Gong routes carry endpoint-specific payloads; registered schemas validate their known contracts.
export type GongOpaqueValue = unknown;
export type GongOpaqueRecord = Record<string, GongOpaqueValue>;

export type GongCredentials =
	| { type: 'basic'; accessKey: string; accessKeySecret: string }
	| { type: 'bearer'; accessToken: string };

export type GongRequestOptions = {
	/** Company name, host or URL on api.gong.io; the shared host when omitted. */
	baseUrl?: string;
	credentials: GongCredentials;
	method: ApiRequestOptions['method'];
	path: string;
	// Gong's provider-defined query values vary by operation and are validated at the endpoint boundary.
	query?: GongOpaqueRecord;
	// Some Gong routes accept opaque JSON bodies whose nested fields differ by endpoint.
	body?: GongOpaqueValue;
	formData?: Record<string, Blob | string>;
};

function appendQueryValue(
	params: URLSearchParams,
	key: string,
	// Query values are recursively flattened, so provider-specific nested values stay opaque here.
	value: GongOpaqueValue,
): void {
	if (value === undefined || value === null) return;
	if (Array.isArray(value)) {
		for (const item of value) appendQueryValue(params, key, item);
		return;
	}
	if (typeof value === 'object') {
		// The object branch above narrows this to an enumerable provider query record.
		for (const [childKey, childValue] of Object.entries(
			value as GongOpaqueRecord,
		)) {
			appendQueryValue(params, `${key}[${childKey}]`, childValue);
		}
		return;
	}
	if (
		typeof value !== 'string' &&
		typeof value !== 'number' &&
		typeof value !== 'boolean'
	)
		return;
	params.append(key, String(value));
}

function parseResponseBody(
	body: string,
	contentType: string | undefined,
): GongJsonValue | undefined {
	if (!body) return undefined;
	if (contentType?.toLowerCase().includes('json')) {
		try {
			// JSON.parse produces only JSON values, which the public endpoint schema validates.
			return JSON.parse(body) as GongJsonValue;
		} catch {
			return body;
		}
	}
	return body;
}

/** Sends the one Gong GET operation whose documented contract includes a JSON body. */
export function requestGetWithBody<T>(
	url: string,
	// The caller's registered input schema validates the opaque CRM body before transport.
	body: GongOpaqueValue,
	headers: Record<string, string>,
): Promise<T> {
	const parsedUrl = new URL(url);
	// Gong's CRM API documents opaque JSON payloads; endpoint schemas validate known envelopes.
	const bodyText = JSON.stringify(body);
	if (bodyText === undefined)
		throw new Error('Gong GET request body must be JSON serializable');
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: parsedUrl.toString(),
		body,
		mediaType: 'application/json',
	};
	const send = parsedUrl.protocol === 'https:' ? httpsRequest : httpRequest;

	return new Promise<T>((resolve, reject) => {
		const outgoing = send(
			parsedUrl,
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(bodyText).toString(),
					...headers,
				},
			},
			(incoming) => {
				const chunks: Buffer[] = [];
				incoming.on('data', (chunk: Buffer | string) =>
					chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
				);
				incoming.on('error', reject);
				incoming.on('end', () => {
					const responseBody = parseResponseBody(
						Buffer.concat(chunks).toString('utf8'),
						incoming.headers['content-type'],
					);
					const status = incoming.statusCode ?? 0;
					const result: ApiResult = {
						url: parsedUrl.toString(),
						ok: status >= 200 && status < 300,
						status,
						statusText: incoming.statusMessage ?? '',
						body: responseBody,
					};
					if (!result.ok) {
						const retryAfterHeader = incoming.headers['retry-after'];
						const retryAfterSeconds = retryAfterHeader
							? Number.parseInt(retryAfterHeader, 10)
							: Number.NaN;
						reject(
							new ApiError(
								requestOptions,
								result,
								`Gong API returned HTTP ${status}`,
								Number.isFinite(retryAfterSeconds)
									? { retryAfter: retryAfterSeconds * 1000 }
									: undefined,
							),
						);
						return;
					}
					if (responseBody === undefined) {
						resolve(undefined as T);
						return;
					}
					// The plugin's registered output schema validates this provider response before return.
					resolve(responseBody as T);
				});
			},
		);
		outgoing.setTimeout(20_000, () =>
			outgoing.destroy(new Error('Gong API request timed out')),
		);
		outgoing.on('error', reject);
		outgoing.end(bodyText);
	});
}

/** Gong's shared API host. Every company can also be reached on its own `<name>.api.gong.io` host. */
export const GONG_DEFAULT_BASE_URL = 'https://api.gong.io';
const GONG_API_DOMAIN = 'api.gong.io';
// One DNS label: the company part of `<name>.api.gong.io`, for example `us-12345`.
const GONG_HOST_NAME = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Resolves the Gong API base URL. The host is never taken from input as is: it
 * is rebuilt as `api.gong.io` or `<name>.api.gong.io` from a validated name, so
 * credentials cannot be sent to another host.
 *
 * Accepts nothing (the shared host), the company name (`us-12345`), the host
 * (`us-12345.api.gong.io`) or the URL Gong shows on its API page
 * (`https://us-12345.api.gong.io`).
 */
export function gongBaseUrl(value?: string): string {
	const raw = value?.trim().toLowerCase();
	if (!raw) return GONG_DEFAULT_BASE_URL;
	let host = raw;
	if (raw.includes('://')) {
		let parsed: URL;
		try {
			parsed = new URL(raw);
		} catch {
			throw new Error('Gong baseUrl is not a valid URL');
		}
		if (
			parsed.protocol !== 'https:' ||
			parsed.username ||
			parsed.password ||
			parsed.port ||
			parsed.search ||
			parsed.hash
		) {
			throw new Error(
				'Gong baseUrl must use HTTPS and cannot include credentials, a port, a query, or a fragment',
			);
		}
		if (!['', '/', '/v2', '/v2/'].includes(parsed.pathname)) {
			throw new Error('Gong baseUrl cannot include a path');
		}
		host = parsed.hostname;
	}
	if (host === GONG_API_DOMAIN) return GONG_DEFAULT_BASE_URL;
	const suffix = `.${GONG_API_DOMAIN}`;
	// A bare company name is accepted on its own, never as the host of a URL.
	const isBareName = host === raw && !host.includes('.');
	const name = host.endsWith(suffix)
		? host.slice(0, -suffix.length)
		: isBareName
			? host
			: '';
	if (!GONG_HOST_NAME.test(name)) {
		throw new Error(
			'Gong baseUrl must be https://api.gong.io or https://<name>.api.gong.io',
		);
	}
	return `https://${name}${suffix}`;
}

export async function gongRequest<T>(options: GongRequestOptions): Promise<T> {
	const baseUrl = gongBaseUrl(options.baseUrl);
	const authorization =
		options.credentials.type === 'basic'
			? `Basic ${Buffer.from(`${options.credentials.accessKey}:${options.credentials.accessKeySecret}`).toString('base64')}`
			: `Bearer ${options.credentials.accessToken}`;
	const path = options.path.replace(/^\//, '');
	const url = `${baseUrl}/${path}`;
	if (options.query) {
		const query = new URLSearchParams();
		for (const [key, value] of Object.entries(options.query))
			appendQueryValue(query, key, value);
		const queryString = query.toString();
		if (queryString) {
			const separator = url.includes('?') ? '&' : '?';
			if (options.method === 'GET' && options.body !== undefined)
				return requestGetWithBody<T>(
					`${url}${separator}${queryString}`,
					options.body,
					{
						Authorization: authorization,
					},
				);
		}
	}
	if (options.method === 'GET' && options.body !== undefined)
		return requestGetWithBody<T>(url, options.body, {
			Authorization: authorization,
		});

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: 'V2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS:
			options.credentials.type === 'basic'
				? {}
				: { Authorization: authorization },
		...(options.credentials.type === 'basic'
			? {
					USERNAME: options.credentials.accessKey,
					PASSWORD: options.credentials.accessKeySecret,
				}
			: {}),
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: `/${path}`,
		query: options.query,
		body: options.body,
		formData: options.formData,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new Error(
			error instanceof Error ? error.message : 'Unknown Gong API error',
		);
	}
}
