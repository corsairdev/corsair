import type {
    BindEndpoints,
    BindWebhooks,
    CorsairEndpoint,
    CorsairErrorHandler,
    CorsairPlugin,
    CorsairPluginContext,
    CorsairWebhook,
    KeyBuilderContext,
    PickAuth,
    PluginAuthConfig,
    PluginPermissionsConfig,
    RequiredPluginEndpointMeta,
    RequiredPluginEndpointSchemas,
    RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { AuthTypes } from 'corsair/core';
import type { BunnycdnEndpointInputs, BunnycdnEndpointOutputs } from './endpoints/types';
import { BunnycdnEndpointInputSchemas, BunnycdnEndpointOutputSchemas } from './endpoints/types';
import type {
    BunnycdnWebhookOutputs,
    ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { PullZoneEndpoints } from './endpoints';
import { BunnycdnSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchBunnycdnTenantWebhook } from './webhooks/tenant-matcher';

export type BunnycdnPluginOptions = {
    authType?: PickAuth<'api_key'>;
    key?: string;
    webhookSecret?: string;
    hooks?: InternalBunnycdnPlugin['hooks'];
    webhookHooks?: InternalBunnycdnPlugin['webhookHooks'];
    errorHandlers?: CorsairErrorHandler;
    permissions?: PluginPermissionsConfig<typeof bunnycdnEndpointsNested>;
};

export type BunnycdnContext = CorsairPluginContext<
    typeof BunnycdnSchema,
    BunnycdnPluginOptions
>;

export type BunnycdnKeyBuilderContext = KeyBuilderContext<BunnycdnPluginOptions>;

export type BunnycdnBoundEndpoints = BindEndpoints<typeof bunnycdnEndpointsNested>;

type BunnycdnEndpoint<
    K extends keyof BunnycdnEndpointOutputs,
> = CorsairEndpoint<
    BunnycdnContext,
    BunnycdnEndpointInputs[K],
    BunnycdnEndpointOutputs[K]
>;

export type BunnycdnEndpoints = {
    pullZoneList: BunnycdnEndpoint<'pullZoneList'>;
    pullZoneGet: BunnycdnEndpoint<'pullZoneGet'>;
};

type BunnycdnWebhook<
    K extends keyof BunnycdnWebhookOutputs,
    TEvent,
> = CorsairWebhook<BunnycdnContext, TEvent, BunnycdnWebhookOutputs[K]>;

export type BunnycdnWebhooks = {
    example: BunnycdnWebhook<'example', ExampleEvent>;
};

export type BunnycdnBoundWebhooks = BindWebhooks<BunnycdnWebhooks>;

const bunnycdnEndpointsNested = {
    pullZone: {
        list: PullZoneEndpoints.list,
        get: PullZoneEndpoints.get,
    },
} as const;

const bunnycdnWebhooksNested = {
    example: {
        example: ExampleWebhooks.example,
    },
} as const;

export const bunnycdnEndpointSchemas = {
    'pullZone.list': {
        input: BunnycdnEndpointInputSchemas.pullZoneList,
        output: BunnycdnEndpointOutputSchemas.pullZoneList,
    },
    'pullZone.get': {
        input: BunnycdnEndpointInputSchemas.pullZoneGet,
        output: BunnycdnEndpointOutputSchemas.pullZoneGet,
    },
} as const satisfies RequiredPluginEndpointSchemas<typeof bunnycdnEndpointsNested>;

const bunnycdnWebhookSchemas = {
    'example.example': {
        description: 'An example webhook event',
        payload: ExampleEventSchema,
        response: ExampleEventSchema,
    },
} as const satisfies RequiredPluginWebhookSchemas<typeof bunnycdnWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bunnycdnEndpointMeta = {
    'pullZone.list': {
        riskLevel: 'read',
        description: 'Get list of all pull zones',
    },
    'pullZone.get': {
        riskLevel: 'read',
        description: 'Get details of a specific pull zone by ID',
    },
} as const satisfies RequiredPluginEndpointMeta<typeof bunnycdnEndpointsNested>;

export const bunnycdnAuthConfig = {
    api_key: {
        account: ['tenant_external_id'] as const,
    },
} as const satisfies PluginAuthConfig;

export type BaseBunnycdnPlugin<T extends BunnycdnPluginOptions> = CorsairPlugin<
    'bunnycdn',
    typeof BunnycdnSchema,
    typeof bunnycdnEndpointsNested,
    typeof bunnycdnWebhooksNested,
    T,
    typeof defaultAuthType
>;

export type InternalBunnycdnPlugin = BaseBunnycdnPlugin<BunnycdnPluginOptions>;

export type ExternalBunnycdnPlugin<T extends BunnycdnPluginOptions> =
    BaseBunnycdnPlugin<T>;

export function bunnycdn<const T extends BunnycdnPluginOptions>(
    incomingOptions: BunnycdnPluginOptions & T = {} as BunnycdnPluginOptions & T,
): ExternalBunnycdnPlugin<T> {
    const options = {
        ...incomingOptions,
        authType: incomingOptions.authType ?? defaultAuthType,
    };
    return {
        id: 'bunnycdn',
        authConfig: bunnycdnAuthConfig,
        schema: BunnycdnSchema,
        options: options,
        hooks: options.hooks,
        webhookHooks: options.webhookHooks,
        endpoints: bunnycdnEndpointsNested,
        webhooks: bunnycdnWebhooksNested,
        endpointMeta: bunnycdnEndpointMeta,
        endpointSchemas: bunnycdnEndpointSchemas,
        webhookSchemas: bunnycdnWebhookSchemas,
        pluginWebhookMatcher: (request) => {
            const headers = request.headers;
            return 'x-bunnycdn-signature' in headers;
        },
        pluginTenantWebhookMatcher: matchBunnycdnTenantWebhook,
        errorHandlers: {
            ...errorHandlers,
            ...options.errorHandlers,
        },
        keyBuilder: async (ctx: BunnycdnKeyBuilderContext, source) => {
            if (source === 'webhook' && options.webhookSecret) {
                return options.webhookSecret;
            }

            if (source === 'webhook') {
                const res = await ctx.keys.get_webhook_signature();
                return res ?? '';
            }

            if (source === 'endpoint' && options.key) {
                return options.key;
            }

            if (source === 'endpoint' && ctx.authType === 'api_key') {
                const res = await ctx.keys.get_api_key();
                return res ?? '';
            }

            return '';
        },
    } satisfies InternalBunnycdnPlugin;
}

export type {
    ExampleEvent,
    BunnycdnWebhookOutputs,
} from './webhooks/types';

export type {
    BunnycdnEndpointInputs,
    BunnycdnEndpointOutputs,
    PullZone,
    PullZoneGetInput,
    PullZoneListInput,
} from './endpoints/types';