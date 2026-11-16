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
import {
	Account,
	CheckIns,
	Comments,
	Deploys,
	Environments,
	Faults,
	Insights,
	Notices,
	Occurrences,
	Projects,
	Sites,
} from './endpoints';
import type {
	HoneybadgerEndpointInputs,
	HoneybadgerEndpointOutputs,
} from './endpoints/types';
import {
	HoneybadgerEndpointInputSchemas,
	HoneybadgerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { HoneybadgerSchema } from './schema';

export type HoneybadgerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Which Honeybadger app the account is on. A US token is rejected by the EU
	 * host and the reverse, and the two are separate deployments, so this cannot
	 * be detected from the token prefix (`hbu_` and `hba_` exist in both).
	 */
	region?: 'us' | 'eu';
	hooks?: InternalHoneybadgerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof honeybadgerEndpointsNested>;
};

export type HoneybadgerContext = CorsairPluginContext<
	typeof HoneybadgerSchema,
	HoneybadgerPluginOptions
>;

export type HoneybadgerKeyBuilderContext =
	KeyBuilderContext<HoneybadgerPluginOptions>;

export type HoneybadgerBoundEndpoints = BindEndpoints<
	typeof honeybadgerEndpointsNested
>;

type HoneybadgerEndpoint<K extends keyof HoneybadgerEndpointOutputs> =
	CorsairEndpoint<
		HoneybadgerContext,
		HoneybadgerEndpointInputs[K],
		HoneybadgerEndpointOutputs[K]
	>;

export type HoneybadgerEndpoints = {
	projectsList: HoneybadgerEndpoint<'projects.list'>;
	projectsGet: HoneybadgerEndpoint<'projects.get'>;
	projectsCreate: HoneybadgerEndpoint<'projects.create'>;
	projectsUpdate: HoneybadgerEndpoint<'projects.update'>;
	projectsDelete: HoneybadgerEndpoint<'projects.delete'>;
	projectsStats: HoneybadgerEndpoint<'projects.stats'>;
	projectsOccurrences: HoneybadgerEndpoint<'projects.occurrences'>;
	occurrencesList: HoneybadgerEndpoint<'occurrences.list'>;
	faultsList: HoneybadgerEndpoint<'faults.list'>;
	faultsGet: HoneybadgerEndpoint<'faults.get'>;
	faultsUpdate: HoneybadgerEndpoint<'faults.update'>;
	faultsDelete: HoneybadgerEndpoint<'faults.delete'>;
	faultsResolve: HoneybadgerEndpoint<'faults.resolve'>;
	faultsUnresolve: HoneybadgerEndpoint<'faults.unresolve'>;
	faultsIgnore: HoneybadgerEndpoint<'faults.ignore'>;
	faultsUnignore: HoneybadgerEndpoint<'faults.unignore'>;
	faultsSummary: HoneybadgerEndpoint<'faults.summary'>;
	faultsAssign: HoneybadgerEndpoint<'faults.assign'>;
	faultsUnassign: HoneybadgerEndpoint<'faults.unassign'>;
	faultsMerge: HoneybadgerEndpoint<'faults.merge'>;
	faultsPauseRecording: HoneybadgerEndpoint<'faults.pauseRecording'>;
	faultsResumeRecording: HoneybadgerEndpoint<'faults.resumeRecording'>;
	faultsSnooze: HoneybadgerEndpoint<'faults.snooze'>;
	faultsUnsnooze: HoneybadgerEndpoint<'faults.unsnooze'>;
	faultsAffectedUsers: HoneybadgerEndpoint<'faults.affectedUsers'>;
	faultsOccurrences: HoneybadgerEndpoint<'faults.occurrences'>;
	noticesList: HoneybadgerEndpoint<'notices.list'>;
	noticesGet: HoneybadgerEndpoint<'notices.get'>;
	commentsList: HoneybadgerEndpoint<'comments.list'>;
	commentsGet: HoneybadgerEndpoint<'comments.get'>;
	commentsCreate: HoneybadgerEndpoint<'comments.create'>;
	commentsUpdate: HoneybadgerEndpoint<'comments.update'>;
	commentsDelete: HoneybadgerEndpoint<'comments.delete'>;
	deploysList: HoneybadgerEndpoint<'deploys.list'>;
	deploysGet: HoneybadgerEndpoint<'deploys.get'>;
	deploysDelete: HoneybadgerEndpoint<'deploys.delete'>;
	environmentsList: HoneybadgerEndpoint<'environments.list'>;
	environmentsGet: HoneybadgerEndpoint<'environments.get'>;
	environmentsCreate: HoneybadgerEndpoint<'environments.create'>;
	environmentsUpdate: HoneybadgerEndpoint<'environments.update'>;
	environmentsDelete: HoneybadgerEndpoint<'environments.delete'>;
	environmentsBulkDelete: HoneybadgerEndpoint<'environments.bulkDelete'>;
	environmentsBulkUpdate: HoneybadgerEndpoint<'environments.bulkUpdate'>;
	checkInsList: HoneybadgerEndpoint<'checkIns.list'>;
	checkInsGet: HoneybadgerEndpoint<'checkIns.get'>;
	checkInsCreate: HoneybadgerEndpoint<'checkIns.create'>;
	checkInsUpdate: HoneybadgerEndpoint<'checkIns.update'>;
	checkInsDelete: HoneybadgerEndpoint<'checkIns.delete'>;
	checkInsReplace: HoneybadgerEndpoint<'checkIns.replace'>;
	checkInsEvents: HoneybadgerEndpoint<'checkIns.events'>;
	sitesList: HoneybadgerEndpoint<'sites.list'>;
	sitesGet: HoneybadgerEndpoint<'sites.get'>;
	sitesCreate: HoneybadgerEndpoint<'sites.create'>;
	sitesUpdate: HoneybadgerEndpoint<'sites.update'>;
	sitesDelete: HoneybadgerEndpoint<'sites.delete'>;
	sitesChecks: HoneybadgerEndpoint<'sites.checks'>;
	sitesOutages: HoneybadgerEndpoint<'sites.outages'>;
	streamsList: HoneybadgerEndpoint<'streams.list'>;
	insightsQuery: HoneybadgerEndpoint<'insights.query'>;
	accountGet: HoneybadgerEndpoint<'account.get'>;
	accountUsage: HoneybadgerEndpoint<'account.usage'>;
	tokenGet: HoneybadgerEndpoint<'token.get'>;
};

const honeybadgerEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
		stats: Projects.stats,
		occurrences: Projects.occurrences,
	},
	occurrences: {
		list: Occurrences.occurrences,
	},
	faults: {
		list: Faults.list,
		get: Faults.get,
		update: Faults.update,
		delete: Faults.remove,
		resolve: Faults.resolve,
		unresolve: Faults.unresolve,
		ignore: Faults.ignore,
		unignore: Faults.unignore,
		summary: Faults.summary,
		assign: Faults.assign,
		unassign: Faults.unassign,
		merge: Faults.merge,
		pauseRecording: Faults.pauseRecording,
		resumeRecording: Faults.resumeRecording,
		snooze: Faults.snooze,
		unsnooze: Faults.unsnooze,
		affectedUsers: Faults.affectedUsers,
		occurrences: Faults.occurrences,
	},
	notices: {
		list: Notices.noticesList,
		get: Notices.get,
	},
	comments: {
		list: Comments.commentsList,
		get: Comments.commentsGet,
		create: Comments.commentsCreate,
		update: Comments.commentsUpdate,
		delete: Comments.commentsDelete,
	},
	deploys: {
		list: Deploys.deploysList,
		get: Deploys.deploysGet,
		delete: Deploys.deploysDelete,
	},
	environments: {
		list: Environments.environmentsList,
		get: Environments.environmentsGet,
		create: Environments.environmentsCreate,
		update: Environments.environmentsUpdate,
		delete: Environments.environmentsDelete,
		bulkDelete: Environments.environmentsBulkDelete,
		bulkUpdate: Environments.environmentsBulkUpdate,
	},
	checkIns: {
		list: CheckIns.checkInsList,
		get: CheckIns.checkInsGet,
		create: CheckIns.checkInsCreate,
		update: CheckIns.checkInsUpdate,
		delete: CheckIns.checkInsDelete,
		replace: CheckIns.checkInsReplace,
		events: CheckIns.checkInsEvents,
	},
	sites: {
		list: Sites.sitesList,
		get: Sites.sitesGet,
		create: Sites.sitesCreate,
		update: Sites.sitesUpdate,
		delete: Sites.sitesDelete,
		checks: Sites.sitesChecks,
		outages: Sites.sitesOutages,
	},
	streams: {
		list: Insights.streamsList,
	},
	insights: {
		query: Insights.query,
	},
	account: {
		get: Account.accountGet,
		usage: Account.accountUsage,
	},
	token: {
		get: Account.tokenGet,
	},
} as const;

export const honeybadgerEndpointSchemas = {
	'projects.list': {
		input: HoneybadgerEndpointInputSchemas['projects.list'],
		output: HoneybadgerEndpointOutputSchemas['projects.list'],
	},
	'projects.get': {
		input: HoneybadgerEndpointInputSchemas['projects.get'],
		output: HoneybadgerEndpointOutputSchemas['projects.get'],
	},
	'projects.create': {
		input: HoneybadgerEndpointInputSchemas['projects.create'],
		output: HoneybadgerEndpointOutputSchemas['projects.create'],
	},
	'projects.update': {
		input: HoneybadgerEndpointInputSchemas['projects.update'],
		output: HoneybadgerEndpointOutputSchemas['projects.update'],
	},
	'projects.delete': {
		input: HoneybadgerEndpointInputSchemas['projects.delete'],
		output: HoneybadgerEndpointOutputSchemas['projects.delete'],
	},
	'projects.stats': {
		input: HoneybadgerEndpointInputSchemas['projects.stats'],
		output: HoneybadgerEndpointOutputSchemas['projects.stats'],
	},
	'projects.occurrences': {
		input: HoneybadgerEndpointInputSchemas['projects.occurrences'],
		output: HoneybadgerEndpointOutputSchemas['projects.occurrences'],
	},
	'occurrences.list': {
		input: HoneybadgerEndpointInputSchemas['occurrences.list'],
		output: HoneybadgerEndpointOutputSchemas['occurrences.list'],
	},
	'faults.list': {
		input: HoneybadgerEndpointInputSchemas['faults.list'],
		output: HoneybadgerEndpointOutputSchemas['faults.list'],
	},
	'faults.get': {
		input: HoneybadgerEndpointInputSchemas['faults.get'],
		output: HoneybadgerEndpointOutputSchemas['faults.get'],
	},
	'faults.update': {
		input: HoneybadgerEndpointInputSchemas['faults.update'],
		output: HoneybadgerEndpointOutputSchemas['faults.update'],
	},
	'faults.delete': {
		input: HoneybadgerEndpointInputSchemas['faults.delete'],
		output: HoneybadgerEndpointOutputSchemas['faults.delete'],
	},
	'faults.resolve': {
		input: HoneybadgerEndpointInputSchemas['faults.resolve'],
		output: HoneybadgerEndpointOutputSchemas['faults.resolve'],
	},
	'faults.unresolve': {
		input: HoneybadgerEndpointInputSchemas['faults.unresolve'],
		output: HoneybadgerEndpointOutputSchemas['faults.unresolve'],
	},
	'faults.ignore': {
		input: HoneybadgerEndpointInputSchemas['faults.ignore'],
		output: HoneybadgerEndpointOutputSchemas['faults.ignore'],
	},
	'faults.unignore': {
		input: HoneybadgerEndpointInputSchemas['faults.unignore'],
		output: HoneybadgerEndpointOutputSchemas['faults.unignore'],
	},
	'faults.summary': {
		input: HoneybadgerEndpointInputSchemas['faults.summary'],
		output: HoneybadgerEndpointOutputSchemas['faults.summary'],
	},
	'faults.assign': {
		input: HoneybadgerEndpointInputSchemas['faults.assign'],
		output: HoneybadgerEndpointOutputSchemas['faults.assign'],
	},
	'faults.unassign': {
		input: HoneybadgerEndpointInputSchemas['faults.unassign'],
		output: HoneybadgerEndpointOutputSchemas['faults.unassign'],
	},
	'faults.merge': {
		input: HoneybadgerEndpointInputSchemas['faults.merge'],
		output: HoneybadgerEndpointOutputSchemas['faults.merge'],
	},
	'faults.pauseRecording': {
		input: HoneybadgerEndpointInputSchemas['faults.pauseRecording'],
		output: HoneybadgerEndpointOutputSchemas['faults.pauseRecording'],
	},
	'faults.resumeRecording': {
		input: HoneybadgerEndpointInputSchemas['faults.resumeRecording'],
		output: HoneybadgerEndpointOutputSchemas['faults.resumeRecording'],
	},
	'faults.snooze': {
		input: HoneybadgerEndpointInputSchemas['faults.snooze'],
		output: HoneybadgerEndpointOutputSchemas['faults.snooze'],
	},
	'faults.unsnooze': {
		input: HoneybadgerEndpointInputSchemas['faults.unsnooze'],
		output: HoneybadgerEndpointOutputSchemas['faults.unsnooze'],
	},
	'faults.affectedUsers': {
		input: HoneybadgerEndpointInputSchemas['faults.affectedUsers'],
		output: HoneybadgerEndpointOutputSchemas['faults.affectedUsers'],
	},
	'faults.occurrences': {
		input: HoneybadgerEndpointInputSchemas['faults.occurrences'],
		output: HoneybadgerEndpointOutputSchemas['faults.occurrences'],
	},
	'notices.list': {
		input: HoneybadgerEndpointInputSchemas['notices.list'],
		output: HoneybadgerEndpointOutputSchemas['notices.list'],
	},
	'notices.get': {
		input: HoneybadgerEndpointInputSchemas['notices.get'],
		output: HoneybadgerEndpointOutputSchemas['notices.get'],
	},
	'comments.list': {
		input: HoneybadgerEndpointInputSchemas['comments.list'],
		output: HoneybadgerEndpointOutputSchemas['comments.list'],
	},
	'comments.get': {
		input: HoneybadgerEndpointInputSchemas['comments.get'],
		output: HoneybadgerEndpointOutputSchemas['comments.get'],
	},
	'comments.create': {
		input: HoneybadgerEndpointInputSchemas['comments.create'],
		output: HoneybadgerEndpointOutputSchemas['comments.create'],
	},
	'comments.update': {
		input: HoneybadgerEndpointInputSchemas['comments.update'],
		output: HoneybadgerEndpointOutputSchemas['comments.update'],
	},
	'comments.delete': {
		input: HoneybadgerEndpointInputSchemas['comments.delete'],
		output: HoneybadgerEndpointOutputSchemas['comments.delete'],
	},
	'deploys.list': {
		input: HoneybadgerEndpointInputSchemas['deploys.list'],
		output: HoneybadgerEndpointOutputSchemas['deploys.list'],
	},
	'deploys.get': {
		input: HoneybadgerEndpointInputSchemas['deploys.get'],
		output: HoneybadgerEndpointOutputSchemas['deploys.get'],
	},
	'deploys.delete': {
		input: HoneybadgerEndpointInputSchemas['deploys.delete'],
		output: HoneybadgerEndpointOutputSchemas['deploys.delete'],
	},
	'environments.list': {
		input: HoneybadgerEndpointInputSchemas['environments.list'],
		output: HoneybadgerEndpointOutputSchemas['environments.list'],
	},
	'environments.get': {
		input: HoneybadgerEndpointInputSchemas['environments.get'],
		output: HoneybadgerEndpointOutputSchemas['environments.get'],
	},
	'environments.create': {
		input: HoneybadgerEndpointInputSchemas['environments.create'],
		output: HoneybadgerEndpointOutputSchemas['environments.create'],
	},
	'environments.update': {
		input: HoneybadgerEndpointInputSchemas['environments.update'],
		output: HoneybadgerEndpointOutputSchemas['environments.update'],
	},
	'environments.delete': {
		input: HoneybadgerEndpointInputSchemas['environments.delete'],
		output: HoneybadgerEndpointOutputSchemas['environments.delete'],
	},
	'environments.bulkDelete': {
		input: HoneybadgerEndpointInputSchemas['environments.bulkDelete'],
		output: HoneybadgerEndpointOutputSchemas['environments.bulkDelete'],
	},
	'environments.bulkUpdate': {
		input: HoneybadgerEndpointInputSchemas['environments.bulkUpdate'],
		output: HoneybadgerEndpointOutputSchemas['environments.bulkUpdate'],
	},
	'checkIns.list': {
		input: HoneybadgerEndpointInputSchemas['checkIns.list'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.list'],
	},
	'checkIns.get': {
		input: HoneybadgerEndpointInputSchemas['checkIns.get'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.get'],
	},
	'checkIns.create': {
		input: HoneybadgerEndpointInputSchemas['checkIns.create'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.create'],
	},
	'checkIns.update': {
		input: HoneybadgerEndpointInputSchemas['checkIns.update'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.update'],
	},
	'checkIns.delete': {
		input: HoneybadgerEndpointInputSchemas['checkIns.delete'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.delete'],
	},
	'checkIns.replace': {
		input: HoneybadgerEndpointInputSchemas['checkIns.replace'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.replace'],
	},
	'checkIns.events': {
		input: HoneybadgerEndpointInputSchemas['checkIns.events'],
		output: HoneybadgerEndpointOutputSchemas['checkIns.events'],
	},
	'sites.list': {
		input: HoneybadgerEndpointInputSchemas['sites.list'],
		output: HoneybadgerEndpointOutputSchemas['sites.list'],
	},
	'sites.get': {
		input: HoneybadgerEndpointInputSchemas['sites.get'],
		output: HoneybadgerEndpointOutputSchemas['sites.get'],
	},
	'sites.create': {
		input: HoneybadgerEndpointInputSchemas['sites.create'],
		output: HoneybadgerEndpointOutputSchemas['sites.create'],
	},
	'sites.update': {
		input: HoneybadgerEndpointInputSchemas['sites.update'],
		output: HoneybadgerEndpointOutputSchemas['sites.update'],
	},
	'sites.delete': {
		input: HoneybadgerEndpointInputSchemas['sites.delete'],
		output: HoneybadgerEndpointOutputSchemas['sites.delete'],
	},
	'sites.checks': {
		input: HoneybadgerEndpointInputSchemas['sites.checks'],
		output: HoneybadgerEndpointOutputSchemas['sites.checks'],
	},
	'sites.outages': {
		input: HoneybadgerEndpointInputSchemas['sites.outages'],
		output: HoneybadgerEndpointOutputSchemas['sites.outages'],
	},
	'streams.list': {
		input: HoneybadgerEndpointInputSchemas['streams.list'],
		output: HoneybadgerEndpointOutputSchemas['streams.list'],
	},
	'insights.query': {
		input: HoneybadgerEndpointInputSchemas['insights.query'],
		output: HoneybadgerEndpointOutputSchemas['insights.query'],
	},
	'account.get': {
		input: HoneybadgerEndpointInputSchemas['account.get'],
		output: HoneybadgerEndpointOutputSchemas['account.get'],
	},
	'account.usage': {
		input: HoneybadgerEndpointInputSchemas['account.usage'],
		output: HoneybadgerEndpointOutputSchemas['account.usage'],
	},
	'token.get': {
		input: HoneybadgerEndpointInputSchemas['token.get'],
		output: HoneybadgerEndpointOutputSchemas['token.get'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof honeybadgerEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const honeybadgerEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects the token can reach, optionally filtered by exact name, with paging',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Read one project by ID, including its fault counts and environment names',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project, optionally in a team; `team_id` requires `team:write` and rejects the whole request without it',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			"Change a project's settings; a null clears a nullable field and a field left out keeps its value",
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a project and all its data',
	},
	'projects.stats': {
		riskLevel: 'read',
		description:
			'Read a project fault and notice counts for the last day, week and month',
	},
	'projects.occurrences': {
		riskLevel: 'read',
		description:
			'Read notice counts for one project over an hour, day, week or month, one count per interval',
	},
	'occurrences.list': {
		riskLevel: 'read',
		description:
			'Read notice counts for every project the token can see, ordered by project name',
	},
	'faults.list': {
		riskLevel: 'read',
		description:
			'List faults with error search, sorting and time filters; occurrence counts cover the requested window',
	},
	'faults.get': {
		riskLevel: 'read',
		description:
			'Read one fault by ID; a merged fault redirects to the fault it was merged into',
	},
	'faults.update': {
		riskLevel: 'write',
		description:
			'Change a fault resolved or ignored state, assignee, tags, or whether it resolves on the next deploy',
	},
	'faults.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a fault; its notices stay readable by ID until retention removes them',
	},
	'faults.resolve': {
		riskLevel: 'write',
		description:
			'Resolve named faults, or every fault a query and time filter match with `all: true`; `dry_run` reports what would change',
	},
	'faults.unresolve': {
		riskLevel: 'write',
		description:
			'Mark faults unresolved, by ID or by query with `all: true`; `dry_run` reports what would change',
	},
	'faults.ignore': {
		riskLevel: 'write',
		description:
			'Ignore faults, which stops data collection for them, by ID or by query with `all: true`',
	},
	'faults.unignore': {
		riskLevel: 'write',
		description:
			'Stop ignoring faults, so collection resumes, by ID or by query with `all: true`',
	},
	'faults.summary': {
		riskLevel: 'read',
		description:
			'Read fault counts grouped by environment and resolved or ignored state, with the same filters as the fault list',
	},
	'faults.assign': {
		riskLevel: 'write',
		description: 'Assign a fault to a project member, who is notified of it',
	},
	'faults.unassign': {
		riskLevel: 'write',
		description: 'Remove the assignment from a fault, leaving it unowned',
	},
	'faults.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge one fault into another in the background; the merged fault keeps its tags, assignee and state on neither side, and its ID redirects for the retention period',
	},
	'faults.pauseRecording': {
		riskLevel: 'write',
		description:
			'Stop recording a fault for an hour, a day or a week, discarding notices during the pause',
	},
	'faults.resumeRecording': {
		riskLevel: 'write',
		description:
			'Resume recording a fault; a fault that is not paused is unchanged',
	},
	'faults.snooze': {
		riskLevel: 'write',
		description:
			'Snooze notifications for a duration or an occurrence count, replacing any existing snooze',
	},
	'faults.unsnooze': {
		riskLevel: 'write',
		description:
			"Remove a fault's snooze, so notifications resume from the next occurrence",
	},
	'faults.affectedUsers': {
		riskLevel: 'read',
		description:
			'Read the 500 users a fault affected most, ranked by notice count',
	},
	'faults.occurrences': {
		riskLevel: 'read',
		description:
			'Read occurrence counts for one fault over a window, one bucket per interval including empty ones',
	},
	'notices.list': {
		riskLevel: 'read',
		description:
			"List a fault's notices newest first, with source-mapped backtraces unless `unmapped` is set",
	},
	'notices.get': {
		riskLevel: 'read',
		description:
			'Read one notice by its UUID, without naming its project or fault',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			"List a fault's comments newest first, paging backwards with a cursor",
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Read one comment on a fault, with its author and body',
	},
	'comments.create': {
		riskLevel: 'write',
		description:
			'Comment on a fault; `@mentions` notify the named project members',
	},
	'comments.update': {
		riskLevel: 'write',
		description:
			'Replace the text of a comment on a fault; other comment fields cannot be changed',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a comment from a fault',
	},
	'deploys.list': {
		riskLevel: 'read',
		description:
			'List deploys oldest-page-first with cursors, optionally by exact environment or deploy username',
	},
	'deploys.get': {
		riskLevel: 'read',
		description:
			'Read one deploy record, with its environment, revision and author',
	},
	'deploys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a deploy record; the deploy is not re-read anywhere',
	},
	'environments.list': {
		riskLevel: 'read',
		description:
			"List a project's environments and whether each sends notifications",
	},
	'environments.get': {
		riskLevel: 'read',
		description:
			'Read one environment and whether its errors send notifications',
	},
	'environments.create': {
		riskLevel: 'write',
		description:
			'Create an environment; names are unique per project and case-sensitive',
	},
	'environments.update': {
		riskLevel: 'write',
		description:
			'Change whether an environment notifies; an environment cannot be renamed',
	},
	'environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an environment; its faults and notices stay, and the next notice under that name recreates it with notifications on',
	},
	'environments.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete several environments at once; if any ID is not one of the project's, nothing is deleted",
	},
	'environments.bulkUpdate': {
		riskLevel: 'write',
		description:
			"Turn notifications on or off for several environments at once; if any ID is not one of the project's, nothing changes",
	},
	'checkIns.list': {
		riskLevel: 'read',
		description:
			"List a project's check-ins with their state and next expected report",
	},
	'checkIns.get': {
		riskLevel: 'read',
		description:
			'Read one check-in with its schedule, last report and next expected report',
	},
	'checkIns.create': {
		riskLevel: 'write',
		description:
			'Create a check-in on a simple period or a cron schedule; a simple schedule needs `report_period` and a cron schedule needs `cron_schedule`',
	},
	'checkIns.update': {
		riskLevel: 'write',
		description:
			"Change a check-in's name, slug, schedule or grace period; switching schedule type clears the other one's fields",
	},
	'checkIns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a check-in, which stops monitoring that scheduled job',
	},
	'checkIns.replace': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Replace the project's whole set of check-ins by slug; every check-in the list does not name is deleted",
	},
	'checkIns.events': {
		riskLevel: 'read',
		description:
			"List a check-in's state changes newest first, paging backwards on a timestamp",
	},
	'sites.list': {
		riskLevel: 'read',
		description:
			"List a project's uptime monitoring sites with their URLs and current state",
	},
	'sites.get': {
		riskLevel: 'read',
		description:
			'Read one uptime site with its URL, match rule and current state',
	},
	'sites.create': {
		riskLevel: 'write',
		description:
			'Create an uptime site; `match` is required for every match type except `success`, which refuses it, and `timeout` must be shorter than the check interval',
	},
	'sites.update': {
		riskLevel: 'write',
		description:
			"Change an uptime site's URL, matching, headers, locations, frequency or active state",
	},
	'sites.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an uptime site and stop monitoring it',
	},
	'sites.checks': {
		riskLevel: 'read',
		description:
			"List a site's individual uptime check results, newest page first",
	},
	'sites.outages': {
		riskLevel: 'read',
		description:
			"List a site's outage periods, with the status and reason each failed",
	},
	'streams.list': {
		riskLevel: 'read',
		description:
			'List event streams; the ID is what `insights.query` takes in `stream_ids`',
	},
	'insights.query': {
		riskLevel: 'read',
		description:
			'Run a BadgerQL query over the project event streams and return its rows; a POST that changes nothing',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account the token belongs to, with its name and primary email',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read the account quota and how much of it is used, for errors, uptime and check-ins',
	},
	'token.get': {
		riskLevel: 'read',
		description:
			'Report what the current token is: its kind, scopes, account and the projects it can reach. Needs no scope',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof honeybadgerEndpointsNested
>;

export type BaseHoneybadgerPlugin<T extends HoneybadgerPluginOptions> =
	CorsairPlugin<
		'honeybadger',
		typeof HoneybadgerSchema,
		typeof honeybadgerEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalHoneybadgerPlugin =
	BaseHoneybadgerPlugin<HoneybadgerPluginOptions>;

export type ExternalHoneybadgerPlugin<T extends HoneybadgerPluginOptions> =
	BaseHoneybadgerPlugin<T>;

export function honeybadger<const T extends HoneybadgerPluginOptions>(
	incomingOptions: HoneybadgerPluginOptions &
		T = {} as HoneybadgerPluginOptions & T,
): ExternalHoneybadgerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'honeybadger',
		schema: HoneybadgerSchema,
		options,
		hooks: options.hooks,
		endpoints: honeybadgerEndpointsNested,
		webhooks: {},
		endpointMeta: honeybadgerEndpointMeta,
		endpointSchemas: honeybadgerEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: HoneybadgerKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('honeybadger', ctx.authType ?? 'api_key');
		},
	} satisfies InternalHoneybadgerPlugin;
}

export type { HoneybadgerRegion } from './client';
export { HONEYBADGER_HOSTS, HoneybadgerAPIError } from './client';

export type {
	AccountGetInput,
	AccountGetResponse,
	AccountUsageInput,
	AccountUsageResponse,
	CheckInsCreateInput,
	CheckInsCreateResponse,
	CheckInsDeleteInput,
	CheckInsDeleteResponse,
	CheckInsEventsInput,
	CheckInsEventsResponse,
	CheckInsGetInput,
	CheckInsGetResponse,
	CheckInsListInput,
	CheckInsListResponse,
	CheckInsReplaceInput,
	CheckInsReplaceResponse,
	CheckInsUpdateInput,
	CheckInsUpdateResponse,
	CommentsCreateInput,
	CommentsCreateResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsGetInput,
	CommentsGetResponse,
	CommentsListInput,
	CommentsListResponse,
	CommentsUpdateInput,
	CommentsUpdateResponse,
	CountResponse,
	DeploysDeleteInput,
	DeploysDeleteResponse,
	DeploysGetInput,
	DeploysGetResponse,
	DeploysListInput,
	DeploysListResponse,
	EnvironmentsBulkDeleteInput,
	EnvironmentsBulkUpdateInput,
	EnvironmentsCreateInput,
	EnvironmentsCreateResponse,
	EnvironmentsDeleteInput,
	EnvironmentsDeleteResponse,
	EnvironmentsGetInput,
	EnvironmentsGetResponse,
	EnvironmentsListInput,
	EnvironmentsListResponse,
	EnvironmentsUpdateInput,
	EnvironmentsUpdateResponse,
	FaultBulkResponse,
	FaultBulkResult,
	FaultsAffectedUsersInput,
	FaultsAffectedUsersResponse,
	FaultsAssignInput,
	FaultsAssignResponse,
	FaultsDeleteInput,
	FaultsDeleteResponse,
	FaultsGetInput,
	FaultsGetResponse,
	FaultsListInput,
	FaultsListResponse,
	FaultsMergeInput,
	FaultsMergeResponse,
	FaultsOccurrencesInput,
	FaultsOccurrencesResponse,
	FaultsPauseRecordingInput,
	FaultsPauseRecordingResponse,
	FaultsResolveInput,
	FaultsResumeRecordingInput,
	FaultsResumeRecordingResponse,
	FaultsSnoozeInput,
	FaultsSnoozeResponse,
	FaultsSummaryInput,
	FaultsSummaryResponse,
	FaultsUnassignInput,
	FaultsUnsnoozeInput,
	FaultsUnsnoozeResponse,
	FaultsUpdateInput,
	FaultsUpdateResponse,
	HoneybadgerAccount,
	HoneybadgerCheckIn,
	HoneybadgerCheckInEvent,
	HoneybadgerComment,
	HoneybadgerDeploy,
	HoneybadgerEndpointInputs,
	HoneybadgerEndpointOutputs,
	HoneybadgerEnvironment,
	HoneybadgerFault,
	HoneybadgerNotice,
	HoneybadgerOutage,
	HoneybadgerProject,
	HoneybadgerSite,
	HoneybadgerStream,
	HoneybadgerUptimeCheck,
	InsightsQueryInput,
	InsightsQueryResponse,
	NoticesGetInput,
	NoticesGetResponse,
	NoticesListInput,
	NoticesListResponse,
	OccurrencesListInput,
	OccurrencesListResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsOccurrencesInput,
	ProjectsOccurrencesResponse,
	ProjectsStatsInput,
	ProjectsStatsResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	SitesChecksInput,
	SitesChecksResponse,
	SitesCreateInput,
	SitesCreateResponse,
	SitesDeleteInput,
	SitesDeleteResponse,
	SitesGetInput,
	SitesGetResponse,
	SitesListInput,
	SitesListResponse,
	SitesOutagesInput,
	SitesOutagesResponse,
	SitesUpdateInput,
	SitesUpdateResponse,
	StreamsListInput,
	StreamsListResponse,
	TokenGetInput,
	TokenGetResponse,
} from './endpoints/types';
