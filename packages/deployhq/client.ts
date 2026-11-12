import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type DeployHQJsonValue =
	| string
	| number
	| boolean
	| null
	| DeployHQJsonValue[]
	| { [key: string]: DeployHQJsonValue };

export type DeployHQQueryValue = string | number | boolean | undefined;

export type DeployHQCredentials = {
	apiKey?: string;
	username?: string;
	accountSubdomain?: string;
};

export type DeployHQRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: DeployHQJsonValue;
	query?: Record<string, DeployHQQueryValue>;
	formData?: Record<string, string | boolean>;
	public?: boolean;
};

export class DeployHQAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DeployHQAPIError';
	}
}

const DEPLOYHQ_API_VERSION = '1.0.0';
const DEPLOYHQ_TIMEOUT_MS = 20_000;

const SAFE_READ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1_000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

const WRITE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'Retry-After' },
};

function parseRetryAfter(response: Response): number | undefined {
	const header = response.headers.get('Retry-After');
	if (header === null) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
	const date = Date.parse(header);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function resolveAccountSubdomain(accountSubdomain: string | undefined): string {
	if (
		!accountSubdomain ||
		!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(accountSubdomain)
	) {
		throw new Error(
			'DeployHQ accountSubdomain must be configured as the account permalink.',
		);
	}
	return accountSubdomain;
}

function basicAuthorization(username: string, apiKey: string): string {
	return `Basic ${btoa(`${username}:${apiKey}`)}`;
}

// `unknown` because each caller must validate untrusted provider JSON with its operation output schema.
export async function makeDeployHQRequest(
	endpoint: string,
	credentials: DeployHQCredentials,
	options: DeployHQRequestOptions = {},
): Promise<unknown> {
	const method = options.method ?? 'GET';
	const accountSubdomain = resolveAccountSubdomain(
		credentials.accountSubdomain,
	);
	const baseUrl = `https://${accountSubdomain}.deployhq.com`;
	const isPublic = options.public === true;
	let headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	};
	if (!isPublic) {
		if (credentials.apiKey !== undefined && credentials.apiKey.length === 0) {
			throw new AuthMissingError('deployhq', 'api_key');
		}
		if (!credentials.apiKey || !credentials.username) {
			throw new AuthMissingError('deployhq', 'api_key');
		}
		headers = {
			...headers,
			Authorization: basicAuthorization(
				credentials.username,
				credentials.apiKey,
			),
		};
	}

	if (options.formData) {
		const url = new URL(endpoint, baseUrl);
		for (const [name, value] of Object.entries(options.query ?? {})) {
			if (value !== undefined) url.searchParams.set(name, String(value));
		}
		const form = new FormData();
		for (const [name, value] of Object.entries(options.formData))
			form.set(name, String(value));
		const formHeaders = {
			Accept: 'application/json',
			...(isPublic ? {} : { Authorization: headers.Authorization }),
		};
		try {
			const response = await fetch(url, {
				method,
				headers: formHeaders,
				body: form,
				signal: AbortSignal.timeout(DEPLOYHQ_TIMEOUT_MS),
			});
			if (!response.ok) {
				await response.body?.cancel().catch(() => undefined);
				throw new DeployHQAPIError(
					`DeployHQ request failed with HTTP ${response.status}.`,
					response.status,
					parseRetryAfter(response),
				);
			}
			// `unknown` because parsed provider JSON is untrusted until the operation output schema validates it.
			const result: unknown = await response.json();
			return result;
		} catch (error: unknown) {
			// `unknown` because fetch and response parsing can reject with non-Error values.
			if (error instanceof DeployHQAPIError) throw error;
			if (error instanceof Error)
				throw new DeployHQAPIError(
					'DeployHQ request failed before a response was received.',
				);
			throw new DeployHQAPIError(
				'DeployHQ request failed before a response was received.',
			);
		}
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: DEPLOYHQ_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
		...(DEPLOYHQ_TIMEOUT_MS ? { TIMEOUT: DEPLOYHQ_TIMEOUT_MS } : {}),
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? options.body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: options.query,
	};
	const retryConfig =
		method === 'GET' ? SAFE_READ_RATE_LIMIT_CONFIG : WRITE_RATE_LIMIT_CONFIG;

	try {
		// `unknown` because the provider response remains untrusted until the endpoint's output schema parses it.
		const result: unknown = await request<unknown>(config, requestOptions, {
			rateLimitConfig: retryConfig,
		});
		return result;
	} catch (error: unknown) {
		// `unknown` because the shared HTTP transport may reject with arbitrary values.
		if (error instanceof ApiError) {
			// Do not rethrow ApiError: it retains the unsanitized request body and provider error body.
			throw new DeployHQAPIError(
				`DeployHQ request failed with HTTP ${error.status}.`,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof DeployHQAPIError) throw error;
		if (error instanceof Error)
			throw new DeployHQAPIError(
				'DeployHQ request failed before a response was received.',
			);
		throw new DeployHQAPIError(
			'DeployHQ request failed before a response was received.',
		);
	}
}
