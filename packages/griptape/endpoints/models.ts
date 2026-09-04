import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const listModels: GriptapeEndpoints['modelList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelList']
	>('models', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.model.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const createModel: GriptapeEndpoints['modelCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelCreate']
	>('models', ctx.key, {
		method: 'POST',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.model.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const getModel: GriptapeEndpoints['modelGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelGet']
	>(`models/${input.model_config_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.model.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateModel: GriptapeEndpoints['modelUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelUpdate']
	>(`models/${input.model_config_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.model.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const removeModel: GriptapeEndpoints['modelDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelDelete']
	>(`models/${input.model_config_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'griptape.model.delete',
		{ ...input },
		'completed',
	);

	return response;
};

export const listAuthConfigs: GriptapeEndpoints['modelListAuthConfigs'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['modelListAuthConfigs']
		>('models/auth-configs', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		await logEventFromContext(
			ctx,
			'griptape.model.listAuthConfigs',
			{ ...input },
			'completed',
		);

		return response;
	};

export const createAuthConfig: GriptapeEndpoints['modelCreateAuthConfig'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['modelCreateAuthConfig']
		>('models/auth-configs', ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.model.createAuthConfig',
			// Never persist the auth-config body (CWE-532): it can carry
			// provider credentials.
			{},
			'completed',
		);

		return response;
	};

export const getAuthConfig: GriptapeEndpoints['modelGetAuthConfig'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['modelGetAuthConfig']
	>(`models/auth-configs/${input.auth_config_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.model.getAuthConfig',
		{ ...input },
		'completed',
	);

	return response;
};

export const updateAuthConfig: GriptapeEndpoints['modelUpdateAuthConfig'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['modelUpdateAuthConfig']
		>(`models/auth-configs/${input.auth_config_id}`, ctx.key, {
			method: 'PATCH',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.model.updateAuthConfig',
			// Never persist the auth-config body (CWE-532): it can carry
			// provider credentials.
			{ auth_config_id: input.auth_config_id },
			'completed',
		);

		return response;
	};

export const removeAuthConfig: GriptapeEndpoints['modelDeleteAuthConfig'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['modelDeleteAuthConfig']
		>(`models/auth-configs/${input.auth_config_id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'griptape.model.deleteAuthConfig',
			{ ...input },
			'completed',
		);

		return response;
	};
