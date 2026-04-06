import type { CursorEndpoints } from '..';
import type { CursorEndpointOutputs } from './types';
import { logEventFromContext } from 'corsair/core';
import { makeCursorRequest } from '../client';

export const list: CursorEndpoints['modelsList'] = async (ctx, _input) => {
	const response = await makeCursorRequest<CursorEndpointOutputs['modelsList']>(
		'models',
		ctx.key,
		{ method: 'GET' },
	);

	if (response.models && ctx.db.models) {
		for (const modelName of response.models) {
			try {
				await ctx.db.models.upsertByEntityId(modelName, { id: modelName });
			} catch (error) {
				console.warn('Failed to save model to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'cursor.models.list', {}, 'completed');
	return response;
};
