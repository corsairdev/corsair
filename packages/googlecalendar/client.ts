import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleCalendarAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleCalendarAPIError';
	}
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

type CalendarRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeCalendarRequest<T>(
	endpoint: string,
	credentials: string,
	options: CalendarRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CALENDAR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
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
		mediaType: 'application/json',
		query: query,
	};

	const response = await request<T>(config, requestOptions);
	return response;
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedCalendarRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: CalendarRequestOptions = {},
): Promise<T> {
	try {
		return await makeCalendarRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeCalendarRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
