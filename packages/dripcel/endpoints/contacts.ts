import { logEventFromContext } from 'corsair/core';
import type { DripcelEndpoints } from '..';
import { makeDripcelRequest } from '../client';
import type { DripcelEndpointOutputs } from './types';

export const get: DripcelEndpoints['getContact'] = async (ctx, input) => {
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['getContact']
	>(`/contacts/${encodeURIComponent(input.cell)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dripcel.contacts.get',
		{ cell: input.cell },
		'completed',
	);
	return response;
};

function uploadResult(raw: {
	validContacts?: number;
	validContact?: number;
	invalidContacts?: unknown[];
}): DripcelEndpointOutputs['createContacts'] {
	return {
		validContacts: raw.validContacts ?? raw.validContact ?? 0,
		invalidContacts: raw.invalidContacts ?? [],
	};
}

export const create: DripcelEndpoints['createContacts'] = async (
	ctx,
	input,
) => {
	const response = await makeDripcelRequest<{
		validContacts?: number;
		validContact?: number;
		invalidContacts?: unknown[];
	}>('/contacts', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'dripcel.contacts.create',
		{ count: input.contacts.length },
		'completed',
	);
	return uploadResult(response ?? {});
};

export const upsert: DripcelEndpoints['upsertContacts'] = async (
	ctx,
	input,
) => {
	const response = await makeDripcelRequest<{
		validContacts?: number;
		validContact?: number;
		invalidContacts?: unknown[];
	}>('/contacts', ctx.key, {
		method: 'PUT',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'dripcel.contacts.upsert',
		{ count: input.contacts.length },
		'completed',
	);
	return uploadResult(response ?? {});
};

export const deleteContact: DripcelEndpoints['deleteContact'] = async (
	ctx,
	input,
) => {
	await makeDripcelRequest<undefined>(
		`/contacts/${encodeURIComponent(input.cell)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'dripcel.contacts.delete',
		{ cell: input.cell },
		'completed',
	);
	return { ok: true as const };
};

export const addTags: DripcelEndpoints['addContactTags'] = async (
	ctx,
	input,
) => {
	const { cell, ...body } = input;
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['addContactTags']
	>(`/contacts/${encodeURIComponent(cell)}/tag/add`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'dripcel.contacts.addTags',
		{ cell },
		'completed',
	);
	return response;
};

export const optOut: DripcelEndpoints['optOutContact'] = async (ctx, input) => {
	const { cell, ...body } = input;
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['optOutContact']
	>(`/contacts/${encodeURIComponent(cell)}/optOut`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dripcel.contacts.optOut',
		{ cell },
		'completed',
	);
	return response;
};
