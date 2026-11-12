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
import { Endpoints } from './endpoints';
import type {
	RollbarEndpointInputs,
	RollbarEndpointOutputs,
} from './endpoints/types';
import {
	RollbarEndpointInputSchemas,
	RollbarEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RollbarSchema } from './schema';

export type RollbarPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRollbarPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rollbarEndpointsNested>;
};

export type RollbarContext = CorsairPluginContext<
	typeof RollbarSchema,
	RollbarPluginOptions
>;

export type RollbarKeyBuilderContext = KeyBuilderContext<RollbarPluginOptions>;

export type RollbarBoundEndpoints = BindEndpoints<
	typeof rollbarEndpointsNested
>;

type RollbarEndpoint<K extends keyof RollbarEndpointOutputs> = CorsairEndpoint<
	RollbarContext,
	RollbarEndpointInputs[K],
	RollbarEndpointOutputs[K]
>;

export type RollbarEndpoints = {
	itemsList: RollbarEndpoint<'itemsList'>;
	itemsGet: RollbarEndpoint<'itemsGet'>;
	itemsUpdate: RollbarEndpoint<'itemsUpdate'>;
	itemComments: RollbarEndpoint<'itemComments'>;
	itemCommentCreate: RollbarEndpoint<'itemCommentCreate'>;
	itemEvents: RollbarEndpoint<'itemEvents'>;
	occurrencesList: RollbarEndpoint<'occurrencesList'>;
	occurrencesGet: RollbarEndpoint<'occurrencesGet'>;
	projectsList: RollbarEndpoint<'projectsList'>;
	deploysList: RollbarEndpoint<'deploysList'>;
	deploysCreate: RollbarEndpoint<'deploysCreate'>;
};

const rollbarEndpointsNested = {
	items: {
		list: Endpoints.itemsList,
		get: Endpoints.itemsGet,
		update: Endpoints.itemsUpdate,
	},
	itemComments: {
		list: Endpoints.itemComments,
		create: Endpoints.itemCommentCreate,
	},
	itemEvents: {
		list: Endpoints.itemEvents,
	},
	occurrences: {
		list: Endpoints.occurrencesList,
		get: Endpoints.occurrencesGet,
	},
	projects: {
		list: Endpoints.projectsList,
	},
	deploys: {
		list: Endpoints.deploysList,
		create: Endpoints.deploysCreate,
	},
} as const;

export const rollbarEndpointSchemas = {
	'items.list': {
		input: RollbarEndpointInputSchemas.itemsList,
		output: RollbarEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: RollbarEndpointInputSchemas.itemsGet,
		output: RollbarEndpointOutputSchemas.itemsGet,
	},
	'items.update': {
		input: RollbarEndpointInputSchemas.itemsUpdate,
		output: RollbarEndpointOutputSchemas.itemsUpdate,
	},
	'itemComments.list': {
		input: RollbarEndpointInputSchemas.itemComments,
		output: RollbarEndpointOutputSchemas.itemComments,
	},
	'itemComments.create': {
		input: RollbarEndpointInputSchemas.itemCommentCreate,
		output: RollbarEndpointOutputSchemas.itemCommentCreate,
	},
	'itemEvents.list': {
		input: RollbarEndpointInputSchemas.itemEvents,
		output: RollbarEndpointOutputSchemas.itemEvents,
	},
	'occurrences.list': {
		input: RollbarEndpointInputSchemas.occurrencesList,
		output: RollbarEndpointOutputSchemas.occurrencesList,
	},
	'occurrences.get': {
		input: RollbarEndpointInputSchemas.occurrencesGet,
		output: RollbarEndpointOutputSchemas.occurrencesGet,
	},
	'projects.list': {
		input: RollbarEndpointInputSchemas.projectsList,
		output: RollbarEndpointOutputSchemas.projectsList,
	},
	'deploys.list': {
		input: RollbarEndpointInputSchemas.deploysList,
		output: RollbarEndpointOutputSchemas.deploysList,
	},
	'deploys.create': {
		input: RollbarEndpointInputSchemas.deploysCreate,
		output: RollbarEndpointOutputSchemas.deploysCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rollbarEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rollbarEndpointMeta = {
	'items.list': {
		riskLevel: 'read',
		description:
			'List error items with status, level, environment and assignee filters plus page paging',
	},
	'items.get': {
		riskLevel: 'read',
		description:
			'Fetch one item with its occurrence counts, timestamps and resolution state',
	},
	'items.update': {
		riskLevel: 'write',
		description:
			'Update an item: its status, level, title, assignee, resolved-in version or snooze',
	},
	'itemComments.list': {
		riskLevel: 'read',
		description:
			'List the comments and resolve notes on an item, oldest first (Rollbar marks this route deprecated in favour of itemEvents.list)',
	},
	'itemComments.create': {
		riskLevel: 'write',
		description:
			'Add a comment to an item, posted as the token owner; needs a personal access token with write scope and the project_id',
	},
	'itemEvents.list': {
		riskLevel: 'read',
		description:
			'List the history events for an item: status changes, assignments and comments',
	},
	'occurrences.list': {
		riskLevel: 'read',
		description:
			'List occurrences in a project with page paging, for a forward walk from a known id',
	},
	'occurrences.get': {
		riskLevel: 'read',
		description:
			'Fetch one occurrence: its ids, timestamp and the payload the notifier sent under data (level, trace, request, person)',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List the projects the token can see; needs an account or personal access token',
	},
	'deploys.list': {
		riskLevel: 'read',
		description: 'List deploys in a project, newest first, with page paging',
	},
	'deploys.create': {
		riskLevel: 'write',
		description:
			'Record a deploy with its environment, revision and optional status and comment; needs a project token with post_server_item scope',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof rollbarEndpointsNested>;

export type BaseRollbarPlugin<T extends RollbarPluginOptions> = CorsairPlugin<
	'rollbar',
	typeof RollbarSchema,
	typeof rollbarEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRollbarPlugin = BaseRollbarPlugin<RollbarPluginOptions>;

export type ExternalRollbarPlugin<T extends RollbarPluginOptions> =
	BaseRollbarPlugin<T>;

export function rollbar<const T extends RollbarPluginOptions>(
	incomingOptions: RollbarPluginOptions & T = {} as RollbarPluginOptions & T,
): ExternalRollbarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rollbar',
		schema: RollbarSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rollbarEndpointsNested,
		webhooks: {},
		endpointMeta: rollbarEndpointMeta,
		endpointSchemas: rollbarEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RollbarKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('rollbar', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRollbarPlugin;
}

export { RollbarAPIError } from './client';

export type {
	DeployCreateInput,
	DeployCreateResponse,
	DeploysListInput,
	DeploysListResponse,
	ItemCommentCreateInput,
	ItemCommentCreateResponse,
	ItemCommentsInput,
	ItemCommentsResponse,
	ItemEventsInput,
	ItemEventsResponse,
	ItemsGetInput,
	ItemsGetResponse,
	ItemsListInput,
	ItemsListResponse,
	ItemsUpdateInput,
	ItemsUpdateResponse,
	OccurrencesGetInput,
	OccurrencesGetResponse,
	OccurrencesListInput,
	OccurrencesListResponse,
	ProjectsListInput,
	ProjectsListResponse,
	RollbarComment,
	RollbarDeploy,
	RollbarEndpointInputs,
	RollbarEndpointOutputs,
	RollbarItem,
	RollbarItemEvent,
	RollbarOccurrence,
	RollbarProject,
} from './endpoints/types';
