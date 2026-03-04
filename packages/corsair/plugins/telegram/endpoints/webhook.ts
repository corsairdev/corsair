import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const setWebhook: TelegramEndpoints['setWebhook'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['setWebhook']>(
		'setWebhook',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'telegram.webhook.setWebhook',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteWebhook: TelegramEndpoints['deleteWebhook'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['deleteWebhook']>(
		'deleteWebhook',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'telegram.webhook.deleteWebhook',
		{ ...input },
		'completed',
	);
	return result;
};
