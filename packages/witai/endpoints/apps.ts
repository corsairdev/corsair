import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listApps: WitAiEndpoints['appsListApps'] = async (ctx, input) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsListApps']>(
		'apps',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				offset: input.offset,
			},
		},
	);
	await logEventFromContext(ctx, 'witai.apps.listApps', {}, 'completed');
	return result;
};

export const getApp: WitAiEndpoints['appsGetApp'] = async (ctx, input) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsGetApp']>(
		`apps/${input.app_id}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'witai.apps.getApp',
		{ app_id: input.app_id },
		'completed',
	);
	return result;
};

export const createApp: WitAiEndpoints['appsCreateApp'] = async (
	ctx,
	input,
) => {
	const { private: isPrivate, ...rest } = input;
	const body: Record<string, unknown> = {
		...rest,
		...(isPrivate !== undefined
			? {
					private:
						typeof isPrivate === 'boolean'
							? isPrivate
								? 'true'
								: 'false'
							: isPrivate,
				}
			: {}),
	};
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsCreateApp']>(
		'apps',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);
	await logEventFromContext(
		ctx,
		'witai.apps.createApp',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const updateApp: WitAiEndpoints['appsUpdateApp'] = async (
	ctx,
	input,
) => {
	const { app_id, private: isPrivate, ...rest } = input;
	const body: Record<string, unknown> = {
		...rest,
		...(isPrivate !== undefined
			? {
					private:
						typeof isPrivate === 'boolean'
							? isPrivate
								? 'true'
								: 'false'
							: isPrivate,
				}
			: {}),
	};
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsUpdateApp']>(
		`apps/${app_id}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	await logEventFromContext(
		ctx,
		'witai.apps.updateApp',
		{ app_id },
		'completed',
	);
	return result;
};

export const deleteApp: WitAiEndpoints['appsDeleteApp'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsDeleteApp']>(
		`apps/${input.app_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'witai.apps.deleteApp',
		{ app_id: input.app_id },
		'completed',
	);
	return result;
};

export const exportApp: WitAiEndpoints['appsExportApp'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsExportApp']>(
		`apps/${input.app_id}/export`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'witai.apps.exportApp',
		{ app_id: input.app_id },
		'completed',
	);
	return result;
};

export const listTags: WitAiEndpoints['appsListTags'] = async (ctx, input) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['appsListTags']>(
		`apps/${input.app_id}/tags`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'witai.apps.listTags',
		{ app_id: input.app_id },
		'completed',
	);
	return result;
};
