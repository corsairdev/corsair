import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WebvizioAPIError extends Error {
        constructor(
                message: string,
                public readonly code?: string | number,
        ) {
                super(message);
                this.name = 'WebvizioAPIError';
        }
}

const WEBVIZIO_MCP_API_BASE = 'https://app.webvizio.com/api/mcp/v1';
const WEBVIZIO_WEBHOOK_API_BASE = 'https://app.webvizio.com/api/v1';

export async function makeWebvizioRequest<T>(
        endpoint: string,
        apiKey: string,
        options: {
                method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
                body?: Record<string, unknown>;
                query?: Record<string, string | number | boolean | undefined>;
                baseUrl?: string;
        } = {},
): Promise<T> {
        const {
                method = 'GET',
                body,
                query,
                baseUrl = WEBVIZIO_MCP_API_BASE,
        } = options;

        const config: OpenAPIConfig = {
                BASE: baseUrl,
                VERSION: '1.0.0',
                WITH_CREDENTIALS: false,
                CREDENTIALS: 'omit',
                TOKEN: apiKey,
                HEADERS: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                },
        };

        const requestOptions: ApiRequestOptions = {
                method,
                url: endpoint,
                body:
                        method === 'POST' || method === 'PUT' || method === 'PATCH'
                                ? body
                                : undefined,
                mediaType: 'application/json',
                query,
        };

        try {
                return await request<T>(config, requestOptions);
        } catch (error) {
                if (error instanceof ApiError) {
                        const detail =
                                typeof error.body === 'object'
                                        ? JSON.stringify(error.body)
                                        : String(error.body ?? '');

                        throw new WebvizioAPIError(
                                `${error.message} (status=${error.status}, body=${detail})`,
                                error.status,
                        );
                }

                if (error instanceof WebvizioAPIError) {
                        throw error;
                }

                throw new WebvizioAPIError(
                        error instanceof Error ? error.message : 'Unknown error',
                );
        }
}
