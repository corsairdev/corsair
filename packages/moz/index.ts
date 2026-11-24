import type {
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	mozEndpointMetaMap,
	mozEndpointSchemaMap,
	mozEndpointsNested,
} from './endpoints';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MozSchema } from './schema';
import {
	isMozDelivery,
	LocationWebhooks,
	MozLocationEventSchema,
} from './webhooks';

export type MozPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The Moz API token, from the Moz API dashboard. */
	key?: string;
	/** The `whsec_` secret for Moz Local webhooks (set up by Moz's team). */
	webhookSecret?: string;
	hooks?: InternalMozPlugin['hooks'];
	webhookHooks?: InternalMozPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mozEndpointsNested>;
};

export type MozContext = CorsairPluginContext<
	typeof MozSchema,
	MozPluginOptions,
	undefined
>;

export type MozKeyBuilderContext = KeyBuilderContext<MozPluginOptions>;

export type MozBoundEndpoints = BindEndpoints<typeof mozEndpointsNested>;

const mozWebhooksNested = {
	locations: LocationWebhooks,
} as const;

export type MozBoundWebhooks = BindWebhooks<typeof mozWebhooksNested>;

export const mozEndpointSchemas =
	mozEndpointSchemaMap satisfies RequiredPluginEndpointSchemas<
		typeof mozEndpointsNested
	>;

const mozEndpointMeta = mozEndpointMetaMap satisfies RequiredPluginEndpointMeta<
	typeof mozEndpointsNested
>;

const locationEvent = (what: string) => ({
	description: `A Moz Local location was ${what}; carries the location_id to read with local.locations.lookup`,
	payload: MozLocationEventSchema,
	response: MozLocationEventSchema,
});

const mozWebhookSchemas = {
	'locations.created': locationEvent('created'),
	'locations.updated': locationEvent('updated'),
	'locations.canceled': locationEvent('canceled'),
	'locations.closed': locationEvent('closed (permanently closed)'),
} as const satisfies RequiredPluginWebhookSchemas<typeof mozWebhooksNested>;

const defaultAuthType = 'api_key' as const;

/** One API token in the x-moz-token header; webhooks use the base `webhook_signature` field. */
const defaultAuthConfig = {} as const;

export type BaseMozPlugin<T extends MozPluginOptions> = CorsairPlugin<
	'moz',
	typeof MozSchema,
	typeof mozEndpointsNested,
	typeof mozWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof defaultAuthConfig
>;

export type InternalMozPlugin = BaseMozPlugin<MozPluginOptions>;

export type ExternalMozPlugin<T extends MozPluginOptions> = BaseMozPlugin<T>;

export function moz<const T extends MozPluginOptions>(
	incomingOptions: MozPluginOptions & T = {} as MozPluginOptions & T,
): ExternalMozPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moz',
		schema: MozSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mozEndpointsNested,
		webhooks: mozWebhooksNested,
		authConfig: defaultAuthConfig,
		endpointMeta: mozEndpointMeta,
		endpointSchemas: mozEndpointSchemas,
		webhookSchemas: mozWebhookSchemas,
		pluginWebhookMatcher: isMozDelivery,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MozKeyBuilderContext, source) => {
			if (source === 'webhook') {
				const secret =
					options.webhookSecret ?? (await ctx.keys.get_webhook_signature());
				if (secret) return secret;
				throw new AuthMissingError('moz', ctx.authType ?? 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (key) return key;
			throw new AuthMissingError('moz', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMozPlugin;
}

export {
	MOZ_API_BASE,
	mozErrorCode,
	mozErrorIssue,
} from './client';
export type {
	MozEndpointInputs,
	MozEndpointOutputs,
	MozOperationName,
} from './endpoints';
export type { MozLocationEvent, MozLocationEventType } from './webhooks';
export { MOZ_LOCATION_EVENTS, verifyMozWebhook } from './webhooks';
