import type { AnthropicAdministratorEndpoints } from '../index';
import {
	cacheEntity,
	cacheList,
	callAdminApi,
	compact,
	evictEntity,
} from './shared';
import type {
	Invite,
	AnthropicAdministratorEndpointOutputs as Outputs,
} from './types/index';

const BASE = '/v1/organizations/invites';

/** GET /v1/organizations/invites */
export const listInvites: AnthropicAdministratorEndpoints['listInvites'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['listInvites']>(
			ctx,
			'invites.listInvites',
			BASE,
			{
				method: 'GET',
				query: {
					after_id: input.after_id,
					before_id: input.before_id,
					email: input.email,
					limit: input.limit,
					roles: input.roles,
					statuses: input.statuses,
				},
			},
		);

		await cacheList(ctx, 'invites', response.data, (i: Invite) => i.id);
		return response;
	};

/** POST /v1/organizations/invites */
export const createInvite: AnthropicAdministratorEndpoints['createInvite'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['createInvite']>(
			ctx,
			'invites.createInvite',
			BASE,
			{
				method: 'POST',
				body: compact({
					email: input.email,
					role: input.role,
					rbac_group_ids: input.rbac_group_ids,
				}),
			},
			{ role: input.role },
		);

		await cacheEntity(ctx, 'invites', response.id, response);
		return response;
	};

/** GET /v1/organizations/invites/{invite_id} */
export const getInvite: AnthropicAdministratorEndpoints['getInvite'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi<Outputs['getInvite']>(
		ctx,
		'invites.getInvite',
		`${BASE}/${encodeURIComponent(input.invite_id)}`,
		{ method: 'GET' },
		{ invite_id: input.invite_id },
	);

	await cacheEntity(ctx, 'invites', response.id, response);
	return response;
};

/** DELETE /v1/organizations/invites/{invite_id} */
export const deleteInvite: AnthropicAdministratorEndpoints['deleteInvite'] =
	async (ctx, input) => {
		const response = await callAdminApi<Outputs['deleteInvite']>(
			ctx,
			'invites.deleteInvite',
			`${BASE}/${encodeURIComponent(input.invite_id)}`,
			{ method: 'DELETE' },
			{ invite_id: input.invite_id },
		);

		await evictEntity(ctx, 'invites', input.invite_id);
		return response;
	};
