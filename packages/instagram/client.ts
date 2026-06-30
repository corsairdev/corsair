import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class InstagramAPIError extends Error {
    constructor(
        message: string,
        public readonly code?: number,
    ) {
        super(message);
        this.name = 'InstagramAPIError';
    }
}


//Instagram API calls use Facebook Graph API authentication and token flow, which will also help support future Facebook plugin integrations.

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v25.0';

async function refreshFacebookToken(
    appId: string,
    appSecret: string,
    currentToken: string
) {

    const response = await fetch(
        `${FACEBOOK_API_BASE}/oauth/access_token`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },

            body: new URLSearchParams({
                grant_type: "fb_exchange_token",
                client_id: appId,
                client_secret: appSecret,
                fb_exchange_token: currentToken,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    // Facebook Graph API returns { access_token, expires_in } for fb_exchange_token grants.
    // fetch().json() returns `any`; we assert the known shape rather than introduce a runtime validator.
    return (await response.json()) as {
        access_token: string;
        expires_in: number;
    };
}

export async function getValidFacebookAccessToken({
    accessToken,
    expiresAt,
    appId,
    appSecret,
    forceRefresh = false,
}: {
    appId: string;
    appSecret: string;
    accessToken: string;
    expiresAt?: number | null;
    forceRefresh?: boolean;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {

    const now = Math.floor(Date.now() / 1000);

    // refresh token 5 days before expiry
    const bufferSeconds = 5 * 24 * 60 * 60;

    if (
        !forceRefresh &&
        accessToken &&
        expiresAt &&
        expiresAt > now + bufferSeconds
    ) {
        return {
            accessToken,
            expiresAt,
            refreshed: false,
        };
    }

    const tokenData = await refreshFacebookToken(
        appId,
        appSecret,
        accessToken
    );

    return {
        accessToken: tokenData.access_token,
        expiresAt: now + tokenData.expires_in,
        refreshed: true,
    }

}

type InstagramRequestOptions = {
    method?: 'GET' | 'POST' | 'DELETE',
    body?: Record<string, unknown>,
    query?: Record<string, string | number | boolean | undefined>
};

export async function makeInstagramRequest<T>(
    endpoint: string,
    credentials: string,
    options: InstagramRequestOptions = {}
): Promise<T> {

    const { method = 'GET', body, query } = options;

    const config: OpenAPIConfig = {
        BASE: FACEBOOK_API_BASE,
        VERSION: '1.0.0',
        WITH_CREDENTIALS: false,
        CREDENTIALS: 'omit',
        TOKEN: credentials,
        HEADERS: {
            'Content-Type': 'application/json',
        },
    }

    const requestOptions: ApiRequestOptions = {
        method,
        url: endpoint,
        body:
            method === 'POST' ? body : undefined,
        mediaType: 'application/json',
        query: method === 'GET' ? query : undefined
    }

    try {
        return await request<T>(config, requestOptions);
    } catch (error: unknown) {
        // The corsair HTTP client throws a loosely-typed error object whose shape
        // varies by transport. We inspect known Graph API error paths defensively
        // rather than introducing a full runtime schema validator here.
        const err = error as { body?: { error?: { message?: string; code?: number } }; response?: { body?: { error?: { message?: string; code?: number } }; data?: { error?: { message?: string; code?: number } } } };

        const graphError =
        err?.body?.error ??
        err?.response?.body?.error ??
        err?.response?.data?.error;

        if (graphError) {
            throw new InstagramAPIError(
                graphError.message ?? 'Unknown error',
                graphError.code
            );
        }

        throw error;
    }
}

function isUnauthorizedError(
    error: unknown
): boolean {

    if (error instanceof InstagramAPIError) {
        return error.code === 190;
    }

    return false;
}

/**
 * Wrapper around makeInstagramRequest that retries once on 190 by force-refreshing
 * the access token. Handles the case where a stored token is rejected by Facebook
 * (e.g. revoked, corrupted) even though `expires_at` hasn't passed yet.
 */

export type InstagramRequestContext = {
    key: string;
    _refreshAuth?: () => Promise<string>;
};

export function attachInstagramRefreshAuth(
    ctx: object,
    refreshAuth: () => Promise<string>,
): void {
    Object.assign(ctx, { _refreshAuth: refreshAuth });
}

export async function makeAuthenticatedInstagramRequest<T>(
    endpoint: string,
    ctx: InstagramRequestContext,
    options: InstagramRequestOptions = {},
    getToken?: (userToken?: string) => Promise<string>,
): Promise<T> {
    const token = getToken ? await getToken() : ctx.key;

    try {
        return await makeInstagramRequest<T>(endpoint, token, options);
    } catch (error) {
        if (isUnauthorizedError(error) && ctx._refreshAuth) {
            const freshUserToken = await ctx._refreshAuth(); // store the fresh user token

            if (getToken) {
                // Page-token endpoint: use fresh user token to re-fetch page token.
                const freshPageToken = await getToken(freshUserToken);
                return await makeInstagramRequest<T>(endpoint, freshPageToken, options);
            } else {
                // User-token endpoint: use the fresh user token directly.
                return await makeInstagramRequest<T>(endpoint, freshUserToken, options);
            }
        }
        throw error;
    }
}