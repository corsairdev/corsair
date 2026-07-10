import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ActiveTrailMethod } from './endpoints/routes';

export class ActiveTrailAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'ActiveTrailAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const ACTIVETRAIL_API_BASE = 'https://webapi.mymarketing.co.il/api';

export type ActiveTrailRequestOptions = {
	method?: ActiveTrailMethod;
	// Request bodies vary per endpoint; callers pass API-specific JSON shapes.
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeActiveTrailRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ActiveTrailRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const config: OpenAPIConfig = {
		BASE: ACTIVETRAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			// ActiveTrail expects the raw access token in Authorization (not Bearer).
			Authorization: apiKey,
			...headers,
		},
	};

	const hasBody = !['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ActiveTrailAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new ActiveTrailAPIError(error.message, { cause: error });
		}
		throw new ActiveTrailAPIError('Unknown error');
	}
}
