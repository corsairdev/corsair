import {
	deleteProject,
	addFollowers as projectsAddFollowers,
	addMembers as projectsAddMembers,
	create as projectsCreate,
	createForTeam as projectsCreateForTeam,
	createForWorkspace as projectsCreateForWorkspace,
	duplicate as projectsDuplicate,
	get as projectsGet,
	getTaskCounts as projectsGetTaskCounts,
	getTasks as projectsGetTasks,
	list as projectsList,
	removeFollowers as projectsRemoveFollowers,
	removeMembers as projectsRemoveMembers,
	update as projectsUpdate,
	listForWorkspace as workspaceProjectsList,
} from './projects';
import {
	deleteSection,
	create as sectionsCreate,
	get as sectionsGet,
	insert as sectionsInsert,
	list as sectionsList,
	update as sectionsUpdate,
} from './sections';
import {
	deleteStory,
	createComment as storiesCreateComment,
	get as storiesGet,
	listForTask as storiesListForTask,
	update as storiesUpdate,
} from './stories';
import {
	deleteTag,
	create as tagsCreate,
	createInWorkspace as tagsCreateInWorkspace,
	get as tagsGet,
	getTasks as tagsGetTasks,
	list as tagsList,
	listForTask as tagsListForTask,
	listForWorkspace as tagsListForWorkspace,
	update as tagsUpdate,
} from './tags';
import {
	deleteTask,
	addDependencies as tasksAddDependencies,
	addFollowers as tasksAddFollowers,
	addProject as tasksAddProject,
	addTag as tasksAddTag,
	addToSection as tasksAddToSection,
	create as tasksCreate,
	createSubtask as tasksCreateSubtask,
	duplicate as tasksDuplicate,
	get as tasksGet,
	getAttachments as tasksGetAttachments,
	getStories as tasksGetStories,
	getSubtasks as tasksGetSubtasks,
	getTags as tasksGetTags,
	list as tasksList,
	removeFollower as tasksRemoveFollower,
	removeProject as tasksRemoveProject,
	removeTag as tasksRemoveTag,
	search as tasksSearch,
	setParent as tasksSetParent,
	update as tasksUpdate,
} from './tasks';
import {
	membershipsGet as teamMembershipsGet,
	membershipsList as teamMembershipsList,
	membershipsListForTeam as teamMembershipsListForTeam,
	membershipsListForUser as teamMembershipsListForUser,
	addUser as teamsAddUser,
	create as teamsCreate,
	get as teamsGet,
	listForUser as teamsListForUser,
	listForWorkspace as teamsListForWorkspace,
	removeUser as teamsRemoveUser,
	update as teamsUpdate,
} from './teams';
import {
	get as usersGet,
	getCurrent as usersGetCurrent,
	getFavorites as usersGetFavorites,
	getTaskList as usersGetTaskList,
	getUserTaskList as usersGetUserTaskList,
	list as usersList,
	listForTeam as usersListForTeam,
	listForWorkspace as usersListForWorkspace,
} from './users';
import {
	deleteWebhook,
	create as webhooksCreate,
	getList as webhooksGetList,
	update as webhooksUpdate,
} from './webhooks-management';
import {
	membershipsGet as workspaceMembershipsGet,
	membershipsList as workspaceMembershipsList,
	membershipsListForUser as workspaceMembershipsListForUser,
	get as workspacesGet,
	list as workspacesList,
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
