import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

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

/**
 * Looks up one address, or the caller's own with no `ip`. The API answers
 * without a key; a key, when set, goes as a bearer token and adds the fields
 * its plan includes.
 */
export async function makeVpndetectionRequest<T>(
	apiKey: string,
	ip?: string,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: VPNDETECTION_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey || undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: ip ? '/{ip}' : '/myip',
		path: ip ? { ip } : undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}
