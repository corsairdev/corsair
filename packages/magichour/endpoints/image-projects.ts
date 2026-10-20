import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

export const getDetails: MagicHourEndpoints['imageProjectsGetDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imageProjectsGetDetails.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imageProjectsGetDetails']
	>(`/v1/image-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed =
		MagicHourEndpointOutputSchemas.imageProjectsGetDetails.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.imageProjects.getDetails',
		{ id: parsedInput.id, status: parsed.status },
		'completed',
	);

	return parsed;
};

export const deleteImage: MagicHourEndpoints['imageProjectsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.imageProjectsDelete.parse(input);

	// DELETE returns 204 No Content; the output schema is z.void().
	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['imageProjectsDelete']
	>(`/v1/image-projects/${encodeURIComponent(parsedInput.id)}`, ctx.key, {
		method: 'DELETE',
	});

	MagicHourEndpointOutputSchemas.imageProjectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.imageProjects.delete',
		{ id: parsedInput.id },
		'completed',
	);
};
