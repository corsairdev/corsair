import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['vpcsList'] = async (ctx, input) => {
	const { idc } = GmicloudEndpointInputSchemas.vpcsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.vpcsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/vpcs',
			query: { idc },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.vpcs.list', {}, 'completed');
	return result;
};

export const allocate: GmicloudEndpoints['vpcsAllocate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.vpcsAllocate.parse(input);
	const result = GmicloudEndpointOutputSchemas.vpcsAllocate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/vpcs',
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.vpcs.allocate', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['vpcsGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.vpcsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.vpcsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/vpcs/{id}',
			path: { id },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.vpcs.get', { id }, 'completed');
	return result;
};

export const release: GmicloudEndpoints['vpcsRelease'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.vpcsRelease.parse(input);
	const result = GmicloudEndpointOutputSchemas.vpcsRelease.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/vpcs/{id}',
			path: { id },
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.vpcs.release', { id }, 'completed');
	return result;
};
