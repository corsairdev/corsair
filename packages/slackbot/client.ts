import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Slack returns HTTP 200 with `{ ok: false, error: "<code>" }` for most
 * application-level failures, so the machine-readable `error` code is carried
 * separately from the human-readable message.
 */
export class SlackbotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SlackbotAPIError';
	}
}

const SLACKBOT_API_BASE = 'https://slack.com/api';

/**
 * Slack enforces tiered per-method limits and answers 429 with `Retry-After`
 * in seconds. Retries are bounded so a sustained limit surfaces to the caller
 * rather than stalling a webhook handler past Slack's 3s ack window.
 */
const SLACKBOT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeSlackbotRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: SLACKBOT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: SLACKBOT_RATE_LIMIT_CONFIG,
	});

	if (
		response &&
		typeof response === 'object' &&
		'ok' in response &&
		!response.ok
	) {
		const code = (response as { error?: string }).error || 'unknown_error';
		throw new SlackbotAPIError(code, code);
	}

	return response;
}
