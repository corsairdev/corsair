import type {
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
import type { MixpanelRegion } from './client';
import {
	Cohorts,
	Events,
	Export,
	Funnels,
	Insights,
	Profiles,
	Retention,
} from './endpoints';
import type {
	MixpanelEndpointInputs,
	MixpanelEndpointOutputs,
} from './endpoints/types';
import {
	MixpanelEndpointInputSchemas,
	MixpanelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MixpanelSchema } from './schema';

export type MixpanelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The service account username, saved on the account in managed auth. */
	serviceAccountUsername?: string;
	/** The service account secret, saved on the account in managed auth. */
	serviceAccountSecret?: string;
	/** The Mixpanel project id every service-account request must carry. */
	projectId?: number;
	/** Data residency of the project; defaults to `us`. */
	region?: MixpanelRegion;
	hooks?: InternalMixpanelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mixpanelEndpointsNested>;
};

export type MixpanelContext = CorsairPluginContext<
	typeof MixpanelSchema,
	MixpanelPluginOptions,
	undefined,
	typeof mixpanelAuthConfig
>;

export type MixpanelKeyBuilderContext = KeyBuilderContext<
	MixpanelPluginOptions,
	typeof mixpanelAuthConfig
>;

export type MixpanelBoundEndpoints = BindEndpoints<
	typeof mixpanelEndpointsNested
>;

type MixpanelEndpoint<K extends keyof MixpanelEndpointOutputs> =
	CorsairEndpoint<
		MixpanelContext,
		MixpanelEndpointInputs[K],
		MixpanelEndpointOutputs[K]
	>;

export type MixpanelEndpoints = {
	eventsImport: MixpanelEndpoint<'eventsImport'>;
	profilesQuery: MixpanelEndpoint<'profilesQuery'>;
	cohortsList: MixpanelEndpoint<'cohortsList'>;
	insightsQuery: MixpanelEndpoint<'insightsQuery'>;
	funnelsList: MixpanelEndpoint<'funnelsList'>;
	retentionQuery: MixpanelEndpoint<'retentionQuery'>;
	exportEvents: MixpanelEndpoint<'exportEvents'>;
};

const mixpanelEndpointsNested = {
	events: {
		import: Events.importEvents,
	},
	profiles: {
		query: Profiles.query,
	},
	cohorts: {
		list: Cohorts.list,
	},
	insights: {
		query: Insights.query,
	},
	funnels: {
		list: Funnels.list,
	},
	retention: {
		query: Retention.query,
	},
	export: {
		events: Export.events,
	},
} as const;

export const mixpanelEndpointSchemas = {
	'events.import': {
		input: MixpanelEndpointInputSchemas.eventsImport,
		output: MixpanelEndpointOutputSchemas.eventsImport,
	},
	'profiles.query': {
		input: MixpanelEndpointInputSchemas.profilesQuery,
		output: MixpanelEndpointOutputSchemas.profilesQuery,
	},
	'cohorts.list': {
		input: MixpanelEndpointInputSchemas.cohortsList,
		output: MixpanelEndpointOutputSchemas.cohortsList,
	},
	'insights.query': {
		input: MixpanelEndpointInputSchemas.insightsQuery,
		output: MixpanelEndpointOutputSchemas.insightsQuery,
	},
	'funnels.list': {
		input: MixpanelEndpointInputSchemas.funnelsList,
		output: MixpanelEndpointOutputSchemas.funnelsList,
	},
	'retention.query': {
		input: MixpanelEndpointInputSchemas.retentionQuery,
		output: MixpanelEndpointOutputSchemas.retentionQuery,
	},
	'export.events': {
		input: MixpanelEndpointInputSchemas.exportEvents,
		output: MixpanelEndpointOutputSchemas.exportEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mixpanelEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const mixpanelEndpointMeta = {
	'events.import': {
		riskLevel: 'write',
		description:
			'Import a batch of up to 2000 server-side events, validated per event when strict mode is on (the default)',
	},
	'profiles.query': {
		riskLevel: 'read',
		description:
			'Query user or group profiles with an expression, a cohort filter or exact distinct_ids, paged via session_id and next_page',
	},
	'cohorts.list': {
		riskLevel: 'read',
		description:
			'List every saved cohort with its id, member count, visibility and description',
	},
	'insights.query': {
		riskLevel: 'read',
		description:
			'Read the data behind one saved Insights report by its bookmark id',
	},
	'funnels.list': {
		riskLevel: 'read',
		description: 'List the saved funnels with their ids and names',
	},
	'retention.query': {
		riskLevel: 'read',
		description:
			'Run a birth or compounded retention query for a date range, per day, week or month',
	},
	'export.events': {
		riskLevel: 'read',
		description:
			'Export raw events for a date range as parsed objects, with optional event-name filter, expression filter and limit',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mixpanelEndpointsNested>;

/**
 * Every call authenticates with a Mixpanel service account over HTTP Basic,
 * so the account stores the username, the secret and the project id that
 * every service-account request must carry as a query parameter.
 */
export const mixpanelAuthConfig = {
	api_key: {
		account: [
			'service_account_username',
			'service_account_secret',
			'project_id',
		] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMixpanelPlugin<T extends MixpanelPluginOptions> = CorsairPlugin<
	'mixpanel',
	typeof MixpanelSchema,
	typeof mixpanelEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof mixpanelAuthConfig
>;

export type InternalMixpanelPlugin = BaseMixpanelPlugin<MixpanelPluginOptions>;

export type ExternalMixpanelPlugin<T extends MixpanelPluginOptions> =
	BaseMixpanelPlugin<T>;

export function mixpanel<const T extends MixpanelPluginOptions>(
	incomingOptions: MixpanelPluginOptions & T = {} as MixpanelPluginOptions & T,
): ExternalMixpanelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		region: incomingOptions.region ?? 'us',
	};
	return {
		id: 'mixpanel',
		schema: MixpanelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mixpanelEndpointsNested,
		webhooks: {},
		authConfig: mixpanelAuthConfig,
		endpointMeta: mixpanelEndpointMeta,
		endpointSchemas: mixpanelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MixpanelKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('mixpanel', ctx.authType ?? 'api_key');
			}

			const username =
				options.serviceAccountUsername ??
				(await ctx.keys.get_service_account_username());
			const secret =
				options.serviceAccountSecret ??
				(await ctx.keys.get_service_account_secret());
			if (!username || !secret) {
				throw new AuthMissingError('mixpanel', ctx.authType ?? 'api_key');
			}

			// Mixpanel's basic auth accepts the plain colon-joined pair, so the
			// client sends it as-is after the Basic scheme.
			return `${username}:${secret}`;
		},
	} satisfies InternalMixpanelPlugin;
}

export { MixpanelAPIError } from './client';

export type {
	CohortsListInput,
	CohortsListResponse,
	EventsImportInput,
	EventsImportResponse,
	ExportEventsInput,
	ExportEventsResponse,
	FunnelsListInput,
	FunnelsListResponse,
	InsightsQueryInput,
	InsightsQueryResponse,
	MixpanelEndpointInputs,
	MixpanelEndpointOutputs,
	ProfilesQueryInput,
	ProfilesQueryResponse,
	RetentionQueryInput,
	RetentionQueryResponse,
} from './endpoints/types';
