import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { z } from 'zod';

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

// Envelope of a JSON-RPC 2.0 response. `result` is intentionally
// `unknown`: its concrete shape is operation-specific, so it is
// validated by the endpoint output schema passed to this module
// instead of being asserted here.
const JsonRpcResponseSchema = z
	.object({
		id: z.unknown().optional(),
		result: z.unknown().optional(),
		error: z
			.object({
				code: z.number().optional(),
				message: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

type JsonRpcResponse = z.infer<typeof JsonRpcResponseSchema>;

// Parses one SSE `data:` line and returns the envelope only when it is
// the JSON-RPC response for `requestId` that carries a result or an
// error. Notifications (no id) and unrelated events yield null.
function parseResponseDataLine(
	line: string,
	requestId: string,
): JsonRpcResponse | null {
	const payload = line.slice('data:'.length).trim();
	let parsed: unknown;
	try {
		parsed = JSON.parse(payload);
	} catch {
		return null;
	}
	const envelope = JsonRpcResponseSchema.safeParse(parsed);
	if (!envelope.success) {
		return null;
	}
	if (envelope.data.id !== undefined && envelope.data.id !== requestId) {
		return null;
	}
	if (envelope.data.result === undefined && envelope.data.error === undefined) {
		return null;
	}
	return envelope.data;
}

// A Streamable HTTP response can arrive as a plain JSON body or as an
// SSE stream that interleaves notifications before the actual response,
// so every data line is inspected and the one matching our request id
// wins instead of blindly trusting the first line.
function parseJsonRpcResponse(
	response: JsonRpcResponse | string,
	requestId: string,
): JsonRpcResponse {
	if (typeof response !== 'string') {
		const direct = JsonRpcResponseSchema.safeParse(response);
		if (!direct.success) {
			throw new DeepwikiMcpAPIError(
				'DeepWiki MCP returned an unexpected response shape',
			);
		}
		return direct.data;
	}

	for (const line of response.split(/\r?\n/)) {
		if (!line.startsWith('data:')) {
			continue;
		}
		const parsed = parseResponseDataLine(line, requestId);
		if (parsed !== null) {
			return parsed;
		}
	}

	throw new DeepwikiMcpAPIError(
		'DeepWiki MCP response did not include an SSE data event with a JSON-RPC response',
	);
}

export async function makeDeepwikiMcpRequest<S extends z.ZodType>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		requestId?: string;
	},
	outputSchema: S,
): Promise<z.output<S>> {
	const { method = 'GET', body, query, requestId = '' } = options;

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
		const rawResponse = await request<JsonRpcResponse | string>(
			config,
			requestOptions,
		);
		const response = parseJsonRpcResponse(rawResponse, requestId);
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
		return outputSchema.parse(response.result);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new DeepwikiMcpAPIError('Unknown error');
	}
}

// Sends one MCP tools/call request. The generated id lets the SSE
// parser pick our response out of a multi-event stream.
export async function callDeepwikiMcpTool<S extends z.ZodType>(
	toolName: string,
	args: Record<string, unknown>,
	apiKey: string,
	outputSchema: S,
): Promise<z.output<S>> {
	const requestId = crypto.randomUUID();
	return makeDeepwikiMcpRequest(
		'mcp',
		apiKey,
		{
			method: 'POST',
			body: {
				jsonrpc: '2.0',
				id: requestId,
				method: 'tools/call',
				params: { name: toolName, arguments: args },
			},
			requestId,
		},
		outputSchema,
	);
}
