import { logEventFromContext } from 'corsair/core';
import type { ExistEndpoints } from '../index';
import { parseExistInput, validatedExistRequest } from './validate';

/**
 * Get the authenticated user's profile and unit preferences.
 * @see https://developer.exist.io/reference/users/
 */
export const getProfile: ExistEndpoints['usersGetProfile'] = async (
	ctx,
	_input,
) => {
	const parsed = parseExistInput('usersGetProfile', _input);
	const result = await validatedExistRequest(
		'usersGetProfile',
		'accounts/profile/',
		ctx,
		{ method: 'GET' },
	);

	if (ctx.db.profile) {
		try {
			await ctx.db.profile.upsertByEntityId(result.username, {
				...result,
				id: result.username,
				avatar: result.avatar ?? null,
			});
		} catch (error) {
			console.warn('Failed to save Exist profile to database:', error);
		}
	}

	await logEventFromContext(ctx, 'exist.users.getProfile', {}, 'completed');
	return result;
};
