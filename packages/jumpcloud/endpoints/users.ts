import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const usersList: JumpCloudEndpoints['users.list'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.list'].parse(input);
	const requestPath = '/systemusers';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.list']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
			fields: parsed.fields,
			filter: parsed.filter,
			search: parsed.search,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['users.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersCreate: JumpCloudEndpoints['users.create'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.create'].parse(input);
	const requestPath = '/systemusers';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.create']
	>(ctx, 1, 'POST', requestPath, {
		query: {
			fullValidationDetails: parsed.fullValidationDetails,
		},
		body: parsed.body,
	});
	const output = JumpCloudEndpointOutputSchemas['users.create'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersGet: JumpCloudEndpoints['users.get'] = async (ctx, input) => {
	const parsed = JumpCloudEndpointInputSchemas['users.get'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.get']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['users.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersUpdate: JumpCloudEndpoints['users.update'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.update'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.update']
	>(ctx, 1, 'PUT', requestPath, {
		query: {
			fullValidationDetails: parsed.fullValidationDetails,
		},
		body: parsed.body,
	});
	const output = JumpCloudEndpointOutputSchemas['users.update'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersDelete: JumpCloudEndpoints['users.delete'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.delete'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.delete']
	>(ctx, 1, 'DELETE', requestPath, {
		query: {
			cascade_manager: parsed.cascade_manager,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['users.delete'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.delete',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersSetPassword: JumpCloudEndpoints['users.setPassword'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['users.setPassword'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/password`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.setPassword']
	>(ctx, 1, 'POST', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['users.setPassword'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.setPassword',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersUnlock: JumpCloudEndpoints['users.unlock'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.unlock'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/unlock`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.unlock']
	>(ctx, 1, 'POST', requestPath, {});
	const output = JumpCloudEndpointOutputSchemas['users.unlock'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.unlock',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersExpirePassword: JumpCloudEndpoints['users.expirePassword'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['users.expirePassword'].parse(input);
		const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/expire`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['users.expirePassword']
		>(ctx, 1, 'POST', requestPath, {});
		const output =
			JumpCloudEndpointOutputSchemas['users.expirePassword'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.users.expirePassword',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const usersResetMfa: JumpCloudEndpoints['users.resetMfa'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.resetMfa'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/resetmfa`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.resetMfa']
	>(ctx, 1, 'POST', requestPath, {
		body: parsed.body,
	});
	const output = JumpCloudEndpointOutputSchemas['users.resetMfa'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.resetMfa',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersEnforceMfa: JumpCloudEndpoints['users.enforceMfa'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.enforceMfa'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/mfa/enforce`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.enforceMfa']
	>(ctx, 1, 'POST', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['users.enforceMfa'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.enforceMfa',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersSyncMfa: JumpCloudEndpoints['users.syncMfa'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['users.syncMfa'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/mfasync`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.syncMfa']
	>(ctx, 1, 'POST', requestPath, {});
	const output = JumpCloudEndpointOutputSchemas['users.syncMfa'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.syncMfa',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const usersListSshKeys: JumpCloudEndpoints['users.listSshKeys'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['users.listSshKeys'].parse(input);
	const requestPath = `/systemusers/${encodeURIComponent(parsed.id)}/sshkeys`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['users.listSshKeys']
	>(ctx, 1, 'GET', requestPath, {});
	const output =
		JumpCloudEndpointOutputSchemas['users.listSshKeys'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.users.listSshKeys',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};
