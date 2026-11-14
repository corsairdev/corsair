import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const commandsList: JumpCloudEndpoints['commands.list'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['commands.list'].parse(input);
	const requestPath = '/commands';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['commands.list']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['commands.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.commands.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const commandsCreate: JumpCloudEndpoints['commands.create'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['commands.create'].parse(input);
	const requestPath = '/commands';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['commands.create']
	>(ctx, 1, 'POST', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['commands.create'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.commands.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const commandsGet: JumpCloudEndpoints['commands.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['commands.get'].parse(input);
	const requestPath = `/commands/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['commands.get']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['commands.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.commands.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const commandsRun: JumpCloudEndpoints['commands.run'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['commands.run'].parse(input);
	const requestPath = '/runCommand';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['commands.run']
	>(ctx, 1, 'POST', requestPath, {
		body: parsed.body,
	});
	const output = JumpCloudEndpointOutputSchemas['commands.run'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.commands.run',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
