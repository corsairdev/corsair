import * as Folders from './folders';
import * as Lists from './lists';
import * as Spaces from './spaces';
import * as Tasks from './tasks';
import * as Workspaces from './workspaces';

export const WorkspacesEndpoints = {
	get: Workspaces.get,
};

export const SpacesEndpoints = {
	list: Spaces.list,
};

export const FoldersEndpoints = {
	list: Folders.list,
};

export const ListsEndpoints = {
	list: Lists.list,
};

export const TasksEndpoints = {
	list: Tasks.list,
	get: Tasks.get,
	create: Tasks.create,
	update: Tasks.update,
	delete: Tasks.deleteFn,
};

export * from './types';
