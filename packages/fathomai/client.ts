import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const FATHOM_API_BASE = 'https://api.fathom.ai/external/v1';

// Core's ApiError keeps the full request URL, query and body. Fathom queries carry email addresses
// (`recorded_by[]`) and caller URLs (`destination_url`), so the error is rebuilt with the path template
// only. Status, body and rate-limit fields stay, so the 429 handler and callers still see them.
function stripRequestData(error: unknown, url: string): unknown {
	if (!(error instanceof ApiError)) return error;
	const templateUrl = `${FATHOM_API_BASE}${url}`;
	return new ApiError(
		{ method: error.request.method, url },
		{
			url: templateUrl,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		`Fathom API request to ${url} failed with HTTP ${error.status}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeFathomAiRequest<T>(
	url: string,
	apiKey: string,
	options: Pick<ApiRequestOptions, 'method' | 'path' | 'query' | 'body'>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: FATHOM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { 'X-Api-Key': apiKey },
	};
	try {
		return await request<T>(config, { ...options, url });
	} catch (error: unknown) {
		// `unknown` because request() rejects with ApiError or runtime network errors.
		throw stripRequestData(error, url);
	}
}
