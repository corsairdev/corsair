import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['sequenceFollowUpsList'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceFollowUpsList.parse(input);
	const { sequence_id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsList']
	>(`/sequences/${sequence_id}/follow-ups`, ctx.key, {
		method: 'GET',
		query,
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.list',
		{ sequenceId: sequence_id },
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['sequenceFollowUpsCreate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceFollowUpsCreate.parse(input);
	const { sequence_id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsCreate']
	>(`/sequences/${sequence_id}/follow-ups`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.create',
		{ sequenceId: sequence_id },
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['sequenceFollowUpsGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequenceFollowUpsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsGet']
	>(`/sequences/${parsed.sequence_id}/follow-ups/${parsed.id}`, ctx.key, {
		method: 'GET',
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.get',
		{ sequenceId: parsed.sequence_id, id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const update: HunterioEndpoints['sequenceFollowUpsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceFollowUpsUpdate.parse(input);
	const { sequence_id, id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsUpdate']
	>(`/sequences/${sequence_id}/follow-ups/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.update',
		{ sequenceId: sequence_id, id },
		'completed',
	);

	return parsedResponse;
};

export const replace: HunterioEndpoints['sequenceFollowUpsReplace'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceFollowUpsReplace.parse(input);
	const { sequence_id, id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsReplace']
	>(`/sequences/${sequence_id}/follow-ups/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsReplace.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.replace',
		{ sequenceId: sequence_id, id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['sequenceFollowUpsDelete'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceFollowUpsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceFollowUpsDelete']
	>(`/sequences/${parsed.sequence_id}/follow-ups/${parsed.id}`, ctx.key, {
		method: 'DELETE',
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceFollowUpsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceFollowUps.delete',
		{ sequenceId: parsed.sequence_id, id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
