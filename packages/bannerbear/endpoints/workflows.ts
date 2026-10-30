import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const listWorkflows: BannerbearEndpoints['listWorkflows'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listWorkflows']
	>('/v5/workflows', ctx.key, { method: 'GET', query: { page: input.page } });
	await logEventFromContext(
		ctx,
		'bannerbear.workflows.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const getWorkflow: BannerbearEndpoints['getWorkflow'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getWorkflow']
	>(`/v5/workflows/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bannerbear.workflows.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const createWorkflowRun: BannerbearEndpoints['createWorkflowRun'] =
	async (ctx, input) => {
		const response = await makeBannerbearRequest<
			BannerbearEndpointOutputs['createWorkflowRun']
		>('/v5/workflow_runs', ctx.key, {
			method: 'POST',
			body: {
				workflow: input.workflow,
				inputs: input.inputs,
			},
		});
		await logEventFromContext(
			ctx,
			'bannerbear.workflow_runs.create',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getWorkflowRun: BannerbearEndpoints['getWorkflowRun'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getWorkflowRun']
	>(`/v5/workflow_runs/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bannerbear.workflow_runs.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const listWorkflowRuns: BannerbearEndpoints['listWorkflowRuns'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listWorkflowRuns']
	>('/v5/workflow_runs', ctx.key, {
		method: 'GET',
		query: { page: input.page },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.workflow_runs.list',
		{ ...input },
		'completed',
	);
	return response;
};
