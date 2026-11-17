import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const searchSystemUsers: JumpCloudEndpoints['search.systemUsers'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['search.systemUsers'].parse(input);
		const requestPath = '/search/systemusers';
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['search.systemUsers']
		>(ctx, 1, 'POST', requestPath, {
			query: {
				fields: parsed.fields,
				filter: parsed.filter,
				limit: parsed.limit,
				skip: parsed.skip,
			},
			body: parsed.body,
		});
		const output =
			JumpCloudEndpointOutputSchemas['search.systemUsers'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.search.systemUsers',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const searchSystems: JumpCloudEndpoints['search.systems'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['search.systems'].parse(input);
	const requestPath = '/search/systems';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['search.systems']
	>(ctx, 1, 'POST', requestPath, {
		query: {
			fields: parsed.fields,
			limit: parsed.limit,
			skip: parsed.skip,
			filter: parsed.filter,
		},
		body: parsed.body,
	});
	const output = JumpCloudEndpointOutputSchemas['search.systems'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.search.systems',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
