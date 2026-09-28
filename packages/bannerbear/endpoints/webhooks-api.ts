import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const get: BannerbearEndpoints['getWebhook'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getWebhook']
	>(`/v5/webhooks/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
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
		body: { ...input },
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
	await makeBannerbearRequest<void>(
		`/v5/webhooks/${encodeBannerbearUid(input.uid)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'bannerbear.webhooks.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};
