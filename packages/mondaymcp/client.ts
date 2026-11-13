import { AuthMissingError } from 'corsair/core';

export class MondayMcpAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'MondayMcpAPIError';
	}
}

const MONDAY_MCP_URL = 'https://mcp.monday.com/mcp';

// The hosted Platform MCP server negotiates the MCP protocol revision during
// `initialize`; 2025-06-18 is the revision the Streamable HTTP transport and
// `Mcp-Session-Id` session header behaviour are documented for.
const MCP_PROTOCOL_VERSION = '2025-06-18';

const MCP_CLIENT_INFO = { name: 'corsair-mondaymcp', version: '0.1.0' };

const REQUEST_TIMEOUT_MS = 60_000;

type JsonRpcResponse = {
	jsonrpc?: string;
	id?: number;
	result?: unknown;
	error?: { code?: number; message?: string; data?: unknown };
};

type SessionHeaders = Record<string, string>;

function buildHeaders(
	apiKey: string,
	session?: SessionHeaders,
): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		Accept: 'application/json, text/event-stream',
		Authorization: `Bearer ${apiKey}`,
		...(session ?? {}),
	};
}

function parseRetryAfter(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

async function postRpc(
	apiKey: string,
	body: string,
	session?: SessionHeaders,
): Promise<Response> {
	let response: Response;
	try {
		response = await fetch(MONDAY_MCP_URL, {
			method: 'POST',
			headers: buildHeaders(apiKey, session),
			body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		throw new MondayMcpAPIError(
			`Failed to reach the monday MCP server: ${error instanceof Error ? error.message : 'unknown error'}`,
		);
	}
	if (!response.ok) {
		const text = await response.text().catch(() => '');
		throw new MondayMcpAPIError(
			`monday MCP server returned ${response.status}: ${text || response.statusText}`,
			undefined,
			response.status,
			parseRetryAfter(response.headers.get('retry-after')),
			text || undefined,
		);
	}
	return response;
}

// The Streamable HTTP transport may answer with a single JSON document or with
// an SSE stream that carries the same JSON-RPC frames as `data:` events; both
// are valid server behaviours, so read whichever arrived.
async function readRpcResponse(
	response: Response,
	expectedId: number,
): Promise<JsonRpcResponse> {
	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('text/event-stream')) {
		const raw = await response.text();
		const frames = raw.split(/\r?\n\r?\n/);
		for (const frame of frames) {
			const dataLines = frame
				.split(/\r?\n/)
				.filter((line) => line.startsWith('data:'))
				.map((line) => line.slice(5).trim());
			if (!dataLines.length) continue;
			let parsed: JsonRpcResponse;
			try {
				parsed = JSON.parse(dataLines.join('\n')) as JsonRpcResponse;
			} catch {
				continue;
			}
			if (
				parsed.id === expectedId &&
				(parsed.result !== undefined || parsed.error !== undefined)
			) {
				return parsed;
			}
		}
		throw new MondayMcpAPIError(
			`monday MCP server stream did not contain a response for request ${expectedId}`,
		);
	}
	const payload = (await response.json()) as JsonRpcResponse;
	if (payload.id !== expectedId) {
		throw new MondayMcpAPIError(
			`monday MCP server replied to request ${String(payload.id)} instead of ${expectedId}`,
		);
	}
	return payload;
}

function assertRpcOk(payload: JsonRpcResponse): unknown {
	if (payload.error) {
		throw new MondayMcpAPIError(
			payload.error.message ?? 'monday MCP request failed',
			payload.error.code === undefined ? undefined : String(payload.error.code),
			undefined,
			undefined,
			payload.error.data,
		);
	}
	return payload.result;
}

// The client opens a fresh MCP session per operation: `initialize` (the server
// assigns a session via the Mcp-Session-Id response header), the
// `notifications/initialized` acknowledgement, then the actual `tools/call`.
// This keeps Corsair endpoints stateless; the docs document `tools/call` as the
// single invocation surface for every Platform MCP tool.
export async function makeMondayMcpToolCall<T>(
	apiKey: string,
	toolName: string,
	args: Record<string, unknown>,
): Promise<T> {
	if (!apiKey) {
		throw new AuthMissingError('mondaymcp', 'api_key');
	}

	const initResponse = await postRpc(
		apiKey,
		JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'initialize',
			params: {
				protocolVersion: MCP_PROTOCOL_VERSION,
				capabilities: {},
				clientInfo: MCP_CLIENT_INFO,
			},
		}),
	);
	assertRpcOk(await readRpcResponse(initResponse, 1));

	const sessionId = initResponse.headers.get('mcp-session-id');
	const session: SessionHeaders = sessionId
		? { 'mcp-session-id': sessionId }
		: {};
	const postInitHeaders: SessionHeaders = {
		...session,
		'mcp-protocol-version': MCP_PROTOCOL_VERSION,
	};

	await postRpc(
		apiKey,
		JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
		postInitHeaders,
	);

	const callResponse = await postRpc(
		apiKey,
		JSON.stringify({
			jsonrpc: '2.0',
			id: 2,
			method: 'tools/call',
			params: { name: toolName, arguments: args },
		}),
		postInitHeaders,
	);
	const payload = await readRpcResponse(callResponse, 2);
	const result = assertRpcOk(payload) as
		| { isError?: boolean; content?: Array<{ type?: string; text?: string }> }
		| undefined;

	if (result?.isError) {
		const text = (result.content ?? [])
			.filter((item) => item.type === 'text')
			.map((item) => item.text ?? '')
			.join('\n');
		throw new MondayMcpAPIError(
			text || `monday MCP tool ${toolName} reported an error`,
		);
	}

	return result as T;
}
