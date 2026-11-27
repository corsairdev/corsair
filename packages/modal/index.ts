import type {
	AuthTypes,
	BindEndpoints,
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
import {
	modalEndpointMeta as generatedModalEndpointMeta,
	modalEndpointSchemas,
	modalEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { ModalSchema } from './schema';

export const modalEndpointMeta =
	generatedModalEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof modalEndpointsNested
	>;

export type ModalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Token secret (as-...). Normally stored per account instead. */
	key?: string;
	/** Token id (ak-...), used with `key`. Normally stored per account as token_id. */
	tokenId?: string;
	/** Modal environment for every call; an operation's `environment` input wins. */
	environment?: string;
	hooks?: InternalModalPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof modalEndpointsNested>;
};

export type ModalContext = CorsairPluginContext<
	typeof ModalSchema,
	ModalPluginOptions,
	undefined,
	typeof modalAuthConfig
>;

export type ModalKeyBuilderContext = KeyBuilderContext<
	ModalPluginOptions,
	typeof modalAuthConfig
>;

export type ModalBoundEndpoints = BindEndpoints<typeof modalEndpointsNested>;

export type ModalEndpoints = typeof modalEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * A Modal account stores its token pair: the token secret (as-...) as the API
 * key and the token id (ak-...) as `token_id`.
 */
export const modalAuthConfig = {
	api_key: {
		account: ['token_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseModalPlugin<T extends ModalPluginOptions> = CorsairPlugin<
	'modal',
	typeof ModalSchema,
	typeof modalEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof modalAuthConfig
>;

export type InternalModalPlugin = BaseModalPlugin<ModalPluginOptions>;

export type ExternalModalPlugin<T extends ModalPluginOptions> =
	BaseModalPlugin<T>;

export function modal<const T extends ModalPluginOptions>(
	// The empty object keeps plugin setup ergonomic while preserving selected auth options.
	incomingOptions: ModalPluginOptions & T = {} as ModalPluginOptions & T,
): ExternalModalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'modal',
		schema: ModalSchema,
		options: options,
		authConfig: modalAuthConfig,
		hooks: options.hooks,
		endpoints: modalEndpointsNested,
		webhooks: {},
		endpointMeta: modalEndpointMeta,
		endpointSchemas: modalEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...(({ DEFAULT: _defaultHandler, ...rest }) => rest)(errorHandlers),
			...(({ DEFAULT: _customDefault, ...rest }) => rest)(
				options.errorHandlers ?? {},
			),
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: ModalKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('modal', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('modal', ctx.authType);
		},
	} satisfies InternalModalPlugin;
}

export { encodeDictKey } from './codec';
export type {
	ModalEndpointInput,
	ModalEndpointInputs,
	ModalEndpointOutput,
	ModalEndpointOutputs,
	ModalOperationKey,
} from './endpoints/types';
export { modalEndpointSchemas, modalEndpointsNested };
