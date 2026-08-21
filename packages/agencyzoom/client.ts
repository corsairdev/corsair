import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AgencyZoomMethod } from './endpoints/routes';

export class AgencyZoomAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// body is unknown because AgencyZoom error payloads vary by endpoint and are not schema-validated here.
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'AgencyZoomAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const AGENCYZOOM_API_BASE = 'https://api.agencyzoom.com/v1/api';

export type AgencyZoomRequestOptions = {
	method?: AgencyZoomMethod;
	// body is unknown because request payloads vary per AgencyZoom endpoint and are built dynamically.
	body?: unknown;
	// query values are heterogeneous (pagination, filters); not fully typed across 99 ops.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeAgencyZoomRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AgencyZoomRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	// HTTP header names are case-insensitive; strip reserved keys before plugin owns them.
	const protectedHeaderNames = new Set(['authorization', 'content-type']);
	const safeHeaders = Object.fromEntries(
		Object.entries(headers ?? {}).filter(
			([name]) => !protectedHeaderNames.has(name.toLowerCase()),
		),
	);
	const config: OpenAPIConfig = {
		BASE: AGENCYZOOM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey || undefined,
		HEADERS: {
			...safeHeaders,
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
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
			throw new AgencyZoomAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new AgencyZoomAPIError(error.message, { cause: error });
		}
		throw new AgencyZoomAPIError('Unknown error');
	}
}
