import type { DigitalOceanEndpoint } from './factory';
import { executeDigitalOceanOperation, getRoute } from './factory';

const createNewTagRoute = getRoute('createNewTag');
export const createNewTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, createNewTagRoute);
};

const deleteTagRoute = getRoute('deleteTag');
export const deleteTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, deleteTagRoute);
};

const listAllTagsRoute = getRoute('listAllTags');
export const listAllTags: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, listAllTagsRoute);
};

const retrieveTagRoute = getRoute('retrieveTag');
export const retrieveTag: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, retrieveTagRoute);
};

const tagResourceRoute = getRoute('tagResource');
export const tagResource: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, tagResourceRoute);
};

const untagResourceRoute = getRoute('untagResource');
export const untagResource: DigitalOceanEndpoint = async (ctx, input = {}) => {
	return executeDigitalOceanOperation(ctx, input, untagResourceRoute);
};

export const TagsEndpoints = {
	createNewTag,
	deleteTag,
	listAllTags,
	retrieveTag,
	tagResource,
	untagResource,
} as const;
