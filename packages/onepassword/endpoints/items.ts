import { logEventFromContext } from 'corsair/core';
import type { OnePasswordEndpoints } from '..';
import { makeOnePasswordRequest } from '../client';
import type { OnePasswordEndpointOutputs } from './types';

export const list: OnePasswordEndpoints['itemsList'] = async (
	ctx,
	input,
) => {
	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['itemsList']
	>(
		ctx.options.connectUrl,
		`v1/vaults/${input.vaultId}/items`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'onepassword.items.list',
		input,
		'completed',
	);
	return response;
};

export const get: OnePasswordEndpoints['itemsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['itemsGet']
	>(
		ctx.options.connectUrl,
		`v1/vaults/${input.vaultId}/items/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'onepassword.items.get',
		input,
		'completed',
	);
	return response;
};

export const create: OnePasswordEndpoints['itemsCreate'] = async (
	ctx,
	input,
) => {
	const body = {
		title: input.title,
		category: input.category,
		vault: { id: input.vaultId },
		urls: input.urls,
		fields: input.fields,
	};

	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['itemsCreate']
	>(
		ctx.options.connectUrl,
		`v1/vaults/${input.vaultId}/items`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'onepassword.items.create',
		{ vaultId: input.vaultId, title: input.title, category: input.category },
		'completed',
	);
	return response;
};

export const update: OnePasswordEndpoints['itemsUpdate'] = async (
	ctx,
	input,
) => {
	const body = {
		id: input.id,
		vault: { id: input.vaultId },
		title: input.title,
		category: input.category,
		urls: input.urls,
		fields: input.fields,
	};

	const response = await makeOnePasswordRequest<
		OnePasswordEndpointOutputs['itemsUpdate']
	>(
		ctx.options.connectUrl,
		`v1/vaults/${input.vaultId}/items/${input.id}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'onepassword.items.update',
		{ vaultId: input.vaultId, id: input.id },
		'completed',
	);
	return response;
};

export const deleteItem: OnePasswordEndpoints['itemsDelete'] = async (
	ctx,
	input,
) => {
	await makeOnePasswordRequest<void>(
		ctx.options.connectUrl,
		`v1/vaults/${input.vaultId}/items/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'onepassword.items.delete',
		input,
		'completed',
	);
	return { success: true };
};
