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
import type { GithubEndpointOutputs } from './endpoints';
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

type GithubEndpoint<
	K extends keyof GithubEndpointOutputs,
	Input,
> = CorsairEndpoint<GithubContext, Input, GithubEndpointOutputs[K]>;

export type GithubEndpoints = {
	issuesList: GithubEndpoint<
		'issuesList',
		{
			owner?: string;
			repo?: string;
			milestone?: string;
			state?: 'open' | 'closed' | 'all';
			assignee?: string;
			creator?: string;
			mentioned?: string;
			labels?: string;
			sort?: 'created' | 'updated' | 'comments';
			direction?: 'asc' | 'desc';
			since?: string;
			perPage?: number;
			page?: number;
		}
	>;
	issuesGet: GithubEndpoint<
		'issuesGet',
		{
			owner: string;
			repo: string;
			issueNumber: number;
		}
	>;
	issuesCreate: GithubEndpoint<
		'issuesCreate',
		{
			owner: string;
			repo: string;
			title: string | number;
			body?: string;
			assignee?: string | null;
			milestone?: string | number | null;
			labels?: Array<
				| string
				| {
						id?: number;
						name?: string;
						description?: string | null;
						color?: string | null;
				  }
			>;
			assignees?: Array<string>;
		}
	>;
	issuesUpdate: GithubEndpoint<
		'issuesUpdate',
		{
			owner: string;
			repo: string;
			issueNumber: number;
			title?: string | number | null;
			body?: string | null;
			assignee?: string | null;
			state?: 'open' | 'closed';
			stateReason?:
				| 'completed'
				| 'not_planned'
				| 'duplicate'
				| 'reopened'
				| null;
			milestone?: string | number | null;
			labels?: Array<
				| string
				| {
						id?: number;
						name?: string;
						description?: string | null;
						color?: string | null;
				  }
			>;
			assignees?: Array<string>;
		}
	>;
	issuesCreateComment: GithubEndpoint<
		'issuesCreateComment',
		{
			owner: string;
			repo: string;
			issueNumber: number;
			body: string;
		}
	>;
	pullRequestsList: GithubEndpoint<
		'pullRequestsList',
		{
			owner: string;
			repo: string;
			state?: 'open' | 'closed' | 'all';
			head?: string;
			base?: string;
			sort?: 'created' | 'updated' | 'popularity' | 'long-running';
			direction?: 'asc' | 'desc';
			perPage?: number;
			page?: number;
		}
	>;
	pullRequestsGet: GithubEndpoint<
		'pullRequestsGet',
		{
			owner: string;
			repo: string;
			pullNumber: number;
		}
	>;
	pullRequestsListReviews: GithubEndpoint<
		'pullRequestsListReviews',
		{
			owner: string;
			repo: string;
			pullNumber: number;
			perPage?: number;
			page?: number;
		}
	>;
	pullRequestsCreateReview: GithubEndpoint<
		'pullRequestsCreateReview',
		{
			owner: string;
			repo: string;
			pullNumber: number;
			commitId?: string;
			body?: string;
			event?: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
			comments?: Array<{
				path: string;
				position?: number;
				body: string;
				line?: number;
				side?: string;
				startLine?: number;
				startSide?: string;
			}>;
		}
	>;
	repositoriesList: GithubEndpoint<
		'repositoriesList',
		{
			owner?: string;
			type?: 'all' | 'owner' | 'public' | 'private' | 'member';
			sort?: 'created' | 'updated' | 'pushed' | 'full_name';
			direction?: 'asc' | 'desc';
			perPage?: number;
			page?: number;
		}
	>;
	repositoriesGet: GithubEndpoint<
		'repositoriesGet',
		{
			owner: string;
			repo: string;
		}
	>;
	repositoriesListBranches: GithubEndpoint<
		'repositoriesListBranches',
		{
			owner: string;
			repo: string;
			protected?: boolean;
			perPage?: number;
			page?: number;
		}
	>;
	repositoriesListCommits: GithubEndpoint<
		'repositoriesListCommits',
		{
			owner: string;
			repo: string;
			sha?: string;
			path?: string;
			author?: string;
			committer?: string;
			since?: string;
			until?: string;
			perPage?: number;
			page?: number;
		}
	>;
	repositoriesGetContent: GithubEndpoint<
		'repositoriesGetContent',
		{
			owner: string;
			repo: string;
			path: string;
			ref?: string;
		}
	>;
	releasesList: GithubEndpoint<
		'releasesList',
		{
			owner: string;
			repo: string;
			perPage?: number;
			page?: number;
		}
	>;
	releasesGet: GithubEndpoint<
		'releasesGet',
		{
			owner: string;
			repo: string;
			releaseId: number;
		}
	>;
	releasesCreate: GithubEndpoint<
		'releasesCreate',
		{
			owner: string;
			repo: string;
			tagName: string;
			targetCommitish?: string;
			name?: string;
			body?: string;
			draft?: boolean;
			prerelease?: boolean;
			generateReleaseNotes?: boolean;
		}
	>;
	releasesUpdate: GithubEndpoint<
		'releasesUpdate',
		{
			owner: string;
			repo: string;
			releaseId: number;
			tagName?: string;
			targetCommitish?: string;
			name?: string;
			body?: string;
			draft?: boolean;
			prerelease?: boolean;
		}
	>;
	workflowsList: GithubEndpoint<
		'workflowsList',
		{
			owner: string;
			repo: string;
			perPage?: number;
			page?: number;
		}
	>;
	workflowsGet: GithubEndpoint<
		'workflowsGet',
		{
			owner: string;
			repo: string;
			workflowId: number | string;
		}
	>;
	workflowsListRuns: GithubEndpoint<
		'workflowsListRuns',
		{
			owner: string;
			repo: string;
			actor?: string;
			branch?: string;
			event?: string;
			status?:
				| 'completed'
				| 'action_required'
				| 'cancelled'
				| 'failure'
				| 'neutral'
				| 'skipped'
				| 'stale'
				| 'success'
				| 'timed_out'
				| 'in_progress'
				| 'queued'
				| 'requested'
				| 'waiting'
				| 'pending';
			perPage?: number;
			page?: number;
			created?: string;
			excludePullRequests?: boolean;
			checkSuiteId?: number;
			headSha?: string;
		}
	>;
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
			const headers = request.headers as Record<string, string | undefined>;
			const hasGithubEvent = headers['x-github-event'] !== undefined;
			const hasGithubSignature = headers['x-hub-signature-256'] !== undefined;
			return hasGithubEvent && hasGithubSignature;
		},
		keyBuilder: async (ctx: GithubKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint') {
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.get_api_key();

					if (!res) {
						return '';
					}

					return res;
				} else if (ctx.authType === 'oauth_2') {
					const res = await ctx.keys.get_access_token();

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
