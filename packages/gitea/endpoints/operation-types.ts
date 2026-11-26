// Generated from Gitea's swagger (API 28.4.0, /swagger.v1.json of a
// gitea/gitea:latest instance, fetched 2026-11-27); gitea-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type GiteaJsonValue =
	| null
	| boolean
	| number
	| string
	| GiteaJsonValue[]
	| { [key: string]: GiteaJsonValue | undefined };

export const GITEA_OPERATION_IDS = [
	'actions.artifacts.delete',
	'actions.artifacts.download',
	'actions.artifacts.get',
	'actions.artifacts.list',
	'actions.jobs.downloadLogs',
	'actions.jobs.get',
	'actions.jobs.list',
	'actions.runners.createRegistrationToken',
	'actions.runners.delete',
	'actions.runners.get',
	'actions.runners.list',
	'actions.runners.update',
	'actions.runs.approve',
	'actions.runs.artifacts.list',
	'actions.runs.attempts.get',
	'actions.runs.attempts.jobs.list',
	'actions.runs.cancel',
	'actions.runs.delete',
	'actions.runs.downloadLogs',
	'actions.runs.forceCancel',
	'actions.runs.get',
	'actions.runs.jobs.list',
	'actions.runs.jobs.rerun',
	'actions.runs.list',
	'actions.runs.rerun',
	'actions.runs.rerunFailed',
	'actions.secrets.delete',
	'actions.secrets.list',
	'actions.secrets.set',
	'actions.tasks.list',
	'actions.variables.create',
	'actions.variables.delete',
	'actions.variables.get',
	'actions.variables.list',
	'actions.variables.update',
	'actions.workflows.disable',
	'actions.workflows.dispatch',
	'actions.workflows.enable',
	'actions.workflows.get',
	'actions.workflows.list',
	'actions.workflows.runs.list',
	'admin.actions.jobs.list',
	'admin.actions.runners.createRegistrationToken',
	'admin.actions.runners.delete',
	'admin.actions.runners.get',
	'admin.actions.runners.list',
	'admin.actions.runners.update',
	'admin.actions.runs.list',
	'admin.cron.list',
	'admin.cron.run',
	'admin.emails.list',
	'admin.emails.search',
	'admin.hooks.create',
	'admin.hooks.delete',
	'admin.hooks.get',
	'admin.hooks.list',
	'admin.hooks.update',
	'admin.orgs.list',
	'admin.packages.list',
	'admin.unadopted.adopt',
	'admin.unadopted.delete',
	'admin.unadopted.list',
	'admin.users.badges.add',
	'admin.users.badges.delete',
	'admin.users.badges.list',
	'admin.users.create',
	'admin.users.delete',
	'admin.users.keys.create',
	'admin.users.keys.delete',
	'admin.users.list',
	'admin.users.orgs.create',
	'admin.users.rename',
	'admin.users.repos.create',
	'admin.users.update',
	'branchProtections.create',
	'branchProtections.delete',
	'branchProtections.get',
	'branchProtections.list',
	'branchProtections.setPriority',
	'branchProtections.update',
	'branches.create',
	'branches.delete',
	'branches.get',
	'branches.list',
	'branches.rename',
	'branches.setCommit',
	'comments.attachments.create',
	'comments.attachments.delete',
	'comments.attachments.get',
	'comments.attachments.list',
	'comments.attachments.update',
	'comments.create',
	'comments.delete',
	'comments.get',
	'comments.list',
	'comments.listForRepo',
	'comments.reactions.add',
	'comments.reactions.list',
	'comments.reactions.remove',
	'comments.update',
	'commits.compare',
	'commits.downloadDiff',
	'commits.get',
	'commits.list',
	'commits.pullRequest',
	'commits.statuses.combined',
	'commits.statuses.create',
	'commits.statuses.list',
	'commits.statuses.listByRef',
	'contents.applyPatch',
	'contents.changeFiles',
	'contents.create',
	'contents.delete',
	'contents.editorConfig',
	'contents.get',
	'contents.getExt',
	'contents.getMany',
	'contents.getManyByPost',
	'contents.list',
	'contents.media',
	'contents.raw',
	'contents.update',
	'git.blobs.get',
	'git.notes.get',
	'git.refs.list',
	'git.refs.listMatching',
	'git.tags.get',
	'git.trees.get',
	'issues.assignees.add',
	'issues.assignees.check',
	'issues.assignees.remove',
	'issues.attachments.create',
	'issues.attachments.delete',
	'issues.attachments.get',
	'issues.attachments.list',
	'issues.attachments.update',
	'issues.blocks.add',
	'issues.blocks.list',
	'issues.blocks.remove',
	'issues.config.get',
	'issues.config.validate',
	'issues.create',
	'issues.delete',
	'issues.dependencies.add',
	'issues.dependencies.list',
	'issues.dependencies.remove',
	'issues.get',
	'issues.labels.add',
	'issues.labels.clear',
	'issues.labels.list',
	'issues.labels.remove',
	'issues.labels.replace',
	'issues.list',
	'issues.listPinned',
	'issues.lock',
	'issues.movePin',
	'issues.pin',
	'issues.reactions.add',
	'issues.reactions.list',
	'issues.reactions.remove',
	'issues.search',
	'issues.setDeadline',
	'issues.stopwatch.delete',
	'issues.stopwatch.start',
	'issues.stopwatch.stop',
	'issues.subscriptions.add',
	'issues.subscriptions.check',
	'issues.subscriptions.list',
	'issues.subscriptions.remove',
	'issues.templates.list',
	'issues.timeline',
	'issues.times.add',
	'issues.times.delete',
	'issues.times.list',
	'issues.times.reset',
	'issues.unlock',
	'issues.unpin',
	'issues.update',
	'labels.create',
	'labels.delete',
	'labels.get',
	'labels.list',
	'labels.update',
	'milestones.create',
	'milestones.delete',
	'milestones.get',
	'milestones.list',
	'milestones.update',
	'misc.gitignoreTemplates.get',
	'misc.gitignoreTemplates.list',
	'misc.labelTemplates.get',
	'misc.labelTemplates.list',
	'misc.licenseTemplates.get',
	'misc.licenseTemplates.list',
	'misc.markdown.render',
	'misc.markdown.renderRaw',
	'misc.markup.render',
	'misc.signingKey.gpg',
	'misc.signingKey.ssh',
	'misc.topics.search',
	'misc.version',
	'notifications.countNew',
	'notifications.list',
	'notifications.listForRepo',
	'notifications.markRead',
	'notifications.markReadForRepo',
	'notifications.threads.get',
	'notifications.threads.markRead',
	'orgs.actions.jobs.list',
	'orgs.actions.runners.createRegistrationToken',
	'orgs.actions.runners.delete',
	'orgs.actions.runners.get',
	'orgs.actions.runners.list',
	'orgs.actions.runners.update',
	'orgs.actions.runs.list',
	'orgs.actions.secrets.delete',
	'orgs.actions.secrets.list',
	'orgs.actions.secrets.set',
	'orgs.actions.variables.create',
	'orgs.actions.variables.delete',
	'orgs.actions.variables.get',
	'orgs.actions.variables.list',
	'orgs.actions.variables.update',
	'orgs.activityFeeds.list',
	'orgs.avatar.delete',
	'orgs.avatar.update',
	'orgs.blocks.add',
	'orgs.blocks.check',
	'orgs.blocks.list',
	'orgs.blocks.remove',
	'orgs.create',
	'orgs.delete',
	'orgs.get',
	'orgs.hooks.create',
	'orgs.hooks.delete',
	'orgs.hooks.get',
	'orgs.hooks.list',
	'orgs.hooks.update',
	'orgs.labels.create',
	'orgs.labels.delete',
	'orgs.labels.get',
	'orgs.labels.list',
	'orgs.labels.update',
	'orgs.list',
	'orgs.members.check',
	'orgs.members.list',
	'orgs.members.remove',
	'orgs.projects.columns.create',
	'orgs.projects.columns.delete',
	'orgs.projects.columns.get',
	'orgs.projects.columns.issues.add',
	'orgs.projects.columns.issues.list',
	'orgs.projects.columns.issues.remove',
	'orgs.projects.columns.list',
	'orgs.projects.columns.move',
	'orgs.projects.columns.setDefault',
	'orgs.projects.columns.update',
	'orgs.projects.create',
	'orgs.projects.delete',
	'orgs.projects.get',
	'orgs.projects.issues.move',
	'orgs.projects.list',
	'orgs.projects.update',
	'orgs.publicMembers.check',
	'orgs.publicMembers.conceal',
	'orgs.publicMembers.list',
	'orgs.publicMembers.publicize',
	'orgs.rename',
	'orgs.repos.create',
	'orgs.repos.deleteAll',
	'orgs.repos.list',
	'orgs.teams.create',
	'orgs.teams.list',
	'orgs.teams.search',
	'orgs.update',
	'packages.delete',
	'packages.link',
	'packages.list',
	'packages.unlink',
	'packages.versions.delete',
	'packages.versions.files.list',
	'packages.versions.get',
	'packages.versions.getLatest',
	'packages.versions.list',
	'projects.columns.create',
	'projects.columns.delete',
	'projects.columns.get',
	'projects.columns.issues.add',
	'projects.columns.issues.list',
	'projects.columns.issues.remove',
	'projects.columns.list',
	'projects.columns.move',
	'projects.columns.setDefault',
	'projects.columns.update',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.issues.move',
	'projects.list',
	'projects.update',
	'pulls.cancelAutoMerge',
	'pulls.commits',
	'pulls.create',
	'pulls.downloadDiff',
	'pulls.files',
	'pulls.get',
	'pulls.getByBaseHead',
	'pulls.isMerged',
	'pulls.list',
	'pulls.listPinned',
	'pulls.merge',
	'pulls.requestedReviewers.add',
	'pulls.requestedReviewers.remove',
	'pulls.reviewComments.reply',
	'pulls.reviewComments.resolve',
	'pulls.reviewComments.unresolve',
	'pulls.reviews.comments',
	'pulls.reviews.create',
	'pulls.reviews.delete',
	'pulls.reviews.dismiss',
	'pulls.reviews.get',
	'pulls.reviews.list',
	'pulls.reviews.submit',
	'pulls.reviews.undismiss',
	'pulls.update',
	'pulls.updateBranch',
	'releases.assets.create',
	'releases.assets.delete',
	'releases.assets.get',
	'releases.assets.list',
	'releases.assets.update',
	'releases.create',
	'releases.delete',
	'releases.deleteByTag',
	'releases.get',
	'releases.getByTag',
	'releases.getLatest',
	'releases.list',
	'releases.update',
	'repos.acceptTransfer',
	'repos.activityFeeds.list',
	'repos.assignees.check',
	'repos.assignees.list',
	'repos.avatar.delete',
	'repos.avatar.update',
	'repos.collaborators.add',
	'repos.collaborators.check',
	'repos.collaborators.list',
	'repos.collaborators.permission',
	'repos.collaborators.remove',
	'repos.create',
	'repos.delete',
	'repos.deployKeys.create',
	'repos.deployKeys.createToken',
	'repos.deployKeys.delete',
	'repos.deployKeys.get',
	'repos.deployKeys.list',
	'repos.downloadArchive',
	'repos.forks.create',
	'repos.forks.list',
	'repos.generateFromTemplate',
	'repos.get',
	'repos.getById',
	'repos.gitHooks.delete',
	'repos.gitHooks.get',
	'repos.gitHooks.list',
	'repos.gitHooks.update',
	'repos.languages',
	'repos.licenses',
	'repos.list',
	'repos.mergeUpstream',
	'repos.migrate',
	'repos.mirrorSync',
	'repos.newPinAllowed',
	'repos.pushMirrors.add',
	'repos.pushMirrors.delete',
	'repos.pushMirrors.get',
	'repos.pushMirrors.list',
	'repos.pushMirrors.sync',
	'repos.rejectTransfer',
	'repos.reviewers',
	'repos.search',
	'repos.signingKey.gpg',
	'repos.signingKey.ssh',
	'repos.stargazers',
	'repos.subscribers',
	'repos.subscription.get',
	'repos.subscription.unwatch',
	'repos.subscription.watch',
	'repos.teams.add',
	'repos.teams.check',
	'repos.teams.list',
	'repos.teams.remove',
	'repos.topics.add',
	'repos.topics.list',
	'repos.topics.remove',
	'repos.topics.replace',
	'repos.trackedTimes',
	'repos.transfer',
	'repos.update',
	'settings.api',
	'settings.attachment',
	'settings.repository',
	'settings.ui',
	'tagProtections.create',
	'tagProtections.delete',
	'tagProtections.get',
	'tagProtections.list',
	'tagProtections.update',
	'tags.create',
	'tags.delete',
	'tags.get',
	'tags.list',
	'teams.activityFeeds.list',
	'teams.delete',
	'teams.get',
	'teams.members.add',
	'teams.members.get',
	'teams.members.list',
	'teams.members.remove',
	'teams.repos.add',
	'teams.repos.get',
	'teams.repos.list',
	'teams.repos.remove',
	'teams.update',
	'user.actions.jobs.list',
	'user.actions.runners.createRegistrationToken',
	'user.actions.runners.delete',
	'user.actions.runners.get',
	'user.actions.runners.list',
	'user.actions.runners.update',
	'user.actions.runs.list',
	'user.actions.secrets.delete',
	'user.actions.secrets.set',
	'user.actions.variables.create',
	'user.actions.variables.delete',
	'user.actions.variables.get',
	'user.actions.variables.list',
	'user.actions.variables.update',
	'user.avatar.delete',
	'user.avatar.update',
	'user.blocks.add',
	'user.blocks.check',
	'user.blocks.list',
	'user.blocks.remove',
	'user.emails.add',
	'user.emails.list',
	'user.emails.remove',
	'user.followers.list',
	'user.following.check',
	'user.following.follow',
	'user.following.list',
	'user.following.unfollow',
	'user.gpgKeys.create',
	'user.gpgKeys.delete',
	'user.gpgKeys.get',
	'user.gpgKeys.list',
	'user.gpgKeys.verificationToken',
	'user.gpgKeys.verify',
	'user.hooks.create',
	'user.hooks.delete',
	'user.hooks.get',
	'user.hooks.list',
	'user.hooks.update',
	'user.keys.create',
	'user.keys.delete',
	'user.keys.get',
	'user.keys.list',
	'user.me',
	'user.oauth2Apps.create',
	'user.oauth2Apps.delete',
	'user.oauth2Apps.get',
	'user.oauth2Apps.list',
	'user.oauth2Apps.update',
	'user.orgs.list',
	'user.projects.columns.create',
	'user.projects.columns.delete',
	'user.projects.columns.get',
	'user.projects.columns.issues.add',
	'user.projects.columns.issues.list',
	'user.projects.columns.issues.remove',
	'user.projects.columns.list',
	'user.projects.columns.move',
	'user.projects.columns.setDefault',
	'user.projects.columns.update',
	'user.projects.create',
	'user.projects.delete',
	'user.projects.get',
	'user.projects.issues.move',
	'user.projects.list',
	'user.projects.update',
	'user.settings.get',
	'user.settings.update',
	'user.starred.check',
	'user.starred.list',
	'user.starred.star',
	'user.starred.unstar',
	'user.stopwatches.list',
	'user.subscriptions.list',
	'user.teams.list',
	'user.token.delete',
	'user.token.get',
	'user.trackedTimes.list',
	'users.activityFeeds.list',
	'users.followers.list',
	'users.following.check',
	'users.following.list',
	'users.get',
	'users.gpgKeys.list',
	'users.heatmap',
	'users.keys.list',
	'users.orgs.list',
	'users.orgs.permissions',
	'users.projects.list',
	'users.repos.list',
	'users.search',
	'users.starred.list',
	'users.subscriptions.list',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.test',
	'webhooks.update',
	'wiki.create',
	'wiki.delete',
	'wiki.get',
	'wiki.list',
	'wiki.revisions',
	'wiki.update',
] as const;

export type GiteaOperationId = (typeof GITEA_OPERATION_IDS)[number];

/** ChangeFileOperation for creating, updating or deleting a file */
export type GiteaChangeFileOperationInput = {
	/** new or updated file content, it must be base64 encoded */
	content?: string;
	/** old path of the file to move */
	from_path?: string;
	/** indicates what to do with the file: "create" for creating a new file, "update" for updating an existing file, "upload" for creating or updating a file, "rename" for renaming a file, and "delete" for deleting an existing file. */
	operation: 'create' | 'update' | 'upload' | 'rename' | 'delete';
	/** path to the existing or new file */
	path: string;
	/** the blob ID (SHA) for the file that already exists, required for changing existing files */
	sha?: string;
};

/** CommitDateOptions store dates for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE */
export type GiteaCommitDateOptionsInput = {
	/** Author is the author date for the commit */
	author?: string;
	/** Committer is the committer date for the commit */
	committer?: string;
};

/** CreateHookOptionConfig has all config options in it required are "content_type" and "url" Required */
export type GiteaCreateHookOptionConfigInput = Record<string, string>;

/** CreatePullReviewComment represent a review comment for creation api */
export type GiteaCreatePullReviewCommentInput = {
	body?: string;
	/** if comment to new file line or 0 */
	new_position?: number;
	/** if comment to old file line or 0 */
	old_position?: number;
	/** the tree path */
	path: string;
};

/** ExternalTracker represents settings for external tracker */
export type GiteaExternalTrackerInput = {
	/** External Issue Tracker URL Format. Use the placeholders {user}, {repo} and {index} for the username, repository name and issue index. */
	external_tracker_format?: string;
	/** External Issue Tracker issue regular expression */
	external_tracker_regexp_pattern?: string;
	/** External Issue Tracker Number Format, either `numeric`, `alphanumeric`, or `regexp` */
	external_tracker_style?: string;
	/** URL of external issue tracker. */
	external_tracker_url?: string;
};

/** ExternalWiki represents setting for external wiki */
export type GiteaExternalWikiInput = {
	/** URL of external wiki. */
	external_wiki_url?: string;
};

/** Identity for a person's identity like an author or committer */
export type GiteaIdentityInput = {
	/** Email is the person's email address */
	email?: string;
	/** Name is the person's name */
	name?: string;
};

/** InternalTracker represents settings for internal tracker */
export type GiteaInternalTrackerInput = {
	/** Let only contributors track time (Built-in issue tracker) */
	allow_only_contributors_to_track_time?: boolean;
	/** Enable dependencies for issues and pull requests (Built-in issue tracker) */
	enable_issue_dependencies?: boolean;
	/** Enable time tracking (Built-in issue tracker) */
	enable_time_tracker?: boolean;
};

/** ActionArtifact represents a ActionArtifact */
export type GiteaActionArtifact = {
	archive_download_url?: string | null;
	created_at?: string | null;
	expired?: boolean | null;
	expires_at?: string | null;
	id?: number | null;
	name?: string | null;
	size_in_bytes?: number | null;
	updated_at?: string | null;
	url?: string | null;
	workflow_run?: GiteaActionWorkflowRun | null;
};

/** ActionArtifactsResponse returns ActionArtifacts */
export type GiteaActionArtifactsResponse = {
	artifacts?: Array<GiteaActionArtifact> | null;
	total_count?: number | null;
};

/** ActionRunner represents a Runner */
export type GiteaActionRunner = {
	busy?: boolean | null;
	disabled?: boolean | null;
	ephemeral?: boolean | null;
	id?: number | null;
	labels?: Array<GiteaActionRunnerLabel> | null;
	name?: string | null;
	status?: string | null;
};

/** ActionRunnerLabel represents a Runner Label */
export type GiteaActionRunnerLabel = {
	id?: number | null;
	name?: string | null;
	type?: string | null;
};

/** ActionRunnersResponse returns Runners */
export type GiteaActionRunnersResponse = {
	runners?: Array<GiteaActionRunner> | null;
	total_count?: number | null;
};

/** ActionTask represents a ActionTask */
export type GiteaActionTask = {
	created_at?: string | null;
	/** DisplayTitle is the display title for the workflow run */
	display_title?: string | null;
	/** Event is the type of event that triggered the workflow */
	event?: string | null;
	/** HeadBranch is the branch that triggered the workflow */
	head_branch?: string | null;
	/** HeadSHA is the commit SHA that triggered the workflow */
	head_sha?: string | null;
	/** ID is the unique identifier for the action task */
	id?: number | null;
	/** Name is the name of the workflow */
	name?: string | null;
	/** RunNumber is the sequential number of the workflow run */
	run_number?: number | null;
	run_started_at?: string | null;
	/** Status indicates the current status of the workflow run */
	status?: string | null;
	updated_at?: string | null;
	/** URL is the API URL for this workflow run */
	url?: string | null;
	/** WorkflowID is the identifier of the workflow */
	workflow_id?: string | null;
};

/** ActionTaskResponse returns a ActionTask */
export type GiteaActionTaskResponse = {
	/** TotalCount is the total number of workflow runs */
	total_count?: number | null;
	/** Entries contains the list of workflow runs */
	workflow_runs?: Array<GiteaActionTask> | null;
};

/** ActionVariable return value of the query API */
export type GiteaActionVariable = {
	/** the value of the variable */
	data?: string | null;
	/** the description of the variable */
	description?: string | null;
	/** the name of the variable */
	name?: string | null;
	/** the owner to which the variable belongs */
	owner_id?: number | null;
	/** the repository to which the variable belongs */
	repo_id?: number | null;
};

/** ActionWorkflow represents a ActionWorkflow */
export type GiteaActionWorkflow = {
	/** BadgeURL is the URL for the workflow badge */
	badge_url?: string | null;
	created_at?: string | null;
	deleted_at?: string | null;
	/** HTMLURL is the web URL for viewing the workflow */
	html_url?: string | null;
	/** ID is the unique identifier for the workflow */
	id?: string | null;
	/** Name is the name of the workflow */
	name?: string | null;
	/** Path is the file path of the workflow */
	path?: string | null;
	/** State indicates if the workflow is active or disabled */
	state?: string | null;
	updated_at?: string | null;
	/** URL is the API URL for this workflow */
	url?: string | null;
};

/** ActionWorkflowJob represents a WorkflowJob */
export type GiteaActionWorkflowJob = {
	completed_at?: string | null;
	conclusion?: string | null;
	created_at?: string | null;
	head_branch?: string | null;
	head_sha?: string | null;
	html_url?: string | null;
	id?: number | null;
	labels?: Array<string> | null;
	name?: string | null;
	run_attempt?: number | null;
	run_id?: number | null;
	run_url?: string | null;
	runner_id?: number | null;
	runner_name?: string | null;
	started_at?: string | null;
	status?: string | null;
	steps?: Array<GiteaActionWorkflowStep> | null;
	url?: string | null;
};

/** ActionWorkflowJobsResponse returns ActionWorkflowJobs */
export type GiteaActionWorkflowJobsResponse = {
	jobs?: Array<GiteaActionWorkflowJob> | null;
	total_count?: number | null;
};

/** ActionWorkflowResponse returns a ActionWorkflow */
export type GiteaActionWorkflowResponse = {
	total_count?: number | null;
	workflows?: Array<GiteaActionWorkflow> | null;
};

/** ActionWorkflowRun represents a WorkflowRun */
export type GiteaActionWorkflowRun = {
	actor?: GiteaUser | null;
	artifacts_url?: string | null;
	cancel_url?: string | null;
	completed_at?: string | null;
	conclusion?: string | null;
	created_at?: string | null;
	display_title?: string | null;
	event?: string | null;
	head_branch?: string | null;
	head_repository?: GiteaRepository | null;
	head_sha?: string | null;
	html_url?: string | null;
	id?: number | null;
	jobs_url?: string | null;
	logs_url?: string | null;
	path?: string | null;
	/** PreviousAttemptURL is the API URL of the previous attempt of this run, e.g. ".../actions/runs/{run_id}/attempts/{attempt-1}". It is set only when the current attempt is > 1 (i.e. a rerun). For the first attempt, or for legacy runs that pre-date ActionRunAttempt, it is null. */
	previous_attempt_url?: string | null;
	pull_requests?: Array<GiteaPullRequestMinimal> | null;
	repository?: GiteaRepository | null;
	repository_id?: number | null;
	rerun_url?: string | null;
	/** RunAttempt is 1-based for runs created after ActionRunAttempt was introduced. A value of 0 is a legacy-only sentinel for runs created before attempts existed and indicates no corresponding /attempts/{n} resource is available. */
	run_attempt?: number | null;
	run_number?: number | null;
	started_at?: string | null;
	status?: string | null;
	trigger_actor?: GiteaUser | null;
	updated_at?: string | null;
	url?: string | null;
};

/** ActionWorkflowRunsResponse returns ActionWorkflowRuns */
export type GiteaActionWorkflowRunsResponse = {
	total_count?: number | null;
	workflow_runs?: Array<GiteaActionWorkflowRun> | null;
};

/** ActionWorkflowStep represents a step of a WorkflowJob */
export type GiteaActionWorkflowStep = {
	completed_at?: string | null;
	conclusion?: string | null;
	name?: string | null;
	number?: number | null;
	started_at?: string | null;
	status?: string | null;
};

export type GiteaActivity = {
	act_user?: GiteaUser | null;
	/** The ID of the user who performed the action */
	act_user_id?: number | null;
	comment?: GiteaComment | null;
	/** The ID of the comment associated with the activity (if applicable) */
	comment_id?: number | null;
	/** Additional content or details about the activity */
	content?: string | null;
	/** The date and time when the activity occurred */
	created?: string | null;
	/** The unique identifier of the activity */
	id?: number | null;
	/** Whether this activity is from a private repository */
	is_private?: boolean | null;
	/** the type of action */
	op_type?: string | null;
	/** The name of the git reference (branch/tag) associated with the activity */
	ref_name?: string | null;
	repo?: GiteaRepository | null;
	/** The ID of the repository associated with the activity */
	repo_id?: number | null;
	/** The ID of the user who receives/sees this activity */
	user_id?: number | null;
};

/** AnnotatedTag represents an annotated tag */
export type GiteaAnnotatedTag = {
	/** The message associated with the annotated tag */
	message?: string | null;
	object?: GiteaAnnotatedTagObject | null;
	/** The SHA hash of the annotated tag */
	sha?: string | null;
	/** The name of the annotated tag */
	tag?: string | null;
	tagger?: GiteaCommitUser | null;
	/** The URL to access the annotated tag */
	url?: string | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** AnnotatedTagObject contains meta information of the tag object */
export type GiteaAnnotatedTagObject = {
	/** The SHA hash of the tagged object */
	sha?: string | null;
	/** The type of the tagged object (e.g., commit, tree) */
	type?: string | null;
	/** The URL to access the tagged object */
	url?: string | null;
};

/** Attachment a generic attachment */
export type GiteaAttachment = {
	/** DownloadURL is the URL to download the attachment */
	browser_download_url?: string | null;
	/** Created is the time when the attachment was uploaded */
	created_at?: string | null;
	/** DownloadCount is the number of times the attachment has been downloaded */
	download_count?: number | null;
	/** ID is the unique identifier for the attachment */
	id?: number | null;
	/** Name is the filename of the attachment */
	name?: string | null;
	/** Size is the file size in bytes */
	size?: number | null;
	/** UUID is the unique identifier for the attachment file */
	uuid?: string | null;
};

/** Badge represents a user badge */
export type GiteaBadge = {
	description?: string | null;
	id?: number | null;
	image_url?: string | null;
	slug?: string | null;
};

/** Branch represents a repository branch */
export type GiteaBranch = {
	commit?: GiteaPayloadCommit | null;
	/** EffectiveBranchProtectionName is the name of the effective branch protection rule */
	effective_branch_protection_name?: string | null;
	/** EnableStatusCheck indicates if status checks are enabled */
	enable_status_check?: boolean | null;
	/** Name is the branch name */
	name?: string | null;
	/** Protected indicates if the branch is protected */
	protected?: boolean | null;
	/** RequiredApprovals is the number of required approvals for pull requests */
	required_approvals?: number | null;
	/** StatusCheckContexts contains the list of required status check contexts */
	status_check_contexts?: Array<string> | null;
	/** UserCanMerge indicates if the current user can merge to this branch */
	user_can_merge?: boolean | null;
	/** UserCanPush indicates if the current user can push to this branch */
	user_can_push?: boolean | null;
};

/** BranchProtection represents a branch protection for a repository */
export type GiteaBranchProtection = {
	approvals_whitelist_teams?: Array<string> | null;
	approvals_whitelist_username?: Array<string> | null;
	block_admin_merge_override?: boolean | null;
	block_on_codeowner_reviews?: boolean | null;
	block_on_official_review_requests?: boolean | null;
	block_on_outdated_branch?: boolean | null;
	block_on_rejected_reviews?: boolean | null;
	branch_name?: string | null;
	bypass_allowlist_teams?: Array<string> | null;
	bypass_allowlist_usernames?: Array<string> | null;
	created_at?: string | null;
	dismiss_stale_approvals?: boolean | null;
	enable_approvals_whitelist?: boolean | null;
	enable_bypass_allowlist?: boolean | null;
	enable_force_push?: boolean | null;
	enable_force_push_allowlist?: boolean | null;
	enable_merge_whitelist?: boolean | null;
	enable_push?: boolean | null;
	enable_push_whitelist?: boolean | null;
	enable_status_check?: boolean | null;
	force_push_allowlist_deploy_keys?: boolean | null;
	force_push_allowlist_teams?: Array<string> | null;
	force_push_allowlist_usernames?: Array<string> | null;
	ignore_stale_approvals?: boolean | null;
	merge_whitelist_teams?: Array<string> | null;
	merge_whitelist_usernames?: Array<string> | null;
	/** Priority is the priority of this branch protection rule */
	priority?: number | null;
	protected_file_patterns?: string | null;
	push_whitelist_deploy_keys?: boolean | null;
	push_whitelist_teams?: Array<string> | null;
	push_whitelist_usernames?: Array<string> | null;
	require_signed_commits?: boolean | null;
	required_approvals?: number | null;
	/** RuleName is the name of the branch protection rule */
	rule_name?: string | null;
	status_check_contexts?: Array<string> | null;
	unprotected_file_patterns?: string | null;
	updated_at?: string | null;
};

/** ChangedFile store information about files affected by the pull request */
export type GiteaChangedFile = {
	/** The number of lines added to the file */
	additions?: number | null;
	/** The total number of changes to the file */
	changes?: number | null;
	/** The API URL to get the file contents */
	contents_url?: string | null;
	/** The number of lines deleted from the file */
	deletions?: number | null;
	/** The name of the changed file */
	filename?: string | null;
	/** The HTML URL to view the file changes */
	html_url?: string | null;
	/** The previous filename if the file was renamed */
	previous_filename?: string | null;
	/** The raw URL to download the file */
	raw_url?: string | null;
	/** The status of the file change (added, modified, deleted, etc.) */
	status?: string | null;
};

/** CombinedStatus holds the combined state of several statuses for a single commit */
export type GiteaCombinedStatus = {
	/** CommitURL is the API URL for the commit */
	commit_url?: string | null;
	repository?: GiteaRepository | null;
	/** SHA is the commit SHA this status applies to */
	sha?: string | null;
	/** State is the overall combined status state */
	state?: string | null;
	/** Statuses contains all individual commit statuses */
	statuses?: Array<GiteaCommitStatus> | null;
	/** TotalCount is the total number of statuses */
	total_count?: number | null;
	/** URL is the API URL for this combined status */
	url?: string | null;
};

/** Comment represents a comment on a commit or issue */
export type GiteaComment = {
	/** Attachments contains files attached to the comment */
	assets?: Array<GiteaAttachment> | null;
	/** Body contains the comment text content */
	body?: string | null;
	created_at?: string | null;
	/** HTMLURL is the web URL for viewing the comment */
	html_url?: string | null;
	/** ID is the unique identifier for the comment */
	id?: number | null;
	/** IssueURL is the API URL for the issue */
	issue_url?: string | null;
	/** OriginalAuthor is the original author name (for imported comments) */
	original_author?: string | null;
	/** OriginalAuthorID is the original author ID (for imported comments) */
	original_author_id?: number | null;
	/** PRURL is the API URL for the pull request (if applicable) */
	pull_request_url?: string | null;
	updated_at?: string | null;
	user?: GiteaUser | null;
};

export type GiteaCommit = {
	author?: GiteaUser | null;
	commit?: GiteaRepoCommit | null;
	committer?: GiteaUser | null;
	/** Created is the time when the commit was created */
	created?: string | null;
	/** Files contains information about files affected by the commit */
	files?: Array<GiteaCommitAffectedFiles> | null;
	/** HTMLURL is the web URL for viewing the commit */
	html_url?: string | null;
	/** Parents contains the parent commit information */
	parents?: Array<GiteaCommitMeta> | null;
	/** SHA is the commit SHA hash */
	sha?: string | null;
	stats?: GiteaCommitStats | null;
	/** URL is the API URL for the commit */
	url?: string | null;
};

/** CommitAffectedFiles store information about files affected by the commit */
export type GiteaCommitAffectedFiles = {
	/** Filename is the path of the affected file */
	filename?: string | null;
	/** Status indicates how the file was affected (added, modified, deleted) */
	status?: string | null;
};

export type GiteaCommitMeta = {
	/** Created is the time when the commit was created */
	created?: string | null;
	/** SHA is the commit SHA hash */
	sha?: string | null;
	/** URL is the API URL for the commit */
	url?: string | null;
};

/** CommitStats is statistics for a RepoCommit */
export type GiteaCommitStats = {
	/** Additions is the number of lines added */
	additions?: number | null;
	/** Deletions is the number of lines deleted */
	deletions?: number | null;
	/** Total is the total number of lines changed */
	total?: number | null;
};

/** CommitStatus holds a single status of a single Commit */
export type GiteaCommitStatus = {
	/** Context is the unique context identifier for the status */
	context?: string | null;
	created_at?: string | null;
	creator?: GiteaUser | null;
	/** Description provides a brief description of the status */
	description?: string | null;
	/** ID is the unique identifier for the commit status */
	id?: number | null;
	/** State represents the status state (pending, success, error, failure) */
	status?: string | null;
	/** TargetURL is the URL to link to for more details */
	target_url?: string | null;
	updated_at?: string | null;
	/** URL is the API URL for this status */
	url?: string | null;
};

export type GiteaCommitUser = {
	/** Date is the commit date in string format */
	date?: string | null;
	/** Email is the person's email address */
	email?: string | null;
	/** Name is the person's name */
	name?: string | null;
};

export type GiteaCompare = {
	commits?: Array<GiteaCommit> | null;
	total_commits?: number | null;
};

export type GiteaContentsExtResponse = {
	/** DirContents contains directory listing when the path represents a directory */
	dir_contents?: Array<GiteaContentsResponse> | null;
	file_contents?: GiteaContentsResponse | null;
};

/** ContentsResponse contains information about a repo's entry's (dir, file, symlink, submodule) metadata and content */
export type GiteaContentsResponse = {
	_links?: GiteaFileLinksResponse | null;
	/** `content` is populated when `type` is `file`, otherwise null */
	content?: string | null;
	/** DownloadURL is the direct download URL for this file */
	download_url?: string | null;
	/** `encoding` is populated when `type` is `file`, otherwise null */
	encoding?: string | null;
	/** GitURL is the Git API URL for this blob or tree */
	git_url?: string | null;
	/** HTMLURL is the web URL for this file or directory */
	html_url?: string | null;
	last_author_date?: string | null;
	/** LastCommitMessage is the message of the last commit that affected this file */
	last_commit_message?: string | null;
	/** LastCommitSHA is the SHA of the last commit that affected this file */
	last_commit_sha?: string | null;
	last_committer_date?: string | null;
	/** LfsOid is the Git LFS object ID if this file is stored in LFS */
	lfs_oid?: string | null;
	/** LfsSize is the file size if this file is stored in LFS */
	lfs_size?: number | null;
	/** `mode` is the Git file mode as an octal string, e.g. `100644` (regular), `100755` (executable), `120000` (symlink), `160000` (submodule) */
	mode?: string | null;
	/** Name is the file or directory name */
	name?: string | null;
	/** Path is the full path to the file or directory */
	path?: string | null;
	/** SHA is the Git blob or tree SHA */
	sha?: string | null;
	/** Size is the file size in bytes */
	size?: number | null;
	/** `submodule_git_url` is populated when `type` is `submodule`, otherwise null */
	submodule_git_url?: string | null;
	/** `target` is populated when `type` is `symlink`, otherwise null */
	target?: string | null;
	/** `type` will be `file`, `dir`, `symlink`, or `submodule` */
	type?: string | null;
	/** URL is the API URL for this file or directory */
	url?: string | null;
};

/** Cron represents a Cron task */
export type GiteaCron = {
	/** The total number of times this cron task has been executed */
	exec_times?: number | null;
	/** The name of the cron task */
	name?: string | null;
	/** The next scheduled execution time */
	next?: string | null;
	/** The previous execution time */
	prev?: string | null;
	/** The cron schedule expression (e.g., "0 0 * * *") */
	schedule?: string | null;
};

export type GiteaCurrentAccessToken = {
	/** The timestamp when the token was created */
	created_at?: string | null;
	/** The unique identifier of the access token */
	id?: number | null;
	/** The timestamp when the token was last used */
	last_used_at?: string | null;
	/** The name of the access token */
	name?: string | null;
	/** The scopes granted to this access token */
	scopes?: Array<string> | null;
	user?: GiteaUserMeta | null;
};

export type GiteaDeployKey = {
	/** Created is the time when the deploy-key was added */
	created_at?: string | null;
	/** Fingerprint is the key's fingerprint */
	fingerprint?: string | null;
	/** ID is the unique identifier for the deploy-key */
	id?: number | null;
	/** Key contains the actual SSH key content */
	key?: string | null;
	/** KeyID is the associated public key ID */
	key_id?: number | null;
	/** Type tells whether the key authenticates over SSH or with a token over HTTPS */
	key_type?: string | null;
	/** ReadOnly indicates if the key has read-only access */
	read_only?: boolean | null;
	repository?: GiteaRepository | null;
	/** Title is the human-readable name for the key */
	title?: string | null;
	/** Token is the plaintext token of an HTTPS key, only returned when it is created */
	token?: string | null;
	/** URL is the API URL for this deploy-key */
	url?: string | null;
};

/** Email an email address belonging to a user */
export type GiteaEmail = {
	/** The email address */
	email?: string | null;
	/** Whether this is the primary email address */
	primary?: boolean | null;
	/** The unique identifier of the user who owns this email */
	user_id?: number | null;
	/** username of the user */
	username?: string | null;
	/** Whether the email address has been verified */
	verified?: boolean | null;
};

/** ExternalTracker represents settings for external tracker */
export type GiteaExternalTracker = {
	/** External Issue Tracker URL Format. Use the placeholders {user}, {repo} and {index} for the username, repository name and issue index. */
	external_tracker_format?: string | null;
	/** External Issue Tracker issue regular expression */
	external_tracker_regexp_pattern?: string | null;
	/** External Issue Tracker Number Format, either `numeric`, `alphanumeric`, or `regexp` */
	external_tracker_style?: string | null;
	/** URL of external issue tracker. */
	external_tracker_url?: string | null;
};

/** ExternalWiki represents setting for external wiki */
export type GiteaExternalWiki = {
	/** URL of external wiki. */
	external_wiki_url?: string | null;
};

export type GiteaFileCommitResponse = {
	author?: GiteaCommitUser | null;
	committer?: GiteaCommitUser | null;
	/** Created is the time when the commit was created */
	created?: string | null;
	/** HTMLURL is the web URL for viewing this commit */
	html_url?: string | null;
	/** Message is the commit message */
	message?: string | null;
	/** Parents contains parent commit metadata */
	parents?: Array<GiteaCommitMeta> | null;
	/** SHA is the commit SHA hash */
	sha?: string | null;
	tree?: GiteaCommitMeta | null;
	/** URL is the API URL for the commit */
	url?: string | null;
};

/** FileDeleteResponse contains information about a repo's file that was deleted */
export type GiteaFileDeleteResponse = {
	commit?: GiteaFileCommitResponse | null;
	/** Content is always null for delete operations */
	content?: GiteaJsonValue | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** FileLinksResponse contains the links for a repo's file */
export type GiteaFileLinksResponse = {
	/** GitURL is the Git API URL for this file */
	git?: string | null;
	/** HTMLURL is the web URL for this file */
	html?: string | null;
	/** Self is the API URL for this file */
	self?: string | null;
};

/** FileResponse contains information about a repo's file */
export type GiteaFileResponse = {
	commit?: GiteaFileCommitResponse | null;
	content?: GiteaContentsResponse | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** FilesResponse contains information about multiple files from a repo */
export type GiteaFilesResponse = {
	commit?: GiteaFileCommitResponse | null;
	/** Files contains the list of file contents and metadata */
	files?: Array<GiteaContentsResponse> | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** GPGKey a user GPG key to sign commit and tag in repository */
export type GiteaGPGKey = {
	/** Whether the key can be used for certification */
	can_certify?: boolean | null;
	/** Whether the key can be used for encrypting communications */
	can_encrypt_comms?: boolean | null;
	/** Whether the key can be used for encrypting storage */
	can_encrypt_storage?: boolean | null;
	/** Whether the key can be used for signing */
	can_sign?: boolean | null;
	/** The date and time when the GPG key was created */
	created_at?: string | null;
	/** List of email addresses associated with this GPG key */
	emails?: Array<GiteaGPGKeyEmail> | null;
	/** The date and time when the GPG key expires */
	expires_at?: string | null;
	/** The unique identifier of the GPG key */
	id?: number | null;
	/** The key ID of the GPG key */
	key_id?: string | null;
	/** The primary key ID of the GPG key */
	primary_key_id?: string | null;
	/** The public key content in armored format */
	public_key?: string | null;
	/** List of subkeys of this GPG key */
	subkeys?: Array<GiteaGPGKey> | null;
	/** Whether the GPG key has been verified */
	verified?: boolean | null;
};

/** GPGKeyEmail an email attached to a GPGKey */
export type GiteaGPGKeyEmail = {
	/** The email address associated with the GPG key */
	email?: string | null;
	/** Whether the email address has been verified */
	verified?: boolean | null;
};

/** GeneralAPISettings contains global api settings exposed by it */
export type GiteaGeneralAPISettings = {
	/** DefaultGitTreesPerPage is the default number of Git tree items per page */
	default_git_trees_per_page?: number | null;
	/** DefaultMaxBlobSize is the default maximum blob size for API responses */
	default_max_blob_size?: number | null;
	/** DefaultMaxResponseSize is the default maximum response size */
	default_max_response_size?: number | null;
	/** DefaultPagingNum is the default number of items per page */
	default_paging_num?: number | null;
	/** MaxResponseItems is the maximum number of items returned in API responses */
	max_response_items?: number | null;
};

/** GeneralAttachmentSettings contains global Attachment settings exposed by API */
export type GiteaGeneralAttachmentSettings = {
	/** AllowedTypes contains the allowed file types for attachments */
	allowed_types?: string | null;
	/** Enabled indicates if file attachments are enabled */
	enabled?: boolean | null;
	/** MaxFiles is the maximum number of files per attachment */
	max_files?: number | null;
	/** MaxSize is the maximum size for individual attachments */
	max_size?: number | null;
};

/** GeneralRepoSettings contains global repository settings exposed by API */
export type GiteaGeneralRepoSettings = {
	/** HTTPGitDisabled indicates if HTTP Git operations are disabled */
	http_git_disabled?: boolean | null;
	/** LFSDisabled indicates if Git LFS support is disabled */
	lfs_disabled?: boolean | null;
	/** MigrationsDisabled indicates if repository migrations are disabled */
	migrations_disabled?: boolean | null;
	/** MirrorsDisabled indicates if repository mirroring is disabled */
	mirrors_disabled?: boolean | null;
	/** StarsDisabled indicates if repository starring is disabled */
	stars_disabled?: boolean | null;
	/** TimeTrackingDisabled indicates if time tracking is disabled */
	time_tracking_disabled?: boolean | null;
};

/** GeneralUISettings contains global ui settings exposed by API */
export type GiteaGeneralUISettings = {
	/** AllowedReactions contains the list of allowed emoji reactions */
	allowed_reactions?: Array<string> | null;
	/** CustomEmojis contains the list of custom emojis */
	custom_emojis?: Array<string> | null;
	/** DefaultTheme is the default UI theme */
	default_theme?: string | null;
};

/** GitBlobResponse represents a git blob */
export type GiteaGitBlobResponse = {
	/** The content of the git blob (may be base64 encoded) */
	content?: string | null;
	/** The encoding used for the content (e.g., "base64") */
	encoding?: string | null;
	/** The LFS object ID if this blob is stored in LFS */
	lfs_oid?: string | null;
	/** The size of the LFS object if this blob is stored in LFS */
	lfs_size?: number | null;
	/** The SHA hash of the git blob */
	sha?: string | null;
	/** The size of the git blob in bytes */
	size?: number | null;
	/** The URL to access this git blob */
	url?: string | null;
};

/** GitEntry represents a git tree */
export type GiteaGitEntry = {
	/** Mode is the file mode (permissions) */
	mode?: string | null;
	/** Path is the file or directory path */
	path?: string | null;
	/** SHA is the Git object SHA */
	sha?: string | null;
	/** Size is the file size in bytes */
	size?: number | null;
	/** Type indicates if this is a file, directory, or symlink */
	type?: string | null;
	/** URL is the API URL for this tree entry */
	url?: string | null;
};

/** GitHook represents a Git repository hook */
export type GiteaGitHook = {
	/** Content contains the script content of the hook */
	content?: string | null;
	/** IsActive indicates if the hook is active */
	is_active?: boolean | null;
	/** Name is the name of the Git hook */
	name?: string | null;
};

export type GiteaGitObject = {
	/** The SHA hash of the Git object */
	sha?: string | null;
	/** The type of the Git object (e.g., commit, tag, tree, blob) */
	type?: string | null;
	/** The URL to access this Git object */
	url?: string | null;
};

/** GitTreeResponse returns a git tree */
export type GiteaGitTreeResponse = {
	/** Page is the current page number for pagination */
	page?: number | null;
	/** SHA is the tree object SHA */
	sha?: string | null;
	/** TotalCount is the total number of entries in the tree */
	total_count?: number | null;
	/** Entries contains the tree entries (files and directories) */
	tree?: Array<GiteaGitEntry> | null;
	/** Truncated indicates if the response was truncated due to size */
	truncated?: boolean | null;
	/** URL is the API URL for this tree */
	url?: string | null;
};

/** GitignoreTemplateInfo name and text of a gitignore template */
export type GiteaGitignoreTemplateInfo = {
	/** Name is the name of the gitignore template */
	name?: string | null;
	/** Source contains the content of the gitignore template */
	source?: string | null;
};

/** Hook a hook is a web hook when one repository changed */
export type GiteaHook = {
	/** Whether the webhook is active and will be triggered */
	active?: boolean | null;
	/** Authorization header to include in webhook requests */
	authorization_header?: string | null;
	/** Branch filter pattern to determine which branches trigger the webhook */
	branch_filter?: string | null;
	/** Configuration settings for the webhook */
	config?: Record<string, string> | null;
	/** The date and time when the webhook was created */
	created_at?: string | null;
	/** List of events that trigger this webhook */
	events?: Array<string> | null;
	/** The unique identifier of the webhook */
	id?: number | null;
	/** Optional human-readable name for the webhook */
	name?: string | null;
	/** The type of the webhook (e.g., gitea, slack, discord) */
	type?: string | null;
	/** The date and time when the webhook was last updated */
	updated_at?: string | null;
};

/** InternalTracker represents settings for internal tracker */
export type GiteaInternalTracker = {
	/** Let only contributors track time (Built-in issue tracker) */
	allow_only_contributors_to_track_time?: boolean | null;
	/** Enable dependencies for issues and pull requests (Built-in issue tracker) */
	enable_issue_dependencies?: boolean | null;
	/** Enable time tracking (Built-in issue tracker) */
	enable_time_tracker?: boolean | null;
};

/** Issue represents an issue in a repository */
export type GiteaIssue = {
	assets?: Array<GiteaAttachment> | null;
	assignee?: GiteaUser | null;
	assignees?: Array<GiteaUser> | null;
	body?: string | null;
	closed_at?: string | null;
	comments?: number | null;
	/** The version of the issue content for optimistic locking */
	content_version?: number | null;
	created_at?: string | null;
	due_date?: string | null;
	html_url?: string | null;
	id?: number | null;
	is_locked?: boolean | null;
	labels?: Array<GiteaLabel> | null;
	milestone?: GiteaMilestone | null;
	number?: number | null;
	original_author?: string | null;
	original_author_id?: number | null;
	pin_order?: number | null;
	projects?: Array<GiteaProject> | null;
	pull_request?: GiteaPullRequestMeta | null;
	ref?: string | null;
	repository?: GiteaRepositoryMeta | null;
	state?: string | null;
	time_estimate?: number | null;
	title?: string | null;
	updated_at?: string | null;
	url?: string | null;
	user?: GiteaUser | null;
};

export type GiteaIssueConfig = {
	blank_issues_enabled?: boolean | null;
	contact_links?: Array<GiteaIssueConfigContactLink> | null;
};

export type GiteaIssueConfigContactLink = {
	about?: string | null;
	name?: string | null;
	url?: string | null;
};

export type GiteaIssueConfigValidation = {
	message?: string | null;
	valid?: boolean | null;
};

/** IssueDeadline represents an issue deadline */
export type GiteaIssueDeadline = {
	due_date?: string | null;
};

/** IssueFormField represents a form field */
export type GiteaIssueFormField = {
	attributes?: Record<string, GiteaJsonValue> | null;
	id?: string | null;
	type?: string | null;
	validations?: Record<string, GiteaJsonValue> | null;
	visible?: Array<string> | null;
};

/** IssueTemplate represents an issue template for a repository */
export type GiteaIssueTemplate = {
	about?: string | null;
	assignees?: GiteaIssueTemplateStringSlice | null;
	body?: Array<GiteaIssueFormField> | null;
	content?: string | null;
	file_name?: string | null;
	labels?: GiteaIssueTemplateStringSlice | null;
	name?: string | null;
	ref?: string | null;
	title?: string | null;
};

export type GiteaIssueTemplateStringSlice = Array<string>;

/** Label a label to an issue or a pr */
export type GiteaLabel = {
	color?: string | null;
	/** Description provides additional context about the label's purpose */
	description?: string | null;
	exclusive?: boolean | null;
	/** ID is the unique identifier for the label */
	id?: number | null;
	is_archived?: boolean | null;
	/** Name is the display name of the label */
	name?: string | null;
	/** URL is the API endpoint for accessing this label */
	url?: string | null;
};

/** LabelTemplate info of a Label template */
export type GiteaLabelTemplate = {
	color?: string | null;
	/** Description provides additional context about the label template's purpose */
	description?: string | null;
	exclusive?: boolean | null;
	/** Name is the display name of the label template */
	name?: string | null;
};

/** LicensesInfo contains information about a License */
export type GiteaLicenseTemplateInfo = {
	/** Body contains the full text of the license */
	body?: string | null;
	/** Implementation contains license implementation details */
	implementation?: string | null;
	/** Key is the unique identifier for the license template */
	key?: string | null;
	/** Name is the display name of the license */
	name?: string | null;
	/** URL is the reference URL for the license */
	url?: string | null;
};

/** LicensesListEntry is used for the API */
export type GiteaLicensesTemplateListEntry = {
	/** Key is the unique identifier for the license template */
	key?: string | null;
	/** Name is the display name of the license */
	name?: string | null;
	/** URL is the reference URL for the license */
	url?: string | null;
};

export type GiteaMergeUpstreamResponse = {
	merge_type?: string | null;
};

/** Milestone milestone is a collection of issues on one repository */
export type GiteaMilestone = {
	closed_at?: string | null;
	/** ClosedIssues is the number of closed issues in this milestone */
	closed_issues?: number | null;
	created_at?: string | null;
	/** Description provides details about the milestone */
	description?: string | null;
	due_on?: string | null;
	/** ID is the unique identifier for the milestone */
	id?: number | null;
	/** OpenIssues is the number of open issues in this milestone */
	open_issues?: number | null;
	/** State indicates if the milestone is open or closed */
	state?: string | null;
	/** Title is the title of the milestone */
	title?: string | null;
	updated_at?: string | null;
};

/** NewIssuePinsAllowed represents an API response that says if new Issue Pins are allowed */
export type GiteaNewIssuePinsAllowed = {
	issues?: boolean | null;
	pull_requests?: boolean | null;
};

/** Note contains information related to a git note */
export type GiteaNote = {
	commit?: GiteaCommit | null;
	/** The content message of the git note */
	message?: string | null;
};

/** NotificationCount number of unread notifications */
export type GiteaNotificationCount = {
	/** New is the number of unread notifications */
	new?: number | null;
};

/** NotificationSubject contains the notification subject (Issue/Pull/Commit) */
export type GiteaNotificationSubject = {
	/** HTMLURL is the web URL for the notification subject */
	html_url?: string | null;
	/** LatestCommentHTMLURL is the web URL for the latest comment */
	latest_comment_html_url?: string | null;
	/** LatestCommentURL is the API URL for the latest comment */
	latest_comment_url?: string | null;
	/** State indicates the current state of the notification subject */
	state?: string | null;
	/** Title is the title of the notification subject */
	title?: string | null;
	/** Type indicates the type of the notification subject */
	type?: string | null;
	/** URL is the API URL for the notification subject */
	url?: string | null;
};

/** NotificationThread expose Notification on API */
export type GiteaNotificationThread = {
	/** ID is the unique identifier for the notification thread */
	id?: number | null;
	/** Pinned indicates if the notification is pinned */
	pinned?: boolean | null;
	repository?: GiteaRepository | null;
	subject?: GiteaNotificationSubject | null;
	/** Unread indicates if the notification has been read */
	unread?: boolean | null;
	/** UpdatedAt is the time when the notification was last updated */
	updated_at?: string | null;
	/** URL is the API URL for this notification thread */
	url?: string | null;
};

export type GiteaOAuth2Application = {
	/** The client ID of the OAuth2 application */
	client_id?: string | null;
	/** The client secret of the OAuth2 application */
	client_secret?: string | null;
	/** Whether the client is confidential */
	confidential_client?: boolean | null;
	/** The timestamp when the application was created */
	created?: string | null;
	/** The unique identifier of the OAuth2 application */
	id?: number | null;
	/** The name of the OAuth2 application */
	name?: string | null;
	/** The list of allowed redirect URIs */
	redirect_uris?: Array<string> | null;
	/** Whether to skip secondary authorization */
	skip_secondary_authorization?: boolean | null;
};

/** Organization represents an organization */
export type GiteaOrganization = {
	/** The URL of the organization's avatar */
	avatar_url?: string | null;
	/** The description of the organization */
	description?: string | null;
	/** The email address of the organization */
	email?: string | null;
	/** The full display name of the organization */
	full_name?: string | null;
	/** The unique identifier of the organization */
	id?: number | null;
	/** The location of the organization */
	location?: string | null;
	/** The name of the organization */
	name?: string | null;
	/** Whether repository administrators can change team access */
	repo_admin_change_team_access?: boolean | null;
	/** username of the organization deprecated */
	username?: string | null;
	/** The visibility level of the organization (public, limited, private) */
	visibility?: string | null;
	/** The website URL of the organization */
	website?: string | null;
};

/** OrganizationPermissions list different users permissions on an organization */
export type GiteaOrganizationPermissions = {
	/** Whether the user can create repositories in the organization */
	can_create_repository?: boolean | null;
	/** Whether the user can read the organization */
	can_read?: boolean | null;
	/** Whether the user can write to the organization */
	can_write?: boolean | null;
	/** Whether the user is an admin of the organization */
	is_admin?: boolean | null;
	/** Whether the user is an owner of the organization */
	is_owner?: boolean | null;
};

/** PRBranchInfo information about a branch */
export type GiteaPRBranchInfo = {
	/** The display name of the branch */
	label?: string | null;
	/** The git reference of the branch */
	ref?: string | null;
	repo?: GiteaRepository | null;
	/** The unique identifier of the repository */
	repo_id?: number | null;
	/** The commit SHA of the branch head */
	sha?: string | null;
};

/** Package represents a package */
export type GiteaPackage = {
	/** The date and time when the package was created */
	created_at?: string | null;
	creator?: GiteaUser | null;
	/** The HTML URL to view the package */
	html_url?: string | null;
	/** The unique identifier of the package */
	id?: number | null;
	/** The name of the package */
	name?: string | null;
	owner?: GiteaUser | null;
	repository?: GiteaRepository | null;
	/** The type of the package (e.g., npm, maven, docker) */
	type?: string | null;
	/** The version of the package */
	version?: string | null;
};

/** PackageFile represents a package file */
export type GiteaPackageFile = {
	/** The unique identifier of the package file */
	id?: number | null;
	/** The MD5 hash of the package file */
	md5?: string | null;
	/** The name of the package file */
	name?: string | null;
	/** The SHA1 hash of the package file */
	sha1?: string | null;
	/** The SHA256 hash of the package file */
	sha256?: string | null;
	/** The SHA512 hash of the package file */
	sha512?: string | null;
	/** The size of the package file in bytes */
	size?: number | null;
};

/** PayloadCommit represents a commit */
export type GiteaPayloadCommit = {
	/** List of files added in this commit */
	added?: Array<string> | null;
	author?: GiteaPayloadUser | null;
	committer?: GiteaPayloadUser | null;
	/** sha1 hash of the commit */
	id?: string | null;
	/** The commit message */
	message?: string | null;
	/** List of files modified in this commit */
	modified?: Array<string> | null;
	/** List of files removed in this commit */
	removed?: Array<string> | null;
	/** The timestamp when the commit was made */
	timestamp?: string | null;
	/** The URL to view this commit */
	url?: string | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** PayloadCommitVerification represents the GPG verification of a commit */
export type GiteaPayloadCommitVerification = {
	/** The signed payload content */
	payload?: string | null;
	/** The reason for the verification status */
	reason?: string | null;
	/** The GPG signature of the commit */
	signature?: string | null;
	signer?: GiteaPayloadUser | null;
	/** Whether the commit signature is verified */
	verified?: boolean | null;
};

/** PayloadUser represents the author or committer of a commit */
export type GiteaPayloadUser = {
	email?: string | null;
	/** Full name of the commit author */
	name?: string | null;
	/** username of the user */
	username?: string | null;
};

/** Permission represents a set of permissions */
export type GiteaPermission = {
	admin?: boolean | null;
	pull?: boolean | null;
	push?: boolean | null;
};

/** Projects track issues and pull requests, standalone note cards are not supported. */
export type GiteaProject = {
	/** Card type: "text_only" or "images_and_text" */
	card_type?: string | null;
	closed_at?: string | null;
	created_at?: string | null;
	creator?: GiteaUser | null;
	/** Deprecated: use Creator instead */
	creator_id?: number | null;
	description?: string | null;
	html_url?: string | null;
	id?: number | null;
	/** Deprecated: use State instead */
	is_closed?: boolean | null;
	num_closed_issues?: number | null;
	num_issues?: number | null;
	num_open_issues?: number | null;
	owner_id?: number | null;
	repo_id?: number | null;
	state?: string | null;
	/** Template type: "none", "basic_kanban" or "bug_triage" */
	template_type?: string | null;
	title?: string | null;
	/** Project type: "individual", "repository" or "organization" */
	type?: string | null;
	/** null only for legacy rows that carry no update timestamp */
	updated_at?: string | null;
};

/** ProjectColumn represents a project column (board) */
export type GiteaProjectColumn = {
	color?: string | null;
	created_at?: string | null;
	creator?: GiteaUser | null;
	default?: boolean | null;
	id?: number | null;
	project_id?: number | null;
	sorting?: number | null;
	title?: string | null;
	/** null only for legacy rows that carry no update timestamp */
	updated_at?: string | null;
};

/** PublicKey publickey is a user key to push code to repository */
export type GiteaPublicKey = {
	/** Created is the time when the key was added */
	created_at?: string | null;
	/** Fingerprint is the key's fingerprint */
	fingerprint?: string | null;
	/** ID is the unique identifier for the public key */
	id?: number | null;
	/** Key contains the actual SSH public key content */
	key?: string | null;
	/** KeyType indicates the type of the SSH key */
	key_type?: string | null;
	/** Updated is the time when the key was last used */
	last_used_at?: string | null;
	/** ReadOnly indicates if the key has read-only access */
	read_only?: boolean | null;
	/** Title is the human-readable name for the key */
	title?: string | null;
	/** URL is the API URL for this key */
	url?: string | null;
	user?: GiteaUser | null;
};

/** PullRequest represents a pull request */
export type GiteaPullRequest = {
	/** The number of lines added in the pull request */
	additions?: number | null;
	/** Whether maintainers can edit the pull request */
	allow_maintainer_edit?: boolean | null;
	assignee?: GiteaUser | null;
	/** The list of users assigned to the pull request */
	assignees?: Array<GiteaUser> | null;
	base?: GiteaPRBranchInfo | null;
	/** The description body of the pull request */
	body?: string | null;
	/** The number of files changed in the pull request */
	changed_files?: number | null;
	closed_at?: string | null;
	/** The number of comments on the pull request */
	comments?: number | null;
	/** The version of the pull request content for optimistic locking */
	content_version?: number | null;
	created_at?: string | null;
	/** The number of lines deleted in the pull request */
	deletions?: number | null;
	/** The URL to download the diff patch */
	diff_url?: string | null;
	/** Whether the pull request is a draft */
	draft?: boolean | null;
	due_date?: string | null;
	head?: GiteaPRBranchInfo | null;
	/** The HTML URL to view the pull request */
	html_url?: string | null;
	/** The unique identifier of the pull request */
	id?: number | null;
	/** Whether the pull request conversation is locked */
	is_locked?: boolean | null;
	/** The labels attached to the pull request */
	labels?: Array<GiteaLabel> | null;
	/** The merge base commit SHA */
	merge_base?: string | null;
	/** The SHA of the merge commit */
	merge_commit_sha?: string | null;
	/** Whether the pull request can be merged */
	mergeable?: boolean | null;
	/** Whether the pull request has been merged */
	merged?: boolean | null;
	merged_at?: string | null;
	merged_by?: GiteaUser | null;
	milestone?: GiteaMilestone | null;
	/** The pull request number */
	number?: number | null;
	/** The URL to download the patch file */
	patch_url?: string | null;
	/** The pin order for the pull request */
	pin_order?: number | null;
	/** The users requested to review the pull request */
	requested_reviewers?: Array<GiteaUser> | null;
	/** The teams requested to review the pull request */
	requested_reviewers_teams?: Array<GiteaTeam> | null;
	/** number of review comments made on the diff of a PR review (not including comments on commits or issues in a PR) */
	review_comments?: number | null;
	/** The current state of the pull request */
	state?: string | null;
	/** The title of the pull request */
	title?: string | null;
	updated_at?: string | null;
	/** The API URL of the pull request */
	url?: string | null;
	user?: GiteaUser | null;
};

/** PullRequestMeta PR info if an issue is a PR */
export type GiteaPullRequestMeta = {
	draft?: boolean | null;
	html_url?: string | null;
	merged?: boolean | null;
	merged_at?: string | null;
};

/** PullRequestMinimal is the minimal information about a pull request, as returned in the `pull_requests` field of a workflow run. */
export type GiteaPullRequestMinimal = {
	base?: GiteaPullRequestMinimalHead | null;
	head?: GiteaPullRequestMinimalHead | null;
	id?: number | null;
	number?: number | null;
	url?: string | null;
};

export type GiteaPullRequestMinimalHead = {
	ref?: string | null;
	repo?: GiteaPullRequestMinimalHeadRepo | null;
	sha?: string | null;
};

export type GiteaPullRequestMinimalHeadRepo = {
	id?: number | null;
	name?: string | null;
	url?: string | null;
};

/** PullReview represents a pull request review */
export type GiteaPullReview = {
	body?: string | null;
	comments_count?: number | null;
	commit_id?: string | null;
	dismissed?: boolean | null;
	/** HTMLURL is the web URL for viewing the review */
	html_url?: string | null;
	id?: number | null;
	official?: boolean | null;
	/** HTMLPullURL is the web URL for the pull request */
	pull_request_url?: string | null;
	stale?: boolean | null;
	state?: string | null;
	submitted_at?: string | null;
	team?: GiteaTeam | null;
	updated_at?: string | null;
	user?: GiteaUser | null;
};

/** PullReviewComment represents a comment on a pull request review */
export type GiteaPullReviewComment = {
	body?: string | null;
	commit_id?: string | null;
	created_at?: string | null;
	diff_hunk?: string | null;
	html_url?: string | null;
	id?: number | null;
	original_commit_id?: string | null;
	original_position?: number | null;
	path?: string | null;
	position?: number | null;
	pull_request_review_id?: number | null;
	pull_request_url?: string | null;
	resolver?: GiteaUser | null;
	updated_at?: string | null;
	user?: GiteaUser | null;
};

/** PushMirror represents information of a push mirror */
export type GiteaPushMirror = {
	created?: string | null;
	/** The sync interval for automatic updates */
	interval?: string | null;
	/** The last error message encountered during sync */
	last_error?: string | null;
	last_update?: string | null;
	/** The remote repository URL being mirrored to */
	remote_address?: string | null;
	/** The name of the remote in the git configuration */
	remote_name?: string | null;
	/** The name of the source repository */
	repo_name?: string | null;
	/** Whether to sync on every commit */
	sync_on_commit?: boolean | null;
};

/** Reaction contain one reaction */
export type GiteaReaction = {
	/** The reaction content (e.g., emoji or reaction type) */
	content?: string | null;
	/** The date and time when the reaction was created */
	created_at?: string | null;
	user?: GiteaUser | null;
};

export type GiteaReference = {
	object?: GiteaGitObject | null;
	/** The name of the Git reference (e.g., refs/heads/main) */
	ref?: string | null;
	/** The URL to access this Git reference */
	url?: string | null;
};

/** Release represents a repository release */
export type GiteaRelease = {
	/** The files attached to the release */
	assets?: Array<GiteaAttachment> | null;
	author?: GiteaUser | null;
	/** The release notes or description */
	body?: string | null;
	created_at?: string | null;
	/** Whether the release is a draft */
	draft?: boolean | null;
	/** The HTML URL to view the release */
	html_url?: string | null;
	/** The unique identifier of the release */
	id?: number | null;
	/** The display title of the release */
	name?: string | null;
	/** Whether the release is a prerelease */
	prerelease?: boolean | null;
	published_at?: string | null;
	/** The name of the git tag associated with the release */
	tag_name?: string | null;
	/** The URL to download the tarball archive */
	tarball_url?: string | null;
	/** The target commitish for the release */
	target_commitish?: string | null;
	/** The URL template for uploading release assets */
	upload_url?: string | null;
	/** The API URL of the release */
	url?: string | null;
	/** The URL to download the zip archive */
	zipball_url?: string | null;
};

/** RepoCollaboratorPermission to get repository permission for a collaborator */
export type GiteaRepoCollaboratorPermission = {
	/** Permission level of the collaborator */
	permission?: string | null;
	/** RoleName is the name of the permission role */
	role_name?: string | null;
	user?: GiteaUser | null;
};

export type GiteaRepoCommit = {
	author?: GiteaCommitUser | null;
	committer?: GiteaCommitUser | null;
	/** Message is the commit message */
	message?: string | null;
	tree?: GiteaCommitMeta | null;
	/** URL is the API URL for the commit */
	url?: string | null;
	verification?: GiteaPayloadCommitVerification | null;
};

/** RepoTransfer represents a pending repo transfer */
export type GiteaRepoTransfer = {
	doer?: GiteaUser | null;
	recipient?: GiteaUser | null;
	teams?: Array<GiteaTeam> | null;
};

/** Repository represents a repository */
export type GiteaRepository = {
	allow_fast_forward_only_merge?: boolean | null;
	allow_manual_merge?: boolean | null;
	allow_merge_commits?: boolean | null;
	allow_merge_update?: boolean | null;
	allow_rebase?: boolean | null;
	allow_rebase_explicit?: boolean | null;
	allow_rebase_update?: boolean | null;
	allow_squash_merge?: boolean | null;
	archived?: boolean | null;
	archived_at?: string | null;
	autodetect_manual_merge?: boolean | null;
	avatar_url?: string | null;
	branch_count?: number | null;
	clone_url?: string | null;
	created_at?: string | null;
	default_allow_maintainer_edit?: boolean | null;
	default_branch?: string | null;
	default_delete_branch_after_merge?: boolean | null;
	default_merge_style?: string | null;
	default_target_branch?: string | null;
	default_update_style?: string | null;
	description?: string | null;
	empty?: boolean | null;
	external_tracker?: GiteaExternalTracker | null;
	external_wiki?: GiteaExternalWiki | null;
	fork?: boolean | null;
	forks_count?: number | null;
	full_name?: string | null;
	has_actions?: boolean | null;
	has_code?: boolean | null;
	has_issues?: boolean | null;
	has_packages?: boolean | null;
	has_projects?: boolean | null;
	has_pull_requests?: boolean | null;
	has_releases?: boolean | null;
	has_wiki?: boolean | null;
	html_url?: string | null;
	id?: number | null;
	ignore_whitespace_conflicts?: boolean | null;
	internal?: boolean | null;
	internal_tracker?: GiteaInternalTracker | null;
	language?: string | null;
	languages_url?: string | null;
	licenses?: Array<string> | null;
	link?: string | null;
	mirror?: boolean | null;
	mirror_interval?: string | null;
	mirror_last_sync_at?: string | null;
	mirror_updated?: string | null;
	name?: string | null;
	/** ObjectFormatName of the underlying git repository */
	object_format_name?: string | null;
	open_issues_count?: number | null;
	open_pr_counter?: number | null;
	original_url?: string | null;
	owner?: GiteaUser | null;
	parent?: GiteaRepository | null;
	permissions?: GiteaPermission | null;
	private?: boolean | null;
	projects_mode?: string | null;
	release_counter?: number | null;
	repo_transfer?: GiteaRepoTransfer | null;
	size?: number | null;
	ssh_url?: string | null;
	stars_count?: number | null;
	template?: boolean | null;
	topics?: Array<string> | null;
	updated_at?: string | null;
	url?: string | null;
	watchers_count?: number | null;
	website?: string | null;
};

/** RepositoryMeta basic repository information */
export type GiteaRepositoryMeta = {
	full_name?: string | null;
	id?: number | null;
	name?: string | null;
	owner?: string | null;
};

/** RunDetails returns workflow_dispatch runid and url */
export type GiteaRunDetails = {
	html_url?: string | null;
	run_url?: string | null;
	workflow_run_id?: number | null;
};

/** SearchResults results of a successful search */
export type GiteaSearchResults = {
	/** Data contains the repository search results */
	data?: Array<GiteaRepository> | null;
	/** OK indicates if the search was successful */
	ok?: boolean | null;
};

/** Secret represents a secret */
export type GiteaSecret = {
	created_at?: string | null;
	/** the secret's description */
	description?: string | null;
	/** the secret's name */
	name?: string | null;
};

/** ServerVersion wraps the version of the server */
export type GiteaServerVersion = {
	/** Version is the server version string */
	version?: string | null;
};

/** StopWatch represent a running stopwatch */
export type GiteaStopWatch = {
	/** Created is the time when the stopwatch was started */
	created?: string | null;
	/** Duration is a human-readable duration string */
	duration?: string | null;
	/** IssueIndex is the index number of the associated issue */
	issue_index?: number | null;
	/** IssueTitle is the title of the associated issue */
	issue_title?: string | null;
	/** RepoName is the name of the repository */
	repo_name?: string | null;
	/** RepoOwnerName is the name of the repository owner */
	repo_owner_name?: string | null;
	/** Seconds is the total elapsed time in seconds */
	seconds?: number | null;
};

/** Tag represents a repository tag */
export type GiteaTag = {
	commit?: GiteaCommitMeta | null;
	/** The ID (SHA) of the tag */
	id?: string | null;
	/** The message associated with the tag */
	message?: string | null;
	/** The name of the tag */
	name?: string | null;
	/** The URL to download the tarball archive */
	tarball_url?: string | null;
	/** The URL to download the zipball archive */
	zipball_url?: string | null;
};

/** TagProtection represents a tag protection */
export type GiteaTagProtection = {
	/** The date and time when the tag protection was created */
	created_at?: string | null;
	/** The unique identifier of the tag protection */
	id?: number | null;
	/** The pattern to match tag names for protection */
	name_pattern?: string | null;
	/** The date and time when the tag protection was last updated */
	updated_at?: string | null;
	/** List of team names allowed to create/delete protected tags */
	whitelist_teams?: Array<string> | null;
	/** List of usernames allowed to create/delete protected tags */
	whitelist_usernames?: Array<string> | null;
};

/** Team represents a team in an organization */
export type GiteaTeam = {
	/** Whether the team can create repositories in the organization */
	can_create_org_repo?: boolean | null;
	/** The description of the team */
	description?: string | null;
	/** The unique identifier of the team */
	id?: number | null;
	/** Whether the team has access to all repositories in the organization */
	includes_all_repositories?: boolean | null;
	/** The name of the team */
	name?: string | null;
	organization?: GiteaOrganization | null;
	permission?: string | null;
	/** Deprecated: This variable should be replaced by UnitsMap and will be dropped in later versions. */
	units?: Array<string> | null;
	units_map?: Record<string, string> | null;
	/** Team visibility within the organization. "private" teams are only listable by members and org owners; "limited" teams are listable by any organization member; "public" teams are listable by any signed-in user. */
	visibility?: string | null;
};

/** TimeStamp defines a timestamp */
export type GiteaTimeStamp = number;

/** TimelineComment represents a timeline comment (comment of any type) on a commit or issue */
export type GiteaTimelineComment = {
	assignee?: GiteaUser | null;
	assignee_team?: GiteaTeam | null;
	/** Body contains the timeline event content */
	body?: string | null;
	created_at?: string | null;
	dependent_issue?: GiteaIssue | null;
	/** HTMLURL is the web URL for viewing the comment */
	html_url?: string | null;
	/** ID is the unique identifier for the timeline comment */
	id?: number | null;
	/** IssueURL is the API URL for the issue */
	issue_url?: string | null;
	label?: GiteaLabel | null;
	milestone?: GiteaMilestone | null;
	new_ref?: string | null;
	new_title?: string | null;
	old_milestone?: GiteaMilestone | null;
	old_project_id?: number | null;
	old_ref?: string | null;
	old_title?: string | null;
	project_id?: number | null;
	/** PRURL is the API URL for the pull request (if applicable) */
	pull_request_url?: string | null;
	ref_action?: string | null;
	ref_comment?: GiteaComment | null;
	/** commit SHA where issue/PR was referenced */
	ref_commit_sha?: string | null;
	ref_issue?: GiteaIssue | null;
	/** whether the assignees were removed or added */
	removed_assignee?: boolean | null;
	resolve_doer?: GiteaUser | null;
	review_id?: number | null;
	tracked_time?: GiteaTrackedTime | null;
	/** Type indicates the type of timeline event */
	type?: string | null;
	updated_at?: string | null;
	user?: GiteaUser | null;
};

/** TopicListResponse returns a list of TopicResponse */
export type GiteaTopicListResponse = {
	topics?: Array<GiteaTopicResponse> | null;
};

/** TopicName a list of repo topic names */
export type GiteaTopicName = {
	/** List of topic names */
	topics?: Array<string> | null;
};

/** TopicResponse for returning topics */
export type GiteaTopicResponse = {
	/** The date and time when the topic was created */
	created?: string | null;
	/** The unique identifier of the topic */
	id?: number | null;
	/** The number of repositories using this topic */
	repo_count?: number | null;
	/** The name of the topic */
	topic_name?: string | null;
	/** The date and time when the topic was last updated */
	updated?: string | null;
};

/** TrackedTime worked time for an issue / pr */
export type GiteaTrackedTime = {
	created?: string | null;
	/** ID is the unique identifier for the tracked time entry */
	id?: number | null;
	issue?: GiteaIssue | null;
	/** deprecated (only for backwards compatibility) */
	issue_id?: number | null;
	/** Time in seconds */
	time?: number | null;
	/** deprecated (only for backwards compatibility) */
	user_id?: number | null;
	/** username of the user */
	user_name?: string | null;
};

/** User represents a user */
export type GiteaUser = {
	/** Is user active */
	active?: boolean | null;
	/** URL to the user's avatar */
	avatar_url?: string | null;
	created?: string | null;
	/** the user's description */
	description?: string | null;
	email?: string | null;
	/** user counts */
	followers_count?: number | null;
	following_count?: number | null;
	/** the user's full name */
	full_name?: string | null;
	/** URL to the user's gitea page */
	html_url?: string | null;
	/** the user's id */
	id?: number | null;
	/** Is the user an administrator */
	is_admin?: boolean | null;
	/** User locale */
	language?: string | null;
	last_login?: string | null;
	/** the user's location */
	location?: string | null;
	/** login of the user, same as `username` */
	login?: string | null;
	/** identifier of the user, provided by the external authenticator (if configured) */
	login_name?: string | null;
	/** Is user login prohibited */
	prohibit_login?: boolean | null;
	/** Is user restricted */
	restricted?: boolean | null;
	/** The ID of the user's Authentication Source */
	source_id?: number | null;
	starred_repos_count?: number | null;
	/** the user type */
	type?: string | null;
	/** User visibility level option: public, limited, private */
	visibility?: string | null;
	/** the user's website */
	website?: string | null;
};

/** UserHeatmapData represents the data needed to create a heatmap */
export type GiteaUserHeatmapData = {
	contributions?: number | null;
	timestamp?: GiteaTimeStamp | null;
};

export type GiteaUserMeta = {
	/** The unique identifier of the user */
	id?: number | null;
	/** The username of the user */
	login?: string | null;
};

/** UserSettings represents user settings */
export type GiteaUserSettings = {
	description?: string | null;
	diff_view_style?: string | null;
	full_name?: string | null;
	hide_activity?: boolean | null;
	/** Privacy */
	hide_email?: boolean | null;
	language?: string | null;
	location?: string | null;
	theme?: string | null;
	website?: string | null;
};

/** WatchInfo represents an API watch status of one repository */
export type GiteaWatchInfo = {
	/** The timestamp when the watch status was created */
	created_at?: string | null;
	/** Whether notifications for the repository are ignored */
	ignored?: boolean | null;
	/** The reason for the current watch status */
	reason?: GiteaJsonValue | null;
	/** The URL of the repository being watched */
	repository_url?: string | null;
	/** Whether the repository is being watched for notifications */
	subscribed?: boolean | null;
	/** The URL for managing the watch status */
	url?: string | null;
};

/** WikiCommit page commit/revision */
export type GiteaWikiCommit = {
	author?: GiteaCommitUser | null;
	commiter?: GiteaCommitUser | null;
	/** The commit message */
	message?: string | null;
	/** The commit SHA hash */
	sha?: string | null;
};

/** WikiCommitList commit/revision list */
export type GiteaWikiCommitList = {
	/** The list of wiki commits */
	commits?: Array<GiteaWikiCommit> | null;
	/** The total count of commits */
	count?: number | null;
};

/** WikiPage a wiki page */
export type GiteaWikiPage = {
	/** The number of commits that modified this page */
	commit_count?: number | null;
	/** Page content, base64 encoded */
	content_base64?: string | null;
	/** The footer content for the wiki page */
	footer?: string | null;
	/** The HTML URL to view the wiki page */
	html_url?: string | null;
	last_commit?: GiteaWikiCommit | null;
	/** The sidebar content for the wiki page */
	sidebar?: string | null;
	/** The sub URL path for the wiki page */
	sub_url?: string | null;
	/** The title of the wiki page */
	title?: string | null;
};

/** WikiPageMetaData wiki page meta information */
export type GiteaWikiPageMetaData = {
	/** The HTML URL to view the wiki page */
	html_url?: string | null;
	last_commit?: GiteaWikiCommit | null;
	/** The sub URL path for the wiki page */
	sub_url?: string | null;
	/** The title of the wiki page */
	title?: string | null;
};

export type GiteaWebhookPayloads = {
	fork: {
		forkee?: GiteaRepository | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	issueComment: {
		action?: string | null;
		issue?: GiteaIssue | null;
		pull_request?: GiteaPullRequest | null;
		comment?: GiteaComment | null;
		/** What an edit changed: the old title, body or ref. */
		changes?: {
			title?: {
				from?: string | null;
			} | null;
			body?: {
				from?: string | null;
			} | null;
			ref?: {
				from?: string | null;
			} | null;
		} | null;
		is_pull?: boolean | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	issues: {
		action?: string | null;
		number?: number | null;
		/** What an edit changed: the old title, body or ref. */
		changes?: {
			title?: {
				from?: string | null;
			} | null;
			body?: {
				from?: string | null;
			} | null;
			ref?: {
				from?: string | null;
			} | null;
		} | null;
		issue?: GiteaIssue | null;
		commit_id?: string | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	package: {
		action?: string | null;
		package?: GiteaPackage | null;
		organization?: GiteaOrganization | null;
		sender?: GiteaUser | null;
		repository?: GiteaRepository | null;
	};
	pullRequest: {
		action?: string | null;
		number?: number | null;
		/** What an edit changed: the old title, body or ref. */
		changes?: {
			title?: {
				from?: string | null;
			} | null;
			body?: {
				from?: string | null;
			} | null;
			ref?: {
				from?: string | null;
			} | null;
		} | null;
		pull_request?: GiteaPullRequest | null;
		requested_reviewer?: GiteaUser | null;
		commit_id?: string | null;
		/** The review, on review events. */
		review?: {
			type?: string | null;
			content?: string | null;
		} | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	pullRequestReview: {
		action?: string | null;
		number?: number | null;
		/** What an edit changed: the old title, body or ref. */
		changes?: {
			title?: {
				from?: string | null;
			} | null;
			body?: {
				from?: string | null;
			} | null;
			ref?: {
				from?: string | null;
			} | null;
		} | null;
		pull_request?: GiteaPullRequest | null;
		requested_reviewer?: GiteaUser | null;
		commit_id?: string | null;
		/** The review: its type and text. */
		review?: {
			type?: string | null;
			content?: string | null;
		} | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	push: {
		ref?: string | null;
		before?: string | null;
		after?: string | null;
		compare_url?: string | null;
		commits?: Array<GiteaPayloadCommit> | null;
		total_commits?: number | null;
		head_commit?: GiteaPayloadCommit | null;
		pusher?: GiteaUser | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	refCreated: {
		sha?: string | null;
		ref?: string | null;
		ref_type?: string | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	refDeleted: {
		ref?: string | null;
		ref_type?: string | null;
		pusher_type?: string | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	release: {
		action?: string | null;
		release?: GiteaRelease | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	repository: {
		action?: string | null;
		organization?: GiteaOrganization | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	status: {
		commit?: GiteaPayloadCommit | null;
		context?: string | null;
		created_at?: string | null;
		description?: string | null;
		id?: number | null;
		sha?: string | null;
		state?: string | null;
		target_url?: string | null;
		updated_at?: string | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	wiki: {
		action?: string | null;
		page?: string | null;
		comment?: string | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	workflowJob: {
		action?: string | null;
		workflow_job?: GiteaActionWorkflowJob | null;
		pull_request?: GiteaPullRequest | null;
		organization?: GiteaOrganization | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
	workflowRun: {
		action?: string | null;
		workflow?: GiteaActionWorkflow | null;
		workflow_run?: GiteaActionWorkflowRun | null;
		pull_request?: GiteaPullRequest | null;
		organization?: GiteaOrganization | null;
		repository?: GiteaRepository | null;
		sender?: GiteaUser | null;
	};
};

export type GiteaOperationInputs = {
	'actions.artifacts.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the artifact */
		artifact_id: string | number;
	};
	'actions.artifacts.download': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the artifact */
		artifact_id: string | number;
	};
	'actions.artifacts.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the artifact */
		artifact_id: string | number;
	};
	'actions.artifacts.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the artifact */
		name?: string;
	};
	'actions.jobs.downloadLogs': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the job */
		job_id: number;
	};
	'actions.jobs.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the job */
		job_id: string | number;
	};
	'actions.jobs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** sort jobs by attribute. Supported values are "id". Default is "id" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc" */
		order?: string;
	};
	'actions.runners.createRegistrationToken': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'actions.runners.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the runner */
		runner_id: string | number;
	};
	'actions.runners.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the runner */
		runner_id: string | number;
	};
	'actions.runners.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** filter by disabled status (true or false) */
		disabled?: boolean;
	};
	'actions.runners.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the runner */
		runner_id: string | number;
		disabled: boolean;
	};
	'actions.runs.approve': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** run ID */
		run: number;
	};
	'actions.runs.artifacts.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** runid of the workflow run */
		run: number;
		/** name of the artifact */
		name?: string;
	};
	'actions.runs.attempts.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the run */
		run: number;
		/** logical attempt number of the run */
		attempt: number;
	};
	'actions.runs.attempts.jobs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the workflow run */
		run: number;
		/** logical attempt number of the run */
		attempt: number;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'actions.runs.cancel': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** run ID */
		run: number;
	};
	'actions.runs.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** runid of the workflow run */
		run: number;
	};
	'actions.runs.downloadLogs': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** run ID */
		run: number;
	};
	'actions.runs.forceCancel': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** run ID */
		run: number;
	};
	'actions.runs.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the run */
		run: number;
	};
	'actions.runs.jobs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** runid of the workflow run */
		run: number;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** sort jobs by attribute. Supported values are "id". Default is "id" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc" */
		order?: string;
	};
	'actions.runs.jobs.rerun': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the run */
		run: number;
		/** id of the job */
		job_id: number;
	};
	'actions.runs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** workflow event name */
		event?: string;
		/** workflow branch */
		branch?: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** triggered by user */
		actor?: string;
		/** triggering sha of the workflow run */
		head_sha?: string;
		/** if true, the `pull_requests` field on each returned run is emptied */
		exclude_pull_requests?: boolean;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'actions.runs.rerun': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the run */
		run: number;
	};
	'actions.runs.rerunFailed': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** id of the run */
		run: number;
	};
	'actions.secrets.delete': {
		/** owner of the repository */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the secret */
		secretname: string;
	};
	'actions.secrets.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'actions.secrets.set': {
		/** owner of the repository */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the secret */
		secretname: string;
		/** Data of the secret to update */
		data: string;
		/** Description of the secret to update */
		description?: string;
	};
	'actions.tasks.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results, default maximum page size is 50 */
		limit?: number;
	};
	'actions.variables.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the variable */
		variablename: string;
		/** Description of the variable to create */
		description?: string;
		/** Value of the variable to create */
		value: string;
	};
	'actions.variables.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the variable */
		variablename: string;
	};
	'actions.variables.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the variable */
		variablename: string;
	};
	'actions.variables.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'actions.variables.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repository */
		repo: string;
		/** name of the variable */
		variablename: string;
		/** Description of the variable to update */
		description?: string;
		/** New name for the variable. If the field is empty, the variable name won't be updated. */
		name?: string;
		/** Value of the variable to update */
		value: string;
	};
	'actions.workflows.disable': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the workflow */
		workflow_id: string | number;
	};
	'actions.workflows.dispatch': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the workflow */
		workflow_id: string | number;
		inputs?: Record<string, string>;
		ref: string;
		/** Whether the response should include the workflow run ID and URLs. */
		return_run_details?: boolean;
		/** For a scoped workflow, the ID of the source repository providing it; omit or 0 for a repo-level workflow. */
		scoped_workflow_source_repo_id?: number;
	};
	'actions.workflows.enable': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the workflow */
		workflow_id: string | number;
	};
	'actions.workflows.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the workflow */
		workflow_id: string | number;
	};
	'actions.workflows.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'actions.workflows.runs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the workflow, must be the workflow file name (e.g. `build.yml`) */
		workflow_id: string | number;
		/** workflow event name */
		event?: string;
		/** workflow branch */
		branch?: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** triggered by user */
		actor?: string;
		/** triggering sha of the workflow run */
		head_sha?: string;
		/** if true, the `pull_requests` field on each returned run is emptied */
		exclude_pull_requests?: boolean;
		/** For a scoped workflow, the ID of the source repository providing it; omit or 0 for a repo-level workflow. */
		scoped_workflow_source_repo_id?: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.actions.jobs.list': {
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** sort jobs by attribute. Supported values are "id". Default is "id" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc" */
		order?: string;
	};
	'admin.actions.runners.createRegistrationToken': Record<string, never>;
	'admin.actions.runners.delete': {
		/** id of the runner */
		runner_id: string | number;
	};
	'admin.actions.runners.get': {
		/** id of the runner */
		runner_id: string | number;
	};
	'admin.actions.runners.list': {
		/** filter by disabled status (true or false) */
		disabled?: boolean;
	};
	'admin.actions.runners.update': {
		/** id of the runner */
		runner_id: string | number;
		disabled: boolean;
	};
	'admin.actions.runs.list': {
		/** workflow event name */
		event?: string;
		/** workflow branch */
		branch?: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** triggered by user */
		actor?: string;
		/** triggering sha of the workflow run */
		head_sha?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.cron.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.cron.run': {
		/** task to run */
		task: string;
	};
	'admin.emails.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.emails.search': {
		/** keyword */
		q?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.hooks.create': {
		/** Whether the webhook should be active upon creation */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		config: GiteaCreateHookOptionConfigInput;
		/** List of events that will trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name for the webhook */
		name?: string;
		/** The type of the webhook to create */
		type:
			| 'dingtalk'
			| 'discord'
			| 'gitea'
			| 'gogs'
			| 'msteams'
			| 'slack'
			| 'telegram'
			| 'feishu'
			| 'wechatwork'
			| 'packagist';
	};
	'admin.hooks.delete': {
		/** id of the hook to delete */
		id: number;
	};
	'admin.hooks.get': {
		/** id of the hook to get */
		id: number;
	};
	'admin.hooks.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** system, default or both kinds of webhooks */
		type?: 'system' | 'default' | 'all';
	};
	'admin.hooks.update': {
		/** id of the hook to update */
		id: number;
		/** Whether the webhook is active and will be triggered */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		/** Configuration settings for the webhook */
		config?: Record<string, string>;
		/** List of events that trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name */
		name?: string;
	};
	'admin.orgs.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'admin.packages.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** package type filter */
		type?:
			| 'alpine'
			| 'cargo'
			| 'chef'
			| 'composer'
			| 'conan'
			| 'conda'
			| 'container'
			| 'cran'
			| 'debian'
			| 'generic'
			| 'go'
			| 'helm'
			| 'maven'
			| 'npm'
			| 'nuget'
			| 'pub'
			| 'pypi'
			| 'rpm'
			| 'rubygems'
			| 'swift'
			| 'terraform'
			| 'vagrant';
		/** name filter */
		q?: string;
	};
	'admin.unadopted.adopt': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'admin.unadopted.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'admin.unadopted.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** glob pattern of repositories to search for, in the form owner or owner/repo */
		query?: string;
	};
	'admin.users.badges.add': {
		/** username of the user to whom a badge is to be added */
		username: string;
		badge_slugs?: Array<string>;
	};
	'admin.users.badges.delete': {
		/** username of the user whose badge is to be deleted */
		username: string;
		badge_slugs?: Array<string>;
	};
	'admin.users.badges.list': {
		/** username of the user whose badges are to be listed */
		username: string;
	};
	'admin.users.create': {
		/** For explicitly setting the user creation timestamp. Useful when users are migrated from other systems. When omitted, the user's creation timestamp will be set to "now". */
		created_at?: string;
		email: string;
		/** The full display name of the user */
		full_name?: string;
		/** identifier of the user, provided by the external authenticator (if configured) */
		login_name?: string;
		/** Whether the user must change password on first login */
		must_change_password?: boolean;
		/** The plain text password for the user */
		password?: string;
		/** Whether the user has restricted access privileges */
		restricted?: boolean;
		/** Whether to send welcome notification email to the user */
		send_notify?: boolean;
		/** The authentication source ID to associate with the user */
		source_id?: number;
		/** username of the user */
		username: string;
		/** User visibility level: public, limited, or private */
		visibility?: 'public' | 'limited' | 'private';
	};
	'admin.users.delete': {
		/** username of the user to delete */
		username: string;
		/** purge the user from the system completely */
		purge?: boolean;
	};
	'admin.users.keys.create': {
		/** username of the user who is to receive a public key */
		username: string;
		/** An armored SSH key to add */
		key: string;
		/** Describe if the key has only read access or read/write */
		read_only?: boolean;
		/** Title of the key to add */
		title: string;
	};
	'admin.users.keys.delete': {
		/** username of the user whose public key is to be deleted */
		username: string;
		/** id of the key to delete */
		id: number;
	};
	'admin.users.list': {
		/** ID of the user's login source to search for */
		source_id?: number;
		/** identifier of the user, provided by the external authenticator */
		login_name?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** sort users by attribute. Supported values are "name", "created", "updated" and "id". Default is "name" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc", ignored if "sort" is not specified. */
		order?: string;
		/** search term (username, full name, email) */
		q?: string;
		/** visibility filter. Supported values are "public", "limited" and "private". */
		visibility?: string;
		/** filter active users */
		is_active?: boolean;
		/** filter admin users */
		is_admin?: boolean;
		/** filter restricted users */
		is_restricted?: boolean;
		/** filter 2FA enabled users */
		is_2fa_enabled?: boolean;
		/** filter login prohibited users */
		is_prohibit_login?: boolean;
	};
	'admin.users.orgs.create': {
		/** The user who will own the new organization. */
		owner: string;
		/** The description of the organization */
		description?: string;
		/** The email address of the organization */
		email?: string;
		/** The full display name of the organization */
		full_name?: string;
		/** The location of the organization */
		location?: string;
		/** Whether repository administrators can change team access */
		repo_admin_change_team_access?: boolean;
		/** username of the organization */
		username: string;
		/** possible values are `public` (default), `limited` or `private` */
		visibility?: 'public' | 'limited' | 'private';
		/** The website URL of the organization */
		website?: string;
	};
	'admin.users.rename': {
		/** current username of the user */
		username: string;
		/** New username for this user. This name cannot be in use yet by any other user. */
		new_username: string;
	};
	'admin.users.repos.create': {
		/** username of the user who will own the created repository */
		username: string;
		/** Whether the repository should be auto-initialized? */
		auto_init?: boolean;
		/** DefaultBranch of the repository (used when initializes and in template) */
		default_branch?: string;
		/** Description of the repository to create */
		description?: string;
		/** Gitignores to use */
		gitignores?: string;
		/** Label-Set to use */
		issue_labels?: string;
		/** License to use */
		license?: string;
		/** Name of the repository to create */
		name: string;
		/** ObjectFormatName of the underlying git repository, empty string for default (sha1) */
		object_format_name?: 'sha1' | 'sha256';
		/** Whether the repository is private */
		private?: boolean;
		/** Readme of the repository to create */
		readme?: string;
		/** Whether the repository is template */
		template?: boolean;
		/** TrustModel of the repository */
		trust_model?:
			| 'default'
			| 'collaborator'
			| 'committer'
			| 'collaboratorcommitter';
	};
	'admin.users.update': {
		/** username of the user whose data is to be edited */
		username: string;
		/** Whether the user account is active */
		active?: boolean;
		/** Whether the user has administrator privileges */
		admin?: boolean;
		/** Whether the user can create organizations */
		allow_create_organization?: boolean;
		/** Whether the user can use Git hooks */
		allow_git_hook?: boolean;
		/** Whether the user can import local repositories */
		allow_import_local?: boolean;
		/** The user's personal description or bio */
		description?: string;
		/** The email address of the user */
		email?: string;
		/** The full display name of the user */
		full_name?: string;
		/** The user's location or address */
		location?: string;
		/** identifier of the user, provided by the external authenticator (if configured) */
		login_name?: string;
		/** Maximum number of repositories the user can create */
		max_repo_creation?: number;
		/** Whether the user must change password on next login */
		must_change_password?: boolean;
		/** The plain text password for the user */
		password?: string;
		/** Whether the user is prohibited from logging in */
		prohibit_login?: boolean;
		/** Whether the user has restricted access privileges */
		restricted?: boolean;
		/** The authentication source ID to associate with the user */
		source_id: number;
		/** The user type */
		type?: 'User' | 'Organization' | 'Bot';
		/** User visibility level: public, limited, or private */
		visibility?: 'public' | 'limited' | 'private';
		/** The user's personal website URL */
		website?: string;
	};
	'branchProtections.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		approvals_whitelist_teams?: Array<string>;
		approvals_whitelist_username?: Array<string>;
		block_admin_merge_override?: boolean;
		block_on_codeowner_reviews?: boolean;
		block_on_official_review_requests?: boolean;
		block_on_outdated_branch?: boolean;
		block_on_rejected_reviews?: boolean;
		branch_name?: string;
		bypass_allowlist_teams?: Array<string>;
		bypass_allowlist_usernames?: Array<string>;
		dismiss_stale_approvals?: boolean;
		enable_approvals_whitelist?: boolean;
		enable_bypass_allowlist?: boolean;
		enable_force_push?: boolean;
		enable_force_push_allowlist?: boolean;
		enable_merge_whitelist?: boolean;
		enable_push?: boolean;
		enable_push_whitelist?: boolean;
		enable_status_check?: boolean;
		force_push_allowlist_deploy_keys?: boolean;
		force_push_allowlist_teams?: Array<string>;
		force_push_allowlist_usernames?: Array<string>;
		ignore_stale_approvals?: boolean;
		merge_whitelist_teams?: Array<string>;
		merge_whitelist_usernames?: Array<string>;
		priority?: number;
		protected_file_patterns?: string;
		push_whitelist_deploy_keys?: boolean;
		push_whitelist_teams?: Array<string>;
		push_whitelist_usernames?: Array<string>;
		require_signed_commits?: boolean;
		required_approvals?: number;
		rule_name?: string;
		status_check_contexts?: Array<string>;
		unprotected_file_patterns?: string;
	};
	'branchProtections.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of protected branch */
		name: string;
	};
	'branchProtections.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of protected branch */
		name: string;
	};
	'branchProtections.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'branchProtections.setPriority': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		ids?: Array<number>;
	};
	'branchProtections.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of protected branch */
		name: string;
		approvals_whitelist_teams?: Array<string>;
		approvals_whitelist_username?: Array<string>;
		block_admin_merge_override?: boolean;
		block_on_codeowner_reviews?: boolean;
		block_on_official_review_requests?: boolean;
		block_on_outdated_branch?: boolean;
		block_on_rejected_reviews?: boolean;
		bypass_allowlist_teams?: Array<string>;
		bypass_allowlist_usernames?: Array<string>;
		dismiss_stale_approvals?: boolean;
		enable_approvals_whitelist?: boolean;
		enable_bypass_allowlist?: boolean;
		enable_force_push?: boolean;
		enable_force_push_allowlist?: boolean;
		enable_merge_whitelist?: boolean;
		enable_push?: boolean;
		enable_push_whitelist?: boolean;
		enable_status_check?: boolean;
		force_push_allowlist_deploy_keys?: boolean;
		force_push_allowlist_teams?: Array<string>;
		force_push_allowlist_usernames?: Array<string>;
		ignore_stale_approvals?: boolean;
		merge_whitelist_teams?: Array<string>;
		merge_whitelist_usernames?: Array<string>;
		priority?: number;
		protected_file_patterns?: string;
		push_whitelist_deploy_keys?: boolean;
		push_whitelist_teams?: Array<string>;
		push_whitelist_usernames?: Array<string>;
		require_signed_commits?: boolean;
		required_approvals?: number;
		status_check_contexts?: Array<string>;
		unprotected_file_patterns?: string;
	};
	'branches.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Name of the branch to create */
		new_branch_name: string;
		/** Name of the old branch to create from */
		old_branch_name?: string;
		/** Name of the old branch/tag/commit to create from */
		old_ref_name?: string;
	};
	'branches.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** branch to delete */
		branch: string;
	};
	'branches.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** branch to get */
		branch: string;
	};
	'branches.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** branch name substring to filter by */
		q?: string;
	};
	'branches.rename': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the branch */
		branch: string;
		/** New branch name */
		name: string;
	};
	'branches.setCommit': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the branch */
		branch: string;
		/** Force update even if the change is not a fast-forward */
		force?: boolean;
		/** New commit SHA (or any ref) the branch should point to */
		new_commit_id: string;
		/** Expected old commit SHA of the branch; if provided it must match the current tip */
		old_commit_id?: string;
	};
	'comments.attachments.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
		/** name of the attachment */
		name?: string;
		/** attachment to upload */
		attachment: FileInput;
	};
	'comments.attachments.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
		/** id of the attachment to delete */
		attachment_id: number;
	};
	'comments.attachments.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
		/** id of the attachment to get */
		attachment_id: number;
	};
	'comments.attachments.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
	};
	'comments.attachments.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
		/** id of the attachment to edit */
		attachment_id: number;
		/** Name is the new filename for the attachment */
		name?: string;
	};
	'comments.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** Body is the comment text content */
		body: string;
	};
	'comments.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of comment to delete */
		id: number;
	};
	'comments.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment */
		id: number;
	};
	'comments.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** if provided, only comments updated since the specified time are returned. */
		since?: string;
		/** if provided, only comments updated before the provided time are returned. */
		before?: string;
	};
	'comments.listForRepo': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** if provided, only comments updated since the provided time are returned. */
		since?: string;
		/** if provided, only comments updated before the provided time are returned. */
		before?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'comments.reactions.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment to edit */
		id: number;
		/** The reaction content (e.g., emoji or reaction type) */
		content?: string;
	};
	'comments.reactions.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment to edit */
		id: number;
	};
	'comments.reactions.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment to edit */
		id: number;
		/** The reaction content (e.g., emoji or reaction type) */
		content?: string;
	};
	'comments.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the comment to edit */
		id: number;
		/** Body is the updated comment text content */
		body: string;
	};
	'commits.compare': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** compare two refs as `base...head` (or `base..head`); refs may be branches, tags, full or short SHAs (including branch names that contain slashes), optionally with a `^` or `~N` revision suffix. */
		basehead: string;
		/** return the raw comparison as `diff` or `patch` instead of JSON */
		output?: 'diff' | 'patch';
		/** include verification for every commit (disable for speedup, default 'true') */
		verification?: boolean;
		/** include a list of affected files for every commit (disable for speedup, default 'true') */
		files?: boolean;
	};
	'commits.downloadDiff': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** SHA of the commit to get */
		sha: string;
		/** whether the output is diff or patch */
		diffType: 'diff' | 'patch';
	};
	'commits.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** a git ref or commit sha */
		sha: string;
		/** include diff stats for every commit (disable for speedup, default 'true') */
		stat?: boolean;
		/** include verification for every commit (disable for speedup, default 'true') */
		verification?: boolean;
		/** include a list of affected files for every commit (disable for speedup, default 'true') */
		files?: boolean;
	};
	'commits.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** SHA or branch to start listing commits from (usually 'master') */
		sha?: string;
		/** filepath of a file/dir */
		path?: string;
		/** Only commits after this date will be returned (ISO 8601 format) */
		since?: string;
		/** Only commits before this date will be returned (ISO 8601 format) */
		until?: string;
		/** include diff stats for every commit (disable for speedup, default 'true') */
		stat?: boolean;
		/** include verification for every commit (disable for speedup, default 'true') */
		verification?: boolean;
		/** include a list of affected files for every commit (disable for speedup, default 'true') */
		files?: boolean;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results (ignored if used with 'path') */
		limit?: number;
		/** commits that match the given specifier will not be listed. */
		not?: string;
	};
	'commits.pullRequest': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** SHA of the commit to get */
		sha: string;
	};
	'commits.statuses.combined': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of branch/tag/commit */
		ref: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'commits.statuses.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** sha of the commit */
		sha: string;
		/** Context is the unique context identifier for the status */
		context?: string;
		/** Description provides a brief description of the status */
		description?: string;
		/** State represents the status state to set (pending, success, error, failure) */
		state?: 'pending' | 'success' | 'error' | 'failure' | 'warning' | 'skipped';
		/** TargetURL is the URL to link to for more details */
		target_url?: string;
	};
	'commits.statuses.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** sha of the commit */
		sha: string;
		/** type of sort */
		sort?:
			| 'oldest'
			| 'recentupdate'
			| 'leastupdate'
			| 'leastindex'
			| 'highestindex';
		/** type of state */
		state?: 'pending' | 'success' | 'error' | 'failure' | 'warning';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'commits.statuses.listByRef': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of branch/tag/commit */
		ref: string;
		/** type of sort */
		sort?:
			| 'oldest'
			| 'recentupdate'
			| 'leastupdate'
			| 'leastindex'
			| 'highestindex';
		/** type of state */
		state?: 'pending' | 'success' | 'error' | 'failure' | 'warning';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'contents.applyPatch': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		author?: GiteaIdentityInput;
		/** branch (optional) is the base branch for the changes. If not supplied, the default branch is used */
		branch?: string;
		committer?: GiteaIdentityInput;
		content: string;
		dates?: GiteaCommitDateOptionsInput;
		/** force_push (optional) will do a force-push if the new branch already exists */
		force_push?: boolean;
		/** message (optional) is the commit message of the changes. If not supplied, a default message will be used */
		message?: string;
		/** new_branch (optional) will make a new branch from base branch for the changes. If not supplied, the changes will be committed to the base branch */
		new_branch?: string;
		/** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
		signoff?: boolean;
	};
	'contents.changeFiles': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		author?: GiteaIdentityInput;
		/** branch (optional) is the base branch for the changes. If not supplied, the default branch is used */
		branch?: string;
		committer?: GiteaIdentityInput;
		dates?: GiteaCommitDateOptionsInput;
		/** list of file operations */
		files: Array<GiteaChangeFileOperationInput>;
		/** force_push (optional) will do a force-push if the new branch already exists */
		force_push?: boolean;
		/** message (optional) is the commit message of the changes. If not supplied, a default message will be used */
		message?: string;
		/** new_branch (optional) will make a new branch from base branch for the changes. If not supplied, the changes will be committed to the base branch */
		new_branch?: string;
		/** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
		signoff?: boolean;
	};
	'contents.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the file to create */
		filepath: string;
		author?: GiteaIdentityInput;
		/** branch (optional) is the base branch for the changes. If not supplied, the default branch is used */
		branch?: string;
		committer?: GiteaIdentityInput;
		/** content must be base64 encoded */
		content: string;
		dates?: GiteaCommitDateOptionsInput;
		/** force_push (optional) will do a force-push if the new branch already exists */
		force_push?: boolean;
		/** message (optional) is the commit message of the changes. If not supplied, a default message will be used */
		message?: string;
		/** new_branch (optional) will make a new branch from base branch for the changes. If not supplied, the changes will be committed to the base branch */
		new_branch?: string;
		/** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
		signoff?: boolean;
	};
	'contents.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the file to delete */
		filepath: string;
		author?: GiteaIdentityInput;
		/** branch (optional) is the base branch for the changes. If not supplied, the default branch is used */
		branch?: string;
		committer?: GiteaIdentityInput;
		dates?: GiteaCommitDateOptionsInput;
		/** force_push (optional) will do a force-push if the new branch already exists */
		force_push?: boolean;
		/** message (optional) is the commit message of the changes. If not supplied, a default message will be used */
		message?: string;
		/** new_branch (optional) will make a new branch from base branch for the changes. If not supplied, the changes will be committed to the base branch */
		new_branch?: string;
		/** the blob ID (SHA) for the file to delete */
		sha: string;
		/** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
		signoff?: boolean;
	};
	'contents.editorConfig': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** filepath of file to get */
		filepath: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch. */
		ref?: string;
	};
	'contents.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the dir, file, symlink or submodule in the repo */
		filepath: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch. */
		ref?: string;
	};
	'contents.getExt': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the dir, file, symlink or submodule in the repo. Swagger requires path parameter to be "required", you can leave it empty or pass a single dot (".") to get the root directory. */
		filepath: string;
		/** the name of the commit/branch/tag, default to the repository’s default branch. */
		ref?: string;
		/** By default this API's response only contains file's metadata. Use comma-separated "includes" options to retrieve more fields. Option "file_content" will try to retrieve the file content, "lfs_metadata" will try to retrieve LFS metadata, "commit_metadata" will try to retrieve commit metadata, and… */
		includes?: string;
	};
	'contents.getMany': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch. */
		ref?: string;
		/** The JSON encoded body (see the POST request): {"files": ["filename1", "filename2"]} */
		body: string;
	};
	'contents.getManyByPost': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch. */
		ref?: string;
		/** Files is the list of file paths to retrieve */
		files?: Array<string>;
	};
	'contents.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch. */
		ref?: string;
	};
	'contents.media': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the file to get, it should be "{ref}/{filepath}". If there is no ref could be inferred, it will be treated as the default branch */
		filepath: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch */
		ref?: string;
	};
	'contents.raw': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the file to get, it should be "{ref}/{filepath}". If there is no ref could be inferred, it will be treated as the default branch */
		filepath: string;
		/** The name of the commit/branch/tag. Default to the repository’s default branch */
		ref?: string;
	};
	'contents.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** path of the file to update */
		filepath: string;
		author?: GiteaIdentityInput;
		/** branch (optional) is the base branch for the changes. If not supplied, the default branch is used */
		branch?: string;
		committer?: GiteaIdentityInput;
		/** content must be base64 encoded */
		content: string;
		dates?: GiteaCommitDateOptionsInput;
		/** force_push (optional) will do a force-push if the new branch already exists */
		force_push?: boolean;
		/** from_path (optional) is the path of the original file which will be moved/renamed to the path in the URL */
		from_path?: string;
		/** message (optional) is the commit message of the changes. If not supplied, a default message will be used */
		message?: string;
		/** new_branch (optional) will make a new branch from base branch for the changes. If not supplied, the changes will be committed to the base branch */
		new_branch?: string;
		/** the blob ID (SHA) for the file that already exists to update, or leave it empty to create a new file */
		sha?: string;
		/** Add a Signed-off-by trailer by the committer at the end of the commit log message. */
		signoff?: boolean;
	};
	'git.blobs.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** sha of the commit */
		sha: string;
	};
	'git.notes.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** a git ref or commit sha */
		sha: string;
		/** include verification for every commit (disable for speedup, default 'true') */
		verification?: boolean;
		/** include a list of affected files for every commit (disable for speedup, default 'true') */
		files?: boolean;
	};
	'git.refs.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'git.refs.listMatching': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** part or full name of the ref */
		ref: string;
	};
	'git.tags.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** sha of the tag. The Git tags API only supports annotated tag objects, not lightweight tags. */
		sha: string;
	};
	'git.trees.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** sha of the commit */
		sha: string;
		/** show all directories and files */
		recursive?: boolean;
		/** page number; the 'truncated' field in the response will be true if there are still more items after this page, false if the last page */
		page?: number;
		/** number of items per page */
		per_page?: number;
	};
	'issues.assignees.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		assignees?: Array<string>;
	};
	'issues.assignees.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** username of the user to check for being an assignee */
		assignee: string;
	};
	'issues.assignees.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		assignees?: Array<string>;
	};
	'issues.attachments.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** name of the attachment */
		name?: string;
		/** attachment to upload */
		attachment: FileInput;
	};
	'issues.attachments.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** id of the attachment to delete */
		attachment_id: number;
	};
	'issues.attachments.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** id of the attachment to get */
		attachment_id: number;
	};
	'issues.attachments.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
	};
	'issues.attachments.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** id of the attachment to edit */
		attachment_id: number;
		/** Name is the new filename for the attachment */
		name?: string;
	};
	'issues.blocks.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** Number of the other issue. */
		other_index?: number;
		/** Owner of the other issue's repository. */
		other_owner?: string;
		/** Repository of the other issue. */
		other_repo?: string;
	};
	'issues.blocks.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.blocks.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** Number of the other issue. */
		other_index?: number;
		/** Owner of the other issue's repository. */
		other_owner?: string;
		/** Repository of the other issue. */
		other_repo?: string;
	};
	'issues.config.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'issues.config.validate': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'issues.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** deprecated */
		assignee?: string;
		assignees?: Array<string>;
		body?: string;
		closed?: boolean;
		due_date?: string;
		/** list of label ids */
		labels?: Array<number>;
		/** milestone id */
		milestone?: number;
		/** list of project ids */
		projects?: Array<number>;
		ref?: string;
		title: string;
	};
	'issues.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of issue to delete */
		index: number;
	};
	'issues.dependencies.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** Number of the other issue. */
		other_index?: number;
		/** Owner of the other issue's repository. */
		other_owner?: string;
		/** Repository of the other issue. */
		other_repo?: string;
	};
	'issues.dependencies.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.dependencies.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: string | number;
		/** Number of the other issue. */
		other_index?: number;
		/** Owner of the other issue's repository. */
		other_owner?: string;
		/** Repository of the other issue. */
		other_repo?: string;
	};
	'issues.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to get */
		index: number;
	};
	'issues.labels.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** Labels can be a list of integers representing label IDs or a list of strings representing label names. If a repository label and an organization label share a name, the repository label is used. */
		labels?: Array<GiteaJsonValue>;
	};
	'issues.labels.clear': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
	};
	'issues.labels.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
	};
	'issues.labels.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** id of the label to remove */
		id: number;
	};
	'issues.labels.replace': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** Labels can be a list of integers representing label IDs or a list of strings representing label names. If a repository label and an organization label share a name, the repository label is used. */
		labels?: Array<GiteaJsonValue>;
	};
	'issues.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** whether issue is open or closed */
		state?: 'closed' | 'open' | 'all';
		/** comma separated list of label names. Fetch only issues that have any of this label names. Non existent labels are discarded. */
		labels?: string;
		/** search string */
		q?: string;
		/** filter by type (issues / pulls) if set */
		type?: 'issues' | 'pulls';
		/** comma separated list of milestone names or ids. It uses names and fall back to ids. Fetch only issues that have any of this milestones. Non existent milestones are discarded */
		milestones?: string;
		/** Only show items updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show items updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
		/** Only show items which were created by the given user */
		created_by?: string;
		/** Only show items for which the given user is assigned */
		assigned_by?: string;
		/** Only show items in which the given user was mentioned */
		mentioned_by?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.listPinned': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'issues.lock': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		lock_reason?: string;
	};
	'issues.movePin': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of issue */
		index: number;
		/** the new position */
		position: number;
	};
	'issues.pin': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of issue to pin */
		index: number;
	};
	'issues.reactions.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** The reaction content (e.g., emoji or reaction type) */
		content?: string;
	};
	'issues.reactions.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.reactions.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** The reaction content (e.g., emoji or reaction type) */
		content?: string;
	};
	'issues.search': {
		/** State of the issue */
		state?: 'open' | 'closed' | 'all';
		/** Comma-separated list of label names. Fetch only issues that have any of these labels. Non existent labels are discarded. */
		labels?: string;
		/** Comma-separated list of milestone names. Fetch only issues that have any of these milestones. Non existent milestones are discarded. */
		milestones?: string;
		/** Search string */
		q?: string;
		/** Filter by issue type */
		type?: 'issues' | 'pulls';
		/** Only show issues updated after the given time (RFC 3339 format) */
		since?: string;
		/** Only show issues updated before the given time (RFC 3339 format) */
		before?: string;
		/** Filter issues or pulls assigned to the authenticated user */
		assigned?: boolean;
		/** Filter issues or pulls created by the authenticated user */
		created?: boolean;
		/** Filter issues or pulls mentioning the authenticated user */
		mentioned?: boolean;
		/** Filter pull requests where the authenticated user's review was requested */
		review_requested?: boolean;
		/** Filter pull requests reviewed by the authenticated user */
		reviewed?: boolean;
		/** Filter by repository owner */
		owner?: string;
		/** Only show items which were created by the given user */
		created_by?: string;
		/** Filter by team (requires organization owner parameter) */
		team?: string;
		/** Page number of results to return (1-based) */
		page?: number;
		/** Number of items per page */
		limit?: number;
	};
	'issues.setDeadline': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to create or update a deadline on */
		index: number;
		due_date: string;
	};
	'issues.stopwatch.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to stop the stopwatch on */
		index: number;
	};
	'issues.stopwatch.start': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to create the stopwatch on */
		index: number;
	};
	'issues.stopwatch.stop': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to stop the stopwatch on */
		index: number;
	};
	'issues.subscriptions.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** username of the user to subscribe the issue to */
		user: string;
	};
	'issues.subscriptions.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
	};
	'issues.subscriptions.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.subscriptions.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** username of the user to unsubscribe from an issue */
		user: string;
	};
	'issues.templates.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'issues.timeline': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** if provided, only comments updated since the specified time are returned. */
		since?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** if provided, only comments updated before the provided time are returned. */
		before?: string;
	};
	'issues.times.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		created?: string;
		/** time in seconds */
		time: number;
		/** username of the user who spent the time working on the issue (optional) */
		user_name?: string;
	};
	'issues.times.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** id of time to delete */
		id: number;
	};
	'issues.times.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
		/** optional filter by user (available for issue managers) */
		user?: string;
		/** Only show times updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show times updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'issues.times.reset': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to add tracked time to */
		index: number;
	};
	'issues.unlock': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue */
		index: number;
	};
	'issues.unpin': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of issue to unpin */
		index: number;
	};
	'issues.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the issue to edit */
		index: number;
		/** deprecated */
		assignee?: string;
		assignees?: Array<string>;
		body?: string;
		/** The current version of the issue content to detect conflicts during editing */
		content_version?: number;
		due_date?: string;
		milestone?: number;
		/** list of project ids to set (replaces existing projects) */
		projects?: Array<number>;
		ref?: string;
		state?: string;
		title?: string;
		unset_due_date?: boolean;
	};
	'labels.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		color: string;
		/** Description provides additional context about the label's purpose */
		description?: string;
		exclusive?: boolean;
		is_archived?: boolean;
		/** Name is the display name for the new label */
		name: string;
	};
	'labels.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the label to delete */
		id: number;
	};
	'labels.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the label to get */
		id: number;
	};
	'labels.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'labels.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the label to edit */
		id: number;
		color?: string;
		/** Description provides additional context about the label's purpose */
		description?: string;
		exclusive?: boolean;
		is_archived?: boolean;
		/** Name is the new display name for the label */
		name?: string;
	};
	'milestones.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Description provides details about the milestone */
		description?: string;
		/** Deadline is the due date for the milestone */
		due_on?: string;
		/** State indicates the initial state of the milestone */
		state?: 'open' | 'closed';
		/** Title is the title of the new milestone */
		title?: string;
	};
	'milestones.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the milestone to delete, identified by ID and if not available by name */
		id: string | number;
	};
	'milestones.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the milestone to get, identified by ID and if not available by name */
		id: string | number;
	};
	'milestones.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Milestone state, Recognized values are open, closed and all. Defaults to "open" */
		state?: string;
		/** filter by milestone name */
		name?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'milestones.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the milestone to edit, identified by ID and if not available by name */
		id: string | number;
		/** Description provides updated details about the milestone */
		description?: string;
		/** Deadline is the due date for the milestone, use null or empty string to remove the deadline */
		due_on?: string;
		/** State indicates the updated state of the milestone */
		state?: 'open' | 'closed';
		/** Title is the updated title of the milestone */
		title?: string;
	};
	'misc.gitignoreTemplates.get': {
		/** name of the template */
		name: string;
	};
	'misc.gitignoreTemplates.list': Record<string, never>;
	'misc.labelTemplates.get': {
		/** name of the template */
		name: string;
	};
	'misc.labelTemplates.list': Record<string, never>;
	'misc.licenseTemplates.get': {
		/** name of the license */
		name: string;
	};
	'misc.licenseTemplates.list': Record<string, never>;
	'misc.markdown.render': {
		/** URL path for rendering issue, media and file links Expected format: /subpath/{user}/{repo}/src/{branch, commit, tag}/{identifier/path}/{file/dir} */
		Context?: string;
		/** Mode to render (markdown, comment, wiki, file) */
		Mode?: string;
		/** Text markdown to render */
		Text?: string;
		/** Is it a wiki page? (use mode=wiki instead) */
		Wiki?: boolean;
	};
	'misc.markdown.renderRaw': {
		/** Request body to render */
		text: string;
	};
	'misc.markup.render': {
		/** URL path for rendering issue, media and file links Expected format: /subpath/{user}/{repo}/src/{branch, commit, tag}/{identifier/path}/{file/dir} */
		Context?: string;
		/** File path for detecting extension in file mode */
		FilePath?: string;
		/** Mode to render (markdown, comment, wiki, file) */
		Mode?: string;
		/** Text markup to render */
		Text?: string;
		/** Is it a wiki page? (use mode=wiki instead) */
		Wiki?: boolean;
	};
	'misc.signingKey.gpg': Record<string, never>;
	'misc.signingKey.ssh': Record<string, never>;
	'misc.topics.search': {
		/** keywords to search */
		q: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'misc.version': Record<string, never>;
	'notifications.countNew': Record<string, never>;
	'notifications.list': {
		/** If true, show notifications marked as read. Default value is false */
		all?: boolean;
		/** Show notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread & pinned. */
		'status-types'?: Array<string>;
		/** filter notifications by subject type */
		'subject-type'?: Array<'issue' | 'pull' | 'commit' | 'repository'>;
		/** Only show notifications updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show notifications updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'notifications.listForRepo': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** If true, show notifications marked as read. Default value is false */
		all?: boolean;
		/** Show notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread & pinned */
		'status-types'?: Array<string>;
		/** filter notifications by subject type */
		'subject-type'?: Array<'issue' | 'pull' | 'commit' | 'repository'>;
		/** Only show notifications updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show notifications updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'notifications.markRead': {
		/** Describes the last point that notifications were checked. Anything updated since this time will not be updated. */
		last_read_at?: string;
		/** If true, mark all notifications on this repo. Default value is false */
		all?: string;
		/** Mark notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread. */
		'status-types'?: Array<string>;
		/** Status to mark notifications as, Defaults to read. */
		'to-status'?: string;
	};
	'notifications.markReadForRepo': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** If true, mark all notifications on this repo. Default value is false */
		all?: string;
		/** Mark notifications with the provided status types. Options are: unread, read and/or pinned. Defaults to unread. */
		'status-types'?: Array<string>;
		/** Status to mark notifications as. Defaults to read. */
		'to-status'?: string;
		/** Describes the last point that notifications were checked. Anything updated since this time will not be updated. */
		last_read_at?: string;
	};
	'notifications.threads.get': {
		/** id of notification thread */
		id: string | number;
	};
	'notifications.threads.markRead': {
		/** id of notification thread */
		id: string | number;
		/** Status to mark notifications as */
		'to-status'?: string;
	};
	'orgs.actions.jobs.list': {
		/** name of the organization */
		org: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.actions.runners.createRegistrationToken': {
		/** name of the organization */
		org: string;
	};
	'orgs.actions.runners.delete': {
		/** name of the organization */
		org: string;
		/** id of the runner */
		runner_id: string | number;
	};
	'orgs.actions.runners.get': {
		/** name of the organization */
		org: string;
		/** id of the runner */
		runner_id: string | number;
	};
	'orgs.actions.runners.list': {
		/** name of the organization */
		org: string;
		/** filter by disabled status (true or false) */
		disabled?: boolean;
	};
	'orgs.actions.runners.update': {
		/** name of the organization */
		org: string;
		/** id of the runner */
		runner_id: string | number;
		disabled: boolean;
	};
	'orgs.actions.runs.list': {
		/** name of the organization */
		org: string;
		/** workflow event name */
		event?: string;
		/** workflow branch */
		branch?: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** triggered by user */
		actor?: string;
		/** triggering sha of the workflow run */
		head_sha?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.actions.secrets.delete': {
		/** name of organization */
		org: string;
		/** name of the secret */
		secretname: string;
	};
	'orgs.actions.secrets.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.actions.secrets.set': {
		/** name of organization */
		org: string;
		/** name of the secret */
		secretname: string;
		/** Data of the secret to update */
		data: string;
		/** Description of the secret to update */
		description?: string;
	};
	'orgs.actions.variables.create': {
		/** name of the organization */
		org: string;
		/** name of the variable */
		variablename: string;
		/** Description of the variable to create */
		description?: string;
		/** Value of the variable to create */
		value: string;
	};
	'orgs.actions.variables.delete': {
		/** name of the organization */
		org: string;
		/** name of the variable */
		variablename: string;
	};
	'orgs.actions.variables.get': {
		/** name of the organization */
		org: string;
		/** name of the variable */
		variablename: string;
	};
	'orgs.actions.variables.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.actions.variables.update': {
		/** name of the organization */
		org: string;
		/** name of the variable */
		variablename: string;
		/** Description of the variable to update */
		description?: string;
		/** New name for the variable. If the field is empty, the variable name won't be updated. */
		name?: string;
		/** Value of the variable to update */
		value: string;
	};
	'orgs.activityFeeds.list': {
		/** name of the org */
		org: string;
		/** the date of the activities to be found */
		date?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.avatar.delete': {
		/** name of the organization */
		org: string;
	};
	'orgs.avatar.update': {
		/** name of the organization */
		org: string;
		/** image must be base64 encoded */
		image?: string;
	};
	'orgs.blocks.add': {
		/** name of the organization */
		org: string;
		/** username of the user to block */
		username: string;
		/** optional note for the block */
		note?: string;
	};
	'orgs.blocks.check': {
		/** name of the organization */
		org: string;
		/** username of the user to check */
		username: string;
	};
	'orgs.blocks.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.blocks.remove': {
		/** name of the organization */
		org: string;
		/** username of the user to unblock */
		username: string;
	};
	'orgs.create': {
		/** The description of the organization */
		description?: string;
		/** The email address of the organization */
		email?: string;
		/** The full display name of the organization */
		full_name?: string;
		/** The location of the organization */
		location?: string;
		/** Whether repository administrators can change team access */
		repo_admin_change_team_access?: boolean;
		/** username of the organization */
		username: string;
		/** possible values are `public` (default), `limited` or `private` */
		visibility?: 'public' | 'limited' | 'private';
		/** The website URL of the organization */
		website?: string;
	};
	'orgs.delete': {
		/** organization that is to be deleted */
		org: string;
	};
	'orgs.get': {
		/** name of the organization to get */
		org: string;
	};
	'orgs.hooks.create': {
		/** name of the organization */
		org: string;
		/** Whether the webhook should be active upon creation */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		config: GiteaCreateHookOptionConfigInput;
		/** List of events that will trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name for the webhook */
		name?: string;
		/** The type of the webhook to create */
		type:
			| 'dingtalk'
			| 'discord'
			| 'gitea'
			| 'gogs'
			| 'msteams'
			| 'slack'
			| 'telegram'
			| 'feishu'
			| 'wechatwork'
			| 'packagist';
	};
	'orgs.hooks.delete': {
		/** name of the organization */
		org: string;
		/** id of the hook to delete */
		id: number;
	};
	'orgs.hooks.get': {
		/** name of the organization */
		org: string;
		/** id of the hook to get */
		id: number;
	};
	'orgs.hooks.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.hooks.update': {
		/** name of the organization */
		org: string;
		/** id of the hook to update */
		id: number;
		/** Whether the webhook is active and will be triggered */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		/** Configuration settings for the webhook */
		config?: Record<string, string>;
		/** List of events that trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name */
		name?: string;
	};
	'orgs.labels.create': {
		/** name of the organization */
		org: string;
		color: string;
		/** Description provides additional context about the label's purpose */
		description?: string;
		exclusive?: boolean;
		is_archived?: boolean;
		/** Name is the display name for the new label */
		name: string;
	};
	'orgs.labels.delete': {
		/** name of the organization */
		org: string;
		/** id of the label to delete */
		id: number;
	};
	'orgs.labels.get': {
		/** name of the organization */
		org: string;
		/** id of the label to get */
		id: number;
	};
	'orgs.labels.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.labels.update': {
		/** name of the organization */
		org: string;
		/** id of the label to edit */
		id: number;
		color?: string;
		/** Description provides additional context about the label's purpose */
		description?: string;
		exclusive?: boolean;
		is_archived?: boolean;
		/** Name is the new display name for the label */
		name?: string;
	};
	'orgs.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.members.check': {
		/** name of the organization */
		org: string;
		/** username of the user to check for an organization membership */
		username: string;
	};
	'orgs.members.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.members.remove': {
		/** name of the organization */
		org: string;
		/** username of the user to remove from the organization */
		username: string;
	};
	'orgs.projects.columns.create': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		title: string;
	};
	'orgs.projects.columns.delete': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'orgs.projects.columns.get': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'orgs.projects.columns.issues.add': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'orgs.projects.columns.issues.list': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.projects.columns.issues.remove': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'orgs.projects.columns.list': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.projects.columns.move': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** Every column ID of the project, in the desired left-to-right order */
		column_ids: Array<number>;
	};
	'orgs.projects.columns.setDefault': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'orgs.projects.columns.update': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		/** Position of the column within the project, between -128 and 127 */
		sorting?: number;
		title?: string;
	};
	'orgs.projects.create': {
		/** name of the organization */
		org: string;
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		/** Template type: "none", "basic_kanban" or "bug_triage" */
		template_type?: string;
		title: string;
	};
	'orgs.projects.delete': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
	};
	'orgs.projects.get': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
	};
	'orgs.projects.issues.move': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
		/** Target column to move the issue into */
		column_id: number;
		/** Position within the column, ascending. Omit to append. Negative values sort above the rest, equal values are ordered newest first. */
		sorting?: number;
	};
	'orgs.projects.list': {
		/** name of the organization */
		org: string;
		/** State of the project (open, closed, all) */
		state?: 'open' | 'closed' | 'all';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.projects.update': {
		/** name of the organization */
		org: string;
		/** id of the project */
		id: number;
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		state?: 'open' | 'closed';
		title?: string;
	};
	'orgs.publicMembers.check': {
		/** name of the organization */
		org: string;
		/** username of the user to check for a public organization membership */
		username: string;
	};
	'orgs.publicMembers.conceal': {
		/** name of the organization */
		org: string;
		/** username of the user whose membership is to be concealed */
		username: string;
	};
	'orgs.publicMembers.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.publicMembers.publicize': {
		/** name of the organization */
		org: string;
		/** username of the user whose membership is to be publicized */
		username: string;
	};
	'orgs.rename': {
		/** existing org name */
		org: string;
		/** New username for this org. This name cannot be in use yet by any other user. */
		new_name: string;
	};
	'orgs.repos.create': {
		/** name of organization */
		org: string;
		/** Whether the repository should be auto-initialized? */
		auto_init?: boolean;
		/** DefaultBranch of the repository (used when initializes and in template) */
		default_branch?: string;
		/** Description of the repository to create */
		description?: string;
		/** Gitignores to use */
		gitignores?: string;
		/** Label-Set to use */
		issue_labels?: string;
		/** License to use */
		license?: string;
		/** Name of the repository to create */
		name: string;
		/** ObjectFormatName of the underlying git repository, empty string for default (sha1) */
		object_format_name?: 'sha1' | 'sha256';
		/** Whether the repository is private */
		private?: boolean;
		/** Readme of the repository to create */
		readme?: string;
		/** Whether the repository is template */
		template?: boolean;
		/** TrustModel of the repository */
		trust_model?:
			| 'default'
			| 'collaborator'
			| 'committer'
			| 'collaboratorcommitter';
	};
	'orgs.repos.deleteAll': {
		/** name of the organization */
		org: string;
	};
	'orgs.repos.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.teams.create': {
		/** name of the organization */
		org: string;
		/** Whether the team can create repositories in the organization */
		can_create_org_repo?: boolean;
		/** The description of the team */
		description?: string;
		/** Whether the team has access to all repositories in the organization */
		includes_all_repositories?: boolean;
		name: string;
		/** All units have this permission (read/write/admin) */
		permission?: 'read' | 'write' | 'admin';
		/** Deprecated: This variable should be replaced by UnitsMap and will be dropped in later versions. */
		units?: Array<string>;
		units_map?: Record<string, string>;
		/** Team visibility within the organization. Defaults to "private". */
		visibility?: 'public' | 'limited' | 'private';
	};
	'orgs.teams.list': {
		/** name of the organization */
		org: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.teams.search': {
		/** name of the organization */
		org: string;
		/** keywords to search */
		q?: string;
		/** include search within team description (defaults to true) */
		include_desc?: boolean;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'orgs.update': {
		/** name of the organization to edit */
		org: string;
		/** The description of the organization */
		description?: string;
		/** The email address of the organization; use empty string to clear */
		email?: string;
		/** The full display name of the organization */
		full_name?: string;
		/** The location of the organization */
		location?: string;
		/** Whether repository administrators can change team access */
		repo_admin_change_team_access?: boolean;
		/** possible values are `public`, `limited` or `private` */
		visibility?: 'public' | 'limited' | 'private';
		/** The website URL of the organization */
		website?: string;
	};
	'packages.delete': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
	};
	'packages.link': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
		/** name of the repository to link. */
		repo_name: string;
	};
	'packages.list': {
		/** owner of the packages */
		owner: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** package type filter */
		type?:
			| 'alpine'
			| 'cargo'
			| 'chef'
			| 'composer'
			| 'conan'
			| 'conda'
			| 'container'
			| 'cran'
			| 'debian'
			| 'generic'
			| 'go'
			| 'helm'
			| 'maven'
			| 'npm'
			| 'nuget'
			| 'pub'
			| 'pypi'
			| 'rpm'
			| 'rubygems'
			| 'swift'
			| 'terraform'
			| 'vagrant';
		/** name filter */
		q?: string;
	};
	'packages.unlink': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
	};
	'packages.versions.delete': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
		/** version of the package */
		version: string;
	};
	'packages.versions.files.list': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
		/** version of the package */
		version: string;
	};
	'packages.versions.get': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
		/** version of the package */
		version: string;
	};
	'packages.versions.getLatest': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
	};
	'packages.versions.list': {
		/** owner of the package */
		owner: string;
		/** type of the package */
		type: string;
		/** name of the package */
		name: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'projects.columns.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		title: string;
	};
	'projects.columns.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'projects.columns.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'projects.columns.issues.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'projects.columns.issues.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'projects.columns.issues.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'projects.columns.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'projects.columns.move': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** Every column ID of the project, in the desired left-to-right order */
		column_ids: Array<number>;
	};
	'projects.columns.setDefault': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'projects.columns.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		/** Position of the column within the project, between -128 and 127 */
		sorting?: number;
		title?: string;
	};
	'projects.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		/** Template type: "none", "basic_kanban" or "bug_triage" */
		template_type?: string;
		title: string;
	};
	'projects.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
	};
	'projects.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
	};
	'projects.issues.move': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
		/** Target column to move the issue into */
		column_id: number;
		/** Position within the column, ascending. Omit to append. Negative values sort above the rest, equal values are ordered newest first. */
		sorting?: number;
	};
	'projects.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** State of the project (open, closed, all) */
		state?: 'open' | 'closed' | 'all';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'projects.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the project */
		id: number;
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		state?: 'open' | 'closed';
		title?: string;
	};
	'pulls.cancelAutoMerge': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to merge */
		index: number;
	};
	'pulls.commits': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to get */
		index: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** include verification for every commit (disable for speedup, default 'true') */
		verification?: boolean;
		/** include a list of affected files for every commit (disable for speedup, default 'true') */
		files?: boolean;
	};
	'pulls.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Whether maintainers can edit the pull request */
		allow_maintainer_edit?: boolean;
		/** The primary assignee username */
		assignee?: string;
		/** The list of assignee usernames */
		assignees?: Array<string>;
		/** The base branch for the pull request */
		base?: string;
		/** The description body of the pull request */
		body?: string;
		due_date?: string;
		/** The head branch for the pull request, it could be a branch name on the base repository or a form like `<username>:<branch>` which refers to the user's fork repository's branch. */
		head?: string;
		/** The list of label IDs to assign to the pull request */
		labels?: Array<number>;
		/** The milestone ID to assign to the pull request */
		milestone?: number;
		/** The list of reviewer usernames */
		reviewers?: Array<string>;
		/** The list of team reviewer names */
		team_reviewers?: Array<string>;
		/** The title of the pull request */
		title?: string;
	};
	'pulls.downloadDiff': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to get */
		index: number;
		/** whether the output is diff or patch */
		diffType: 'diff' | 'patch';
		/** whether to include binary file changes. if true, the diff is applicable with `git apply` */
		binary?: boolean;
	};
	'pulls.files': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to get */
		index: number;
		/** skip to given file */
		'skip-to'?: string;
		/** whitespace behavior */
		whitespace?: 'ignore-all' | 'ignore-change' | 'ignore-eol' | 'show-all';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'pulls.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to get */
		index: number;
	};
	'pulls.getByBaseHead': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** base of the pull request to get */
		base: string;
		/** head of the pull request to get */
		head: string;
	};
	'pulls.isMerged': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
	};
	'pulls.list': {
		/** owner of the repo */
		owner: string;
		/** Name of the repo */
		repo: string;
		/** Filter by target base branch of the pull request */
		base_branch?: string;
		/** State of pull request */
		state?: 'open' | 'closed' | 'all';
		/** Type of sort */
		sort?:
			| 'oldest'
			| 'recentupdate'
			| 'recentclose'
			| 'leastupdate'
			| 'mostcomment'
			| 'leastcomment'
			| 'priority';
		/** ID of the milestone */
		milestone?: number;
		/** Label IDs */
		labels?: Array<number>;
		/** Filter by pull request author */
		poster?: string;
		/** Page number of results to return (1-based) */
		page?: number;
		/** Page size of results */
		limit?: number;
	};
	'pulls.listPinned': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'pulls.merge': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to merge */
		index: number;
		delete_branch_after_merge?: boolean;
		do:
			| 'merge'
			| 'rebase'
			| 'rebase-merge'
			| 'squash'
			| 'fast-forward-only'
			| 'manually-merged';
		force_merge?: boolean;
		head_commit_id?: string;
		merge_commit_id?: string;
		merge_message_field?: string;
		merge_title_field?: string;
		merge_when_checks_succeed?: boolean;
	};
	'pulls.requestedReviewers.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		reviewers?: Array<string>;
		team_reviewers?: Array<string>;
	};
	'pulls.requestedReviewers.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		reviewers?: Array<string>;
		team_reviewers?: Array<string>;
	};
	'pulls.reviewComments.reply': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review comment to reply to */
		id: number;
		body?: string;
	};
	'pulls.reviewComments.resolve': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the review comment */
		id: number;
	};
	'pulls.reviewComments.unresolve': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the review comment */
		id: number;
	};
	'pulls.reviews.comments': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
	};
	'pulls.reviews.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		body?: string;
		comments?: Array<GiteaCreatePullReviewCommentInput>;
		commit_id?: string;
		event?:
			| 'APPROVED'
			| 'PENDING'
			| 'COMMENT'
			| 'REQUEST_CHANGES'
			| 'REQUEST_REVIEW';
	};
	'pulls.reviews.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
	};
	'pulls.reviews.dismiss': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
		message?: string;
		priors?: boolean;
	};
	'pulls.reviews.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
	};
	'pulls.reviews.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'pulls.reviews.submit': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
		body?: string;
		event?:
			| 'APPROVED'
			| 'PENDING'
			| 'COMMENT'
			| 'REQUEST_CHANGES'
			| 'REQUEST_REVIEW';
	};
	'pulls.reviews.undismiss': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request */
		index: number;
		/** id of the review */
		id: number;
	};
	'pulls.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to edit */
		index: number;
		/** Whether to allow maintainer edits */
		allow_maintainer_edit?: boolean;
		/** The new primary assignee username */
		assignee?: string;
		/** The new list of assignee usernames */
		assignees?: Array<string>;
		/** The new base branch for the pull request */
		base?: string;
		/** The new description body for the pull request */
		body?: string;
		/** The current version of the pull request content to detect conflicts during editing */
		content_version?: number;
		due_date?: string;
		/** The new list of label IDs for the pull request */
		labels?: Array<number>;
		/** The new milestone ID for the pull request */
		milestone?: number;
		/** The new state for the pull request */
		state?: string;
		/** The new title for the pull request */
		title?: string;
		/** Whether to remove the current deadline */
		unset_due_date?: boolean;
	};
	'pulls.updateBranch': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the pull request to get */
		index: number;
		/** how to update pull request */
		style?: 'merge' | 'rebase';
	};
	'releases.assets.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release */
		id: number;
		/** name of the attachment */
		name?: string;
		/** attachment to upload */
		attachment?: FileInput;
	};
	'releases.assets.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release */
		id: number;
		/** id of the attachment to delete */
		attachment_id: number;
	};
	'releases.assets.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release */
		id: number;
		/** id of the attachment to get */
		attachment_id: number;
	};
	'releases.assets.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release */
		id: number;
	};
	'releases.assets.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release */
		id: number;
		/** id of the attachment to edit */
		attachment_id: number;
		/** Name is the new filename for the attachment */
		name?: string;
	};
	'releases.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The release notes or description */
		body?: string;
		/** Whether to create the release as a draft */
		draft?: boolean;
		/** The display title of the release */
		name?: string;
		/** Whether to mark the release as a prerelease */
		prerelease?: boolean;
		/** The message for the git tag */
		tag_message?: string;
		tag_name: string;
		/** The target commitish for the release */
		target_commitish?: string;
	};
	'releases.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release to delete */
		id: number;
	};
	'releases.deleteByTag': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** tag name of the release to delete */
		tag: string;
	};
	'releases.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release to get */
		id: number;
	};
	'releases.getByTag': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** tag name of the release to get */
		tag: string;
	};
	'releases.getLatest': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'releases.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** filter (exclude / include) drafts, if you don't have repo write access none will show */
		draft?: boolean;
		/** filter (exclude / include) pre-releases */
		'pre-release'?: boolean;
		/** filter releases by tag. supports "*" as a wildcard (for example: v1*, *beta, *rc*). */
		tag_filter?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'releases.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the release to edit */
		id: number;
		/** The new release notes or description */
		body?: string;
		/** Whether to change the draft status */
		draft?: boolean;
		/** The new display title of the release */
		name?: string;
		/** Whether to change the prerelease status */
		prerelease?: boolean;
		/** The new name of the git tag */
		tag_name?: string;
		/** The new target commitish for the release */
		target_commitish?: string;
	};
	'repos.acceptTransfer': {
		/** owner of the repo to transfer */
		owner: string;
		/** name of the repo to transfer */
		repo: string;
	};
	'repos.activityFeeds.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the date of the activities to be found */
		date?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.assignees.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** username of the user to check for being an assignee */
		assignee: string;
	};
	'repos.assignees.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.avatar.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.avatar.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** image must be base64 encoded */
		image?: string;
	};
	'repos.collaborators.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** username of the user to add or update as a collaborator */
		collaborator: string;
		/** Permission level to grant the collaborator */
		permission?: 'read' | 'write' | 'admin';
	};
	'repos.collaborators.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** username of the user to check for being a collaborator */
		collaborator: string;
	};
	'repos.collaborators.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.collaborators.permission': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** username of the collaborator whose permissions are to be obtained */
		collaborator: string;
	};
	'repos.collaborators.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** username of the collaborator to delete */
		collaborator: string;
	};
	'repos.create': {
		/** Whether the repository should be auto-initialized? */
		auto_init?: boolean;
		/** DefaultBranch of the repository (used when initializes and in template) */
		default_branch?: string;
		/** Description of the repository to create */
		description?: string;
		/** Gitignores to use */
		gitignores?: string;
		/** Label-Set to use */
		issue_labels?: string;
		/** License to use */
		license?: string;
		/** Name of the repository to create */
		name: string;
		/** ObjectFormatName of the underlying git repository, empty string for default (sha1) */
		object_format_name?: 'sha1' | 'sha256';
		/** Whether the repository is private */
		private?: boolean;
		/** Readme of the repository to create */
		readme?: string;
		/** Whether the repository is template */
		template?: boolean;
		/** TrustModel of the repository */
		trust_model?:
			| 'default'
			| 'collaborator'
			| 'committer'
			| 'collaboratorcommitter';
	};
	'repos.delete': {
		/** owner of the repo to delete */
		owner: string;
		/** name of the repo to delete */
		repo: string;
	};
	'repos.deployKeys.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** An armored SSH key to add */
		key: string;
		/** Describe if the key has only read access or read/write */
		read_only?: boolean;
		/** Title of the key to add */
		title: string;
	};
	'repos.deployKeys.createToken': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Describe if the token has only read access or read/write */
		read_only?: boolean;
		/** Title of the token to add */
		title: string;
	};
	'repos.deployKeys.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the key to delete */
		id: number;
	};
	'repos.deployKeys.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the key to get */
		id: number;
	};
	'repos.deployKeys.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the key_id to search for */
		key_id?: number;
		/** fingerprint of the key */
		fingerprint?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.downloadArchive': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** the git reference for download with attached archive format (e.g. master.zip) */
		archive: string;
		/** subpath of the repository to download */
		path?: Array<string>;
	};
	'repos.forks.create': {
		/** owner of the repo to fork */
		owner: string;
		/** name of the repo to fork */
		repo: string;
		/** name of the forked repository */
		name?: string;
		/** organization name, if forking into an organization */
		organization?: string;
	};
	'repos.forks.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.generateFromTemplate': {
		/** owner of the template repository */
		template_owner: string;
		/** name of the template repository */
		template_repo: string;
		/** include avatar of the template repo */
		avatar?: boolean;
		/** Default branch of the new repository */
		default_branch?: string;
		/** Description of the repository to create */
		description?: string;
		/** include git content of default branch in template repo */
		git_content?: boolean;
		/** include git hooks in template repo */
		git_hooks?: boolean;
		/** include labels in template repo */
		labels?: boolean;
		name: string;
		/** the organization's name or individual user's name who will own the new repository */
		owner: string;
		/** Whether the repository is private */
		private?: boolean;
		/** include protected branches in template repo */
		protected_branch?: boolean;
		/** include topics in template repo */
		topics?: boolean;
		/** include webhooks in template repo */
		webhooks?: boolean;
	};
	'repos.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.getById': {
		/** id of the repo to get */
		id: number;
	};
	'repos.gitHooks.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to get */
		id: string | number;
	};
	'repos.gitHooks.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to get */
		id: string | number;
	};
	'repos.gitHooks.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.gitHooks.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to get */
		id: string | number;
		/** Content is the new script content for the hook */
		content?: string;
	};
	'repos.languages': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.licenses': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.mergeUpstream': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		branch?: string;
		ff_only?: boolean;
	};
	'repos.migrate': {
		auth_password?: string;
		auth_token?: string;
		auth_username?: string;
		aws_access_key_id?: string;
		aws_secret_access_key?: string;
		clone_addr: string;
		description?: string;
		issues?: boolean;
		labels?: boolean;
		lfs?: boolean;
		lfs_endpoint?: string;
		milestones?: boolean;
		mirror?: boolean;
		mirror_interval?: string;
		private?: boolean;
		pull_requests?: boolean;
		releases?: boolean;
		repo_name: string;
		/** the organization's name or individual user's name who will own the migrated repository */
		repo_owner?: string;
		service?:
			| 'git'
			| 'github'
			| 'gitea'
			| 'gitlab'
			| 'gogs'
			| 'onedev'
			| 'gitbucket'
			| 'codebase'
			| 'codecommit';
		/** deprecated (only for backwards compatibility, use repo_owner instead) */
		uid?: number;
		wiki?: boolean;
	};
	'repos.mirrorSync': {
		/** owner of the repo to sync */
		owner: string;
		/** name of the repo to sync */
		repo: string;
	};
	'repos.newPinAllowed': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.pushMirrors.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The sync interval for automatic updates */
		interval?: string;
		/** The remote repository URL to push to */
		remote_address?: string;
		/** The password for authentication with the remote repository */
		remote_password?: string;
		/** The username for authentication with the remote repository */
		remote_username?: string;
		/** Whether to sync on every commit */
		sync_on_commit?: boolean;
	};
	'repos.pushMirrors.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** remote name of the pushMirror */
		name: string;
	};
	'repos.pushMirrors.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** remote name of push mirror */
		name: string;
	};
	'repos.pushMirrors.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.pushMirrors.sync': {
		/** owner of the repo to sync */
		owner: string;
		/** name of the repo to sync */
		repo: string;
	};
	'repos.rejectTransfer': {
		/** owner of the repo to transfer */
		owner: string;
		/** name of the repo to transfer */
		repo: string;
	};
	'repos.reviewers': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.search': {
		/** keyword */
		q?: string;
		/** Limit search to repositories with keyword as topic */
		topic?: boolean;
		/** include search of keyword within repository description */
		includeDesc?: boolean;
		/** search only for repos that the user with the given id owns or contributes to */
		uid?: number;
		/** repo owner to prioritize in the results */
		priority_owner_id?: number;
		/** search only for repos that belong to the given team id */
		team_id?: number;
		/** search only for repos that the user with the given id has starred */
		starredBy?: number;
		/** include private repositories this user has access to (defaults to true) */
		private?: boolean;
		/** show only pubic, private or all repositories (defaults to all) */
		is_private?: boolean;
		/** include template repositories this user has access to (defaults to true) */
		template?: boolean;
		/** show only archived, non-archived or all repositories (defaults to all) */
		archived?: boolean;
		/** type of repository to search for. Supported values are "fork", "source", "mirror" and "collaborative" */
		mode?: string;
		/** if `uid` is given, search only for repos that the user owns */
		exclusive?: boolean;
		/** sort repos by attribute. Supported values are "alpha", "created", "updated", "size", "git_size", "lfs_size", "stars", "forks" and "id". Default is "alpha" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc", ignored if "sort" is not specified. */
		order?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.signingKey.gpg': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.signingKey.ssh': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.stargazers': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.subscribers': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.subscription.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.subscription.unwatch': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.subscription.watch': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.teams.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** team name */
		team: string;
	};
	'repos.teams.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** team name */
		team: string;
	};
	'repos.teams.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'repos.teams.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** team name */
		team: string;
	};
	'repos.topics.add': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the topic to add */
		topic: string;
	};
	'repos.topics.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.topics.remove': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the topic to delete */
		topic: string;
	};
	'repos.topics.replace': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** list of topic names */
		topics?: Array<string>;
	};
	'repos.trackedTimes': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** optional filter by user (available for issue managers) */
		user?: string;
		/** Only show times updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show times updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'repos.transfer': {
		/** owner of the repo to transfer */
		owner: string;
		/** name of the repo to transfer */
		repo: string;
		new_owner: string;
		/** ID of the team or teams to add to the repository. Teams can only be added to organization-owned repositories. */
		team_ids?: Array<number>;
	};
	'repos.update': {
		/** owner of the repo to edit */
		owner: string;
		/** name of the repo to edit */
		repo: string;
		/** either `true` to allow fast-forward-only merging pull requests, or `false` to prevent fast-forward-only merging. */
		allow_fast_forward_only_merge?: boolean;
		/** either `true` to allow mark pr as merged manually, or `false` to prevent it. */
		allow_manual_merge?: boolean;
		/** either `true` to allow merging pull requests with a merge commit, or `false` to prevent merging pull requests with merge commits. */
		allow_merge_commits?: boolean;
		/** either `true` to allow updating pull request branch by merge, or `false` to prevent it. */
		allow_merge_update?: boolean;
		/** either `true` to allow rebase-merging pull requests, or `false` to prevent rebase-merging. */
		allow_rebase?: boolean;
		/** either `true` to allow rebase with explicit merge commits (--no-ff), or `false` to prevent rebase with explicit merge commits. */
		allow_rebase_explicit?: boolean;
		/** either `true` to allow updating pull request branch by rebase, or `false` to prevent it. */
		allow_rebase_update?: boolean;
		/** either `true` to allow squash-merging pull requests, or `false` to prevent squash-merging. */
		allow_squash_merge?: boolean;
		/** set to `true` to archive this repository. */
		archived?: boolean;
		/** either `true` to enable AutodetectManualMerge, or `false` to prevent it. Note: In some special cases, misjudgments can occur. */
		autodetect_manual_merge?: boolean;
		/** set to `true` to allow edits from maintainers by default */
		default_allow_maintainer_edit?: boolean;
		/** sets the default branch for this repository. */
		default_branch?: string;
		/** set to `true` to delete pr branch after merge by default */
		default_delete_branch_after_merge?: boolean;
		/** set to a merge style to be used by this repository: "merge", "rebase", "rebase-merge", "squash", or "fast-forward-only". */
		default_merge_style?: string;
		/** set to an update style to be used by this repository: "merge" or "rebase". */
		default_update_style?: string;
		/** a short description of the repository. */
		description?: string;
		/** enable prune - remove obsolete remote-tracking references when mirroring */
		enable_prune?: boolean;
		external_tracker?: GiteaExternalTrackerInput;
		external_wiki?: GiteaExternalWikiInput;
		/** either `true` to enable actions unit, or `false` to disable them. */
		has_actions?: boolean;
		/** either `true` to enable code for this repository or `false` to disable it. */
		has_code?: boolean;
		/** either `true` to enable issues for this repository or `false` to disable them. */
		has_issues?: boolean;
		/** either `true` to enable packages unit, or `false` to disable them. */
		has_packages?: boolean;
		/** either `true` to enable project unit, or `false` to disable them. */
		has_projects?: boolean;
		/** either `true` to allow pull requests, or `false` to prevent pull request. */
		has_pull_requests?: boolean;
		/** either `true` to enable releases unit, or `false` to disable them. */
		has_releases?: boolean;
		/** either `true` to enable the wiki for this repository or `false` to disable it. */
		has_wiki?: boolean;
		/** either `true` to ignore whitespace for conflicts, or `false` to not ignore whitespace. */
		ignore_whitespace_conflicts?: boolean;
		internal_tracker?: GiteaInternalTrackerInput;
		/** set to a string like `8h30m0s` to set the mirror interval time */
		mirror_interval?: string;
		/** authentication password for the remote repository (mirrors) */
		mirror_password?: string;
		/** authentication token for the remote repository (mirrors) */
		mirror_token?: string;
		/** authentication username for the remote repository (mirrors) */
		mirror_username?: string;
		/** name of the repository */
		name?: string;
		/** either `true` to make the repository private or `false` to make it public. Note: you will get a 422 error if the organization restricts changing repository visibility to organization owners and a non-owner tries to change the value of private. */
		private?: boolean;
		/** `repo` to only allow repo-level projects, `owner` to only allow owner projects, `all` to allow both. */
		projects_mode?: string;
		/** either `true` to make this repository a template or `false` to make it a normal repository */
		template?: boolean;
		/** a URL with more information about the repository. */
		website?: string;
	};
	'settings.api': Record<string, never>;
	'settings.attachment': Record<string, never>;
	'settings.repository': Record<string, never>;
	'settings.ui': Record<string, never>;
	'tagProtections.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The pattern to match tag names for protection */
		name_pattern?: string;
		/** List of team names allowed to create/delete protected tags */
		whitelist_teams?: Array<string>;
		/** List of usernames allowed to create/delete protected tags */
		whitelist_usernames?: Array<string>;
	};
	'tagProtections.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of protected tag */
		id: number;
	};
	'tagProtections.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the tag protect to get */
		id: number;
	};
	'tagProtections.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'tagProtections.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of protected tag */
		id: number;
		/** The pattern to match tag names for protection */
		name_pattern?: string;
		/** List of team names allowed to create/delete protected tags */
		whitelist_teams?: Array<string>;
		/** List of usernames allowed to create/delete protected tags */
		whitelist_usernames?: Array<string>;
	};
	'tags.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** The message to associate with the tag */
		message?: string;
		/** The name of the tag to create */
		tag_name: string;
		/** The target commit SHA or branch name for the tag */
		target?: string;
	};
	'tags.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of tag to delete */
		tag: string;
	};
	'tags.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of tag */
		tag: string;
	};
	'tags.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results, default maximum page size is 50 */
		limit?: number;
	};
	'teams.activityFeeds.list': {
		/** id of the team */
		id: number;
		/** the date of the activities to be found */
		date?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'teams.delete': {
		/** id of the team to delete */
		id: number;
	};
	'teams.get': {
		/** id of the team to get */
		id: number;
	};
	'teams.members.add': {
		/** id of the team */
		id: number;
		/** username of the user to add to a team */
		username: string;
	};
	'teams.members.get': {
		/** id of the team */
		id: number;
		/** username of the user whose data is to be listed */
		username: string;
	};
	'teams.members.list': {
		/** id of the team */
		id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'teams.members.remove': {
		/** id of the team */
		id: number;
		/** username of the user to remove from a team */
		username: string;
	};
	'teams.repos.add': {
		/** id of the team */
		id: number;
		/** organization that owns the repo to add */
		org: string;
		/** name of the repo to add */
		repo: string;
	};
	'teams.repos.get': {
		/** id of the team */
		id: number;
		/** organization that owns the repo to list */
		org: string;
		/** name of the repo to list */
		repo: string;
	};
	'teams.repos.list': {
		/** id of the team */
		id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'teams.repos.remove': {
		/** id of the team */
		id: number;
		/** organization that owns the repo to remove */
		org: string;
		/** name of the repo to remove */
		repo: string;
	};
	'teams.update': {
		/** id of the team to edit */
		id: number;
		/** Whether the team can create repositories in the organization */
		can_create_org_repo?: boolean;
		/** The description of the team */
		description?: string;
		/** Whether the team has access to all repositories in the organization */
		includes_all_repositories?: boolean;
		name: string;
		/** All units have this permission (read/write/admin) */
		permission?: 'read' | 'write' | 'admin';
		/** Deprecated: This variable should be replaced by UnitsMap and will be dropped in later versions. */
		units?: Array<string>;
		units_map?: Record<string, string>;
		/** Team visibility within the organization. When omitted, visibility is left unchanged. */
		visibility?: 'public' | 'limited' | 'private';
	};
	'user.actions.jobs.list': {
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** sort jobs by attribute. Supported values are "id". Default is "id" */
		sort?: string;
		/** sort order, either "asc" (ascending) or "desc" (descending). Default is "asc" */
		order?: string;
	};
	'user.actions.runners.createRegistrationToken': Record<string, never>;
	'user.actions.runners.delete': {
		/** id of the runner */
		runner_id: string | number;
	};
	'user.actions.runners.get': {
		/** id of the runner */
		runner_id: string | number;
	};
	'user.actions.runners.list': {
		/** filter by disabled status (true or false) */
		disabled?: boolean;
	};
	'user.actions.runners.update': {
		/** id of the runner */
		runner_id: string | number;
		disabled: boolean;
	};
	'user.actions.runs.list': {
		/** workflow event name */
		event?: string;
		/** workflow branch */
		branch?: string;
		/** workflow status (requested, pending, queued, in_progress, failure, success, skipped) */
		status?: string;
		/** triggered by user */
		actor?: string;
		/** triggering sha of the workflow run */
		head_sha?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.actions.secrets.delete': {
		/** name of the secret */
		secretname: string;
	};
	'user.actions.secrets.set': {
		/** name of the secret */
		secretname: string;
		/** Data of the secret to update */
		data: string;
		/** Description of the secret to update */
		description?: string;
	};
	'user.actions.variables.create': {
		/** name of the variable */
		variablename: string;
		/** Description of the variable to create */
		description?: string;
		/** Value of the variable to create */
		value: string;
	};
	'user.actions.variables.delete': {
		/** name of the variable */
		variablename: string;
	};
	'user.actions.variables.get': {
		/** name of the variable */
		variablename: string;
	};
	'user.actions.variables.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.actions.variables.update': {
		/** name of the variable */
		variablename: string;
		/** Description of the variable to update */
		description?: string;
		/** New name for the variable. If the field is empty, the variable name won't be updated. */
		name?: string;
		/** Value of the variable to update */
		value: string;
	};
	'user.avatar.delete': Record<string, never>;
	'user.avatar.update': {
		/** image must be base64 encoded */
		image?: string;
	};
	'user.blocks.add': {
		/** username of the user to block */
		username: string;
		/** optional note for the block */
		note?: string;
	};
	'user.blocks.check': {
		/** username of the user to check */
		username: string;
	};
	'user.blocks.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.blocks.remove': {
		/** username of the user to unblock */
		username: string;
	};
	'user.emails.add': {
		/** email addresses to add */
		emails?: Array<string>;
	};
	'user.emails.list': Record<string, never>;
	'user.emails.remove': {
		/** email addresses to delete */
		emails?: Array<string>;
	};
	'user.followers.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.following.check': {
		/** username of the user to check for authenticated followers */
		username: string;
	};
	'user.following.follow': {
		/** username of the user to follow */
		username: string;
	};
	'user.following.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.following.unfollow': {
		/** username of the user to unfollow */
		username: string;
	};
	'user.gpgKeys.create': {
		/** An armored GPG key to add */
		armored_public_key: string;
		/** An optional armored signature for the GPG key */
		armored_signature?: string;
	};
	'user.gpgKeys.delete': {
		/** id of key to delete */
		id: number;
	};
	'user.gpgKeys.get': {
		/** id of key to get */
		id: number;
	};
	'user.gpgKeys.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.gpgKeys.verificationToken': Record<string, never>;
	'user.gpgKeys.verify': {
		/** Id of the GPG key to verify (`key_id` from user.gpgKeys.list). */
		key_id: string;
		/** The token from user.gpgKeys.verificationToken, signed with the key: `echo -n <token> | gpg -a --default-key <key_id> --detach-sig`. */
		armored_signature: string;
	};
	'user.hooks.create': {
		/** Whether the webhook should be active upon creation */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		config: GiteaCreateHookOptionConfigInput;
		/** List of events that will trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name for the webhook */
		name?: string;
		/** The type of the webhook to create */
		type:
			| 'dingtalk'
			| 'discord'
			| 'gitea'
			| 'gogs'
			| 'msteams'
			| 'slack'
			| 'telegram'
			| 'feishu'
			| 'wechatwork'
			| 'packagist';
	};
	'user.hooks.delete': {
		/** id of the hook to delete */
		id: number;
	};
	'user.hooks.get': {
		/** id of the hook to get */
		id: number;
	};
	'user.hooks.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.hooks.update': {
		/** id of the hook to update */
		id: number;
		/** Whether the webhook is active and will be triggered */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		/** Configuration settings for the webhook */
		config?: Record<string, string>;
		/** List of events that trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name */
		name?: string;
	};
	'user.keys.create': {
		/** An armored SSH key to add */
		key: string;
		/** Describe if the key has only read access or read/write */
		read_only?: boolean;
		/** Title of the key to add */
		title: string;
	};
	'user.keys.delete': {
		/** id of key to delete */
		id: number;
	};
	'user.keys.get': {
		/** id of key to get */
		id: number;
	};
	'user.keys.list': {
		/** fingerprint of the key */
		fingerprint?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.me': Record<string, never>;
	'user.oauth2Apps.create': {
		/** Whether the client is confidential */
		confidential_client?: boolean;
		/** The name of the OAuth2 application */
		name?: string;
		/** The list of allowed redirect URIs */
		redirect_uris?: Array<string>;
		/** Whether to skip secondary authorization */
		skip_secondary_authorization?: boolean;
	};
	'user.oauth2Apps.delete': {
		/** token to be deleted */
		id: number;
	};
	'user.oauth2Apps.get': {
		/** Application ID to be found */
		id: number;
	};
	'user.oauth2Apps.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.oauth2Apps.update': {
		/** application to be updated */
		id: number;
		/** Whether the client is confidential */
		confidential_client?: boolean;
		/** The name of the OAuth2 application */
		name?: string;
		/** The list of allowed redirect URIs */
		redirect_uris?: Array<string>;
		/** Whether to skip secondary authorization */
		skip_secondary_authorization?: boolean;
	};
	'user.orgs.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.projects.columns.create': {
		/** id of the project */
		id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		title: string;
	};
	'user.projects.columns.delete': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'user.projects.columns.get': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'user.projects.columns.issues.add': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'user.projects.columns.issues.list': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.projects.columns.issues.remove': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
	};
	'user.projects.columns.list': {
		/** id of the project */
		id: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.projects.columns.move': {
		/** id of the project */
		id: number;
		/** Every column ID of the project, in the desired left-to-right order */
		column_ids: Array<number>;
	};
	'user.projects.columns.setDefault': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
	};
	'user.projects.columns.update': {
		/** id of the project */
		id: number;
		/** id of the column */
		column_id: number;
		/** Column color in 6-digit hex format, e.g. #FF0000 */
		color?: string;
		/** Position of the column within the project, between -128 and 127 */
		sorting?: number;
		title?: string;
	};
	'user.projects.create': {
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		/** Template type: "none", "basic_kanban" or "bug_triage" */
		template_type?: string;
		title: string;
	};
	'user.projects.delete': {
		/** id of the project */
		id: number;
	};
	'user.projects.get': {
		/** id of the project */
		id: number;
	};
	'user.projects.issues.move': {
		/** id of the project */
		id: number;
		/** global id of the issue, not the repository-local index */
		issue_id: number;
		/** Target column to move the issue into */
		column_id: number;
		/** Position within the column, ascending. Omit to append. Negative values sort above the rest, equal values are ordered newest first. */
		sorting?: number;
	};
	'user.projects.list': {
		/** State of the project (open, closed, all) */
		state?: 'open' | 'closed' | 'all';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.projects.update': {
		/** id of the project */
		id: number;
		/** Card type: "text_only" or "images_and_text" */
		card_type?: string;
		description?: string;
		state?: 'open' | 'closed';
		title?: string;
	};
	'user.settings.get': Record<string, never>;
	'user.settings.update': {
		description?: string;
		diff_view_style?: string;
		full_name?: string;
		hide_activity?: boolean;
		/** Privacy */
		hide_email?: boolean;
		language?: string;
		location?: string;
		theme?: string;
		website?: string;
	};
	'user.starred.check': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
	};
	'user.starred.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.starred.star': {
		/** owner of the repo to star */
		owner: string;
		/** name of the repo to star */
		repo: string;
	};
	'user.starred.unstar': {
		/** owner of the repo to unstar */
		owner: string;
		/** name of the repo to unstar */
		repo: string;
	};
	'user.stopwatches.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.subscriptions.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.teams.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'user.token.delete': Record<string, never>;
	'user.token.get': Record<string, never>;
	'user.trackedTimes.list': {
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
		/** Only show times updated after the given time. This is a timestamp in RFC 3339 format */
		since?: string;
		/** Only show times updated before the given time. This is a timestamp in RFC 3339 format */
		before?: string;
	};
	'users.activityFeeds.list': {
		/** username of the user whose activity feeds are to be listed */
		username: string;
		/** if true, only show actions performed by the requested user */
		'only-performed-by'?: boolean;
		/** the date of the activities to be found */
		date?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.followers.list': {
		/** username of the user whose followers are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.following.check': {
		/** username of the following user */
		username: string;
		/** username of the followed user */
		target: string;
	};
	'users.following.list': {
		/** username of the user whose followed users are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.get': {
		/** username of the user whose data is to be listed */
		username: string;
	};
	'users.gpgKeys.list': {
		/** username of the user whose GPG key list is to be obtained */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.heatmap': {
		/** username of the user whose heatmap is to be obtained */
		username: string;
	};
	'users.keys.list': {
		/** username of the user whose public keys are to be listed */
		username: string;
		/** fingerprint of the key */
		fingerprint?: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.orgs.list': {
		/** username of the user whose organizations are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.orgs.permissions': {
		/** username of the user whose permissions are to be obtained */
		username: string;
		/** name of the organization */
		org: string;
	};
	'users.projects.list': {
		/** username of the user */
		username: string;
		/** State of the project (open, closed, all) */
		state?: 'open' | 'closed' | 'all';
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.repos.list': {
		/** username of the user whose owned repos are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.search': {
		/** keyword */
		q?: string;
		/** ID of the user to search for */
		uid?: number;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.starred.list': {
		/** username of the user whose starred repos are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'users.subscriptions.list': {
		/** username of the user whose watched repos are to be listed */
		username: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'webhooks.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** Whether the webhook should be active upon creation */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		config: GiteaCreateHookOptionConfigInput;
		/** List of events that will trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name for the webhook */
		name?: string;
		/** The type of the webhook to create */
		type:
			| 'dingtalk'
			| 'discord'
			| 'gitea'
			| 'gogs'
			| 'msteams'
			| 'slack'
			| 'telegram'
			| 'feishu'
			| 'wechatwork'
			| 'packagist';
	};
	'webhooks.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to delete */
		id: number;
	};
	'webhooks.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to get */
		id: number;
	};
	'webhooks.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'webhooks.test': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** id of the hook to test */
		id: number;
		/** The name of the commit/branch/tag, indicates which commit will be loaded to the webhook payload. */
		ref?: string;
	};
	'webhooks.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** index of the hook */
		id: number;
		/** Whether the webhook is active and will be triggered */
		active?: boolean;
		/** Authorization header to include in webhook requests */
		authorization_header?: string;
		/** Branch filter pattern to determine which branches trigger the webhook */
		branch_filter?: string;
		/** Configuration settings for the webhook */
		config?: Record<string, string>;
		/** List of events that trigger this webhook */
		events?: Array<string>;
		/** Optional human-readable name */
		name?: string;
	};
	'wiki.create': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** content must be base64 encoded */
		content_base64?: string;
		/** optional commit message summarizing the change */
		message?: string;
		/** page title. leave empty to keep unchanged */
		title?: string;
	};
	'wiki.delete': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the page */
		pageName: string;
	};
	'wiki.get': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the page */
		pageName: string;
	};
	'wiki.list': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** page number of results to return (1-based) */
		page?: number;
		/** page size of results */
		limit?: number;
	};
	'wiki.revisions': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the page */
		pageName: string;
		/** page number of results to return (1-based) */
		page?: number;
	};
	'wiki.update': {
		/** owner of the repo */
		owner: string;
		/** name of the repo */
		repo: string;
		/** name of the page */
		pageName: string;
		/** content must be base64 encoded */
		content_base64?: string;
		/** optional commit message summarizing the change */
		message?: string;
		/** page title. leave empty to keep unchanged */
		title: string;
	};
};

export type GiteaOperationOutputs = {
	'actions.artifacts.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.artifacts.download': FileOutput;
	'actions.artifacts.get': GiteaActionArtifact;
	'actions.artifacts.list': GiteaActionArtifactsResponse;
	'actions.jobs.downloadLogs': FileOutput;
	'actions.jobs.get': GiteaActionWorkflowJob;
	'actions.jobs.list': GiteaActionWorkflowJobsResponse;
	'actions.runners.createRegistrationToken': {
		/** The token a runner registers with. */
		token?: string | null;
	};
	'actions.runners.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.runners.get': GiteaActionRunner;
	'actions.runners.list': GiteaActionRunnersResponse;
	'actions.runners.update': GiteaActionRunner;
	'actions.runs.approve': GiteaActionWorkflowRun;
	'actions.runs.artifacts.list': GiteaActionArtifactsResponse;
	'actions.runs.attempts.get': GiteaActionWorkflowRun;
	'actions.runs.attempts.jobs.list': GiteaActionWorkflowJobsResponse;
	'actions.runs.cancel': GiteaActionWorkflowRun;
	'actions.runs.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.runs.downloadLogs': FileOutput;
	'actions.runs.forceCancel': GiteaActionWorkflowRun;
	'actions.runs.get': GiteaActionWorkflowRun;
	'actions.runs.jobs.list': GiteaActionWorkflowJobsResponse;
	'actions.runs.jobs.rerun': GiteaActionWorkflowJob;
	'actions.runs.list': GiteaActionWorkflowRunsResponse;
	'actions.runs.rerun': GiteaActionWorkflowRun;
	'actions.runs.rerunFailed': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.secrets.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.secrets.list': {
		/** One page of results. */
		items: Array<GiteaSecret>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'actions.secrets.set': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.tasks.list': GiteaActionTaskResponse;
	'actions.variables.create': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.variables.delete':
		| GiteaActionVariable
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'actions.variables.get': GiteaActionVariable;
	'actions.variables.list': {
		/** One page of results. */
		items: Array<GiteaActionVariable>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'actions.variables.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.workflows.disable': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.workflows.dispatch':
		| GiteaRunDetails
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'actions.workflows.enable': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'actions.workflows.get': GiteaActionWorkflow;
	'actions.workflows.list': GiteaActionWorkflowResponse;
	'actions.workflows.runs.list': GiteaActionWorkflowRunsResponse;
	'admin.actions.jobs.list': GiteaActionWorkflowJobsResponse;
	'admin.actions.runners.createRegistrationToken': {
		/** The token a runner registers with. */
		token?: string | null;
	};
	'admin.actions.runners.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.actions.runners.get': GiteaActionRunner;
	'admin.actions.runners.list': GiteaActionRunnersResponse;
	'admin.actions.runners.update': GiteaActionRunner;
	'admin.actions.runs.list': GiteaActionWorkflowRunsResponse;
	'admin.cron.list': {
		/** One page of results. */
		items: Array<GiteaCron>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.cron.run': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.emails.list': {
		/** One page of results. */
		items: Array<GiteaEmail>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.emails.search': {
		/** One page of results. */
		items: Array<GiteaEmail>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.hooks.create': GiteaHook;
	'admin.hooks.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.hooks.get': GiteaHook;
	'admin.hooks.list': {
		/** One page of results. */
		items: Array<GiteaHook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.hooks.update': GiteaHook;
	'admin.orgs.list': {
		/** One page of results. */
		items: Array<GiteaOrganization>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.packages.list': {
		/** One page of results. */
		items: Array<GiteaPackage>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.unadopted.adopt': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.unadopted.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.unadopted.list': {
		/** One page of results. */
		items: Array<string>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.users.badges.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.users.badges.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.users.badges.list': Array<GiteaBadge>;
	'admin.users.create': GiteaUser;
	'admin.users.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.users.keys.create': GiteaPublicKey;
	'admin.users.keys.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.users.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'admin.users.orgs.create': GiteaOrganization;
	'admin.users.rename': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'admin.users.repos.create': GiteaRepository;
	'admin.users.update': GiteaUser;
	'branchProtections.create': GiteaBranchProtection;
	'branchProtections.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'branchProtections.get': GiteaBranchProtection;
	'branchProtections.list': Array<GiteaBranchProtection>;
	'branchProtections.setPriority': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'branchProtections.update': GiteaBranchProtection;
	'branches.create': GiteaBranch;
	'branches.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'branches.get': GiteaBranch;
	'branches.list': {
		/** One page of results. */
		items: Array<GiteaBranch>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'branches.rename': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'branches.setCommit': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'comments.attachments.create': GiteaAttachment;
	'comments.attachments.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'comments.attachments.get': GiteaAttachment;
	'comments.attachments.list': Array<GiteaAttachment>;
	'comments.attachments.update': GiteaAttachment;
	'comments.create': GiteaComment;
	'comments.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'comments.get':
		| GiteaComment
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'comments.list': Array<GiteaComment>;
	'comments.listForRepo': {
		/** One page of results. */
		items: Array<GiteaComment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'comments.reactions.add': GiteaReaction;
	'comments.reactions.list': Array<GiteaReaction>;
	'comments.reactions.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'comments.update':
		| GiteaComment
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'commits.compare': GiteaCompare;
	'commits.downloadDiff': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'commits.get': GiteaCommit;
	'commits.list': {
		/** One page of results. */
		items: Array<GiteaCommit>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'commits.pullRequest': GiteaPullRequest;
	'commits.statuses.combined': GiteaCombinedStatus;
	'commits.statuses.create': GiteaCommitStatus;
	'commits.statuses.list': {
		/** One page of results. */
		items: Array<GiteaCommitStatus>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'commits.statuses.listByRef': {
		/** One page of results. */
		items: Array<GiteaCommitStatus>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'contents.applyPatch': GiteaFileResponse;
	'contents.changeFiles': GiteaFilesResponse;
	'contents.create': GiteaFileResponse;
	'contents.delete': GiteaFileDeleteResponse;
	'contents.editorConfig': GiteaJsonValue;
	'contents.get': GiteaContentsResponse;
	'contents.getExt': GiteaContentsExtResponse;
	'contents.getMany': Array<GiteaContentsResponse>;
	'contents.getManyByPost': Array<GiteaContentsResponse>;
	'contents.list': Array<GiteaContentsResponse>;
	'contents.media': FileOutput;
	'contents.raw': FileOutput;
	'contents.update': GiteaFileResponse;
	'git.blobs.get': GiteaGitBlobResponse;
	'git.notes.get': GiteaNote;
	'git.refs.list': Array<GiteaReference>;
	'git.refs.listMatching': Array<GiteaReference>;
	'git.tags.get': GiteaAnnotatedTag;
	'git.trees.get': GiteaGitTreeResponse;
	'issues.assignees.add': GiteaIssue;
	'issues.assignees.check': GiteaJsonValue;
	'issues.assignees.remove': GiteaIssue;
	'issues.attachments.create': GiteaAttachment;
	'issues.attachments.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.attachments.get': GiteaAttachment;
	'issues.attachments.list': Array<GiteaAttachment>;
	'issues.attachments.update': GiteaAttachment;
	'issues.blocks.add': GiteaIssue;
	'issues.blocks.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.blocks.remove': GiteaIssue;
	'issues.config.get': GiteaIssueConfig;
	'issues.config.validate': GiteaIssueConfigValidation;
	'issues.create': GiteaIssue;
	'issues.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.dependencies.add': GiteaIssue;
	'issues.dependencies.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.dependencies.remove': GiteaIssue;
	'issues.get': GiteaIssue;
	'issues.labels.add': Array<GiteaLabel>;
	'issues.labels.clear': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.labels.list': Array<GiteaLabel>;
	'issues.labels.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.labels.replace': Array<GiteaLabel>;
	'issues.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.listPinned': Array<GiteaIssue>;
	'issues.lock': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.movePin': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.pin': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.reactions.add': GiteaReaction;
	'issues.reactions.list': {
		/** One page of results. */
		items: Array<GiteaReaction>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.reactions.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.search': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.setDeadline': GiteaIssueDeadline;
	'issues.stopwatch.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.stopwatch.start': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.stopwatch.stop': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.subscriptions.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.subscriptions.check': GiteaWatchInfo;
	'issues.subscriptions.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.subscriptions.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.templates.list': Array<GiteaIssueTemplate>;
	'issues.timeline': {
		/** One page of results. */
		items: Array<GiteaTimelineComment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.times.add': GiteaTrackedTime;
	'issues.times.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.times.list': {
		/** One page of results. */
		items: Array<GiteaTrackedTime>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'issues.times.reset': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.unlock': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.unpin': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'issues.update': GiteaIssue;
	'labels.create': GiteaLabel;
	'labels.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'labels.get': GiteaLabel;
	'labels.list': {
		/** One page of results. */
		items: Array<GiteaLabel>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'labels.update': GiteaLabel;
	'milestones.create': GiteaMilestone;
	'milestones.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'milestones.get': GiteaMilestone;
	'milestones.list': {
		/** One page of results. */
		items: Array<GiteaMilestone>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'milestones.update': GiteaMilestone;
	'misc.gitignoreTemplates.get': GiteaGitignoreTemplateInfo;
	'misc.gitignoreTemplates.list': Array<string>;
	'misc.labelTemplates.get': Array<GiteaLabelTemplate>;
	'misc.labelTemplates.list': Array<string>;
	'misc.licenseTemplates.get': GiteaLicenseTemplateInfo;
	'misc.licenseTemplates.list': Array<GiteaLicensesTemplateListEntry>;
	'misc.markdown.render': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'misc.markdown.renderRaw': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'misc.markup.render': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'misc.signingKey.gpg': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'misc.signingKey.ssh': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'misc.topics.search': GiteaTopicListResponse;
	'misc.version': GiteaServerVersion;
	'notifications.countNew': GiteaNotificationCount;
	'notifications.list': {
		/** One page of results. */
		items: Array<GiteaNotificationThread>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'notifications.listForRepo': {
		/** One page of results. */
		items: Array<GiteaNotificationThread>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'notifications.markRead':
		| Array<GiteaNotificationThread>
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'notifications.markReadForRepo':
		| Array<GiteaNotificationThread>
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'notifications.threads.get': GiteaNotificationThread;
	'notifications.threads.markRead':
		| GiteaNotificationThread
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'orgs.actions.jobs.list': GiteaActionWorkflowJobsResponse;
	'orgs.actions.runners.createRegistrationToken': {
		/** The token a runner registers with. */
		token?: string | null;
	};
	'orgs.actions.runners.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.actions.runners.get': GiteaActionRunner;
	'orgs.actions.runners.list': GiteaActionRunnersResponse;
	'orgs.actions.runners.update': GiteaActionRunner;
	'orgs.actions.runs.list': GiteaActionWorkflowRunsResponse;
	'orgs.actions.secrets.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.actions.secrets.list': {
		/** One page of results. */
		items: Array<GiteaSecret>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.actions.secrets.set': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.actions.variables.create': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.actions.variables.delete':
		| GiteaActionVariable
		| {
				/** Gitea accepted the call; it answered with no body. */ success: true;
		  };
	'orgs.actions.variables.get': GiteaActionVariable;
	'orgs.actions.variables.list': {
		/** One page of results. */
		items: Array<GiteaActionVariable>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.actions.variables.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.activityFeeds.list': {
		/** One page of results. */
		items: Array<GiteaActivity>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.avatar.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.avatar.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.blocks.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.blocks.check': GiteaJsonValue;
	'orgs.blocks.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.blocks.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.create': GiteaOrganization;
	'orgs.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.get': GiteaOrganization;
	'orgs.hooks.create': GiteaHook;
	'orgs.hooks.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.hooks.get': GiteaHook;
	'orgs.hooks.list': {
		/** One page of results. */
		items: Array<GiteaHook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.hooks.update': GiteaHook;
	'orgs.labels.create': GiteaLabel;
	'orgs.labels.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.labels.get': GiteaLabel;
	'orgs.labels.list': {
		/** One page of results. */
		items: Array<GiteaLabel>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.labels.update': GiteaLabel;
	'orgs.list': {
		/** One page of results. */
		items: Array<GiteaOrganization>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.members.check': GiteaJsonValue;
	'orgs.members.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.members.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.create': GiteaProjectColumn;
	'orgs.projects.columns.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.get': GiteaProjectColumn;
	'orgs.projects.columns.issues.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.issues.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.projects.columns.issues.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.list': {
		/** One page of results. */
		items: Array<GiteaProjectColumn>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.projects.columns.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.setDefault': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.columns.update': GiteaProjectColumn;
	'orgs.projects.create': GiteaProject;
	'orgs.projects.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.get': GiteaProject;
	'orgs.projects.issues.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.projects.list': {
		/** One page of results. */
		items: Array<GiteaProject>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.projects.update': GiteaProject;
	'orgs.publicMembers.check': GiteaJsonValue;
	'orgs.publicMembers.conceal': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.publicMembers.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.publicMembers.publicize': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.rename': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.repos.create': GiteaRepository;
	'orgs.repos.deleteAll': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'orgs.repos.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.teams.create': GiteaTeam;
	'orgs.teams.list': {
		/** One page of results. */
		items: Array<GiteaTeam>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orgs.teams.search': {
		data?: Array<GiteaTeam> | null;
		ok?: boolean | null;
	};
	'orgs.update': GiteaOrganization;
	'packages.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'packages.link': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'packages.list': {
		/** One page of results. */
		items: Array<GiteaPackage>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'packages.unlink': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'packages.versions.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'packages.versions.files.list': Array<GiteaPackageFile>;
	'packages.versions.get': GiteaPackage;
	'packages.versions.getLatest': GiteaPackage;
	'packages.versions.list': {
		/** One page of results. */
		items: Array<GiteaPackage>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.columns.create': GiteaProjectColumn;
	'projects.columns.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.columns.get': GiteaProjectColumn;
	'projects.columns.issues.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.columns.issues.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.columns.issues.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.columns.list': {
		/** One page of results. */
		items: Array<GiteaProjectColumn>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.columns.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.columns.setDefault': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.columns.update': GiteaProjectColumn;
	'projects.create': GiteaProject;
	'projects.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.get': GiteaProject;
	'projects.issues.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'projects.list': {
		/** One page of results. */
		items: Array<GiteaProject>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.update': GiteaProject;
	'pulls.cancelAutoMerge': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.commits': {
		/** One page of results. */
		items: Array<GiteaCommit>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pulls.create': GiteaPullRequest;
	'pulls.downloadDiff': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'pulls.files': {
		/** One page of results. */
		items: Array<GiteaChangedFile>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pulls.get': GiteaPullRequest;
	'pulls.getByBaseHead': GiteaPullRequest;
	'pulls.isMerged': GiteaJsonValue;
	'pulls.list': {
		/** One page of results. */
		items: Array<GiteaPullRequest>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pulls.listPinned': Array<GiteaPullRequest>;
	'pulls.merge': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.requestedReviewers.add': Array<GiteaPullReview>;
	'pulls.requestedReviewers.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.reviewComments.reply': GiteaPullReviewComment;
	'pulls.reviewComments.resolve': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.reviewComments.unresolve': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.reviews.comments': Array<GiteaPullReviewComment>;
	'pulls.reviews.create': GiteaPullReview;
	'pulls.reviews.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'pulls.reviews.dismiss': GiteaPullReview;
	'pulls.reviews.get': GiteaPullReview;
	'pulls.reviews.list': {
		/** One page of results. */
		items: Array<GiteaPullReview>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pulls.reviews.submit': GiteaPullReview;
	'pulls.reviews.undismiss': GiteaPullReview;
	'pulls.update': GiteaPullRequest;
	'pulls.updateBranch': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'releases.assets.create': GiteaAttachment;
	'releases.assets.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'releases.assets.get': GiteaAttachment;
	'releases.assets.list': Array<GiteaAttachment>;
	'releases.assets.update': GiteaAttachment;
	'releases.create': GiteaRelease;
	'releases.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'releases.deleteByTag': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'releases.get': GiteaRelease;
	'releases.getByTag': GiteaRelease;
	'releases.getLatest': GiteaRelease;
	'releases.list': {
		/** One page of results. */
		items: Array<GiteaRelease>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'releases.update': GiteaRelease;
	'repos.acceptTransfer': GiteaRepository;
	'repos.activityFeeds.list': {
		/** One page of results. */
		items: Array<GiteaActivity>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.assignees.check': GiteaJsonValue;
	'repos.assignees.list': Array<GiteaUser>;
	'repos.avatar.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.avatar.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.collaborators.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.collaborators.check': GiteaJsonValue;
	'repos.collaborators.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.collaborators.permission': GiteaRepoCollaboratorPermission;
	'repos.collaborators.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.create': GiteaRepository;
	'repos.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.deployKeys.create': GiteaDeployKey;
	'repos.deployKeys.createToken': GiteaDeployKey;
	'repos.deployKeys.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.deployKeys.get': GiteaDeployKey;
	'repos.deployKeys.list': {
		/** One page of results. */
		items: Array<GiteaDeployKey>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.downloadArchive': FileOutput;
	'repos.forks.create': GiteaRepository;
	'repos.forks.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.generateFromTemplate': GiteaRepository;
	'repos.get': GiteaRepository;
	'repos.getById': GiteaRepository;
	'repos.gitHooks.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.gitHooks.get': GiteaGitHook;
	'repos.gitHooks.list': Array<GiteaGitHook>;
	'repos.gitHooks.update': GiteaGitHook;
	'repos.languages': Record<string, number>;
	'repos.licenses': Array<string>;
	'repos.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.mergeUpstream': GiteaMergeUpstreamResponse;
	'repos.migrate': GiteaRepository;
	'repos.mirrorSync': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.newPinAllowed': GiteaNewIssuePinsAllowed;
	'repos.pushMirrors.add': GiteaPushMirror;
	'repos.pushMirrors.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.pushMirrors.get': GiteaPushMirror;
	'repos.pushMirrors.list': {
		/** One page of results. */
		items: Array<GiteaPushMirror>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.pushMirrors.sync': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.rejectTransfer': GiteaRepository;
	'repos.reviewers': Array<GiteaUser>;
	'repos.search': GiteaSearchResults;
	'repos.signingKey.gpg': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'repos.signingKey.ssh': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'repos.stargazers': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.subscribers': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.subscription.get': GiteaWatchInfo;
	'repos.subscription.unwatch': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.subscription.watch': GiteaWatchInfo;
	'repos.teams.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.teams.check': GiteaTeam;
	'repos.teams.list': Array<GiteaTeam>;
	'repos.teams.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.topics.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.topics.list': GiteaTopicName;
	'repos.topics.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.topics.replace': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'repos.trackedTimes': {
		/** One page of results. */
		items: Array<GiteaTrackedTime>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'repos.transfer': GiteaRepository;
	'repos.update': GiteaRepository;
	'settings.api': GiteaGeneralAPISettings;
	'settings.attachment': GiteaGeneralAttachmentSettings;
	'settings.repository': GiteaGeneralRepoSettings;
	'settings.ui': GiteaGeneralUISettings;
	'tagProtections.create': GiteaTagProtection;
	'tagProtections.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'tagProtections.get': GiteaTagProtection;
	'tagProtections.list': Array<GiteaTagProtection>;
	'tagProtections.update': GiteaTagProtection;
	'tags.create': GiteaTag;
	'tags.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'tags.get': GiteaTag;
	'tags.list': {
		/** One page of results. */
		items: Array<GiteaTag>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'teams.activityFeeds.list': {
		/** One page of results. */
		items: Array<GiteaActivity>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'teams.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'teams.get': GiteaTeam;
	'teams.members.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'teams.members.get': GiteaUser;
	'teams.members.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'teams.members.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'teams.repos.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'teams.repos.get': GiteaRepository;
	'teams.repos.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'teams.repos.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'teams.update': GiteaTeam;
	'user.actions.jobs.list': GiteaActionWorkflowJobsResponse;
	'user.actions.runners.createRegistrationToken': {
		/** The token a runner registers with. */
		token?: string | null;
	};
	'user.actions.runners.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.actions.runners.get': GiteaActionRunner;
	'user.actions.runners.list': GiteaActionRunnersResponse;
	'user.actions.runners.update': GiteaActionRunner;
	'user.actions.runs.list': GiteaActionWorkflowRunsResponse;
	'user.actions.secrets.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.actions.secrets.set': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.actions.variables.create': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.actions.variables.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.actions.variables.get': GiteaActionVariable;
	'user.actions.variables.list': {
		/** One page of results. */
		items: Array<GiteaActionVariable>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.actions.variables.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.avatar.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.avatar.update': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.blocks.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.blocks.check': GiteaJsonValue;
	'user.blocks.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.blocks.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.emails.add': Array<GiteaEmail>;
	'user.emails.list': Array<GiteaEmail>;
	'user.emails.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.followers.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.following.check': GiteaJsonValue;
	'user.following.follow': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.following.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.following.unfollow': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.gpgKeys.create': GiteaGPGKey;
	'user.gpgKeys.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.gpgKeys.get': GiteaGPGKey;
	'user.gpgKeys.list': {
		/** One page of results. */
		items: Array<GiteaGPGKey>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.gpgKeys.verificationToken': {
		/** The body Gitea answered with (text, HTML or a diff). */
		text: string;
	};
	'user.gpgKeys.verify': GiteaGPGKey;
	'user.hooks.create': GiteaHook;
	'user.hooks.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.hooks.get': GiteaHook;
	'user.hooks.list': {
		/** One page of results. */
		items: Array<GiteaHook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.hooks.update': GiteaHook;
	'user.keys.create': GiteaPublicKey;
	'user.keys.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.keys.get': GiteaPublicKey;
	'user.keys.list': {
		/** One page of results. */
		items: Array<GiteaPublicKey>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.me': GiteaUser;
	'user.oauth2Apps.create': GiteaOAuth2Application;
	'user.oauth2Apps.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.oauth2Apps.get': GiteaOAuth2Application;
	'user.oauth2Apps.list': {
		/** One page of results. */
		items: Array<GiteaOAuth2Application>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.oauth2Apps.update': GiteaOAuth2Application;
	'user.orgs.list': {
		/** One page of results. */
		items: Array<GiteaOrganization>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.projects.columns.create': GiteaProjectColumn;
	'user.projects.columns.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.columns.get': GiteaProjectColumn;
	'user.projects.columns.issues.add': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.columns.issues.list': {
		/** One page of results. */
		items: Array<GiteaIssue>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.projects.columns.issues.remove': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.columns.list': {
		/** One page of results. */
		items: Array<GiteaProjectColumn>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.projects.columns.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.columns.setDefault': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.columns.update': GiteaProjectColumn;
	'user.projects.create': GiteaProject;
	'user.projects.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.get': GiteaProject;
	'user.projects.issues.move': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.projects.list': {
		/** One page of results. */
		items: Array<GiteaProject>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.projects.update': GiteaProject;
	'user.settings.get': GiteaUserSettings;
	'user.settings.update': GiteaUserSettings;
	'user.starred.check': GiteaJsonValue;
	'user.starred.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.starred.star': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.starred.unstar': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.stopwatches.list': {
		/** One page of results. */
		items: Array<GiteaStopWatch>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.subscriptions.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.teams.list': {
		/** One page of results. */
		items: Array<GiteaTeam>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'user.token.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'user.token.get': GiteaCurrentAccessToken;
	'user.trackedTimes.list': {
		/** One page of results. */
		items: Array<GiteaTrackedTime>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.activityFeeds.list': {
		/** One page of results. */
		items: Array<GiteaActivity>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.followers.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.following.check': GiteaJsonValue;
	'users.following.list': {
		/** One page of results. */
		items: Array<GiteaUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.get': GiteaUser;
	'users.gpgKeys.list': {
		/** One page of results. */
		items: Array<GiteaGPGKey>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.heatmap': Array<GiteaUserHeatmapData>;
	'users.keys.list': {
		/** One page of results. */
		items: Array<GiteaPublicKey>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.orgs.list': {
		/** One page of results. */
		items: Array<GiteaOrganization>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.orgs.permissions': GiteaOrganizationPermissions;
	'users.projects.list': {
		/** One page of results. */
		items: Array<GiteaProject>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.repos.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.search': {
		data?: Array<GiteaUser> | null;
		ok?: boolean | null;
	};
	'users.starred.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.subscriptions.list': {
		/** One page of results. */
		items: Array<GiteaRepository>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'webhooks.create': GiteaHook;
	'webhooks.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.get': GiteaHook;
	'webhooks.list': {
		/** One page of results. */
		items: Array<GiteaHook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'webhooks.test': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.update': GiteaHook;
	'wiki.create': GiteaWikiPage;
	'wiki.delete': {
		/** Gitea accepted the call; it answered with no body. */
		success: true;
	};
	'wiki.get': GiteaWikiPage;
	'wiki.list': {
		/** One page of results. */
		items: Array<GiteaWikiPageMetaData>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'wiki.revisions': GiteaWikiCommitList;
	'wiki.update': GiteaWikiPage;
};
