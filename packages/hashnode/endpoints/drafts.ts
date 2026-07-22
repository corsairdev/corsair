import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import {
	CREATE_DRAFT_MUTATION,
	DELETE_DRAFT_MUTATION,
	DRAFT_QUERY,
	PUBLISH_DRAFT_MUTATION,
	UPDATE_DRAFT_MUTATION,
} from './types';

export const get: HashnodeEndpoints['getDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getDraft']
	>(DRAFT_QUERY, ctx.key, { id: input.id });

	await logEventFromContext(
		ctx,
		'hashnode.getDraft',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: HashnodeEndpoints['createDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['createDraft']
	>(CREATE_DRAFT_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.createDraft',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: HashnodeEndpoints['updateDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['updateDraft']
	>(UPDATE_DRAFT_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.updateDraft',
		{ ...input },
		'completed',
	);
	return response;
};

export const publish: HashnodeEndpoints['publishDraft'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['publishDraft']
	>(PUBLISH_DRAFT_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.publishDraft',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteDraft: HashnodeEndpoints['deleteDraft'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['deleteDraft']
	>(DELETE_DRAFT_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.deleteDraft',
		{ ...input },
		'completed',
	);
	return response;
};
