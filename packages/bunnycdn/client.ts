import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BunnycdnAPIError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'BunnycdnAPIError';
    }
}

const BUNNYCDN_API_BASE = 'https://api.bunny.net';

export async function makeBunnycdnRequest<T>(
    endpoint: string,
    apiKey: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        body?: Record<string, unknown>;
        query?: Record<string, string | number | boolean | undefined>;
    } = {},
): Promise<T> {
    const { method = 'GET', body, query } = options;

    const config: OpenAPIConfig = {
        BASE: BUNNYCDN_API_BASE,
        VERSION: '1.0.0',
        WITH_CREDENTIALS: false,
        CREDENTIALS: 'omit',
        TOKEN: apiKey,
        HEADERS: {
            'Content-Type': 'application/json',
            'AccessKey': apiKey,
        },
    };

    const requestOptions: ApiRequestOptions = {
        method,
        url: endpoint,
        body:
            method === 'POST' || method === 'PUT' || method === 'PATCH'
                ? body
                : undefined,
        mediaType: 'application/json; charset=utf-8',
        query: method === 'GET' ? query : undefined,
    };

    try {
        return await request<T>(config, requestOptions);
    } catch (error) {
        if (error && typeof error === 'object' && 'status' in error) {
            throw error;
        }
        if (error instanceof Error) {
            throw new BunnycdnAPIError(`BunnyCDN API Error: ${error.message}`);
        }
        throw new BunnycdnAPIError('Unknown error');
    }
}