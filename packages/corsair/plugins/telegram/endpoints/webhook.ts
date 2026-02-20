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
			body: {
				url: input.url,
				secret_token: input.secret_token,
				certificate: input.certificate,
				ip_address: input.ip_address,
				max_connections: input.max_connections,
				allowed_updates: input.allowed_updates,
				drop_pending_updates: input.drop_pending_updates,
			},
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
			body: {
				drop_pending_updates: input.drop_pending_updates,
			},
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
