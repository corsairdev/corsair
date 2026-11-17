import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const listGroups: KlipfolioEndpoints['listGroups'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['listGroups']
	>(ctx, '/groups', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.groups.listGroups',
		input,
		'completed',
	);
	return response;
};

export const retrieveGroup: KlipfolioEndpoints['retrieveGroup'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveGroup']
	>(ctx, klipfolioPathParameter('/groups/{id}', 'id', input.id), {
		method: 'GET',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.groups.retrieveGroup',
		input,
		'completed',
	);
	return response;
};

export const createGroup: KlipfolioEndpoints['createGroup'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['createGroup']
	>(ctx, '/groups', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'klipfolio.groups.createGroup',
		input,
		'completed',
	);
	return response;
};

export const updateGroup: KlipfolioEndpoints['updateGroup'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateGroup']
	>(ctx, klipfolioPathParameter('/groups/{id}', 'id', input.id), {
		method: 'PUT',
		body: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.groups.updateGroup',
		input,
		'completed',
	);
	return response;
};

export const deleteGroup: KlipfolioEndpoints['deleteGroup'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteGroup']
	>(ctx, klipfolioPathParameter('/groups/{id}', 'id', input.id), {
		method: 'DELETE',
		query: rest,
	});
	await logEventFromContext(
		ctx,
		'klipfolio.groups.deleteGroup',
		input,
		'completed',
	);
	return response;
};

export const retrieveGroupDefaultTabs: KlipfolioEndpoints['retrieveGroupDefaultTabs'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveGroupDefaultTabs']
		>(
			ctx,
			klipfolioPathParameter('/groups/{id}/default-tabs', 'id', input.id),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.groups.retrieveGroupDefaultTabs',
			input,
			'completed',
		);
		return response;
	};

export const retrieveGroupDefaultTab: KlipfolioEndpoints['retrieveGroupDefaultTab'] =
	async (ctx, input) => {
		const { id, id2, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveGroupDefaultTab']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/groups/{id}/default-tabs/{id2}',
					'id',
					input.id,
				),
				'id2',
				input.id2,
			),
			{ method: 'GET', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.groups.retrieveGroupDefaultTab',
			input,
			'completed',
		);
		return response;
	};

export const addGroupDefaultTabs: KlipfolioEndpoints['addGroupDefaultTabs'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['addGroupDefaultTabs']
		>(
			ctx,
			klipfolioPathParameter('/groups/{id}/default-tabs', 'id', input.id),
			{ method: 'POST', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.groups.addGroupDefaultTabs',
			input,
			'completed',
		);
		return response;
	};

export const updateGroupDefaultTab: KlipfolioEndpoints['updateGroupDefaultTab'] =
	async (ctx, input) => {
		const { id, id2, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateGroupDefaultTab']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/groups/{id}/default-tabs/{id2}',
					'id',
					input.id,
				),
				'id2',
				input.id2,
			),
			{ method: 'PUT', body: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.groups.updateGroupDefaultTab',
			input,
			'completed',
		);
		return response;
	};

export const deleteGroupDefaultTab: KlipfolioEndpoints['deleteGroupDefaultTab'] =
	async (ctx, input) => {
		const { id, id2, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteGroupDefaultTab']
		>(
			ctx,
			klipfolioPathParameter(
				klipfolioPathParameter(
					'/groups/{id}/default-tabs/{id2}',
					'id',
					input.id,
				),
				'id2',
				input.id2,
			),
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.groups.deleteGroupDefaultTab',
			input,
			'completed',
		);
		return response;
	};

export const retrieveGroupUsers: KlipfolioEndpoints['retrieveGroupUsers'] =
	async (ctx, input) => {
		const { id, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['retrieveGroupUsers']
		>(ctx, klipfolioPathParameter('/groups/{id}/users', 'id', input.id), {
			method: 'GET',
			query: rest,
		});
		await logEventFromContext(
			ctx,
			'klipfolio.groups.retrieveGroupUsers',
			input,
			'completed',
		);
		return response;
	};

export const updateGroupUser: KlipfolioEndpoints['updateGroupUser'] = async (
	ctx,
	input,
) => {
	const { id, userid, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['updateGroupUser']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/groups/{id}/users/{userid}', 'id', input.id),
			'userid',
			input.userid,
		),
		{ method: 'PUT', body: rest },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.groups.updateGroupUser',
		input,
		'completed',
	);
	return response;
};

export const deleteGroupUser: KlipfolioEndpoints['deleteGroupUser'] = async (
	ctx,
	input,
) => {
	const { id, id2, ...rest } = input;
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['deleteGroupUser']
	>(
		ctx,
		klipfolioPathParameter(
			klipfolioPathParameter('/groups/{id}/users/{id2}', 'id', input.id),
			'id2',
			input.id2,
		),
		{ method: 'DELETE', query: rest },
	);
	await logEventFromContext(
		ctx,
		'klipfolio.groups.deleteGroupUser',
		input,
		'completed',
	);
	return response;
};
