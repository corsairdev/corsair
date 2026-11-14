import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import type { FiberyJson } from './endpoints/types';

export class FiberyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FiberyAPIError';
	}
}

const CommandEnvelopeSchema = z.object({
	success: z.boolean(),
	result: z.json(),
});

function normalizedBaseUrl(workspaceUrl: string | undefined): string {
	if (!workspaceUrl) {
		throw new FiberyAPIError('Set the Fibery workspaceUrl plugin option.');
	}
	let parsed: URL;
	try {
		parsed = new URL(workspaceUrl);
	} catch {
		throw new FiberyAPIError('workspaceUrl must be an HTTPS URL.');
	}
	if (
		parsed.protocol !== 'https:' ||
		parsed.username.length > 0 ||
		parsed.password.length > 0 ||
		parsed.search.length > 0 ||
		parsed.hash.length > 0 ||
		(parsed.pathname !== '/' && parsed.pathname.length > 0)
	) {
		throw new FiberyAPIError(
			'workspaceUrl must be an HTTPS origin without credentials, path, query, or fragment.',
		);
	}
	return parsed.origin;
}

function parseRetryAfter(header: string | null): number | undefined {
	if (header === null) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
	const retryDate = Date.parse(header);
	return Number.isFinite(retryDate)
		? Math.max(0, retryDate - Date.now())
		: undefined;
}

function redactKey(text: string, apiKey: string | undefined): string {
	return text
		.replaceAll(apiKey || '\u0000', '[REDACTED]')
		.replace(/(?:Token|Bearer)\s+\S+/gi, '[REDACTED]');
}

// Core's ApiError goes through (R8) so its status, retryAfter and rate-limit fields reach core (OAuth
// refresh on 401) and the error handlers. It is rebuilt without the sent command, the query, the URL's
// query string and Fibery's reply, which can echo entity field values.
function sanitizedApiError(
	error: ApiError,
	apiKey: string | undefined,
): ApiError {
	const url = new URL(error.url);
	url.search = '';
	return new ApiError(
		{
			...error.request,
			body: undefined,
			formData: undefined,
			query: undefined,
		},
		{
			url: url.toString(),
			ok: false,
			status: error.status,
			statusText: redactKey(error.statusText ?? '', apiKey),
			body: undefined,
		},
		`Fibery request failed with HTTP ${error.status}.`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

function httpError(
	path: string,
	baseUrl: string,
	method: 'GET' | 'POST',
	response: Response,
	message: string,
): ApiError {
	return new ApiError(
		{ method, url: path },
		{
			url: `${baseUrl}${path}`,
			ok: false,
			status: response.status,
			statusText: '',
			body: undefined,
		},
		message,
		{ retryAfter: parseRetryAfter(response.headers.get('retry-after')) },
	);
}

// `unknown` because JavaScript can throw values that are not Error instances.
function safeError(error: unknown, apiKey: string | undefined): Error {
	if (error instanceof ApiError) return sanitizedApiError(error, apiKey);
	if (error instanceof Error) {
		return new FiberyAPIError(redactKey(error.message, apiKey));
	}
	return new FiberyAPIError('Unknown Fibery API error.');
}

function buildConfig(
	workspaceUrl: string | undefined,
	apiKey: string | undefined,
	authType: 'api_key' | 'oauth_2',
): OpenAPIConfig {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('fibery', authType);
	}
	return {
		BASE: normalizedBaseUrl(workspaceUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey
				? {
						Authorization: `${authType === 'oauth_2' ? 'Bearer' : 'Token'} ${apiKey}`,
					}
				: {}),
		},
	};
}

// `unknown` because the provider response is parsed against the operation's output schema.
export async function makeFiberyRequest(
	path: string,
	apiKey: string | undefined,
	options: {
		workspaceUrl?: string;
		authType?: 'api_key' | 'oauth_2';
		method?: ApiRequestOptions['method'];
		body?: ApiRequestOptions['body'];
		query?: ApiRequestOptions['query'];
	} = {},
): Promise<unknown> {
	const {
		workspaceUrl,
		authType = 'api_key',
		method = 'GET',
		body,
		query,
	} = options;
	const config = buildConfig(workspaceUrl, apiKey, authType);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		query,
		mediaType:
			body === undefined ? undefined : 'application/json; charset=utf-8',
	};
	try {
		// `unknown` because HTTP response bodies are untrusted until endpoint schemas parse them.
		// Core's default rate-limit config retries a 429 (Fibery allows 3 requests a second per token),
		// honouring Retry-After; Fibery refused the request, so a write did not land.
		const response = await request(config, requestOptions);
		return response === undefined ? null : response;
	} catch (error) {
		throw safeError(error, apiKey);
	}
}

// `unknown` because command results are dynamic by command and workspace schema.
export async function makeFiberyCommand(
	command: string,
	args: Record<string, FiberyJson>,
	apiKey: string | undefined,
	options: {
		workspaceUrl?: string;
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<unknown> {
	const response = await makeFiberyRequest('/api/commands', apiKey, {
		...options,
		method: 'POST',
		body: { command, args },
	});
	const envelope = CommandEnvelopeSchema.safeParse(response);
	if (!envelope.success) {
		throw new FiberyAPIError('Fibery returned an invalid command response.');
	}
	if (!envelope.data.success) {
		const failure = z
			.object({ name: z.string().optional() })
			.safeParse(envelope.data.result);
		throw new FiberyAPIError(
			failure.success && failure.data.name
				? `Fibery command failed (${failure.data.name}).`
				: 'Fibery command failed.',
			undefined,
			failure.success ? failure.data.name : undefined,
		);
	}
	return envelope.data.result;
}

// `unknown` because the JSON-RPC result varies by method.
export async function makeFiberyJsonRpc(
	method: string,
	params: Record<string, FiberyJson>,
	apiKey: string | undefined,
	options: {
		workspaceUrl?: string;
		authType?: 'api_key' | 'oauth_2';
	} = {},
): Promise<unknown> {
	const response = await makeFiberyRequest('/api/views/json-rpc', apiKey, {
		...options,
		method: 'POST',
		body: { jsonrpc: '2.0', method, params },
	});
	const rpcResponse = z
		.object({
			jsonrpc: z.literal('2.0'),
			result: z.json().optional(),
			error: z
				.object({ code: z.number(), message: z.string() })
				.passthrough()
				.optional(),
		})
		.safeParse(response);
	if (!rpcResponse.success) {
		throw new FiberyAPIError('Fibery returned an invalid JSON-RPC response.');
	}
	if (rpcResponse.data.error) {
		throw new FiberyAPIError(
			`Fibery JSON-RPC request failed (${rpcResponse.data.error.code}).`,
			undefined,
			String(rpcResponse.data.error.code),
		);
	}
	// delete-views answers {"jsonrpc":"2.0"} with no result.
	return rpcResponse.data.result ?? null;
}

export async function makeFiberyBinaryRequest(
	path: string,
	apiKey: string | undefined,
	options: {
		workspaceUrl?: string;
		authType?: 'api_key' | 'oauth_2';
		method: 'GET' | 'POST';
		body?: FormData;
		headers?: Record<string, string>;
	} = { method: 'GET' },
): Promise<{ contentType: string; base64: string }> {
	const {
		workspaceUrl,
		authType = 'api_key',
		method,
		body,
		headers = {},
	} = options;
	const config = buildConfig(workspaceUrl, apiKey, authType);
	const url = `${config.BASE}${path}`;
	try {
		const response = await fetch(url, {
			method,
			body,
			headers: {
				...(apiKey
					? {
							Authorization: `${authType === 'oauth_2' ? 'Bearer' : 'Token'} ${apiKey}`,
						}
					: {}),
				...headers,
			},
			signal: AbortSignal.timeout(20_000),
		});
		if (!response.ok) {
			await response.body?.cancel().catch(() => undefined);
			throw httpError(
				path,
				config.BASE,
				method,
				response,
				`Fibery file request failed with HTTP ${response.status}.`,
			);
		}
		const bytes = new Uint8Array(await response.arrayBuffer());
		let binary = '';
		for (const byte of bytes) binary += String.fromCharCode(byte);
		return {
			contentType:
				response.headers.get('content-type') ?? 'application/octet-stream',
			base64: btoa(binary),
		};
	} catch (error) {
		if (error instanceof FiberyAPIError) throw error;
		throw safeError(error, apiKey);
	}
}

// `unknown` because file metadata must be checked against the upload output schema.
export async function makeFiberyFileUpload(
	form: FormData,
	apiKey: string | undefined,
	options: {
		workspaceUrl?: string;
		authType?: 'api_key' | 'oauth_2';
	},
): Promise<unknown> {
	const { authType = 'api_key' } = options;
	const config = buildConfig(options.workspaceUrl, apiKey, authType);
	try {
		const response = await fetch(`${config.BASE}/api/files`, {
			method: 'POST',
			headers: apiKey
				? {
						Authorization: `${authType === 'oauth_2' ? 'Bearer' : 'Token'} ${apiKey}`,
					}
				: {},
			body: form,
			signal: AbortSignal.timeout(20_000),
		});
		if (!response.ok) {
			await response.body?.cancel().catch(() => undefined);
			throw httpError(
				'/api/files',
				config.BASE,
				'POST',
				response,
				`Fibery file upload failed with HTTP ${response.status}.`,
			);
		}
		// `unknown` because provider JSON is untrusted until the output schema validates it.
		const payload: unknown = await response.json();
		return payload;
	} catch (error) {
		if (error instanceof FiberyAPIError) throw error;
		throw safeError(error, apiKey);
	}
}
