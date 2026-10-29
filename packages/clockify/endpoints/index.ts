import { list as projectsList } from './projects';
import { list as tasksList } from './tasks';
import {
	create as timeEntriesCreate,
	list as timeEntriesList,
} from './time-entries';
import { list as workspacesList } from './workspaces';

export const Workspaces = {
	list: workspacesList,
};

export const Projects = {
	list: projectsList,
};

export const Tasks = {
	list: tasksList,
};

export const TimeEntries = {
	create: timeEntriesCreate,
	list: timeEntriesList,
};

export * from './types';
