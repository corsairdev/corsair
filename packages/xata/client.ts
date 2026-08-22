import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class XataAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'XataAPIError';
	}
}

const XATA_MANAGEMENT_API_BASE = 'https://api.xata.tech';

export async function makeXataManagementRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: XATA_MANAGEMENT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const status = (error as { status?: number }).status;
			throw new XataAPIError(error.message, status);
		}
		throw new XataAPIError('Unknown error');
	}
}

export async function makeXataDataRequest<T>(
	endpoint: string,
	apiKey: string,
	workspaceId: string,
	region: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (!/^[a-zA-Z0-9-]+$/.test(workspaceId)) {
		throw new XataAPIError('Invalid workspaceId provided to data request');
	}
	if (!/^[a-zA-Z0-9-]+$/.test(region)) {
		throw new XataAPIError('Invalid region provided to data request');
	}

	const dataApiBase = `https://${workspaceId}.${region}.xata.sh`;

	const config: OpenAPIConfig = {
		BASE: dataApiBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const status = (error as { status?: number }).status;
			throw new XataAPIError(error.message, status);
		}
		throw new XataAPIError('Unknown error');
	}
}
