import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createCustomImageRoute = getRoute('createCustomImage');
export const createCustomImage: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, createCustomImageRoute);
};

const deleteImageRoute = getRoute('deleteImage');
export const deleteImage: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteImageRoute);
};

const listAllImagesRoute = getRoute('listAllImages');
export const listAllImages: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllImagesRoute);
};

const retrieveExistingImageRoute = getRoute('retrieveExistingImage');
export const retrieveExistingImage: DigitalOceanEndpoint = async (
	ctx,
	input = {},
) => {
	return executeDigitalOceanOperation(ctx, input, retrieveExistingImageRoute);
};

export const ImagesEndpoints = {
	createCustomImage,
	deleteImage,
	listAllImages,
	retrieveExistingImage,
} as const;
