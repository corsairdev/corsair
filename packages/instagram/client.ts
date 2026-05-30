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
        query: {
            access_token: credentials, // for every request FACEBOOK take access_token in query
            ...(query || {})
        }
    }

    const response = await request<T>(config, requestOptions);
    return response;
}

function isUnauthorizedError(
	error: unknown
): boolean {

	if (
		typeof error !== 'object' ||
		error === null
	) {
		return false;
	}

	const err = error as {
		status?: number;
		body?: {
			error?: {
				code?: number;
			};
		};
	};

	return (
		err.status === 401 ||
		err.body?.error?.code === 190
	);
}

/**
 * Wrapper around makeInstagramRequest that retries once on 190 by force-refreshing
 * the access token. Handles the case where a stored token is rejected by Facebook
 * (e.g. revoked, corrupted) even though `expires_at` hasn't passed yet.
 */

export async function makeAuthenticatedInstagramRequest<T>(
    endpoint: string,
    ctx: { key: string; _refreshAuth?: () => Promise<string> },
    options: InstagramRequestOptions = {},
): Promise<T> {

    try {
        return await makeInstagramRequest<T>(endpoint, ctx.key, options);
    } catch (error) {
        if (isUnauthorizedError(error) && ctx._refreshAuth) {
            const freshToken = await ctx._refreshAuth();
            return await makeInstagramRequest<T>(endpoint, freshToken, options);
        }
        throw error;
    }

}