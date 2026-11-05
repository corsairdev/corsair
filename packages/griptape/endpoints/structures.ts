import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['structureList'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureList']
	>('structures', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const create: GriptapeEndpoints['structureCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureCreate']
	>('structures', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['structureGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureGet']
	>(`structures/${input.structure_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['structureUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureUpdate']
	>(`structures/${input.structure_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: GriptapeEndpoints['structureDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureDelete']
	>(`structures/${input.structure_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const dashboard: GriptapeEndpoints['structureDashboard'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureDashboard']
	>('dashboards/structures', ctx.key, {
		method: 'GET',
		query: {
			start_time: input.start_time,
			end_time: input.end_time,
			period: input.period,
			structure_ids: input.structure_ids,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.dashboard',
		{ ...input },
		'completed',
	);

	return response;
};

export const listRuns: GriptapeEndpoints['structureListRuns'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['structureListRuns']
	>(`structures/${input.structure_id}/runs`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.structure.listRuns',
		{ ...input },
		'completed',
	);

	return response;
};

export const listDeployments: GriptapeEndpoints['structureListDeployments'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['structureListDeployments']
		>(`structures/${input.structure_id}/deployments`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'griptape.structure.listDeployments',
			{ ...input },
			'completed',
		);

		return response;
	};

export const createDeployment: GriptapeEndpoints['structureCreateDeployment'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['structureCreateDeployment']
		>(`structures/${input.structure_id}/deployments`, ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.structure.createDeployment',
			{ ...input },
			'completed',
		);

		return response;
	};
