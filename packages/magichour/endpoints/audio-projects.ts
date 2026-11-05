import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const getDetails: MagicHourEndpoints['audioProjectsGetDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.audioProjectsGetDetails.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['audioProjectsGetDetails']
	>(`/v1/audio-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed =
		MagicHourEndpointOutputSchemas.audioProjectsGetDetails.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.audioProjects.getDetails',
		{ id: parsedInput.id, status: parsed.status },
		'completed',
	);

	return parsed;
};

export const deleteAudio: MagicHourEndpoints['audioProjectsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.audioProjectsDelete.parse(input);

	// DELETE returns 204 No Content; the output schema is z.void().
	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['audioProjectsDelete']
	>(`/v1/audio-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'DELETE',
	});

	MagicHourEndpointOutputSchemas.audioProjectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.audioProjects.delete',
		{ id: parsedInput.id },
		'completed',
	);
};
