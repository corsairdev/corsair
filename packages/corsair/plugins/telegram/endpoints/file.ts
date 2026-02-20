import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const getFile: TelegramEndpoints['getFile'] = async (ctx, input) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['getFile']>(
		'getFile',
		ctx.key,
		{
			method: 'POST',
			body: {
				file_id: input.file_id,
			},
		},
	);

	if (result && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.file_id, {
				...result,
				file_id: result.file_id,
			});
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'telegram.file.getFile',
		{ ...input },
		'completed',
	);
	return result;
};
