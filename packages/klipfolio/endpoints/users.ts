import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listUsers: KlipfolioEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listUsers']
	>(ctx, '/users', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.users.listUsers',
		input,
		'completed',
	);
	return response;
};

export const retrieveUser: KlipfolioEndpoints['retrieveUser'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveUser']
	>(ctx, klipfolioPathParameter('/users/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.users.retrieveUser',
		input,
		'completed',
	);
	return response;
};

export const createUser: KlipfolioEndpoints['createUser'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createUser']
	>(ctx, '/users', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.users.createUser',
		{ redacted: true },
		'completed',
	);
	return response;
};

export const updateUser: KlipfolioEndpoints['updateUser'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateUser']
	>(ctx, klipfolioPathParameter('/users/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.users.updateUser',
		{ redacted: true },
		'completed',
	);
	return response;
};

export const deleteUser: KlipfolioEndpoints['deleteUser'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteUser']
	>(ctx, klipfolioPathParameter('/users/{id}', 'id', input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'klipfolio.users.deleteUser',
		input,
		'completed',
	);
	return response;
};

export const retrieveUserGroups: KlipfolioEndpoints['retrieveUserGroups'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveUserGroups']
		>(ctx, klipfolioPathParameter('/users/{id}/groups', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.users.retrieveUserGroups',
			input,
			'completed',
		);
		return response;
	};

export const updateUserGroup: KlipfolioEndpoints['updateUserGroup'] = async (
	ctx,
	input,
) => {
	const { id, groupId, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateUserGroup']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/users/{id}/groups/{group_id}', 'id', input.id),
			'group_id',
			input.groupId,
		),
		{ method: 'PUT', body: rest },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.users.updateUserGroup',
		input,
		'completed',
	);
	return response;
};

export const deleteUserGroup: KlipfolioEndpoints['deleteUserGroup'] = async (
	ctx,
	input,
) => {
	const { id, groupId, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteUserGroup']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/users/{id}/groups/{group_id}', 'id', input.id),
			'group_id',
			input.groupId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.users.deleteUserGroup',
		input,
		'completed',
	);
	return response;
};

export const resendInviteUser: KlipfolioEndpoints['resendInviteUser'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['resendInviteUser']
	>(
		ctx,
		klipfolioPathParameter('/users/{id}/@/resend-invite', 'id', input.id),
		{ method: 'POST', body: rest },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.users.resendInviteUser',
		input,
		'completed',
	);
	return response;
};

export const resetPasswordUser: KlipfolioEndpoints['resetPasswordUser'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['resetPasswordUser']
		>(
			ctx,
			klipfolioPathParameter('/users/{id}/@/reset-password', 'id', input.id),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.users.resetPasswordUser',
			input,
			'completed',
		);
		return response;
	};

export const retrieveUserProperties: KlipfolioEndpoints['retrieveUserProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveUserProperties']
		>(ctx, klipfolioPathParameter('/users/{id}/properties', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.users.retrieveUserProperties',
			input,
			'completed',
		);
		return response;
	};

export const updateUserProperties: KlipfolioEndpoints['updateUserProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateUserProperties']
		>(ctx, klipfolioPathParameter('/users/{id}/properties', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.users.updateUserProperties',
			input,
			'completed',
		);
		return response;
	};

export const deleteUserProperties: KlipfolioEndpoints['deleteUserProperties'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteUserProperties']
		>(ctx, klipfolioPathParameter('/users/{id}/properties', 'id', input.id), {
			method: 'DELETE',
			// The provider reads the property name (and client scoping) from the
			// query string.
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.users.deleteUserProperties',
			input,
			'completed',
		);
		return response;
	};

export const retrieveUserRoles: KlipfolioEndpoints['retrieveUserRoles'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveUserRoles']
		>(ctx, klipfolioPathParameter('/users/{id}/roles', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.users.retrieveUserRoles',
			input,
			'completed',
		);
		return response;
	};

export const updateUserRole: KlipfolioEndpoints['updateUserRole'] = async (
	ctx,
	input,
) => {
	const { id, roleId, wire_id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateUserRole']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/users/{id}/roles/{role_id}', 'id', input.id),
			'role_id',
			input.roleId,
		),
		{ method: 'PUT', body: { ...rest, id: input.wire_id } },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.users.updateUserRole',
		input,
		'completed',
	);
	return response;
};

export const deleteUserRole: KlipfolioEndpoints['deleteUserRole'] = async (
	ctx,
	input,
) => {
	const { id, roleid, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteUserRole']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/users/{id}/roles/{roleid}', 'id', input.id),
			'roleid',
			input.roleid,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.users.deleteUserRole',
		input,
		'completed',
	);
	return response;
};

export const retrieveUserTabInstances: KlipfolioEndpoints['retrieveUserTabInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveUserTabInstances']
		>(
			ctx,
			klipfolioPathParameter('/users/{id}/tab-instances', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.users.retrieveUserTabInstances',
			input,
			'completed',
		);
		return response;
	};

export const updateUserTabInstances: KlipfolioEndpoints['updateUserTabInstances'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateUserTabInstances']
		>(
			ctx,
			klipfolioPathParameter('/users/{id}/tab-instances', 'id', input.id),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.users.updateUserTabInstances',
			input,
			'completed',
		);
		return response;
	};

export const deleteUserTabInstance: KlipfolioEndpoints['deleteUserTabInstance'] =
	async (ctx, input) => {
		const { id, tabInstanceId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteUserTabInstance']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/users/{id}/tab-instances/{tabInstanceId}',
					'id',
					input.id,
				),
				'tabInstanceId',
				input.tabInstanceId,
			),
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.users.deleteUserTabInstance',
			input,
			'completed',
		);
		return response;
	};
