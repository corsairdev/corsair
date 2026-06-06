import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class VercelAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'VercelAPIError';
	}
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export interface VercelRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, unknown>;
	teamId?: string;
}

export async function makeVercelRequest<T>(
	endpoint: string,
	accessToken: string,
	options: VercelRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, teamId } = options;

	const finalQuery = { ...query };
	if (teamId) {
		finalQuery.teamId = teamId;
	}

	const config: OpenAPIConfig = {
		BASE: 'https://api.vercel.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			finalQuery && Object.keys(finalQuery).length > 0 ? finalQuery : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new VercelAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}

export async function makeAuthenticatedVercelRequest<T>(
	endpoint: string,
	ctx: { key: string; options: { teamId?: string } },
	options: VercelRequestOptions = {},
): Promise<T> {
	const teamId = options.teamId ?? ctx.options.teamId;
	return await makeVercelRequest<T>(endpoint, ctx.key, { ...options, teamId });
}
