import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type TrustpilotHost = 'business' | 'invitations' | 'dataSolutions';
export type TrustpilotCredential = 'api_key' | 'oauth_2';

const TRUSTPILOT_HOSTS: Record<TrustpilotHost, string> = {
	business: 'https://api.trustpilot.com',
	invitations: 'https://invitations-api.trustpilot.com',
	dataSolutions: 'https://datasolutions.trustpilot.com',
};

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function makeTrustpilotRequest<T>(
	path: string,
	key: string,
	host: TrustpilotHost,
	credential: TrustpilotCredential,
	options: {
		method?: ApiRequestOptions['method'];
		// `unknown` is needed for endpoint-specific nested JSON request bodies; every endpoint validates its shape before serialization.
		body?: Record<string, unknown>;
		query?: Record<
			string,
			string | number | boolean | Array<string | number> | undefined
		>;
	} = {},
): Promise<T> {
	if (key.length === 0) {
		throw new AuthMissingError('trustpilot', credential);
	}
	const config: OpenAPIConfig = {
		BASE: TRUSTPILOT_HOSTS[host],
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...(credential === 'api_key'
				? { apikey: key }
				: { Authorization: `Bearer ${key}` }),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		body: options.body,
		mediaType: options.body ? 'application/json; charset=utf-8' : undefined,
		query: options.query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Trustpilot private responses and invitation requests can contain PII.
			// Preserve retry metadata while replacing the provider message/body and
			// request details with a safe, non-identifying error representation.
			throw new ApiError(
				{
					method: requestOptions.method,
					url: `${TRUSTPILOT_HOSTS[host]}/[redacted]`,
				},
				{
					url: `${TRUSTPILOT_HOSTS[host]}/[redacted]`,
					ok: false,
					status: error.status,
					statusText: 'Trustpilot HTTP error',
					body: undefined,
				},
				'Trustpilot request failed',
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		// `unknown` because transport rejections are not guaranteed to be Error instances.
		throw new Error('Trustpilot request failed');
	}
}
