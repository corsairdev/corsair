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
import { Account, Events, Milestones, Reports, Sites } from './endpoints';
import type {
	FathomEndpointInputs,
	FathomEndpointOutputs,
} from './endpoints/types';
import {
	FathomEndpointInputSchemas,
	FathomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FathomSchema } from './schema';

export type FathomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFathomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fathomEndpointsNested>;
};

export type FathomContext = CorsairPluginContext<
	typeof FathomSchema,
	FathomPluginOptions
>;

export type FathomKeyBuilderContext = KeyBuilderContext<FathomPluginOptions>;

export type FathomBoundEndpoints = BindEndpoints<typeof fathomEndpointsNested>;

type FathomEndpoint<K extends keyof FathomEndpointOutputs> = CorsairEndpoint<
	FathomContext,
	FathomEndpointInputs[K],
	FathomEndpointOutputs[K]
>;

export type FathomEndpoints = {
	[K in keyof FathomEndpointOutputs]: FathomEndpoint<K>;
};

const fathomEndpointsNested = {
	account: {
		get: Account.get,
		getToken: Account.getToken,
	},
	sites: {
		list: Sites.list,
		create: Sites.create,
		get: Sites.get,
		update: Sites.update,
		delete: Sites.delete,
		wipe: Sites.wipe,
	},
	events: {
		list: Events.list,
		setCurrency: Events.setCurrency,
		deleteByName: Events.deleteByName,
		create: Events.create,
		get: Events.get,
		update: Events.update,
		delete: Events.delete,
		wipe: Events.wipe,
	},
	milestones: {
		list: Milestones.list,
		create: Milestones.create,
		get: Milestones.get,
		update: Milestones.update,
		delete: Milestones.delete,
	},
	reports: {
		aggregation: Reports.aggregation,
		currentVisitors: Reports.currentVisitors,
	},
} as const;

export const fathomEndpointSchemas = {
	'account.get': {
		input: FathomEndpointInputSchemas['account.get'],
		output: FathomEndpointOutputSchemas['account.get'],
	},
	'account.getToken': {
		input: FathomEndpointInputSchemas['account.getToken'],
		output: FathomEndpointOutputSchemas['account.getToken'],
	},
	'sites.list': {
		input: FathomEndpointInputSchemas['sites.list'],
		output: FathomEndpointOutputSchemas['sites.list'],
	},
	'sites.create': {
		input: FathomEndpointInputSchemas['sites.create'],
		output: FathomEndpointOutputSchemas['sites.create'],
	},
	'sites.get': {
		input: FathomEndpointInputSchemas['sites.get'],
		output: FathomEndpointOutputSchemas['sites.get'],
	},
	'sites.update': {
		input: FathomEndpointInputSchemas['sites.update'],
		output: FathomEndpointOutputSchemas['sites.update'],
	},
	'sites.delete': {
		input: FathomEndpointInputSchemas['sites.delete'],
		output: FathomEndpointOutputSchemas['sites.delete'],
	},
	'sites.wipe': {
		input: FathomEndpointInputSchemas['sites.wipe'],
		output: FathomEndpointOutputSchemas['sites.wipe'],
	},
	'events.list': {
		input: FathomEndpointInputSchemas['events.list'],
		output: FathomEndpointOutputSchemas['events.list'],
	},
	'events.setCurrency': {
		input: FathomEndpointInputSchemas['events.setCurrency'],
		output: FathomEndpointOutputSchemas['events.setCurrency'],
	},
	'events.deleteByName': {
		input: FathomEndpointInputSchemas['events.deleteByName'],
		output: FathomEndpointOutputSchemas['events.deleteByName'],
	},
	'events.create': {
		input: FathomEndpointInputSchemas['events.create'],
		output: FathomEndpointOutputSchemas['events.create'],
	},
	'events.get': {
		input: FathomEndpointInputSchemas['events.get'],
		output: FathomEndpointOutputSchemas['events.get'],
	},
	'events.update': {
		input: FathomEndpointInputSchemas['events.update'],
		output: FathomEndpointOutputSchemas['events.update'],
	},
	'events.delete': {
		input: FathomEndpointInputSchemas['events.delete'],
		output: FathomEndpointOutputSchemas['events.delete'],
	},
	'events.wipe': {
		input: FathomEndpointInputSchemas['events.wipe'],
		output: FathomEndpointOutputSchemas['events.wipe'],
	},
	'milestones.list': {
		input: FathomEndpointInputSchemas['milestones.list'],
		output: FathomEndpointOutputSchemas['milestones.list'],
	},
	'milestones.create': {
		input: FathomEndpointInputSchemas['milestones.create'],
		output: FathomEndpointOutputSchemas['milestones.create'],
	},
	'milestones.get': {
		input: FathomEndpointInputSchemas['milestones.get'],
		output: FathomEndpointOutputSchemas['milestones.get'],
	},
	'milestones.update': {
		input: FathomEndpointInputSchemas['milestones.update'],
		output: FathomEndpointOutputSchemas['milestones.update'],
	},
	'milestones.delete': {
		input: FathomEndpointInputSchemas['milestones.delete'],
		output: FathomEndpointOutputSchemas['milestones.delete'],
	},
	'reports.aggregation': {
		input: FathomEndpointInputSchemas['reports.aggregation'],
		output: FathomEndpointOutputSchemas['reports.aggregation'],
	},
	'reports.currentVisitors': {
		input: FathomEndpointInputSchemas['reports.currentVisitors'],
		output: FathomEndpointOutputSchemas['reports.currentVisitors'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fathomEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const fathomEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Retrieve information about the account that owns the API key',
	},
	'account.getToken': {
		riskLevel: 'read',
		description:
			'Retrieve metadata about the API token used to make the request',
	},
	'sites.list': {
		riskLevel: 'read',
		description: 'List all sites owned by the account with pagination',
	},
	'sites.create': {
		riskLevel: 'write',
		description: 'Create a new site entity in Fathom Analytics',
	},
	'sites.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a single site by its ID',
	},
	'sites.update': {
		riskLevel: 'write',
		description: 'Update site settings such as name, sharing, or timezone',
	},
	'sites.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a site and all associated analytics data',
	},
	'sites.wipe': {
		riskLevel: 'destructive',
		description: 'Wipe all data from a site (deprecated: returns 410 Gone)',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List all events tracked by a site with pagination',
	},
	'events.setCurrency': {
		riskLevel: 'write',
		description: 'Set or update the currency for an event by name',
	},
	'events.deleteByName': {
		riskLevel: 'write',
		description:
			"Remove an event's currency setting by name (the event and its completions stay; set it again with events.setCurrency)",
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Create an event (deprecated: returns 410 Gone; track directly on site)',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Retrieve a single event by ID (deprecated: returns 410 Gone)',
	},
	'events.update': {
		riskLevel: 'write',
		description: 'Update an event by ID (deprecated: returns 410 Gone)',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description: 'Delete an event by ID (deprecated: returns 410 Gone)',
	},
	'events.wipe': {
		riskLevel: 'destructive',
		description: 'Wipe event completion data (deprecated: returns 410 Gone)',
	},
	'milestones.list': {
		riskLevel: 'read',
		description: 'List all milestones for a site with pagination',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a new milestone for a site',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Retrieve a single milestone by its ID',
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update a milestone name or date by its ID',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a milestone from a site',
	},
	'reports.aggregation': {
		riskLevel: 'read',
		description:
			'Generate custom aggregation reports across pageviews or events',
	},
	'reports.currentVisitors': {
		riskLevel: 'read',
		description:
			'Get real-time current visitor count and optional page/referrer breakdown',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fathomEndpointsNested>;

export const fathomAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFathomPlugin<T extends FathomPluginOptions> = CorsairPlugin<
	'fathom',
	typeof FathomSchema,
	typeof fathomEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFathomPlugin = BaseFathomPlugin<FathomPluginOptions>;

export type ExternalFathomPlugin<T extends FathomPluginOptions> =
	BaseFathomPlugin<T>;

export function fathom<const T extends FathomPluginOptions>(
	incomingOptions: FathomPluginOptions & T = {} as FathomPluginOptions & T,
): ExternalFathomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};

	return {
		id: 'fathom',
		authConfig: fathomAuthConfig,
		schema: FathomSchema,
		options,
		hooks: options.hooks,
		endpoints: fathomEndpointsNested,
		webhooks: {},
		endpointMeta: fathomEndpointMeta,
		endpointSchemas: fathomEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: FathomKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('fathom', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('fathom', 'api_key');
			return apiKey;
		},
	} satisfies InternalFathomPlugin;
}

export {
	FATHOM_API_BASE,
	FathomAPIError,
	makeFathomRequest,
	redactSensitiveData,
} from './client';
export type {
	Account,
	AggregationFilter,
	AggregationsResponse,
	Currency,
	CurrentVisitorsResponse,
	DateGrouping,
	DeprecatedEventResponse,
	EventDeleteResponse,
	EventItem,
	EventListResponse,
	EventSetCurrencyResponse,
	FathomEndpointInputs,
	FathomEndpointOutputs,
	Milestone,
	MilestoneDeleteResponse,
	MilestoneListResponse,
	Site,
	SiteDeleteResponse,
	SiteListResponse,
	SiteWipeResponse,
	Token,
} from './endpoints/types';
