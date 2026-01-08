import type { OpenAPIConfig } from '../../core/OpenAPI';
import { request } from '../../core/request';
import type { ApiRequestOptions } from '../../core/ApiRequestOptions';

export class SlackAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SlackAPIError';
	}
}

const SLACK_API_BASE = 'https://slack.com/api';

export async function makeSlackRequest<T>(
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
		BASE: SLACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const bodyWithToken = body ? { ...body, token } : { token };
	const queryWithToken = query ? { ...query, token } : { token };

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' || method === 'PATCH' ? bodyWithToken : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? queryWithToken : undefined,
	};

	const response = await request<T>(config, requestOptions);

	if (response && typeof response === 'object' && 'ok' in response && !response.ok) {
		const error = (response as { error?: string }).error || 'Unknown error';
		throw new SlackAPIError(error, error);
	}

	return response;
}

