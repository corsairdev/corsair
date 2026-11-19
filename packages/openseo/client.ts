import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * A failed OpenSEO tool call: a JSON-RPC error (unknown tool, bad request) or
 * a tool result with `isError: true`. OpenSEO puts its error code or a short
 * sentence in the text (`NOT_FOUND`, `INSUFFICIENT_CREDITS`, `Input
 * validation error: ...`), which the error handlers match on.
 */
export class OpenseoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OpenseoAPIError';
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all, a valid state for accounts that only pass the key
 * through plugin options. That resolves to "no stored key"; anything else
 * thrown (decryption failure, database error) propagates.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * OpenSEO's API is its hosted MCP server (Streamable HTTP, stateless). Every
 * operation is one JSON-RPC `tools/call` POST with `Authorization: Bearer
 * oseo_...` (https://openseo.so/docs/mcp). The server needs no `initialize`
 * handshake or session id for an API key, and answers with one JSON document.
 */
export const OPENSEO_API_BASE = 'https://app.openseo.so';

// No trailing slash: OpenSEO serves MCP only at exactly `/mcp`.
export const OPENSEO_MCP_PATH = '/mcp';

const MCP_PROTOCOL_VERSION = '2025-06-18';

// Website research, rank grids and SERP batches run for tens of seconds;
// core's 20 s default would abort calls the server is still answering.
const REQUEST_TIMEOUT_MS = 120_000;

// Provider error text is what tells an agent what to change ("projectId:
// Invalid input"), so it is kept, capped in length.
const MAX_ERROR_TEXT = 500;

type JsonRpcReply = {
	jsonrpc?: string;
	id?: number | string | null;
	result?: {
		content?: Array<{ type?: string; text?: string }>;
		// `unknown` is necessary because each tool returns its own structured result; the operation's output schema parses it.
		structuredContent?: unknown;
		isError?: boolean;
	};
	error?: {
		code?: number;
		message?: string;
	};
};

let nextRequestId = 1;

function describe(text: string | undefined, fallback: string): string {
	const detail = text?.replace(/\s+/g, ' ').trim().slice(0, MAX_ERROR_TEXT);
	return detail || fallback;
}

/**
 * The Streamable HTTP transport may answer with one JSON document or with an
 * SSE stream that carries the same JSON-RPC frames as `data:` events. OpenSEO
 * sends JSON; the stream form is read too so a server change can't break calls.
 */
// `unknown` is necessary because the body is whatever the transport returned (parsed JSON or SSE text).
function readReply(body: unknown, id: number): JsonRpcReply {
	if (typeof body === 'string') {
		for (const frame of body.split(/\r?\n\r?\n/)) {
			const data = frame
				.split(/\r?\n/)
				.filter((line) => line.startsWith('data:'))
				.map((line) => line.slice(5).trim())
				.join('\n');
			if (!data) continue;
			try {
				const parsed = JSON.parse(data) as JsonRpcReply;
				if (parsed.id === id) return parsed;
			} catch {
				// Not a JSON-RPC frame (a comment or keep-alive); keep reading.
			}
		}
		throw new OpenseoAPIError('OpenSEO returned an unreadable MCP response');
	}
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		throw new OpenseoAPIError('OpenSEO returned an unreadable MCP response');
	}
	return body as JsonRpcReply;
}

/**
 * Calls one OpenSEO MCP tool and returns its structured result. A JSON-RPC
 * error or an `isError` result throws OpenseoAPIError with OpenSEO's text; an
 * HTTP failure (401 bad key, 429 rate limit) throws core's ApiError.
 */
export async function callOpenseoTool(
	tool: string,
	// `unknown` is necessary because arguments differ per tool; each was validated by its input schema.
	args: Record<string, unknown>,
	apiKey: string,
): Promise<unknown> {
	// Defense in depth: keyBuilder already throws AuthMissingError before an
	// empty key reaches the client.
	if (apiKey.length === 0) {
		throw new AuthMissingError('openseo', 'api_key');
	}

	const id = nextRequestId++;
	const config: OpenAPIConfig = {
		BASE: OPENSEO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: REQUEST_TIMEOUT_MS,
		HEADERS: {
			// Streamable HTTP clients must accept both forms of reply.
			Accept: 'application/json, text/event-stream',
			Authorization: `Bearer ${apiKey}`,
			'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: OPENSEO_MCP_PATH,
		body: {
			jsonrpc: '2.0',
			id,
			method: 'tools/call',
			params: { name: tool, arguments: args },
		},
		mediaType: 'application/json',
	};

	// `unknown` is necessary because the body is untrusted until readReply narrows it.
	let body: unknown;
	try {
		body = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw withoutRequestData(error);
		throw error;
	}

	const reply = readReply(body, id);
	if (reply.error) {
		throw new OpenseoAPIError(
			describe(reply.error.message, 'OpenSEO MCP request failed'),
			typeof reply.error.code === 'number'
				? String(reply.error.code)
				: undefined,
		);
	}
	const result = reply.result;
	if (!result) {
		throw new OpenseoAPIError('OpenSEO returned no tool result');
	}
	const text = (result.content ?? [])
		.filter((part) => part.type === 'text' && typeof part.text === 'string')
		.map((part) => part.text)
		.join('\n');
	if (result.isError) {
		// AI visibility tools also return the error as structuredContent
		// ({ status: 'error', code, message }); its code is kept when present.
		const structured =
			typeof result.structuredContent === 'object' &&
			result.structuredContent !== null
				? (result.structuredContent as { code?: unknown; message?: unknown })
				: {};
		const message = describe(
			typeof structured.message === 'string' ? structured.message : text,
			'OpenSEO tool call failed',
		);
		const code =
			typeof structured.code === 'string'
				? structured.code
				: /^[A-Z][A-Z_]+$/.test(message)
					? message
					: undefined;
		throw new OpenseoAPIError(message, code);
	}
	if (result.structuredContent === undefined) {
		// Every OpenSEO tool declares an output schema, so a success always
		// carries structuredContent; a reply without it is malformed.
		throw new OpenseoAPIError('OpenSEO returned no structured result');
	}
	return result.structuredContent;
}

const REDACTED = '[REDACTED]';

/**
 * Core keeps the sent body on `ApiError.request`. Here that body holds the
 * tool arguments (keywords, domains, report HTML, project memory), so the
 * error is rebuilt without it, keeping the status, message and rate-limit
 * fields the error handlers and core's retries read. OpenSEO's HTTP error
 * bodies (`{ error, error_description }`) carry no request data.
 */
function withoutRequestData(error: ApiError): ApiError {
	return new ApiError(
		{
			...error.request,
			body: error.request.body === undefined ? undefined : REDACTED,
		},
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
