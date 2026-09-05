import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	UserInfoResponse,
	UserListResponse,
	UserSearchResponse,
} from './types';

export const info: AshbyEndpoints['user.info'] = async (ctx, input) => {
	return await ashbyCall<UserInfoResponse>(ctx, 'user.info', {
		userId: input.userId,
	});
};

export const list: AshbyEndpoints['user.list'] = async (ctx, input) => {
	return await ashbyCall<UserListResponse>(ctx, 'user.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		isEnabled: input.isEnabled,
	});
};

export const search: AshbyEndpoints['user.search'] = async (ctx, input) => {
	return await ashbyCall<UserSearchResponse>(ctx, 'user.search', {
		email: input.email,
		name: input.name,
	});
};
