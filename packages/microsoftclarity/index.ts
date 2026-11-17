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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { getLiveInsights } from './endpoints';
import type {
	MicrosoftClarityEndpointInputs,
	MicrosoftClarityEndpointOutputs,
} from './endpoints/types';
import {
	MicrosoftClarityEndpointInputSchemas,
	MicrosoftClarityEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MicrosoftClaritySchema } from './schema';

export type MicrosoftClarityPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMicrosoftClarityPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof microsoftClarityEndpointsNested>;
};
export type MicrosoftClarityContext = CorsairPluginContext<
	typeof MicrosoftClaritySchema,
	MicrosoftClarityPluginOptions
>;
export type MicrosoftClarityKeyBuilderContext =
	KeyBuilderContext<MicrosoftClarityPluginOptions>;
export type MicrosoftClarityBoundEndpoints = BindEndpoints<
	typeof microsoftClarityEndpointsNested
>;
export type MicrosoftClarityEndpoints = {
	insightsGet: CorsairEndpoint<
		MicrosoftClarityContext,
		MicrosoftClarityEndpointInputs['insightsGet'],
		MicrosoftClarityEndpointOutputs['insightsGet']
	>;
};
const microsoftClarityEndpointsNested = {
	insights: { get: getLiveInsights },
} as const;
const microsoftClarityWebhooksNested = {} as const;
export const microsoftClarityEndpointSchemas = {
	'insights.get': {
		input: MicrosoftClarityEndpointInputSchemas.insightsGet,
		output: MicrosoftClarityEndpointOutputSchemas.insightsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof microsoftClarityEndpointsNested
>;
const microsoftClarityWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof microsoftClarityWebhooksNested
	>;
const microsoftClarityEndpointMeta = {
	'insights.get': {
		riskLevel: 'read',
		description:
			'Export project dashboard metrics for the past 1 to 3 days with optional dimension breakdowns',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof microsoftClarityEndpointsNested
>;
const defaultAuthType: AuthTypes = 'api_key';
export const microsoftClarityAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseMicrosoftClarityPlugin<
	T extends MicrosoftClarityPluginOptions,
> = CorsairPlugin<
	'microsoftclarity',
	typeof MicrosoftClaritySchema,
	typeof microsoftClarityEndpointsNested,
	typeof microsoftClarityWebhooksNested,
	T,
	typeof defaultAuthType
>;
export type InternalMicrosoftClarityPlugin =
	BaseMicrosoftClarityPlugin<MicrosoftClarityPluginOptions>;
export type ExternalMicrosoftClarityPlugin<
	T extends MicrosoftClarityPluginOptions,
> = BaseMicrosoftClarityPlugin<T>;
export function microsoftclarity<const T extends MicrosoftClarityPluginOptions>(
	// All options are optional; TypeScript cannot establish that for arbitrary T.
	incomingOptions: MicrosoftClarityPluginOptions &
		T = {} as MicrosoftClarityPluginOptions & T,
): ExternalMicrosoftClarityPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'microsoftclarity',
		authConfig: microsoftClarityAuthConfig,
		schema: MicrosoftClaritySchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: microsoftClarityEndpointsNested,
		webhooks: microsoftClarityWebhooksNested,
		endpointMeta: microsoftClarityEndpointMeta,
		endpointSchemas: microsoftClarityEndpointSchemas,
		webhookSchemas: microsoftClarityWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: MicrosoftClarityKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				if (!ctx.keys)
					throw new AuthMissingError('microsoftclarity', 'api_key');
				try {
					const key = await ctx.keys.get_api_key();
					if (key) return key;
				} catch (error) {
					if (
						error instanceof AuthMissingError ||
						(error instanceof Error && /no dek found/i.test(error.message))
					)
						throw new AuthMissingError('microsoftclarity', 'api_key');
					throw error;
				}
			}
			throw new AuthMissingError('microsoftclarity', 'api_key');
		},
	} satisfies InternalMicrosoftClarityPlugin;
}
export type {
	InsightsGetInput,
	InsightsGetResponse,
	MicrosoftClarityEndpointInputs,
	MicrosoftClarityEndpointOutputs,
} from './endpoints/types';
export { MicrosoftClaritySchema } from './schema';
