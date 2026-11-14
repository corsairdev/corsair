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
import { Application, Events, Templates } from './endpoints';
import type {
	FomoEndpointInputs,
	FomoEndpointOutputs,
} from './endpoints/types';
import {
	FomoEndpointInputSchemas,
	FomoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FomoSchema } from './schema';

export type FomoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFomoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fomoEndpointsNested>;
};

export type FomoContext = CorsairPluginContext<
	typeof FomoSchema,
	FomoPluginOptions
>;

export type FomoKeyBuilderContext = KeyBuilderContext<FomoPluginOptions>;

export type FomoBoundEndpoints = BindEndpoints<typeof fomoEndpointsNested>;

type FomoEndpoint<K extends keyof FomoEndpointOutputs> = CorsairEndpoint<
	FomoContext,
	FomoEndpointInputs[K],
	FomoEndpointOutputs[K]
>;

export type FomoEndpoints = {
	'events.list': FomoEndpoint<'events.list'>;
	'events.get': FomoEndpoint<'events.get'>;
	'events.create': FomoEndpoint<'events.create'>;
	'events.update': FomoEndpoint<'events.update'>;
	'events.delete': FomoEndpoint<'events.delete'>;
	'events.search': FomoEndpoint<'events.search'>;
	'templates.list': FomoEndpoint<'templates.list'>;
	'templates.get': FomoEndpoint<'templates.get'>;
	'templates.create': FomoEndpoint<'templates.create'>;
	'templates.update': FomoEndpoint<'templates.update'>;
	'templates.delete': FomoEndpoint<'templates.delete'>;
	'application.get': FomoEndpoint<'application.get'>;
	'application.update': FomoEndpoint<'application.update'>;
	'application.getStats': FomoEndpoint<'application.getStats'>;
};

const fomoEndpointsNested = {
	events: {
		list: Events.list,
		get: Events.get,
		create: Events.create,
		update: Events.update,
		delete: Events.delete,
		search: Events.search,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.delete,
	},
	application: {
		get: Application.get,
		update: Application.update,
		getStats: Application.getStats,
	},
} as const;

export const fomoEndpointSchemas = {
	'events.list': {
		input: FomoEndpointInputSchemas['events.list'],
		output: FomoEndpointOutputSchemas['events.list'],
	},
	'events.get': {
		input: FomoEndpointInputSchemas['events.get'],
		output: FomoEndpointOutputSchemas['events.get'],
	},
	'events.create': {
		input: FomoEndpointInputSchemas['events.create'],
		output: FomoEndpointOutputSchemas['events.create'],
	},
	'events.update': {
		input: FomoEndpointInputSchemas['events.update'],
		output: FomoEndpointOutputSchemas['events.update'],
	},
	'events.delete': {
		input: FomoEndpointInputSchemas['events.delete'],
		output: FomoEndpointOutputSchemas['events.delete'],
	},
	'events.search': {
		input: FomoEndpointInputSchemas['events.search'],
		output: FomoEndpointOutputSchemas['events.search'],
	},
	'templates.list': {
		input: FomoEndpointInputSchemas['templates.list'],
		output: FomoEndpointOutputSchemas['templates.list'],
	},
	'templates.get': {
		input: FomoEndpointInputSchemas['templates.get'],
		output: FomoEndpointOutputSchemas['templates.get'],
	},
	'templates.create': {
		input: FomoEndpointInputSchemas['templates.create'],
		output: FomoEndpointOutputSchemas['templates.create'],
	},
	'templates.update': {
		input: FomoEndpointInputSchemas['templates.update'],
		output: FomoEndpointOutputSchemas['templates.update'],
	},
	'templates.delete': {
		input: FomoEndpointInputSchemas['templates.delete'],
		output: FomoEndpointOutputSchemas['templates.delete'],
	},
	'application.get': {
		input: FomoEndpointInputSchemas['application.get'],
		output: FomoEndpointOutputSchemas['application.get'],
	},
	'application.update': {
		input: FomoEndpointInputSchemas['application.update'],
		output: FomoEndpointOutputSchemas['application.update'],
	},
	'application.getStats': {
		input: FomoEndpointInputSchemas['application.getStats'],
		output: FomoEndpointOutputSchemas['application.getStats'],
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fomoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const fomoEndpointMeta = {
	'events.list': {
		riskLevel: 'read',
		description: 'List Fomo events with optional pagination',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Retrieve a Fomo event by ID',
	},
	'events.create': {
		riskLevel: 'destructive',
		description:
			"Create a new Fomo event; it shows as a social-proof notification on the site's live feed",
	},
	'events.update': {
		riskLevel: 'write',
		description: 'Update an existing Fomo event by ID',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Fomo event by ID',
	},
	'events.search': {
		riskLevel: 'read',
		description: 'Search for an event by external_id or email_address',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List Fomo event templates (event types)',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Retrieve a Fomo event template by ID',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a new Fomo event template',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update an existing Fomo event template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Fomo event template by ID',
	},
	'application.get': {
		riskLevel: 'read',
		description:
			"Get Fomo application settings for the token's own site, or pass id to read another site of the same user",
	},
	'application.update': {
		riskLevel: 'write',
		description:
			"Update Fomo application settings for the token's own site, or pass id to update another site of the same user",
	},
	'application.getStats': {
		riskLevel: 'read',
		description: 'Get notification statistics and conversion data',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fomoEndpointsNested>;

export const fomoAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFomoPlugin<T extends FomoPluginOptions> = CorsairPlugin<
	'fomo',
	typeof FomoSchema,
	typeof fomoEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFomoPlugin = BaseFomoPlugin<FomoPluginOptions>;

export type ExternalFomoPlugin<T extends FomoPluginOptions> = BaseFomoPlugin<T>;

export function fomo<const T extends FomoPluginOptions>(
	incomingOptions: FomoPluginOptions & T = {} as FomoPluginOptions & T,
): ExternalFomoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	// Exclude built-in handlers that the caller explicitly overrides so callers always take precedence
	const nonOverriddenBuiltIns = Object.fromEntries(
		Object.entries(builtIns).filter(([key]) => !(key in callers)),
	);
	const mergedErrorHandlers = {
		...callers,
		...nonOverriddenBuiltIns,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'fomo',
		authConfig: fomoAuthConfig,
		schema: FomoSchema,
		options,
		hooks: options.hooks,
		endpoints: fomoEndpointsNested,
		webhooks: {},
		endpointMeta: fomoEndpointMeta,
		endpointSchemas: fomoEndpointSchemas,
		errorHandlers: mergedErrorHandlers,
		keyBuilder: async (ctx: FomoKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (options.key.trim().length === 0) {
					throw new AuthMissingError('fomo', 'api_key');
				}
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('fomo', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey || apiKey.trim().length === 0) {
				throw new AuthMissingError('fomo', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalFomoPlugin;
}

export type {
	ApplicationGetInput,
	ApplicationGetOutput,
	ApplicationGetStatsInput,
	ApplicationGetStatsOutput,
	ApplicationSettings,
	ApplicationUpdateInput,
	ApplicationUpdateOutput,
	CustomEventFieldAttribute,
	EventsCreateInput,
	EventsCreateOutput,
	EventsDeleteInput,
	EventsDeleteOutput,
	EventsGetInput,
	EventsGetOutput,
	EventsListInput,
	EventsListOutput,
	EventsMeta,
	EventsSearchInput,
	EventsSearchOutput,
	EventsUpdateInput,
	EventsUpdateOutput,
	FomoEndpointInputs,
	FomoEndpointOutputs,
	FomoEvent,
	Template,
	TemplatesCreateInput,
	TemplatesCreateOutput,
	TemplatesDeleteInput,
	TemplatesDeleteOutput,
	TemplatesGetInput,
	TemplatesGetOutput,
	TemplatesListInput,
	TemplatesListOutput,
	TemplatesUpdateInput,
	TemplatesUpdateOutput,
} from './endpoints/types';
