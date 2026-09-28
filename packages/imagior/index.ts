import type {
	AuthTypes,
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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Imagior } from './endpoints';
import type {
	ImagiorEndpointInputs,
	ImagiorEndpointOutputs,
} from './endpoints/types';
import {
	ImagiorEndpointInputSchemas,
	ImagiorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ImagiorSchema } from './schema';

export type ImagiorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalImagiorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof imagiorEndpointsNested>;
};

export type ImagiorContext = CorsairPluginContext<
	typeof ImagiorSchema,
	ImagiorPluginOptions
>;

export type ImagiorKeyBuilderContext = KeyBuilderContext<ImagiorPluginOptions>;

export type ImagiorBoundEndpoints = BindEndpoints<
	typeof imagiorEndpointsNested
>;

type ImagiorEndpoint<K extends keyof ImagiorEndpointOutputs> = CorsairEndpoint<
	ImagiorContext,
	ImagiorEndpointInputs[K],
	ImagiorEndpointOutputs[K]
>;

export type ImagiorEndpoints = {
	getAccount: ImagiorEndpoint<'getAccount'>;
	listTemplates: ImagiorEndpoint<'listTemplates'>;
};

export type ImagiorWebhooks = {};
export type ImagiorBoundWebhooks = BindWebhooks<ImagiorWebhooks>;

const imagiorEndpointsNested = {
	account: {
		get: Imagior.getAccount,
	},
	templates: {
		list: Imagior.listTemplates,
	},
} as const;

const imagiorWebhooksNested = {};

export const imagiorEndpointSchemas = {
	'account.get': {
		input: ImagiorEndpointInputSchemas.getAccount,
		output: ImagiorEndpointOutputSchemas.getAccount,
	},
	'templates.list': {
		input: ImagiorEndpointInputSchemas.listTemplates,
		output: ImagiorEndpointOutputSchemas.listTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof imagiorEndpointsNested
>;

const imagiorWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof imagiorWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const imagiorEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Retrieve the authenticated Imagior account details and remaining credits',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List all design templates owned by the authenticated Imagior account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof imagiorEndpointsNested>;

export const imagiorAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseImagiorPlugin<T extends ImagiorPluginOptions> = CorsairPlugin<
	'imagior',
	typeof ImagiorSchema,
	typeof imagiorEndpointsNested,
	typeof imagiorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalImagiorPlugin = BaseImagiorPlugin<ImagiorPluginOptions>;

export type ExternalImagiorPlugin<T extends ImagiorPluginOptions> =
	BaseImagiorPlugin<T>;

export function imagior<const T extends ImagiorPluginOptions>(
	incomingOptions: ImagiorPluginOptions & T = {} as ImagiorPluginOptions & T,
): ExternalImagiorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'imagior',
		authConfig: imagiorAuthConfig,
		schema: ImagiorSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: imagiorEndpointsNested,
		webhooks: imagiorWebhooksNested,
		endpointMeta: imagiorEndpointMeta,
		endpointSchemas: imagiorEndpointSchemas,
		webhookSchemas: imagiorWebhookSchemas,
		pluginWebhookMatcher: undefined,
		keyBuilder: async (ctx: ImagiorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('imagior', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('imagior', 'api_key');
		},
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
	} satisfies InternalImagiorPlugin;
}

export type {
	GetAccountInput,
	GetAccountResponse,
	ImagiorEndpointInputs,
	ImagiorEndpointOutputs,
	ListTemplatesInput,
	ListTemplatesResponse,
} from './endpoints/types';
