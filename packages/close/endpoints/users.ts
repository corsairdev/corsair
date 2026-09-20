import { makeCloseRequestForCtx } from '../client';
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
	const parsedInput =
		input === undefined ? undefined : UsersGetMeInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'me/', {
		method: 'GET',
		query: parsedInput,
	});
	return UsersGetMeResponseSchema.parse(res);
};

export const usersList = async (
	ctx: CloseContext,
	input?: UsersListInput,
): Promise<UsersListResponse> => {
	const parsedInput =
		input === undefined ? undefined : UsersListInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'user/', {
		method: 'GET',
		query: parsedInput,
	});
	return UsersListResponseSchema.parse(res);
};
