import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewDropletRoute = getRoute('createNewDroplet');
export const createNewDroplet: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createNewDropletRoute);
};

const deleteExistingDropletRoute = getRoute('deleteExistingDroplet');
export const deleteExistingDroplet: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, deleteExistingDropletRoute);
};

const listAllDropletsRoute = getRoute('listAllDroplets');
export const listAllDroplets: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, listAllDropletsRoute);
};

const retrieveExistingDropletRoute = getRoute('retrieveExistingDroplet');
export const retrieveExistingDroplet: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, retrieveExistingDropletRoute);
};

export const DropletsEndpoints = {
	createNewDroplet,
	deleteExistingDroplet,
	listAllDroplets,
	retrieveExistingDroplet,
} as const;
