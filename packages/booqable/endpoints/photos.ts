import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listPhotosRoute = getRoute('listPhotos');
export const listPhotos: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listPhotosRoute);
};

export const PhotosEndpoints = {
	listPhotos,
};
