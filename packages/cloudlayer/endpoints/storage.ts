import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest } from '../client';
import type {
	StorageCreateOutput,
	StorageGetCurrentOutput,
	StorageGetOutput,
	StorageRemoveOutput,
} from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

// https://cloudlayer.io/docs/storage/ — POST /v2/storage
export const storageCreate: CloudlayerEndpoints['storage']['create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['storage.create'].parse(input);

	const response = await makeCloudlayerRequest<StorageCreateOutput>(
		'/storage',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		CloudlayerEndpointOutputSchemas['storage.create'].parse(response);

	// The body carries S3 access keys, so only the creation is recorded.
	await logEventFromContext(
		ctx,
		'cloudlayer.storage.create',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/storage/ — GET /v2/storage
export const storageGetCurrent: CloudlayerEndpoints['storage']['getCurrent'] =
	async (ctx, input) => {
		// getCurrent takes no parameters; parsing still rejects an unexpected shape.
		CloudlayerEndpointInputSchemas['storage.getCurrent'].parse(input);

		const response = await makeCloudlayerRequest<StorageGetCurrentOutput>(
			'/storage',
			ctx.key,
			{ method: 'GET' },
		);

		const parsed =
			CloudlayerEndpointOutputSchemas['storage.getCurrent'].parse(response);

		// The configuration echoes the (masked) access keys, so nothing from the
		// body is logged.
		await logEventFromContext(
			ctx,
			'cloudlayer.storage.getCurrent',
			{},
			'completed',
		);

		return parsed;
	};

// https://cloudlayer.io/docs/storage/ — GET /v2/storage/:id
export const storageGet: CloudlayerEndpoints['storage']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['storage.get'].parse(input);

	const response = await makeCloudlayerRequest<StorageGetOutput>(
		`/storage/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CloudlayerEndpointOutputSchemas['storage.get'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.storage.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

// https://cloudlayer.io/docs/storage/ — DELETE /v2/storage/:id
export const storageRemove: CloudlayerEndpoints['storage']['remove'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudlayerEndpointInputSchemas['storage.remove'].parse(input);

	const response = await makeCloudlayerRequest<StorageRemoveOutput>(
		`/storage/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	const parsed =
		CloudlayerEndpointOutputSchemas['storage.remove'].parse(response);

	await logEventFromContext(
		ctx,
		'cloudlayer.storage.remove',
		{ count: 1 },
		'completed',
	);

	return parsed;
};
