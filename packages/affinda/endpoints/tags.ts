import type { AffindaEndpoint } from './factory';
import { executeAffindaOperation, getRoute } from './factory';

const createTagRoute = getRoute('createTag');
export const createTag: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, createTagRoute);
};

const deleteTagRoute = getRoute('deleteTag');
export const deleteTag: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, deleteTagRoute);
};

const getAllTagsRoute = getRoute('getAllTags');
export const getAllTags: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getAllTagsRoute);
};

const getTagRoute = getRoute('getTag');
export const getTag: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, getTagRoute);
};

const updateTagRoute = getRoute('updateTag');
export const updateTag: AffindaEndpoint = async (ctx, input = {}) => {
	return executeAffindaOperation(ctx, input, updateTagRoute);
};

export const TagsEndpoints = {
	createTag,
	deleteTag,
	getAllTags,
	getTag,
	updateTag,
} as const;
