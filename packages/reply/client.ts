 import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';

import { request } from 'corsair/http';

export class ReplyAPIError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'ReplyAPIError';
    }
}

/**
 * Reply.io API v3 base URL.
 *
 * Reply's current API documentation uses:
 * https://api.reply.io/v3
 */
const REPLY_API_BASE = 'https://api.reply.io/v3';

export async function makeReplyRequest<T>(
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
        BASE: REPLY_API_BASE,
        VERSION: '3',
        WITH_CREDENTIALS: false,
        CREDENTIALS: 'omit',

        // Corsair's HTTP layer uses TOKEN for authenticated requests.
        // The Reply API expects the API key as a Bearer token.
        TOKEN: apiKey,

        HEADERS: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const requestOptions: ApiRequestOptions = {
        method,
        url: endpoint,
        body:
            method === 'POST' ||
            method === 'PUT' ||
            method === 'PATCH'
                ? body
                : undefined,
        mediaType: 'application/json; charset=utf-8',
        query,
    };

    try {
        return await request<T>(config, requestOptions);
    } catch (error) {
        if (error instanceof ReplyAPIError) {
            throw error;
        }

        if (error instanceof Error) {
            throw new ReplyAPIError(error.message);
        }

        throw new ReplyAPIError('Unknown Reply.io API error');
    }
}