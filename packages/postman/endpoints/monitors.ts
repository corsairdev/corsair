import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const list: PostmanEndpoints['monitorsList'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsList']
	>('/monitors', ctx.key, {
		method: 'GET',
		query: {
			workspace: input.workspace,
			active: input.active,
			owner: input.owner,
			collectionUid: input.collectionUid,
			environmentUid: input.environmentUid,
			cursor: input.cursor,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: PostmanEndpoints['monitorsGet'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsGet']
	>('/monitors/{monitorId}', ctx.key, {
		method: 'GET',
		path: {
			monitorId: input.monitorId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: PostmanEndpoints['monitorsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsCreate']
	>('/monitors', ctx.key, {
		method: 'POST',
		query: {
			workspace: input.workspace,
		},
		body: {
			monitor: input.monitor,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: PostmanEndpoints['monitorsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsRemove']
	>('/monitors/{monitorId}', ctx.key, {
		method: 'DELETE',
		path: {
			monitorId: input.monitorId,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const run: PostmanEndpoints['monitorsRun'] = async (ctx, input) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsRun']
	>('/monitors/{monitorId}/run', ctx.key, {
		method: 'POST',
		path: {
			monitorId: input.monitorId,
		},
		query: {
			async: input.async,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.run',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['monitorsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['monitorsUpdate']
	>('/monitors/{monitorId}', ctx.key, {
		method: 'PUT',
		path: {
			monitorId: input.monitorId,
		},
		body: {
			monitor: input.monitor,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.monitors.update',
		{ ...input },
		'completed',
	);
	return response;
};
