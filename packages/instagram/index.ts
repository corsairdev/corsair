import type {
    CorsairPlugin,
    KeyBuilderContext,
    PluginAuthConfig,
} from 'corsair/core';

import {
    getValidFacebookAccessToken,
} from './client';

export const instagramAuthConfig = {
    oauth_2: {
        integration: [] as const,
    },
} as const satisfies PluginAuthConfig;

export type InstagramPluginOptions = {
    authType?: 'oauth_2';
};

type InstagramKeyBuilderContext =
    KeyBuilderContext<
        InstagramPluginOptions,
        typeof instagramAuthConfig
    >;

export function instagram(
    options: InstagramPluginOptions = {}
): CorsairPlugin {

    return {

        id: 'instagram',

        schema: {},

        options,

        authConfig:
            instagramAuthConfig,

        endpoints: {},

        webhooks: {},

        keyBuilder: async (
            ctx: InstagramKeyBuilderContext
        ) => {

            const accessToken =
                await ctx.keys.get_access_token();

            const expiresAt =
                await ctx.keys.get_expires_at();

            const integrationCredentials =
                await ctx.keys
                    .get_integration_credentials();

            if (!accessToken) {
                throw new Error(
                    'Missing access token'
                );
            }

            if (
                !integrationCredentials.client_id ||
                !integrationCredentials.client_secret
            ) {
                throw new Error(
                    'Missing client credentials'
                );
            }

            const result =
                await getValidFacebookAccessToken({
                    accessToken,
                    expiresAt:
                        expiresAt
                            ? Number(expiresAt)
                            : null,

                    appId:
                        integrationCredentials.client_id,

                    appSecret:
                        integrationCredentials.client_secret,
                });

            if (result.refreshed) {

                await ctx.keys
                    .set_access_token(
                        result.accessToken
                    );

                await ctx.keys
                    .set_expires_at(
                        String(result.expiresAt)
                    );
            }

            return result.accessToken;
        },
    } as any;
}