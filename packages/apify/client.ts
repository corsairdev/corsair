import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import {
	StreamableHTTPClientTransport,
	StreamableHTTPError,
} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const APIFY_MCP_URL = 'https://mcp.apify.com';

export class ApifyMcpAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// MCP tool error payloads vary by tool; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error; body?: unknown; retryAfter?: number },
	) {
		super(message, options);
		this.name = 'ApifyMcpAPIError';
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;

		if (options?.cause instanceof StreamableHTTPError) {
			this.status = options.cause.code;
			this.statusText = options.cause.message;
		}
	}
}

/** Parse Retry-After into milliseconds for Corsair error handlers. */
function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const asSeconds = Number(header);
	if (Number.isFinite(asSeconds)) return Math.max(0, asSeconds * 1000);
	const asDate = Date.parse(header);
	if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
	return undefined;
}

function normalizeToolResult(result: unknown): CallToolResult {
	if (
		typeof result === 'object' &&
		result !== null &&
		'content' in result &&
		// Asserting CallToolResult after confirming the required `content` array exists.
		Array.isArray((result as CallToolResult).content)
	) {
		return result as CallToolResult;
	}

	if (
		typeof result === 'object' &&
		result !== null &&
		'structuredContent' in result &&
		// MCP SDK may return structuredContent without a content array on newer transports.
		(result as { structuredContent?: unknown }).structuredContent !== undefined
	) {
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						(result as { structuredContent: unknown }).structuredContent,
					),
				},
			],
			isError: Boolean((result as { isError?: boolean }).isError),
		};
	}

	return {
		content: [{ type: 'text', text: JSON.stringify(result) }],
		isError: Boolean(
			typeof result === 'object' &&
				result !== null &&
				'isError' in result &&
				(result as { isError?: boolean }).isError,
		),
	};
}

function parseToolResult(result: CallToolResult): unknown {
	if (result.structuredContent !== undefined) {
		return result.structuredContent;
	}

	const text = result.content
		.filter(
			(item): item is { type: 'text'; text: string } => item.type === 'text',
		)
		.map((item) => item.text)
		.join('\n')
		.trim();

	if (!text) {
		return { content: result.content };
	}

	try {
		return JSON.parse(text);
	} catch {
		return { text, content: result.content };
	}
}

function toolErrorMessage(result: CallToolResult): string {
	const parsed = parseToolResult(result);
	if (typeof parsed === 'object' && parsed !== null && 'error' in parsed) {
		return String((parsed as { error: unknown }).error);
	}
	return 'Apify MCP tool call failed';
}

/**
 * Calls a tool on the hosted Apify MCP server (Streamable HTTP).
 *
 * Auth: optional Apify API token via Authorization Bearer header. Discovery and
 * documentation tools work without a token; Actor runs require authentication.
 *
 * Each call opens a fresh MCP session. This avoids stale-session bugs and keeps
 * auth token rotation simple at the cost of per-request connection setup.
 */
export async function callApifyMcpTool<T>(
	toolName: string,
	args: Record<string, unknown>,
	apiKey?: string,
): Promise<T> {
	// StreamableHTTPError only carries status/code; capture Retry-After via fetch.
	let retryAfterMs: number | undefined;
	const fetchWithRetryAfter: typeof fetch = async (input, init) => {
		const response = await fetch(input, init);
		retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
		return response;
	};

	const transport = new StreamableHTTPClientTransport(new URL(APIFY_MCP_URL), {
		requestInit: apiKey
			? { headers: { Authorization: `Bearer ${apiKey}` } }
			: undefined,
		fetch: fetchWithRetryAfter,
	});
	const client = new Client({ name: 'corsair-apify', version: '1.0.0' });

	try {
		await client.connect(transport);
		const rawResult = await client.callTool({
			name: toolName,
			arguments: args,
		});
		const result = normalizeToolResult(rawResult);
		if (result.isError) {
			throw new ApifyMcpAPIError(toolErrorMessage(result), undefined, {
				body: parseToolResult(result),
				retryAfter: retryAfterMs,
			});
		}
		// Caller supplies T; endpoint output schemas validate the parsed payload.
		return parseToolResult(result) as T;
	} catch (error) {
		if (error instanceof ApifyMcpAPIError) {
			throw error;
		}
		if (error instanceof StreamableHTTPError) {
			throw new ApifyMcpAPIError(error.message, error.code, {
				cause: error,
				retryAfter: retryAfterMs,
			});
		}
		if (error instanceof Error) {
			throw new ApifyMcpAPIError(error.message, undefined, {
				cause: error,
				retryAfter: retryAfterMs,
			});
		}
		throw new ApifyMcpAPIError('Unknown Apify MCP error');
	} finally {
		await client.close().catch(() => undefined);
		await transport.close().catch(() => undefined);
	}
}
