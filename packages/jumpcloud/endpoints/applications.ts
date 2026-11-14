import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const applicationsList: JumpCloudEndpoints['applications.list'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['applications.list'].parse(input);
	const requestPath = '/applications';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['applications.list']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
			filter: parsed.filter,
		},
	});
	const output =
		JumpCloudEndpointOutputSchemas['applications.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.applications.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const applicationsGet: JumpCloudEndpoints['applications.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['applications.get'].parse(input);
	const requestPath = `/applications/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['applications.get']
	>(ctx, 1, 'GET', requestPath, {});
	const output =
		JumpCloudEndpointOutputSchemas['applications.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.applications.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
