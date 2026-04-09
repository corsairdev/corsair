import { logEventFromContext } from 'corsair/core';
import type { CursorEndpoints } from '..';
import { makeCursorRequest } from '../client';
import type { CursorEndpointOutputs } from './types';

export const list: CursorEndpoints['repositoriesList'] = async (
	ctx,
	_input,
) => {
	const response = await makeCursorRequest<
		CursorEndpointOutputs['repositoriesList']
	>('repositories', ctx.key, { method: 'GET' });

	if (response.repositories && ctx.db.repositories) {
		for (const repo of response.repositories) {
			if (repo.owner && repo.name) {
				try {
					const repoId = `${repo.owner}/${repo.name}`;
					await ctx.db.repositories.upsertByEntityId(repoId, {
						...repo,
						id: repoId,
					});
				} catch (error) {
					console.warn('Failed to save repository to database:', error);
				}
			}
		}
	}

	await logEventFromContext(ctx, 'cursor.repositories.list', {}, 'completed');
	return response;
};
