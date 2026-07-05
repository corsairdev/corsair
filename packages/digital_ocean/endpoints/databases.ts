import { digitalOceanRoutes } from './routes';
import type { DigitalOceanEndpoint } from './factory';
import { logDigitalOceanOperation, requestDigitalOceanOperation } from './factory';

function getRoute(name: string) {
	const route = digitalOceanRoutes.find((candidate) => candidate.name === name);
	if (!route) {
		throw new Error(`[digital_ocean] missing route: ${name}`);
	}
	return route;
}

const createDatabaseClusterRoute = getRoute('createDatabaseCluster');
export const createDatabaseCluster: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createDatabaseClusterRoute);
	await logDigitalOceanOperation(ctx, input, createDatabaseClusterRoute);
	return result;
};

const deleteDatabaseClusterRoute = getRoute('deleteDatabaseCluster');
export const deleteDatabaseCluster: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteDatabaseClusterRoute);
	await logDigitalOceanOperation(ctx, input, deleteDatabaseClusterRoute);
	return result;
};

const listAllDatabasesRoute = getRoute('listAllDatabases');
export const listAllDatabases: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllDatabasesRoute);
	await logDigitalOceanOperation(ctx, input, listAllDatabasesRoute);
	return result;
};

const listDatabaseOptionsRoute = getRoute('listDatabaseOptions');
export const listDatabaseOptions: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listDatabaseOptionsRoute);
	await logDigitalOceanOperation(ctx, input, listDatabaseOptionsRoute);
	return result;
};

export const DatabasesEndpoints = {
	createDatabaseCluster,
	deleteDatabaseCluster,
	listAllDatabases,
	listDatabaseOptions
} as const;
