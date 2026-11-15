import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const getDetails: MagicHourEndpoints['videoProjectsGetDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videoProjectsGetDetails.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videoProjectsGetDetails']
	>(`/v1/video-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed =
		MagicHourEndpointOutputSchemas.videoProjectsGetDetails.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videoProjects.getDetails',
		{ id: parsedInput.id, status: parsed.status },
		'completed',
	);

	return parsed;
};

export const deleteVideo: MagicHourEndpoints['videoProjectsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videoProjectsDelete.parse(input);

	// DELETE returns 204 No Content; the output schema is z.void().
	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videoProjectsDelete']
	>(`/v1/video-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'DELETE',
	});

	MagicHourEndpointOutputSchemas.videoProjectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videoProjects.delete',
		{ id: parsedInput.id },
		'completed',
	);
};
