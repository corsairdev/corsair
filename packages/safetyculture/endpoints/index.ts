import { list as inspectionsList, get as inspectionsGet } from './inspections';
import { list as templatesList } from './templates';
import { list as actionsList } from './actions';
import { list as usersList } from './users';

export const Inspections = {
	list: inspectionsList,
	get: inspectionsGet,
};

export const Templates = {
	list: templatesList,
};

export const Actions = {
	list: actionsList,
};

export const Users = {
	list: usersList,
};

export * from './types';
