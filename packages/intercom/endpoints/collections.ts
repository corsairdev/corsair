import { logEventFromContext } from 'corsair/core';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const get: IntercomEndpoints['collectionsGet'] = async (ctx, input) => {
	const { id, ...query } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['collectionsGet']
	>(`help_center/collections/${id}`, ctx.key, {
		query,
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'intercom.collections.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: IntercomEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['collectionsList']
	>('help_center/collections', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'intercom.collections.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: IntercomEndpoints['collectionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['collectionsCreate']
	>('help_center/collections', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'intercom.collections.create',
		{ name: input.name },
		'completed',
	);
	return result;
};

export const update: IntercomEndpoints['collectionsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['collectionsUpdate']
	>(`help_center/collections/${id}`, ctx.key, {
		method: 'PUT',
		body: body,
	});

	await logEventFromContext(
		ctx,
		'intercom.collections.update',
		{ id },
		'completed',
	);
	return result;
};

export const deleteCollection: IntercomEndpoints['collectionsDelete'] = async (
	ctx,
	input,
) => {
	const { id } = input;
	const result = await makeIntercomRequest<
		IntercomEndpointOutputs['collectionsDelete']
	>(`help_center/collections/${id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'intercom.collections.delete',
		{ ...input },
		'completed',
	);
	return result;
};
