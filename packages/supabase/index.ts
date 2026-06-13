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
} from 'corsair/core'
import type { AuthTypes } from 'corsair/core'
import type {
  SupabaseEndpointInputs,
  SupabaseEndpointOutputs,
} from './endpoints/types'
import {
  SupabaseEndpointInputSchemas,
  SupabaseEndpointOutputSchemas,
} from './endpoints/types'
import type { SupabaseWebhookOutputs, ExampleEvent } from './webhooks/types'
import { ExampleEventSchema } from './webhooks/types'
import { Example } from './endpoints'
import { SupabaseSchema } from './schema'
import { ExampleWebhooks } from './webhooks'
import { errorHandlers } from './error-handlers'

export type SupabasePluginOptions = {
  authType?: PickAuth<'api_key'>
  key?: string
  webhookSecret?: string
  hooks?: InternalSupabasePlugin['hooks']
  webhookHooks?: InternalSupabasePlugin['webhookHooks']
  errorHandlers?: CorsairErrorHandler
  permissions?: PluginPermissionsConfig<typeof supabaseEndpointsNested>
}

export type SupabaseContext = CorsairPluginContext<
  typeof SupabaseSchema,
  SupabasePluginOptions
>

export type SupabaseKeyBuilderContext = KeyBuilderContext<SupabasePluginOptions>

export type SupabaseBoundEndpoints = BindEndpoints<
  typeof supabaseEndpointsNested
>

type SupabaseEndpoint<K extends keyof SupabaseEndpointOutputs> =
  CorsairEndpoint<
    SupabaseContext,
    SupabaseEndpointInputs[K],
    SupabaseEndpointOutputs[K]
  >

export type SupabaseEndpoints = {
  exampleGet: SupabaseEndpoint<'exampleGet'>
}

type SupabaseWebhook<
  K extends keyof SupabaseWebhookOutputs,
  TEvent,
> = CorsairWebhook<SupabaseContext, TEvent, SupabaseWebhookOutputs[K]>

export type SupabaseWebhooks = {
  example: SupabaseWebhook<'example', ExampleEvent>
}

export type SupabaseBoundWebhooks = BindWebhooks<SupabaseWebhooks>

const supabaseEndpointsNested = {
  example: {
    get: Example.get,
  },
} as const

const supabaseWebhooksNested = {
  example: {
    example: ExampleWebhooks.example,
  },
} as const

export const supabaseEndpointSchemas = {
  'example.get': {
    input: SupabaseEndpointInputSchemas.exampleGet,
    output: SupabaseEndpointOutputSchemas.exampleGet,
  },
} as const

const supabaseWebhookSchemas = {
  'example.example': {
    description: 'An example webhook event',
    payload: ExampleEventSchema,
    response: ExampleEventSchema,
  },
} as const

const defaultAuthType: AuthTypes = 'api_key' as const

const supabaseEndpointMeta = {
  'example.get': {
    riskLevel: 'read',
    description: 'Get an example resource by ID',
  },
} as const

export const supabaseAuthConfig = {
  api_key: {
    account: ['one'] as const,
  },
} as const satisfies PluginAuthConfig

export type BaseSupabasePlugin<T extends SupabasePluginOptions> = CorsairPlugin<
  'supabase',
  typeof SupabaseSchema,
  typeof supabaseEndpointsNested,
  typeof supabaseWebhooksNested,
  T,
  typeof defaultAuthType
>

export type InternalSupabasePlugin = BaseSupabasePlugin<SupabasePluginOptions>

export type ExternalSupabasePlugin<T extends SupabasePluginOptions> =
  BaseSupabasePlugin<T>

export function supabase<const T extends SupabasePluginOptions>(
  incomingOptions: SupabasePluginOptions & T = {} as SupabasePluginOptions & T
): ExternalSupabasePlugin<T> {
  const options = {
    ...incomingOptions,
    authType: incomingOptions.authType ?? defaultAuthType,
  }
  return {
    id: 'supabase',
    schema: SupabaseSchema,
    options: options,
    hooks: options.hooks,
    webhookHooks: options.webhookHooks,
    endpoints: supabaseEndpointsNested,
    webhooks: supabaseWebhooksNested,
    endpointMeta: supabaseEndpointMeta,
    endpointSchemas: supabaseEndpointSchemas,
    webhookSchemas: supabaseWebhookSchemas,
    pluginWebhookMatcher: request => {
      const headers = request.headers
      // TODO: Update to match your webhook signature headers
      return 'x-supabase-signature' in headers
    },
    errorHandlers: {
      ...errorHandlers,
      ...options.errorHandlers,
    },
    keyBuilder: async (ctx: SupabaseKeyBuilderContext, source) => {
      if (source === 'webhook' && options.webhookSecret) {
        return options.webhookSecret
      }

      if (source === 'webhook') {
        const res = await ctx.keys.get_webhook_signature()
        return res ?? ''
      }

      if (source === 'endpoint' && options.key) {
        return options.key
      }

      if (source === 'endpoint' && ctx.authType === 'api_key') {
        const res = await ctx.keys.get_api_key()
        return res ?? ''
      }

      return ''
    },
  } satisfies InternalSupabasePlugin
}

export type { ExampleEvent, SupabaseWebhookOutputs } from './webhooks/types'

export type {
  SupabaseEndpointInputs,
  SupabaseEndpointOutputs,
  ExampleGetInput,
  ExampleGetResponse,
} from './endpoints/types'
