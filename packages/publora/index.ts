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
import {
	completeMedia,
	createMediaUpload,
	createPost,
	createWebhook,
	deleteMedia,
	deletePost,
	deleteWebhook,
	getContext,
	getPost,
	listAccounts,
	listPosts,
	listWebhooks,
	updatePost,
	updateWebhook,
} from './endpoints/handlers';
import {
	analyticsPostStatistics,
	analyticsProfileStatistics,
	attachMedia,
	companyCancelApproval,
	companyCompleteMedia,
	companyCreateDraft,
	companyCreateWebhook,
	companyDeleteWebhook,
	companyGetApproval,
	companyGetPostGroup,
	companyGetWorkspaceContext,
	companyListConnections,
	companyListContexts,
	companyListMedia,
	companyListPlatforms,
	companyListWebhooks,
	companyRecover,
	companyRegenerateWebhookSecret,
	companyRemoveMedia,
	companyRequestApproval,
	companyReschedule,
	companyReserveMedia,
	companyRetryApprovalNotification,
	companySchedule,
	companyUnschedule,
	companyUpdateDraft,
	companyUpdateWebhook,
	getPlatformLimits,
	getPostLogs,
	linkedinAccountStatistics,
	linkedinAddReaction,
	linkedinCreateComment,
	linkedinDeleteComment,
	linkedinFollowers,
	linkedinMentionables,
	linkedinPostStatistics,
	linkedinProfileSummary,
	linkedinRemoveReaction,
	linkedinReshare,
	regenerateWebhookSecret,
	testConnection,
	uploadInstagramCover,
	uploadYoutubeThumbnail,
} from './endpoints/handlers-extra';
import type {
	PubloraEndpointInputs,
	PubloraEndpointOutputs,
} from './endpoints/types';
import {
	PubloraEndpointInputSchemas,
	PubloraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PubloraSchema } from './schema';
import { PostWebhooks } from './webhooks';
import type {
	PostDemotedEvent,
	PostFailedEvent,
	PostPublishedEvent,
	PostScheduledEvent,
	PubloraWebhookOutputs,
} from './webhooks/types';
import {
	isPubloraDelivery,
	PostDemotedEventSchema,
	PostFailedEventSchema,
	PostPublishedEventSchema,
	PostScheduledEventSchema,
} from './webhooks/types';

export type PubloraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Publora API key, sent as `x-publora-key`. */
	key?: string;
	/** Signing secret returned by `webhooks.create`, used to verify deliveries. */
	webhookSecret?: string;
	hooks?: InternalPubloraPlugin['hooks'];
	webhookHooks?: InternalPubloraPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof publoraEndpointsNested>;
};

export type PubloraContext = CorsairPluginContext<
	typeof PubloraSchema,
	PubloraPluginOptions
>;

export type PubloraKeyBuilderContext = KeyBuilderContext<PubloraPluginOptions>;

export type PubloraBoundEndpoints = BindEndpoints<
	typeof publoraEndpointsNested
>;

type PubloraEndpoint<K extends keyof PubloraEndpointOutputs> = CorsairEndpoint<
	PubloraContext,
	PubloraEndpointInputs[K],
	PubloraEndpointOutputs[K]
>;

export type PubloraEndpoints = {
	listAccounts: PubloraEndpoint<'listAccounts'>;
	getContext: PubloraEndpoint<'getContext'>;
	createPost: PubloraEndpoint<'createPost'>;
	getPost: PubloraEndpoint<'getPost'>;
	listPosts: PubloraEndpoint<'listPosts'>;
	updatePost: PubloraEndpoint<'updatePost'>;
	deletePost: PubloraEndpoint<'deletePost'>;
	createMediaUpload: PubloraEndpoint<'createMediaUpload'>;
	completeMedia: PubloraEndpoint<'completeMedia'>;
	deleteMedia: PubloraEndpoint<'deleteMedia'>;
	listWebhooks: PubloraEndpoint<'listWebhooks'>;
	createWebhook: PubloraEndpoint<'createWebhook'>;
	updateWebhook: PubloraEndpoint<'updateWebhook'>;
	deleteWebhook: PubloraEndpoint<'deleteWebhook'>;
	testConnection: PubloraEndpoint<'testConnection'>;
	getPlatformLimits: PubloraEndpoint<'getPlatformLimits'>;
	getPostLogs: PubloraEndpoint<'getPostLogs'>;
	attachMedia: PubloraEndpoint<'attachMedia'>;
	uploadInstagramCover: PubloraEndpoint<'uploadInstagramCover'>;
	uploadYoutubeThumbnail: PubloraEndpoint<'uploadYoutubeThumbnail'>;
	regenerateWebhookSecret: PubloraEndpoint<'regenerateWebhookSecret'>;
	analyticsPostStatistics: PubloraEndpoint<'analyticsPostStatistics'>;
	analyticsProfileStatistics: PubloraEndpoint<'analyticsProfileStatistics'>;
	linkedinPostStatistics: PubloraEndpoint<'linkedinPostStatistics'>;
	linkedinAccountStatistics: PubloraEndpoint<'linkedinAccountStatistics'>;
	linkedinProfileSummary: PubloraEndpoint<'linkedinProfileSummary'>;
	linkedinFollowers: PubloraEndpoint<'linkedinFollowers'>;
	linkedinMentionables: PubloraEndpoint<'linkedinMentionables'>;
	linkedinAddReaction: PubloraEndpoint<'linkedinAddReaction'>;
	linkedinRemoveReaction: PubloraEndpoint<'linkedinRemoveReaction'>;
	linkedinReshare: PubloraEndpoint<'linkedinReshare'>;
	linkedinCreateComment: PubloraEndpoint<'linkedinCreateComment'>;
	linkedinDeleteComment: PubloraEndpoint<'linkedinDeleteComment'>;
	companyListContexts: PubloraEndpoint<'companyListContexts'>;
	companyGetWorkspaceContext: PubloraEndpoint<'companyGetWorkspaceContext'>;
	companyListConnections: PubloraEndpoint<'companyListConnections'>;
	companyListPlatforms: PubloraEndpoint<'companyListPlatforms'>;
	companyCreateDraft: PubloraEndpoint<'companyCreateDraft'>;
	companyUpdateDraft: PubloraEndpoint<'companyUpdateDraft'>;
	companyGetPostGroup: PubloraEndpoint<'companyGetPostGroup'>;
	companySchedule: PubloraEndpoint<'companySchedule'>;
	companyReschedule: PubloraEndpoint<'companyReschedule'>;
	companyUnschedule: PubloraEndpoint<'companyUnschedule'>;
	companyRecover: PubloraEndpoint<'companyRecover'>;
	companyGetApproval: PubloraEndpoint<'companyGetApproval'>;
	companyRequestApproval: PubloraEndpoint<'companyRequestApproval'>;
	companyCancelApproval: PubloraEndpoint<'companyCancelApproval'>;
	companyRetryApprovalNotification: PubloraEndpoint<'companyRetryApprovalNotification'>;
	companyListMedia: PubloraEndpoint<'companyListMedia'>;
	companyReserveMedia: PubloraEndpoint<'companyReserveMedia'>;
	companyCompleteMedia: PubloraEndpoint<'companyCompleteMedia'>;
	companyRemoveMedia: PubloraEndpoint<'companyRemoveMedia'>;
	companyListWebhooks: PubloraEndpoint<'companyListWebhooks'>;
	companyCreateWebhook: PubloraEndpoint<'companyCreateWebhook'>;
	companyUpdateWebhook: PubloraEndpoint<'companyUpdateWebhook'>;
	companyDeleteWebhook: PubloraEndpoint<'companyDeleteWebhook'>;
	companyRegenerateWebhookSecret: PubloraEndpoint<'companyRegenerateWebhookSecret'>;
};

type PubloraWebhook<
	K extends keyof PubloraWebhookOutputs,
	TEvent,
> = CorsairWebhook<PubloraContext, TEvent, PubloraWebhookOutputs[K]>;

export type PubloraWebhooks = {
	published: PubloraWebhook<'published', PostPublishedEvent>;
	failed: PubloraWebhook<'failed', PostFailedEvent>;
	scheduled: PubloraWebhook<'scheduled', PostScheduledEvent>;
	demoted: PubloraWebhook<'demoted', PostDemotedEvent>;
};

export type PubloraBoundWebhooks = BindWebhooks<PubloraWebhooks>;

const publoraEndpointsNested = {
	accounts: {
		list: listAccounts,
		getContext,
		testConnection,
		getPlatformLimits,
	},
	posts: {
		create: createPost,
		get: getPost,
		list: listPosts,
		update: updatePost,
		delete: deletePost,
		getLogs: getPostLogs,
	},
	media: {
		createUpload: createMediaUpload,
		complete: completeMedia,
		delete: deleteMedia,
		attach: attachMedia,
		uploadInstagramCover,
		uploadYoutubeThumbnail,
	},
	webhooks: {
		list: listWebhooks,
		create: createWebhook,
		update: updateWebhook,
		delete: deleteWebhook,
		regenerateSecret: regenerateWebhookSecret,
	},
	analytics: {
		postStatistics: analyticsPostStatistics,
		profileStatistics: analyticsProfileStatistics,
	},
	linkedin: {
		postStatistics: linkedinPostStatistics,
		accountStatistics: linkedinAccountStatistics,
		profileSummary: linkedinProfileSummary,
		followers: linkedinFollowers,
		mentionables: linkedinMentionables,
		addReaction: linkedinAddReaction,
		removeReaction: linkedinRemoveReaction,
		reshare: linkedinReshare,
		createComment: linkedinCreateComment,
		deleteComment: linkedinDeleteComment,
	},
	company: {
		listContexts: companyListContexts,
		getWorkspaceContext: companyGetWorkspaceContext,
		listConnections: companyListConnections,
		listPlatforms: companyListPlatforms,
		posts: {
			createDraft: companyCreateDraft,
			updateDraft: companyUpdateDraft,
			get: companyGetPostGroup,
			schedule: companySchedule,
			reschedule: companyReschedule,
			unschedule: companyUnschedule,
			recover: companyRecover,
			getApproval: companyGetApproval,
			requestApproval: companyRequestApproval,
			cancelApproval: companyCancelApproval,
			retryApprovalNotification: companyRetryApprovalNotification,
			listMedia: companyListMedia,
			reserveMedia: companyReserveMedia,
			completeMedia: companyCompleteMedia,
			removeMedia: companyRemoveMedia,
		},
		webhooks: {
			list: companyListWebhooks,
			create: companyCreateWebhook,
			update: companyUpdateWebhook,
			delete: companyDeleteWebhook,
			regenerateSecret: companyRegenerateWebhookSecret,
		},
	},
} as const;

const publoraWebhooksNested = {
	posts: {
		published: PostWebhooks.published,
		failed: PostWebhooks.failed,
		scheduled: PostWebhooks.scheduled,
		demoted: PostWebhooks.demoted,
	},
} as const;

export const publoraEndpointSchemas = {
	'accounts.list': {
		input: PubloraEndpointInputSchemas.listAccounts,
		output: PubloraEndpointOutputSchemas.listAccounts,
	},
	'accounts.getContext': {
		input: PubloraEndpointInputSchemas.getContext,
		output: PubloraEndpointOutputSchemas.getContext,
	},
	'posts.create': {
		input: PubloraEndpointInputSchemas.createPost,
		output: PubloraEndpointOutputSchemas.createPost,
	},
	'posts.get': {
		input: PubloraEndpointInputSchemas.getPost,
		output: PubloraEndpointOutputSchemas.getPost,
	},
	'posts.list': {
		input: PubloraEndpointInputSchemas.listPosts,
		output: PubloraEndpointOutputSchemas.listPosts,
	},
	'posts.update': {
		input: PubloraEndpointInputSchemas.updatePost,
		output: PubloraEndpointOutputSchemas.updatePost,
	},
	'posts.delete': {
		input: PubloraEndpointInputSchemas.deletePost,
		output: PubloraEndpointOutputSchemas.deletePost,
	},
	'media.createUpload': {
		input: PubloraEndpointInputSchemas.createMediaUpload,
		output: PubloraEndpointOutputSchemas.createMediaUpload,
	},
	'media.complete': {
		input: PubloraEndpointInputSchemas.completeMedia,
		output: PubloraEndpointOutputSchemas.completeMedia,
	},
	'media.delete': {
		input: PubloraEndpointInputSchemas.deleteMedia,
		output: PubloraEndpointOutputSchemas.deleteMedia,
	},
	'webhooks.list': {
		input: PubloraEndpointInputSchemas.listWebhooks,
		output: PubloraEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: PubloraEndpointInputSchemas.createWebhook,
		output: PubloraEndpointOutputSchemas.createWebhook,
	},
	'webhooks.update': {
		input: PubloraEndpointInputSchemas.updateWebhook,
		output: PubloraEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.delete': {
		input: PubloraEndpointInputSchemas.deleteWebhook,
		output: PubloraEndpointOutputSchemas.deleteWebhook,
	},
	'accounts.testConnection': {
		input: PubloraEndpointInputSchemas.testConnection,
		output: PubloraEndpointOutputSchemas.testConnection,
	},
	'accounts.getPlatformLimits': {
		input: PubloraEndpointInputSchemas.getPlatformLimits,
		output: PubloraEndpointOutputSchemas.getPlatformLimits,
	},
	'posts.getLogs': {
		input: PubloraEndpointInputSchemas.getPostLogs,
		output: PubloraEndpointOutputSchemas.getPostLogs,
	},
	'media.attach': {
		input: PubloraEndpointInputSchemas.attachMedia,
		output: PubloraEndpointOutputSchemas.attachMedia,
	},
	'media.uploadInstagramCover': {
		input: PubloraEndpointInputSchemas.uploadInstagramCover,
		output: PubloraEndpointOutputSchemas.uploadInstagramCover,
	},
	'media.uploadYoutubeThumbnail': {
		input: PubloraEndpointInputSchemas.uploadYoutubeThumbnail,
		output: PubloraEndpointOutputSchemas.uploadYoutubeThumbnail,
	},
	'webhooks.regenerateSecret': {
		input: PubloraEndpointInputSchemas.regenerateWebhookSecret,
		output: PubloraEndpointOutputSchemas.regenerateWebhookSecret,
	},
	'analytics.postStatistics': {
		input: PubloraEndpointInputSchemas.analyticsPostStatistics,
		output: PubloraEndpointOutputSchemas.analyticsPostStatistics,
	},
	'analytics.profileStatistics': {
		input: PubloraEndpointInputSchemas.analyticsProfileStatistics,
		output: PubloraEndpointOutputSchemas.analyticsProfileStatistics,
	},
	'linkedin.postStatistics': {
		input: PubloraEndpointInputSchemas.linkedinPostStatistics,
		output: PubloraEndpointOutputSchemas.linkedinPostStatistics,
	},
	'linkedin.accountStatistics': {
		input: PubloraEndpointInputSchemas.linkedinAccountStatistics,
		output: PubloraEndpointOutputSchemas.linkedinAccountStatistics,
	},
	'linkedin.profileSummary': {
		input: PubloraEndpointInputSchemas.linkedinProfileSummary,
		output: PubloraEndpointOutputSchemas.linkedinProfileSummary,
	},
	'linkedin.followers': {
		input: PubloraEndpointInputSchemas.linkedinFollowers,
		output: PubloraEndpointOutputSchemas.linkedinFollowers,
	},
	'linkedin.mentionables': {
		input: PubloraEndpointInputSchemas.linkedinMentionables,
		output: PubloraEndpointOutputSchemas.linkedinMentionables,
	},
	'linkedin.addReaction': {
		input: PubloraEndpointInputSchemas.linkedinAddReaction,
		output: PubloraEndpointOutputSchemas.linkedinAddReaction,
	},
	'linkedin.removeReaction': {
		input: PubloraEndpointInputSchemas.linkedinRemoveReaction,
		output: PubloraEndpointOutputSchemas.linkedinRemoveReaction,
	},
	'linkedin.reshare': {
		input: PubloraEndpointInputSchemas.linkedinReshare,
		output: PubloraEndpointOutputSchemas.linkedinReshare,
	},
	'linkedin.createComment': {
		input: PubloraEndpointInputSchemas.linkedinCreateComment,
		output: PubloraEndpointOutputSchemas.linkedinCreateComment,
	},
	'linkedin.deleteComment': {
		input: PubloraEndpointInputSchemas.linkedinDeleteComment,
		output: PubloraEndpointOutputSchemas.linkedinDeleteComment,
	},
	'company.listContexts': {
		input: PubloraEndpointInputSchemas.companyListContexts,
		output: PubloraEndpointOutputSchemas.companyListContexts,
	},
	'company.getWorkspaceContext': {
		input: PubloraEndpointInputSchemas.companyGetWorkspaceContext,
		output: PubloraEndpointOutputSchemas.companyGetWorkspaceContext,
	},
	'company.listConnections': {
		input: PubloraEndpointInputSchemas.companyListConnections,
		output: PubloraEndpointOutputSchemas.companyListConnections,
	},
	'company.listPlatforms': {
		input: PubloraEndpointInputSchemas.companyListPlatforms,
		output: PubloraEndpointOutputSchemas.companyListPlatforms,
	},
	'company.posts.createDraft': {
		input: PubloraEndpointInputSchemas.companyCreateDraft,
		output: PubloraEndpointOutputSchemas.companyCreateDraft,
	},
	'company.posts.updateDraft': {
		input: PubloraEndpointInputSchemas.companyUpdateDraft,
		output: PubloraEndpointOutputSchemas.companyUpdateDraft,
	},
	'company.posts.get': {
		input: PubloraEndpointInputSchemas.companyGetPostGroup,
		output: PubloraEndpointOutputSchemas.companyGetPostGroup,
	},
	'company.posts.schedule': {
		input: PubloraEndpointInputSchemas.companySchedule,
		output: PubloraEndpointOutputSchemas.companySchedule,
	},
	'company.posts.reschedule': {
		input: PubloraEndpointInputSchemas.companyReschedule,
		output: PubloraEndpointOutputSchemas.companyReschedule,
	},
	'company.posts.unschedule': {
		input: PubloraEndpointInputSchemas.companyUnschedule,
		output: PubloraEndpointOutputSchemas.companyUnschedule,
	},
	'company.posts.recover': {
		input: PubloraEndpointInputSchemas.companyRecover,
		output: PubloraEndpointOutputSchemas.companyRecover,
	},
	'company.posts.getApproval': {
		input: PubloraEndpointInputSchemas.companyGetApproval,
		output: PubloraEndpointOutputSchemas.companyGetApproval,
	},
	'company.posts.requestApproval': {
		input: PubloraEndpointInputSchemas.companyRequestApproval,
		output: PubloraEndpointOutputSchemas.companyRequestApproval,
	},
	'company.posts.cancelApproval': {
		input: PubloraEndpointInputSchemas.companyCancelApproval,
		output: PubloraEndpointOutputSchemas.companyCancelApproval,
	},
	'company.posts.retryApprovalNotification': {
		input: PubloraEndpointInputSchemas.companyRetryApprovalNotification,
		output: PubloraEndpointOutputSchemas.companyRetryApprovalNotification,
	},
	'company.posts.listMedia': {
		input: PubloraEndpointInputSchemas.companyListMedia,
		output: PubloraEndpointOutputSchemas.companyListMedia,
	},
	'company.posts.reserveMedia': {
		input: PubloraEndpointInputSchemas.companyReserveMedia,
		output: PubloraEndpointOutputSchemas.companyReserveMedia,
	},
	'company.posts.completeMedia': {
		input: PubloraEndpointInputSchemas.companyCompleteMedia,
		output: PubloraEndpointOutputSchemas.companyCompleteMedia,
	},
	'company.posts.removeMedia': {
		input: PubloraEndpointInputSchemas.companyRemoveMedia,
		output: PubloraEndpointOutputSchemas.companyRemoveMedia,
	},
	'company.webhooks.list': {
		input: PubloraEndpointInputSchemas.companyListWebhooks,
		output: PubloraEndpointOutputSchemas.companyListWebhooks,
	},
	'company.webhooks.create': {
		input: PubloraEndpointInputSchemas.companyCreateWebhook,
		output: PubloraEndpointOutputSchemas.companyCreateWebhook,
	},
	'company.webhooks.update': {
		input: PubloraEndpointInputSchemas.companyUpdateWebhook,
		output: PubloraEndpointOutputSchemas.companyUpdateWebhook,
	},
	'company.webhooks.delete': {
		input: PubloraEndpointInputSchemas.companyDeleteWebhook,
		output: PubloraEndpointOutputSchemas.companyDeleteWebhook,
	},
	'company.webhooks.regenerateSecret': {
		input: PubloraEndpointInputSchemas.companyRegenerateWebhookSecret,
		output: PubloraEndpointOutputSchemas.companyRegenerateWebhookSecret,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof publoraEndpointsNested
>;

export const publoraWebhookSchemas = {
	'posts.published': {
		description: 'A post went live on one network (one event per network copy)',
		payload: PostPublishedEventSchema,
		response: PostPublishedEventSchema,
	},
	'posts.failed': {
		description: 'A post could not be published on one network',
		payload: PostFailedEventSchema,
		response: PostFailedEventSchema,
	},
	'posts.scheduled': {
		description: 'A post was given a publish time',
		payload: PostScheduledEventSchema,
		response: PostScheduledEventSchema,
	},
	'posts.demoted': {
		description: 'A scheduled post went back to draft',
		payload: PostDemotedEventSchema,
		response: PostDemotedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof publoraWebhooksNested>;

export const publoraEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List connected social accounts (LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook Pages, Bluesky, Mastodon, Telegram) with connection and token status. Their platformId values are the targets for posts.create.',
	},
	'accounts.getContext': {
		riskLevel: 'read',
		description:
			"The plan, features, monthly and scheduled post quotas, latest allowed schedule date and allowed networks of the key's account. Check it before a batch of posts.",
	},
	'posts.create': {
		riskLevel: 'destructive',
		description:
			'Create one post for one or more connected accounts, with text, media URLs, per-network settings and first comments. Without scheduledTime or publishNow it is saved as a draft; with scheduledTime it is scheduled; publishNow publishes it right away and it cannot be recalled once live. An idempotencyKey makes a retry return the original post.',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			"Get one post group with its status, publish time, settings, attached media and each network's delivery state, including the live post id and link once published.",
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			'List posts, newest first, filtered by status, network and scheduled date. Page with page and limit; pagination.hasNextPage says whether another page exists.',
	},
	'posts.update': {
		riskLevel: 'destructive',
		description:
			'Change a draft or scheduled post: text, targets (the list is replaced), publish time, status, settings, first comments or extra media. publishNow publishes it immediately.',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a post group with all its network copies and media. Content already published on a network stays live.',
	},
	'media.createUpload': {
		riskLevel: 'write',
		description:
			'Get a pre-signed URL (valid for an hour) to PUT an image, video or PDF to, attached to a draft or scheduled post group. Use this for files that are not at a public URL.',
	},
	'media.complete': {
		riskLevel: 'write',
		description:
			'Check an uploaded file right away instead of when the post is scheduled. Optional.',
	},
	'media.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove an uploaded file from its post group. A scheduled post goes back to draft.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook subscriptions (signing secrets are not returned).',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe an HTTPS URL to post.scheduled, post.published, post.failed and post.demoted events (up to 10 per account; needs a paid plan). The reply is the only time the signing secret is shown.',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a subscription's name, URL or events, or pause and resume it.",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook subscription.',
	},
	'accounts.testConnection': {
		riskLevel: 'read',
		description:
			'Check that one connected account still works: token status, granted permissions and the last error, if any.',
	},
	'accounts.getPlatformLimits': {
		riskLevel: 'read',
		description:
			'Live per-network limits Publora checks before scheduling (characters, images, videos, documents, GIFs, thumbnails). Use them to validate a post before sending it.',
	},
	'posts.getLogs': {
		riskLevel: 'read',
		description:
			'Publishing log of a post group from the last 90 days, oldest first (up to 100 events): scheduled, processing, attempts, successes, failures and retries per network.',
	},
	'media.attach': {
		riskLevel: 'write',
		description:
			'Attach one image or video to a draft or scheduled post by reference (an HTTPS download URL and a stable file id). Publora downloads it right away. A scheduled post goes back to draft and keeps its time.',
	},
	'media.uploadInstagramCover': {
		riskLevel: 'write',
		description:
			'Upload a cover image for an Instagram Reel (stored as JPEG). Set the returned URL as platformSettings.instagram.coverUrl with posts.update.',
	},
	'media.uploadYoutubeThumbnail': {
		riskLevel: 'write',
		description:
			'Upload a custom YouTube thumbnail (JPEG or PNG, 2 MB max, at least 640x360) for a draft or scheduled post. Attach the returned mediaId as platformSettings.youtube.thumbnail with posts.update.',
	},
	'webhooks.regenerateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Issue a new signing secret for a webhook subscription. The old secret stops working at once, so deliveries fail verification until the receiver has the new one.',
	},
	'analytics.postStatistics': {
		riskLevel: 'read',
		description:
			'Engagement counters (reactions, comments, reposts, quotes, saves and more) for up to 50 published Mastodon or Bluesky posts. Cached for about 2 hours; needs a plan with analytics.',
	},
	'analytics.profileStatistics': {
		riskLevel: 'read',
		description:
			'Followers, following and post count of one connected Mastodon or Bluesky account. Cached for about 2 hours; needs a plan with analytics.',
	},
	'linkedin.postStatistics': {
		riskLevel: 'read',
		description:
			'Analytics for one LinkedIn post: impressions, members reached, reactions, comments and reshares. queryTypes "ALL" returns all five. Cached for 2 hours.',
	},
	'linkedin.accountStatistics': {
		riskLevel: 'read',
		description:
			'Totals or daily figures across all published LinkedIn posts of one account, optionally for a date range.',
	},
	'linkedin.profileSummary': {
		riskLevel: 'read',
		description:
			'LinkedIn profile summary: follower total and growth, plus aggregated post impressions, reactions, comments, reshares and reach.',
	},
	'linkedin.followers': {
		riskLevel: 'read',
		description:
			'LinkedIn follower count (lifetime) or daily follower growth for a date range.',
	},
	'linkedin.mentionables': {
		riskLevel: 'read',
		description:
			'LinkedIn members you can @mention, collected from comments and reactions on connected company pages, each with a ready mention token. Paid plans only.',
	},
	'linkedin.addReaction': {
		riskLevel: 'write',
		description:
			'React to a LinkedIn post as the connected account (LIKE, PRAISE, EMPATHY, INTEREST, APPRECIATION or ENTERTAINMENT). The reaction is public.',
	},
	'linkedin.removeReaction': {
		riskLevel: 'write',
		description:
			"Remove the connected account's reaction from a LinkedIn post.",
	},
	'linkedin.reshare': {
		riskLevel: 'destructive',
		description:
			"Reshare a LinkedIn post to the connected account's feed (member or company page), with optional commentary. It is published right away.",
	},
	'linkedin.createComment': {
		riskLevel: 'destructive',
		description:
			'Publish a comment, or a reply to a comment, on a LinkedIn post as the connected account. Supports @mentions and an image.',
	},
	'linkedin.deleteComment': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment from a LinkedIn post.',
	},
	'company.listContexts': {
		riskLevel: 'read',
		description:
			"Agency API start point: the Accounts and Workspaces the key's owner can act in, with each Workspace's capabilities. Pass a workspace id to the other company operations.",
	},
	'company.getWorkspaceContext': {
		riskLevel: 'read',
		description:
			'Context of one Agency Account and Workspace, to refresh its capabilities before a command.',
	},
	'company.listConnections': {
		riskLevel: 'read',
		description:
			'Publishing channels of a Workspace. Their channel keys (<platform>-<platformId>) are the platforms of company drafts. A channel with status reconnect_required must be reconnected before scheduling.',
	},
	'company.listPlatforms': {
		riskLevel: 'read',
		description:
			'Publishable networks with the text, media and platformSettings limits of Agency drafts.',
	},
	'company.posts.createDraft': {
		riskLevel: 'write',
		description:
			'Create an Agency draft in a Workspace (text, channels, per-channel text, settings, first comment). It never schedules; use company.posts.schedule.',
	},
	'company.posts.updateDraft': {
		riskLevel: 'write',
		description:
			'Change an Agency draft. Omitted fields keep their value. Editing makes a requested client review outdated.',
	},
	'company.posts.get': {
		riskLevel: 'read',
		description:
			'An Agency post group and its channel posts: status, errors, and postedId and permalink once published. includeApproval adds the client review.',
	},
	'company.posts.schedule': {
		riskLevel: 'destructive',
		description:
			'Schedule an Agency draft for a UTC time; the current time publishes it now. Channels must be usable, media ready and, while a client review is requested, approved.',
	},
	'company.posts.reschedule': {
		riskLevel: 'destructive',
		description:
			'Move a scheduled Agency post to another time, before publishing starts.',
	},
	'company.posts.unschedule': {
		riskLevel: 'write',
		description:
			'Return a scheduled Agency post to draft, before publishing starts. Allowed while billing is required.',
	},
	'company.posts.recover': {
		riskLevel: 'write',
		description:
			'Copy the failed channels of a failed or partly published post group into a new draft, with its media. The source is not changed.',
	},
	'company.posts.getApproval': {
		riskLevel: 'read',
		description:
			'The client review of an Agency post group: status, comment, private review URL, expiry and decision.',
	},
	'company.posts.requestApproval': {
		riskLevel: 'write',
		description:
			'Start a client review round for a draft and get a private review URL. Publora does not send the URL; deliver it yourself. Editing the draft afterwards makes the round outdated.',
	},
	'company.posts.cancelApproval': {
		riskLevel: 'write',
		description:
			"Remove the client review from a draft so it can be scheduled without the client's approval. Use only when the user asks.",
	},
	'company.posts.retryApprovalNotification': {
		riskLevel: 'destructive',
		description:
			'Send the review decision email to the user who requested the review again, when notificationStatus is failed.',
	},
	'company.posts.listMedia': {
		riskLevel: 'read',
		description:
			'Media and the selected YouTube thumbnail of an Agency post group; url is set only for ready files.',
	},
	'company.posts.reserveMedia': {
		riskLevel: 'write',
		description:
			'Reserve an upload for an Agency draft (or a YouTube thumbnail). PUT the exact bytes to uploadUrl with every uploadHeaders entry, then call company.posts.completeMedia.',
	},
	'company.posts.completeMedia': {
		riskLevel: 'write',
		description:
			'Verify an uploaded Agency media file after the PUT. On 409 AGENCY_CORE_MEDIA_UPLOAD_PENDING retry after Retry-After.',
	},
	'company.posts.removeMedia': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Detach a file from an Agency draft; storage deletes it after deletionAfter. A requested client review becomes outdated.',
	},
	'company.webhooks.list': {
		riskLevel: 'read',
		description:
			'Webhook subscriptions of a Workspace (post.published, post.failed). Workspace settings managers only.',
	},
	'company.webhooks.create': {
		riskLevel: 'write',
		description:
			"Subscribe a URL to a Workspace's post.published and post.failed events (up to 10). The reply is the only time the signing secret is shown.",
	},
	'company.webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a Workspace subscription's name, URL or events, or turn it on or off.",
	},
	'company.webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Workspace webhook subscription.',
	},
	'company.webhooks.regenerateSecret': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Issue a new signing secret for a Workspace subscription; the old one stops working at once.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof publoraEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// Publora deliveries carry no account id, so webhooks are not routed per
// tenant; each Corsair instance verifies them with its own signing secret.
export const publoraAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BasePubloraPlugin<T extends PubloraPluginOptions> = CorsairPlugin<
	'publora',
	typeof PubloraSchema,
	typeof publoraEndpointsNested,
	typeof publoraWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalPubloraPlugin = BasePubloraPlugin<PubloraPluginOptions>;

export type ExternalPubloraPlugin<T extends PubloraPluginOptions> =
	BasePubloraPlugin<T>;

/**
 * Builds the Publora plugin.
 *
 * Auth is an API key (`x-publora-key`), created on the API page of the
 * Publora dashboard. Webhook deliveries are verified with the secret that
 * `webhooks.create` returns.
 */
export function publora<const T extends PubloraPluginOptions>(
	incomingOptions: PubloraPluginOptions & T = {} as PubloraPluginOptions & T,
): ExternalPubloraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'publora',
		authConfig: publoraAuthConfig,
		schema: PubloraSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: publoraEndpointsNested,
		webhooks: publoraWebhooksNested,
		endpointMeta: publoraEndpointMeta,
		endpointSchemas: publoraEndpointSchemas,
		webhookSchemas: publoraWebhookSchemas,
		pluginWebhookMatcher: isPubloraDelivery,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: PubloraKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await ctx.keys.get_webhook_signature();
				// An empty key makes verification answer 401 instead of throwing.
				return secret ?? '';
			}
			if (source !== 'endpoint') {
				throw new AuthMissingError('publora', 'api_key');
			}
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('publora', 'api_key');
			return key;
		},
	} satisfies InternalPubloraPlugin;
}

export type {
	PubloraEndpointInputs,
	PubloraEndpointOutputs,
} from './endpoints/types';
export type {
	PubloraAccount,
	PubloraPlatformPost,
	PubloraPost,
} from './schema/database';
export type {
	PostDemotedEvent,
	PostFailedEvent,
	PostPublishedEvent,
	PostScheduledEvent,
	PubloraWebhookOutputs,
} from './webhooks/types';
