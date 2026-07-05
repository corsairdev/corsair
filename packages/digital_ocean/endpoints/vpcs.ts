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

const createNewVpcRoute = getRoute('createNewVpc');
export const createNewVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewVpcRoute);
	await logDigitalOceanOperation(ctx, input, createNewVpcRoute);
	return result;
};

const deleteVpcRoute = getRoute('deleteVpc');
export const deleteVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteVpcRoute);
	await logDigitalOceanOperation(ctx, input, deleteVpcRoute);
	return result;
};

const listAllVpcsRoute = getRoute('listAllVpcs');
export const listAllVpcs: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllVpcsRoute);
	await logDigitalOceanOperation(ctx, input, listAllVpcsRoute);
	return result;
};

const retrieveVpcRoute = getRoute('retrieveVpc');
export const retrieveVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveVpcRoute);
	await logDigitalOceanOperation(ctx, input, retrieveVpcRoute);
	return result;
};

const updateVpcRoute = getRoute('updateVpc');
export const updateVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, updateVpcRoute);
	await logDigitalOceanOperation(ctx, input, updateVpcRoute);
	return result;
};

export const VpcsEndpoints = {
	createNewVpc,
	deleteVpc,
	listAllVpcs,
	retrieveVpc,
	updateVpc
} as const;
