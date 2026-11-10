import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listRoles: KlipfolioEndpoints['listRoles'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listRoles']
	>(ctx, '/roles', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.roles.listRoles',
		input,
		'completed',
	);
	return response;
};

export const retrieveRole: KlipfolioEndpoints['retrieveRole'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveRole']
	>(ctx, klipfolioPathParameter('/roles/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.roles.retrieveRole',
		input,
		'completed',
	);
	return response;
};

export const updateRole: KlipfolioEndpoints['updateRole'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateRole']
	>(ctx, klipfolioPathParameter('/roles/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.roles.updateRole',
		input,
		'completed',
	);
	return response;
};

export const createRole: KlipfolioEndpoints['createRole'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createRole']
	>(ctx, klipfolioPathParameter('/roles/{id}', 'id', input.id), {
		method: 'POST',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.roles.createRole',
		input,
		'completed',
	);
	return response;
};

export const deleteRole: KlipfolioEndpoints['deleteRole'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteRole']
	>(ctx, klipfolioPathParameter('/roles/{id}', 'id', input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'klipfolio.roles.deleteRole',
		input,
		'completed',
	);
	return response;
};

export const retrieveRoleUsers: KlipfolioEndpoints['retrieveRoleUsers'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveRoleUsers']
		>(ctx, klipfolioPathParameter('/roles/{id}/users', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.roles.retrieveRoleUsers',
			input,
			'completed',
		);
		return response;
	};

export const updateRoleUser: KlipfolioEndpoints['updateRoleUser'] = async (
	ctx,
	input,
) => {
	const { id, userId, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateRoleUser']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/roles/{id}/users/{user_id}', 'id', input.id),
			'user_id',
			input.userId,
		),
		{ method: 'PUT', body: rest },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.roles.updateRoleUser',
		input,
		'completed',
	);
	return response;
};

export const deleteRoleUser: KlipfolioEndpoints['deleteRoleUser'] = async (
	ctx,
	input,
) => {
	const { id, userid, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteRoleUser']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/roles/{id}/users/{userid}', 'id', input.id),
			'userid',
			input.userid,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.roles.deleteRoleUser',
		input,
		'completed',
	);
	return response;
};

export const retrieveRolePermissions: KlipfolioEndpoints['retrieveRolePermissions'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveRolePermissions']
		>(ctx, klipfolioPathParameter('/roles/{id}/permissions', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.roles.retrieveRolePermissions',
			input,
			'completed',
		);
		return response;
	};

export const updateRolePermissions: KlipfolioEndpoints['updateRolePermissions'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateRolePermissions']
		>(ctx, klipfolioPathParameter('/roles/{id}/permissions', 'id', input.id), {
			method: 'PUT',
			body: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.roles.updateRolePermissions',
			input,
			'completed',
		);
		return response;
	};

export const deleteRolePermissions: KlipfolioEndpoints['deleteRolePermissions'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteRolePermissions']
		>(ctx, klipfolioPathParameter('/roles/{id}/permissions', 'id', input.id), {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'klipfolio.roles.deleteRolePermissions',
			input,
			'completed',
		);
		return response;
	};
