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
import { Aryn } from './endpoints';
import type {
	ArynEndpointInputs,
	ArynEndpointOutputs,
} from './endpoints/types';
import {
	ArynEndpointInputSchemas,
	ArynEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ArynSchema } from './schema';

export type ArynPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalArynPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof arynEndpointsNested>;
};

export type ArynContext = CorsairPluginContext<
	typeof ArynSchema,
	ArynPluginOptions
>;

export type ArynKeyBuilderContext = KeyBuilderContext<ArynPluginOptions>;

export type ArynBoundEndpoints = BindEndpoints<typeof arynEndpointsNested>;

type ArynEndpoint<K extends keyof ArynEndpointOutputs> = CorsairEndpoint<
	ArynContext,
	ArynEndpointInputs[K],
	ArynEndpointOutputs[K]
>;

export type ArynEndpoints = {
	docsetCreate: ArynEndpoint<'docsetCreate'>;
	docsetDelete: ArynEndpoint<'docsetDelete'>;
	docsetGet: ArynEndpoint<'docsetGet'>;
	documentGet: ArynEndpoint<'documentGet'>;
	documentGetBinary: ArynEndpoint<'documentGetBinary'>;
	queryGeneratePlan: ArynEndpoint<'queryGeneratePlan'>;
	asyncTasksList: ArynEndpoint<'asyncTasksList'>;
	documentPartition: ArynEndpoint<'documentPartition'>;
	documentSubmitAsyncAdd: ArynEndpoint<'documentSubmitAsyncAdd'>;
};

const arynEndpointsNested = {
	docset: {
		create: Aryn.docsetCreate,
		get: Aryn.docsetGet,
		delete: Aryn.docsetDelete,
	},
	document: {
		get: Aryn.documentGet,
		getBinary: Aryn.documentGetBinary,
		partition: Aryn.documentPartition,
		submitAsyncAdd: Aryn.documentSubmitAsyncAdd,
	},
	query: {
		generatePlan: Aryn.queryGeneratePlan,
	},
	asyncTasks: {
		list: Aryn.asyncTasksList,
	},
} as const;

export const arynEndpointSchemas = {
	'docset.create': {
		input: ArynEndpointInputSchemas.docsetCreate,
		output: ArynEndpointOutputSchemas.docsetCreate,
	},
	'docset.get': {
		input: ArynEndpointInputSchemas.docsetGet,
		output: ArynEndpointOutputSchemas.docsetGet,
	},
	'docset.delete': {
		input: ArynEndpointInputSchemas.docsetDelete,
		output: ArynEndpointOutputSchemas.docsetDelete,
	},
	'document.get': {
		input: ArynEndpointInputSchemas.documentGet,
		output: ArynEndpointOutputSchemas.documentGet,
	},
	'document.getBinary': {
		input: ArynEndpointInputSchemas.documentGetBinary,
		output: ArynEndpointOutputSchemas.documentGetBinary,
	},
	'document.partition': {
		input: ArynEndpointInputSchemas.documentPartition,
		output: ArynEndpointOutputSchemas.documentPartition,
	},
	'document.submitAsyncAdd': {
		input: ArynEndpointInputSchemas.documentSubmitAsyncAdd,
		output: ArynEndpointOutputSchemas.documentSubmitAsyncAdd,
	},
	'query.generatePlan': {
		input: ArynEndpointInputSchemas.queryGeneratePlan,
		output: ArynEndpointOutputSchemas.queryGeneratePlan,
	},
	'asyncTasks.list': {
		input: ArynEndpointInputSchemas.asyncTasksList,
		output: ArynEndpointOutputSchemas.asyncTasksList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof arynEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const arynEndpointMeta = {
	'docset.create': {
		riskLevel: 'write',
		description: 'Create a new DocSet',
	},
	'docset.get': {
		riskLevel: 'read',
		description: 'Get DocSet metadata',
	},
	'docset.delete': {
		riskLevel: 'destructive',
		description: 'Delete a DocSet',
	},
	'document.get': {
		riskLevel: 'read',
		description: 'Get a document by ID',
	},
	'document.getBinary': {
		riskLevel: 'read',
		description: 'Download document binary content',
	},
	'document.partition': {
		riskLevel: 'write',
		description: 'Partition document using Aryn DocParse',
	},
	'document.submitAsyncAdd': {
		riskLevel: 'write',
		description: 'Submit document asynchronously to a DocSet',
	},
	'query.generatePlan': {
		riskLevel: 'read',
		description: 'Generate query plan',
	},
	'asyncTasks.list': {
		riskLevel: 'read',
		description: 'List async partitioning tasks',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof arynEndpointsNested>;

export const arynAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseArynPlugin<T extends ArynPluginOptions> = CorsairPlugin<
	'aryn',
	typeof ArynSchema,
	typeof arynEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalArynPlugin = BaseArynPlugin<ArynPluginOptions>;

export type ExternalArynPlugin<T extends ArynPluginOptions> = BaseArynPlugin<T>;

export function aryn<const T extends ArynPluginOptions>(
	incomingOptions: ArynPluginOptions & T = {} as ArynPluginOptions & T,
): ExternalArynPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aryn',
		authConfig: arynAuthConfig,
		schema: ArynSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: arynEndpointsNested,
		webhooks: {} as const,
		endpointMeta: arynEndpointMeta,
		endpointSchemas: arynEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ArynKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('aryn', 'api_key');
				}
				return apiKey;
			}

			throw new AuthMissingError('aryn', 'api_key');
		},
	} satisfies InternalArynPlugin;
}

export type {
	ArynEndpointInputs,
	ArynEndpointOutputs,
} from './endpoints/types';
