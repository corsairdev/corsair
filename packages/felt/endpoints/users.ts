import { logEventFromContext } from 'corsair/core';
import { makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type { UsersGetCurrentResponse } from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const Users = {
	getCurrent: (async (ctx, rawInput) => {
		const _input = FeltEndpointInputSchemas.usersGetCurrent.parse(rawInput);
		const response = await makeFeltRequest<UsersGetCurrentResponse>(
			'/user',
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.usersGetCurrent.parse(response);
		await logEventFromContext(ctx, 'felt.users.getCurrent', {}, 'completed');
		return parsed;
	}) as FeltEndpoints['usersGetCurrent'],
};
