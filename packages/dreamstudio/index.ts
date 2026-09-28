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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import { Engines, Generation, User } from './endpoints';
import type {
	DreamstudioEndpointInputs,
	DreamstudioEndpointOutputs,
} from './endpoints/types';
import {
	DreamstudioEndpointInputSchemas,
	DreamstudioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DreamstudioSchema } from './schema';

export type DreamstudioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDreamstudioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dreamstudioEndpointsNested>;
};

export type DreamstudioContext = CorsairPluginContext<
	typeof DreamstudioSchema,
	DreamstudioPluginOptions,
	undefined,
	typeof dreamstudioAuthConfig
>;

export type DreamstudioKeyBuilderContext = KeyBuilderContext<
	DreamstudioPluginOptions,
	typeof dreamstudioAuthConfig
>;

export type DreamstudioBoundEndpoints = BindEndpoints<
	typeof dreamstudioEndpointsNested
>;

type DreamstudioEndpoint<K extends keyof DreamstudioEndpointOutputs> =
	CorsairEndpoint<
		DreamstudioContext,
		DreamstudioEndpointInputs[K],
		DreamstudioEndpointOutputs[K]
	>;

export type DreamstudioEndpoints = {
	userBalance: DreamstudioEndpoint<'userBalance'>;
	userAccount: DreamstudioEndpoint<'userAccount'>;
	listEngines: DreamstudioEndpoint<'listEngines'>;
	generateImageFromImage: DreamstudioEndpoint<'generateImageFromImage'>;
};

const dreamstudioEndpointsNested = {
	user: {
		balance: User.balance,
		account: User.account,
	},
	engines: {
		list: Engines.list,
	},
	generation: {
		imageFromImage: Generation.imageFromImage,
	},
} as const;

export const dreamstudioEndpointSchemas = {
	'user.balance': {
		input: DreamstudioEndpointInputSchemas.userBalance,
		output: DreamstudioEndpointOutputSchemas.userBalance,
	},
	'user.account': {
		input: DreamstudioEndpointInputSchemas.userAccount,
		output: DreamstudioEndpointOutputSchemas.userAccount,
	},
	'engines.list': {
		input: DreamstudioEndpointInputSchemas.listEngines,
		output: DreamstudioEndpointOutputSchemas.listEngines,
	},
	'generation.imageFromImage': {
		input: DreamstudioEndpointInputSchemas.generateImageFromImage,
		output: DreamstudioEndpointOutputSchemas.generateImageFromImage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dreamstudioEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dreamstudioEndpointMeta = {
	'user.balance': {
		riskLevel: 'read',
		description:
			'Get the credit balance of the Stability account tied to the API key',
	},
	'user.account': {
		riskLevel: 'read',
		description:
			'Get the authenticated Stability user id, email, organizations, and profile picture',
	},
	'engines.list': {
		riskLevel: 'read',
		description:
			'List Stability engines available to this API key. The v1 API returns the full list with no pagination.',
	},
	'generation.imageFromImage': {
		riskLevel: 'write',
		description:
			'Generate a new image from an init image and text prompts via POST /v1/generation/{engine_id}/image-to-image',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dreamstudioEndpointsNested
>;

export const dreamstudioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDreamstudioPlugin<T extends DreamstudioPluginOptions> =
	CorsairPlugin<
		'dreamstudio',
		typeof DreamstudioSchema,
		typeof dreamstudioEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof dreamstudioAuthConfig
	>;

export type InternalDreamstudioPlugin =
	BaseDreamstudioPlugin<DreamstudioPluginOptions>;

export type ExternalDreamstudioPlugin<T extends DreamstudioPluginOptions> =
	BaseDreamstudioPlugin<T>;

export function dreamstudio<const T extends DreamstudioPluginOptions>(
	incomingOptions: DreamstudioPluginOptions &
		T = {} as DreamstudioPluginOptions & T,
): ExternalDreamstudioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dreamstudio',
		authConfig: dreamstudioAuthConfig,
		schema: DreamstudioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: dreamstudioEndpointsNested,
		webhooks: {},
		endpointMeta: dreamstudioEndpointMeta,
		endpointSchemas: dreamstudioEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DreamstudioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await tryGetStoredKey(() => ctx.keys.get_api_key());
				if (!res) {
					throw new AuthMissingError('dreamstudio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('dreamstudio', 'api_key');
		},
	} satisfies InternalDreamstudioPlugin;
}

export {
	DreamstudioAPIError,
	DreamstudioRateLimitError,
	makeDreamstudioRequest,
} from './client';
export type {
	DreamstudioEndpointInputs,
	DreamstudioEndpointOutputs,
	GenerateImageFromImageInput,
	GenerateImageFromImageOutput,
	ListEnginesInput,
	ListEnginesOutput,
	UserAccountInput,
	UserAccountOutput,
	UserBalanceInput,
	UserBalanceOutput,
} from './endpoints/types';
