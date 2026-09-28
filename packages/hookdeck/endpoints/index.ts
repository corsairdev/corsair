import {
	connectionsCreate,
	connectionsDelete,
	connectionsGet,
	connectionsList,
	connectionsUpdate,
} from './connections';

export const Connections = {
	list: connectionsList,
	create: connectionsCreate,
	get: connectionsGet,
	update: connectionsUpdate,
	delete: connectionsDelete,
};

export * from './types';
