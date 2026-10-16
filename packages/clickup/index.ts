import type {
	BindEndpoints,
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
import {
	ChatEndpoints,
	ChecklistsEndpoints,
	CustomFieldsEndpoints,
	DependenciesEndpoints,
	DocsEndpoints,
	FoldersEndpoints,
	GoalsEndpoints,
	GuestsEndpoints,
	ListsEndpoints,
	SpacesEndpoints,
	TaskCommentsEndpoints,
	TaskLinksEndpoints,
	TaskListsEndpoints,
	TasksEndpoints,
	TeamsEndpoints,
	TimeEntriesEndpoints,
	UsersEndpoints,
	ViewsEndpoints,
	WorkspaceAclEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import {
	ClickupEndpointInputSchemas,
	ClickupEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClickupSchema } from './schema';

export type ClickupPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalClickupPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clickupEndpointsNested>;
};

export type ClickupContext = CorsairPluginContext<
	typeof ClickupSchema,
	ClickupPluginOptions
>;

export type ClickupKeyBuilderContext = KeyBuilderContext<ClickupPluginOptions>;

export type ClickupBoundEndpoints = BindEndpoints<
	typeof clickupEndpointsNested
>;

const clickupEndpointsNested = {
	workspaces: {
		get: WorkspacesEndpoints.get,
		authorizedUser: WorkspacesEndpoints.authorizedUser,
		plan: WorkspacesEndpoints.plan,
		seats: WorkspacesEndpoints.seats,
		sharedHierarchy: WorkspacesEndpoints.sharedHierarchy,
		customRoles: WorkspacesEndpoints.customRoles,
		customTaskTypes: WorkspacesEndpoints.customTaskTypes,
		teamFields: WorkspacesEndpoints.teamFields,
		everythingViewsGet: WorkspacesEndpoints.everythingViewsGet,
		everythingViewsCreate: WorkspacesEndpoints.everythingViewsCreate,
	},
	spaces: {
		list: SpacesEndpoints.list,
		get: SpacesEndpoints.get,
		create: SpacesEndpoints.create,
		update: SpacesEndpoints.update,
		delete: SpacesEndpoints.delete,
		availableFields: SpacesEndpoints.availableFields,
		tagsGet: SpacesEndpoints.tagsGet,
		tagsCreate: SpacesEndpoints.tagsCreate,
		tagsUpdate: SpacesEndpoints.tagsUpdate,
		tagsDelete: SpacesEndpoints.tagsDelete,
		viewsGet: SpacesEndpoints.viewsGet,
		viewsCreate: SpacesEndpoints.viewsCreate,
	},
	folders: {
		list: FoldersEndpoints.list,
		get: FoldersEndpoints.get,
		create: FoldersEndpoints.create,
		update: FoldersEndpoints.update,
		delete: FoldersEndpoints.delete,
		viewsGet: FoldersEndpoints.viewsGet,
		viewsCreate: FoldersEndpoints.viewsCreate,
	},
	lists: {
		list: ListsEndpoints.list,
		folderless: ListsEndpoints.folderless,
		get: ListsEndpoints.get,
		create: ListsEndpoints.create,
		createFolderless: ListsEndpoints.createFolderless,
		createFromTemplate: ListsEndpoints.createFromTemplate,
		update: ListsEndpoints.update,
		delete: ListsEndpoints.delete,
		members: ListsEndpoints.members,
		commentsGet: ListsEndpoints.commentsGet,
		commentsCreate: ListsEndpoints.commentsCreate,
		viewsGet: ListsEndpoints.viewsGet,
		viewsCreate: ListsEndpoints.viewsCreate,
	},
	tasks: {
		list: TasksEndpoints.list,
		filteredTeam: TasksEndpoints.filteredTeam,
		get: TasksEndpoints.get,
		create: TasksEndpoints.create,
		update: TasksEndpoints.update,
		delete: TasksEndpoints.delete,
		createFromTemplate: TasksEndpoints.createFromTemplate,
		moveToHomeList: TasksEndpoints.moveToHomeList,
		members: TasksEndpoints.members,
		timeInStatus: TasksEndpoints.timeInStatus,
		bulkTimeInStatus: TasksEndpoints.bulkTimeInStatus,
		templates: TasksEndpoints.templates,
		trackedTimeGet: TasksEndpoints.trackedTimeGet,
		trackedTimeCreate: TasksEndpoints.trackedTimeCreate,
		trackedTimeUpdate: TasksEndpoints.trackedTimeUpdate,
		trackedTimeDelete: TasksEndpoints.trackedTimeDelete,
		tagsAdd: TasksEndpoints.tagsAdd,
		tagsRemove: TasksEndpoints.tagsRemove,
		attachmentsCreate: TasksEndpoints.attachmentsCreate,
	},
	dependencies: {
		add: DependenciesEndpoints.add,
		delete: DependenciesEndpoints.delete,
	},
	taskLinks: {
		add: TaskLinksEndpoints.add,
		delete: TaskLinksEndpoints.delete,
	},
	taskLists: {
		add: TaskListsEndpoints.add,
		remove: TaskListsEndpoints.remove,
	},
	checklists: {
		create: ChecklistsEndpoints.create,
		update: ChecklistsEndpoints.update,
		delete: ChecklistsEndpoints.delete,
		itemsCreate: ChecklistsEndpoints.itemsCreate,
		itemsUpdate: ChecklistsEndpoints.itemsUpdate,
		itemsDelete: ChecklistsEndpoints.itemsDelete,
	},
	taskComments: {
		get: TaskCommentsEndpoints.get,
		create: TaskCommentsEndpoints.create,
		update: TaskCommentsEndpoints.update,
		delete: TaskCommentsEndpoints.delete,
		threadedCreate: TaskCommentsEndpoints.threadedCreate,
		threadedGet: TaskCommentsEndpoints.threadedGet,
	},
	customFields: {
		accessible: CustomFieldsEndpoints.accessible,
		folderFields: CustomFieldsEndpoints.folderFields,
		setValue: CustomFieldsEndpoints.setValue,
		removeValue: CustomFieldsEndpoints.removeValue,
	},
	views: {
		get: ViewsEndpoints.get,
		update: ViewsEndpoints.update,
		delete: ViewsEndpoints.delete,
		tasks: ViewsEndpoints.tasks,
		chatCommentsGet: ViewsEndpoints.chatCommentsGet,
		chatCommentsCreate: ViewsEndpoints.chatCommentsCreate,
	},
	goals: {
		list: GoalsEndpoints.list,
		get: GoalsEndpoints.get,
		create: GoalsEndpoints.create,
		update: GoalsEndpoints.update,
		delete: GoalsEndpoints.delete,
		keyResultsCreate: GoalsEndpoints.keyResultsCreate,
		keyResultsUpdate: GoalsEndpoints.keyResultsUpdate,
		keyResultsDelete: GoalsEndpoints.keyResultsDelete,
	},
	timeEntries: {
		range: TimeEntriesEndpoints.range,
		get: TimeEntriesEndpoints.get,
		create: TimeEntriesEndpoints.create,
		update: TimeEntriesEndpoints.update,
		delete: TimeEntriesEndpoints.delete,
		running: TimeEntriesEndpoints.running,
		start: TimeEntriesEndpoints.start,
		stop: TimeEntriesEndpoints.stop,
		history: TimeEntriesEndpoints.history,
		tagsGetAll: TimeEntriesEndpoints.tagsGetAll,
		tagsAdd: TimeEntriesEndpoints.tagsAdd,
		tagsRemove: TimeEntriesEndpoints.tagsRemove,
		tagsUpdate: TimeEntriesEndpoints.tagsUpdate,
	},
	docs: {
		search: DocsEndpoints.search,
		create: DocsEndpoints.create,
		content: DocsEndpoints.content,
		pages: DocsEndpoints.pages,
		pageListing: DocsEndpoints.pageListing,
		pageContent: DocsEndpoints.pageContent,
		createPage: DocsEndpoints.createPage,
		updatePage: DocsEndpoints.updatePage,
	},
	chat: {
		channelsList: ChatEndpoints.channelsList,
		channelsGet: ChatEndpoints.channelsGet,
		channelsCreate: ChatEndpoints.channelsCreate,
		channelsCreateLocation: ChatEndpoints.channelsCreateLocation,
		channelsCreateDm: ChatEndpoints.channelsCreateDm,
		channelsUpdate: ChatEndpoints.channelsUpdate,
		channelsDelete: ChatEndpoints.channelsDelete,
		channelsMembers: ChatEndpoints.channelsMembers,
		channelsFollowers: ChatEndpoints.channelsFollowers,
		messagesList: ChatEndpoints.messagesList,
		messagesCreate: ChatEndpoints.messagesCreate,
		messagesUpdate: ChatEndpoints.messagesUpdate,
		messagesDelete: ChatEndpoints.messagesDelete,
		repliesGet: ChatEndpoints.repliesGet,
		repliesCreate: ChatEndpoints.repliesCreate,
		reactionsGet: ChatEndpoints.reactionsGet,
		reactionsCreate: ChatEndpoints.reactionsCreate,
		reactionsDelete: ChatEndpoints.reactionsDelete,
		taggedUsers: ChatEndpoints.taggedUsers,
		subtypes: ChatEndpoints.subtypes,
	},
	users: {
		get: UsersEndpoints.get,
		invite: UsersEndpoints.invite,
		update: UsersEndpoints.update,
		remove: UsersEndpoints.remove,
	},
	guests: {
		get: GuestsEndpoints.get,
		invite: GuestsEndpoints.invite,
		update: GuestsEndpoints.update,
		remove: GuestsEndpoints.remove,
		addToTask: GuestsEndpoints.addToTask,
		removeFromTask: GuestsEndpoints.removeFromTask,
		addToList: GuestsEndpoints.addToList,
		removeFromList: GuestsEndpoints.removeFromList,
		addToFolder: GuestsEndpoints.addToFolder,
		removeFromFolder: GuestsEndpoints.removeFromFolder,
	},
	teams: {
		list: TeamsEndpoints.list,
		create: TeamsEndpoints.create,
		update: TeamsEndpoints.update,
		delete: TeamsEndpoints.delete,
	},
	workspaceAcl: {
		update: WorkspaceAclEndpoints.update,
	},
} as const;

// Webhooks intentionally empty: this plugin ships no webhook support.
const clickupWebhooksNested = {} as const;

export const clickupEndpointSchemas = {
	'workspaces.get': {
		input: ClickupEndpointInputSchemas.workspacesGet,
		output: ClickupEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.authorizedUser': {
		input: ClickupEndpointInputSchemas.workspacesAuthorizedUser,
		output: ClickupEndpointOutputSchemas.workspacesAuthorizedUser,
	},
	'workspaces.plan': {
		input: ClickupEndpointInputSchemas.workspacesPlan,
		output: ClickupEndpointOutputSchemas.workspacesPlan,
	},
	'workspaces.seats': {
		input: ClickupEndpointInputSchemas.workspacesSeats,
		output: ClickupEndpointOutputSchemas.workspacesSeats,
	},
	'workspaces.sharedHierarchy': {
		input: ClickupEndpointInputSchemas.workspacesSharedHierarchy,
		output: ClickupEndpointOutputSchemas.workspacesSharedHierarchy,
	},
	'workspaces.customRoles': {
		input: ClickupEndpointInputSchemas.workspacesCustomRoles,
		output: ClickupEndpointOutputSchemas.workspacesCustomRoles,
	},
	'workspaces.customTaskTypes': {
		input: ClickupEndpointInputSchemas.workspacesCustomTaskTypes,
		output: ClickupEndpointOutputSchemas.workspacesCustomTaskTypes,
	},
	'workspaces.teamFields': {
		input: ClickupEndpointInputSchemas.workspacesTeamFields,
		output: ClickupEndpointOutputSchemas.workspacesTeamFields,
	},
	'workspaces.everythingViewsGet': {
		input: ClickupEndpointInputSchemas.workspacesEverythingViewsGet,
		output: ClickupEndpointOutputSchemas.workspacesEverythingViewsGet,
	},
	'workspaces.everythingViewsCreate': {
		input: ClickupEndpointInputSchemas.workspacesEverythingViewsCreate,
		output: ClickupEndpointOutputSchemas.workspacesEverythingViewsCreate,
	},
	'spaces.list': {
		input: ClickupEndpointInputSchemas.spacesList,
		output: ClickupEndpointOutputSchemas.spacesList,
	},
	'spaces.get': {
		input: ClickupEndpointInputSchemas.spacesGet,
		output: ClickupEndpointOutputSchemas.spacesGet,
	},
	'spaces.create': {
		input: ClickupEndpointInputSchemas.spacesCreate,
		output: ClickupEndpointOutputSchemas.spacesCreate,
	},
	'spaces.update': {
		input: ClickupEndpointInputSchemas.spacesUpdate,
		output: ClickupEndpointOutputSchemas.spacesUpdate,
	},
	'spaces.delete': {
		input: ClickupEndpointInputSchemas.spacesDelete,
		output: ClickupEndpointOutputSchemas.spacesDelete,
	},
	'spaces.availableFields': {
		input: ClickupEndpointInputSchemas.spacesAvailableFields,
		output: ClickupEndpointOutputSchemas.spacesAvailableFields,
	},
	'spaces.tagsGet': {
		input: ClickupEndpointInputSchemas.spacesTagsGet,
		output: ClickupEndpointOutputSchemas.spacesTagsGet,
	},
	'spaces.tagsCreate': {
		input: ClickupEndpointInputSchemas.spacesTagsCreate,
		output: ClickupEndpointOutputSchemas.spacesTagsCreate,
	},
	'spaces.tagsUpdate': {
		input: ClickupEndpointInputSchemas.spacesTagsUpdate,
		output: ClickupEndpointOutputSchemas.spacesTagsUpdate,
	},
	'spaces.tagsDelete': {
		input: ClickupEndpointInputSchemas.spacesTagsDelete,
		output: ClickupEndpointOutputSchemas.spacesTagsDelete,
	},
	'spaces.viewsGet': {
		input: ClickupEndpointInputSchemas.spacesViewsGet,
		output: ClickupEndpointOutputSchemas.spacesViewsGet,
	},
	'spaces.viewsCreate': {
		input: ClickupEndpointInputSchemas.spacesViewsCreate,
		output: ClickupEndpointOutputSchemas.spacesViewsCreate,
	},
	'folders.list': {
		input: ClickupEndpointInputSchemas.foldersList,
		output: ClickupEndpointOutputSchemas.foldersList,
	},
	'folders.get': {
		input: ClickupEndpointInputSchemas.foldersGet,
		output: ClickupEndpointOutputSchemas.foldersGet,
	},
	'folders.create': {
		input: ClickupEndpointInputSchemas.foldersCreate,
		output: ClickupEndpointOutputSchemas.foldersCreate,
	},
	'folders.update': {
		input: ClickupEndpointInputSchemas.foldersUpdate,
		output: ClickupEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: ClickupEndpointInputSchemas.foldersDelete,
		output: ClickupEndpointOutputSchemas.foldersDelete,
	},
	'folders.viewsGet': {
		input: ClickupEndpointInputSchemas.foldersViewsGet,
		output: ClickupEndpointOutputSchemas.foldersViewsGet,
	},
	'folders.viewsCreate': {
		input: ClickupEndpointInputSchemas.foldersViewsCreate,
		output: ClickupEndpointOutputSchemas.foldersViewsCreate,
	},
	'lists.list': {
		input: ClickupEndpointInputSchemas.listsList,
		output: ClickupEndpointOutputSchemas.listsList,
	},
	'lists.folderless': {
		input: ClickupEndpointInputSchemas.listsFolderless,
		output: ClickupEndpointOutputSchemas.listsFolderless,
	},
	'lists.get': {
		input: ClickupEndpointInputSchemas.listsGet,
		output: ClickupEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: ClickupEndpointInputSchemas.listsCreate,
		output: ClickupEndpointOutputSchemas.listsCreate,
	},
	'lists.createFolderless': {
		input: ClickupEndpointInputSchemas.listsCreateFolderless,
		output: ClickupEndpointOutputSchemas.listsCreateFolderless,
	},
	'lists.createFromTemplate': {
		input: ClickupEndpointInputSchemas.listsCreateFromTemplate,
		output: ClickupEndpointOutputSchemas.listsCreateFromTemplate,
	},
	'lists.update': {
		input: ClickupEndpointInputSchemas.listsUpdate,
		output: ClickupEndpointOutputSchemas.listsUpdate,
	},
	'lists.delete': {
		input: ClickupEndpointInputSchemas.listsDelete,
		output: ClickupEndpointOutputSchemas.listsDelete,
	},
	'lists.members': {
		input: ClickupEndpointInputSchemas.listsMembers,
		output: ClickupEndpointOutputSchemas.listsMembers,
	},
	'lists.commentsGet': {
		input: ClickupEndpointInputSchemas.listsCommentsGet,
		output: ClickupEndpointOutputSchemas.listsCommentsGet,
	},
	'lists.commentsCreate': {
		input: ClickupEndpointInputSchemas.listsCommentsCreate,
		output: ClickupEndpointOutputSchemas.listsCommentsCreate,
	},
	'lists.viewsGet': {
		input: ClickupEndpointInputSchemas.listsViewsGet,
		output: ClickupEndpointOutputSchemas.listsViewsGet,
	},
	'lists.viewsCreate': {
		input: ClickupEndpointInputSchemas.listsViewsCreate,
		output: ClickupEndpointOutputSchemas.listsViewsCreate,
	},
	'tasks.list': {
		input: ClickupEndpointInputSchemas.tasksList,
		output: ClickupEndpointOutputSchemas.tasksList,
	},
	'tasks.filteredTeam': {
		input: ClickupEndpointInputSchemas.tasksFilteredTeam,
		output: ClickupEndpointOutputSchemas.tasksFilteredTeam,
	},
	'tasks.get': {
		input: ClickupEndpointInputSchemas.tasksGet,
		output: ClickupEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: ClickupEndpointInputSchemas.tasksCreate,
		output: ClickupEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: ClickupEndpointInputSchemas.tasksUpdate,
		output: ClickupEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: ClickupEndpointInputSchemas.tasksDelete,
		output: ClickupEndpointOutputSchemas.tasksDelete,
	},
	'tasks.createFromTemplate': {
		input: ClickupEndpointInputSchemas.tasksCreateFromTemplate,
		output: ClickupEndpointOutputSchemas.tasksCreateFromTemplate,
	},
	'tasks.moveToHomeList': {
		input: ClickupEndpointInputSchemas.tasksMoveToHomeList,
		output: ClickupEndpointOutputSchemas.tasksMoveToHomeList,
	},
	'tasks.members': {
		input: ClickupEndpointInputSchemas.tasksMembers,
		output: ClickupEndpointOutputSchemas.tasksMembers,
	},
	'tasks.timeInStatus': {
		input: ClickupEndpointInputSchemas.tasksTimeInStatus,
		output: ClickupEndpointOutputSchemas.tasksTimeInStatus,
	},
	'tasks.bulkTimeInStatus': {
		input: ClickupEndpointInputSchemas.tasksBulkTimeInStatus,
		output: ClickupEndpointOutputSchemas.tasksBulkTimeInStatus,
	},
	'tasks.templates': {
		input: ClickupEndpointInputSchemas.tasksTemplates,
		output: ClickupEndpointOutputSchemas.tasksTemplates,
	},
	'tasks.trackedTimeGet': {
		input: ClickupEndpointInputSchemas.tasksTrackedTimeGet,
		output: ClickupEndpointOutputSchemas.tasksTrackedTimeGet,
	},
	'tasks.trackedTimeCreate': {
		input: ClickupEndpointInputSchemas.tasksTrackedTimeCreate,
		output: ClickupEndpointOutputSchemas.tasksTrackedTimeCreate,
	},
	'tasks.trackedTimeUpdate': {
		input: ClickupEndpointInputSchemas.tasksTrackedTimeUpdate,
		output: ClickupEndpointOutputSchemas.tasksTrackedTimeUpdate,
	},
	'tasks.trackedTimeDelete': {
		input: ClickupEndpointInputSchemas.tasksTrackedTimeDelete,
		output: ClickupEndpointOutputSchemas.tasksTrackedTimeDelete,
	},
	'tasks.tagsAdd': {
		input: ClickupEndpointInputSchemas.tasksTagsAdd,
		output: ClickupEndpointOutputSchemas.tasksTagsAdd,
	},
	'tasks.tagsRemove': {
		input: ClickupEndpointInputSchemas.tasksTagsRemove,
		output: ClickupEndpointOutputSchemas.tasksTagsRemove,
	},
	'tasks.attachmentsCreate': {
		input: ClickupEndpointInputSchemas.tasksAttachmentsCreate,
		output: ClickupEndpointOutputSchemas.tasksAttachmentsCreate,
	},
	'dependencies.add': {
		input: ClickupEndpointInputSchemas.dependenciesAdd,
		output: ClickupEndpointOutputSchemas.dependenciesAdd,
	},
	'dependencies.delete': {
		input: ClickupEndpointInputSchemas.dependenciesDelete,
		output: ClickupEndpointOutputSchemas.dependenciesDelete,
	},
	'taskLinks.add': {
		input: ClickupEndpointInputSchemas.taskLinksAdd,
		output: ClickupEndpointOutputSchemas.taskLinksAdd,
	},
	'taskLinks.delete': {
		input: ClickupEndpointInputSchemas.taskLinksDelete,
		output: ClickupEndpointOutputSchemas.taskLinksDelete,
	},
	'taskLists.add': {
		input: ClickupEndpointInputSchemas.taskListsAdd,
		output: ClickupEndpointOutputSchemas.taskListsAdd,
	},
	'taskLists.remove': {
		input: ClickupEndpointInputSchemas.taskListsRemove,
		output: ClickupEndpointOutputSchemas.taskListsRemove,
	},
	'checklists.create': {
		input: ClickupEndpointInputSchemas.checklistsCreate,
		output: ClickupEndpointOutputSchemas.checklistsCreate,
	},
	'checklists.update': {
		input: ClickupEndpointInputSchemas.checklistsUpdate,
		output: ClickupEndpointOutputSchemas.checklistsUpdate,
	},
	'checklists.delete': {
		input: ClickupEndpointInputSchemas.checklistsDelete,
		output: ClickupEndpointOutputSchemas.checklistsDelete,
	},
	'checklists.itemsCreate': {
		input: ClickupEndpointInputSchemas.checklistItemsCreate,
		output: ClickupEndpointOutputSchemas.checklistItemsCreate,
	},
	'checklists.itemsUpdate': {
		input: ClickupEndpointInputSchemas.checklistItemsUpdate,
		output: ClickupEndpointOutputSchemas.checklistItemsUpdate,
	},
	'checklists.itemsDelete': {
		input: ClickupEndpointInputSchemas.checklistItemsDelete,
		output: ClickupEndpointOutputSchemas.checklistItemsDelete,
	},
	'taskComments.get': {
		input: ClickupEndpointInputSchemas.taskCommentsGet,
		output: ClickupEndpointOutputSchemas.taskCommentsGet,
	},
	'taskComments.create': {
		input: ClickupEndpointInputSchemas.taskCommentsCreate,
		output: ClickupEndpointOutputSchemas.taskCommentsCreate,
	},
	'taskComments.update': {
		input: ClickupEndpointInputSchemas.taskCommentsUpdate,
		output: ClickupEndpointOutputSchemas.taskCommentsUpdate,
	},
	'taskComments.delete': {
		input: ClickupEndpointInputSchemas.taskCommentsDelete,
		output: ClickupEndpointOutputSchemas.taskCommentsDelete,
	},
	'taskComments.threadedCreate': {
		input: ClickupEndpointInputSchemas.threadedCommentsCreate,
		output: ClickupEndpointOutputSchemas.threadedCommentsCreate,
	},
	'taskComments.threadedGet': {
		input: ClickupEndpointInputSchemas.threadedCommentsGet,
		output: ClickupEndpointOutputSchemas.threadedCommentsGet,
	},
	'customFields.accessible': {
		input: ClickupEndpointInputSchemas.customFieldsAccessible,
		output: ClickupEndpointOutputSchemas.customFieldsAccessible,
	},
	'customFields.folderFields': {
		input: ClickupEndpointInputSchemas.customFieldsFolderFields,
		output: ClickupEndpointOutputSchemas.customFieldsFolderFields,
	},
	'customFields.setValue': {
		input: ClickupEndpointInputSchemas.customFieldsSetValue,
		output: ClickupEndpointOutputSchemas.customFieldsSetValue,
	},
	'customFields.removeValue': {
		input: ClickupEndpointInputSchemas.customFieldsRemoveValue,
		output: ClickupEndpointOutputSchemas.customFieldsRemoveValue,
	},
	'views.get': {
		input: ClickupEndpointInputSchemas.viewsGet,
		output: ClickupEndpointOutputSchemas.viewsGet,
	},
	'views.update': {
		input: ClickupEndpointInputSchemas.viewsUpdate,
		output: ClickupEndpointOutputSchemas.viewsUpdate,
	},
	'views.delete': {
		input: ClickupEndpointInputSchemas.viewsDelete,
		output: ClickupEndpointOutputSchemas.viewsDelete,
	},
	'views.tasks': {
		input: ClickupEndpointInputSchemas.viewsTasks,
		output: ClickupEndpointOutputSchemas.viewsTasks,
	},
	'views.chatCommentsGet': {
		input: ClickupEndpointInputSchemas.viewsChatCommentsGet,
		output: ClickupEndpointOutputSchemas.viewsChatCommentsGet,
	},
	'views.chatCommentsCreate': {
		input: ClickupEndpointInputSchemas.viewsChatCommentsCreate,
		output: ClickupEndpointOutputSchemas.viewsChatCommentsCreate,
	},
	'goals.list': {
		input: ClickupEndpointInputSchemas.goalsList,
		output: ClickupEndpointOutputSchemas.goalsList,
	},
	'goals.get': {
		input: ClickupEndpointInputSchemas.goalsGet,
		output: ClickupEndpointOutputSchemas.goalsGet,
	},
	'goals.create': {
		input: ClickupEndpointInputSchemas.goalsCreate,
		output: ClickupEndpointOutputSchemas.goalsCreate,
	},
	'goals.update': {
		input: ClickupEndpointInputSchemas.goalsUpdate,
		output: ClickupEndpointOutputSchemas.goalsUpdate,
	},
	'goals.delete': {
		input: ClickupEndpointInputSchemas.goalsDelete,
		output: ClickupEndpointOutputSchemas.goalsDelete,
	},
	'goals.keyResultsCreate': {
		input: ClickupEndpointInputSchemas.keyResultsCreate,
		output: ClickupEndpointOutputSchemas.keyResultsCreate,
	},
	'goals.keyResultsUpdate': {
		input: ClickupEndpointInputSchemas.keyResultsUpdate,
		output: ClickupEndpointOutputSchemas.keyResultsUpdate,
	},
	'goals.keyResultsDelete': {
		input: ClickupEndpointInputSchemas.keyResultsDelete,
		output: ClickupEndpointOutputSchemas.keyResultsDelete,
	},
	'timeEntries.range': {
		input: ClickupEndpointInputSchemas.timeEntriesRange,
		output: ClickupEndpointOutputSchemas.timeEntriesRange,
	},
	'timeEntries.get': {
		input: ClickupEndpointInputSchemas.timeEntriesGet,
		output: ClickupEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: ClickupEndpointInputSchemas.timeEntriesCreate,
		output: ClickupEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: ClickupEndpointInputSchemas.timeEntriesUpdate,
		output: ClickupEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: ClickupEndpointInputSchemas.timeEntriesDelete,
		output: ClickupEndpointOutputSchemas.timeEntriesDelete,
	},
	'timeEntries.running': {
		input: ClickupEndpointInputSchemas.timeEntriesRunning,
		output: ClickupEndpointOutputSchemas.timeEntriesRunning,
	},
	'timeEntries.start': {
		input: ClickupEndpointInputSchemas.timeEntriesStart,
		output: ClickupEndpointOutputSchemas.timeEntriesStart,
	},
	'timeEntries.stop': {
		input: ClickupEndpointInputSchemas.timeEntriesStop,
		output: ClickupEndpointOutputSchemas.timeEntriesStop,
	},
	'timeEntries.history': {
		input: ClickupEndpointInputSchemas.timeEntriesHistory,
		output: ClickupEndpointOutputSchemas.timeEntriesHistory,
	},
	'timeEntries.tagsGetAll': {
		input: ClickupEndpointInputSchemas.timeEntryTagsGetAll,
		output: ClickupEndpointOutputSchemas.timeEntryTagsGetAll,
	},
	'timeEntries.tagsAdd': {
		input: ClickupEndpointInputSchemas.timeEntryTagsAdd,
		output: ClickupEndpointOutputSchemas.timeEntryTagsAdd,
	},
	'timeEntries.tagsRemove': {
		input: ClickupEndpointInputSchemas.timeEntryTagsRemove,
		output: ClickupEndpointOutputSchemas.timeEntryTagsRemove,
	},
	'timeEntries.tagsUpdate': {
		input: ClickupEndpointInputSchemas.timeEntryTagsUpdate,
		output: ClickupEndpointOutputSchemas.timeEntryTagsUpdate,
	},
	'docs.search': {
		input: ClickupEndpointInputSchemas.docsSearch,
		output: ClickupEndpointOutputSchemas.docsSearch,
	},
	'docs.create': {
		input: ClickupEndpointInputSchemas.docsCreate,
		output: ClickupEndpointOutputSchemas.docsCreate,
	},
	'docs.content': {
		input: ClickupEndpointInputSchemas.docsContent,
		output: ClickupEndpointOutputSchemas.docsContent,
	},
	'docs.pages': {
		input: ClickupEndpointInputSchemas.docsPages,
		output: ClickupEndpointOutputSchemas.docsPages,
	},
	'docs.pageListing': {
		input: ClickupEndpointInputSchemas.docsPageListing,
		output: ClickupEndpointOutputSchemas.docsPageListing,
	},
	'docs.pageContent': {
		input: ClickupEndpointInputSchemas.docsPageContent,
		output: ClickupEndpointOutputSchemas.docsPageContent,
	},
	'docs.createPage': {
		input: ClickupEndpointInputSchemas.docsCreatePage,
		output: ClickupEndpointOutputSchemas.docsCreatePage,
	},
	'docs.updatePage': {
		input: ClickupEndpointInputSchemas.docsUpdatePage,
		output: ClickupEndpointOutputSchemas.docsUpdatePage,
	},
	'chat.channelsList': {
		input: ClickupEndpointInputSchemas.chatChannelsList,
		output: ClickupEndpointOutputSchemas.chatChannelsList,
	},
	'chat.channelsGet': {
		input: ClickupEndpointInputSchemas.chatChannelsGet,
		output: ClickupEndpointOutputSchemas.chatChannelsGet,
	},
	'chat.channelsCreate': {
		input: ClickupEndpointInputSchemas.chatChannelsCreate,
		output: ClickupEndpointOutputSchemas.chatChannelsCreate,
	},
	'chat.channelsCreateLocation': {
		input: ClickupEndpointInputSchemas.chatChannelsCreateLocation,
		output: ClickupEndpointOutputSchemas.chatChannelsCreateLocation,
	},
	'chat.channelsCreateDm': {
		input: ClickupEndpointInputSchemas.chatChannelsCreateDm,
		output: ClickupEndpointOutputSchemas.chatChannelsCreateDm,
	},
	'chat.channelsUpdate': {
		input: ClickupEndpointInputSchemas.chatChannelsUpdate,
		output: ClickupEndpointOutputSchemas.chatChannelsUpdate,
	},
	'chat.channelsDelete': {
		input: ClickupEndpointInputSchemas.chatChannelsDelete,
		output: ClickupEndpointOutputSchemas.chatChannelsDelete,
	},
	'chat.channelsMembers': {
		input: ClickupEndpointInputSchemas.chatChannelsMembers,
		output: ClickupEndpointOutputSchemas.chatChannelsMembers,
	},
	'chat.channelsFollowers': {
		input: ClickupEndpointInputSchemas.chatChannelsFollowers,
		output: ClickupEndpointOutputSchemas.chatChannelsFollowers,
	},
	'chat.messagesList': {
		input: ClickupEndpointInputSchemas.chatMessagesList,
		output: ClickupEndpointOutputSchemas.chatMessagesList,
	},
	'chat.messagesCreate': {
		input: ClickupEndpointInputSchemas.chatMessagesCreate,
		output: ClickupEndpointOutputSchemas.chatMessagesCreate,
	},
	'chat.messagesUpdate': {
		input: ClickupEndpointInputSchemas.chatMessagesUpdate,
		output: ClickupEndpointOutputSchemas.chatMessagesUpdate,
	},
	'chat.messagesDelete': {
		input: ClickupEndpointInputSchemas.chatMessagesDelete,
		output: ClickupEndpointOutputSchemas.chatMessagesDelete,
	},
	'chat.repliesGet': {
		input: ClickupEndpointInputSchemas.chatRepliesGet,
		output: ClickupEndpointOutputSchemas.chatRepliesGet,
	},
	'chat.repliesCreate': {
		input: ClickupEndpointInputSchemas.chatRepliesCreate,
		output: ClickupEndpointOutputSchemas.chatRepliesCreate,
	},
	'chat.reactionsGet': {
		input: ClickupEndpointInputSchemas.chatReactionsGet,
		output: ClickupEndpointOutputSchemas.chatReactionsGet,
	},
	'chat.reactionsCreate': {
		input: ClickupEndpointInputSchemas.chatReactionsCreate,
		output: ClickupEndpointOutputSchemas.chatReactionsCreate,
	},
	'chat.reactionsDelete': {
		input: ClickupEndpointInputSchemas.chatReactionsDelete,
		output: ClickupEndpointOutputSchemas.chatReactionsDelete,
	},
	'chat.taggedUsers': {
		input: ClickupEndpointInputSchemas.chatTaggedUsers,
		output: ClickupEndpointOutputSchemas.chatTaggedUsers,
	},
	'chat.subtypes': {
		input: ClickupEndpointInputSchemas.chatSubtypes,
		output: ClickupEndpointOutputSchemas.chatSubtypes,
	},
	'users.get': {
		input: ClickupEndpointInputSchemas.usersGet,
		output: ClickupEndpointOutputSchemas.usersGet,
	},
	'users.invite': {
		input: ClickupEndpointInputSchemas.usersInvite,
		output: ClickupEndpointOutputSchemas.usersInvite,
	},
	'users.update': {
		input: ClickupEndpointInputSchemas.usersUpdate,
		output: ClickupEndpointOutputSchemas.usersUpdate,
	},
	'users.remove': {
		input: ClickupEndpointInputSchemas.usersRemove,
		output: ClickupEndpointOutputSchemas.usersRemove,
	},
	'guests.get': {
		input: ClickupEndpointInputSchemas.guestsGet,
		output: ClickupEndpointOutputSchemas.guestsGet,
	},
	'guests.invite': {
		input: ClickupEndpointInputSchemas.guestsInvite,
		output: ClickupEndpointOutputSchemas.guestsInvite,
	},
	'guests.update': {
		input: ClickupEndpointInputSchemas.guestsUpdate,
		output: ClickupEndpointOutputSchemas.guestsUpdate,
	},
	'guests.remove': {
		input: ClickupEndpointInputSchemas.guestsRemove,
		output: ClickupEndpointOutputSchemas.guestsRemove,
	},
	'guests.addToTask': {
		input: ClickupEndpointInputSchemas.guestsAddToTask,
		output: ClickupEndpointOutputSchemas.guestsAddToTask,
	},
	'guests.removeFromTask': {
		input: ClickupEndpointInputSchemas.guestsRemoveFromTask,
		output: ClickupEndpointOutputSchemas.guestsRemoveFromTask,
	},
	'guests.addToList': {
		input: ClickupEndpointInputSchemas.guestsAddToList,
		output: ClickupEndpointOutputSchemas.guestsAddToList,
	},
	'guests.removeFromList': {
		input: ClickupEndpointInputSchemas.guestsRemoveFromList,
		output: ClickupEndpointOutputSchemas.guestsRemoveFromList,
	},
	'guests.addToFolder': {
		input: ClickupEndpointInputSchemas.guestsAddToFolder,
		output: ClickupEndpointOutputSchemas.guestsAddToFolder,
	},
	'guests.removeFromFolder': {
		input: ClickupEndpointInputSchemas.guestsRemoveFromFolder,
		output: ClickupEndpointOutputSchemas.guestsRemoveFromFolder,
	},
	'teams.list': {
		input: ClickupEndpointInputSchemas.teamsList,
		output: ClickupEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: ClickupEndpointInputSchemas.teamsCreate,
		output: ClickupEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: ClickupEndpointInputSchemas.teamsUpdate,
		output: ClickupEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: ClickupEndpointInputSchemas.teamsDelete,
		output: ClickupEndpointOutputSchemas.teamsDelete,
	},
	'workspaceAcl.update': {
		input: ClickupEndpointInputSchemas.workspaceAclUpdate,
		output: ClickupEndpointOutputSchemas.workspaceAclUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof clickupEndpointsNested
>;

const clickupWebhookSchemas = {} as const;

const defaultAuthType = 'api_key' as const;

const clickupEndpointMeta = {
	'workspaces.get': {
		riskLevel: 'read',
		description: 'List Workspaces (Teams)',
	},
	'workspaces.authorizedUser': {
		riskLevel: 'read',
		description: 'Get the authorized ClickUp user',
	},
	'workspaces.plan': {
		riskLevel: 'read',
		description: 'Get the Workspace subscription plan',
	},
	'workspaces.seats': {
		riskLevel: 'read',
		description: 'Get Workspace seat utilization',
	},
	'workspaces.sharedHierarchy': {
		riskLevel: 'read',
		description: 'Get hierarchy shared with the authorized user',
	},
	'workspaces.customRoles': {
		riskLevel: 'read',
		description: 'List Workspace custom roles',
	},
	'workspaces.customTaskTypes': {
		riskLevel: 'read',
		description: 'List Workspace custom task types',
	},
	'workspaces.teamFields': {
		riskLevel: 'read',
		description: 'List Workspace-level custom fields',
	},
	'workspaces.everythingViewsGet': {
		riskLevel: 'read',
		description: 'List Everything-level Workspace views',
	},
	'workspaces.everythingViewsCreate': {
		riskLevel: 'write',
		description: 'Create an Everything-level Workspace view',
	},
	'spaces.list': {
		riskLevel: 'read',
		description: 'List Spaces in a Workspace',
	},
	'spaces.get': { riskLevel: 'read', description: 'Get a single Space' },
	'spaces.create': { riskLevel: 'write', description: 'Create a new Space' },
	'spaces.update': {
		riskLevel: 'write',
		description: 'Update an existing Space',
	},
	'spaces.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Space',
	},
	'spaces.availableFields': {
		riskLevel: 'read',
		description: 'List custom fields available in a Space',
	},
	'spaces.tagsGet': {
		riskLevel: 'read',
		description: 'List tags in a Space',
	},
	'spaces.tagsCreate': {
		riskLevel: 'write',
		description: 'Create a tag in a Space',
	},
	'spaces.tagsUpdate': {
		riskLevel: 'write',
		description: 'Update a tag in a Space',
	},
	'spaces.tagsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a tag from a Space',
	},
	'spaces.viewsGet': {
		riskLevel: 'read',
		description: 'List views in a Space',
	},
	'spaces.viewsCreate': {
		riskLevel: 'write',
		description: 'Create a view in a Space',
	},
	'folders.list': { riskLevel: 'read', description: 'List Folders in a Space' },
	'folders.get': { riskLevel: 'read', description: 'Get a single Folder' },
	'folders.create': { riskLevel: 'write', description: 'Create a new Folder' },
	'folders.update': { riskLevel: 'write', description: 'Rename a Folder' },
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Folder',
	},
	'folders.viewsGet': {
		riskLevel: 'read',
		description: 'List views in a Folder',
	},
	'folders.viewsCreate': {
		riskLevel: 'write',
		description: 'Create a view in a Folder',
	},
	'lists.list': { riskLevel: 'read', description: 'List Lists in a Folder' },
	'lists.folderless': {
		riskLevel: 'read',
		description: 'List folderless Lists in a Space',
	},
	'lists.get': { riskLevel: 'read', description: 'Get a single List' },
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a List in a Folder',
	},
	'lists.createFolderless': {
		riskLevel: 'write',
		description: 'Create a folderless List in a Space',
	},
	'lists.createFromTemplate': {
		riskLevel: 'write',
		description: 'Create a List from a template',
	},
	'lists.update': { riskLevel: 'write', description: 'Update a List' },
	'lists.delete': { riskLevel: 'destructive', description: 'Delete a List' },
	'lists.members': { riskLevel: 'read', description: 'List members of a List' },
	'lists.commentsGet': {
		riskLevel: 'read',
		description: 'Get comments on a List',
	},
	'lists.commentsCreate': {
		riskLevel: 'write',
		description: 'Comment on a List',
	},
	'lists.viewsGet': {
		riskLevel: 'read',
		description: 'List views in a List',
	},
	'lists.viewsCreate': {
		riskLevel: 'write',
		description: 'Create a view in a List',
	},
	'tasks.list': { riskLevel: 'read', description: 'List Tasks in a List' },
	'tasks.filteredTeam': {
		riskLevel: 'read',
		description: 'List filtered Tasks across a Workspace',
	},
	'tasks.get': { riskLevel: 'read', description: 'Get a single Task' },
	'tasks.create': { riskLevel: 'write', description: 'Create a new Task' },
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update an existing Task',
	},
	'tasks.delete': { riskLevel: 'destructive', description: 'Delete a Task' },
	'tasks.createFromTemplate': {
		riskLevel: 'write',
		description: 'Create a Task from a template',
	},
	'tasks.moveToHomeList': {
		riskLevel: 'write',
		description: 'Move a Task to a new home List',
	},
	'tasks.members': {
		riskLevel: 'read',
		description: 'List members with explicit Task access',
	},
	'tasks.timeInStatus': {
		riskLevel: 'read',
		description: 'Get time a Task spent in each status',
	},
	'tasks.bulkTimeInStatus': {
		riskLevel: 'read',
		description: 'Get time in status for multiple Tasks',
	},
	'tasks.templates': {
		riskLevel: 'read',
		description: 'List Task templates in a Workspace',
	},
	'tasks.trackedTimeGet': {
		riskLevel: 'read',
		description: 'Get legacy tracked time for a Task',
	},
	'tasks.trackedTimeCreate': {
		riskLevel: 'write',
		description: 'Record legacy tracked time for a Task',
	},
	'tasks.trackedTimeUpdate': {
		riskLevel: 'write',
		description: 'Edit a legacy time-tracked interval',
	},
	'tasks.trackedTimeDelete': {
		riskLevel: 'destructive',
		description: 'Delete a legacy time-tracked interval',
	},
	'tasks.tagsAdd': { riskLevel: 'write', description: 'Add a tag to a Task' },
	'tasks.tagsRemove': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a Task',
	},
	'tasks.attachmentsCreate': {
		riskLevel: 'write',
		description: 'Upload a file attachment to a Task',
	},
	'dependencies.add': {
		riskLevel: 'write',
		description: 'Add a waiting-on/blocking dependency to a Task',
	},
	'dependencies.delete': {
		riskLevel: 'destructive',
		description: 'Remove a dependency from a Task',
	},
	'taskLinks.add': { riskLevel: 'write', description: 'Link two Tasks' },
	'taskLinks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a link between two Tasks',
	},
	'taskLists.add': {
		riskLevel: 'write',
		description: 'Add a Task to an additional List',
	},
	'taskLists.remove': {
		riskLevel: 'destructive',
		description: 'Remove a Task from an additional List',
	},
	'checklists.create': {
		riskLevel: 'write',
		description: 'Create a checklist in a Task',
	},
	'checklists.update': {
		riskLevel: 'write',
		description: 'Update a checklist',
	},
	'checklists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a checklist',
	},
	'checklists.itemsCreate': {
		riskLevel: 'write',
		description: 'Create a checklist item',
	},
	'checklists.itemsUpdate': {
		riskLevel: 'write',
		description: 'Update a checklist item',
	},
	'checklists.itemsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a checklist item',
	},
	'taskComments.get': {
		riskLevel: 'read',
		description: 'Get comments on a Task',
	},
	'taskComments.create': {
		riskLevel: 'write',
		description: 'Comment on a Task',
	},
	'taskComments.update': {
		riskLevel: 'write',
		description: 'Update a Task comment',
	},
	'taskComments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Task comment',
	},
	'taskComments.threadedCreate': {
		riskLevel: 'write',
		description: 'Reply to a comment in a thread',
	},
	'taskComments.threadedGet': {
		riskLevel: 'read',
		description: 'Get threaded replies to a comment',
	},
	'customFields.accessible': {
		riskLevel: 'read',
		description: 'List accessible custom fields for a List',
	},
	'customFields.folderFields': {
		riskLevel: 'read',
		description: 'List custom fields available in a Folder',
	},
	'customFields.setValue': {
		riskLevel: 'write',
		description: 'Set a custom field value on a Task',
	},
	'customFields.removeValue': {
		riskLevel: 'destructive',
		description: 'Remove a custom field value from a Task',
	},
	'views.get': { riskLevel: 'read', description: 'Get a single View' },
	'views.update': { riskLevel: 'write', description: 'Update a View' },
	'views.delete': { riskLevel: 'destructive', description: 'Delete a View' },
	'views.tasks': {
		riskLevel: 'read',
		description: 'List Tasks visible in a View',
	},
	'views.chatCommentsGet': {
		riskLevel: 'read',
		description: 'Get comments on a Chat view',
	},
	'views.chatCommentsCreate': {
		riskLevel: 'write',
		description: 'Comment on a Chat view',
	},
	'goals.list': { riskLevel: 'read', description: 'List Goals in a Workspace' },
	'goals.get': { riskLevel: 'read', description: 'Get a single Goal' },
	'goals.create': { riskLevel: 'write', description: 'Create a new Goal' },
	'goals.update': { riskLevel: 'write', description: 'Update a Goal' },
	'goals.delete': { riskLevel: 'destructive', description: 'Delete a Goal' },
	'goals.keyResultsCreate': {
		riskLevel: 'write',
		description: 'Create a key result for a Goal',
	},
	'goals.keyResultsUpdate': {
		riskLevel: 'write',
		description: 'Update a key result',
	},
	'goals.keyResultsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a key result',
	},
	'timeEntries.range': {
		riskLevel: 'read',
		description: 'List time entries in a date range',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a single time entry',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Create a time entry',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a time entry',
	},
	'timeEntries.running': {
		riskLevel: 'read',
		description: 'Get the running time entry',
	},
	'timeEntries.start': {
		riskLevel: 'write',
		description: 'Start a time entry timer',
	},
	'timeEntries.stop': {
		riskLevel: 'write',
		description: 'Stop the running time entry',
	},
	'timeEntries.history': {
		riskLevel: 'read',
		description: 'Get time entry change history',
	},
	'timeEntries.tagsGetAll': {
		riskLevel: 'read',
		description: 'List all time entry tags in a Workspace',
	},
	'timeEntries.tagsAdd': {
		riskLevel: 'write',
		description: 'Add tags to time entries',
	},
	'timeEntries.tagsRemove': {
		riskLevel: 'destructive',
		description: 'Remove tags from time entries',
	},
	'timeEntries.tagsUpdate': {
		riskLevel: 'write',
		description: 'Rename a time entry tag',
	},
	'docs.search': {
		riskLevel: 'read',
		description: 'Search Docs in a Workspace',
	},
	'docs.create': { riskLevel: 'write', description: 'Create a new Doc' },
	'docs.content': {
		riskLevel: 'read',
		description: 'Get full Doc content',
	},
	'docs.pages': { riskLevel: 'read', description: 'List pages in a Doc' },
	'docs.pageListing': {
		riskLevel: 'read',
		description: 'Get the page listing structure of a Doc',
	},
	'docs.pageContent': {
		riskLevel: 'read',
		description: 'Get a single Doc page',
	},
	'docs.createPage': {
		riskLevel: 'write',
		description: 'Create a page in a Doc',
	},
	'docs.updatePage': {
		riskLevel: 'write',
		description: 'Update a Doc page',
	},
	'chat.channelsList': {
		riskLevel: 'read',
		description: 'List chat channels in a Workspace',
	},
	'chat.channelsGet': {
		riskLevel: 'read',
		description: 'Get a single chat channel',
	},
	'chat.channelsCreate': {
		riskLevel: 'write',
		description: 'Create a chat channel',
	},
	'chat.channelsCreateLocation': {
		riskLevel: 'write',
		description: 'Create a location chat channel',
	},
	'chat.channelsCreateDm': {
		riskLevel: 'write',
		description: 'Create a direct message channel',
	},
	'chat.channelsUpdate': {
		riskLevel: 'write',
		description: 'Update a chat channel',
	},
	'chat.channelsDelete': {
		riskLevel: 'destructive',
		description: 'Delete a chat channel',
	},
	'chat.channelsMembers': {
		riskLevel: 'read',
		description: 'List members of a chat channel',
	},
	'chat.channelsFollowers': {
		riskLevel: 'read',
		description: 'List followers of a chat channel',
	},
	'chat.messagesList': {
		riskLevel: 'read',
		description: 'List messages in a chat channel',
	},
	'chat.messagesCreate': {
		riskLevel: 'write',
		description: 'Send a chat message',
	},
	'chat.messagesUpdate': {
		riskLevel: 'write',
		description: 'Update a chat message',
	},
	'chat.messagesDelete': {
		riskLevel: 'destructive',
		description: 'Delete a chat message',
	},
	'chat.repliesGet': {
		riskLevel: 'read',
		description: 'List replies to a chat message',
	},
	'chat.repliesCreate': {
		riskLevel: 'write',
		description: 'Reply to a chat message',
	},
	'chat.reactionsGet': {
		riskLevel: 'read',
		description: 'List reactions on a chat message',
	},
	'chat.reactionsCreate': {
		riskLevel: 'write',
		description: 'React to a chat message',
	},
	'chat.reactionsDelete': {
		riskLevel: 'destructive',
		description: 'Remove a reaction from a chat message',
	},
	'chat.taggedUsers': {
		riskLevel: 'read',
		description: 'List users tagged in a chat message',
	},
	'chat.subtypes': {
		riskLevel: 'read',
		description: 'List post subtype IDs for a Workspace',
	},
	'users.get': { riskLevel: 'read', description: 'Get a Workspace user' },
	'users.invite': {
		riskLevel: 'write',
		description: 'Invite a user to a Workspace',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a Workspace user',
	},
	'users.remove': {
		riskLevel: 'destructive',
		description: 'Remove a user from a Workspace',
	},
	'guests.get': { riskLevel: 'read', description: 'Get a Workspace guest' },
	'guests.invite': {
		riskLevel: 'write',
		description: 'Invite a guest to a Workspace',
	},
	'guests.update': {
		riskLevel: 'write',
		description: 'Update a Workspace guest',
	},
	'guests.remove': {
		riskLevel: 'destructive',
		description: 'Remove a guest from a Workspace',
	},
	'guests.addToTask': {
		riskLevel: 'write',
		description: 'Share a Task with a guest',
	},
	'guests.removeFromTask': {
		riskLevel: 'destructive',
		description: 'Remove a guest from a Task',
	},
	'guests.addToList': {
		riskLevel: 'write',
		description: 'Share a List with a guest',
	},
	'guests.removeFromList': {
		riskLevel: 'destructive',
		description: 'Remove a guest from a List',
	},
	'guests.addToFolder': {
		riskLevel: 'write',
		description: 'Share a Folder with a guest',
	},
	'guests.removeFromFolder': {
		riskLevel: 'destructive',
		description: 'Remove a guest from a Folder',
	},
	'teams.list': { riskLevel: 'read', description: 'List user groups' },
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a user group',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Update a user group',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a user group',
	},
	'workspaceAcl.update': {
		riskLevel: 'write',
		description: 'Update privacy and access for a Workspace object',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof clickupEndpointsNested>;

export const clickupAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClickupPlugin<T extends ClickupPluginOptions> = CorsairPlugin<
	'clickup',
	typeof ClickupSchema,
	typeof clickupEndpointsNested,
	typeof clickupWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalClickupPlugin = BaseClickupPlugin<ClickupPluginOptions>;

export type ExternalClickupPlugin<T extends ClickupPluginOptions> =
	BaseClickupPlugin<T>;

export function clickup<const T extends ClickupPluginOptions>(
	// Single `as` for the empty-options default: identical to the
	// `pnpm generate:plugin` scaffold (and every shipped plugin); it only
	// types the default value, never user input.
	incomingOptions: ClickupPluginOptions & T = {} as ClickupPluginOptions & T,
): ExternalClickupPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clickup',
		authConfig: clickupAuthConfig,
		schema: ClickupSchema,
		options: options,
		hooks: options.hooks,
		endpoints: clickupEndpointsNested,
		webhooks: clickupWebhooksNested,
		endpointMeta: clickupEndpointMeta,
		endpointSchemas: clickupEndpointSchemas,
		webhookSchemas: clickupWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClickupKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key !== undefined) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalClickupPlugin;
}

export type {
	ClickupEndpointInputs,
	ClickupEndpointOutputs,
} from './endpoints/types';
export {
	ClickupEndpointInputSchemas,
	ClickupEndpointOutputSchemas,
} from './endpoints/types';
