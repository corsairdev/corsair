import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createDatabaseClusterRoute = getRoute('createDatabaseCluster');
export const createDatabaseCluster: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createDatabaseClusterRoute);
};

const deleteDatabaseClusterRoute = getRoute('deleteDatabaseCluster');
export const deleteDatabaseCluster: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, deleteDatabaseClusterRoute);
};

const listAllDatabasesRoute = getRoute('listAllDatabases');
export const listAllDatabases: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listAllDatabasesRoute);
};

const listDatabaseOptionsRoute = getRoute('listDatabaseOptions');
export const listDatabaseOptions: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listDatabaseOptionsRoute);
};

export const DatabasesEndpoints = {
	createDatabaseCluster,
	deleteDatabaseCluster,
	listAllDatabases,
	listDatabaseOptions,
} as const;
