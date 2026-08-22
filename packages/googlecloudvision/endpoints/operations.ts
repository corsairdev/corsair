import { logEventFromContext } from 'corsair/core';
import { makeGoogleCloudVisionRequest } from '../client';
import type { GoogleCloudVisionEndpoints } from '../index';
import type { GoogleCloudVisionEndpointOutputs } from './types';

export const get: GoogleCloudVisionEndpoints['operationsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['operationsGet']
	>(input.name, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.operations.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: GoogleCloudVisionEndpoints['operationsList'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['operationsList']
	>(`${input.name}/operations`, ctx.key, {
		method: 'GET',
		query: {
			filter: input.filter,
			pageSize: input.pageSize,
			pageToken: input.pageToken,
		},
	});
	await logEventFromContext(
		ctx,
		'googlecloudvision.operations.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: GoogleCloudVisionEndpoints['operationsCancel'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleCloudVisionRequest<
		GoogleCloudVisionEndpointOutputs['operationsCancel']
	>(`${input.name}:cancel`, ctx.key, { method: 'POST' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.operations.cancel',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteOperation: GoogleCloudVisionEndpoints['operationsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['operationsDelete']
		>(input.name, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.operations.delete',
			{ ...input },
			'completed',
		);
		return response;
	};
