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
import { Deals, Persons } from './endpoints';
import type {
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
} from './endpoints/types';
import {
	PipedriveEndpointInputSchemas,
	PipedriveEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PipedriveSchema } from './schema';

export type PipedrivePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalPipedrivePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pipedriveEndpointsNested>;
};

export type PipedriveContext = CorsairPluginContext<
	typeof PipedriveSchema,
	PipedrivePluginOptions
>;
export type PipedriveKeyBuilderContext =
	KeyBuilderContext<PipedrivePluginOptions>;
export type PipedriveBoundEndpoints = BindEndpoints<
	typeof pipedriveEndpointsNested
>;

type PipedriveEndpoint<K extends keyof PipedriveEndpointOutputs> =
	CorsairEndpoint<
		PipedriveContext,
		PipedriveEndpointInputs[K],
		PipedriveEndpointOutputs[K]
	>;

export type PipedriveEndpoints = {
	dealList: PipedriveEndpoint<'dealList'>;
	dealGet: PipedriveEndpoint<'dealGet'>;
	dealCreate: PipedriveEndpoint<'dealCreate'>;
	dealUpdate: PipedriveEndpoint<'dealUpdate'>;
	dealDelete: PipedriveEndpoint<'dealDelete'>;
	personList: PipedriveEndpoint<'personList'>;
	personGet: PipedriveEndpoint<'personGet'>;
	personCreate: PipedriveEndpoint<'personCreate'>;
	personUpdate: PipedriveEndpoint<'personUpdate'>;
	personDelete: PipedriveEndpoint<'personDelete'>;
};

const pipedriveEndpointsNested = {
	deals: {
		list: Deals.list,
		get: Deals.get,
		create: Deals.create,
		update: Deals.update,
		delete: Deals.delete,
	},
	persons: {
		list: Persons.list,
		get: Persons.get,
		create: Persons.create,
		update: Persons.update,
		delete: Persons.delete,
	},
} as const;

export const pipedriveEndpointSchemas = {
	'deals.list': {
		input: PipedriveEndpointInputSchemas.dealList,
		output: PipedriveEndpointOutputSchemas.dealList,
	},
	'deals.get': {
		input: PipedriveEndpointInputSchemas.dealGet,
		output: PipedriveEndpointOutputSchemas.dealGet,
	},
	'deals.create': {
		input: PipedriveEndpointInputSchemas.dealCreate,
		output: PipedriveEndpointOutputSchemas.dealCreate,
	},
	'deals.update': {
		input: PipedriveEndpointInputSchemas.dealUpdate,
		output: PipedriveEndpointOutputSchemas.dealUpdate,
	},
	'deals.delete': {
		input: PipedriveEndpointInputSchemas.dealDelete,
		output: PipedriveEndpointOutputSchemas.dealDelete,
	},
	'persons.list': {
		input: PipedriveEndpointInputSchemas.personList,
		output: PipedriveEndpointOutputSchemas.personList,
	},
	'persons.get': {
		input: PipedriveEndpointInputSchemas.personGet,
		output: PipedriveEndpointOutputSchemas.personGet,
	},
	'persons.create': {
		input: PipedriveEndpointInputSchemas.personCreate,
		output: PipedriveEndpointOutputSchemas.personCreate,
	},
	'persons.update': {
		input: PipedriveEndpointInputSchemas.personUpdate,
		output: PipedriveEndpointOutputSchemas.personUpdate,
	},
	'persons.delete': {
		input: PipedriveEndpointInputSchemas.personDelete,
		output: PipedriveEndpointOutputSchemas.personDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pipedriveEndpointsNested
>;

const pipedriveEndpointMeta = {
	'deals.list': {
		riskLevel: 'read',
		description: 'List deals with cursor pagination and filters',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Get a deal by its numeric ID',
	},
	'deals.create': { riskLevel: 'write', description: 'Create a deal' },
	'deals.update': { riskLevel: 'write', description: 'Update a deal' },
	'deals.delete': { riskLevel: 'destructive', description: 'Delete a deal' },
	'persons.list': {
		riskLevel: 'read',
		description: 'List persons with cursor pagination and filters',
	},
	'persons.get': {
		riskLevel: 'read',
		description: 'Get a person by its numeric ID',
	},
	'persons.create': { riskLevel: 'write', description: 'Create a person' },
	'persons.update': { riskLevel: 'write', description: 'Update a person' },
	'persons.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof pipedriveEndpointsNested
>;

export const pipedriveAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BasePipedrivePlugin<T extends PipedrivePluginOptions> =
	CorsairPlugin<
		'pipedrive',
		typeof PipedriveSchema,
		typeof pipedriveEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalPipedrivePlugin =
	BasePipedrivePlugin<PipedrivePluginOptions>;
export type ExternalPipedrivePlugin<T extends PipedrivePluginOptions> =
	BasePipedrivePlugin<T>;

export function pipedrive<const T extends PipedrivePluginOptions>(
	incomingOptions: PipedrivePluginOptions & T = {} as PipedrivePluginOptions &
		T,
): ExternalPipedrivePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'pipedrive',
		authConfig: pipedriveAuthConfig,
		schema: PipedriveSchema,
		options,
		hooks: options.hooks,
		endpoints: pipedriveEndpointsNested,
		webhooks: {},
		endpointMeta: pipedriveEndpointMeta,
		endpointSchemas: pipedriveEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: PipedriveKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('pipedrive', ctx.authType);
			const credential =
				ctx.authType === 'oauth_2'
					? await ctx.keys.get_access_token()
					: await ctx.keys.get_api_key();
			if (!credential) throw new AuthMissingError('pipedrive', ctx.authType);
			return credential;
		},
	} satisfies InternalPipedrivePlugin;
}

export type {
	DealCreateInput,
	DealDeleteResponse,
	DealGetInput,
	DealListInput,
	DealListResponse,
	DealResponse,
	DealUpdateInput,
	PersonCreateInput,
	PersonDeleteResponse,
	PersonGetInput,
	PersonListInput,
	PersonListResponse,
	PersonResponse,
	PersonUpdateInput,
	PipedriveEndpointInputs,
	PipedriveEndpointOutputs,
} from './endpoints/types';
