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

function toRequestBody(body: string | undefined): {
	body?: unknown;
	mediaType?: string;
} {
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
	body?: string;
}

export class DocusignClient {
	private accessToken: string;
	private accountId: string;
	private baseUri: string;

	constructor(options: DocusignAuthOptions) {
		this.accessToken = options.accessToken;
		this.accountId = options.accountId;
		this.baseUri = this.resolveAndValidateBaseUri(options.baseUri);
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
			(this.baseUri.includes('.docusign.net')
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

	private resolveAndValidateBaseUri(baseUri?: string): string {
		const raw = baseUri || 'https://demo.docusign.net/restapi/v2.1';
		const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);

		if (url.protocol !== 'https:') {
			throw new Error('DocuSign baseUri must use HTTPS.');
		}

		const host = url.hostname.toLowerCase();
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

		let path = url.pathname.replace(/\/+$/, '');
		if (!path.includes('/restapi/v2.1')) {
			path = `${path}/restapi/v2.1`;
		}
		if (!path.includes(`/accounts/${this.accountId}`)) {
			path = `${path}/accounts/${this.accountId}`;
		}

		return `${url.origin}${path}`;
	}

	async request(
		endpoint: string,
		options: DocusignRequestOptions = {},
	): Promise<unknown> {
		const { body, mediaType } = toRequestBody(options.body);
		const requestOptions: ApiRequestOptions = {
			method: toMethod(options.method),
			url: endpoint,
			...(body === undefined ? {} : { body, mediaType }),
		};
		try {
			const data: unknown = await request<unknown>(
				this.openApiConfig(this.baseUri),
				requestOptions,
			);
			return data;
		} catch (error) {
			throw toDocusignApiError(error, requestOptions.method, endpoint);
		}
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
