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
import { Comments, Discussions, Groups, Polls, Threads } from './endpoints';
import type {
	LoomioEndpointInputs,
	LoomioEndpointOutputs,
} from './endpoints/types';
import {
	LoomioEndpointInputSchemas,
	LoomioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LoomioSchema } from './schema';

export type LoomioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLoomioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof loomioEndpointsNested>;
};

export type LoomioContext = CorsairPluginContext<
	typeof LoomioSchema,
	LoomioPluginOptions
>;

export type LoomioKeyBuilderContext = KeyBuilderContext<LoomioPluginOptions>;

export type LoomioBoundEndpoints = BindEndpoints<typeof loomioEndpointsNested>;

type LoomioEndpoint<K extends keyof LoomioEndpointOutputs> = CorsairEndpoint<
	LoomioContext,
	LoomioEndpointInputs[K],
	LoomioEndpointOutputs[K]
>;

export type LoomioEndpoints = {
	groupsList: LoomioEndpoint<'groupsList'>;
	groupsGet: LoomioEndpoint<'groupsGet'>;
	discussionsList: LoomioEndpoint<'discussionsList'>;
	discussionsGet: LoomioEndpoint<'discussionsGet'>;
	discussionsCreate: LoomioEndpoint<'discussionsCreate'>;
	commentsCreate: LoomioEndpoint<'commentsCreate'>;
	threadsList: LoomioEndpoint<'threadsList'>;
	threadsItems: LoomioEndpoint<'threadsItems'>;
	threadsMarkdown: LoomioEndpoint<'threadsMarkdown'>;
	pollsList: LoomioEndpoint<'pollsList'>;
	pollsGet: LoomioEndpoint<'pollsGet'>;
	pollsCreate: LoomioEndpoint<'pollsCreate'>;
};

const loomioEndpointsNested = {
	groups: {
		list: Groups.list,
		get: Groups.get,
	},
	discussions: {
		list: Discussions.list,
		get: Discussions.get,
		create: Discussions.create,
	},
	comments: {
		create: Comments.create,
	},
	threads: {
		list: Threads.list,
		items: Threads.items,
		markdown: Threads.markdown,
	},
	polls: {
		list: Polls.list,
		get: Polls.get,
		create: Polls.create,
	},
} as const;

export const loomioEndpointSchemas = {
	'groups.list': {
		input: LoomioEndpointInputSchemas.groupsList,
		output: LoomioEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: LoomioEndpointInputSchemas.groupsGet,
		output: LoomioEndpointOutputSchemas.groupsGet,
	},
	'discussions.list': {
		input: LoomioEndpointInputSchemas.discussionsList,
		output: LoomioEndpointOutputSchemas.discussionsList,
	},
	'discussions.get': {
		input: LoomioEndpointInputSchemas.discussionsGet,
		output: LoomioEndpointOutputSchemas.discussionsGet,
	},
	'discussions.create': {
		input: LoomioEndpointInputSchemas.discussionsCreate,
		output: LoomioEndpointOutputSchemas.discussionsCreate,
	},
	'comments.create': {
		input: LoomioEndpointInputSchemas.commentsCreate,
		output: LoomioEndpointOutputSchemas.commentsCreate,
	},
	'threads.list': {
		input: LoomioEndpointInputSchemas.threadsList,
		output: LoomioEndpointOutputSchemas.threadsList,
	},
	'threads.items': {
		input: LoomioEndpointInputSchemas.threadsItems,
		output: LoomioEndpointOutputSchemas.threadsItems,
	},
	'threads.markdown': {
		input: LoomioEndpointInputSchemas.threadsMarkdown,
		output: LoomioEndpointOutputSchemas.threadsMarkdown,
	},
	'polls.list': {
		input: LoomioEndpointInputSchemas.pollsList,
		output: LoomioEndpointOutputSchemas.pollsList,
	},
	'polls.get': {
		input: LoomioEndpointInputSchemas.pollsGet,
		output: LoomioEndpointOutputSchemas.pollsGet,
	},
	'polls.create': {
		input: LoomioEndpointInputSchemas.pollsCreate,
		output: LoomioEndpointOutputSchemas.pollsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof loomioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const loomioEndpointMeta = {
	'groups.list': {
		riskLevel: 'read',
		description:
			'List the groups the API key user belongs to, including subgroups, oldest first',
	},
	'groups.get': {
		riskLevel: 'read',
		description:
			'Read one group by numeric id, url key, or handle, with its settings and member counts',
	},
	'discussions.list': {
		riskLevel: 'read',
		description:
			'List discussions in one group, filtered by open or closed status, ordered by latest activity',
	},
	'discussions.get': {
		riskLevel: 'read',
		description:
			'Read one discussion by numeric id or url key, with its author and thread record',
	},
	'discussions.create': {
		riskLevel: 'write',
		description:
			'Start a discussion in a group, optionally notifying members or inviting email recipients',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Post a comment on a discussion, in markdown or html',
	},
	'threads.list': {
		riskLevel: 'read',
		description:
			'List the threads the key user can see, ordered by latest activity, across all groups',
	},
	'threads.items': {
		riskLevel: 'read',
		description:
			'Read one thread timeline in sequence order: comments, polls, votes, and outcomes as one event stream',
	},
	'threads.markdown': {
		riskLevel: 'read',
		description:
			'Export one thread as a single markdown document; needs export permission on the thread',
	},
	'polls.list': {
		riskLevel: 'read',
		description:
			'List polls in one group, filtered by active or closed status, newest first, with current outcomes',
	},
	'polls.get': {
		riskLevel: 'read',
		description:
			'Read one poll by numeric id or url key, with vote counts and its options',
	},
	'polls.create': {
		riskLevel: 'write',
		description:
			'Create a poll in a group or on a discussion: proposal, poll, count, score, ranked_choice, meeting, or dot_vote',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof loomioEndpointsNested>;

export type BaseLoomioPlugin<T extends LoomioPluginOptions> = CorsairPlugin<
	'loomio',
	typeof LoomioSchema,
	typeof loomioEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalLoomioPlugin = BaseLoomioPlugin<LoomioPluginOptions>;

export type ExternalLoomioPlugin<T extends LoomioPluginOptions> =
	BaseLoomioPlugin<T>;

export function loomio<const T extends LoomioPluginOptions>(
	incomingOptions: LoomioPluginOptions & T = {} as LoomioPluginOptions & T,
): ExternalLoomioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'loomio',
		schema: LoomioSchema,
		options: options,
		hooks: options.hooks,
		endpoints: loomioEndpointsNested,
		webhooks: {},
		endpointMeta: loomioEndpointMeta,
		endpointSchemas: loomioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LoomioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('loomio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLoomioPlugin;
}

export { LOOMIO_API_BASE, LoomioAPIError } from './client';

export type {
	CommentsCreateInput,
	CommentsCreateResponse,
	DiscussionsCreateInput,
	DiscussionsCreateResponse,
	DiscussionsGetInput,
	DiscussionsGetResponse,
	DiscussionsListInput,
	DiscussionsListResponse,
	GroupsGetInput,
	GroupsGetResponse,
	GroupsListInput,
	GroupsListResponse,
	LoomioComment,
	LoomioDiscussion,
	LoomioEndpointInputs,
	LoomioEndpointOutputs,
	LoomioGroup,
	LoomioMeta,
	LoomioPoll,
	LoomioTopic,
	LoomioTopicItem,
	PollsCreateInput,
	PollsCreateResponse,
	PollsGetInput,
	PollsGetResponse,
	PollsListInput,
	PollsListResponse,
	ThreadsItemsInput,
	ThreadsItemsResponse,
	ThreadsListInput,
	ThreadsListResponse,
	ThreadsMarkdownInput,
	ThreadsMarkdownResponse,
} from './endpoints/types';
