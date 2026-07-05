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

const createNewDropletRoute = getRoute('createNewDroplet');
export const createNewDroplet: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewDropletRoute);
	await logDigitalOceanOperation(ctx, input, createNewDropletRoute);
	return result;
};

const deleteExistingDropletRoute = getRoute('deleteExistingDroplet');
export const deleteExistingDroplet: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteExistingDropletRoute);
	await logDigitalOceanOperation(ctx, input, deleteExistingDropletRoute);
	return result;
};

const listAllDropletsRoute = getRoute('listAllDroplets');
export const listAllDroplets: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllDropletsRoute);
	await logDigitalOceanOperation(ctx, input, listAllDropletsRoute);
	return result;
};

const retrieveExistingDropletRoute = getRoute('retrieveExistingDroplet');
export const retrieveExistingDroplet: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveExistingDropletRoute);
	await logDigitalOceanOperation(ctx, input, retrieveExistingDropletRoute);
	return result;
};

export const DropletsEndpoints = {
	createNewDroplet,
	deleteExistingDroplet,
	listAllDroplets,
	retrieveExistingDroplet
} as const;
