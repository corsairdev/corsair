import type {
        BindEndpoints,
        CorsairErrorHandler,
        CorsairEndpoint,
        CorsairPlugin,
        CorsairPluginContext,
        KeyBuilderContext,
        PickAuth,
        PluginAuthConfig,
        PluginPermissionsConfig,
        RequiredPluginEndpointMeta,
        RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import {
        WebvizioEndpointInputSchemas,
        WebvizioEndpointOutputSchemas,
} from './endpoints/types';
import { Projects, Webhooks } from './endpoints';
import { WebvizioSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type WebvizioPluginOptions = {
        authType?: PickAuth<'api_key'>;
        key?: string;
        hooks?: InternalWebvizioPlugin['hooks'];
        errorHandlers?: CorsairErrorHandler;
        permissions?: PluginPermissionsConfig<typeof webvizioEndpointsNested>;
};

export type WebvizioContext = CorsairPluginContext<
        typeof WebvizioSchema,
        WebvizioPluginOptions
>;

export type WebvizioKeyBuilderContext =
        KeyBuilderContext<WebvizioPluginOptions>;

export type WebvizioBoundEndpoints =
        BindEndpoints<typeof webvizioEndpointsNested>;

type WebvizioEndpoint<
        K extends keyof WebvizioEndpointOutputs,
> = CorsairEndpoint<
        WebvizioContext,
        WebvizioEndpointInputs[K],
        WebvizioEndpointOutputs[K]
>;

import type {
        WebvizioEndpointInputs,
        WebvizioEndpointOutputs,
} from './endpoints/types';

export type WebvizioEndpoints = {
        projectsList: WebvizioEndpoint<'projectsList'>;
        webhooksList: WebvizioEndpoint<'webhooksList'>;
};

const webvizioEndpointsNested = {
        projects: {
                list: Projects.list,
        },
        webhooks: {
                list: Webhooks.list,
        },
} as const;

const webvizioWebhooksNested = {} as const;

export const webvizioEndpointSchemas = {
        'projects.list': {
                input: WebvizioEndpointInputSchemas.projectsList,
                output: WebvizioEndpointOutputSchemas.projectsList,
        },
        'webhooks.list': {
                input: WebvizioEndpointInputSchemas.webhooksList,
                output: WebvizioEndpointOutputSchemas.webhooksList,
        },
} as const satisfies RequiredPluginEndpointSchemas<
        typeof webvizioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const webvizioEndpointMeta = {
        'projects.list': {
                riskLevel: 'read',
                description: 'List all available Webvizio projects',
        },
        'webhooks.list': {
                riskLevel: 'read',
                description: 'List Webvizio webhook subscriptions',
        },
} as const satisfies RequiredPluginEndpointMeta<
        typeof webvizioEndpointsNested
>;

export const webvizioAuthConfig = {
        api_key: {
                account: ['tenant_external_id'] as const,
        },
} as const satisfies PluginAuthConfig;

export type BaseWebvizioPlugin<
        T extends WebvizioPluginOptions,
> = CorsairPlugin<
        'webvizio',
        typeof WebvizioSchema,
        typeof webvizioEndpointsNested,
        typeof webvizioWebhooksNested,
        T,
        typeof defaultAuthType
>;

export type InternalWebvizioPlugin =
        BaseWebvizioPlugin<WebvizioPluginOptions>;

export type ExternalWebvizioPlugin<
        T extends WebvizioPluginOptions,
> = BaseWebvizioPlugin<T>;

export function webvizio<const T extends WebvizioPluginOptions>(
        incomingOptions: WebvizioPluginOptions & T =
                {} as WebvizioPluginOptions & T,
): ExternalWebvizioPlugin<T> {
        const options = {
                ...incomingOptions,
                authType: incomingOptions.authType ?? defaultAuthType,
        };

        return {
                id: 'webvizio',
                authConfig: webvizioAuthConfig,
                schema: WebvizioSchema,
                options,
                hooks: options.hooks,
                endpoints: webvizioEndpointsNested,
                webhooks: webvizioWebhooksNested,
                endpointMeta: webvizioEndpointMeta,
                endpointSchemas: webvizioEndpointSchemas,
                errorHandlers: {
                        ...errorHandlers,
                        ...options.errorHandlers,
                },
                keyBuilder: async (
                        ctx: WebvizioKeyBuilderContext,
                        source,
                ) => {
                        if (source === 'endpoint' && options.key) {
                                return options.key;
                        }

                        if (
                                source === 'endpoint' &&
                                ctx.authType === 'api_key'
                        ) {
                                const res = await ctx.keys.get_api_key();
                                return res ?? '';
                        }

                        return '';
                },
        } satisfies InternalWebvizioPlugin;
}

export type {
        WebvizioEndpointInputs,
        WebvizioEndpointOutputs,
        WebvizioProject,
        WebvizioWebhookSubscription,
} from './endpoints/types';
