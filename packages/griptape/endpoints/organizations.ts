import { logEventFromContext } from 'corsair/core';
import type { GriptapeEndpointOutputs, GriptapeEndpoints } from '..';
import { makeGriptapeRequest } from '../client';

export const list: GriptapeEndpoints['organizationList'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['organizationList']
	>('organizations', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	await logEventFromContext(
		ctx,
		'griptape.organization.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: GriptapeEndpoints['organizationGet'] = async (ctx, input) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['organizationGet']
	>(`organizations/${input.organization_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.organization.get',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: GriptapeEndpoints['organizationUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['organizationUpdate']
	>(`organizations/${input.organization_id}`, ctx.key, {
		method: 'PATCH',
		body: input.body,
	});

	await logEventFromContext(
		ctx,
		'griptape.organization.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const listApiKeys: GriptapeEndpoints['organizationListApiKeys'] = async (
	ctx,
	input,
) => {
	const response = await makeGriptapeRequest<
		GriptapeEndpointOutputs['organizationListApiKeys']
	>(`organizations/${input.organization_id}/api-keys`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'griptape.organization.listApiKeys',
		{ ...input },
		'completed',
	);

	return response;
};

export const createApiKey: GriptapeEndpoints['organizationCreateApiKey'] =
	async (ctx, input) => {
		const response = await makeGriptapeRequest<
			GriptapeEndpointOutputs['organizationCreateApiKey']
		>(`organizations/${input.organization_id}/api-keys`, ctx.key, {
			method: 'POST',
			body: input.body,
		});

		await logEventFromContext(
			ctx,
			'griptape.organization.createApiKey',
			{ ...input },
			'completed',
		);

		return response;
	};
