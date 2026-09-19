import type { AnthropicAdministratorEndpoints } from '../index';
import { cacheEntity, cacheList, callAdminApi, evictEntity } from './shared';
import type {
	AnthropicAdministratorEndpointOutputs as Outputs,
	User,
} from './types';

const BASE = '/v1/organizations/users';

/** GET /v1/organizations/users */
export const listUsers: AnthropicAdministratorEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi<Outputs['listUsers']>(
		ctx,
		'users.listUsers',
		BASE,
		{
			method: 'GET',
			query: {
				after_id: input.after_id,
				before_id: input.before_id,
				email: input.email,
				limit: input.limit,
				roles: input.roles,
			},
		},
		{ count: input.limit },
	);

	await cacheList(ctx, 'users', response.data, (user: User) => user.id);
	return response;
};

/** GET /v1/organizations/users/{user_id} */
export const getUser: AnthropicAdministratorEndpoints['getUser'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi<Outputs['getUser']>(
		ctx,
		'users.getUser',
		`${BASE}/${encodeURIComponent(input.user_id)}`,
		{ method: 'GET' },
		{ user_id: input.user_id },
	);

	await cacheEntity(ctx, 'users', response.id, response);
	return response;
};

/** POST /v1/organizations/users/{user_id} */
export const updateUser: AnthropicAdministratorEndpoints['updateUser'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi<Outputs['updateUser']>(
		ctx,
		'users.updateUser',
		`${BASE}/${encodeURIComponent(input.user_id)}`,
		{ method: 'POST', body: { role: input.role } },
		{ user_id: input.user_id, role: input.role },
	);

	await cacheEntity(ctx, 'users', response.id, response);
	return response;
};

/** DELETE /v1/organizations/users/{user_id} */
export const removeUser: AnthropicAdministratorEndpoints['removeUser'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi<Outputs['removeUser']>(
		ctx,
		'users.removeUser',
		`${BASE}/${encodeURIComponent(input.user_id)}`,
		{ method: 'DELETE' },
		{ user_id: input.user_id },
	);

	await evictEntity(ctx, 'users', input.user_id);
	return response;
};
