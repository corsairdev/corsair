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
	>(input.name, ctx, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'googlecloudvision.operations.get',
		{ name: input.name },
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
	>(`${input.name}/operations`, ctx, {
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
		{ name: input.name },
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
	>(`${input.name}:cancel`, ctx, { method: 'POST', body: {} });
	await logEventFromContext(
		ctx,
		'googlecloudvision.operations.cancel',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteOperation: GoogleCloudVisionEndpoints['operationsDelete'] =
	async (ctx, input) => {
		const response = await makeGoogleCloudVisionRequest<
			GoogleCloudVisionEndpointOutputs['operationsDelete']
		>(input.name, ctx, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'googlecloudvision.operations.delete',
			{ name: input.name },
			'completed',
		);
		return response;
	};
