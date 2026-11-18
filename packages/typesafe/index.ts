import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import { Models, SystemOne } from './endpoints';
import type {
	TypeSafeEndpointInputs,
	TypeSafeEndpointOutputs,
} from './endpoints/types';
import {
	TypeSafeEndpointInputSchemas,
	TypeSafeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TypeSafeSchema } from './schema';

export type TypeSafePluginOptions = {
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	hooks?: InternalTypeSafePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof typeSafeEndpointsNested>;
};

export type TypeSafeContext = CorsairPluginContext<
	typeof TypeSafeSchema,
	TypeSafePluginOptions
>;

export type TypeSafeKeyBuilderContext =
	KeyBuilderContext<TypeSafePluginOptions>;

export type TypeSafeBoundEndpoints = BindEndpoints<
	typeof typeSafeEndpointsNested
>;

type TypeSafeEndpoint<K extends keyof TypeSafeEndpointOutputs> =
	CorsairEndpoint<
		TypeSafeContext,
		TypeSafeEndpointInputs[K],
		TypeSafeEndpointOutputs[K]
	>;

export type TypeSafeEndpoints = {
	systemOneAsk: TypeSafeEndpoint<'systemOneAsk'>;
	modelsList: TypeSafeEndpoint<'modelsList'>;
};

const typeSafeEndpointsNested = {
	systemOne: {
		ask: SystemOne.ask,
	},
	models: {
		list: Models.list,
	},
} as const;

export const typeSafeEndpointSchemas = {
	'systemOne.ask': {
		input: TypeSafeEndpointInputSchemas.systemOneAsk,
		output: TypeSafeEndpointOutputSchemas.systemOneAsk,
	},
	'models.list': {
		input: TypeSafeEndpointInputSchemas.modelsList,
		output: TypeSafeEndpointOutputSchemas.modelsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof typeSafeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const typeSafeManagedPricingCache = createManagedPricingCredentialCache();

const typeSafeEndpointMeta = {
	'systemOne.ask': {
		riskLevel: 'read',
		description:
			'Ask Jev typed questions about text, JSON or images in one call: yes/no (probability), choice (one option), score (ordered levels) or box (locate in an image). Answers come back with calibrated probabilities.',
	},
	'models.list': {
		riskLevel: 'read',
		description:
			'List the TypeSafe model names and aliases this key can use, such as jev-latest',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof typeSafeEndpointsNested>;

export type BaseTypeSafePlugin<T extends TypeSafePluginOptions> = CorsairPlugin<
	'typesafe',
	typeof TypeSafeSchema,
	typeof typeSafeEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTypeSafePlugin = BaseTypeSafePlugin<TypeSafePluginOptions>;

export type ExternalTypeSafePlugin<T extends TypeSafePluginOptions> =
	BaseTypeSafePlugin<T>;

// Handlers match in key order and DEFAULT matches everything, so it stays
// last even when the caller adds or overrides handlers.
function mergeErrorHandlers(
	builtin: CorsairErrorHandler,
	user: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	if (!user) return builtin;
	const { DEFAULT: builtinDefault, ...builtinRest } = builtin;
	const { DEFAULT: userDefault, ...userRest } = user;
	const fallback = userDefault ?? builtinDefault;
	return fallback
		? { ...builtinRest, ...userRest, DEFAULT: fallback }
		: { ...builtinRest, ...userRest };
}

export function typesafe<const T extends TypeSafePluginOptions>(
	incomingOptions: TypeSafePluginOptions & T = {} as TypeSafePluginOptions & T,
): ExternalTypeSafePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'typesafe',
		schema: TypeSafeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: typeSafeEndpointsNested,
		webhooks: {},
		endpointMeta: typeSafeEndpointMeta,
		endpointSchemas: typeSafeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TypeSafeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			if (source === 'endpoint' && ctx.authType === 'managed_pricing') {
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'typesafe',
					cache: typeSafeManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}

			throw new AuthMissingError('typesafe', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTypeSafePlugin;
}

export type {
	ModelsListInput,
	ModelsListResponse,
	SystemOneAskInput,
	SystemOneAskResponse,
	TypeSafeAnswer,
	TypeSafeEndpointInputs,
	TypeSafeEndpointOutputs,
	TypeSafeQuestion,
} from './endpoints/types';
