import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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
	const pathPart = endpoint.split('?')[0] ?? '';
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
		upper === 'POST' ||
		upper === 'PUT' ||
		upper === 'DELETE' ||
		upper === 'PATCH' ||
		upper === 'OPTIONS' ||
		upper === 'HEAD'
	) {
		return upper;
	}
	return 'GET';
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
			const data: unknown = await request<unknown>(this.openApiConfig(origin), {
				method: 'GET',
				url: '/oauth/userinfo',
			});
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
			const data: unknown = await request<unknown>(
				this.openApiConfig(base),
				requestOptions,
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
