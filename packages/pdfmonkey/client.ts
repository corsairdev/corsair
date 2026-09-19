import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PDFMONKEY_API_BASE = 'https://api.pdfmonkey.io';

export type PdfMonkeyQueryValue =
	| string
	| number
	| boolean
	| undefined
	| Record<string, string | number | boolean | undefined>;

export type PdfMonkeyRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, PdfMonkeyQueryValue>;
};

function buildConfig(apiKey?: string, isWrite = false): OpenAPIConfig {
	return {
		BASE: PDFMONKEY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};
}

async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError || error instanceof Error) {
		throw error;
	}
	throw new Error('Unknown PDFMonkey error');
}

export async function makePdfMonkeyRequest<T>(
	endpoint: string,
	options: PdfMonkeyRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, query = {} } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config = buildConfig(apiKey, isWrite);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}
