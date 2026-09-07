import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const UPDOWN_IO_API_BASE = 'https://updown.io/api';

export async function makeUpdownIORequest<T>(
	endpoint: string,
	apiKey: string,
): Promise<T> {
	if (!apiKey.trim()) throw new Error('Updown.io API key is required');
	const config: OpenAPIConfig = {
		BASE: UPDOWN_IO_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url: endpoint };
	return await request<T>(config, requestOptions);
}
