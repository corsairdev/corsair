import { logEventFromContext } from 'corsair/core';
import type { SafetyCultureEndpoints } from '..';
import { makeSafetyCultureRequest } from '../client';
import { UsersListResponseSchema } from './types';

export const list: SafetyCultureEndpoints['usersList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};

	if (input.limit) query.limit = input.limit;
	if (input.offset !== undefined) query.offset = input.offset;

	const response = await makeSafetyCultureRequest(
		'users',
		ctx.key,
		UsersListResponseSchema,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'safetyculture.users.list',
		{ resultCount: response.users?.length ?? 0 },
		'completed',
	);

	return response;
};
