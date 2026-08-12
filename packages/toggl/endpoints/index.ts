import {
	create as clientsCreate,
	get as clientsGet,
	list as clientsList,
	remove as clientsRemove,
	update as clientsUpdate,
} from './clients';
import {
	get as meGet,
	getPreferences as meGetPreferences,
	update as meUpdate,
	updatePreferences as meUpdatePreferences,
} from './me';
import {
	get as organizationsGet,
	getWorkspaces as organizationsGetWorkspaces,
	update as organizationsUpdate,
} from './organizations';
import {
	create as projectsCreate,
	get as projectsGet,
	list as projectsList,
	remove as projectsRemove,
	update as projectsUpdate,
} from './projects';
import {
	create as tagsCreate,
	list as tagsList,
	remove as tagsRemove,
	update as tagsUpdate,
} from './tags';
import {
	create as tasksCreate,
	get as tasksGet,
	list as tasksList,
	remove as tasksRemove,
	update as tasksUpdate,
} from './tasks';
import {
	create as timeEntriesCreate,
	get as timeEntriesGet,
	getCurrent as timeEntriesGetCurrent,
	list as timeEntriesList,
	remove as timeEntriesRemove,
	stop as timeEntriesStop,
	update as timeEntriesUpdate,
} from './time-entries';
import {
	get as workspacesGet,
	getUsers as workspacesGetUsers,
	list as workspacesList,
	update as workspacesUpdate,
} from './workspaces';

export const Me = {
	get: meGet,
	update: meUpdate,
	getPreferences: meGetPreferences,
	updatePreferences: meUpdatePreferences,
};

export const Workspaces = {
	list: workspacesList,
	get: workspacesGet,
	update: workspacesUpdate,
	getUsers: workspacesGetUsers,
};

export const Organizations = {
	get: organizationsGet,
	update: organizationsUpdate,
	getWorkspaces: organizationsGetWorkspaces,
};

export const Clients = {
	list: clientsList,
	get: clientsGet,
	create: clientsCreate,
	update: clientsUpdate,
	delete: clientsRemove,
};

export const Projects = {
	list: projectsList,
	get: projectsGet,
	create: projectsCreate,
	update: projectsUpdate,
	delete: projectsRemove,
};

export const Tasks = {
	list: tasksList,
	get: tasksGet,
	create: tasksCreate,
	update: tasksUpdate,
	delete: tasksRemove,
};

export const Tags = {
	list: tagsList,
	create: tagsCreate,
	update: tagsUpdate,
	delete: tagsRemove,
};

export const TimeEntries = {
	list: timeEntriesList,
	getCurrent: timeEntriesGetCurrent,
	get: timeEntriesGet,
	create: timeEntriesCreate,
	update: timeEntriesUpdate,
	stop: timeEntriesStop,
	delete: timeEntriesRemove,
};

export * from './types';
