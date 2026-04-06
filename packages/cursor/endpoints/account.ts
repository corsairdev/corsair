import type { CursorEndpoints } from '..';
import type { CursorEndpointOutputs } from './types';
import { logEventFromContext } from 'corsair/core';
import { makeCursorRequest } from '../client';

export const getMe: CursorEndpoints['accountGetMe'] = async (ctx, _input) => {
	const response = await makeCursorRequest<
		CursorEndpointOutputs['accountGetMe']
	>('me', ctx.key, { method: 'GET' });

	if (ctx.db.apiKeys) {
		try {
			const { createdAt: createdAtStr, ...rest } = response;
			await ctx.db.apiKeys.upsertByEntityId(response.apiKeyName, {
				...rest,
				id: response.apiKeyName,
				createdAt: createdAtStr ? new Date(createdAtStr) : undefined,
			});
		} catch (error) {
			console.warn('Failed to save API key info to database:', error);
		}
	}

	await logEventFromContext(ctx, 'cursor.account.getMe', {}, 'completed');
	return response;
};
