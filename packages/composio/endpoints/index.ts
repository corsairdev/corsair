import * as actions from './actions';
import * as apps from './apps';
import * as connections from './connections';
import * as tools from './tools';

export const ToolsEndpoints = {
	list: tools.list,
	get: tools.get,
};

export const ActionsEndpoints = {
	list: actions.list,
	get: actions.get,
	execute: actions.execute,
};

export const ConnectionsEndpoints = {
	list: connections.list,
	create: connections.create,
	delete: connections.deleteConnection,
};

export const AppsEndpoints = {
	list: apps.list,
};

export * from './types';
