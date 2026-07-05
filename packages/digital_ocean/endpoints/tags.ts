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

const createNewTagRoute = getRoute('createNewTag');
export const createNewTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, createNewTagRoute);
	await logDigitalOceanOperation(ctx, input, createNewTagRoute);
	return result;
};

const deleteTagRoute = getRoute('deleteTag');
export const deleteTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, deleteTagRoute);
	await logDigitalOceanOperation(ctx, input, deleteTagRoute);
	return result;
};

const listAllTagsRoute = getRoute('listAllTags');
export const listAllTags: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, listAllTagsRoute);
	await logDigitalOceanOperation(ctx, input, listAllTagsRoute);
	return result;
};

const retrieveTagRoute = getRoute('retrieveTag');
export const retrieveTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, retrieveTagRoute);
	await logDigitalOceanOperation(ctx, input, retrieveTagRoute);
	return result;
};

const tagResourceRoute = getRoute('tagResource');
export const tagResource: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, tagResourceRoute);
	await logDigitalOceanOperation(ctx, input, tagResourceRoute);
	return result;
};

const untagResourceRoute = getRoute('untagResource');
export const untagResource: DigitalOceanEndpoint = async (ctx, input = {}) => {
	const result = await requestDigitalOceanOperation(ctx, input, untagResourceRoute);
	await logDigitalOceanOperation(ctx, input, untagResourceRoute);
	return result;
};

export const TagsEndpoints = {
	createNewTag,
	deleteTag,
	listAllTags,
	retrieveTag,
	tagResource,
	untagResource
} as const;
