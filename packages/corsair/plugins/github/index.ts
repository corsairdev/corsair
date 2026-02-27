import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginEndpointMeta,
	PluginPermissionsConfig,
	RawWebhookRequest,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import type { GithubEndpointInputs, GithubEndpointOutputs } from './endpoints';
import {
	IssuesEndpoints,
	PullRequestsEndpoints,
	ReleasesEndpoints,
	RepositoriesEndpoints,
	WorkflowsEndpoints,
} from './endpoints';
import { githubEndpointSchemas } from './endpoints/types';
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

const defaultAuthType = 'api_key' as const;

/**
 * Risk-level metadata for each GitHub endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 * Keys are validated against the endpoint tree — invalid paths are type errors.
 */
const githubEndpointMeta = {
	'issues.list': {
		riskLevel: 'read',
		description: 'List issues in a repository',
	},
	'issues.get': { riskLevel: 'read', description: 'Get a specific issue' },
	'issues.create': { riskLevel: 'write', description: 'Create a new issue' },
	'issues.update': {
		riskLevel: 'write',
		description: 'Update an existing issue',
	},
	'issues.createComment': {
		riskLevel: 'write',
		description: 'Post a comment on an issue',
	},
	'pullRequests.list': { riskLevel: 'read', description: 'List pull requests' },
	'pullRequests.get': {
		riskLevel: 'read',
		description: 'Get a specific pull request',
	},
	'pullRequests.listReviews': {
		riskLevel: 'read',
		description: 'List reviews on a pull request',
	},
	'pullRequests.createReview': {
		riskLevel: 'write',
		description: 'Submit a pull request review',
	},
	'repositories.list': {
		riskLevel: 'read',
		description: 'List repositories for the authenticated user',
	},
	'repositories.get': {
		riskLevel: 'read',
		description: 'Get a specific repository',
	},
	'repositories.listBranches': {
		riskLevel: 'read',
		description: 'List branches in a repository',
	},
	'repositories.listCommits': {
		riskLevel: 'read',
		description: 'List commits in a repository',
	},
	'repositories.getContent': {
		riskLevel: 'read',
		description: 'Get file or directory content from a repository',
	},
	'releases.list': {
		riskLevel: 'read',
		description: 'List releases in a repository',
	},
	'releases.get': { riskLevel: 'read', description: 'Get a specific release' },
	'releases.create': {
		riskLevel: 'write',
		description: 'Create a new release',
	},
	'releases.update': {
		riskLevel: 'write',
		description: 'Update an existing release',
	},
	'workflows.list': {
		riskLevel: 'read',
		description: 'List workflows in a repository',
	},
	'workflows.get': {
		riskLevel: 'read',
		description: 'Get a specific workflow',
	},
	'workflows.listRuns': {
		riskLevel: 'read',
		description: 'List workflow runs',
	},
} satisfies PluginEndpointMeta<typeof githubEndpointsNested>;

export type GithubPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	credentials?: GithubCredentials;
	webhookSecret?: string;
	hooks?: InternalGithubPlugin['hooks'];
	webhookHooks?: InternalGithubPlugin['webhookHooks'];
	/**
	 * Permission configuration for the GitHub plugin.
	 * Controls what the AI agent is allowed to do via the MCP server.
	 * Overrides use dot-notation paths from the GitHub endpoint tree — invalid paths are type errors.
	 *
	 * @example
	 * ```ts
	 * github({
	 *   permissions: {
	 *     mode: 'cautious',
	 *     overrides: { 'releases.create': 'require_approval' },
	 *   },
	 * })
	 * ```
	 */
	permissions?: PluginPermissionsConfig<typeof githubEndpointsNested>;
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
		endpointMeta: githubEndpointMeta,
		endpointSchemas: githubEndpointSchemas,
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
