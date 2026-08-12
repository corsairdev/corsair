import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	CREATE_DRAFT_MUTATION,
	DELETE_DRAFT_MUTATION,
	DRAFT_QUERY,
	HashnodeEndpointOutputSchemas,
	PUBLISH_DRAFT_MUTATION,
	UPDATE_DRAFT_MUTATION,
} from './types';

export const get: HashnodeEndpoints['getDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		DRAFT_QUERY,
		ctx.key,
		{ id: input.id },
		HashnodeEndpointOutputSchemas.getDraft,
	);

	await logEventFromContext(
		ctx,
		'hashnode.getDraft',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const create: HashnodeEndpoints['createDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		CREATE_DRAFT_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.createDraft,
	);

	await logEventFromContext(
		ctx,
		'hashnode.createDraft',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const update: HashnodeEndpoints['updateDraft'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		UPDATE_DRAFT_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.updateDraft,
	);

	await logEventFromContext(
		ctx,
		'hashnode.updateDraft',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const publish: HashnodeEndpoints['publishDraft'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest(
		PUBLISH_DRAFT_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.publishDraft,
	);

	await logEventFromContext(
		ctx,
		'hashnode.publishDraft',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const deleteDraft: HashnodeEndpoints['deleteDraft'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest(
		DELETE_DRAFT_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.deleteDraft,
	);

	await logEventFromContext(
		ctx,
		'hashnode.deleteDraft',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
