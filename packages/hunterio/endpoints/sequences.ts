import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['sequencesList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.sequencesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesList']
	>('/sequences', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesList.parse(response);

	await logEventFromContext(ctx, 'hunterio.sequences.list', {}, 'completed');

	return parsedResponse;
};

export const create: HunterioEndpoints['sequencesCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesCreate']
	>('/sequences', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesCreate.parse(response);

	await logEventFromContext(ctx, 'hunterio.sequences.create', {}, 'completed');

	return parsedResponse;
};

export const get: HunterioEndpoints['sequencesGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.sequencesGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesGet']
	>(`/sequences/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['sequencesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesUpdate.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesUpdate']
	>(`/sequences/${id}`, ctx.key, { method: 'PATCH', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.update',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['sequencesReplace'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesReplace.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesReplace']
	>(`/sequences/${id}`, ctx.key, { method: 'PUT', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.replace',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['sequencesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesDelete']
	>(`/sequences/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const start: HunterioEndpoints['sequencesStart'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesStart.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesStart']
	>(`/sequences/${parsed.id}/start`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesStart.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.start',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const pause: HunterioEndpoints['sequencesPause'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesPause.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesPause']
	>(`/sequences/${parsed.id}/pause`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesPause.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.pause',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const resume: HunterioEndpoints['sequencesResume'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesResume.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesResume']
	>(`/sequences/${parsed.id}/pause`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesResume.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.resume',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const archive: HunterioEndpoints['sequencesArchive'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequencesArchive.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesArchive']
	>(`/sequences/${parsed.id}/archive`, ctx.key, { method: 'POST' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesArchive.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequences.archive',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const test: HunterioEndpoints['sequencesTest'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.sequencesTest.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequencesTest']
	>(`/sequences/${id}/test`, ctx.key, { method: 'POST', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequencesTest.parse(response);

	// The test recipient's address is deliberately not logged.
	await logEventFromContext(
		ctx,
		'hunterio.sequences.test',
		{ id },
		'completed',
	);

	return parsedResponse;
};
