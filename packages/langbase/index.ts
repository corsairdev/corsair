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
import { memory, pipes, tools } from './endpoints';
import type {
	LangbaseEndpointInputs,
	LangbaseEndpointOutputs,
} from './endpoints/types';
import {
	LangbaseEndpointInputSchemas,
	LangbaseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LangbaseSchema } from './schema';

export type LangbasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLangbasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof langbaseEndpointsNested>;
};

export type LangbaseContext = CorsairPluginContext<
	typeof LangbaseSchema,
	LangbasePluginOptions
>;

export type LangbaseKeyBuilderContext =
	KeyBuilderContext<LangbasePluginOptions>;

export type LangbaseBoundEndpoints = BindEndpoints<
	typeof langbaseEndpointsNested
>;

type LangbaseEndpoint<K extends keyof LangbaseEndpointOutputs> =
	CorsairEndpoint<
		LangbaseContext,
		LangbaseEndpointInputs[K],
		LangbaseEndpointOutputs[K]
	>;

export type LangbaseEndpoints = {
	'pipes.run': LangbaseEndpoint<'pipes.run'>;
	'pipes.list': LangbaseEndpoint<'pipes.list'>;
	'pipes.get': LangbaseEndpoint<'pipes.get'>;
	'pipes.create': LangbaseEndpoint<'pipes.create'>;
	'pipes.update': LangbaseEndpoint<'pipes.update'>;
	'pipes.delete': LangbaseEndpoint<'pipes.delete'>;
	'memory.list': LangbaseEndpoint<'memory.list'>;
	'memory.get': LangbaseEndpoint<'memory.get'>;
	'memory.create': LangbaseEndpoint<'memory.create'>;
	'memory.delete': LangbaseEndpoint<'memory.delete'>;
	'tools.webSearch': LangbaseEndpoint<'tools.webSearch'>;
};

const langbaseEndpointsNested = {
	pipes: {
		run: pipes.run,
		list: pipes.list,
		get: pipes.get,
		create: pipes.create,
		update: pipes.update,
		delete: pipes.delete,
	},
	memory: {
		list: memory.list,
		get: memory.get,
		create: memory.create,
		delete: memory.delete,
	},
	tools: {
		webSearch: tools.webSearch,
	},
} as const;

export const langbaseEndpointSchemas = {
	'pipes.run': {
		input: LangbaseEndpointInputSchemas['pipes.run'],
		output: LangbaseEndpointOutputSchemas['pipes.run'],
	},
	'pipes.list': {
		input: LangbaseEndpointInputSchemas['pipes.list'],
		output: LangbaseEndpointOutputSchemas['pipes.list'],
	},
	'pipes.get': {
		input: LangbaseEndpointInputSchemas['pipes.get'],
		output: LangbaseEndpointOutputSchemas['pipes.get'],
	},
	'pipes.create': {
		input: LangbaseEndpointInputSchemas['pipes.create'],
		output: LangbaseEndpointOutputSchemas['pipes.create'],
	},
	'pipes.update': {
		input: LangbaseEndpointInputSchemas['pipes.update'],
		output: LangbaseEndpointOutputSchemas['pipes.update'],
	},
	'pipes.delete': {
		input: LangbaseEndpointInputSchemas['pipes.delete'],
		output: LangbaseEndpointOutputSchemas['pipes.delete'],
	},
	'memory.list': {
		input: LangbaseEndpointInputSchemas['memory.list'],
		output: LangbaseEndpointOutputSchemas['memory.list'],
	},
	'memory.get': {
		input: LangbaseEndpointInputSchemas['memory.get'],
		output: LangbaseEndpointOutputSchemas['memory.get'],
	},
	'memory.create': {
		input: LangbaseEndpointInputSchemas['memory.create'],
		output: LangbaseEndpointOutputSchemas['memory.create'],
	},
	'memory.delete': {
		input: LangbaseEndpointInputSchemas['memory.delete'],
		output: LangbaseEndpointOutputSchemas['memory.delete'],
	},
	'tools.webSearch': {
		input: LangbaseEndpointInputSchemas['tools.webSearch'],
		output: LangbaseEndpointOutputSchemas['tools.webSearch'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof langbaseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const langbaseEndpointMeta = {
	'pipes.run': {
		riskLevel: 'write',
		description: 'Execute an AI agent pipe and return generation completion',
	},
	'pipes.list': {
		riskLevel: 'read',
		description: 'Retrieve all configured pipes in the account',
	},
	'pipes.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific pipe definition by name',
	},
	'pipes.create': {
		riskLevel: 'write',
		description: 'Create a new AI agent pipe',
	},
	'pipes.update': {
		riskLevel: 'write',
		description: 'Update an existing pipe configuration',
	},
	'pipes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pipe definition',
	},
	'memory.list': {
		riskLevel: 'read',
		description: 'Retrieve all managed semantic memory sets',
	},
	'memory.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific semantic memory set by name',
	},
	'memory.create': {
		riskLevel: 'write',
		description: 'Create a new managed semantic memory set',
	},
	'memory.delete': {
		riskLevel: 'destructive',
		description: 'Delete a semantic memory set',
	},
	'tools.webSearch': {
		riskLevel: 'read',
		description: 'Perform web searches via Langbase Tools API',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof langbaseEndpointsNested>;

export const langbaseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLangbasePlugin<T extends LangbasePluginOptions> = CorsairPlugin<
	'langbase',
	typeof LangbaseSchema,
	typeof langbaseEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalLangbasePlugin = BaseLangbasePlugin<LangbasePluginOptions>;

export type ExternalLangbasePlugin<T extends LangbasePluginOptions> =
	BaseLangbasePlugin<T>;

export function langbase<const T extends LangbasePluginOptions>(
	incomingOptions: LangbasePluginOptions & T = {} as LangbasePluginOptions & T,
): ExternalLangbasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'langbase',
		authConfig: langbaseAuthConfig,
		schema: LangbaseSchema,
		options,
		hooks: options.hooks,
		endpoints: langbaseEndpointsNested,
		webhooks: {},
		endpointMeta: langbaseEndpointMeta,
		endpointSchemas: langbaseEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LangbaseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('langbase', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('langbase', 'api_key');
			return apiKey;
		},
	} satisfies InternalLangbasePlugin;
}

export type {
	CreateMemoryInput,
	CreateMemoryOutput,
	CreatePipeInput,
	CreatePipeOutput,
	DeleteMemoryInput,
	DeleteMemoryOutput,
	DeletePipeInput,
	DeletePipeOutput,
	GetMemoryInput,
	GetMemoryOutput,
	GetPipeInput,
	GetPipeOutput,
	LangbaseEndpointInputs,
	LangbaseEndpointOutputs,
	ListMemoryInput,
	ListMemoryOutput,
	ListPipesInput,
	ListPipesOutput,
	RunPipeInput,
	RunPipeOutput,
	UpdatePipeInput,
	UpdatePipeOutput,
	WebSearchInput,
	WebSearchOutput,
} from './endpoints/types';
