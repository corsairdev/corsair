import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { WebflowMethod } from './endpoints/operations';

export class WebflowAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'WebflowAPIError';
	}
}

const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_API_HOST = 'api.webflow.com';

function resolveWebflowBaseUrl(baseUrl?: string): string {
	if (!baseUrl) return WEBFLOW_API_BASE;
	let parsed: URL;
	try {
		parsed = new URL(baseUrl);
	} catch {
		throw new Error('[webflow] invalid baseUrl');
	}
	if (parsed.protocol !== 'https:' || parsed.hostname !== WEBFLOW_API_HOST) {
		throw new Error('[webflow] baseUrl must be https://api.webflow.com');
	}
	const path = parsed.pathname.replace(/\/+$/, '');
	if (path !== '' && path !== '/v2') {
		throw new Error('[webflow] baseUrl must target the /v2 API');
	}
	// host and path are allowlisted only; always pin to the canonical v2
	// origin so a caller cannot steer requests via a custom path or port
	return WEBFLOW_API_BASE;
}

export type WebflowRequestOptions = {
	method?: WebflowMethod;
	// bodies and query values are operation-specific json; the webflow api
	// validates their shape, so they intentionally stay unknown here
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeWebflowRequest<T>(
	endpoint: string,
	token: string,
	options: WebflowRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		baseUrl: requestedBaseUrl,
	} = options;
	const baseUrl = resolveWebflowBaseUrl(requestedBaseUrl);

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN is the single source of auth: corsair/http builds the
		// `Authorization: Bearer` header from it on every request
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...headers,
		},
	};

	const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// webflow error bodies carry a machine-readable code (for example
			// "too_many_requests") alongside the human-readable message
			const body = error.body as { code?: unknown } | null | undefined;
			const code = typeof body?.code === 'string' ? body.code : undefined;
			throw new WebflowAPIError(
				error.message,
				error.status,
				code,
				error.retryAfter,
			);
		}
		throw error;
	}
}
