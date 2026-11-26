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
import { resolveGiteaInstance } from './client';
import {
	Branches,
	Comments,
	Commits,
	Issues,
	Releases,
	Repos,
	User,
	Webhooks,
} from './endpoints';
import type {
	GiteaEndpointInputs,
	GiteaEndpointOutputs,
} from './endpoints/types';
import {
	GiteaEndpointInputSchemas,
	GiteaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GiteaSchema } from './schema';

export type GiteaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Overrides the account's stored `instance_url` when set. */
	instanceUrl?: string;
	hooks?: InternalGiteaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof giteaEndpointsNested>;
};

export type GiteaContext = CorsairPluginContext<
	typeof GiteaSchema,
	GiteaPluginOptions,
	// The endpoints param stays unset: typing it here would make the context and
	// the endpoint tree reference each other and the endpoint params go any.
	undefined,
	typeof giteaAuthConfig
>;

export type GiteaKeyBuilderContext = KeyBuilderContext<
	GiteaPluginOptions,
	typeof giteaAuthConfig
>;

export type GiteaBoundEndpoints = BindEndpoints<typeof giteaEndpointsNested>;

type GiteaEndpoint<K extends keyof GiteaEndpointOutputs> = CorsairEndpoint<
	GiteaContext,
	GiteaEndpointInputs[K],
	GiteaEndpointOutputs[K]
>;

export type GiteaEndpoints = {
	userMe: GiteaEndpoint<'userMe'>;
	reposList: GiteaEndpoint<'reposList'>;
	reposGet: GiteaEndpoint<'reposGet'>;
	reposCreate: GiteaEndpoint<'reposCreate'>;
	reposDelete: GiteaEndpoint<'reposDelete'>;
	branchesList: GiteaEndpoint<'branchesList'>;
	commitsList: GiteaEndpoint<'commitsList'>;
	issuesList: GiteaEndpoint<'issuesList'>;
	issuesGet: GiteaEndpoint<'issuesGet'>;
	issuesCreate: GiteaEndpoint<'issuesCreate'>;
	issuesUpdate: GiteaEndpoint<'issuesUpdate'>;
	commentsList: GiteaEndpoint<'commentsList'>;
	commentsCreate: GiteaEndpoint<'commentsCreate'>;
	releasesList: GiteaEndpoint<'releasesList'>;
	releasesCreate: GiteaEndpoint<'releasesCreate'>;
	webhooksList: GiteaEndpoint<'webhooksList'>;
	webhooksCreate: GiteaEndpoint<'webhooksCreate'>;
	webhooksDelete: GiteaEndpoint<'webhooksDelete'>;
};

const giteaEndpointsNested = {
	user: {
		me: User.me,
	},
	repos: {
		list: Repos.list,
		get: Repos.get,
		create: Repos.create,
		delete: Repos.delete,
	},
	branches: {
		list: Branches.list,
	},
	commits: {
		list: Commits.list,
	},
	issues: {
		list: Issues.list,
		get: Issues.get,
		create: Issues.create,
		update: Issues.update,
	},
	comments: {
		list: Comments.list,
		create: Comments.create,
	},
	releases: {
		list: Releases.list,
		create: Releases.create,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.delete,
	},
} as const;

export const GITEA_OPERATIONS = Object.entries(giteaEndpointsNested).flatMap(
	([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
);

export const giteaEndpointSchemas = {
	'user.me': {
		input: GiteaEndpointInputSchemas.userMe,
		output: GiteaEndpointOutputSchemas.userMe,
	},
	'repos.list': {
		input: GiteaEndpointInputSchemas.reposList,
		output: GiteaEndpointOutputSchemas.reposList,
	},
	'repos.get': {
		input: GiteaEndpointInputSchemas.reposGet,
		output: GiteaEndpointOutputSchemas.reposGet,
	},
	'repos.create': {
		input: GiteaEndpointInputSchemas.reposCreate,
		output: GiteaEndpointOutputSchemas.reposCreate,
	},
	'repos.delete': {
		input: GiteaEndpointInputSchemas.reposDelete,
		output: GiteaEndpointOutputSchemas.reposDelete,
	},
	'branches.list': {
		input: GiteaEndpointInputSchemas.branchesList,
		output: GiteaEndpointOutputSchemas.branchesList,
	},
	'commits.list': {
		input: GiteaEndpointInputSchemas.commitsList,
		output: GiteaEndpointOutputSchemas.commitsList,
	},
	'issues.list': {
		input: GiteaEndpointInputSchemas.issuesList,
		output: GiteaEndpointOutputSchemas.issuesList,
	},
	'issues.get': {
		input: GiteaEndpointInputSchemas.issuesGet,
		output: GiteaEndpointOutputSchemas.issuesGet,
	},
	'issues.create': {
		input: GiteaEndpointInputSchemas.issuesCreate,
		output: GiteaEndpointOutputSchemas.issuesCreate,
	},
	'issues.update': {
		input: GiteaEndpointInputSchemas.issuesUpdate,
		output: GiteaEndpointOutputSchemas.issuesUpdate,
	},
	'comments.list': {
		input: GiteaEndpointInputSchemas.commentsList,
		output: GiteaEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: GiteaEndpointInputSchemas.commentsCreate,
		output: GiteaEndpointOutputSchemas.commentsCreate,
	},
	'releases.list': {
		input: GiteaEndpointInputSchemas.releasesList,
		output: GiteaEndpointOutputSchemas.releasesList,
	},
	'releases.create': {
		input: GiteaEndpointInputSchemas.releasesCreate,
		output: GiteaEndpointOutputSchemas.releasesCreate,
	},
	'webhooks.list': {
		input: GiteaEndpointInputSchemas.webhooksList,
		output: GiteaEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: GiteaEndpointInputSchemas.webhooksCreate,
		output: GiteaEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: GiteaEndpointInputSchemas.webhooksDelete,
		output: GiteaEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof giteaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const giteaEndpointMeta = {
	'user.me': {
		riskLevel: 'read',
		description: 'Get the authenticated user, as the account token sees it',
	},
	'repos.list': {
		riskLevel: 'read',
		description:
			'List the repositories the authenticated user owns, one page at a time',
	},
	'repos.get': {
		riskLevel: 'read',
		description:
			'Get one repository, including its counts, permissions and feature flags',
	},
	'repos.create': {
		riskLevel: 'write',
		description:
			'Create a repository owned by the authenticated user, optionally seeded with a README, license and gitignore',
	},
	'repos.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a repository together with its issues, pull requests, releases and wiki; no API call can restore it',
	},
	'branches.list': {
		riskLevel: 'read',
		description:
			"List a repository's branches with their latest commit and protection status",
	},
	'commits.list': {
		riskLevel: 'read',
		description:
			"List a repository's commits, newest first, optionally from a ref, path or time window; a repository with no commits answers an error rather than an empty list",
	},
	'issues.list': {
		riskLevel: 'read',
		description:
			"List a repository's issues and pull requests, filterable by state, labels, milestone, assignee and time window",
	},
	'issues.get': {
		riskLevel: 'read',
		description:
			'Get one issue or pull request by its number, including labels, assignees and the comment count',
	},
	'issues.create': {
		riskLevel: 'write',
		description:
			'Create an issue with a title, body, labels, assignees, milestone and optional deadline, optionally already closed',
	},
	'issues.update': {
		riskLevel: 'write',
		description:
			'Edit an issue: set title, body, labels, assignees, milestone or deadline, or close and reopen it through state',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List every comment on an issue, oldest first, optionally within an updated-at window; this route takes no paging',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Add a markdown comment to an issue or pull request',
	},
	'releases.list': {
		riskLevel: 'read',
		description:
			"List a repository's releases with their assets, filterable by draft, prerelease and tag",
	},
	'releases.create': {
		riskLevel: 'write',
		description:
			'Create a release for a tag, creating the tag on the target commit when it does not exist yet; a tag that already has a release answers 409',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhook registrations on a repository, with their target URLs, events and active flag',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook on a repository: a target URL and payload type, the events to subscribe, and an optional signing secret. Deliveries are sent by Gitea to that URL; this plugin does not receive them',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently remove a webhook registration; deliveries stop immediately and the hook id is not reused',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof giteaEndpointsNested>;

// Gitea is self-hosted: the token belongs to one instance, so the site URL is
// account config beside the key, and calls without it have nowhere to go.
export const giteaAuthConfig = {
	api_key: {
		account: ['instance_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGiteaPlugin<T extends GiteaPluginOptions> = CorsairPlugin<
	'gitea',
	typeof GiteaSchema,
	typeof giteaEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof giteaAuthConfig
>;

export type InternalGiteaPlugin = BaseGiteaPlugin<GiteaPluginOptions>;

export type ExternalGiteaPlugin<T extends GiteaPluginOptions> =
	BaseGiteaPlugin<T>;

export function gitea<const T extends GiteaPluginOptions>(
	incomingOptions: GiteaPluginOptions & T = {} as GiteaPluginOptions & T,
): ExternalGiteaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gitea',
		authConfig: giteaAuthConfig,
		schema: GiteaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: giteaEndpointsNested,
		// No inbound webhooks: deliveries are not handled, only their
		// registrations are managed through the webhooks.* operations.
		webhooks: {},
		endpointMeta: giteaEndpointMeta,
		endpointSchemas: giteaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GiteaKeyBuilderContext, source) => {
			// No webhook source exists for this plugin: deliveries are not handled.
			if (source !== 'endpoint') {
				throw new AuthMissingError('gitea', 'webhook_signature');
			}

			const key = options.key ?? (await ctx.keys.get_api_key());
			if (!key) {
				throw new AuthMissingError('gitea', ctx.authType ?? 'api_key');
			}
			// A key without its instance has nowhere to go: throws AuthMissingError
			// (so Corsair offers a connect link) when neither the option nor the
			// account's instance_url is a usable http(s) URL.
			await resolveGiteaInstance({ options, keys: ctx.keys });
			return key;
		},
	} satisfies InternalGiteaPlugin;
}

export type { GiteaRequest } from './client';
export { GiteaAPIError, normalizeInstanceUrl } from './client';

export type {
	BranchesListInput,
	BranchesListResponse,
	CommentsCreateInput,
	CommentsCreateResponse,
	CommentsListInput,
	CommentsListResponse,
	CommitsListInput,
	CommitsListResponse,
	GiteaBranch,
	GiteaComment,
	GiteaCommit,
	GiteaEndpointInputs,
	GiteaEndpointOutputs,
	GiteaHook,
	GiteaIssue,
	GiteaRelease,
	GiteaRepository,
	GiteaUser,
	IssuesCreateInput,
	IssuesCreateResponse,
	IssuesGetInput,
	IssuesGetResponse,
	IssuesListInput,
	IssuesListResponse,
	IssuesUpdateInput,
	IssuesUpdateResponse,
	ReleasesCreateInput,
	ReleasesCreateResponse,
	ReleasesListInput,
	ReleasesListResponse,
	ReposCreateInput,
	ReposCreateResponse,
	ReposDeleteInput,
	ReposDeleteResponse,
	ReposGetInput,
	ReposGetResponse,
	ReposListInput,
	ReposListResponse,
	UserMeInput,
	UserMeResponse,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteInput,
	WebhooksDeleteResponse,
	WebhooksListInput,
	WebhooksListResponse,
} from './endpoints/types';
