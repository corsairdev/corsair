import { logEventFromContext } from '../../utils/events';
import type { AmplitudeEndpoints } from '..';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const list: AmplitudeEndpoints['annotationsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['annotationsList']
	>('/api/2/annotations', ctx.key, {
		method: 'GET',
		query: {
			app_id: input.app_id,
		},
	});

	await logEventFromContext(
		ctx,
		'amplitude.annotations.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: AmplitudeEndpoints['annotationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['annotationsCreate']
	>('/api/2/annotations', ctx.key, {
		method: 'POST',
		body: {
			date: input.date,
			label: input.label,
			details: input.details,
			app_id: input.app_id,
		},
	});

	await logEventFromContext(
		ctx,
		'amplitude.annotations.create',
		{ ...input },
		'completed',
	);
	return result;
};
