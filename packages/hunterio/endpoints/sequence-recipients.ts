import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['sequenceRecipientsList'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceRecipientsList.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceRecipientsList']
	>(`/sequences/${id}/recipients`, ctx.key, { method: 'GET', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceRecipientsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceRecipients.list',
		{ id },
		'completed',
	);

	return parsedResponse;
};

export const add: HunterioEndpoints['sequenceRecipientsAdd'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceRecipientsAdd.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceRecipientsAdd']
	>(`/sequences/${id}/recipients`, ctx.key, { method: 'POST', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceRecipientsAdd.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceRecipients.add',
		{ id, addedCount: parsedResponse.data.recipients_added },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['sequenceRecipientsRemove'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.sequenceRecipientsRemove.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceRecipientsRemove']
	>(`/sequences/${id}/recipients`, ctx.key, { method: 'DELETE', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceRecipientsRemove.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceRecipients.remove',
		{ id },
		'completed',
	);

	return parsedResponse;
};
