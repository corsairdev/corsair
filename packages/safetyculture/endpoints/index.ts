import { list as actionsList } from './actions';
import { get as inspectionsGet, list as inspectionsList } from './inspections';
import { list as templatesList } from './templates';
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
