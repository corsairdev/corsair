import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Official execute host (REST v3.1):
 * https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlug
 */
export const BROWSERTOOL_API_BASE = 'https://backend.composio.dev';

const BROWSERTOOL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export class BrowserToolAPIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;

	constructor(
		message: string,
		options: { status?: number; retryAfter?: number } = {},
	) {
		super(message);
		this.name = 'BrowserToolAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
	}
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value).filter(([, item]) => item !== undefined),
	);
}

/**
 * POST /api/v3.1/tools/execute/{tool_slug}
 * Auth: x-api-key (Composio). Toolkit itself is NO_AUTH — no connected_account_id.
 * Official: https://docs.composio.dev/toolkits/browser_tool
 */
export async function executeBrowserTool<T>(
	toolSlug: string,
	apiKey: string,
	args: Record<string, unknown>,
): Promise<T> {
	const token = apiKey.trim();
	if (!token) {
		throw new AuthMissingError('browsertool', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: BROWSERTOOL_API_BASE,
		VERSION: '3.1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': token,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `api/v3.1/tools/execute/${toolSlug}`,
		body: { arguments: compact(args) },
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BROWSERTOOL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BrowserToolAPIError(error.message);
		}
		throw new BrowserToolAPIError('Unknown error');
	}
}
