import { getOrganisation } from './organisation';
import { getRole, listRoles } from './roles';
import { listSavedSegments } from './users';

export const Organisation = {
	get: getOrganisation,
};

export const Roles = {
	get: getRole,
	list: listRoles,
};

export const Users = {
	listSavedSegments,
};

export * from './types';
