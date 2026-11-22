import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const WISPRFLOW_API_BASE = 'https://platform-api.wisprflow.ai/api/v1/dash';

// `unknown`: error bodies are whatever the provider sent; only its `detail` message is kept.
function safeErrorBody(body: unknown): { detail?: unknown } {
	if (!body || typeof body !== 'object' || !('detail' in body)) return {};
	const { detail } = body;
	if (typeof detail === 'string') return { detail };
	// FastAPI-style validation errors echo the rejected `input`; keep where and why only.
	if (Array.isArray(detail)) {
		return {
			detail: detail.map((item: unknown) =>
				item && typeof item === 'object'
					? {
							loc: 'loc' in item ? item.loc : undefined,
							msg: 'msg' in item ? item.msg : undefined,
						}
					: undefined,
			),
		};
	}
	return {};
}

// Core's ApiError keeps the request body: base64 audio, dictation context, or the client JWT being
// revoked. The error is rebuilt with the path only, keeping status, the provider's message and
// rate-limit fields so the error handlers still match.
function stripRequestData(error: unknown, url: string): unknown {
	if (!(error instanceof ApiError)) return error;
	const body = safeErrorBody(error.body);
	return new ApiError(
		{ method: error.request.method, url },
		{
			url: `${WISPRFLOW_API_BASE}${url}`,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		typeof body.detail === 'string'
			? body.detail
			: `Wispr Flow request to ${url} failed with HTTP ${error.status}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeWisprFlowRequest<T>(
	url: string,
	apiKey: string,
	options: Pick<ApiRequestOptions, 'method' | 'body'>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: WISPRFLOW_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		// Uploads run to 25MB and cold TLS here has taken over 8s; core's 20s default would abort a billed transcription mid-flight.
		TIMEOUT: 120_000,
	};
	try {
		return await request<T>(config, {
			...options,
			url,
			mediaType: 'application/json',
		});
	} catch (error: unknown) {
		// `unknown` because request() rejects with ApiError or runtime network errors.
		throw stripRequestData(error, url);
	}
}
