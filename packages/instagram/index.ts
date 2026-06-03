import type {
    CorsairPlugin,
    KeyBuilderContext,
    PluginAuthConfig,
    PickAuth,
    CorsairPluginContext,
    CorsairEndpoint,
    PluginPermissionsConfig,
    BindEndpoints
} from 'corsair/core';

import {
    getValidFacebookAccessToken,
} from './client';

import type { InstagramEndpointInputs, InstagramEndpointOutputs } from "./endpoints/types"

import { InstagramEndpointInputSchemas, InstagramEndpointOutputSchemas } from "./endpoints/types"

import { ProfileEndpoints, MediaEndpoints, ImageEndpoints, PublishEndpoints, ReelEndpoints, VideoEndponts, CarouselEndpoints } from "./endpoints/index";

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

type InstagramEndpoint<K extends keyof InstagramEndpointOutputs> = CorsairEndpoint<
	InstagramContext,
	InstagramEndpointInputs[K],
	InstagramEndpointOutputs[K]
>;

export type InstagramEndpoints = {
    GetFacebookUser: InstagramEndpoint<'GetFacebookUser'>
    GetFacebookPages: InstagramEndpoint<'GetFacebookPages'>
    GetInstagramUser: InstagramEndpoint<'GetInstagramUser'>
    GetInstagramMediaList: InstagramEndpoint<'GetInstagramMediaList'>
    GetInstagramMedia: InstagramEndpoint<'GetInstagramMedia'>
    CreateImageContainer: InstagramEndpoint<'CreateImageContainer'>
    CreateReelContainer: InstagramEndpoint<'CreateReelContainer'>
    PublishInstagramMedia: InstagramEndpoint<'PublishInstagramMedia'>
    GetMediaContainerStatus: InstagramEndpoint<'GetMediaContainerStatus'>
    CreateImageStoryContainer: InstagramEndpoint<'CreateImageStoryContainer'>
    CreateVideoStoryContainer: InstagramEndpoint<'CreateVideoStoryContainer'>
    CreateCarouselContainer: InstagramEndpoint<'CreateCarouselContainer'>
    CreateVideoContainer: InstagramEndpoint<'CreateVideoContainer'>
    GetMediaInsights: InstagramEndpoint<'GetMediaInsights'>
    GetAccountInsights: InstagramEndpoint<'GetAccountInsights'>
}

export const InstagramEndpointsNested = {
    profile: {
        GetFacebookUser: ProfileEndpoints.GetFacebookUser,
        GetFacebookPages: ProfileEndpoints.GetFacebookPages,
        GetInstagramUser: ProfileEndpoints.GetInstagramUser,
        insights: ProfileEndpoints.insights,
    },

    media: {
        list: MediaEndpoints.list,
        get: MediaEndpoints.get,
        status: MediaEndpoints.status,
        insights: MediaEndpoints.insights
    },

    image: {
        post: ImageEndpoints.post,
        story: ImageEndpoints.story,
    },

    reel: {
        post: ReelEndpoints.post,
    },

    video: {
        story: VideoEndponts.story,
        createCarouselContainer: VideoEndponts.createCarouselContainer,
    },

    carousel: {
        post: CarouselEndpoints.post,
    },

    publish: {
        publish_media: PublishEndpoints.publish,
    }

} as const;

export type InstagramBoundEndpoints = BindEndpoints<typeof InstagramEndpointsNested>

export type InstagramPluginOptions = {
    authType?: PickAuth<'oauth_2'>;
    key?: string;
    credentials?: InstagramCredentials
    permissions?: PluginPermissionsConfig<typeof InstagramEndpointsNested>
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
    typeof InstagramEndpointsNested,
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

            endpoints: InstagramEndpointsNested,

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