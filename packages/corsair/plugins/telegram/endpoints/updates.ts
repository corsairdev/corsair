import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const getUpdates: TelegramEndpoints['getUpdates'] = async (ctx, input) => {
	const body: Record<string, unknown> = {};
	
	if (input.offset !== undefined) {
		body.offset = input.offset;
	}
	if (input.limit !== undefined) {
		body.limit = input.limit;
	}
	if (input.timeout !== undefined) {
		body.timeout = input.timeout;
	}
	if (input.allowed_updates && input.allowed_updates.length > 0) {
		body.allowed_updates = input.allowed_updates;
	}

	const result = await makeTelegramRequest<TelegramEndpointOutputs['getUpdates']>(
		'getUpdates',
		ctx.key,
		{
			method: 'POST',
			body: Object.keys(body).length > 0 ? body : {},
		},
	);

	await logEventFromContext(
		ctx,
		'telegram.updates.getUpdates',
		{ ...input },
		'completed',
	);
	return result;
};
