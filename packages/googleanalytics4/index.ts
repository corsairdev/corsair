import type {
  AuthTypes,
  BindEndpoints,
  CorsairEndpoint,
  CorsairErrorHandler,
  CorsairPlugin,
  CorsairPluginContext,
  KeyBuilderContext,
  PickAuth,
  PluginAuthConfig,
  PluginPermissionsConfig,
  RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getValidGA4AccessToken } from './client';
import {
  Accounts,
  Audiences,
  CustomDimensions,
  CustomMetrics,
  DataStreams,
  Properties,
  Reporting,
  MeasurementProtocol,
} from './endpoints';
import type {
  GA4EndpointInputs,
  GA4EndpointOutputs,
} from './endpoints/types';
import {
  GA4EndpointInputSchemas,
  GA4EndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GA4Schema } from './schema';

export type GA4PluginOptions = {
  authType?: PickAuth<'oauth_2'>;
  key?: string;
  hooks?: InternalGA4Plugin['hooks'];
  errorHandlers?: CorsairErrorHandler;
  /**
   * Permission configuration for the GA4 plugin.
   * Controls what the AI agent is allowed to do.
   * Overrides use dot-notation paths from the GA4 endpoint tree — invalid paths are type errors.
   */
  permissions?: PluginPermissionsConfig<typeof ga4EndpointsNested>;
};

export type GA4Context = CorsairPluginContext<
  typeof GA4Schema,
  GA4PluginOptions
>;

export type GA4KeyBuilderContext = KeyBuilderContext<GA4PluginOptions>;

export type GA4BoundEndpoints = BindEndpoints<typeof ga4EndpointsNested>;

type GA4Endpoint<K extends keyof GA4EndpointOutputs> = CorsairEndpoint<
  GA4Context,
  GA4EndpointInputs[K],
  GA4EndpointOutputs[K]
>;

export type GA4Endpoints = {
  accountsGet: GA4Endpoint<'accountsGet'>;
  accountsList: GA4Endpoint<'accountsList'>;
  propertiesGet: GA4Endpoint<'propertiesGet'>;
  propertiesList: GA4Endpoint<'propertiesList'>;
  propertiesCreate: GA4Endpoint<'propertiesCreate'>;
  propertiesUpdate: GA4Endpoint<'propertiesUpdate'>;
  customDimensionsList: GA4Endpoint<'customDimensionsList'>;
  customDimensionsCreate: GA4Endpoint<'customDimensionsCreate'>;
  customMetricsList: GA4Endpoint<'customMetricsList'>;
  customMetricsCreate: GA4Endpoint<'customMetricsCreate'>;
  dataStreamsList: GA4Endpoint<'dataStreamsList'>;
  dataStreamsGet: GA4Endpoint<'dataStreamsGet'>;
  audiencesList: GA4Endpoint<'audiencesList'>;
  audiencesCreate: GA4Endpoint<'audiencesCreate'>;
  runReport: GA4Endpoint<'runReport'>;
  runRealtimeReport: GA4Endpoint<'runRealtimeReport'>;
  measurementProtocolEvent: GA4Endpoint<'measurementProtocolEvent'>;
  measurementProtocolValidate: GA4Endpoint<'measurementProtocolValidate'>;
};

const ga4EndpointsNested = {
  accounts: {
    get: Accounts.get,
    list: Accounts.list,
  },
  properties: {
    get: Properties.get,
    list: Properties.list,
    create: Properties.create,
    update: Properties.update,
  },
  customDimensions: {
    list: CustomDimensions.list,
    create: CustomDimensions.create,
  },
  customMetrics: {
    list: CustomMetrics.list,
    create: CustomMetrics.create,
  },
  dataStreams: {
    list: DataStreams.list,
    get: DataStreams.get,
  },
  audiences: {
    list: Audiences.list,
    create: Audiences.create,
  },
  reporting: {
    runReport: Reporting.runReport,
    runRealtimeReport: Reporting.runRealtimeReport,
  },
  measurementProtocol: {
    sendEvent: MeasurementProtocol.sendEvent,
    validate: MeasurementProtocol.validate,
  },
} as const;

export const ga4EndpointSchemas = {
  'accounts.get': {
    input: GA4EndpointInputSchemas.accountsGet,
    output: GA4EndpointOutputSchemas.accountsGet,
  },
  'accounts.list': {
    input: GA4EndpointInputSchemas.accountsList,
    output: GA4EndpointOutputSchemas.accountsList,
  },
  'properties.get': {
    input: GA4EndpointInputSchemas.propertiesGet,
    output: GA4EndpointOutputSchemas.propertiesGet,
  },
  'properties.list': {
    input: GA4EndpointInputSchemas.propertiesList,
    output: GA4EndpointOutputSchemas.propertiesList,
  },
  'properties.create': {
    input: GA4EndpointInputSchemas.propertiesCreate,
    output: GA4EndpointOutputSchemas.propertiesCreate,
  },
  'properties.update': {
    input: GA4EndpointInputSchemas.propertiesUpdate,
    output: GA4EndpointOutputSchemas.propertiesUpdate,
  },
  'customDimensions.list': {
    input: GA4EndpointInputSchemas.customDimensionsList,
    output: GA4EndpointOutputSchemas.customDimensionsList,
  },
  'customDimensions.create': {
    input: GA4EndpointInputSchemas.customDimensionsCreate,
    output: GA4EndpointOutputSchemas.customDimensionsCreate,
  },
  'customMetrics.list': {
    input: GA4EndpointInputSchemas.customMetricsList,
    output: GA4EndpointOutputSchemas.customMetricsList,
  },
  'customMetrics.create': {
    input: GA4EndpointInputSchemas.customMetricsCreate,
    output: GA4EndpointOutputSchemas.customMetricsCreate,
  },
  'dataStreams.list': {
    input: GA4EndpointInputSchemas.dataStreamsList,
    output: GA4EndpointOutputSchemas.dataStreamsList,
  },
  'dataStreams.get': {
    input: GA4EndpointInputSchemas.dataStreamsGet,
    output: GA4EndpointOutputSchemas.dataStreamsGet,
  },
  'audiences.list': {
    input: GA4EndpointInputSchemas.audiencesList,
    output: GA4EndpointOutputSchemas.audiencesList,
  },
  'audiences.create': {
    input: GA4EndpointInputSchemas.audiencesCreate,
    output: GA4EndpointOutputSchemas.audiencesCreate,
  },
  'reporting.runReport': {
    input: GA4EndpointInputSchemas.runReport,
    output: GA4EndpointOutputSchemas.runReport,
  },
  'reporting.runRealtimeReport': {
    input: GA4EndpointInputSchemas.runRealtimeReport,
    output: GA4EndpointOutputSchemas.runRealtimeReport,
  },
  'measurementProtocol.sendEvent': {
    input: GA4EndpointInputSchemas.measurementProtocolEvent,
    output: GA4EndpointOutputSchemas.measurementProtocolEvent,
  },
  'measurementProtocol.validate': {
    input: GA4EndpointInputSchemas.measurementProtocolValidate,
    output: GA4EndpointOutputSchemas.measurementProtocolValidate,
  },
} as const;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const ga4EndpointMeta = {
  'accounts.get': {
    riskLevel: 'read' as const,
    description: 'Retrieve a GA4 account',
  },
  'accounts.list': {
    riskLevel: 'read' as const,
    description: 'List GA4 accounts',
  },
  'properties.get': {
    riskLevel: 'read' as const,
    description: 'Retrieve a GA4 property',
  },
  'properties.list': {
    riskLevel: 'read' as const,
    description: 'List GA4 properties',
  },
  'properties.create': {
    riskLevel: 'write' as const,
    description: 'Create a new GA4 property',
  },
  'properties.update': {
    riskLevel: 'write' as const,
    description: 'Update a GA4 property configuration',
  },
  'customDimensions.list': {
    riskLevel: 'read' as const,
    description: 'List custom dimensions for a property',
  },
  'customDimensions.create': {
    riskLevel: 'write' as const,
    description: 'Create a custom dimension',
  },
  'customMetrics.list': {
    riskLevel: 'read' as const,
    description: 'List custom metrics for a property',
  },
  'customMetrics.create': {
    riskLevel: 'write' as const,
    description: 'Create a custom metric',
  },
  'dataStreams.list': {
    riskLevel: 'read' as const,
    description: 'List data streams for a property',
  },
  'dataStreams.get': {
    riskLevel: 'read' as const,
    description: 'Retrieve a data stream',
  },
  'audiences.list': {
    riskLevel: 'read' as const,
    description: 'List audiences for a property',
  },
  'audiences.create': {
    riskLevel: 'write' as const,
    description: 'Create an audience',
  },
  'reporting.runReport': {
    riskLevel: 'read' as const,
    description: 'Run a GA4 report with metrics and dimensions',
  },
  'reporting.runRealtimeReport': {
    riskLevel: 'read' as const,
    description: 'Run a realtime GA4 report',
  },
  'measurementProtocol.sendEvent': {
    riskLevel: 'write' as const,
    description: 'Send server-side events via Measurement Protocol',
  },
  'measurementProtocol.validate': {
    riskLevel: 'read' as const,
    description: 'Validate Measurement Protocol events',
  },
} satisfies RequiredPluginEndpointMeta<typeof ga4EndpointsNested>;

export const ga4AuthConfig = {
  oauth_2: {
    account: ['account_id', 'property_id'] as const,
  },
} as const satisfies PluginAuthConfig;

export type BaseGA4Plugin<T extends GA4PluginOptions> = CorsairPlugin<
  'googleanalytics4',
  typeof GA4Schema,
  typeof ga4EndpointsNested,
  {},
  T,
  typeof defaultAuthType
>;

export type InternalGA4Plugin = BaseGA4Plugin<GA4PluginOptions>;

export type ExternalGA4Plugin<T extends GA4PluginOptions> =
  BaseGA4Plugin<T>;

export function googleanalytics4<const T extends GA4PluginOptions>(
  // Type assertion: empty object is a safe default because all GA4PluginOptions fields are optional
  incomingOptions: GA4PluginOptions & T = {} as GA4PluginOptions & T,
): ExternalGA4Plugin<T> {
  const options = {
    ...incomingOptions,
    authType: incomingOptions.authType ?? defaultAuthType,
  };

  return {
    id: 'googleanalytics4',
    authConfig: ga4AuthConfig,
    schema: GA4Schema,
    options: options,
    oauthConfig: {
      providerName: 'Google Analytics',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/analytics'],
      tokenAuthMethod: 'post',
      requiresRegisteredRedirect: true,
    },
    hooks: options.hooks,
    endpoints: ga4EndpointsNested,
    webhooks: {},
    endpointMeta: ga4EndpointMeta,
    endpointSchemas: ga4EndpointSchemas,
    webhookSchemas: {},
    errorHandlers: {
      ...errorHandlers,
      ...options.errorHandlers,
    },
    keyBuilder: async (ctx: GA4KeyBuilderContext, source) => {
      if (source === 'endpoint') {
        const [accessToken, expiresAt, refreshToken] = await Promise.all([
          ctx.keys.get_access_token(),
          ctx.keys.get_expires_at(),
          ctx.keys.get_refresh_token(),
        ]);

        if (!refreshToken) {
          throw new AuthMissingError('googleanalytics4', 'oauth_2');
        }

        const creds = await ctx.keys.get_integration_credentials();

        if (!creds.client_secret) {
          throw new Error(
            '[auth-missing:googleanalytics4:client_secret]: GA4 client secret is missing',
          );
        }

        let result: Awaited<ReturnType<typeof getValidGA4AccessToken>>;
        try {
          result = await getValidGA4AccessToken({
            accessToken: accessToken || null,
            expiresAt: expiresAt ? parseInt(expiresAt) : null,
            refreshToken,
            clientSecret: creds.client_secret,
          });
        } catch (error) {
          throw new Error(
            `[corsair:googleanalytics4] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        if (result.refreshed) {
          try {
            await ctx.keys.set_access_token(result.accessToken);
            await ctx.keys.set_refresh_token(result.refreshToken);
            await ctx.keys.set_expires_at(String(result.expiresAt));
          } catch (error) {
            throw new Error(
              `[corsair:googleanalytics4] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }

        // Expose force-refresh so endpoints can retry on 401
        (ctx as Record<string, unknown>)._refreshAuth = async () => {
          const freshResult = await getValidGA4AccessToken({
            accessToken: null,
            expiresAt: null,
            refreshToken,
            clientSecret: creds.client_secret!,
            forceRefresh: true,
          });
          await ctx.keys.set_access_token(freshResult.accessToken);
          await ctx.keys.set_refresh_token(freshResult.refreshToken);
          await ctx.keys.set_expires_at(String(freshResult.expiresAt));
          return freshResult.accessToken;
        };

        return result.accessToken;
      }

      throw new AuthMissingError('googleanalytics4', 'oauth_2');
    },
  } satisfies InternalGA4Plugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
  GA4EndpointInputs,
  GA4EndpointOutputs,
} from './endpoints/types';
