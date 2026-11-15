import * as Chat from './chat';
import * as Checklists from './checklists';
import * as CustomFields from './custom-fields';
import * as Dependencies from './dependencies';
import * as Docs from './docs';
import * as Folders from './folders';
import * as Goals from './goals';
import * as Guests from './guests';
import * as Lists from './lists';
import * as Spaces from './spaces';
import * as TaskComments from './task-comments';
import * as TaskLinks from './task-links';
import * as TaskLists from './task-lists';
import * as Tasks from './tasks';
import * as Teams from './teams';
import * as TimeEntries from './time-entries';
import * as Users from './users';
import * as Views from './views';
import * as WorkspaceAcl from './workspace-acl';
import * as Workspaces from './workspaces';

export const WorkspacesEndpoints = {
	get: Workspaces.get,
	authorizedUser: Workspaces.authorizedUser,
	plan: Workspaces.plan,
	seats: Workspaces.seats,
	sharedHierarchy: Workspaces.sharedHierarchy,
	customRoles: Workspaces.customRoles,
	customTaskTypes: Workspaces.customTaskTypes,
	teamFields: Workspaces.teamFields,
	everythingViewsGet: Workspaces.everythingViewsGet,
	everythingViewsCreate: Workspaces.everythingViewsCreate,
};

export const SpacesEndpoints = {
	list: Spaces.list,
	get: Spaces.get,
	create: Spaces.create,
	update: Spaces.update,
	delete: Spaces.deleteFn,
	availableFields: Spaces.availableFields,
	tagsGet: Spaces.tagsGet,
	tagsCreate: Spaces.tagsCreate,
	tagsUpdate: Spaces.tagsUpdate,
	tagsDelete: Spaces.tagsDelete,
	viewsGet: Spaces.viewsGet,
	viewsCreate: Spaces.viewsCreate,
};

export const FoldersEndpoints = {
	list: Folders.list,
	get: Folders.get,
	create: Folders.create,
	update: Folders.update,
	delete: Folders.deleteFn,
	viewsGet: Folders.viewsGet,
	viewsCreate: Folders.viewsCreate,
};

export const ListsEndpoints = {
	list: Lists.list,
	folderless: Lists.folderless,
	get: Lists.get,
	create: Lists.create,
	createFolderless: Lists.createFolderless,
	createFromTemplate: Lists.createFromTemplate,
	update: Lists.update,
	delete: Lists.deleteFn,
	members: Lists.members,
	commentsGet: Lists.commentsGet,
	commentsCreate: Lists.commentsCreate,
	viewsGet: Lists.viewsGet,
	viewsCreate: Lists.viewsCreate,
};

export const TasksEndpoints = {
	list: Tasks.list,
	filteredTeam: Tasks.filteredTeam,
	get: Tasks.get,
	create: Tasks.create,
	update: Tasks.update,
	delete: Tasks.deleteFn,
	createFromTemplate: Tasks.createFromTemplate,
	moveToHomeList: Tasks.moveToHomeList,
	members: Tasks.members,
	timeInStatus: Tasks.timeInStatus,
	bulkTimeInStatus: Tasks.bulkTimeInStatus,
	templates: Tasks.templates,
	trackedTimeGet: Tasks.trackedTimeGet,
	trackedTimeCreate: Tasks.trackedTimeCreate,
	trackedTimeUpdate: Tasks.trackedTimeUpdate,
	trackedTimeDelete: Tasks.trackedTimeDelete,
	tagsAdd: Tasks.tagsAdd,
	tagsRemove: Tasks.tagsRemove,
	attachmentsCreate: Tasks.attachmentsCreate,
};

export const DependenciesEndpoints = {
	add: Dependencies.add,
	delete: Dependencies.deleteFn,
};

export const TaskLinksEndpoints = {
	add: TaskLinks.add,
	delete: TaskLinks.deleteFn,
};

export const TaskListsEndpoints = {
	add: TaskLists.add,
	remove: TaskLists.remove,
};

export const ChecklistsEndpoints = {
	create: Checklists.create,
	update: Checklists.update,
	delete: Checklists.deleteFn,
	itemsCreate: Checklists.itemsCreate,
	itemsUpdate: Checklists.itemsUpdate,
	itemsDelete: Checklists.itemsDelete,
};

export const TaskCommentsEndpoints = {
	get: TaskComments.get,
	create: TaskComments.create,
	update: TaskComments.update,
	delete: TaskComments.deleteFn,
	threadedCreate: TaskComments.threadedCreate,
	threadedGet: TaskComments.threadedGet,
};

export const CustomFieldsEndpoints = {
	accessible: CustomFields.accessible,
	folderFields: CustomFields.folderFields,
	setValue: CustomFields.setValue,
	removeValue: CustomFields.removeValue,
};

export const ViewsEndpoints = {
	get: Views.get,
	update: Views.update,
	delete: Views.deleteFn,
	tasks: Views.tasks,
	chatCommentsGet: Views.chatCommentsGet,
	chatCommentsCreate: Views.chatCommentsCreate,
};

export const GoalsEndpoints = {
	list: Goals.list,
	get: Goals.get,
	create: Goals.create,
	update: Goals.update,
	delete: Goals.deleteFn,
	keyResultsCreate: Goals.keyResultsCreate,
	keyResultsUpdate: Goals.keyResultsUpdate,
	keyResultsDelete: Goals.keyResultsDelete,
};

export const TimeEntriesEndpoints = {
	range: TimeEntries.range,
	get: TimeEntries.get,
	create: TimeEntries.create,
	update: TimeEntries.update,
	delete: TimeEntries.deleteFn,
	running: TimeEntries.running,
	start: TimeEntries.start,
	stop: TimeEntries.stop,
	history: TimeEntries.history,
	tagsGetAll: TimeEntries.tagsGetAll,
	tagsAdd: TimeEntries.tagsAdd,
	tagsRemove: TimeEntries.tagsRemove,
	tagsUpdate: TimeEntries.tagsUpdate,
};

export const DocsEndpoints = {
	search: Docs.search,
	create: Docs.create,
	content: Docs.content,
	pages: Docs.pages,
	pageListing: Docs.pageListing,
	pageContent: Docs.pageContent,
	createPage: Docs.createPage,
	updatePage: Docs.updatePage,
};

export const ChatEndpoints = {
	channelsList: Chat.channelsList,
	channelsGet: Chat.channelsGet,
	channelsCreate: Chat.channelsCreate,
	channelsCreateLocation: Chat.channelsCreateLocation,
	channelsCreateDm: Chat.channelsCreateDm,
	channelsUpdate: Chat.channelsUpdate,
	channelsDelete: Chat.channelsDelete,
	channelsMembers: Chat.channelsMembers,
	channelsFollowers: Chat.channelsFollowers,
	messagesList: Chat.messagesList,
	messagesCreate: Chat.messagesCreate,
	messagesUpdate: Chat.messagesUpdate,
	messagesDelete: Chat.messagesDelete,
	repliesGet: Chat.repliesGet,
	repliesCreate: Chat.repliesCreate,
	reactionsGet: Chat.reactionsGet,
	reactionsCreate: Chat.reactionsCreate,
	reactionsDelete: Chat.reactionsDelete,
	taggedUsers: Chat.taggedUsers,
	subtypes: Chat.subtypes,
};

export const UsersEndpoints = {
	get: Users.get,
	invite: Users.invite,
	update: Users.update,
	remove: Users.remove,
};

export const GuestsEndpoints = {
	get: Guests.get,
	invite: Guests.invite,
	update: Guests.update,
	remove: Guests.remove,
	addToTask: Guests.addToTask,
	removeFromTask: Guests.removeFromTask,
	addToList: Guests.addToList,
	removeFromList: Guests.removeFromList,
	addToFolder: Guests.addToFolder,
	removeFromFolder: Guests.removeFromFolder,
};

export const TeamsEndpoints = {
	list: Teams.list,
	create: Teams.create,
	update: Teams.update,
	delete: Teams.deleteFn,
};

export const WorkspaceAclEndpoints = {
	update: WorkspaceAcl.update,
};

export type { ClickupRequestContext } from './context';
export * from './types';
