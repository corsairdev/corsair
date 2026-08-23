import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const get: BannerbearEndpoints['getWebhook'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getWebhook']
	>(`/v5/webhooks/${input.uid}`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.webhooks.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createWebhook']
	>('/v5/webhooks', ctx.key, {
		method: 'POST',
		body: { url: input.url, event: input.event, project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.webhooks.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteWebhook: BannerbearEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	await makeBannerbearRequest<void>(`/v5/webhooks/${input.uid}`, ctx.key, {
		method: 'DELETE',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.webhooks.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};
