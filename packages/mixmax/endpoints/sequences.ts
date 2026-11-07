import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const sequencesList: MixmaxEndpoints['sequencesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesList']
	>('/v1/sequences', ctx.key, {
		method: 'GET',
		query: {
			name: input.name,
			folder: input.folder,
			expand: input.expand,
			fields: input.fields,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesGetRecipients: MixmaxEndpoints['sequencesGetRecipients'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesGetRecipients']
	>(`/v1/sequences/${input.id}/recipients`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.getRecipients',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesAddRecipients: MixmaxEndpoints['sequencesAddRecipients'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesAddRecipients']
	>(`/v1/sequences/${input.id}/recipients`, ctx.key, {
		method: 'POST',
		body: {
			recipients: input.recipients,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.addRecipients',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesGet: MixmaxEndpoints['sequencesGet'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesGet']
	>(`/v1/sequences/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'mixmax.sequences.get', { ...input }, 'completed');
	return result;
};

export const sequencesCreate: MixmaxEndpoints['sequencesCreate'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesCreate']
	>('/v1/sequences', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			folder: input.folder,
			expand: input.expand,
			fields: input.fields,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesUpdate: MixmaxEndpoints['sequencesUpdate'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesUpdate']
	>(`/v1/sequences/${input.id}`, ctx.key, {
		method: 'PATCH',
		body: {
			name: input.name,
			folder: input.folder,
			expand: input.expand,
			fields: input.fields,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesDelete: MixmaxEndpoints['sequencesDelete'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesDelete']
	>(`/v1/sequences/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'mixmax.sequences.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const sequencesPause: MixmaxEndpoints['sequencesPause'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesPause']
	>(`/v1/sequences/${input.id}/pause`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(ctx, 'mixmax.sequences.pause', { ...input }, 'completed');
	return result;
};

export const sequencesResume: MixmaxEndpoints['sequencesResume'] = async (ctx, input) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['sequencesResume']
	>(`/v1/sequences/${input.id}/resume`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(ctx, 'mixmax.sequences.resume', { ...input }, 'completed');
	return result;
};
