import type {
    CorsairPlugin,
    KeyBuilderContext,
    PluginAuthConfig,
    PickAuth,
    CorsairPluginContext,
} from 'corsair/core';

import {
    getValidFacebookAccessToken,
} from './client';

import {
    InstagramSchema
} from "./schema"

import type {
    InstagramCredentials
} from "./schema"

export const instagramAuthConfig = {
    oauth_2: {
        integration: [] as const,
    },
} as const satisfies PluginAuthConfig;

export type InstagramPluginOptions = {
    authType?: PickAuth<'oauth_2'>;
    key?: string;
    credentials?: InstagramCredentials
};

export type InstagramContext = CorsairPluginContext<
    typeof InstagramSchema,
    InstagramPluginOptions,
    undefined,
    typeof instagramAuthConfig
>

type InstagramKeyBuilderContext =
    KeyBuilderContext<
        InstagramPluginOptions,
        typeof instagramAuthConfig
    >;

const defaultAuthType = 'oauth_2' as const;

export type BaseInstagramPlugin<T extends InstagramPluginOptions> = CorsairPlugin<
    'instagram',
    typeof InstagramSchema,
    {},
    {},
    T,
    typeof defaultAuthType,
    typeof instagramAuthConfig
>

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */

export type InternalInstagramPlugin = BaseInstagramPlugin<InstagramPluginOptions>;

export type ExternalInstagramPlugin<T extends InstagramPluginOptions> =
    BaseInstagramPlugin<T>;

export function instagram<const T extends InstagramPluginOptions>(
    incomingOptions: InstagramPluginOptions & T = {} as InstagramPluginOptions & T,
): ExternalInstagramPlugin<T> {
    const options = {
        ...incomingOptions,
        authType: incomingOptions.authType ?? defaultAuthType,
    };
    {
        return {
            id: 'instagram',

            schema: InstagramSchema,

            options,

            authConfig:
                instagramAuthConfig,

            oauthConfig: {
                providerName: 'Facebook',
                authUrl: 'https://www.facebook.com/v25.0/dialog/oauth',
                tokenUrl: 'https://graph.facebook.com/v25.0/oauth/access_token',
                scopes: [
                    'pages_show_list',
                    'pages_manage_metadata',
                    'instagram_basic',
                    'instagram_manage_comments',
                    'instagram_manage_messages',
                    'instagram_content_publish',
                ]
            },

            endpoints: {},

            webhooks: {},

            keyBuilder: async (
                ctx: InstagramKeyBuilderContext
            ) => {
                if (options.key) return options.key;

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
        } satisfies InternalInstagramPlugin;
    }
}