import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const policiesList: JumpCloudEndpoints['policies.list'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['policies.list'].parse(input);
	const requestPath = '/policies';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['policies.list']
	>(ctx, 2, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['policies.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.policies.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const policiesCreate: JumpCloudEndpoints['policies.create'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['policies.create'].parse(input);
	const requestPath = '/policies';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['policies.create']
	>(ctx, 2, 'POST', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['policies.create'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.policies.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const policiesGet: JumpCloudEndpoints['policies.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['policies.get'].parse(input);
	const requestPath = `/policies/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['policies.get']
	>(ctx, 2, 'GET', requestPath, {});
	const output = JumpCloudEndpointOutputSchemas['policies.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.policies.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const policiesUpdate: JumpCloudEndpoints['policies.update'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['policies.update'].parse(input);
	const requestPath = `/policies/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['policies.update']
	>(ctx, 2, 'PUT', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['policies.update'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.policies.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const policiesDelete: JumpCloudEndpoints['policies.delete'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['policies.delete'].parse(input);
	const requestPath = `/policies/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['policies.delete']
	>(ctx, 2, 'DELETE', requestPath, {});
	const output =
		JumpCloudEndpointOutputSchemas['policies.delete'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.policies.delete',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const policiesListStatuses: JumpCloudEndpoints['policies.listStatuses'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['policies.listStatuses'].parse(input);
		const requestPath = `/policies/${encodeURIComponent(parsed.policy_id)}/policystatuses`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['policies.listStatuses']
		>(ctx, 2, 'GET', requestPath, {
			query: {
				fields: parsed.fields,
				filter: parsed.filter,
				limit: parsed.limit,
				skip: parsed.skip,
				sort: parsed.sort,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['policies.listStatuses'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.policies.listStatuses',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
