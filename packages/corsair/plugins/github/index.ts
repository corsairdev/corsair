import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { GithubEndpointInputs, GithubEndpointOutputs } from './endpoints';
import {
	IssuesEndpoints,
	PullRequestsEndpoints,
	ReleasesEndpoints,
	RepositoriesEndpoints,
	WorkflowsEndpoints,
} from './endpoints';
import type { GithubCredentials } from './schema';
import { GithubSchema } from './schema';
import type {
	GithubWebhookEvent,
	GithubWebhookOutputs,
	GithubWebhookPayload,
	PullRequestClosedEvent,
	PullRequestOpenedEvent,
	PullRequestSynchronizeEvent,
	PushEventType,
	StarCreatedEvent,
	StarDeletedEvent,
} from './webhooks';
import { PullRequestWebhooks, PushWebhooks, StarWebhooks } from './webhooks';

export {
	type StarCreatedEvent,
	type StarDeletedEvent,
} from './webhooks/types';

export type GithubContext = CorsairPluginContext<
	typeof GithubSchema,
	GithubPluginOptions
>;

export type GithubKeyBuilderContext = KeyBuilderContext<GithubPluginOptions>;

type GithubEndpoint<K extends keyof GithubEndpointOutputs> = CorsairEndpoint<
	GithubContext,
	GithubEndpointInputs[K],
	GithubEndpointOutputs[K]
>;

export type GithubEndpoints = {
	issuesList: GithubEndpoint<'issuesList'>;
	issuesGet: GithubEndpoint<'issuesGet'>;
	issuesCreate: GithubEndpoint<'issuesCreate'>;
	issuesUpdate: GithubEndpoint<'issuesUpdate'>;
	issuesCreateComment: GithubEndpoint<'issuesCreateComment'>;
	pullRequestsList: GithubEndpoint<'pullRequestsList'>;
	pullRequestsGet: GithubEndpoint<'pullRequestsGet'>;
	pullRequestsListReviews: GithubEndpoint<'pullRequestsListReviews'>;
	pullRequestsCreateReview: GithubEndpoint<'pullRequestsCreateReview'>;
	repositoriesList: GithubEndpoint<'repositoriesList'>;
	repositoriesGet: GithubEndpoint<'repositoriesGet'>;
	repositoriesListBranches: GithubEndpoint<'repositoriesListBranches'>;
	repositoriesListCommits: GithubEndpoint<'repositoriesListCommits'>;
	repositoriesGetContent: GithubEndpoint<'repositoriesGetContent'>;
	releasesList: GithubEndpoint<'releasesList'>;
	releasesGet: GithubEndpoint<'releasesGet'>;
	releasesCreate: GithubEndpoint<'releasesCreate'>;
	releasesUpdate: GithubEndpoint<'releasesUpdate'>;
	workflowsList: GithubEndpoint<'workflowsList'>;
	workflowsGet: GithubEndpoint<'workflowsGet'>;
	workflowsListRuns: GithubEndpoint<'workflowsListRuns'>;
};

export type GithubBoundEndpoints = BindEndpoints<typeof githubEndpointsNested>;

type GithubWebhook<
	K extends keyof GithubWebhookOutputs,
	TEvent extends GithubWebhookEvent,
> = CorsairWebhook<
	GithubContext,
	GithubWebhookPayload<TEvent>,
	GithubWebhookOutputs[K]
>;

export type GithubWebhooks = {
	pullRequestOpened: GithubWebhook<'pullRequestOpened', PullRequestOpenedEvent>;
	pullRequestClosed: GithubWebhook<'pullRequestClosed', PullRequestClosedEvent>;
	pullRequestSynchronize: GithubWebhook<
		'pullRequestSynchronize',
		PullRequestSynchronizeEvent
	>;
	push: GithubWebhook<'push', PushEventType>;
	starCreated: GithubWebhook<'starCreated', StarCreatedEvent>;
	starDeleted: GithubWebhook<'starDeleted', StarDeletedEvent>;
};

export type GithubBoundWebhooks = BindWebhooks<GithubWebhooks>;

const githubEndpointsNested = {
	issues: {
		list: IssuesEndpoints.list,
		get: IssuesEndpoints.get,
		create: IssuesEndpoints.create,
		update: IssuesEndpoints.update,
		createComment: IssuesEndpoints.createComment,
	},
	pullRequests: {
		list: PullRequestsEndpoints.list,
		get: PullRequestsEndpoints.get,
		listReviews: PullRequestsEndpoints.listReviews,
		createReview: PullRequestsEndpoints.createReview,
	},
	repositories: {
		list: RepositoriesEndpoints.list,
		get: RepositoriesEndpoints.get,
		listBranches: RepositoriesEndpoints.listBranches,
		listCommits: RepositoriesEndpoints.listCommits,
		getContent: RepositoriesEndpoints.getContent,
	},
	releases: {
		list: ReleasesEndpoints.list,
		get: ReleasesEndpoints.get,
		create: ReleasesEndpoints.create,
		update: ReleasesEndpoints.update,
	},
	workflows: {
		list: WorkflowsEndpoints.list,
		get: WorkflowsEndpoints.get,
		listRuns: WorkflowsEndpoints.listRuns,
	},
} as const;

const githubWebhooksNested = {
	pullRequestOpened: PullRequestWebhooks.opened,
	pullRequestClosed: PullRequestWebhooks.closed,
	pullRequestSynchronize: PullRequestWebhooks.synchronize,
	push: PushWebhooks.push,
	starCreated: StarWebhooks.created,
	starDeleted: StarWebhooks.deleted,
} as const;

const defaultAuthType: AuthTypes = 'api_key';

export type GithubPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	credentials?: GithubCredentials;
	webhookSecret?: string;
	hooks?: InternalGithubPlugin['hooks'];
	webhookHooks?: InternalGithubPlugin['webhookHooks'];
};

export type BaseGithubPlugin<PluginOptions extends GithubPluginOptions> =
	CorsairPlugin<
		'github',
		typeof GithubSchema,
		typeof githubEndpointsNested,
		typeof githubWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalGithubPlugin = BaseGithubPlugin<GithubPluginOptions>;

export type ExternalGithubPlugin<PluginOptions extends GithubPluginOptions> =
	BaseGithubPlugin<PluginOptions>;

export function github<const PluginOptions extends GithubPluginOptions>(
	incomingOptions: GithubPluginOptions &
		PluginOptions = {} as GithubPluginOptions & PluginOptions,
): ExternalGithubPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'github',
		schema: GithubSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: githubEndpointsNested,
		webhooks: githubWebhooksNested,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const hasGithubEvent = headers['x-github-event'] !== undefined;
			const hasGithubSignature = headers['x-hub-signature-256'] !== undefined;
			return hasGithubEvent && hasGithubSignature;
		},
		keyBuilder: async (ctx: GithubKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.getWebhookSignature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint') {
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.getApiKey();

					if (!res) {
						return '';
					}

					return res;
				} else if (ctx.authType === 'oauth_2') {
					const res = await ctx.keys.getAccessToken();

					if (!res) {
						return '';
					}

					return res;
				}
			}

			return '';
		},
	} satisfies InternalGithubPlugin;
}

export {
	createGithubEventMatch,
	verifyGithubWebhookSignature,
} from './webhooks/types';
