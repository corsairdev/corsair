import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	daytonaEndpointSchemas,
	daytonaEndpointsNested,
	daytonaEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	DaytonaEndpointInputs,
	DaytonaEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DaytonaSchema } from './schema';
import {
	daytonaWebhooksNested,
	isDaytonaDelivery,
	daytonaWebhookSchemas as webhookSchemas,
} from './webhooks';

export type DaytonaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Daytona API key from the dashboard's Keys page
	 * (app.daytona.io/dashboard/keys), sent as `Authorization: Bearer`. Its
	 * permissions (write/delete sandboxes, snapshots, volumes, registries ...)
	 * decide which operations work.
	 */
	key?: string;
	/** A self-hosted Daytona's API URL (`https://daytona.example.com/api`). Default: Daytona Cloud. */
	apiUrl?: string;
	/** The organization to act in (X-Daytona-Organization-ID), for a key that reaches several. */
	organizationId?: string;
	/**
	 * The signing secret (`whsec_...`) of the webhook endpoint, from its page
	 * in Daytona's webhook portal (webhooks.getAppPortalAccess); checks
	 * incoming deliveries.
	 */
	webhookSecret?: string;
	hooks?: InternalDaytonaPlugin['hooks'];
	webhookHooks?: InternalDaytonaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof daytonaEndpointsNested>;
};

/** The key travels in the Authorization header; nothing else is account config. */
export const daytonaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type DaytonaContext = CorsairPluginContext<
	typeof DaytonaSchema,
	DaytonaPluginOptions,
	undefined,
	typeof daytonaAuthConfig
>;

export type DaytonaKeyBuilderContext = KeyBuilderContext<
	DaytonaPluginOptions,
	typeof daytonaAuthConfig
>;

export type DaytonaBoundEndpoints = BindEndpoints<
	typeof daytonaEndpointsNested
>;

export type DaytonaBoundWebhooks = BindWebhooks<typeof daytonaWebhooksNested>;

export type DaytonaEndpoints = {
	[Id in keyof DaytonaEndpointOutputs]: CorsairEndpoint<
		DaytonaContext,
		DaytonaEndpointInputs[Id],
		DaytonaEndpointOutputs[Id]
	>;
};

export { daytonaEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const daytonaEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof daytonaEndpointsNested
	>;

const daytonaWebhookSchemas =
	webhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof daytonaWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseDaytonaPlugin<T extends DaytonaPluginOptions> = CorsairPlugin<
	'daytona',
	typeof DaytonaSchema,
	typeof daytonaEndpointsNested,
	typeof daytonaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof daytonaAuthConfig
>;

export type InternalDaytonaPlugin = BaseDaytonaPlugin<DaytonaPluginOptions>;

export type ExternalDaytonaPlugin<T extends DaytonaPluginOptions> =
	BaseDaytonaPlugin<T>;

export function daytona<const T extends DaytonaPluginOptions>(
	// Safe: every DaytonaPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: DaytonaPluginOptions & T = {} as DaytonaPluginOptions & T,
): ExternalDaytonaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'daytona',
		schema: DaytonaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: daytonaEndpointsNested,
		webhooks: daytonaWebhooksNested,
		authConfig: daytonaAuthConfig,
		endpointMeta: daytonaEndpointMeta,
		endpointSchemas: daytonaEndpointSchemas,
		webhookSchemas: daytonaWebhookSchemas,
		pluginWebhookMatcher: isDaytonaDelivery,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: DaytonaKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('daytona', 'api_key');
			return storedKey;
		},
	} satisfies InternalDaytonaPlugin;
}

export {
	createDaytonaOperation,
	DAYTONA_OPERATION_IDS,
	getDaytonaInputSchema,
	getDaytonaOutputSchema,
} from './endpoints';
export type {
	DaytonaEndpointInputs,
	DaytonaEndpointOutputs,
	DaytonaJsonValue,
	DaytonaOperationId,
} from './endpoints/types';
export {
	DaytonaEndpointInputSchemas,
	DaytonaEndpointOutputSchemas,
} from './endpoints/types';
export type { DaytonaEvent, DaytonaEventType } from './webhooks';
export {
	daytonaEventTypeOf,
	isDaytonaDelivery,
	verifyDaytonaWebhook,
} from './webhooks';
