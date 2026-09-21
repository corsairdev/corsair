import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError } from 'corsair/http';

const DOCUSIGN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

const SAFE_TRANSPORT_RETRY_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** DocuSign paths are short literals plus a few encoded IDs. */
const MAX_ENDPOINT_LENGTH = 512;

function transportRateLimitConfig(
	method: ApiRequestOptions['method'],
): RateLimitConfig {
	if (SAFE_TRANSPORT_RETRY_METHODS.has(method)) {
		return DOCUSIGN_RATE_LIMIT_CONFIG;
	}
	return { ...DOCUSIGN_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 };
}

const REQUEST_TIMEOUT_MS = 20_000;

function joinUrl(base: string, path: string): string {
	const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

function retryDelayMs(
	attempt: number,
	rateLimitConfig: RateLimitConfig,
	retryAfterMs?: number,
): number {
	if (retryAfterMs !== undefined && retryAfterMs > 0) return retryAfterMs;
	return (
		rateLimitConfig.initialRetryDelay *
		rateLimitConfig.backoffMultiplier ** (attempt - 1)
	);
}

function serializeBody(
	options: ApiRequestOptions,
): string | Blob | FormData | undefined {
	if (options.body === undefined) return undefined;
	if (options.mediaType?.includes('/json')) {
		return JSON.stringify(options.body);
	}
	if (
		typeof options.body === 'string' ||
		options.body instanceof Blob ||
		options.body instanceof FormData
	) {
		return options.body;
	}
	return JSON.stringify(options.body);
}

async function parseResponseBody(response: Response): Promise<unknown> {
	if (response.status === 204) return undefined;
	const contentType = response.headers.get('Content-Type');
	if (contentType?.toLowerCase().includes('application/json')) {
		return response.json();
	}
	return response.text();
}

/**
 * DocuSign-local HTTP transport. Avoids corsair/http `request()` so user-built
 * paths are not analyzed against the shared OpenAPI placeholder regex
 * (CodeQL js/polynomial-redos).
 */
async function docusignHttpRequest<T>(
	config: OpenAPIConfig,
	options: ApiRequestOptions,
	rateLimitConfig: RateLimitConfig,
): Promise<T> {
	const url = joinUrl(config.BASE, options.url);
	const maxAttempts = rateLimitConfig.maxRetries + 1;
	const headers = new Headers({
		...(config.HEADERS ?? {}),
		...(options.headers ?? {}),
	});
	const body = serializeBody(options);
	const method = options.method ?? 'GET';

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const response = await fetch(url, {
			method,
			headers,
			body:
				method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
					? undefined
					: body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});

		const responseBody = await parseResponseBody(response);
		const result: ApiResult = {
			url,
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			body: responseBody,
		};

		if (
			response.status === 429 &&
			rateLimitConfig.enabled &&
			attempt < maxAttempts
		) {
			await new Promise((resolve) =>
				setTimeout(
					resolve,
					retryDelayMs(
						attempt,
						rateLimitConfig,
						parseRetryAfterMs(response.headers.get('retry-after')),
					),
				),
			);
			continue;
		}

		if (!response.ok) {
			throw new ApiError(
				options,
				result,
				response.statusText || 'Request failed',
				response.status === 429
					? {
							retryAfter: parseRetryAfterMs(
								response.headers.get('retry-after'),
							),
						}
					: undefined,
			);
		}

		return responseBody as T;
	}

	throw new ApiError(
		options,
		{
			url,
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: undefined,
		},
		'Too Many Requests',
	);
}

export interface DocusignAuthOptions {
	accessToken: string;
	accountId: string;
	baseUri?: string;
}

function extractErrorCode(body: unknown): string | undefined {
	if (
		typeof body === 'object' &&
		body !== null &&
		'errorCode' in body &&
		typeof body.errorCode === 'string'
	) {
		return body.errorCode;
	}
	return undefined;
}

export class DocusignApiError extends ApiError {
	readonly errorCode?: string;

	constructor(source: ApiError, errorCode?: string) {
		super(
			source.request,
			{
				url: source.url,
				ok: false,
				status: source.status,
				statusText: source.statusText,
				body: source.body,
			} satisfies ApiResult,
			source.message,
			{
				retryAfter: source.retryAfter,
				rateLimitReset: source.rateLimitReset,
				rateLimitRemaining: source.rateLimitRemaining,
				rateLimitLimit: source.rateLimitLimit,
			},
		);
		this.name = 'DocusignApiError';
		this.errorCode = errorCode ?? extractErrorCode(source.body);
	}
}

function toRequestBody(body: string | Uint8Array | undefined): {
	body?: unknown;
	mediaType?: string;
} {
	if (body instanceof Uint8Array) {
		return { body: new Blob([body]), mediaType: 'application/octet-stream' };
	}
	if (typeof body !== 'string') {
		return {};
	}
	try {
		const parsed: unknown = JSON.parse(body);
		if (typeof parsed === 'object' && parsed !== null) {
			return { body: parsed, mediaType: 'application/json' };
		}
	} catch {
		// Non-JSON string body: pass through without a JSON media type.
	}
	return { body };
}

function assertSafePath(endpoint: string): void {
	if (endpoint.length > MAX_ENDPOINT_LENGTH) {
		throw new Error(
			`Invalid DocuSign request path: exceeds ${MAX_ENDPOINT_LENGTH} characters.`,
		);
	}
	const pathPart = endpoint.split('?')[0] ?? '';
	// Paths are fully interpolated before request(); reject stray brace tokens.
	if (pathPart.includes('{') || pathPart.includes('}')) {
		throw new Error(
			'Invalid DocuSign request path: brace characters are not allowed.',
		);
	}
	const segments = pathPart.split('/');
	for (let index = 1; index < segments.length; index++) {
		const segment = segments[index];
		const isTrailingSlash = index === segments.length - 1 && segment === '';
		if (segment === undefined || (segment.length === 0 && !isTrailingSlash)) {
			throw new Error(
				'Invalid DocuSign request path: empty path segments are not allowed.',
			);
		}
		const decoded = (() => {
			try {
				return decodeURIComponent(segment);
			} catch {
				return segment;
			}
		})();
		if (decoded === '.' || decoded === '..') {
			throw new Error(
				'Invalid DocuSign request path: path traversal segments are not allowed.',
			);
		}
	}
}

function toMethod(method: string | undefined): ApiRequestOptions['method'] {
	const upper = typeof method === 'string' ? method.toUpperCase() : 'GET';
	if (
		upper === 'GET' ||
		upper === 'POST' ||
		upper === 'PUT' ||
		upper === 'DELETE' ||
		upper === 'PATCH' ||
		upper === 'OPTIONS' ||
		upper === 'HEAD'
	) {
		return upper;
	}
	throw new Error(`Unsupported DocuSign request method: "${method}".`);
}

export interface DocusignRequestOptions {
	method?: string;
	body?: string | Uint8Array;
	contentType?: string;
	headers?: Record<string, string>;
}

export class DocusignClient {
	private accessToken: string;
	private accountId: string;
	private baseUri: string;
	private versionRoot: string;
	private apiRoot: string;
	private isDemoEnvironment: boolean;

	constructor(options: DocusignAuthOptions) {
		this.accessToken = options.accessToken;
		this.accountId = options.accountId;
		const { baseUri, isDemoEnvironment } = this.resolveAndValidateBaseUri(
			options.baseUri,
		);
		this.baseUri = baseUri;
		this.isDemoEnvironment = isDemoEnvironment;
		const versionIndex = baseUri.indexOf('/restapi/v2.1');
		this.versionRoot =
			versionIndex === -1 ? baseUri : baseUri.slice(0, versionIndex + 13);
		const apiIndex = baseUri.indexOf('/restapi');
		this.apiRoot = apiIndex === -1 ? baseUri : baseUri.slice(0, apiIndex + 8);
	}

	private openApiConfig(base: string): OpenAPIConfig {
		return {
			BASE: base,
			VERSION: '2.1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			HEADERS: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
		};
	}

	private resolveAuthServer(authServer?: string): string {
		const raw =
			authServer ||
			(this.isDemoEnvironment
				? 'https://account-d.docusign.com'
				: 'https://account.docusign.com');
		const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
		if (url.protocol !== 'https:') {
			throw new Error('DocuSign auth server must use HTTPS.');
		}
		const host = url.hostname.toLowerCase();
		if (host !== 'account-d.docusign.com' && host !== 'account.docusign.com') {
			throw new Error(
				`Untrusted DocuSign auth server host: "${host}". Must be account.docusign.com or account-d.docusign.com.`,
			);
		}
		return url.origin;
	}

	async userInfo(authServer?: string): Promise<unknown> {
		const origin = this.resolveAuthServer(authServer);
		try {
			const data: unknown = await docusignHttpRequest<unknown>(
				this.openApiConfig(origin),
				{
					method: 'GET',
					url: '/oauth/userinfo',
				},
				transportRateLimitConfig('GET'),
			);
			return data;
		} catch (error) {
			throw toDocusignApiError(error, 'GET', '/oauth/userinfo');
		}
	}

	private resolveAndValidateBaseUri(baseUri?: string): {
		baseUri: string;
		isDemoEnvironment: boolean;
	} {
		const raw = baseUri || 'https://demo.docusign.net/restapi/v2.1';
		const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);

		if (url.protocol !== 'https:') {
			throw new Error('DocuSign baseUri must use HTTPS.');
		}

		const host = url.hostname.toLowerCase();
		const isDemoEnvironment = host === 'demo.docusign.net';
		const isAllowedHost =
			host === 'docusign.com' ||
			host.endsWith('.docusign.com') ||
			host === 'docusign.net' ||
			host.endsWith('.docusign.net');

		if (!isAllowedHost) {
			throw new Error(
				`Untrusted DocuSign baseUri host: "${host}". Must be a valid *.docusign.com or *.docusign.net domain.`,
			);
		}

		let path = url.pathname;
		while (path.endsWith('/')) {
			path = path.slice(0, -1);
		}
		const segments = path.split('/').filter((segment) => segment.length > 0);
		const restApiIndex = segments.findIndex(
			(segment, index) =>
				segment === 'restapi' && segments[index + 1] === 'v2.1',
		);
		if (restApiIndex === -1) {
			path = `${path}/restapi/v2.1`;
		}
		const accountsIndex = segments.findIndex(
			(segment, index) => segment === 'accounts' && index + 1 < segments.length,
		);
		if (accountsIndex === -1) {
			path = `${path}/accounts/${this.accountId}`;
		} else if (segments[accountsIndex + 1] !== this.accountId) {
			throw new Error(
				`DocuSign baseUri is scoped to account "${segments[accountsIndex + 1]}" but credentials are for account "${this.accountId}". Configure a matching baseUri.`,
			);
		}

		return { baseUri: `${url.origin}${path}`, isDemoEnvironment };
	}

	async request(
		endpoint: string,
		options: DocusignRequestOptions = {},
	): Promise<unknown> {
		assertSafePath(endpoint);
		const { base, url } = this.resolveBase(endpoint);
		const { body, mediaType } = toRequestBody(options.body);
		const requestOptions: ApiRequestOptions = {
			method: toMethod(options.method),
			url,
			...(body === undefined ? {} : { body, mediaType }),
			...(options.contentType === undefined
				? {}
				: {
						mediaType: options.contentType,
						headers: { 'Content-Type': options.contentType },
					}),
			...(options.headers === undefined ? {} : { headers: options.headers }),
		};
		try {
			const data: unknown = await docusignHttpRequest<unknown>(
				this.openApiConfig(base),
				requestOptions,
				transportRateLimitConfig(requestOptions.method),
			);
			return data;
		} catch (error) {
			throw toDocusignApiError(error, requestOptions.method, endpoint);
		}
	}

	private resolveBase(endpoint: string): { base: string; url: string } {
		if (endpoint === '/service_information') {
			return { base: this.apiRoot, url: endpoint };
		}
		if (endpoint.startsWith('/v2.1/') || endpoint === '/v2.1') {
			return { base: this.versionRoot, url: endpoint.slice('/v2.1'.length) };
		}
		return { base: this.baseUri, url: endpoint };
	}
}

function toDocusignApiError(
	error: unknown,
	method: ApiRequestOptions['method'],
	url: string,
): DocusignApiError {
	if (error instanceof ApiError) {
		return new DocusignApiError(error);
	}
	const message = error instanceof Error ? error.message : 'Unknown error';
	return new DocusignApiError(
		new ApiError(
			{ method, url },
			{ url, ok: false, status: 0, statusText: '', body: undefined },
			message,
		),
	);
}
