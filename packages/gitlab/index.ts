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
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	getValidGitlabAccessToken,
	gitlabOAuthTokenUrl,
	normalizeGitlabBaseUrl,
} from './client';
import {
	Branches,
	Commits,
	Groups,
	Issues,
	Labels,
	MergeRequests,
	Milestones,
	Pipelines,
	Projects,
	Releases,
	Repository,
	Users,
} from './endpoints';
import type {
	GitlabEndpointInputs,
	GitlabEndpointOutputs,
} from './endpoints/types';
import {
	GitlabEndpointInputSchemas,
	GitlabEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GitlabSchema } from './schema';
import { GitlabWebhooks as GitlabWebhookHandlers } from './webhooks';
import type {
	GitlabWebhookOutputs,
	IssueEvent,
	MergeRequestEvent,
	NoteEvent,
	PipelineEvent,
	PushEvent,
} from './webhooks/types';
import {
	IssueEventSchema,
	MergeRequestEventSchema,
	NoteEventSchema,
	PipelineEventSchema,
	PushEventSchema,
} from './webhooks/types';

export const gitlabAuthConfig = {} as const satisfies PluginAuthConfig;

export type GitlabPluginOptions = {
	baseUrl?: string;
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGitlabPlugin['hooks'];
	webhookHooks?: InternalGitlabPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gitlabEndpointsNested>;
};

export type GitlabContext = CorsairPluginContext<
	typeof GitlabSchema,
	GitlabPluginOptions,
	undefined,
	typeof gitlabAuthConfig
>;

export type GitlabKeyBuilderContext = KeyBuilderContext<
	GitlabPluginOptions,
	typeof gitlabAuthConfig
>;

export type GitlabBoundEndpoints = BindEndpoints<typeof gitlabEndpointsNested>;

type GitlabEndpoint<K extends keyof GitlabEndpointOutputs> = CorsairEndpoint<
	GitlabContext,
	GitlabEndpointInputs[K],
	GitlabEndpointOutputs[K]
>;

export type GitlabEndpoints = {
	usersGetCurrentUser: GitlabEndpoint<'usersGetCurrentUser'>;
	usersGetUser: GitlabEndpoint<'usersGetUser'>;
	usersList: GitlabEndpoint<'usersList'>;
	projectsList: GitlabEndpoint<'projectsList'>;
	projectsGet: GitlabEndpoint<'projectsGet'>;
	projectsCreate: GitlabEndpoint<'projectsCreate'>;
	projectsUpdate: GitlabEndpoint<'projectsUpdate'>;
	projectsDelete: GitlabEndpoint<'projectsDelete'>;
	projectsFork: GitlabEndpoint<'projectsFork'>;
	issuesList: GitlabEndpoint<'issuesList'>;
	issuesGet: GitlabEndpoint<'issuesGet'>;
	issuesCreate: GitlabEndpoint<'issuesCreate'>;
	issuesUpdate: GitlabEndpoint<'issuesUpdate'>;
	issuesDelete: GitlabEndpoint<'issuesDelete'>;
	issuesListNotes: GitlabEndpoint<'issuesListNotes'>;
	issuesCreateNote: GitlabEndpoint<'issuesCreateNote'>;
	mergeRequestsList: GitlabEndpoint<'mergeRequestsList'>;
	mergeRequestsGet: GitlabEndpoint<'mergeRequestsGet'>;
	mergeRequestsCreate: GitlabEndpoint<'mergeRequestsCreate'>;
	mergeRequestsUpdate: GitlabEndpoint<'mergeRequestsUpdate'>;
	mergeRequestsDelete: GitlabEndpoint<'mergeRequestsDelete'>;
	mergeRequestsMerge: GitlabEndpoint<'mergeRequestsMerge'>;
	mergeRequestsApprove: GitlabEndpoint<'mergeRequestsApprove'>;
	mergeRequestsListNotes: GitlabEndpoint<'mergeRequestsListNotes'>;
	mergeRequestsCreateNote: GitlabEndpoint<'mergeRequestsCreateNote'>;
	branchesList: GitlabEndpoint<'branchesList'>;
	branchesGet: GitlabEndpoint<'branchesGet'>;
	branchesCreate: GitlabEndpoint<'branchesCreate'>;
	branchesDelete: GitlabEndpoint<'branchesDelete'>;
	commitsList: GitlabEndpoint<'commitsList'>;
	commitsGet: GitlabEndpoint<'commitsGet'>;
	commitsGetDiff: GitlabEndpoint<'commitsGetDiff'>;
	pipelinesList: GitlabEndpoint<'pipelinesList'>;
	pipelinesGet: GitlabEndpoint<'pipelinesGet'>;
	pipelinesCreate: GitlabEndpoint<'pipelinesCreate'>;
	pipelinesRetry: GitlabEndpoint<'pipelinesRetry'>;
	pipelinesCancel: GitlabEndpoint<'pipelinesCancel'>;
	pipelinesDelete: GitlabEndpoint<'pipelinesDelete'>;
	pipelinesListJobs: GitlabEndpoint<'pipelinesListJobs'>;
	groupsList: GitlabEndpoint<'groupsList'>;
	groupsGet: GitlabEndpoint<'groupsGet'>;
	groupsCreate: GitlabEndpoint<'groupsCreate'>;
	groupsUpdate: GitlabEndpoint<'groupsUpdate'>;
	groupsDelete: GitlabEndpoint<'groupsDelete'>;
	groupsListProjects: GitlabEndpoint<'groupsListProjects'>;
	labelsList: GitlabEndpoint<'labelsList'>;
	labelsCreate: GitlabEndpoint<'labelsCreate'>;
	labelsUpdate: GitlabEndpoint<'labelsUpdate'>;
	labelsDelete: GitlabEndpoint<'labelsDelete'>;
	milestonesList: GitlabEndpoint<'milestonesList'>;
	milestonesGet: GitlabEndpoint<'milestonesGet'>;
	milestonesCreate: GitlabEndpoint<'milestonesCreate'>;
	milestonesUpdate: GitlabEndpoint<'milestonesUpdate'>;
	milestonesDelete: GitlabEndpoint<'milestonesDelete'>;
	releasesList: GitlabEndpoint<'releasesList'>;
	releasesGet: GitlabEndpoint<'releasesGet'>;
	releasesCreate: GitlabEndpoint<'releasesCreate'>;
	releasesUpdate: GitlabEndpoint<'releasesUpdate'>;
	releasesDelete: GitlabEndpoint<'releasesDelete'>;
	repositoryGetTree: GitlabEndpoint<'repositoryGetTree'>;
	repositoryGetFile: GitlabEndpoint<'repositoryGetFile'>;
	repositoryCompare: GitlabEndpoint<'repositoryCompare'>;
};

type GitlabWebhook<
	K extends keyof GitlabWebhookOutputs,
	TEvent,
> = CorsairWebhook<GitlabContext, TEvent, GitlabWebhookOutputs[K]>;

export type GitlabWebhooks = {
	push: GitlabWebhook<'push', PushEvent>;
	mergeRequest: GitlabWebhook<'mergeRequest', MergeRequestEvent>;
	issue: GitlabWebhook<'issue', IssueEvent>;
	pipeline: GitlabWebhook<'pipeline', PipelineEvent>;
	note: GitlabWebhook<'note', NoteEvent>;
};

export type GitlabBoundWebhooks = BindWebhooks<GitlabWebhooks>;

const gitlabEndpointsNested = {
	users: {
		getCurrentUser: Users.getCurrentUser,
		getUser: Users.getUser,
		list: Users.list,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
		fork: Projects.fork,
	},
	issues: {
		list: Issues.list,
		get: Issues.get,
		create: Issues.create,
		update: Issues.update,
		delete: Issues.delete,
		listNotes: Issues.listNotes,
		createNote: Issues.createNote,
	},
	mergeRequests: {
		list: MergeRequests.list,
		get: MergeRequests.get,
		create: MergeRequests.create,
		update: MergeRequests.update,
		delete: MergeRequests.delete,
		merge: MergeRequests.merge,
		approve: MergeRequests.approve,
		listNotes: MergeRequests.listNotes,
		createNote: MergeRequests.createNote,
	},
	branches: {
		list: Branches.list,
		get: Branches.get,
		create: Branches.create,
		delete: Branches.delete,
	},
	commits: {
		list: Commits.list,
		get: Commits.get,
		getDiff: Commits.getDiff,
	},
	pipelines: {
		list: Pipelines.list,
		get: Pipelines.get,
		create: Pipelines.create,
		retry: Pipelines.retry,
		cancel: Pipelines.cancel,
		delete: Pipelines.delete,
		listJobs: Pipelines.listJobs,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
		create: Groups.create,
		update: Groups.update,
		delete: Groups.delete,
		listProjects: Groups.listProjects,
	},
	labels: {
		list: Labels.list,
		create: Labels.create,
		update: Labels.update,
		delete: Labels.delete,
	},
	milestones: {
		list: Milestones.list,
		get: Milestones.get,
		create: Milestones.create,
		update: Milestones.update,
		delete: Milestones.delete,
	},
	releases: {
		list: Releases.list,
		get: Releases.get,
		create: Releases.create,
		update: Releases.update,
		delete: Releases.delete,
	},
	repository: {
		getTree: Repository.getTree,
		getFile: Repository.getFile,
		compare: Repository.compare,
	},
} as const;

const gitlabWebhooksNested = {
	push: GitlabWebhookHandlers.push,
	mergeRequest: GitlabWebhookHandlers.mergeRequest,
	issue: GitlabWebhookHandlers.issue,
	pipeline: GitlabWebhookHandlers.pipeline,
	note: GitlabWebhookHandlers.note,
} as const;

export const gitlabEndpointSchemas = {
	'users.getCurrentUser': {
		input: GitlabEndpointInputSchemas.usersGetCurrentUser,
		output: GitlabEndpointOutputSchemas.usersGetCurrentUser,
	},
	'users.getUser': {
		input: GitlabEndpointInputSchemas.usersGetUser,
		output: GitlabEndpointOutputSchemas.usersGetUser,
	},
	'users.list': {
		input: GitlabEndpointInputSchemas.usersList,
		output: GitlabEndpointOutputSchemas.usersList,
	},
	'projects.list': {
		input: GitlabEndpointInputSchemas.projectsList,
		output: GitlabEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: GitlabEndpointInputSchemas.projectsGet,
		output: GitlabEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: GitlabEndpointInputSchemas.projectsCreate,
		output: GitlabEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: GitlabEndpointInputSchemas.projectsUpdate,
		output: GitlabEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: GitlabEndpointInputSchemas.projectsDelete,
		output: GitlabEndpointOutputSchemas.projectsDelete,
	},
	'projects.fork': {
		input: GitlabEndpointInputSchemas.projectsFork,
		output: GitlabEndpointOutputSchemas.projectsFork,
	},
	'issues.list': {
		input: GitlabEndpointInputSchemas.issuesList,
		output: GitlabEndpointOutputSchemas.issuesList,
	},
	'issues.get': {
		input: GitlabEndpointInputSchemas.issuesGet,
		output: GitlabEndpointOutputSchemas.issuesGet,
	},
	'issues.create': {
		input: GitlabEndpointInputSchemas.issuesCreate,
		output: GitlabEndpointOutputSchemas.issuesCreate,
	},
	'issues.update': {
		input: GitlabEndpointInputSchemas.issuesUpdate,
		output: GitlabEndpointOutputSchemas.issuesUpdate,
	},
	'issues.delete': {
		input: GitlabEndpointInputSchemas.issuesDelete,
		output: GitlabEndpointOutputSchemas.issuesDelete,
	},
	'issues.listNotes': {
		input: GitlabEndpointInputSchemas.issuesListNotes,
		output: GitlabEndpointOutputSchemas.issuesListNotes,
	},
	'issues.createNote': {
		input: GitlabEndpointInputSchemas.issuesCreateNote,
		output: GitlabEndpointOutputSchemas.issuesCreateNote,
	},
	'mergeRequests.list': {
		input: GitlabEndpointInputSchemas.mergeRequestsList,
		output: GitlabEndpointOutputSchemas.mergeRequestsList,
	},
	'mergeRequests.get': {
		input: GitlabEndpointInputSchemas.mergeRequestsGet,
		output: GitlabEndpointOutputSchemas.mergeRequestsGet,
	},
	'mergeRequests.create': {
		input: GitlabEndpointInputSchemas.mergeRequestsCreate,
		output: GitlabEndpointOutputSchemas.mergeRequestsCreate,
	},
	'mergeRequests.update': {
		input: GitlabEndpointInputSchemas.mergeRequestsUpdate,
		output: GitlabEndpointOutputSchemas.mergeRequestsUpdate,
	},
	'mergeRequests.delete': {
		input: GitlabEndpointInputSchemas.mergeRequestsDelete,
		output: GitlabEndpointOutputSchemas.mergeRequestsDelete,
	},
	'mergeRequests.merge': {
		input: GitlabEndpointInputSchemas.mergeRequestsMerge,
		output: GitlabEndpointOutputSchemas.mergeRequestsMerge,
	},
	'mergeRequests.approve': {
		input: GitlabEndpointInputSchemas.mergeRequestsApprove,
		output: GitlabEndpointOutputSchemas.mergeRequestsApprove,
	},
	'mergeRequests.listNotes': {
		input: GitlabEndpointInputSchemas.mergeRequestsListNotes,
		output: GitlabEndpointOutputSchemas.mergeRequestsListNotes,
	},
	'mergeRequests.createNote': {
		input: GitlabEndpointInputSchemas.mergeRequestsCreateNote,
		output: GitlabEndpointOutputSchemas.mergeRequestsCreateNote,
	},
	'branches.list': {
		input: GitlabEndpointInputSchemas.branchesList,
		output: GitlabEndpointOutputSchemas.branchesList,
	},
	'branches.get': {
		input: GitlabEndpointInputSchemas.branchesGet,
		output: GitlabEndpointOutputSchemas.branchesGet,
	},
	'branches.create': {
		input: GitlabEndpointInputSchemas.branchesCreate,
		output: GitlabEndpointOutputSchemas.branchesCreate,
	},
	'branches.delete': {
		input: GitlabEndpointInputSchemas.branchesDelete,
		output: GitlabEndpointOutputSchemas.branchesDelete,
	},
	'commits.list': {
		input: GitlabEndpointInputSchemas.commitsList,
		output: GitlabEndpointOutputSchemas.commitsList,
	},
	'commits.get': {
		input: GitlabEndpointInputSchemas.commitsGet,
		output: GitlabEndpointOutputSchemas.commitsGet,
	},
	'commits.getDiff': {
		input: GitlabEndpointInputSchemas.commitsGetDiff,
		output: GitlabEndpointOutputSchemas.commitsGetDiff,
	},
	'pipelines.list': {
		input: GitlabEndpointInputSchemas.pipelinesList,
		output: GitlabEndpointOutputSchemas.pipelinesList,
	},
	'pipelines.get': {
		input: GitlabEndpointInputSchemas.pipelinesGet,
		output: GitlabEndpointOutputSchemas.pipelinesGet,
	},
	'pipelines.create': {
		input: GitlabEndpointInputSchemas.pipelinesCreate,
		output: GitlabEndpointOutputSchemas.pipelinesCreate,
	},
	'pipelines.retry': {
		input: GitlabEndpointInputSchemas.pipelinesRetry,
		output: GitlabEndpointOutputSchemas.pipelinesRetry,
	},
	'pipelines.cancel': {
		input: GitlabEndpointInputSchemas.pipelinesCancel,
		output: GitlabEndpointOutputSchemas.pipelinesCancel,
	},
	'pipelines.delete': {
		input: GitlabEndpointInputSchemas.pipelinesDelete,
		output: GitlabEndpointOutputSchemas.pipelinesDelete,
	},
	'pipelines.listJobs': {
		input: GitlabEndpointInputSchemas.pipelinesListJobs,
		output: GitlabEndpointOutputSchemas.pipelinesListJobs,
	},
	'groups.list': {
		input: GitlabEndpointInputSchemas.groupsList,
		output: GitlabEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: GitlabEndpointInputSchemas.groupsGet,
		output: GitlabEndpointOutputSchemas.groupsGet,
	},
	'groups.create': {
		input: GitlabEndpointInputSchemas.groupsCreate,
		output: GitlabEndpointOutputSchemas.groupsCreate,
	},
	'groups.update': {
		input: GitlabEndpointInputSchemas.groupsUpdate,
		output: GitlabEndpointOutputSchemas.groupsUpdate,
	},
	'groups.delete': {
		input: GitlabEndpointInputSchemas.groupsDelete,
		output: GitlabEndpointOutputSchemas.groupsDelete,
	},
	'groups.listProjects': {
		input: GitlabEndpointInputSchemas.groupsListProjects,
		output: GitlabEndpointOutputSchemas.groupsListProjects,
	},
	'labels.list': {
		input: GitlabEndpointInputSchemas.labelsList,
		output: GitlabEndpointOutputSchemas.labelsList,
	},
	'labels.create': {
		input: GitlabEndpointInputSchemas.labelsCreate,
		output: GitlabEndpointOutputSchemas.labelsCreate,
	},
	'labels.update': {
		input: GitlabEndpointInputSchemas.labelsUpdate,
		output: GitlabEndpointOutputSchemas.labelsUpdate,
	},
	'labels.delete': {
		input: GitlabEndpointInputSchemas.labelsDelete,
		output: GitlabEndpointOutputSchemas.labelsDelete,
	},
	'milestones.list': {
		input: GitlabEndpointInputSchemas.milestonesList,
		output: GitlabEndpointOutputSchemas.milestonesList,
	},
	'milestones.get': {
		input: GitlabEndpointInputSchemas.milestonesGet,
		output: GitlabEndpointOutputSchemas.milestonesGet,
	},
	'milestones.create': {
		input: GitlabEndpointInputSchemas.milestonesCreate,
		output: GitlabEndpointOutputSchemas.milestonesCreate,
	},
	'milestones.update': {
		input: GitlabEndpointInputSchemas.milestonesUpdate,
		output: GitlabEndpointOutputSchemas.milestonesUpdate,
	},
	'milestones.delete': {
		input: GitlabEndpointInputSchemas.milestonesDelete,
		output: GitlabEndpointOutputSchemas.milestonesDelete,
	},
	'releases.list': {
		input: GitlabEndpointInputSchemas.releasesList,
		output: GitlabEndpointOutputSchemas.releasesList,
	},
	'releases.get': {
		input: GitlabEndpointInputSchemas.releasesGet,
		output: GitlabEndpointOutputSchemas.releasesGet,
	},
	'releases.create': {
		input: GitlabEndpointInputSchemas.releasesCreate,
		output: GitlabEndpointOutputSchemas.releasesCreate,
	},
	'releases.update': {
		input: GitlabEndpointInputSchemas.releasesUpdate,
		output: GitlabEndpointOutputSchemas.releasesUpdate,
	},
	'releases.delete': {
		input: GitlabEndpointInputSchemas.releasesDelete,
		output: GitlabEndpointOutputSchemas.releasesDelete,
	},
	'repository.getTree': {
		input: GitlabEndpointInputSchemas.repositoryGetTree,
		output: GitlabEndpointOutputSchemas.repositoryGetTree,
	},
	'repository.getFile': {
		input: GitlabEndpointInputSchemas.repositoryGetFile,
		output: GitlabEndpointOutputSchemas.repositoryGetFile,
	},
	'repository.compare': {
		input: GitlabEndpointInputSchemas.repositoryCompare,
		output: GitlabEndpointOutputSchemas.repositoryCompare,
	},
} as const;

const gitlabWebhookSchemas = {
	push: {
		description: 'A push event from GitLab (git push to repository)',
		payload: PushEventSchema,
		response: PushEventSchema,
	},
	mergeRequest: {
		description:
			'A merge request event from GitLab (open, update, merge, close)',
		payload: MergeRequestEventSchema,
		response: MergeRequestEventSchema,
	},
	issue: {
		description: 'An issue event from GitLab (open, update, close)',
		payload: IssueEventSchema,
		response: IssueEventSchema,
	},
	pipeline: {
		description: 'A pipeline event from GitLab (status change)',
		payload: PipelineEventSchema,
		response: PipelineEventSchema,
	},
	note: {
		description:
			'A comment event from GitLab (new comments on issues, MRs, commits)',
		payload: NoteEventSchema,
		response: NoteEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gitlabEndpointMeta = {
	'users.getCurrentUser': {
		riskLevel: 'read',
		description: 'Get the authenticated user',
	},
	'users.getUser': {
		riskLevel: 'read',
		description: 'Get a specific user by ID',
	},
	'users.list': { riskLevel: 'read', description: 'List users' },
	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'projects.get': { riskLevel: 'read', description: 'Get a specific project' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update an existing project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'projects.fork': { riskLevel: 'write', description: 'Fork a project' },
	'issues.list': { riskLevel: 'read', description: 'List issues in a project' },
	'issues.get': { riskLevel: 'read', description: 'Get a specific issue' },
	'issues.create': { riskLevel: 'write', description: 'Create a new issue' },
	'issues.update': {
		riskLevel: 'write',
		description: 'Update an existing issue',
	},
	'issues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an issue [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'issues.listNotes': {
		riskLevel: 'read',
		description: 'List comments on an issue',
	},
	'issues.createNote': {
		riskLevel: 'write',
		description: 'Add a comment to an issue',
	},
	'mergeRequests.list': {
		riskLevel: 'read',
		description: 'List merge requests in a project',
	},
	'mergeRequests.get': {
		riskLevel: 'read',
		description: 'Get a specific merge request',
	},
	'mergeRequests.create': {
		riskLevel: 'write',
		description: 'Create a new merge request',
	},
	'mergeRequests.update': {
		riskLevel: 'write',
		description: 'Update a merge request',
	},
	'mergeRequests.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a merge request [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'mergeRequests.merge': {
		riskLevel: 'write',
		description: 'Merge a merge request',
	},
	'mergeRequests.approve': {
		riskLevel: 'write',
		description: 'Approve a merge request',
	},
	'mergeRequests.listNotes': {
		riskLevel: 'read',
		description: 'List comments on a merge request',
	},
	'mergeRequests.createNote': {
		riskLevel: 'write',
		description: 'Add a comment to a merge request',
	},
	'branches.list': {
		riskLevel: 'read',
		description: 'List branches in a repository',
	},
	'branches.get': { riskLevel: 'read', description: 'Get a specific branch' },
	'branches.create': { riskLevel: 'write', description: 'Create a new branch' },
	'branches.delete': {
		riskLevel: 'destructive',
		description: 'Delete a branch [DESTRUCTIVE]',
	},
	'commits.list': {
		riskLevel: 'read',
		description: 'List commits in a repository',
	},
	'commits.get': { riskLevel: 'read', description: 'Get a specific commit' },
	'commits.getDiff': {
		riskLevel: 'read',
		description: 'Get the diff of a commit',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description: 'List pipelines for a project',
	},
	'pipelines.get': {
		riskLevel: 'read',
		description: 'Get a specific pipeline',
	},
	'pipelines.create': {
		riskLevel: 'write',
		description: 'Create a new pipeline',
	},
	'pipelines.retry': {
		riskLevel: 'write',
		description: 'Retry a failed pipeline',
	},
	'pipelines.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running pipeline',
	},
	'pipelines.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pipeline [DESTRUCTIVE]',
	},
	'pipelines.listJobs': {
		riskLevel: 'read',
		description: 'List jobs in a pipeline',
	},
	'groups.list': { riskLevel: 'read', description: 'List groups' },
	'groups.get': { riskLevel: 'read', description: 'Get a specific group' },
	'groups.create': { riskLevel: 'write', description: 'Create a new group' },
	'groups.update': { riskLevel: 'write', description: 'Update a group' },
	'groups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a group [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'groups.listProjects': {
		riskLevel: 'read',
		description: 'List projects in a group',
	},
	'labels.list': { riskLevel: 'read', description: 'List labels in a project' },
	'labels.create': { riskLevel: 'write', description: 'Create a new label' },
	'labels.update': { riskLevel: 'write', description: 'Update a label' },
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a label [DESTRUCTIVE]',
	},
	'milestones.list': {
		riskLevel: 'read',
		description: 'List milestones in a project',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Get a specific milestone',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a new milestone',
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update a milestone',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		description: 'Delete a milestone [DESTRUCTIVE]',
	},
	'releases.list': {
		riskLevel: 'read',
		description: 'List releases in a project',
	},
	'releases.get': { riskLevel: 'read', description: 'Get a specific release' },
	'releases.create': {
		riskLevel: 'write',
		description: 'Create a new release',
	},
	'releases.update': { riskLevel: 'write', description: 'Update a release' },
	'releases.delete': {
		riskLevel: 'destructive',
		description: 'Delete a release [DESTRUCTIVE]',
	},
	'repository.getTree': {
		riskLevel: 'read',
		description: 'List repository tree (files and directories)',
	},
	'repository.getFile': {
		riskLevel: 'read',
		description: 'Get a file from the repository',
	},
	'repository.compare': {
		riskLevel: 'read',
		description: 'Compare branches, tags, or commits',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gitlabEndpointsNested>;

export type BaseGitlabPlugin<T extends GitlabPluginOptions> = CorsairPlugin<
	'gitlab',
	typeof GitlabSchema,
	typeof gitlabEndpointsNested,
	typeof gitlabWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof gitlabAuthConfig
>;

export type InternalGitlabPlugin = BaseGitlabPlugin<GitlabPluginOptions>;

export type ExternalGitlabPlugin<T extends GitlabPluginOptions> =
	BaseGitlabPlugin<T>;

export function gitlab<const T extends GitlabPluginOptions>(
	incomingOptions: GitlabPluginOptions & T = {} as GitlabPluginOptions & T,
): ExternalGitlabPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const baseUrl = normalizeGitlabBaseUrl(options.baseUrl);

	return {
		id: 'gitlab',
		schema: GitlabSchema,
		options: options,
		authConfig: gitlabAuthConfig,
		oauthConfig: {
			providerName: 'GitLab',
			authUrl: `${baseUrl}/oauth/authorize`,
			tokenUrl: gitlabOAuthTokenUrl(baseUrl),
			scopes: ['read_user', 'read_api', 'api'],
			tokenAuthMethod: 'body',
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gitlabEndpointsNested,
		webhooks: gitlabWebhooksNested,
		endpointMeta: gitlabEndpointMeta,
		endpointSchemas: gitlabEndpointSchemas,
		webhookSchemas: gitlabWebhookSchemas,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const token = headers['x-gitlab-token'];
			const event = headers['x-gitlab-event'];
			return token !== undefined || event !== undefined;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GitlabKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error(
						'[corsair:gitlab] No refresh token found. Run `corsair auth --plugin=gitlab` to re-authenticate.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:gitlab] Missing client_id or client_secret. Configure OAuth application credentials for this integration.',
					);
				}

				// Use a mutable variable so _refreshAuth always uses the latest refresh token
				// (GitLab/self-managed may rotate refresh_token on refresh).
				let currentRefreshToken = refreshToken;

				const tokenUrl = gitlabOAuthTokenUrl(ctx.options.baseUrl);

				let result: Awaited<ReturnType<typeof getValidGitlabAccessToken>>;
				try {
					result = await getValidGitlabAccessToken({
						tokenUrl,
						accessToken,
						expiresAt,
						refreshToken: currentRefreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
						redirectUri: res.redirect_url,
					});
				} catch (error) {
					throw new Error(
						`[corsair:gitlab] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
						if (result.newRefreshToken) {
							currentRefreshToken = result.newRefreshToken;
							await ctx.keys.set_refresh_token(currentRefreshToken);
						}
					} catch (error) {
						throw new Error(
							`[corsair:gitlab] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidGitlabAccessToken({
						tokenUrl,
						accessToken: null,
						expiresAt: null,
						refreshToken: currentRefreshToken,
						clientId: res.client_id!,
						clientSecret: res.client_secret!,
						redirectUri: res.redirect_url,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					if (freshResult.newRefreshToken) {
						currentRefreshToken = freshResult.newRefreshToken;
						await ctx.keys.set_refresh_token(currentRefreshToken);
					}
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalGitlabPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GitlabWebhookOutputs,
	GitlabWebhookPayload,
	IssueEvent,
	MergeRequestEvent,
	NoteEvent,
	PipelineEvent,
	PushEvent,
} from './webhooks/types';
export {
	createGitlabMatch,
	verifyGitlabWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GitlabEndpointInputs,
	GitlabEndpointOutputs,
} from './endpoints/types';

// ─────────────────────────────────────────────────────────────────────────────
// Schema Exports
// ─────────────────────────────────────────────────────────────────────────────

export { GitlabSchema } from './schema';
