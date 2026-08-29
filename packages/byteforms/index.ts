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
import { Forms } from './endpoints';
import type {
	ByteFormsEndpointInputs,
	ByteFormsEndpointOutputs,
} from './endpoints/types';
import {
	ByteFormsEndpointInputSchemas,
	ByteFormsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ByteFormsSchema } from './schema';

export type ByteFormsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalByteFormsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof byteformsEndpointsNested>;
};

export type ByteFormsContext = CorsairPluginContext<
	typeof ByteFormsSchema,
	ByteFormsPluginOptions
>;

export type ByteFormsKeyBuilderContext =
	KeyBuilderContext<ByteFormsPluginOptions>;

export type ByteFormsBoundEndpoints = BindEndpoints<
	typeof byteformsEndpointsNested
>;

type ByteFormsEndpoint<K extends keyof ByteFormsEndpointOutputs> =
	CorsairEndpoint<
		ByteFormsContext,
		ByteFormsEndpointInputs[K],
		ByteFormsEndpointOutputs[K]
	>;

export type ByteFormsEndpoints = {
	formsCreate: ByteFormsEndpoint<'formsCreate'>;
	formsDelete: ByteFormsEndpoint<'formsDelete'>;
	formsGet: ByteFormsEndpoint<'formsGet'>;
	formsList: ByteFormsEndpoint<'formsList'>;
	formsResponses: ByteFormsEndpoint<'formsResponses'>;
};

export type ByteFormsBoundWebhooks = BindWebhooks<
	typeof byteformsWebhooksNested
>;

const byteformsEndpointsNested = {
	forms: {
		create: Forms.create,
		delete: Forms.delete,
		get: Forms.get,
		list: Forms.list,
		responses: Forms.responses,
	},
} as const;

const byteformsWebhooksNested = {} as const;

export const byteformsEndpointSchemas = {
	'forms.create': {
		input: ByteFormsEndpointInputSchemas.formsCreate,
		output: ByteFormsEndpointOutputSchemas.formsCreate,
	},
	'forms.delete': {
		input: ByteFormsEndpointInputSchemas.formsDelete,
		output: ByteFormsEndpointOutputSchemas.formsDelete,
	},
	'forms.get': {
		input: ByteFormsEndpointInputSchemas.formsGet,
		output: ByteFormsEndpointOutputSchemas.formsGet,
	},
	'forms.list': {
		input: ByteFormsEndpointInputSchemas.formsList,
		output: ByteFormsEndpointOutputSchemas.formsList,
	},
	'forms.responses': {
		input: ByteFormsEndpointInputSchemas.formsResponses,
		output: ByteFormsEndpointOutputSchemas.formsResponses,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof byteformsEndpointsNested
>;

const byteformsWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof byteformsWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const byteformsEndpointMeta = {
	'forms.create': {
		riskLevel: 'write',
		description: 'Create a new ByteForms form with custom fields and options',
	},
	'forms.delete': {
		riskLevel: 'write',
		description: 'Delete a ByteForms form by its numeric or public ID',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Retrieve a single ByteForms form definition by ID',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List all ByteForms forms created by the authenticated user',
	},
	'forms.responses': {
		riskLevel: 'read',
		description: 'Retrieve paginated responses submitted to a ByteForms form',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof byteformsEndpointsNested
>;

export const byteformsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseByteFormsPlugin<T extends ByteFormsPluginOptions> =
	CorsairPlugin<
		'byteforms',
		typeof ByteFormsSchema,
		typeof byteformsEndpointsNested,
		typeof byteformsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalByteFormsPlugin =
	BaseByteFormsPlugin<ByteFormsPluginOptions>;

export type ExternalByteFormsPlugin<T extends ByteFormsPluginOptions> =
	BaseByteFormsPlugin<T>;

export function byteforms<const T extends ByteFormsPluginOptions>(
	incomingOptions: ByteFormsPluginOptions & T = {} as ByteFormsPluginOptions &
		T,
): ExternalByteFormsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'byteforms',
		authConfig: byteformsAuthConfig,
		schema: ByteFormsSchema,
		options: options,
		hooks: options.hooks,
		webhooks: byteformsWebhooksNested,
		endpoints: byteformsEndpointsNested,
		endpointMeta: byteformsEndpointMeta,
		endpointSchemas: byteformsEndpointSchemas,
		webhookSchemas: byteformsWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ByteFormsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('byteforms', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('byteforms', 'api_key');
		},
	} satisfies InternalByteFormsPlugin;
}

export type {
	ByteFormsEndpointInputs,
	ByteFormsEndpointOutputs,
	CreateFormInput,
	CreateFormResponse,
	DeleteFormInput,
	DeleteFormResponse,
	FormField,
	FormItem,
	FormOptions,
	FormResponseItem,
	GetAllFormsInput,
	GetAllFormsResponse,
	GetFormByIdInput,
	GetFormByIdResponse,
	GetFormResponsesInput,
	GetFormResponsesResponse,
} from './endpoints/types';
