import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	UsersGetMeInput,
	UsersGetMeResponse,
	UsersListInput,
	UsersListResponse,
} from './types';
import {
	UsersGetMeInputSchema,
	UsersGetMeResponseSchema,
	UsersListInputSchema,
	UsersListResponseSchema,
} from './types';

export const usersGetMe = async (
	ctx: CloseContext,
	input?: UsersGetMeInput,
): Promise<UsersGetMeResponse> => {
	const parsedInput = input ? UsersGetMeInputSchema.parse(input) : undefined;
	const res = await makeCloseRequest<unknown>('me/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return UsersGetMeResponseSchema.parse(res);
};

export const usersList = async (
	ctx: CloseContext,
	input?: UsersListInput,
): Promise<UsersListResponse> => {
	const parsedInput = input ? UsersListInputSchema.parse(input) : undefined;
	const res = await makeCloseRequest<unknown>('user/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return UsersListResponseSchema.parse(res);
};
