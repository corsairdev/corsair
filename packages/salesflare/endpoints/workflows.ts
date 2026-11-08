import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listWorkflows: SalesflareEndpoints['listWorkflows'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listWorkflows']
	>(ctx, '/workflows', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.workflows.listWorkflows',
		input,
		'completed',
	);
	return response;
};

export const createWorkflow: SalesflareEndpoints['createWorkflow'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['createWorkflow']
	>(ctx, '/workflows', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'salesflare.workflows.createWorkflow',
		input,
		'completed',
	);
	return response;
};

export const retrieveWorkflow: SalesflareEndpoints['retrieveWorkflow'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveWorkflow']
	>(ctx, salesflarePathParameter('/workflows/{id}', 'id', input.id), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'salesflare.workflows.retrieveWorkflow',
		input,
		'completed',
	);
	return response;
};

export const updateWorkflow: SalesflareEndpoints['updateWorkflow'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['updateWorkflow']
	>(ctx, salesflarePathParameter('/workflows/{id}', 'id', input.id), {
		method: 'PUT',
		body: body,
	});
	await logEventFromContext(
		ctx,
		'salesflare.workflows.updateWorkflow',
		input,
		'completed',
	);
	return response;
};

export const updateWorkflowAudience: SalesflareEndpoints['updateWorkflowAudience'] =
	async (ctx, input) => {
		const { id, recordId, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateWorkflowAudience']
		>(
			ctx,
			salesflarePathParameter(
				salesflarePathParameter(
					'/workflows/{id}/audience/{record_id}',
					'id',
					input.id,
				),
				'record_id',
				input.recordId,
			),
			{ method: 'PUT', body: body },
		);
		await logEventFromContext(
			ctx,
			'salesflare.workflows.updateWorkflowAudience',
			input,
			'completed',
		);
		return response;
	};
