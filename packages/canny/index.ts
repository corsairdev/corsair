import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Boards, Comments, Posts, Votes } from './endpoints';
import type {
	CannyEndpointInputs,
	CannyEndpointOutputs,
} from './endpoints/types';
import {
	CannyEndpointInputSchemas,
	CannyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CannySchema } from './schema';
import { CommentWebhooks, PostWebhooks, VoteWebhooks } from './webhooks';
import { matchCannyTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CannyCommentCreatedEvent,
	CannyPostCreatedEvent,
	CannyPostStatusChangedEvent,
	CannyVoteCreatedEvent,
	CannyWebhookOutputs,
} from './webhooks/types';
import {
	CannyCommentCreatedEventSchema,
	CannyPostCreatedEventSchema,
	CannyPostStatusChangedEventSchema,
	CannyVoteCreatedEventSchema,
} from './webhooks/types';

export type CannyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCannyPlugin['hooks'];
	webhookHooks?: InternalCannyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cannyEndpointsNested>;
};

export type CannyContext = CorsairPluginContext<
	typeof CannySchema,
	CannyPluginOptions
>;

export type CannyKeyBuilderContext = KeyBuilderContext<CannyPluginOptions>;

export type CannyBoundEndpoints = BindEndpoints<typeof cannyEndpointsNested>;

type CannyEndpoint<K extends keyof CannyEndpointOutputs> = CorsairEndpoint<
	CannyContext,
	CannyEndpointInputs[K],
	CannyEndpointOutputs[K]
>;

export type CannyEndpoints = {
	boardsList: CannyEndpoint<'boardsList'>;
	boardsRetrieve: CannyEndpoint<'boardsRetrieve'>;
	postsList: CannyEndpoint<'postsList'>;
	postsRetrieve: CannyEndpoint<'postsRetrieve'>;
	postsCreate: CannyEndpoint<'postsCreate'>;
	postsChangeStatus: CannyEndpoint<'postsChangeStatus'>;
	postsDelete: CannyEndpoint<'postsDelete'>;
	commentsList: CannyEndpoint<'commentsList'>;
	commentsCreate: CannyEndpoint<'commentsCreate'>;
	commentsDelete: CannyEndpoint<'commentsDelete'>;
	votesList: CannyEndpoint<'votesList'>;
	votesCreate: CannyEndpoint<'votesCreate'>;
	votesDelete: CannyEndpoint<'votesDelete'>;
};

type CannyWebhook<K extends keyof CannyWebhookOutputs, TEvent> = CorsairWebhook<
	CannyContext,
	TEvent,
	CannyWebhookOutputs[K]
>;

export type CannyWebhooks = {
	postCreated: CannyWebhook<'postCreated', CannyPostCreatedEvent>;
	postStatusChanged: CannyWebhook<
		'postStatusChanged',
		CannyPostStatusChangedEvent
	>;
	commentCreated: CannyWebhook<'commentCreated', CannyCommentCreatedEvent>;
	voteCreated: CannyWebhook<'voteCreated', CannyVoteCreatedEvent>;
};

export type CannyBoundWebhooks = BindWebhooks<CannyWebhooks>;

const cannyEndpointsNested = {
	boards: {
		list: Boards.list,
		retrieve: Boards.retrieve,
	},
	posts: {
		list: Posts.list,
		retrieve: Posts.retrieve,
		create: Posts.create,
		changeStatus: Posts.changeStatus,
		delete: Posts.delete,
	},
	comments: {
		list: Comments.list,
		create: Comments.create,
		delete: Comments.delete,
	},
	votes: {
		list: Votes.list,
		create: Votes.create,
		delete: Votes.delete,
	},
} as const;

const cannyWebhooksNested = {
	posts: {
		created: PostWebhooks.created,
		statusChanged: PostWebhooks.statusChanged,
	},
	comments: {
		created: CommentWebhooks.created,
	},
	votes: {
		created: VoteWebhooks.created,
	},
} as const;

export const cannyEndpointSchemas = {
	'boards.list': {
		input: CannyEndpointInputSchemas.boardsList,
		output: CannyEndpointOutputSchemas.boardsList,
	},
	'boards.retrieve': {
		input: CannyEndpointInputSchemas.boardsRetrieve,
		output: CannyEndpointOutputSchemas.boardsRetrieve,
	},
	'posts.list': {
		input: CannyEndpointInputSchemas.postsList,
		output: CannyEndpointOutputSchemas.postsList,
	},
	'posts.retrieve': {
		input: CannyEndpointInputSchemas.postsRetrieve,
		output: CannyEndpointOutputSchemas.postsRetrieve,
	},
	'posts.create': {
		input: CannyEndpointInputSchemas.postsCreate,
		output: CannyEndpointOutputSchemas.postsCreate,
	},
	'posts.changeStatus': {
		input: CannyEndpointInputSchemas.postsChangeStatus,
		output: CannyEndpointOutputSchemas.postsChangeStatus,
	},
	'posts.delete': {
		input: CannyEndpointInputSchemas.postsDelete,
		output: CannyEndpointOutputSchemas.postsDelete,
	},
	'comments.list': {
		input: CannyEndpointInputSchemas.commentsList,
		output: CannyEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: CannyEndpointInputSchemas.commentsCreate,
		output: CannyEndpointOutputSchemas.commentsCreate,
	},
	'comments.delete': {
		input: CannyEndpointInputSchemas.commentsDelete,
		output: CannyEndpointOutputSchemas.commentsDelete,
	},
	'votes.list': {
		input: CannyEndpointInputSchemas.votesList,
		output: CannyEndpointOutputSchemas.votesList,
	},
	'votes.create': {
		input: CannyEndpointInputSchemas.votesCreate,
		output: CannyEndpointOutputSchemas.votesCreate,
	},
	'votes.delete': {
		input: CannyEndpointInputSchemas.votesDelete,
		output: CannyEndpointOutputSchemas.votesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof cannyEndpointsNested>;

const cannyWebhookSchemas = {
	'posts.created': {
		description: 'Occurs when a new post is created in Canny',
		payload: CannyPostCreatedEventSchema,
		response: CannyPostCreatedEventSchema,
	},
	'posts.statusChanged': {
		description: "Occurs when a post's status is changed in Canny",
		payload: CannyPostStatusChangedEventSchema,
		response: CannyPostStatusChangedEventSchema,
	},
	'comments.created': {
		description: 'Occurs when a new comment is created in Canny',
		payload: CannyCommentCreatedEventSchema,
		response: CannyCommentCreatedEventSchema,
	},
	'votes.created': {
		description: 'Occurs when a new vote is cast in Canny',
		payload: CannyVoteCreatedEventSchema,
		response: CannyVoteCreatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof cannyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cannyEndpointMeta = {
	'boards.list': {
		riskLevel: 'read',
		description: 'List all boards for your company in Canny',
	},
	'boards.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve details of an existing Canny board by ID',
	},
	'posts.list': {
		riskLevel: 'read',
		description: 'List posts in Canny with optional filtering and pagination',
	},
	'posts.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve details of an existing Canny post by ID',
	},
	'posts.create': {
		riskLevel: 'write',
		description: 'Create a new post in Canny',
	},
	'posts.changeStatus': {
		riskLevel: 'write',
		description: "Change an existing Canny post's status",
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post in Canny [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List comments in Canny with optional filtering and pagination',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a new comment on a Canny post',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment in Canny [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'votes.list': {
		riskLevel: 'read',
		description: 'List votes in Canny with optional filtering and pagination',
	},
	'votes.create': {
		riskLevel: 'write',
		description: 'Create a vote for a Canny post on behalf of a user',
	},
	'votes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a vote on a Canny post [DESTRUCTIVE · IRREVERSIBLE]',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cannyEndpointsNested>;

export const cannyAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCannyPlugin<T extends CannyPluginOptions> = CorsairPlugin<
	'canny',
	typeof CannySchema,
	typeof cannyEndpointsNested,
	typeof cannyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCannyPlugin = BaseCannyPlugin<CannyPluginOptions>;

export type ExternalCannyPlugin<T extends CannyPluginOptions> =
	BaseCannyPlugin<T>;

export function canny<const T extends CannyPluginOptions>(
	incomingOptions: CannyPluginOptions & T = {} as CannyPluginOptions & T,
): ExternalCannyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'canny',
		authConfig: cannyAuthConfig,
		schema: CannySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cannyEndpointsNested,
		webhooks: cannyWebhooksNested,
		endpointMeta: cannyEndpointMeta,
		endpointSchemas: cannyEndpointSchemas,
		webhookSchemas: cannyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'canny-signature' in headers ||
				'x-canny-signature' in headers ||
				'canny-nonce' in headers
			);
		},
		pluginTenantWebhookMatcher: matchCannyTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CannyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook' && options.key) {
				return options.key;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (res) return res;
				const apiKey = await ctx.keys.get_api_key();
				if (apiKey) return apiKey;
				return '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('canny', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('canny', 'api_key');
		},
	} satisfies InternalCannyPlugin;
}

export type {
	Board,
	BoardsListInput,
	BoardsListResponse,
	BoardsRetrieveInput,
	BoardsRetrieveResponse,
	CannyBoardModel,
	CannyCategory,
	CannyCommentModel,
	CannyEndpointInputs,
	CannyEndpointOutputs,
	CannyPostModel,
	CannyTag,
	CannyUser,
	CannyVoteModel,
	Category,
	Comment,
	CommentsCreateInput,
	CommentsCreateResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsListInput,
	CommentsListResponse,
	Post,
	PostsChangeStatusInput,
	PostsChangeStatusResponse,
	PostsCreateInput,
	PostsCreateResponse,
	PostsDeleteInput,
	PostsDeleteResponse,
	PostsListInput,
	PostsListResponse,
	PostsRetrieveInput,
	PostsRetrieveResponse,
	Tag,
	User,
	Vote,
	VotesCreateInput,
	VotesCreateResponse,
	VotesDeleteInput,
	VotesDeleteResponse,
	VotesListInput,
	VotesListResponse,
} from './endpoints/types';

export type {
	CannyCommentCreatedEvent,
	CannyEventMap,
	CannyEventName,
	CannyPostCreatedEvent,
	CannyPostStatusChangedEvent,
	CannyVoteCreatedEvent,
	CannyWebhookEvent,
	CannyWebhookOutputs,
	CannyWebhookPayload,
} from './webhooks/types';
export {
	createCannyEventMatch,
	createCannyMatch,
	verifyCannyWebhookSignature,
} from './webhooks/types';
