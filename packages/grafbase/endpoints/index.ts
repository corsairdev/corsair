import * as accessTokens from './access-tokens';
import * as deployments from './deployments';
import * as graphs from './graphs';
import * as schemaVersions from './schema-versions';
import * as subgraphs from './subgraphs';
import * as viewer from './viewer';

export const Viewer = {
	get: viewer.get,
};

export const Graphs = {
	list: graphs.list,
	get: graphs.get,
	create: graphs.create,
	delete: graphs.remove,
};

export const Subgraphs = {
	get: subgraphs.get,
	publish: subgraphs.publish,
	delete: subgraphs.remove,
};

export const SchemaVersions = {
	list: schemaVersions.list,
};

export const Deployments = {
	get: deployments.get,
};

export const AccessTokens = {
	list: accessTokens.list,
	create: accessTokens.create,
	delete: accessTokens.remove,
};

export * from './types';
