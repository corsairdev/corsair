import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['toolList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolList']
	>('tools', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['toolCreate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolCreate']
	>('tools', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['toolGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolGet']
	>(`tools/${input.tool_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['toolUpdate'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolUpdate']
	>(`tools/${input.tool_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['toolDelete'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolDelete']
	>(`tools/${input.tool_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const listRuns: GriptapeEndpoints['toolListRuns'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolListRuns']
	>(`tools/${input.tool_id}/runs`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.listRuns',
		{ ...input },
		'completed',
	);

	return response;
};

export const listDeployments: GriptapeEndpoints['toolListDeployments'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['toolListDeployments']
	>(`tools/${input.tool_id}/deployments`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.tool.listDeployments',
		{ ...input },
		'completed',
	);

	return response;
};

export const createDeployment: GriptapeEndpoints['toolCreateDeployment'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['toolCreateDeployment']
		>(`tools/${input.tool_id}/deployments`, ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.tool.createDeployment',
			{ ...input },
			'completed',
		);

		return response;
	};

export const deploymentStatus: GriptapeEndpoints['toolDeploymentStatus'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['toolDeploymentStatus']
		>(`deployments/${input.deployment_id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'griptape.tool.deploymentStatus',
			{ ...input },
			'completed',
		);

		return response;
	};
