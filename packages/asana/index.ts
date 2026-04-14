import type {
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
} from 'corsair/core';
import {
	Projects,
	Sections,
	Stories,
	Tags,
	Tasks,
	Teams,
	Users,
	WebhookManagement,
	Workspaces,
} from './endpoints';
import type {
	AsanaEndpointInputs,
	AsanaEndpointOutputs,
} from './endpoints/types';
import {
	AsanaEndpointInputSchemas,
	AsanaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AsanaSchema } from './schema';
import { ChallengeWebhooks, TaskWebhooks } from './webhooks';
import type {
	AsanaChallengePayload,
	AsanaTaskWebhookPayload,
	AsanaWebhookOutputs,
} from './webhooks/types';
import {
	AsanaChallengePayloadSchema,
	AsanaChallengeResponseSchema,
	AsanaTaskWebhookPayloadSchema,
	AsanaWebhookEventSchema,
} from './webhooks/types';

export type AsanaEndpoints = {
	// Tasks
	tasksGet: AsanaEndpoint<'tasksGet'>;
	tasksList: AsanaEndpoint<'tasksList'>;
	tasksCreate: AsanaEndpoint<'tasksCreate'>;
	tasksUpdate: AsanaEndpoint<'tasksUpdate'>;
	tasksDelete: AsanaEndpoint<'tasksDelete'>;
	tasksDuplicate: AsanaEndpoint<'tasksDuplicate'>;
	tasksSearch: AsanaEndpoint<'tasksSearch'>;
	tasksAddFollowers: AsanaEndpoint<'tasksAddFollowers'>;
	tasksRemoveFollower: AsanaEndpoint<'tasksRemoveFollower'>;
	tasksAddProject: AsanaEndpoint<'tasksAddProject'>;
	tasksRemoveProject: AsanaEndpoint<'tasksRemoveProject'>;
	tasksAddTag: AsanaEndpoint<'tasksAddTag'>;
	tasksRemoveTag: AsanaEndpoint<'tasksRemoveTag'>;
	tasksAddDependencies: AsanaEndpoint<'tasksAddDependencies'>;
	tasksCreateSubtask: AsanaEndpoint<'tasksCreateSubtask'>;
	tasksGetSubtasks: AsanaEndpoint<'tasksGetSubtasks'>;
	tasksSetParent: AsanaEndpoint<'tasksSetParent'>;
	tasksGetStories: AsanaEndpoint<'tasksGetStories'>;
	tasksGetAttachments: AsanaEndpoint<'tasksGetAttachments'>;
	tasksGetTags: AsanaEndpoint<'tasksGetTags'>;
	tasksAddToSection: AsanaEndpoint<'tasksAddToSection'>;
	// Projects
	projectsGet: AsanaEndpoint<'projectsGet'>;
	projectsList: AsanaEndpoint<'projectsList'>;
	projectsCreate: AsanaEndpoint<'projectsCreate'>;
	projectsCreateForTeam: AsanaEndpoint<'projectsCreateForTeam'>;
	projectsCreateForWorkspace: AsanaEndpoint<'projectsCreateForWorkspace'>;
	projectsUpdate: AsanaEndpoint<'projectsUpdate'>;
	projectsDelete: AsanaEndpoint<'projectsDelete'>;
	projectsDuplicate: AsanaEndpoint<'projectsDuplicate'>;
	projectsAddFollowers: AsanaEndpoint<'projectsAddFollowers'>;
	projectsRemoveFollowers: AsanaEndpoint<'projectsRemoveFollowers'>;
	projectsAddMembers: AsanaEndpoint<'projectsAddMembers'>;
	projectsRemoveMembers: AsanaEndpoint<'projectsRemoveMembers'>;
	projectsGetTasks: AsanaEndpoint<'projectsGetTasks'>;
	projectsGetTaskCounts: AsanaEndpoint<'projectsGetTaskCounts'>;
	workspaceProjectsList: AsanaEndpoint<'workspaceProjectsList'>;
	// Sections
	sectionsGet: AsanaEndpoint<'sectionsGet'>;
	sectionsList: AsanaEndpoint<'sectionsList'>;
	sectionsCreate: AsanaEndpoint<'sectionsCreate'>;
	sectionsUpdate: AsanaEndpoint<'sectionsUpdate'>;
	sectionsDelete: AsanaEndpoint<'sectionsDelete'>;
	sectionsInsert: AsanaEndpoint<'sectionsInsert'>;
	// Users
	usersGet: AsanaEndpoint<'usersGet'>;
	usersList: AsanaEndpoint<'usersList'>;
	usersGetCurrent: AsanaEndpoint<'usersGetCurrent'>;
	usersListForWorkspace: AsanaEndpoint<'usersListForWorkspace'>;
	usersListForTeam: AsanaEndpoint<'usersListForTeam'>;
	usersGetTaskList: AsanaEndpoint<'usersGetTaskList'>;
	usersGetUserTaskList: AsanaEndpoint<'usersGetUserTaskList'>;
	usersGetFavorites: AsanaEndpoint<'usersGetFavorites'>;
	// Teams
	teamsGet: AsanaEndpoint<'teamsGet'>;
	teamsListForUser: AsanaEndpoint<'teamsListForUser'>;
	teamsListForWorkspace: AsanaEndpoint<'teamsListForWorkspace'>;
	teamsCreate: AsanaEndpoint<'teamsCreate'>;
	teamsUpdate: AsanaEndpoint<'teamsUpdate'>;
	teamsAddUser: AsanaEndpoint<'teamsAddUser'>;
	teamsRemoveUser: AsanaEndpoint<'teamsRemoveUser'>;
	teamMembershipsList: AsanaEndpoint<'teamMembershipsList'>;
	teamMembershipsGet: AsanaEndpoint<'teamMembershipsGet'>;
	teamMembershipsListForTeam: AsanaEndpoint<'teamMembershipsListForTeam'>;
	teamMembershipsListForUser: AsanaEndpoint<'teamMembershipsListForUser'>;
	// Tags
	tagsGet: AsanaEndpoint<'tagsGet'>;
	tagsList: AsanaEndpoint<'tagsList'>;
	tagsListForWorkspace: AsanaEndpoint<'tagsListForWorkspace'>;
	tagsListForTask: AsanaEndpoint<'tagsListForTask'>;
	tagsCreate: AsanaEndpoint<'tagsCreate'>;
	tagsCreateInWorkspace: AsanaEndpoint<'tagsCreateInWorkspace'>;
	tagsUpdate: AsanaEndpoint<'tagsUpdate'>;
	tagsDelete: AsanaEndpoint<'tagsDelete'>;
	tagsGetTasks: AsanaEndpoint<'tagsGetTasks'>;
	// Stories
	storiesGet: AsanaEndpoint<'storiesGet'>;
	storiesListForTask: AsanaEndpoint<'storiesListForTask'>;
	storiesCreateComment: AsanaEndpoint<'storiesCreateComment'>;
	storiesUpdate: AsanaEndpoint<'storiesUpdate'>;
	storiesDelete: AsanaEndpoint<'storiesDelete'>;
	// Webhook management
	webhooksGetList: AsanaEndpoint<'webhooksGetList'>;
	webhooksCreate: AsanaEndpoint<'webhooksCreate'>;
	webhooksDelete: AsanaEndpoint<'webhooksDelete'>;
	webhooksUpdate: AsanaEndpoint<'webhooksUpdate'>;
	// Workspaces
	workspacesGet: AsanaEndpoint<'workspacesGet'>;
	workspacesList: AsanaEndpoint<'workspacesList'>;
	workspaceMembershipsGet: AsanaEndpoint<'workspaceMembershipsGet'>;
	workspaceMembershipsList: AsanaEndpoint<'workspaceMembershipsList'>;
	workspaceMembershipsListForUser: AsanaEndpoint<'workspaceMembershipsListForUser'>;
};

const asanaEndpointsNested = {
	tasks: {
		get: Tasks.get,
		list: Tasks.list,
		create: Tasks.create,
		update: Tasks.update,
		delete: Tasks.delete,
		duplicate: Tasks.duplicate,
		search: Tasks.search,
		addFollowers: Tasks.addFollowers,
		removeFollower: Tasks.removeFollower,
		addProject: Tasks.addProject,
		removeProject: Tasks.removeProject,
		addTag: Tasks.addTag,
		removeTag: Tasks.removeTag,
		addDependencies: Tasks.addDependencies,
		createSubtask: Tasks.createSubtask,
		getSubtasks: Tasks.getSubtasks,
		setParent: Tasks.setParent,
		getStories: Tasks.getStories,
		getAttachments: Tasks.getAttachments,
		getTags: Tasks.getTags,
		addToSection: Tasks.addToSection,
	},
	projects: {
		get: Projects.get,
		list: Projects.list,
		create: Projects.create,
		createForTeam: Projects.createForTeam,
		createForWorkspace: Projects.createForWorkspace,
		update: Projects.update,
		delete: Projects.delete,
		duplicate: Projects.duplicate,
		addFollowers: Projects.addFollowers,
		removeFollowers: Projects.removeFollowers,
		addMembers: Projects.addMembers,
		removeMembers: Projects.removeMembers,
		getTasks: Projects.getTasks,
		getTaskCounts: Projects.getTaskCounts,
		listForWorkspace: Projects.listForWorkspace,
	},
	sections: {
		get: Sections.get,
		list: Sections.list,
		create: Sections.create,
		update: Sections.update,
		delete: Sections.delete,
		insert: Sections.insert,
	},
	users: {
		get: Users.get,
		list: Users.list,
		getCurrent: Users.getCurrent,
		listForWorkspace: Users.listForWorkspace,
		listForTeam: Users.listForTeam,
		getTaskList: Users.getTaskList,
		getUserTaskList: Users.getUserTaskList,
		getFavorites: Users.getFavorites,
	},
	teams: {
		get: Teams.get,
		listForUser: Teams.listForUser,
		listForWorkspace: Teams.listForWorkspace,
		create: Teams.create,
		update: Teams.update,
		addUser: Teams.addUser,
		removeUser: Teams.removeUser,
		membershipsList: Teams.membershipsList,
		membershipsGet: Teams.membershipsGet,
		membershipsListForTeam: Teams.membershipsListForTeam,
		membershipsListForUser: Teams.membershipsListForUser,
	},
	tags: {
		get: Tags.get,
		list: Tags.list,
		listForWorkspace: Tags.listForWorkspace,
		listForTask: Tags.listForTask,
		create: Tags.create,
		createInWorkspace: Tags.createInWorkspace,
		update: Tags.update,
		delete: Tags.delete,
		getTasks: Tags.getTasks,
	},
	stories: {
		get: Stories.get,
		listForTask: Stories.listForTask,
		createComment: Stories.createComment,
		update: Stories.update,
		delete: Stories.delete,
	},
	webhookManagement: {
		create: WebhookManagement.create,
		delete: WebhookManagement.delete,
		getList: WebhookManagement.getList,
		update: WebhookManagement.update,
	},
	workspaces: {
		get: Workspaces.get,
		list: Workspaces.list,
		membershipsGet: Workspaces.membershipsGet,
		membershipsList: Workspaces.membershipsList,
		membershipsListForUser: Workspaces.membershipsListForUser,
	},
} as const;

const asanaWebhooksNested = {
	tasks: {
		taskEvent: TaskWebhooks.taskEvent,
	},
	challenge: {
		challenge: ChallengeWebhooks.challenge,
	},
} as const;

export const asanaEndpointSchemas = {
	// Tasks
	'tasks.get': {
		input: AsanaEndpointInputSchemas.tasksGet,
		output: AsanaEndpointOutputSchemas.tasksGet,
	},
	'tasks.list': {
		input: AsanaEndpointInputSchemas.tasksList,
		output: AsanaEndpointOutputSchemas.tasksList,
	},
	'tasks.create': {
		input: AsanaEndpointInputSchemas.tasksCreate,
		output: AsanaEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: AsanaEndpointInputSchemas.tasksUpdate,
		output: AsanaEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: AsanaEndpointInputSchemas.tasksDelete,
		output: AsanaEndpointOutputSchemas.tasksDelete,
	},
	'tasks.duplicate': {
		input: AsanaEndpointInputSchemas.tasksDuplicate,
		output: AsanaEndpointOutputSchemas.tasksDuplicate,
	},
	'tasks.search': {
		input: AsanaEndpointInputSchemas.tasksSearch,
		output: AsanaEndpointOutputSchemas.tasksSearch,
	},
	'tasks.addFollowers': {
		input: AsanaEndpointInputSchemas.tasksAddFollowers,
		output: AsanaEndpointOutputSchemas.tasksAddFollowers,
	},
	'tasks.removeFollower': {
		input: AsanaEndpointInputSchemas.tasksRemoveFollower,
		output: AsanaEndpointOutputSchemas.tasksRemoveFollower,
	},
	'tasks.addProject': {
		input: AsanaEndpointInputSchemas.tasksAddProject,
		output: AsanaEndpointOutputSchemas.tasksAddProject,
	},
	'tasks.removeProject': {
		input: AsanaEndpointInputSchemas.tasksRemoveProject,
		output: AsanaEndpointOutputSchemas.tasksRemoveProject,
	},
	'tasks.addTag': {
		input: AsanaEndpointInputSchemas.tasksAddTag,
		output: AsanaEndpointOutputSchemas.tasksAddTag,
	},
	'tasks.removeTag': {
		input: AsanaEndpointInputSchemas.tasksRemoveTag,
		output: AsanaEndpointOutputSchemas.tasksRemoveTag,
	},
	'tasks.addDependencies': {
		input: AsanaEndpointInputSchemas.tasksAddDependencies,
		output: AsanaEndpointOutputSchemas.tasksAddDependencies,
	},
	'tasks.createSubtask': {
		input: AsanaEndpointInputSchemas.tasksCreateSubtask,
		output: AsanaEndpointOutputSchemas.tasksCreateSubtask,
	},
	'tasks.getSubtasks': {
		input: AsanaEndpointInputSchemas.tasksGetSubtasks,
		output: AsanaEndpointOutputSchemas.tasksGetSubtasks,
	},
	'tasks.setParent': {
		input: AsanaEndpointInputSchemas.tasksSetParent,
		output: AsanaEndpointOutputSchemas.tasksSetParent,
	},
	'tasks.getStories': {
		input: AsanaEndpointInputSchemas.tasksGetStories,
		output: AsanaEndpointOutputSchemas.tasksGetStories,
	},
	'tasks.getAttachments': {
		input: AsanaEndpointInputSchemas.tasksGetAttachments,
		output: AsanaEndpointOutputSchemas.tasksGetAttachments,
	},
	'tasks.getTags': {
		input: AsanaEndpointInputSchemas.tasksGetTags,
		output: AsanaEndpointOutputSchemas.tasksGetTags,
	},
	'tasks.addToSection': {
		input: AsanaEndpointInputSchemas.tasksAddToSection,
		output: AsanaEndpointOutputSchemas.tasksAddToSection,
	},
	// Projects
	'projects.get': {
		input: AsanaEndpointInputSchemas.projectsGet,
		output: AsanaEndpointOutputSchemas.projectsGet,
	},
	'projects.list': {
		input: AsanaEndpointInputSchemas.projectsList,
		output: AsanaEndpointOutputSchemas.projectsList,
	},
	'projects.create': {
		input: AsanaEndpointInputSchemas.projectsCreate,
		output: AsanaEndpointOutputSchemas.projectsCreate,
	},
	'projects.createForTeam': {
		input: AsanaEndpointInputSchemas.projectsCreateForTeam,
		output: AsanaEndpointOutputSchemas.projectsCreateForTeam,
	},
	'projects.createForWorkspace': {
		input: AsanaEndpointInputSchemas.projectsCreateForWorkspace,
		output: AsanaEndpointOutputSchemas.projectsCreateForWorkspace,
	},
	'projects.update': {
		input: AsanaEndpointInputSchemas.projectsUpdate,
		output: AsanaEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: AsanaEndpointInputSchemas.projectsDelete,
		output: AsanaEndpointOutputSchemas.projectsDelete,
	},
	'projects.duplicate': {
		input: AsanaEndpointInputSchemas.projectsDuplicate,
		output: AsanaEndpointOutputSchemas.projectsDuplicate,
	},
	'projects.addFollowers': {
		input: AsanaEndpointInputSchemas.projectsAddFollowers,
		output: AsanaEndpointOutputSchemas.projectsAddFollowers,
	},
	'projects.removeFollowers': {
		input: AsanaEndpointInputSchemas.projectsRemoveFollowers,
		output: AsanaEndpointOutputSchemas.projectsRemoveFollowers,
	},
	'projects.addMembers': {
		input: AsanaEndpointInputSchemas.projectsAddMembers,
		output: AsanaEndpointOutputSchemas.projectsAddMembers,
	},
	'projects.removeMembers': {
		input: AsanaEndpointInputSchemas.projectsRemoveMembers,
		output: AsanaEndpointOutputSchemas.projectsRemoveMembers,
	},
	'projects.getTasks': {
		input: AsanaEndpointInputSchemas.projectsGetTasks,
		output: AsanaEndpointOutputSchemas.projectsGetTasks,
	},
	'projects.getTaskCounts': {
		input: AsanaEndpointInputSchemas.projectsGetTaskCounts,
		output: AsanaEndpointOutputSchemas.projectsGetTaskCounts,
	},
	'projects.listForWorkspace': {
		input: AsanaEndpointInputSchemas.workspaceProjectsList,
		output: AsanaEndpointOutputSchemas.workspaceProjectsList,
	},
	// Sections
	'sections.get': {
		input: AsanaEndpointInputSchemas.sectionsGet,
		output: AsanaEndpointOutputSchemas.sectionsGet,
	},
	'sections.list': {
		input: AsanaEndpointInputSchemas.sectionsList,
		output: AsanaEndpointOutputSchemas.sectionsList,
	},
	'sections.create': {
		input: AsanaEndpointInputSchemas.sectionsCreate,
		output: AsanaEndpointOutputSchemas.sectionsCreate,
	},
	'sections.update': {
		input: AsanaEndpointInputSchemas.sectionsUpdate,
		output: AsanaEndpointOutputSchemas.sectionsUpdate,
	},
	'sections.delete': {
		input: AsanaEndpointInputSchemas.sectionsDelete,
		output: AsanaEndpointOutputSchemas.sectionsDelete,
	},
	'sections.insert': {
		input: AsanaEndpointInputSchemas.sectionsInsert,
		output: AsanaEndpointOutputSchemas.sectionsInsert,
	},
	// Users
	'users.get': {
		input: AsanaEndpointInputSchemas.usersGet,
		output: AsanaEndpointOutputSchemas.usersGet,
	},
	'users.list': {
		input: AsanaEndpointInputSchemas.usersList,
		output: AsanaEndpointOutputSchemas.usersList,
	},
	'users.getCurrent': {
		input: AsanaEndpointInputSchemas.usersGetCurrent,
		output: AsanaEndpointOutputSchemas.usersGetCurrent,
	},
	'users.listForWorkspace': {
		input: AsanaEndpointInputSchemas.usersListForWorkspace,
		output: AsanaEndpointOutputSchemas.usersListForWorkspace,
	},
	'users.listForTeam': {
		input: AsanaEndpointInputSchemas.usersListForTeam,
		output: AsanaEndpointOutputSchemas.usersListForTeam,
	},
	'users.getTaskList': {
		input: AsanaEndpointInputSchemas.usersGetTaskList,
		output: AsanaEndpointOutputSchemas.usersGetTaskList,
	},
	'users.getUserTaskList': {
		input: AsanaEndpointInputSchemas.usersGetUserTaskList,
		output: AsanaEndpointOutputSchemas.usersGetUserTaskList,
	},
	'users.getFavorites': {
		input: AsanaEndpointInputSchemas.usersGetFavorites,
		output: AsanaEndpointOutputSchemas.usersGetFavorites,
	},
	// Teams
	'teams.get': {
		input: AsanaEndpointInputSchemas.teamsGet,
		output: AsanaEndpointOutputSchemas.teamsGet,
	},
	'teams.listForUser': {
		input: AsanaEndpointInputSchemas.teamsListForUser,
		output: AsanaEndpointOutputSchemas.teamsListForUser,
	},
	'teams.listForWorkspace': {
		input: AsanaEndpointInputSchemas.teamsListForWorkspace,
		output: AsanaEndpointOutputSchemas.teamsListForWorkspace,
	},
	'teams.create': {
		input: AsanaEndpointInputSchemas.teamsCreate,
		output: AsanaEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: AsanaEndpointInputSchemas.teamsUpdate,
		output: AsanaEndpointOutputSchemas.teamsUpdate,
	},
	'teams.addUser': {
		input: AsanaEndpointInputSchemas.teamsAddUser,
		output: AsanaEndpointOutputSchemas.teamsAddUser,
	},
	'teams.removeUser': {
		input: AsanaEndpointInputSchemas.teamsRemoveUser,
		output: AsanaEndpointOutputSchemas.teamsRemoveUser,
	},
	'teams.membershipsList': {
		input: AsanaEndpointInputSchemas.teamMembershipsList,
		output: AsanaEndpointOutputSchemas.teamMembershipsList,
	},
	'teams.membershipsGet': {
		input: AsanaEndpointInputSchemas.teamMembershipsGet,
		output: AsanaEndpointOutputSchemas.teamMembershipsGet,
	},
	'teams.membershipsListForTeam': {
		input: AsanaEndpointInputSchemas.teamMembershipsListForTeam,
		output: AsanaEndpointOutputSchemas.teamMembershipsListForTeam,
	},
	'teams.membershipsListForUser': {
		input: AsanaEndpointInputSchemas.teamMembershipsListForUser,
		output: AsanaEndpointOutputSchemas.teamMembershipsListForUser,
	},
	// Tags
	'tags.get': {
		input: AsanaEndpointInputSchemas.tagsGet,
		output: AsanaEndpointOutputSchemas.tagsGet,
	},
	'tags.list': {
		input: AsanaEndpointInputSchemas.tagsList,
		output: AsanaEndpointOutputSchemas.tagsList,
	},
	'tags.listForWorkspace': {
		input: AsanaEndpointInputSchemas.tagsListForWorkspace,
		output: AsanaEndpointOutputSchemas.tagsListForWorkspace,
	},
	'tags.listForTask': {
		input: AsanaEndpointInputSchemas.tagsListForTask,
		output: AsanaEndpointOutputSchemas.tagsListForTask,
	},
	'tags.create': {
		input: AsanaEndpointInputSchemas.tagsCreate,
		output: AsanaEndpointOutputSchemas.tagsCreate,
	},
	'tags.createInWorkspace': {
		input: AsanaEndpointInputSchemas.tagsCreateInWorkspace,
		output: AsanaEndpointOutputSchemas.tagsCreateInWorkspace,
	},
	'tags.update': {
		input: AsanaEndpointInputSchemas.tagsUpdate,
		output: AsanaEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: AsanaEndpointInputSchemas.tagsDelete,
		output: AsanaEndpointOutputSchemas.tagsDelete,
	},
	'tags.getTasks': {
		input: AsanaEndpointInputSchemas.tagsGetTasks,
		output: AsanaEndpointOutputSchemas.tagsGetTasks,
	},
	// Stories
	'stories.get': {
		input: AsanaEndpointInputSchemas.storiesGet,
		output: AsanaEndpointOutputSchemas.storiesGet,
	},
	'stories.listForTask': {
		input: AsanaEndpointInputSchemas.storiesListForTask,
		output: AsanaEndpointOutputSchemas.storiesListForTask,
	},
	'stories.createComment': {
		input: AsanaEndpointInputSchemas.storiesCreateComment,
		output: AsanaEndpointOutputSchemas.storiesCreateComment,
	},
	'stories.update': {
		input: AsanaEndpointInputSchemas.storiesUpdate,
		output: AsanaEndpointOutputSchemas.storiesUpdate,
	},
	'stories.delete': {
		input: AsanaEndpointInputSchemas.storiesDelete,
		output: AsanaEndpointOutputSchemas.storiesDelete,
	},
	// Webhook management
	'webhookManagement.create': {
		input: AsanaEndpointInputSchemas.webhooksCreate,
		output: AsanaEndpointOutputSchemas.webhooksCreate,
	},
	'webhookManagement.delete': {
		input: AsanaEndpointInputSchemas.webhooksDelete,
		output: AsanaEndpointOutputSchemas.webhooksDelete,
	},
	'webhookManagement.getList': {
		input: AsanaEndpointInputSchemas.webhooksGetList,
		output: AsanaEndpointOutputSchemas.webhooksGetList,
	},
	'webhookManagement.update': {
		input: AsanaEndpointInputSchemas.webhooksUpdate,
		output: AsanaEndpointOutputSchemas.webhooksUpdate,
	},
	// Workspaces
	'workspaces.get': {
		input: AsanaEndpointInputSchemas.workspacesGet,
		output: AsanaEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.list': {
		input: AsanaEndpointInputSchemas.workspacesList,
		output: AsanaEndpointOutputSchemas.workspacesList,
	},
	'workspaces.membershipsGet': {
		input: AsanaEndpointInputSchemas.workspaceMembershipsGet,
		output: AsanaEndpointOutputSchemas.workspaceMembershipsGet,
	},
	'workspaces.membershipsList': {
		input: AsanaEndpointInputSchemas.workspaceMembershipsList,
		output: AsanaEndpointOutputSchemas.workspaceMembershipsList,
	},
	'workspaces.membershipsListForUser': {
		input: AsanaEndpointInputSchemas.workspaceMembershipsListForUser,
		output: AsanaEndpointOutputSchemas.workspaceMembershipsListForUser,
	},
} as const;

const asanaWebhookSchemas = {
	'tasks.taskEvent': {
		description: 'A task event occurred — task was added, changed, or removed',
		payload: AsanaTaskWebhookPayloadSchema,
		response: AsanaWebhookEventSchema,
	},
	'challenge.challenge': {
		description:
			'Asana initial webhook verification handshake via X-Hook-Secret header',
		payload: AsanaChallengePayloadSchema,
		response: AsanaChallengeResponseSchema,
	},
} as const;

const asanaEndpointMeta = {
	// Tasks
	'tasks.get': { riskLevel: 'read', description: 'Get a task by GID' },
	'tasks.list': { riskLevel: 'read', description: 'List tasks' },
	'tasks.create': { riskLevel: 'write', description: 'Create a new task' },
	'tasks.update': { riskLevel: 'write', description: 'Update a task' },
	'tasks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a task [DESTRUCTIVE]',
	},
	'tasks.duplicate': { riskLevel: 'write', description: 'Duplicate a task' },
	'tasks.search': {
		riskLevel: 'read',
		description: 'Search tasks in a workspace',
	},
	'tasks.addFollowers': {
		riskLevel: 'write',
		description: 'Add followers to a task',
	},
	'tasks.removeFollower': {
		riskLevel: 'write',
		description: 'Remove a follower from a task',
	},
	'tasks.addProject': {
		riskLevel: 'write',
		description: 'Add a task to a project',
	},
	'tasks.removeProject': {
		riskLevel: 'write',
		description: 'Remove a task from a project',
	},
	'tasks.addTag': { riskLevel: 'write', description: 'Add a tag to a task' },
	'tasks.removeTag': {
		riskLevel: 'write',
		description: 'Remove a tag from a task',
	},
	'tasks.addDependencies': {
		riskLevel: 'write',
		description: 'Add task dependencies',
	},
	'tasks.createSubtask': {
		riskLevel: 'write',
		description: 'Create a subtask',
	},
	'tasks.getSubtasks': {
		riskLevel: 'read',
		description: 'Get subtasks of a task',
	},
	'tasks.setParent': {
		riskLevel: 'write',
		description: 'Set the parent of a task',
	},
	'tasks.getStories': {
		riskLevel: 'read',
		description: 'Get stories (activity) for a task',
	},
	'tasks.getAttachments': {
		riskLevel: 'read',
		description: 'Get attachments for a task',
	},
	'tasks.getTags': { riskLevel: 'read', description: 'Get tags on a task' },
	'tasks.addToSection': {
		riskLevel: 'write',
		description: 'Add a task to a section',
	},
	// Projects
	'projects.get': { riskLevel: 'read', description: 'Get a project by GID' },
	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'projects.create': { riskLevel: 'write', description: 'Create a project' },
	'projects.createForTeam': {
		riskLevel: 'write',
		description: 'Create a project for a team',
	},
	'projects.createForWorkspace': {
		riskLevel: 'write',
		description: 'Create a project for a workspace',
	},
	'projects.update': { riskLevel: 'write', description: 'Update a project' },
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project [DESTRUCTIVE]',
	},
	'projects.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a project',
	},
	'projects.addFollowers': {
		riskLevel: 'write',
		description: 'Add followers to a project',
	},
	'projects.removeFollowers': {
		riskLevel: 'write',
		description: 'Remove followers from a project',
	},
	'projects.addMembers': {
		riskLevel: 'write',
		description: 'Add members to a project',
	},
	'projects.removeMembers': {
		riskLevel: 'write',
		description: 'Remove members from a project',
	},
	'projects.getTasks': {
		riskLevel: 'read',
		description: 'Get tasks in a project',
	},
	'projects.getTaskCounts': {
		riskLevel: 'read',
		description: 'Get task counts for a project',
	},
	'projects.listForWorkspace': {
		riskLevel: 'read',
		description: 'List projects in a workspace',
	},
	// Sections
	'sections.get': { riskLevel: 'read', description: 'Get a section by GID' },
	'sections.list': {
		riskLevel: 'read',
		description: 'List sections in a project',
	},
	'sections.create': {
		riskLevel: 'write',
		description: 'Create a section in a project',
	},
	'sections.update': { riskLevel: 'write', description: 'Update a section' },
	'sections.delete': {
		riskLevel: 'destructive',
		description: 'Delete a section [DESTRUCTIVE]',
	},
	'sections.insert': {
		riskLevel: 'write',
		description: 'Insert a section at a specific position',
	},
	// Users
	'users.get': { riskLevel: 'read', description: 'Get a user by GID' },
	'users.list': { riskLevel: 'read', description: 'List users' },
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently authenticated user',
	},
	'users.listForWorkspace': {
		riskLevel: 'read',
		description: 'List users in a workspace',
	},
	'users.listForTeam': {
		riskLevel: 'read',
		description: 'List users in a team',
	},
	'users.getTaskList': {
		riskLevel: 'read',
		description: "Get a user's task list",
	},
	'users.getUserTaskList': {
		riskLevel: 'read',
		description: 'Get a user task list by GID',
	},
	'users.getFavorites': {
		riskLevel: 'read',
		description: "Get a user's favorites",
	},
	// Teams
	'teams.get': { riskLevel: 'read', description: 'Get a team by GID' },
	'teams.listForUser': {
		riskLevel: 'read',
		description: 'List teams for a user',
	},
	'teams.listForWorkspace': {
		riskLevel: 'read',
		description: 'List teams in a workspace',
	},
	'teams.create': { riskLevel: 'write', description: 'Create a team' },
	'teams.update': { riskLevel: 'write', description: 'Update a team' },
	'teams.addUser': { riskLevel: 'write', description: 'Add a user to a team' },
	'teams.removeUser': {
		riskLevel: 'write',
		description: 'Remove a user from a team',
	},
	'teams.membershipsList': {
		riskLevel: 'read',
		description: 'List team memberships',
	},
	'teams.membershipsGet': {
		riskLevel: 'read',
		description: 'Get a team membership',
	},
	'teams.membershipsListForTeam': {
		riskLevel: 'read',
		description: 'List memberships for a team',
	},
	'teams.membershipsListForUser': {
		riskLevel: 'read',
		description: 'List team memberships for a user',
	},
	// Tags
	'tags.get': { riskLevel: 'read', description: 'Get a tag by GID' },
	'tags.list': { riskLevel: 'read', description: 'List tags' },
	'tags.listForWorkspace': {
		riskLevel: 'read',
		description: 'List tags in a workspace',
	},
	'tags.listForTask': { riskLevel: 'read', description: 'List tags on a task' },
	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'tags.createInWorkspace': {
		riskLevel: 'write',
		description: 'Create a tag in a workspace',
	},
	'tags.update': { riskLevel: 'write', description: 'Update a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tag [DESTRUCTIVE]',
	},
	'tags.getTasks': {
		riskLevel: 'read',
		description: 'Get tasks with a specific tag',
	},
	// Stories
	'stories.get': { riskLevel: 'read', description: 'Get a story by GID' },
	'stories.listForTask': {
		riskLevel: 'read',
		description: 'List stories for a task',
	},
	'stories.createComment': {
		riskLevel: 'write',
		description: 'Create a comment on a task',
	},
	'stories.update': { riskLevel: 'write', description: 'Update a story' },
	'stories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a story [DESTRUCTIVE]',
	},
	// Webhook management
	'webhookManagement.create': {
		riskLevel: 'write',
		description: 'Register a new webhook',
	},
	'webhookManagement.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook [DESTRUCTIVE]',
	},
	'webhookManagement.getList': {
		riskLevel: 'read',
		description: 'List webhooks',
	},
	'webhookManagement.update': {
		riskLevel: 'write',
		description: 'Update a webhook',
	},
	// Workspaces
	'workspaces.get': {
		riskLevel: 'read',
		description: 'Get a workspace by GID',
	},
	'workspaces.list': { riskLevel: 'read', description: 'List workspaces' },
	'workspaces.membershipsGet': {
		riskLevel: 'read',
		description: 'Get a workspace membership',
	},
	'workspaces.membershipsList': {
		riskLevel: 'read',
		description: 'List workspace memberships',
	},
	'workspaces.membershipsListForUser': {
		riskLevel: 'read',
		description: 'List workspace memberships for a user',
	},
} satisfies RequiredPluginEndpointMeta<typeof asanaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const asanaAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

type AsanaEndpoint<K extends keyof AsanaEndpointOutputs> = CorsairEndpoint<
	AsanaContext,
	AsanaEndpointInputs[K],
	AsanaEndpointOutputs[K]
>;

export type AsanaBoundEndpoints = BindEndpoints<typeof asanaEndpointsNested>;

type AsanaWebhook<
	K extends keyof AsanaWebhookOutputs,
	TPayload,
> = CorsairWebhook<AsanaContext, TPayload, AsanaWebhookOutputs[K]>;

export type AsanaWebhooks = {
	taskEvent: AsanaWebhook<'taskEvent', AsanaTaskWebhookPayload>;
	challenge: AsanaWebhook<'challenge', AsanaChallengePayload>;
};

export type AsanaBoundWebhooks = BindWebhooks<AsanaWebhooks>;

export type AsanaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAsanaPlugin['hooks'];
	webhookHooks?: InternalAsanaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof asanaEndpointsNested>;
};

export type AsanaContext = CorsairPluginContext<
	typeof AsanaSchema,
	AsanaPluginOptions
>;

export type AsanaKeyBuilderContext = KeyBuilderContext<AsanaPluginOptions>;

export type BaseAsanaPlugin<PluginOptions extends AsanaPluginOptions> =
	CorsairPlugin<
		'asana',
		typeof AsanaSchema,
		typeof asanaEndpointsNested,
		typeof asanaWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

export type InternalAsanaPlugin = BaseAsanaPlugin<AsanaPluginOptions>;

export type ExternalAsanaPlugin<PluginOptions extends AsanaPluginOptions> =
	BaseAsanaPlugin<PluginOptions>;

export function asana<const PluginOptions extends AsanaPluginOptions>(
	incomingOptions: AsanaPluginOptions &
		PluginOptions = {} as AsanaPluginOptions & PluginOptions,
): ExternalAsanaPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asana',
		schema: AsanaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: asanaEndpointsNested,
		webhooks: asanaWebhooksNested,
		endpointMeta: asanaEndpointMeta,
		endpointSchemas: asanaEndpointSchemas,
		webhookSchemas: asanaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-hook-signature' in headers || 'x-hook-secret' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsanaKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalAsanaPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AsanaChallengePayload,
	AsanaChallengeResponse,
	AsanaTaskEvent,
	AsanaTaskWebhookPayload,
	AsanaWebhookEvent,
	AsanaWebhookOutputs,
	AsanaWebhookPayload,
} from './webhooks/types';

export {
	createAsanaEventMatch,
	verifyAsanaWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AsanaEndpointInputs,
	AsanaEndpointOutputs,
	ProjectsCreateResponse,
	ProjectsDeleteResponse,
	ProjectsDuplicateResponse,
	ProjectsGetResponse,
	ProjectsGetTaskCountsResponse,
	ProjectsGetTasksResponse,
	ProjectsListResponse,
	ProjectsUpdateResponse,
	SectionsCreateResponse,
	SectionsGetResponse,
	SectionsListResponse,
	SectionsUpdateResponse,
	StoriesCreateCommentResponse,
	StoriesGetResponse,
	StoriesListForTaskResponse,
	TagsCreateResponse,
	TagsGetResponse,
	TagsGetTasksResponse,
	TagsListResponse,
	TasksCreateResponse,
	TasksDeleteResponse,
	TasksDuplicateResponse,
	TasksGetResponse,
	TasksGetStoriesResponse,
	TasksGetSubtasksResponse,
	TasksListResponse,
	TasksSearchResponse,
	TasksUpdateResponse,
	TeamMembershipsGetResponse,
	TeamMembershipsListResponse,
	TeamsAddUserResponse,
	TeamsCreateResponse,
	TeamsGetResponse,
	TeamsListResponse,
	UsersGetResponse,
	UsersListResponse,
	WebhooksGetListResponse,
	WebhooksUpdateResponse,
	WorkspaceMembershipsGetResponse,
	WorkspaceMembershipsListResponse,
	WorkspacesGetResponse,
	WorkspacesListResponse,
} from './endpoints/types';
