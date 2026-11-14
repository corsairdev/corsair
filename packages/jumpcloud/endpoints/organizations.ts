import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const organizationsList: JumpCloudEndpoints['organizations.list'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['organizations.list'].parse(input);
		const requestPath = '/organizations';
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['organizations.list']
		>(ctx, 1, 'GET', requestPath, {
			query: {
				fields: parsed.fields,
				filter: parsed.filter,
				limit: parsed.limit,
				search: parsed.search,
				skip: parsed.skip,
				sort: parsed.sort,
				sortIgnoreCase: parsed.sortIgnoreCase,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['organizations.list'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.organizations.list',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const organizationsGet: JumpCloudEndpoints['organizations.get'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['organizations.get'].parse(input);
	const requestPath = `/organizations/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['organizations.get']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
		},
	});
	const output =
		JumpCloudEndpointOutputSchemas['organizations.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.organizations.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
