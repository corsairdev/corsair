import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	UsersGetMeInput,
	UsersGetMeResponse,
	UsersListInput,
	UsersListResponse,
} from './types';

export const usersGetMe = async (
	ctx: CloseContext,
	_input?: UsersGetMeInput,
): Promise<UsersGetMeResponse> => {
	const res = await makeCloseRequest<UsersGetMeResponse>('me/', ctx.key, {
		method: 'GET',
	});
	return res;
};

export const usersList = async (
	ctx: CloseContext,
	input?: UsersListInput,
): Promise<UsersListResponse> => {
	const res = await makeCloseRequest<UsersListResponse>('user/', ctx.key, {
		method: 'GET',
		query: input,
	});
	return res;
};
