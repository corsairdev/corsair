import type {
	AuthTypes,
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
import {
	teamworkInputSchemas,
	teamworkOutputSchemas,
	teamworkSchemaEntry,
} from './endpoints/openapi-schema';
import type {
	TeamworkEndpointInputs,
	TeamworkEndpointOutputs,
	TeamworkOperationId,
} from './endpoints/operation-types';
import { teamworkOperationsNested } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import { TeamworkSchema } from './schema';

const teamworkEndpointsNested = teamworkOperationsNested;

export type TeamworkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Global override for single-site setups; otherwise each tenant uses its stored site_name. */
	siteName?: string;
	hooks?: InternalTeamworkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teamworkEndpointsNested>;
};

export const teamworkAuthConfig = {
	api_key: {
		// The Teamwork site (`acme` for acme.teamwork.com): the API lives on each site's own host.
		account: ['site_name'] as const,
	},
} as const satisfies PluginAuthConfig;

type TeamworkAuthContext = CorsairPluginContext<
	typeof TeamworkSchema,
	TeamworkPluginOptions,
	undefined,
	typeof teamworkAuthConfig
>;
export type TeamworkContext = CorsairPluginContext<
	typeof TeamworkSchema,
	TeamworkPluginOptions
> &
	Pick<TeamworkAuthContext, 'keys'>;

export type TeamworkKeyBuilderContext = KeyBuilderContext<
	TeamworkPluginOptions,
	typeof teamworkAuthConfig
>;

export type TeamworkBoundEndpoints = BindEndpoints<
	typeof teamworkEndpointsNested
>;
export type TeamworkEndpoints = {
	[Id in TeamworkOperationId]: CorsairEndpoint<
		TeamworkContext,
		TeamworkEndpointInputs[Id],
		TeamworkEndpointOutputs[Id]
	>;
};

export const teamworkEndpointSchemas = {
	'projects.list': teamworkSchemaEntry('projects.list'),
	'projects.listStarred': teamworkSchemaEntry('projects.listStarred'),
	'projects.get': teamworkSchemaEntry('projects.get'),
	'projects.create': teamworkSchemaEntry('projects.create'),
	'projects.update': teamworkSchemaEntry('projects.update'),
	'projects.delete': teamworkSchemaEntry('projects.delete'),
	'projects.clone': teamworkSchemaEntry('projects.clone'),
	'projects.star': teamworkSchemaEntry('projects.star'),
	'projects.getStats': teamworkSchemaEntry('projects.getStats'),
	'projects.getRates': teamworkSchemaEntry('projects.getRates'),
	'projects.setRates': teamworkSchemaEntry('projects.setRates'),
	'projects.convertTentative': teamworkSchemaEntry('projects.convertTentative'),
	'projects.listTaskPredecessors': teamworkSchemaEntry(
		'projects.listTaskPredecessors',
	),
	'projectMetrics.billable': teamworkSchemaEntry('projectMetrics.billable'),
	'projectMetrics.health': teamworkSchemaEntry('projectMetrics.health'),
	'projectMetrics.invoices': teamworkSchemaEntry('projectMetrics.invoices'),
	'projectMetrics.unbilled': teamworkSchemaEntry('projectMetrics.unbilled'),
	'projectTemplates.list': teamworkSchemaEntry('projectTemplates.list'),
	'projectTemplates.get': teamworkSchemaEntry('projectTemplates.get'),
	'projectTemplates.listRequiredCustomFields': teamworkSchemaEntry(
		'projectTemplates.listRequiredCustomFields',
	),
	'projectTemplates.create': teamworkSchemaEntry('projectTemplates.create'),
	'projectCategories.list': teamworkSchemaEntry('projectCategories.list'),
	'projectCategories.get': teamworkSchemaEntry('projectCategories.get'),
	'projectCategories.create': teamworkSchemaEntry('projectCategories.create'),
	'projectCategories.update': teamworkSchemaEntry('projectCategories.update'),
	'projectCategories.delete': teamworkSchemaEntry('projectCategories.delete'),
	'projectUpdates.list': teamworkSchemaEntry('projectUpdates.list'),
	'projectUpdates.create': teamworkSchemaEntry('projectUpdates.create'),
	'projectUpdates.update': teamworkSchemaEntry('projectUpdates.update'),
	'projectUpdates.delete': teamworkSchemaEntry('projectUpdates.delete'),
	'projectUpdates.request': teamworkSchemaEntry('projectUpdates.request'),
	'projectPeople.list': teamworkSchemaEntry('projectPeople.list'),
	'projectPeople.get': teamworkSchemaEntry('projectPeople.get'),
	'projectPeople.getPermissions': teamworkSchemaEntry(
		'projectPeople.getPermissions',
	),
	'projectPeople.add': teamworkSchemaEntry('projectPeople.add'),
	'projectPeople.remove': teamworkSchemaEntry('projectPeople.remove'),
	'projectRoles.list': teamworkSchemaEntry('projectRoles.list'),
	'projectRoles.get': teamworkSchemaEntry('projectRoles.get'),
	'projectRoles.update': teamworkSchemaEntry('projectRoles.update'),
	'projectRoles.delete': teamworkSchemaEntry('projectRoles.delete'),
	'tasks.list': teamworkSchemaEntry('tasks.list'),
	'tasks.get': teamworkSchemaEntry('tasks.get'),
	'tasks.create': teamworkSchemaEntry('tasks.create'),
	'tasks.createSubtask': teamworkSchemaEntry('tasks.createSubtask'),
	'tasks.update': teamworkSchemaEntry('tasks.update'),
	'tasks.delete': teamworkSchemaEntry('tasks.delete'),
	'tasks.complete': teamworkSchemaEntry('tasks.complete'),
	'tasks.uncomplete': teamworkSchemaEntry('tasks.uncomplete'),
	'tasks.quickAdd': teamworkSchemaEntry('tasks.quickAdd'),
	'tasks.quickAddSubtasks': teamworkSchemaEntry('tasks.quickAddSubtasks'),
	'tasks.reorder': teamworkSchemaEntry('tasks.reorder'),
	'tasks.move': teamworkSchemaEntry('tasks.move'),
	'tasks.copy': teamworkSchemaEntry('tasks.copy'),
	'tasks.setEstimate': teamworkSchemaEntry('tasks.setEstimate'),
	'tasks.listDependencies': teamworkSchemaEntry('tasks.listDependencies'),
	'tasks.listPredecessors': teamworkSchemaEntry('tasks.listPredecessors'),
	'tasks.listRecurring': teamworkSchemaEntry('tasks.listRecurring'),
	'tasks.countCompleted': teamworkSchemaEntry('tasks.countCompleted'),
	'tasks.countLate': teamworkSchemaEntry('tasks.countLate'),
	'tasks.timeReport': teamworkSchemaEntry('tasks.timeReport'),
	'personalTasks.list': teamworkSchemaEntry('personalTasks.list'),
	'personalTasks.get': teamworkSchemaEntry('personalTasks.get'),
	'personalTasks.create': teamworkSchemaEntry('personalTasks.create'),
	'taskReminders.list': teamworkSchemaEntry('taskReminders.list'),
	'taskReminders.create': teamworkSchemaEntry('taskReminders.create'),
	'taskReminders.update': teamworkSchemaEntry('taskReminders.update'),
	'taskReminders.delete': teamworkSchemaEntry('taskReminders.delete'),
	'tasklists.list': teamworkSchemaEntry('tasklists.list'),
	'tasklists.get': teamworkSchemaEntry('tasklists.get'),
	'tasklists.create': teamworkSchemaEntry('tasklists.create'),
	'tasklists.update': teamworkSchemaEntry('tasklists.update'),
	'tasklists.delete': teamworkSchemaEntry('tasklists.delete'),
	'tasklists.listTemplates': teamworkSchemaEntry('tasklists.listTemplates'),
	'tasklists.reorder': teamworkSchemaEntry('tasklists.reorder'),
	'tasklists.copy': teamworkSchemaEntry('tasklists.copy'),
	'tasklists.move': teamworkSchemaEntry('tasklists.move'),
	'milestones.list': teamworkSchemaEntry('milestones.list'),
	'milestones.get': teamworkSchemaEntry('milestones.get'),
	'milestones.create': teamworkSchemaEntry('milestones.create'),
	'milestones.update': teamworkSchemaEntry('milestones.update'),
	'milestones.delete': teamworkSchemaEntry('milestones.delete'),
	'milestones.complete': teamworkSchemaEntry('milestones.complete'),
	'milestones.uncomplete': teamworkSchemaEntry('milestones.uncomplete'),
	'milestones.listByDeadline': teamworkSchemaEntry('milestones.listByDeadline'),
	'people.list': teamworkSchemaEntry('people.list'),
	'people.get': teamworkSchemaEntry('people.get'),
	'people.me': teamworkSchemaEntry('people.me'),
	'people.create': teamworkSchemaEntry('people.create'),
	'people.update': teamworkSchemaEntry('people.update'),
	'people.delete': teamworkSchemaEntry('people.delete'),
	'people.listDeleted': teamworkSchemaEntry('people.listDeleted'),
	'people.myStats': teamworkSchemaEntry('people.myStats'),
	'people.addToProjects': teamworkSchemaEntry('people.addToProjects'),
	'people.performance': teamworkSchemaEntry('people.performance'),
	'people.utilization': teamworkSchemaEntry('people.utilization'),
	'people.taskCompletion': teamworkSchemaEntry('people.taskCompletion'),
	'statuses.list': teamworkSchemaEntry('statuses.list'),
	'statuses.timeline': teamworkSchemaEntry('statuses.timeline'),
	'statuses.getMine': teamworkSchemaEntry('statuses.getMine'),
	'statuses.getForPerson': teamworkSchemaEntry('statuses.getForPerson'),
	'statuses.create': teamworkSchemaEntry('statuses.create'),
	'statuses.update': teamworkSchemaEntry('statuses.update'),
	'statuses.delete': teamworkSchemaEntry('statuses.delete'),
	'companies.list': teamworkSchemaEntry('companies.list'),
	'companies.listForProject': teamworkSchemaEntry('companies.listForProject'),
	'companies.get': teamworkSchemaEntry('companies.get'),
	'companies.create': teamworkSchemaEntry('companies.create'),
	'companies.update': teamworkSchemaEntry('companies.update'),
	'companies.delete': teamworkSchemaEntry('companies.delete'),
	'companies.setRates': teamworkSchemaEntry('companies.setRates'),
	'companies.convertCurrency': teamworkSchemaEntry('companies.convertCurrency'),
	'companies.addDomains': teamworkSchemaEntry('companies.addDomains'),
	'companies.updateDomain': teamworkSchemaEntry('companies.updateDomain'),
	'companies.deleteDomain': teamworkSchemaEntry('companies.deleteDomain'),
	'comments.list': teamworkSchemaEntry('comments.list'),
	'comments.get': teamworkSchemaEntry('comments.get'),
	'comments.listNotified': teamworkSchemaEntry('comments.listNotified'),
	'comments.create': teamworkSchemaEntry('comments.create'),
	'comments.update': teamworkSchemaEntry('comments.update'),
	'comments.delete': teamworkSchemaEntry('comments.delete'),
	'comments.markRead': teamworkSchemaEntry('comments.markRead'),
	'files.listForProject': teamworkSchemaEntry('files.listForProject'),
	'files.listForTask': teamworkSchemaEntry('files.listForTask'),
	'files.addToProject': teamworkSchemaEntry('files.addToProject'),
	'files.addToTask': teamworkSchemaEntry('files.addToTask'),
	'files.addVersion': teamworkSchemaEntry('files.addVersion'),
	'files.delete': teamworkSchemaEntry('files.delete'),
	'files.getShareLink': teamworkSchemaEntry('files.getShareLink'),
	'files.copy': teamworkSchemaEntry('files.copy'),
	'fileCategories.list': teamworkSchemaEntry('fileCategories.list'),
	'fileCategories.get': teamworkSchemaEntry('fileCategories.get'),
	'fileCategories.create': teamworkSchemaEntry('fileCategories.create'),
	'fileCategories.update': teamworkSchemaEntry('fileCategories.update'),
	'fileCategories.delete': teamworkSchemaEntry('fileCategories.delete'),
	'links.list': teamworkSchemaEntry('links.list'),
	'links.listForProject': teamworkSchemaEntry('links.listForProject'),
	'links.get': teamworkSchemaEntry('links.get'),
	'links.create': teamworkSchemaEntry('links.create'),
	'links.update': teamworkSchemaEntry('links.update'),
	'links.delete': teamworkSchemaEntry('links.delete'),
	'linkCategories.list': teamworkSchemaEntry('linkCategories.list'),
	'linkCategories.get': teamworkSchemaEntry('linkCategories.get'),
	'linkCategories.create': teamworkSchemaEntry('linkCategories.create'),
	'linkCategories.delete': teamworkSchemaEntry('linkCategories.delete'),
	'notebooks.list': teamworkSchemaEntry('notebooks.list'),
	'notebooks.get': teamworkSchemaEntry('notebooks.get'),
	'notebooks.create': teamworkSchemaEntry('notebooks.create'),
	'notebooks.update': teamworkSchemaEntry('notebooks.update'),
	'notebooks.delete': teamworkSchemaEntry('notebooks.delete'),
	'notebooks.lock': teamworkSchemaEntry('notebooks.lock'),
	'notebooks.unlock': teamworkSchemaEntry('notebooks.unlock'),
	'notebooks.copy': teamworkSchemaEntry('notebooks.copy'),
	'notebooks.move': teamworkSchemaEntry('notebooks.move'),
	'notebooks.listVersions': teamworkSchemaEntry('notebooks.listVersions'),
	'notebooks.getVersion': teamworkSchemaEntry('notebooks.getVersion'),
	'notebooks.deleteVersions': teamworkSchemaEntry('notebooks.deleteVersions'),
	'notebookCategories.list': teamworkSchemaEntry('notebookCategories.list'),
	'notebookCategories.get': teamworkSchemaEntry('notebookCategories.get'),
	'notebookCategories.create': teamworkSchemaEntry('notebookCategories.create'),
	'notebookCategories.update': teamworkSchemaEntry('notebookCategories.update'),
	'notebookCategories.delete': teamworkSchemaEntry('notebookCategories.delete'),
	'boardColumns.list': teamworkSchemaEntry('boardColumns.list'),
	'boardColumns.get': teamworkSchemaEntry('boardColumns.get'),
	'boardColumns.create': teamworkSchemaEntry('boardColumns.create'),
	'boardColumns.update': teamworkSchemaEntry('boardColumns.update'),
	'boardColumns.delete': teamworkSchemaEntry('boardColumns.delete'),
	'boardCards.list': teamworkSchemaEntry('boardCards.list'),
	'boardCards.get': teamworkSchemaEntry('boardCards.get'),
	'boardCards.update': teamworkSchemaEntry('boardCards.update'),
	'boardCards.move': teamworkSchemaEntry('boardCards.move'),
	'boardCards.delete': teamworkSchemaEntry('boardCards.delete'),
	'portfolioBoards.list': teamworkSchemaEntry('portfolioBoards.list'),
	'portfolioBoards.create': teamworkSchemaEntry('portfolioBoards.create'),
	'portfolioBoards.update': teamworkSchemaEntry('portfolioBoards.update'),
	'portfolioBoards.delete': teamworkSchemaEntry('portfolioBoards.delete'),
	'portfolioColumns.list': teamworkSchemaEntry('portfolioColumns.list'),
	'portfolioColumns.get': teamworkSchemaEntry('portfolioColumns.get'),
	'portfolioColumns.create': teamworkSchemaEntry('portfolioColumns.create'),
	'portfolioColumns.delete': teamworkSchemaEntry('portfolioColumns.delete'),
	'portfolioCards.list': teamworkSchemaEntry('portfolioCards.list'),
	'portfolioCards.get': teamworkSchemaEntry('portfolioCards.get'),
	'portfolioCards.add': teamworkSchemaEntry('portfolioCards.add'),
	'portfolioCards.move': teamworkSchemaEntry('portfolioCards.move'),
	'portfolioCards.delete': teamworkSchemaEntry('portfolioCards.delete'),
	'teams.list': teamworkSchemaEntry('teams.list'),
	'teams.get': teamworkSchemaEntry('teams.get'),
	'teams.create': teamworkSchemaEntry('teams.create'),
	'teams.update': teamworkSchemaEntry('teams.update'),
	'teams.delete': teamworkSchemaEntry('teams.delete'),
	'teams.setMembers': teamworkSchemaEntry('teams.setMembers'),
	'teams.listSubteams': teamworkSchemaEntry('teams.listSubteams'),
	'teams.listMemberIds': teamworkSchemaEntry('teams.listMemberIds'),
	'teams.createForProject': teamworkSchemaEntry('teams.createForProject'),
	'teams.listForProject': teamworkSchemaEntry('teams.listForProject'),
	'teams.listForCompany': teamworkSchemaEntry('teams.listForCompany'),
	'teams.listForPerson': teamworkSchemaEntry('teams.listForPerson'),
	'time.list': teamworkSchemaEntry('time.list'),
	'time.get': teamworkSchemaEntry('time.get'),
	'time.create': teamworkSchemaEntry('time.create'),
	'time.createForTask': teamworkSchemaEntry('time.createForTask'),
	'time.update': teamworkSchemaEntry('time.update'),
	'time.delete': teamworkSchemaEntry('time.delete'),
	'time.totals': teamworkSchemaEntry('time.totals'),
	'time.estimatedTotals': teamworkSchemaEntry('time.estimatedTotals'),
	'time.loggedByPerson': teamworkSchemaEntry('time.loggedByPerson'),
	'time.byCompany': teamworkSchemaEntry('time.byCompany'),
	'time.report': teamworkSchemaEntry('time.report'),
	'time.reportTotals': teamworkSchemaEntry('time.reportTotals'),
	'time.reportByType': teamworkSchemaEntry('time.reportByType'),
	'time.validate': teamworkSchemaEntry('time.validate'),
	'timers.list': teamworkSchemaEntry('timers.list'),
	'timers.listMine': teamworkSchemaEntry('timers.listMine'),
	'timers.get': teamworkSchemaEntry('timers.get'),
	'timers.create': teamworkSchemaEntry('timers.create'),
	'timers.update': teamworkSchemaEntry('timers.update'),
	'timers.pause': teamworkSchemaEntry('timers.pause'),
	'timers.resume': teamworkSchemaEntry('timers.resume'),
	'timers.complete': teamworkSchemaEntry('timers.complete'),
	'timers.delete': teamworkSchemaEntry('timers.delete'),
	'timers.undelete': teamworkSchemaEntry('timers.undelete'),
} satisfies RequiredPluginEndpointSchemas<typeof teamworkEndpointsNested>;

const teamworkEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects. Filter with projectIds, projectCompanyIds, projectCategoryIds, projectStatuses, searchTerm and more.',
	},
	'projects.listStarred': {
		riskLevel: 'read',
		description: 'List the projects the current user has starred.',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get one project by id.',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project.',
	},
	'projects.update': {
		riskLevel: 'write',
		description: "Update a project's name, dates, owner, category or settings.",
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project.',
	},
	'projects.clone': {
		riskLevel: 'write',
		description:
			'Copy a project, optionally with its tasks, milestones and people.',
	},
	'projects.star': {
		riskLevel: 'write',
		description: 'Star a project for the current user.',
	},
	'projects.getStats': {
		riskLevel: 'read',
		description: 'Get task and milestone counts for a project.',
	},
	'projects.getRates': {
		riskLevel: 'read',
		description: "Get a project's billable rates per user.",
	},
	'projects.setRates': {
		riskLevel: 'write',
		description: "Set a project's billable rates.",
	},
	'projects.convertTentative': {
		riskLevel: 'write',
		description: 'Convert a tentative project into a normal project.',
	},
	'projects.listTaskPredecessors': {
		riskLevel: 'read',
		description: 'List every task dependency (predecessor) in a project.',
	},
	'projectMetrics.billable': {
		riskLevel: 'read',
		description: 'Total billable time per project.',
	},
	'projectMetrics.health': {
		riskLevel: 'read',
		description: 'Health summary across projects.',
	},
	'projectMetrics.invoices': {
		riskLevel: 'read',
		description: 'Open invoices across projects.',
	},
	'projectMetrics.unbilled': {
		riskLevel: 'read',
		description: 'Unbilled expenses across projects.',
	},
	'projectTemplates.list': {
		riskLevel: 'read',
		description: 'List project templates.',
	},
	'projectTemplates.get': {
		riskLevel: 'read',
		description: 'Get one project template.',
	},
	'projectTemplates.listRequiredCustomFields': {
		riskLevel: 'read',
		description:
			'List the custom fields a template requires when a project is made from it.',
	},
	'projectTemplates.create': {
		riskLevel: 'write',
		description: 'Create a project template.',
	},
	'projectCategories.list': {
		riskLevel: 'read',
		description: 'List project categories.',
	},
	'projectCategories.get': {
		riskLevel: 'read',
		description: 'Get one project category.',
	},
	'projectCategories.create': {
		riskLevel: 'write',
		description: 'Create a project category.',
	},
	'projectCategories.update': {
		riskLevel: 'write',
		description: 'Rename or move a project category.',
	},
	'projectCategories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project category.',
	},
	'projectUpdates.list': {
		riskLevel: 'read',
		description: 'List project status updates. Filter with projectIds.',
	},
	'projectUpdates.create': {
		riskLevel: 'destructive',
		description:
			'Post a status update on a project. Notifies the people in notifyIds.',
	},
	'projectUpdates.update': {
		riskLevel: 'write',
		description: 'Edit a project update.',
	},
	'projectUpdates.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project update.',
	},
	'projectUpdates.request': {
		riskLevel: 'destructive',
		description:
			'Ask the project owner for a status update. Notifies the owner.',
	},
	'projectPeople.list': {
		riskLevel: 'read',
		description: 'List the people on a project.',
	},
	'projectPeople.get': {
		riskLevel: 'read',
		description: "Get one person's membership on a project.",
	},
	'projectPeople.getPermissions': {
		riskLevel: 'read',
		description: "Get a person's permissions on a project.",
	},
	'projectPeople.add': {
		riskLevel: 'write',
		description: 'Add people to a project.',
	},
	'projectPeople.remove': {
		riskLevel: 'destructive',
		description: 'Remove a person from a project.',
	},
	'projectRoles.list': {
		riskLevel: 'read',
		description: 'List the roles on a project.',
	},
	'projectRoles.get': {
		riskLevel: 'read',
		description: 'Get one project role.',
	},
	'projectRoles.update': {
		riskLevel: 'write',
		description: 'Update a project role.',
	},
	'projectRoles.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project role.',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List tasks. Filter with projectIds, tasklistIds, parentTaskId, responsiblePartyIds, tagIds, completedOnly/includeCompletedTasks, due dates and more.',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get one task.',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task in a task list.',
	},
	'tasks.createSubtask': {
		riskLevel: 'write',
		description: 'Create a subtask under a task.',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a task (only the fields you send change).',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task (it goes to the trash).',
	},
	'tasks.complete': {
		riskLevel: 'write',
		description: 'Mark a task complete.',
	},
	'tasks.uncomplete': {
		riskLevel: 'write',
		description: 'Reopen a completed task.',
	},
	'tasks.quickAdd': {
		riskLevel: 'write',
		description: 'Add several tasks to a project at once from lines of text.',
	},
	'tasks.quickAddSubtasks': {
		riskLevel: 'write',
		description: 'Add several subtasks to a task at once from lines of text.',
	},
	'tasks.reorder': {
		riskLevel: 'write',
		description: 'Reorder the tasks in a task list.',
	},
	'tasks.move': {
		riskLevel: 'write',
		description: 'Move a task to another project or task list.',
	},
	'tasks.copy': {
		riskLevel: 'write',
		description: 'Copy a task to another project or task list.',
	},
	'tasks.setEstimate': {
		riskLevel: 'write',
		description: "Set a task's time estimate.",
	},
	'tasks.listDependencies': {
		riskLevel: 'read',
		description: 'List the tasks that depend on a task.',
	},
	'tasks.listPredecessors': {
		riskLevel: 'read',
		description: 'List the tasks a task waits on.',
	},
	'tasks.listRecurring': {
		riskLevel: 'read',
		description: 'List the repeats of a recurring task.',
	},
	'tasks.countCompleted': {
		riskLevel: 'read',
		description: 'Count completed tasks.',
	},
	'tasks.countLate': {
		riskLevel: 'read',
		description: 'Count late tasks.',
	},
	'tasks.timeReport': {
		riskLevel: 'read',
		description: 'Report of time logged against tasks.',
	},
	'personalTasks.list': {
		riskLevel: 'read',
		description: "List the current user's personal tasks.",
	},
	'personalTasks.get': {
		riskLevel: 'read',
		description: 'Get one personal task.',
	},
	'personalTasks.create': {
		riskLevel: 'write',
		description: 'Create a personal task.',
	},
	'taskReminders.list': {
		riskLevel: 'read',
		description: 'List the reminders on a task.',
	},
	'taskReminders.create': {
		riskLevel: 'destructive',
		description:
			'Add a reminder to a task. Teamwork emails or messages the people it names when it fires.',
	},
	'taskReminders.update': {
		riskLevel: 'write',
		description:
			"Change a reminder's time, type or note. To change who gets it, delete it and add a new one.",
	},
	'taskReminders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task reminder.',
	},
	'tasklists.list': {
		riskLevel: 'read',
		description: 'List task lists. Filter with projectIds.',
	},
	'tasklists.get': {
		riskLevel: 'read',
		description: 'Get one task list.',
	},
	'tasklists.create': {
		riskLevel: 'write',
		description: 'Create a task list in a project.',
	},
	'tasklists.update': {
		riskLevel: 'write',
		description: 'Update a task list.',
	},
	'tasklists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task list and its tasks.',
	},
	'tasklists.listTemplates': {
		riskLevel: 'read',
		description: 'List task list templates.',
	},
	'tasklists.reorder': {
		riskLevel: 'write',
		description: 'Reorder the task lists in a project.',
	},
	'tasklists.copy': {
		riskLevel: 'write',
		description: 'Copy a task list, within its project or to another.',
	},
	'tasklists.move': {
		riskLevel: 'write',
		description: 'Move a task list to another project.',
	},
	'milestones.list': {
		riskLevel: 'read',
		description:
			'List milestones. Filter with projectIds, assignedToUserIds, tagIds and more.',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Get one milestone.',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a milestone in a project.',
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update a milestone.',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		description: 'Delete a milestone (it goes to the trash).',
	},
	'milestones.complete': {
		riskLevel: 'write',
		description: 'Mark a milestone complete.',
	},
	'milestones.uncomplete': {
		riskLevel: 'write',
		description: 'Reopen a completed milestone.',
	},
	'milestones.listByDeadline': {
		riskLevel: 'read',
		description: 'List milestones due in a date range.',
	},
	'people.list': {
		riskLevel: 'read',
		description:
			'List people. Filter with projectIds, companyIds, teamIds, searchTerm and more.',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Get one person.',
	},
	'people.me': {
		riskLevel: 'read',
		description: 'Get the user the API key belongs to.',
	},
	'people.create': {
		riskLevel: 'destructive',
		description:
			'Add a user to the site. Teamwork emails them an invitation unless sendInvite is false.',
	},
	'people.update': {
		riskLevel: 'write',
		description: 'Update a user.',
	},
	'people.delete': {
		riskLevel: 'destructive',
		description: 'Delete a user.',
	},
	'people.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted users.',
	},
	'people.myStats': {
		riskLevel: 'read',
		description:
			'Summary counts for the current user (tasks, milestones, messages).',
	},
	'people.addToProjects': {
		riskLevel: 'write',
		description: 'Add one user to many projects at once.',
	},
	'people.performance': {
		riskLevel: 'read',
		description: 'The users who completed the most tasks.',
	},
	'people.utilization': {
		riskLevel: 'read',
		description: 'User utilization for a date range.',
	},
	'people.taskCompletion': {
		riskLevel: 'read',
		description: 'Task completions per user.',
	},
	'statuses.list': {
		riskLevel: 'read',
		description: "List everyone's current status.",
	},
	'statuses.timeline': {
		riskLevel: 'read',
		description: 'The people status timeline.',
	},
	'statuses.getMine': {
		riskLevel: 'read',
		description: "Get the current user's status.",
	},
	'statuses.getForPerson': {
		riskLevel: 'read',
		description: "Get a person's status.",
	},
	'statuses.create': {
		riskLevel: 'write',
		description: "Set a person's status.",
	},
	'statuses.update': {
		riskLevel: 'write',
		description: 'Update a status by id.',
	},
	'statuses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a status by id.',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'List companies.',
	},
	'companies.listForProject': {
		riskLevel: 'read',
		description: 'List the companies on a project.',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Get one company.',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a company.',
	},
	'companies.update': {
		riskLevel: 'write',
		description: 'Update a company.',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company.',
	},
	'companies.setRates': {
		riskLevel: 'write',
		description: "Set a company's client rates per role.",
	},
	'companies.convertCurrency': {
		riskLevel: 'destructive',
		description:
			"Convert a company's currency, rewriting its rates and budgets.",
	},
	'companies.addDomains': {
		riskLevel: 'write',
		description: 'Add email domains to a company.',
	},
	'companies.updateDomain': {
		riskLevel: 'write',
		description: 'Update a company email domain.',
	},
	'companies.deleteDomain': {
		riskLevel: 'destructive',
		description: 'Delete a company email domain.',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List comments across tasks, milestones, files, notebooks and links. Filter with objectIds, projectIds, userIds.',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get one comment.',
	},
	'comments.listNotified': {
		riskLevel: 'read',
		description: 'List the users notified about a comment.',
	},
	'comments.create': {
		riskLevel: 'write',
		description:
			'Comment on a task, milestone, file, notebook or link. Teamwork notifies the people in notify.',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Edit a comment.',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment.',
	},
	'comments.markRead': {
		riskLevel: 'write',
		description: 'Mark a comment as read.',
	},
	'files.listForProject': {
		riskLevel: 'read',
		description: 'List the files on a project.',
	},
	'files.listForTask': {
		riskLevel: 'read',
		description: 'List the files on a task.',
	},
	'files.addToProject': {
		riskLevel: 'write',
		description: 'Attach an uploaded file (pendingFileRef) to a project.',
	},
	'files.addToTask': {
		riskLevel: 'write',
		description: 'Attach an uploaded file (pendingFileRef) to a task.',
	},
	'files.addVersion': {
		riskLevel: 'write',
		description: 'Add a new version to a file.',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file.',
	},
	'files.getShareLink': {
		riskLevel: 'read',
		description: 'Get a short share link for a file.',
	},
	'files.copy': {
		riskLevel: 'write',
		description: 'Copy a file to another project.',
	},
	'fileCategories.list': {
		riskLevel: 'read',
		description: "List a project's file categories.",
	},
	'fileCategories.get': {
		riskLevel: 'read',
		description: 'Get one file category.',
	},
	'fileCategories.create': {
		riskLevel: 'write',
		description: 'Create a file category.',
	},
	'fileCategories.update': {
		riskLevel: 'write',
		description: 'Update a file category.',
	},
	'fileCategories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a file category.',
	},
	'links.list': {
		riskLevel: 'read',
		description: 'List links across all projects.',
	},
	'links.listForProject': {
		riskLevel: 'read',
		description: 'List the links on a project.',
	},
	'links.get': {
		riskLevel: 'read',
		description: 'Get one link.',
	},
	'links.create': {
		riskLevel: 'write',
		description: 'Add a link to a project.',
	},
	'links.update': {
		riskLevel: 'write',
		description: 'Update a link.',
	},
	'links.delete': {
		riskLevel: 'destructive',
		description: 'Delete a link.',
	},
	'linkCategories.list': {
		riskLevel: 'read',
		description: "List a project's link categories.",
	},
	'linkCategories.get': {
		riskLevel: 'read',
		description: 'Get one link category.',
	},
	'linkCategories.create': {
		riskLevel: 'write',
		description: 'Create a link category.',
	},
	'linkCategories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a link category.',
	},
	'notebooks.list': {
		riskLevel: 'read',
		description: 'List notebooks. Filter with projectIds, categoryIds, tagIds.',
	},
	'notebooks.get': {
		riskLevel: 'read',
		description: 'Get one notebook with its contents.',
	},
	'notebooks.create': {
		riskLevel: 'write',
		description: 'Create a notebook in a project.',
	},
	'notebooks.update': {
		riskLevel: 'write',
		description: 'Update a notebook.',
	},
	'notebooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a notebook.',
	},
	'notebooks.lock': {
		riskLevel: 'write',
		description: 'Lock a notebook for editing.',
	},
	'notebooks.unlock': {
		riskLevel: 'write',
		description: 'Unlock a notebook.',
	},
	'notebooks.copy': {
		riskLevel: 'write',
		description: 'Copy a notebook to another project.',
	},
	'notebooks.move': {
		riskLevel: 'write',
		description: 'Move a notebook to another project.',
	},
	'notebooks.listVersions': {
		riskLevel: 'read',
		description: "List a notebook's versions.",
	},
	'notebooks.getVersion': {
		riskLevel: 'read',
		description: 'Get one version of a notebook.',
	},
	'notebooks.deleteVersions': {
		riskLevel: 'destructive',
		description: 'Delete notebook versions.',
	},
	'notebookCategories.list': {
		riskLevel: 'read',
		description: "List a project's notebook categories.",
	},
	'notebookCategories.get': {
		riskLevel: 'read',
		description: 'Get one notebook category.',
	},
	'notebookCategories.create': {
		riskLevel: 'write',
		description: 'Create a notebook category.',
	},
	'notebookCategories.update': {
		riskLevel: 'write',
		description: 'Update a notebook category.',
	},
	'notebookCategories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a notebook category.',
	},
	'boardColumns.list': {
		riskLevel: 'read',
		description:
			'List the board columns of a project (needs Boards on for the project).',
	},
	'boardColumns.get': {
		riskLevel: 'read',
		description: 'Get one board column.',
	},
	'boardColumns.create': {
		riskLevel: 'write',
		description: 'Create a board column.',
	},
	'boardColumns.update': {
		riskLevel: 'write',
		description: 'Update a board column.',
	},
	'boardColumns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a board column.',
	},
	'boardCards.list': {
		riskLevel: 'read',
		description: 'List the cards in a board column.',
	},
	'boardCards.get': {
		riskLevel: 'read',
		description: 'Get one board card.',
	},
	'boardCards.update': {
		riskLevel: 'write',
		description: 'Update a board card.',
	},
	'boardCards.move': {
		riskLevel: 'write',
		description: 'Move a card to another column.',
	},
	'boardCards.delete': {
		riskLevel: 'destructive',
		description: 'Remove a card from the board.',
	},
	'portfolioBoards.list': {
		riskLevel: 'read',
		description: 'List portfolio boards.',
	},
	'portfolioBoards.create': {
		riskLevel: 'write',
		description: 'Create a portfolio board.',
	},
	'portfolioBoards.update': {
		riskLevel: 'write',
		description: 'Update a portfolio board.',
	},
	'portfolioBoards.delete': {
		riskLevel: 'destructive',
		description: 'Delete a portfolio board.',
	},
	'portfolioColumns.list': {
		riskLevel: 'read',
		description: 'List the columns of a portfolio board.',
	},
	'portfolioColumns.get': {
		riskLevel: 'read',
		description: 'Get one portfolio column.',
	},
	'portfolioColumns.create': {
		riskLevel: 'write',
		description: 'Add a column to a portfolio board.',
	},
	'portfolioColumns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a portfolio column.',
	},
	'portfolioCards.list': {
		riskLevel: 'read',
		description: 'List the project cards in a portfolio column.',
	},
	'portfolioCards.get': {
		riskLevel: 'read',
		description: 'Get one portfolio card.',
	},
	'portfolioCards.add': {
		riskLevel: 'write',
		description: 'Add a project to a portfolio column.',
	},
	'portfolioCards.move': {
		riskLevel: 'write',
		description: 'Move a project card to another column.',
	},
	'portfolioCards.delete': {
		riskLevel: 'destructive',
		description: 'Remove a project card from a portfolio column.',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams.',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get one team.',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team.',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Update a team.',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team.',
	},
	'teams.setMembers': {
		riskLevel: 'destructive',
		description:
			'Add members to a team, or replace all of them (action defaults to replace).',
	},
	'teams.listSubteams': {
		riskLevel: 'read',
		description: "List a team's subteams.",
	},
	'teams.listMemberIds': {
		riskLevel: 'read',
		description: 'The user ids in every team.',
	},
	'teams.createForProject': {
		riskLevel: 'write',
		description: 'Create a project-specific team.',
	},
	'teams.listForProject': {
		riskLevel: 'read',
		description: 'List the teams on a project.',
	},
	'teams.listForCompany': {
		riskLevel: 'read',
		description: "List a company's teams.",
	},
	'teams.listForPerson': {
		riskLevel: 'read',
		description: 'List the teams a person is in.',
	},
	'time.list': {
		riskLevel: 'read',
		description:
			'List time entries. Filter with projectIds, taskIds, tasklistIds, assignedToUserIds, startDate/endDate and more.',
	},
	'time.get': {
		riskLevel: 'read',
		description: 'Get one time entry.',
	},
	'time.create': {
		riskLevel: 'write',
		description: 'Log time on a project.',
	},
	'time.createForTask': {
		riskLevel: 'write',
		description: 'Log time on a task.',
	},
	'time.update': {
		riskLevel: 'write',
		description: 'Update a time entry (only the fields you send change).',
	},
	'time.delete': {
		riskLevel: 'destructive',
		description: 'Delete a time entry.',
	},
	'time.totals': {
		riskLevel: 'read',
		description:
			'Total logged time. Filter with projectIds, tasklistIds, taskIds, userIds.',
	},
	'time.estimatedTotals': {
		riskLevel: 'read',
		description: 'Estimated time totals per project.',
	},
	'time.loggedByPerson': {
		riskLevel: 'read',
		description: 'Time a person logged, by day.',
	},
	'time.byCompany': {
		riskLevel: 'read',
		description: 'Time entries grouped by company.',
	},
	'time.report': {
		riskLevel: 'read',
		description:
			'Time report for a date range (startDate and endDate required).',
	},
	'time.reportTotals': {
		riskLevel: 'read',
		description: 'Time report totals for a date range.',
	},
	'time.reportByType': {
		riskLevel: 'read',
		description: 'Time report grouped by user, project, company or task.',
	},
	'time.validate': {
		riskLevel: 'read',
		description:
			'Check whether a time entry can be logged (needs time approvals on the plan).',
	},
	'timers.list': {
		riskLevel: 'read',
		description: 'List running timers. Filter with userId, projectId, taskId.',
	},
	'timers.listMine': {
		riskLevel: 'read',
		description: "List the current user's timers.",
	},
	'timers.get': {
		riskLevel: 'read',
		description: 'Get one timer.',
	},
	'timers.create': {
		riskLevel: 'write',
		description: 'Start a timer.',
	},
	'timers.update': {
		riskLevel: 'write',
		description: 'Edit a timer.',
	},
	'timers.pause': {
		riskLevel: 'write',
		description: 'Pause a timer.',
	},
	'timers.resume': {
		riskLevel: 'write',
		description: 'Resume a paused timer.',
	},
	'timers.complete': {
		riskLevel: 'write',
		description: 'Stop a timer and log its time.',
	},
	'timers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a timer.',
	},
	'timers.undelete': {
		riskLevel: 'write',
		description: 'Restore a deleted timer.',
	},
} satisfies RequiredPluginEndpointMeta<typeof teamworkEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseTeamworkPlugin<T extends TeamworkPluginOptions> = CorsairPlugin<
	'teamwork',
	typeof TeamworkSchema,
	typeof teamworkEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof teamworkAuthConfig
>;

export type InternalTeamworkPlugin = BaseTeamworkPlugin<TeamworkPluginOptions>;
export type ExternalTeamworkPlugin<T extends TeamworkPluginOptions> =
	BaseTeamworkPlugin<T>;

export function teamwork<const T extends TeamworkPluginOptions>(
	incomingOptions: TeamworkPluginOptions & T = {} as TeamworkPluginOptions & T,
): ExternalTeamworkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teamwork',
		authConfig: teamworkAuthConfig,
		schema: TeamworkSchema,
		options,
		hooks: options.hooks,
		endpoints: teamworkOperationsNested,
		webhooks: {},
		endpointMeta: teamworkEndpointMeta,
		endpointSchemas: teamworkEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TeamworkKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) return options.key;
			if (!ctx.keys) throw new AuthMissingError('teamwork', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('teamwork', 'api_key');
			// A key without a site can't reach any Teamwork host. Failing here, not in
			// the endpoint, lets core hand back a connect link that asks for the site.
			if (!options.siteName && !(await ctx.keys.get_site_name())) {
				throw new AuthMissingError(
					'teamwork',
					'api_key',
					'Teamwork site is not set: connect the account with its site name (acme for acme.teamwork.com) or set the siteName option.',
				);
			}
			return apiKey;
		},
	} satisfies InternalTeamworkPlugin;
}

export { TeamworkSchema };
export type { TeamworkEndpointInputs, TeamworkEndpointOutputs };
export { teamworkInputSchemas, teamworkOutputSchemas };
export type {
	TeamworkEndpointInput,
	TeamworkEndpointOutput,
	TeamworkOperationId,
} from './endpoints/operation-types';
export { teamworkOperations } from './endpoints/types';
