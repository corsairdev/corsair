import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const WISPRFLOW_API_BASE = 'https://platform-api.wisprflow.ai/api/v1/dash';

export function makeWisprFlowRequest<T>(
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
	return request<T>(config, {
		...options,
		url,
		mediaType: 'application/json',
	});
}
