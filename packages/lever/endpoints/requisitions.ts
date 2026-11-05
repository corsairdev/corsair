import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

export const listRequisitions: LeverEndpoints['listRequisitions'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listRequisitions']
	>(ctx, '/requisitions', { method: 'GET', query: input });
	await logEventFromContext(ctx, 'lever.requisitions.list', input, 'completed');
	return response;
};

export const createRequisition: LeverEndpoints['createRequisition'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createRequisition']
	>(ctx, '/requisitions', { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'lever.requisitions.create',
		input,
		'completed',
	);
	return response;
};

export const retrieveRequisition: LeverEndpoints['retrieveRequisition'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveRequisition']
		>(
			ctx,
			leverPathParameter(
				'/requisitions/{requisitionId}',
				'requisitionId',
				input.requisitionId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'lever.requisitions.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const updateRequisition: LeverEndpoints['updateRequisition'] = async (
	ctx,
	input,
) => {
	const { requisitionId, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateRequisition']
	>(
		ctx,
		leverPathParameter(
			'/requisitions/{requisitionId}',
			'requisitionId',
			requisitionId,
		),
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'lever.requisitions.update',
		input,
		'completed',
	);
	return response;
};

export const deleteRequisition: LeverEndpoints['deleteRequisition'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deleteRequisition']
	>(
		ctx,
		leverPathParameter(
			'/requisitions/{requisitionId}',
			'requisitionId',
			input.requisitionId,
		),
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'lever.requisitions.delete',
		input,
		'completed',
	);
	return response;
};
