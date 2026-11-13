import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type ForceManagerRequestInput = Omit<ApiRequestOptions, 'url'>;

export type ForceManagerEnvironment = 'production' | 'sandbox';

const FORCE_MANAGER_BASES: Record<ForceManagerEnvironment, string> = {
	production: 'https://api.forcemanager.com/api/v4',
	sandbox: 'https://sandbox-api.forcemanager.com/api/v4',
};

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export class ForceManagerAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ForceManagerAPIError';
	}
}

// `unknown` is the safe default because the provider payload is untrusted until an operation schema parses it.
export async function makeForceManagerRequest<T = unknown>(
	path: string,
	apiKey: string | undefined,
	input: ForceManagerRequestInput,
	environment: ForceManagerEnvironment = 'production',
): Promise<T> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('forcemanager', 'api_key');
	}
	if (!apiKey) {
		throw new AuthMissingError('forcemanager', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: FORCE_MANAGER_BASES[environment],
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Session-Key': apiKey,
		},
	};
	const options: ApiRequestOptions = {
		...input,
		url: path,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, options, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because transport failures may be non-Error values; preserve only safe status metadata.
		if (error instanceof ApiError) {
			throw new ForceManagerAPIError(
				`ForceManager request failed with HTTP ${error.status}`,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new ForceManagerAPIError('ForceManager request failed');
		}
		throw new ForceManagerAPIError('ForceManager request failed');
	}
}

export function forceManagerBaseUrl(
	environment: ForceManagerEnvironment,
): string {
	return FORCE_MANAGER_BASES[environment];
}
