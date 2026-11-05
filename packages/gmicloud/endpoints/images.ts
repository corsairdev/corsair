import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['imagesList'] = async (ctx, input) => {
	const { idc, product } = GmicloudEndpointInputSchemas.imagesList.parse(input);
	const result = GmicloudEndpointOutputSchemas.imagesList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/images',
			query: { idc, product },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.images.list', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['imagesGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.imagesGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.imagesGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/images/{id}',
			path: { id },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.images.get', { id }, 'completed');
	return result;
};
