import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const attach: HunterioEndpoints['leadTagsAttach'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadTagsAttach.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadTagsAttach']
	>(`/leads/${parsed.id}/tags`, ctx.key, {
		method: 'POST',
		body: { tag_id: parsed.tag_id },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadTagsAttach.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadTags.attach',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const detach: HunterioEndpoints['leadTagsDetach'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.leadTagsDetach.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['leadTagsDetach']
	>(`/leads/${parsed.id}/tags/${parsed.tag_id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.leadTagsDetach.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.leadTags.detach',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
