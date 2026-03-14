import {
	list as boardsList,
	get as boardsGet,
	create as boardsCreate,
	update as boardsUpdate,
	archive as boardsArchive,
	deleteboard as boardsDelete,
	duplicate as boardsDuplicate,
} from './boards';
import {
	list as itemsList,
	get as itemsGet,
	create as itemsCreate,
	update as itemsUpdate,
	move as itemsMove,
	archive as itemsArchive,
	deleteitem as itemsDelete,
} from './items';
import {
	list as groupsList,
	create as groupsCreate,
	update as groupsUpdate,
	deletegroup as groupsDelete,
} from './groups';
import {
	list as columnsList,
	create as columnsCreate,
	changeValue as columnsChangeValue,
} from './columns';
import {
	list as updatesList,
	create as updatesCreate,
	deleteupdate as updatesDelete,
} from './updates';
import { list as usersList, get as usersGet } from './users';
import { list as workspacesList } from './workspaces';

export const Boards = {
	list: boardsList,
	get: boardsGet,
	create: boardsCreate,
	update: boardsUpdate,
	archive: boardsArchive,
	delete: boardsDelete,
	duplicate: boardsDuplicate,
};

export const Items = {
	list: itemsList,
	get: itemsGet,
	create: itemsCreate,
	update: itemsUpdate,
	move: itemsMove,
	archive: itemsArchive,
	delete: itemsDelete,
};

export const Groups = {
	list: groupsList,
	create: groupsCreate,
	update: groupsUpdate,
	delete: groupsDelete,
};

export const Columns = {
	list: columnsList,
	create: columnsCreate,
	changeValue: columnsChangeValue,
};

export const Updates = {
	list: updatesList,
	create: updatesCreate,
	delete: updatesDelete,
};

export const Users = {
	list: usersList,
	get: usersGet,
};

export const Workspaces = {
	list: workspacesList,
};

export * from './types';
