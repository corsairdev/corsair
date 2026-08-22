import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DeepwikiMcpAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DeepwikiMcpAPIError';
	}
}

const DEEPWIKIMCP_API_BASE = 'https://mcp.deepwiki.com/';

type JsonRpcResponse<T> = {
	result?: T;
	error?: {
		code?: number;
		message?: string;
	};
};

function parseJsonRpcResponse<T>(
	response: JsonRpcResponse<T> | string,
): JsonRpcResponse<T> {
	if (typeof response !== 'string') {
		return response;
	}

	const dataLine = response
		.split(/\r?\n/)
		.find((line) => line.startsWith('data:'));
	if (!dataLine) {
		throw new DeepwikiMcpAPIError(
			'DeepWiki MCP response did not include an SSE data event',
		);
	}

	return JSON.parse(
		dataLine.slice('data:'.length).trim(),
	) as JsonRpcResponse<T>;
}

export async function makeDeepwikiMcpRequest<T>(
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
		BASE: DEEPWIKIMCP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json, text/event-stream',
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
		const rawResponse = await request<JsonRpcResponse<T> | string>(
			config,
			requestOptions,
		);
		const response = parseJsonRpcResponse(rawResponse);
		if (response.error) {
			throw new DeepwikiMcpAPIError(
				response.error.message ?? 'DeepWiki MCP request failed',
				String(response.error.code ?? ''),
			);
		}
		if (response.result === undefined) {
			throw new DeepwikiMcpAPIError(
				'DeepWiki MCP response did not include a result',
			);
		}
		return response.result;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new DeepwikiMcpAPIError('Unknown error');
	}
}
