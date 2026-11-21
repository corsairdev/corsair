import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const FATHOM_API_BASE = 'https://api.fathom.ai/external/v1';

export function makeFathomAiRequest<T>(
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
	return request<T>(config, { ...options, url });
}
