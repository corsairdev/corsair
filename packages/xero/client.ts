import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class XeroAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
	) {
		super(message);
		this.name = 'XeroAPIError';
	}
}

export const XERO_API_BASE = 'https://api.xero.com/api.xro/2.0';
export const XERO_CONNECTIONS_BASE = 'https://api.xero.com';

export async function makeXeroRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | Array<unknown> | string;
		query?: Record<string, string | number | boolean | undefined>;
		tenantId?: string;
		isRawUrl?: boolean;
		mediaType?: string;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		tenantId,
		isRawUrl = false,
		mediaType = 'application/json; charset=utf-8',
		headers = {},
	} = options;

	const requestHeaders: Record<string, string> = {
		Accept: 'application/json',
		...headers,
	};

	if (tenantId) {
		requestHeaders['xero-tenant-id'] = tenantId;
	}

	const config: OpenAPIConfig = {
		BASE: isRawUrl ? '' : XERO_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: requestHeaders,
	};

	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? (body as any) : undefined,
		mediaType: isWrite ? mediaType : undefined,
		query: !isWrite ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error && typeof error === 'object' && 'body' in error) {
			const apiErr = error as {
				body?: {
					Message?: string;
					Detail?: string;
					Type?: string;
					Elements?: Array<{
						ValidationErrors?: Array<{ Message: string }>;
					}>;
				};
				status?: number;
			};
			const msg =
				apiErr.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message ||
				apiErr.body?.Detail ||
				apiErr.body?.Message ||
				(error instanceof Error ? error.message : 'Xero API Error');
			throw new XeroAPIError(msg, apiErr.status || apiErr.body?.Type);
		}
		if (error instanceof Error) {
			throw new XeroAPIError(error.message);
		}
		throw new XeroAPIError('Unknown error');
	}
}
