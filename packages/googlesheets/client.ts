import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleSheetsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleSheetsAPIError';
	}
}

const GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4';

type SheetsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeSheetsRequest<T>(
	endpoint: string,
	credentials: string,
	options: SheetsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GOOGLE_SHEETS_API_BASE,
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
		query,
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

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

async function makeDriveRequest(
	endpoint: string,
	token: string,
	options: RequestInit = {},
): Promise<Response> {
	return fetch(`${GOOGLE_DRIVE_API_BASE}${endpoint}`, {
		...options,
		headers: { ...options.headers, Authorization: `Bearer ${token}` },
	});
}

export async function makeAuthenticatedDriveRequest(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: RequestInit = {},
): Promise<Response> {
	const response = await makeDriveRequest(endpoint, ctx.key, options);
	if (response.status === 401 && ctx._refreshAuth) {
		const freshToken = await ctx._refreshAuth();
		return makeDriveRequest(endpoint, freshToken, options);
	}
	return response;
}

export async function makeAuthenticatedSheetsRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: SheetsRequestOptions = {},
): Promise<T> {
	try {
		return await makeSheetsRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeSheetsRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
