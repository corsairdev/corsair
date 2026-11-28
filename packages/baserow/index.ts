import type {
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
import { tryGetStoredKey } from './client';
import {
	baserowEndpointSchemas,
	baserowEndpointsNested,
	baserowEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	BaserowEndpointInputs,
	BaserowEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BaserowSchema } from './schema';

export type BaserowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Baserow database token (Settings > Database tokens). It reads and writes the rows of the tables it was granted; other routes need the account's email and password. */
	key?: string;
	/**
	 * The email and password of a Baserow user, for every route a database
	 * token can't call (workspaces, applications, tables, views, fields'
	 * settings, admin). The plugin signs in with them and reuses the access
	 * token until it expires. When unset, the account's stored `email` and
	 * `password` fields are used.
	 */
	email?: string;
	password?: string;
	/**
	 * A self-hosted Baserow server, such as https://baserow.example.com. Leave it out for Baserow's cloud (https://api.baserow.io) or the account's stored `url`.
	 */
	baseUrl?: string;
	hooks?: InternalBaserowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof baserowEndpointsNested>;
};

/**
 * A database token as the key (row routes), plus the account fields `url`
 * (a self-hosted server; Baserow's cloud when empty), `email` and `password`
 * (a user sign-in for every other route). Either half is enough for the
 * routes it covers.
 */
export const baserowAuthConfig = {
	api_key: {
		account: ['url', 'email', 'password'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaserowContext = CorsairPluginContext<
	typeof BaserowSchema,
	BaserowPluginOptions,
	undefined,
	typeof baserowAuthConfig
>;

export type BaserowKeyBuilderContext = KeyBuilderContext<
	BaserowPluginOptions,
	typeof baserowAuthConfig
>;

export type BaserowBoundEndpoints = BindEndpoints<
	typeof baserowEndpointsNested
>;

export type BaserowEndpoints = {
	[Id in keyof BaserowEndpointOutputs]: CorsairEndpoint<
		BaserowContext,
		BaserowEndpointInputs[Id],
		BaserowEndpointOutputs[Id]
	>;
};

export { baserowEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const baserowEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof baserowEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseBaserowPlugin<T extends BaserowPluginOptions> = CorsairPlugin<
	'baserow',
	typeof BaserowSchema,
	typeof baserowEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof baserowAuthConfig
>;

export type InternalBaserowPlugin = BaseBaserowPlugin<BaserowPluginOptions>;

export type ExternalBaserowPlugin<T extends BaserowPluginOptions> =
	BaseBaserowPlugin<T>;

export function baserow<const T extends BaserowPluginOptions>(
	// Safe: every BaserowPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: BaserowPluginOptions & T = {} as BaserowPluginOptions & T,
): ExternalBaserowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'baserow',
		schema: BaserowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: baserowEndpointsNested,
		webhooks: {},
		authConfig: baserowAuthConfig,
		endpointMeta: baserowEndpointMeta,
		endpointSchemas: baserowEndpointSchemas,
		pluginWebhookMatcher: () => false,
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
		keyBuilder: async (ctx: BaserowKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (storedKey) return storedKey;
			// No database token: an account that signs in with email and password
			// still works for every route that takes a user JWT.
			const email =
				options.email ||
				(await tryGetStoredKey(
					() =>
						// `unknown` because get_email exists only on accounts that store the field.
						(
							ctx.keys as unknown as {
								get_email?: () => Promise<string | null>;
							}
						)?.get_email?.() ?? Promise.resolve(null),
				));
			if (email) return '';
			throw new AuthMissingError('baserow', 'api_key');
		},
	} satisfies InternalBaserowPlugin;
}

export { authorizationFor, baserowJwt } from './client';
export {
	BASEROW_OPERATION_IDS,
	createBaserowOperation,
	getBaserowInputSchema,
	getBaserowOutputSchema,
} from './endpoints';
export type {
	BaserowEndpointInputs,
	BaserowEndpointOutputs,
	BaserowJsonValue,
	BaserowOperationId,
} from './endpoints/types';
export {
	BaserowEndpointInputSchemas,
	BaserowEndpointOutputSchemas,
} from './endpoints/types';
