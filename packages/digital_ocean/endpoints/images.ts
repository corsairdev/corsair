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

const createCustomImageRoute = getRoute('createCustomImage');
export const createCustomImage: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createCustomImageRoute);
	await logDigitalOceanOperation(ctx, input, createCustomImageRoute);
	return result;
};

const deleteImageRoute = getRoute('deleteImage');
export const deleteImage: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteImageRoute);
	await logDigitalOceanOperation(ctx, input, deleteImageRoute);
	return result;
};

const listAllImagesRoute = getRoute('listAllImages');
export const listAllImages: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllImagesRoute);
	await logDigitalOceanOperation(ctx, input, listAllImagesRoute);
	return result;
};

const retrieveExistingImageRoute = getRoute('retrieveExistingImage');
export const retrieveExistingImage: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveExistingImageRoute);
	await logDigitalOceanOperation(ctx, input, retrieveExistingImageRoute);
	return result;
};

export const ImagesEndpoints = {
	createCustomImage,
	deleteImage,
	listAllImages,
	retrieveExistingImage
} as const;
