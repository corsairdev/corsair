import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['workspacesList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesList']
	>('/workspaces', ctx.key, {
		method: 'GET',
		query: {
			type: input.type,
			createdBy: input.createdBy,
			include: input.include,
			elementType: input.elementType,
			elementId: input.elementId,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getActivity: PostmanEndpoints['workspacesGetActivity'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesGetActivity']
	>('/workspaces/{workspaceId}/activities', ctx.key, {
		method: 'GET',
		path: {
			workspaceId: input.workspaceId,
		},
		query: {
			userId: input.userId,
			elementType: input.elementType,
			limit: input.limit,
			cursor: input.cursor,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.getActivity',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: PostmanEndpoints['workspacesGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesGet']
	>('/workspaces/{workspaceId}', ctx.key, {
		method: 'GET',
		path: {
			workspaceId: input.workspaceId,
		},
		query: {
			include: input.include,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getGlobalVariables: PostmanEndpoints['workspacesGetGlobalVariables'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['workspacesGetGlobalVariables']
		>('/workspaces/{workspaceId}/global-variables', ctx.key, {
			method: 'GET',
			path: {
				workspaceId: input.workspaceId,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.workspaces.getGlobalVariables',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRoles: PostmanEndpoints['workspacesGetRoles'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesGetRoles']
	>('/workspaces/{workspaceId}/roles', ctx.key, {
		method: 'GET',
		path: {
			workspaceId: input.workspaceId,
		},
		query: {
			include: input.include,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.getRoles',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['workspacesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesCreate']
	>('/workspaces', ctx.key, {
		method: 'POST',
		body: {
			workspace: input.workspace,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: PostmanEndpoints['workspacesRemove'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesRemove']
	>('/workspaces/{workspaceId}', ctx.key, {
		method: 'DELETE',
		path: {
			workspaceId: input.workspaceId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateGlobalVariables: PostmanEndpoints['workspacesUpdateGlobalVariables'] =
	async (ctx, input) => {
		const response = await makePostmanRequest<
			PostmanEndpointOutputs['workspacesUpdateGlobalVariables']
		>('/workspaces/{workspaceId}/global-variables', ctx.key, {
			method: 'PUT',
			path: {
				workspaceId: input.workspaceId,
			},
			body: {
				values: input.values,
			},
		});

		await logEventFromContext(
			ctx,
			'postman.workspaces.updateGlobalVariables',
			{ ...input },
			'completed',
		);
		return response;
	};

export const update: PostmanEndpoints['workspacesUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['workspacesUpdate']
	>('/workspaces/{workspaceId}', ctx.key, {
		method: 'PUT',
		path: {
			workspaceId: input.workspaceId,
		},
		body: {
			workspace: input.workspace,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.workspaces.update',
		{ ...input },
		'completed',
	);
	return response;
};
