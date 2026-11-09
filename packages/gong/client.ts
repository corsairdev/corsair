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

export type GongCredentials =
	| { type: 'basic'; accessKey: string; accessKeySecret: string }
	| { type: 'bearer'; accessToken: string };

export type GongRequestOptions = {
	baseUrl: string;
	credentials: GongCredentials;
	method: ApiRequestOptions['method'];
	path: string;
	query?: Record<string, unknown>;
	body?: unknown;
	formData?: Record<string, Blob | string>;
};

function appendQueryValue(
	params: URLSearchParams,
	key: string,
	value: unknown,
): void {
	if (value === undefined || value === null) return;
	if (Array.isArray(value)) {
		for (const item of value) appendQueryValue(params, key, item);
		return;
	}
	if (typeof value === 'object') {
		for (const [childKey, childValue] of Object.entries(
			value as Record<string, unknown>,
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
	body: unknown,
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

function secureBaseUrl(value: string): string {
	const parsed = new URL(value);
	if (
		parsed.protocol !== 'https:' ||
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash
	) {
		throw new Error(
			'Gong baseUrl must use HTTPS and cannot include credentials, query, or fragment',
		);
	}
	return parsed.toString().replace(/\/$/, '');
}

export async function gongRequest<T>(options: GongRequestOptions): Promise<T> {
	const baseUrl = secureBaseUrl(options.baseUrl);
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
