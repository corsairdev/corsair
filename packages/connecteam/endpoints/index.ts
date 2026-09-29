import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { ConnecteamEndpointOutputs } from './types';

function api<K extends keyof ConnecteamEndpointOutputs>(
	path: string,
	key: string,
	options?: Parameters<typeof makeConnecteamRequest>[2],
) {
	return makeConnecteamRequest<ConnecteamEndpointOutputs[K]>(
		path,
		key,
		options,
	);
}

export const listMe: ConnecteamEndpoints['listMe'] = async (ctx) => {
	const response = await api<'listMe'>('me', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'connecteam.me.list', {}, 'completed');
	return response;
};

export const getUsers: ConnecteamEndpoints['getUsers'] = async (ctx, input) => {
	const response = await api<'getUsers'>('users/v1/users', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'connecteam.users.get',
		{ limit: input.limit, offset: input.offset },
		'completed',
	);
	return response;
};

export const createUsers: ConnecteamEndpoints['createUsers'] = async (
	ctx,
	input,
) => {
	const response = await api<'createUsers'>('users/v1/users', ctx.key, {
		method: 'POST',
		query:
			input.sendActivation === undefined
				? undefined
				: { sendActivation: input.sendActivation },
		body: input.users,
	});
	await logEventFromContext(
		ctx,
		'connecteam.users.create',
		{ count: input.users.length },
		'completed',
	);
	return response;
};

export const archiveUsers: ConnecteamEndpoints['archiveUsers'] = async (
	ctx,
	input,
) => {
	const response = await api<'archiveUsers'>('users/v1/users', ctx.key, {
		method: 'DELETE',
		query: { deletionType: 'archive' },
		body: { userIds: input.userIds },
	});
	await logEventFromContext(
		ctx,
		'connecteam.users.archive',
		{ count: input.userIds.length },
		'completed',
	);
	return response;
};

export const generateUploadUrl: ConnecteamEndpoints['generateUploadUrl'] =
	async (ctx, input) => {
		const response = await api<'generateUploadUrl'>(
			'attachments/v1/files/generate-upload-url',
			ctx.key,
			{
				method: 'POST',
				body: {
					fileName: input.fileName,
					featureType: input.featureType,
					...(input.fileTypeHint ? { fileTypeHint: input.fileTypeHint } : {}),
				},
			},
		);
		await logEventFromContext(
			ctx,
			'connecteam.attachments.generateUploadUrl',
			{ featureType: input.featureType },
			'completed',
		);
		return response;
	};

export const getChat: ConnecteamEndpoints['getChat'] = async (ctx, input) => {
	const response = await api<'getChat'>('chat/v1/conversations', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'connecteam.chat.get', {}, 'completed');
	return response;
};

export const getCustomFieldCategories: ConnecteamEndpoints['getCustomFieldCategories'] =
	async (ctx, input) => {
		const response = await api<'getCustomFieldCategories'>(
			'users/v1/custom-field-categories',
			ctx.key,
			{ method: 'GET', query: input },
		);
		await logEventFromContext(
			ctx,
			'connecteam.customFieldCategories.get',
			{},
			'completed',
		);
		return response;
	};

export const getCustomFields: ConnecteamEndpoints['getCustomFields'] = async (
	ctx,
	input,
) => {
	const response = await api<'getCustomFields'>(
		'users/v1/custom-fields',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await logEventFromContext(
		ctx,
		'connecteam.customFields.get',
		{},
		'completed',
	);
	return response;
};

export const getForms: ConnecteamEndpoints['getForms'] = async (ctx, input) => {
	const response = await api<'getForms'>('forms/v1/forms', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'connecteam.forms.get', {}, 'completed');
	return response;
};

export const getJobs: ConnecteamEndpoints['getJobs'] = async (ctx, input) => {
	const response = await api<'getJobs'>('jobs/v1/jobs', ctx.key, {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(ctx, 'connecteam.jobs.get', {}, 'completed');
	return response;
};

export const getPerformanceIndicators: ConnecteamEndpoints['getPerformanceIndicators'] =
	async (ctx) => {
		const response = await api<'getPerformanceIndicators'>(
			'users/v1/performance-indicators',
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'connecteam.performanceIndicators.get',
			{},
			'completed',
		);
		return response;
	};

export const getPolicyTypes: ConnecteamEndpoints['getPolicyTypes'] = async (
	ctx,
) => {
	const response = await api<'getPolicyTypes'>(
		'time-off/v1/policy-types',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'connecteam.policyTypes.get', {}, 'completed');
	return response;
};

export const getPublishers: ConnecteamEndpoints['getPublishers'] = async (
	ctx,
) => {
	const response = await api<'getPublishers'>(
		'publishers/v1/publishers',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'connecteam.publishers.get', {}, 'completed');
	return response;
};

export const getSchedulers: ConnecteamEndpoints['getSchedulers'] = async (
	ctx,
) => {
	const response = await api<'getSchedulers'>(
		'scheduler/v1/schedulers',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'connecteam.schedulers.get', {}, 'completed');
	return response;
};

export const getSmartGroups: ConnecteamEndpoints['getSmartGroups'] = async (
	ctx,
	input,
) => {
	const response = await api<'getSmartGroups'>(
		'users/v1/smart-groups',
		ctx.key,
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'connecteam.smartGroups.get', {}, 'completed');
	return response;
};

export const getTaskBoards: ConnecteamEndpoints['getTaskBoards'] = async (
	ctx,
) => {
	const response = await api<'getTaskBoards'>('tasks/v1/taskboards', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'connecteam.taskBoards.get', {}, 'completed');
	return response;
};
