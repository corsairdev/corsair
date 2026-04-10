import {
	archive as boardsArchive,
	create as boardsCreate,
	deleteboard as boardsDelete,
	duplicate as boardsDuplicate,
	get as boardsGet,
	list as boardsList,
	update as boardsUpdate,
} from './boards';
import {
	changeValue as columnsChangeValue,
	create as columnsCreate,
	list as columnsList,
} from './columns';
import {
	create as groupsCreate,
	deletegroup as groupsDelete,
	list as groupsList,
	update as groupsUpdate,
} from './groups';
import {
	archive as itemsArchive,
	create as itemsCreate,
	deleteitem as itemsDelete,
	get as itemsGet,
	list as itemsList,
	move as itemsMove,
	update as itemsUpdate,
} from './items';
import {
	create as updatesCreate,
	deleteupdate as updatesDelete,
	list as updatesList,
} from './updates';
import { get as usersGet, list as usersList } from './users';
import {
	create as webhooksCreate,
	deletewebhook as webhooksDelete,
	list as webhooksList,
} from './webhooks';
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

export const Webhooks = {
	list: webhooksList,
	create: webhooksCreate,
	delete: webhooksDelete,
};

export * from './types';
