import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const getForks: PostmanEndpoints['environmentsGetForks'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsGetForks']
	>('/environments/{environmentId}/forks', ctx.key, {
		method: 'GET',
		path: {
			environmentId: input.environmentId,
		},
		query: {
			cursor: input.cursor,
			direction: input.direction,
			limit: input.limit,
			sort: input.sort,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.getForks',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: PostmanEndpoints['environmentsGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsGet']
	>('/environments/{environmentId}', ctx.key, {
		method: 'GET',
		path: {
			environmentId: input.environmentId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['environmentsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsCreate']
	>('/environments', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: {
			environment: input.environment,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.create',
		{ workspace: input.workspace },
		'completed',
	);
	return response;
};

export const remove: PostmanEndpoints['environmentsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsRemove']
	>('/environments/{environmentId}', ctx.key, {
		method: 'DELETE',
		path: {
			environmentId: input.environmentId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const fork: PostmanEndpoints['environmentsFork'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsFork']
	>('/environments/{environmentId}/forks', ctx.key, {
		method: 'POST',
		path: {
			environmentId: input.environmentId,
		},
		query: {
			workspaceId: input.workspaceId,
		},
		body: {
			forkName: input.forkName,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.fork',
		{ ...input },
		'completed',
	);
	return response;
};

export const mergeFork: PostmanEndpoints['environmentsMergeFork'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsMergeFork']
	>('/environments/{environmentId}/merges', ctx.key, {
		method: 'POST',
		path: {
			environmentId: input.environmentId,
		},
		body: {
			source: input.source,
			deleteSource: input.deleteSource,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.mergeFork',
		{ ...input },
		'completed',
	);
	return response;
};

export const replace: PostmanEndpoints['environmentsReplace'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsReplace']
	>('/environments/{environmentId}', ctx.key, {
		method: 'PUT',
		path: {
			environmentId: input.environmentId,
		},
		body: {
			environment: input.environment,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.replace',
		{ environmentId: input.environmentId },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['environmentsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsUpdate']
	>('/environments/{environmentId}', ctx.key, {
		method: 'PATCH',
		path: {
			environmentId: input.environmentId,
		},
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'postman.environments.update',
		{ environmentId: input.environmentId },
		'completed',
	);
	return response;
};

export const list: PostmanEndpoints['environmentsList'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['environmentsList']
	>('/environments', ctx.key, {
		method: 'GET',
		query: {
			workspace: input.workspace,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.environments.list',
		{ ...input },
		'completed',
	);
	return response;
};
