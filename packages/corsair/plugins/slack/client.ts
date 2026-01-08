import type { OpenAPIConfig } from '../../core/OpenAPI';
import { request } from '../../core/request';
import type { ApiRequestOptions } from '../../core/ApiRequestOptions';

class SlackAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SlackAPIError';
	}
}

const SLACK_API_BASE = 'https://slack.com/api';

async function makeSlackRequest<T>(
	endpoint: string,
	botToken: string,
	options: {
		method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestBody = body as Record<string, unknown> | undefined;
	const requestQuery = query as Record<string, unknown> | undefined;
	const requestToken = (requestBody?.token || requestQuery?.token || botToken) as string;

	const finalBody = requestBody ? { ...requestBody, token: requestToken } : { token: requestToken };
	const finalQuery = requestQuery ? { ...requestQuery, token: requestToken } : { token: requestToken };

	const config: OpenAPIConfig = {
		BASE: SLACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${requestToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? finalBody : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? finalQuery : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		
		if (response && typeof response === 'object' && 'ok' in response && !response.ok) {
			const error = (response as { error?: string }).error || 'Unknown error';
			throw new SlackAPIError(error, error);
		}
		
		return response;
	} catch (error) {
		if (error instanceof SlackAPIError) {
			throw error;
		}
		throw new SlackAPIError(
			error instanceof Error ? error.message : 'Request failed',
			'request_failed',
		);
	}
}

export { makeSlackRequest, SlackAPIError };

