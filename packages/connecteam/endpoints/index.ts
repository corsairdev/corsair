import { archiveUsers } from './archive-users';
import { createUsers } from './create-users';
import { getUserById } from './get-user-by-id';
import { updateUsers } from './update-users';
import { getUsers } from './users';

export const Users = {
	get: getUsers,
	getById: getUserById,
	archive: archiveUsers,
	create: createUsers,
	update: updateUsers,
};

export * from './types';
