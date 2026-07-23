import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewVpcRoute = getRoute('createNewVpc');
export const createNewVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, createNewVpcRoute);
};

const deleteVpcRoute = getRoute('deleteVpc');
export const deleteVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteVpcRoute);
};

const listAllVpcsRoute = getRoute('listAllVpcs');
export const listAllVpcs: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllVpcsRoute);
};

const retrieveVpcRoute = getRoute('retrieveVpc');
export const retrieveVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, retrieveVpcRoute);
};

const updateVpcRoute = getRoute('updateVpc');
export const updateVpc: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, updateVpcRoute);
};

export const VpcsEndpoints = {
	createNewVpc,
	deleteVpc,
	listAllVpcs,
	retrieveVpc,
	updateVpc,
} as const;
