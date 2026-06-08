import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelEndpoints } from '../index';
import type { VercelEndpointOutputs } from './types';

export const getWebhooks: VercelEndpoints['webhooksGetWebhooks'] = async (
	ctx,
	_input,
) => {
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['webhooksGetWebhooks']
	>('/v1/webhooks', ctx);
	await logEventFromContext(
		ctx,
		'vercel.webhooks.getWebhooks',
		{},
		'completed',
	);
	return result;
};

export const createWebhook: VercelEndpoints['webhooksCreateWebhook'] = async (
	ctx,
	input,
) => {
	const { teamId, ...body } = input;
	const result = await makeAuthenticatedVercelRequest<
		VercelEndpointOutputs['webhooksCreateWebhook']
	>('/v1/webhooks', ctx, { method: 'POST', body, teamId });
	await logEventFromContext(
		ctx,
		'vercel.webhooks.createWebhook',
		{ ...input },
		'completed',
	);
	return result;
};
