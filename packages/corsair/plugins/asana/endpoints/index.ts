import {
	get as tasksGet,
	list as tasksList,
	create as tasksCreate,
	update as tasksUpdate,
	deleteTask,
	duplicate as tasksDuplicate,
	search as tasksSearch,
	addFollowers as tasksAddFollowers,
	removeFollower as tasksRemoveFollower,
	addProject as tasksAddProject,
	removeProject as tasksRemoveProject,
	addTag as tasksAddTag,
	removeTag as tasksRemoveTag,
	addDependencies as tasksAddDependencies,
	createSubtask as tasksCreateSubtask,
	getSubtasks as tasksGetSubtasks,
	setParent as tasksSetParent,
	getStories as tasksGetStories,
	getAttachments as tasksGetAttachments,
	getTags as tasksGetTags,
	addToSection as tasksAddToSection,
} from './tasks';
import {
	get as projectsGet,
	list as projectsList,
	create as projectsCreate,
	createForTeam as projectsCreateForTeam,
	createForWorkspace as projectsCreateForWorkspace,
	update as projectsUpdate,
	deleteProject,
	duplicate as projectsDuplicate,
	addFollowers as projectsAddFollowers,
	removeFollowers as projectsRemoveFollowers,
	addMembers as projectsAddMembers,
	removeMembers as projectsRemoveMembers,
	getTasks as projectsGetTasks,
	getTaskCounts as projectsGetTaskCounts,
	listForWorkspace as workspaceProjectsList,
} from './projects';
import {
	get as sectionsGet,
	list as sectionsList,
	create as sectionsCreate,
	update as sectionsUpdate,
	deleteSection,
	insert as sectionsInsert,
} from './sections';
import {
	get as usersGet,
	list as usersList,
	getCurrent as usersGetCurrent,
	listForWorkspace as usersListForWorkspace,
	listForTeam as usersListForTeam,
	getTaskList as usersGetTaskList,
	getUserTaskList as usersGetUserTaskList,
	getFavorites as usersGetFavorites,
} from './users';
import {
	get as teamsGet,
	listForUser as teamsListForUser,
	listForWorkspace as teamsListForWorkspace,
	create as teamsCreate,
	update as teamsUpdate,
	addUser as teamsAddUser,
	removeUser as teamsRemoveUser,
	membershipsList as teamMembershipsList,
	membershipsGet as teamMembershipsGet,
	membershipsListForTeam as teamMembershipsListForTeam,
	membershipsListForUser as teamMembershipsListForUser,
} from './teams';
import {
	get as tagsGet,
	list as tagsList,
	listForWorkspace as tagsListForWorkspace,
	listForTask as tagsListForTask,
	create as tagsCreate,
	createInWorkspace as tagsCreateInWorkspace,
	update as tagsUpdate,
	deleteTag,
	getTasks as tagsGetTasks,
} from './tags';
import {
	get as storiesGet,
	listForTask as storiesListForTask,
	createComment as storiesCreateComment,
	update as storiesUpdate,
	deleteStory,
} from './stories';
import {
	create as webhooksCreate,
	deleteWebhook,
	getList as webhooksGetList,
	update as webhooksUpdate,
} from './webhooks-management';
import {
	get as workspacesGet,
	list as workspacesList,
	membershipsGet as workspaceMembershipsGet,
	membershipsList as workspaceMembershipsList,
	membershipsListForUser as workspaceMembershipsListForUser,
} from './workspaces';

export const Tasks = {
	get: tasksGet,
	list: tasksList,
	create: tasksCreate,
	update: tasksUpdate,
	delete: deleteTask,
	duplicate: tasksDuplicate,
	search: tasksSearch,
	addFollowers: tasksAddFollowers,
	removeFollower: tasksRemoveFollower,
	addProject: tasksAddProject,
	removeProject: tasksRemoveProject,
	addTag: tasksAddTag,
	removeTag: tasksRemoveTag,
	addDependencies: tasksAddDependencies,
	createSubtask: tasksCreateSubtask,
	getSubtasks: tasksGetSubtasks,
	setParent: tasksSetParent,
	getStories: tasksGetStories,
	getAttachments: tasksGetAttachments,
	getTags: tasksGetTags,
	addToSection: tasksAddToSection,
};

export const Projects = {
	get: projectsGet,
	list: projectsList,
	create: projectsCreate,
	createForTeam: projectsCreateForTeam,
	createForWorkspace: projectsCreateForWorkspace,
	update: projectsUpdate,
	delete: deleteProject,
	duplicate: projectsDuplicate,
	addFollowers: projectsAddFollowers,
	removeFollowers: projectsRemoveFollowers,
	addMembers: projectsAddMembers,
	removeMembers: projectsRemoveMembers,
	getTasks: projectsGetTasks,
	getTaskCounts: projectsGetTaskCounts,
	listForWorkspace: workspaceProjectsList,
};

export const Sections = {
	get: sectionsGet,
	list: sectionsList,
	create: sectionsCreate,
	update: sectionsUpdate,
	delete: deleteSection,
	insert: sectionsInsert,
};

export const Users = {
	get: usersGet,
	list: usersList,
	getCurrent: usersGetCurrent,
	listForWorkspace: usersListForWorkspace,
	listForTeam: usersListForTeam,
	getTaskList: usersGetTaskList,
	getUserTaskList: usersGetUserTaskList,
	getFavorites: usersGetFavorites,
};

export const Teams = {
	get: teamsGet,
	listForUser: teamsListForUser,
	listForWorkspace: teamsListForWorkspace,
	create: teamsCreate,
	update: teamsUpdate,
	addUser: teamsAddUser,
	removeUser: teamsRemoveUser,
	membershipsList: teamMembershipsList,
	membershipsGet: teamMembershipsGet,
	membershipsListForTeam: teamMembershipsListForTeam,
	membershipsListForUser: teamMembershipsListForUser,
};

export const Tags = {
	get: tagsGet,
	list: tagsList,
	listForWorkspace: tagsListForWorkspace,
	listForTask: tagsListForTask,
	create: tagsCreate,
	createInWorkspace: tagsCreateInWorkspace,
	update: tagsUpdate,
	delete: deleteTag,
	getTasks: tagsGetTasks,
};

export const Stories = {
	get: storiesGet,
	listForTask: storiesListForTask,
	createComment: storiesCreateComment,
	update: storiesUpdate,
	delete: deleteStory,
};

export const WebhookManagement = {
	create: webhooksCreate,
	delete: deleteWebhook,
	getList: webhooksGetList,
	update: webhooksUpdate,
};

export const Workspaces = {
	get: workspacesGet,
	list: workspacesList,
	membershipsGet: workspaceMembershipsGet,
	membershipsList: workspaceMembershipsList,
	membershipsListForUser: workspaceMembershipsListForUser,
};

export * from './types';
