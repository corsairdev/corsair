import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const UPDOWN_IO_API_BASE = 'https://updown.io/api';

export async function makeUpdownIORequest<T>(
	endpoint: string,
	apiKey: string,
): Promise<T> {
	const normalizedKey = apiKey.trim();
	if (endpoint === '/checks' && !normalizedKey) {
		throw new Error('Updown.io API key is required');
	}
	const headers: Record<string, string> = { Accept: 'application/json' };
	if (normalizedKey) headers['X-API-KEY'] = normalizedKey;
	const config: OpenAPIConfig = {
		BASE: UPDOWN_IO_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url: endpoint };
	return await request<T>(config, requestOptions);
}
