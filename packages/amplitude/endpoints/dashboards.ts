import { logEventFromContext } from 'corsair/core';
import type { AmplitudeEndpoints } from '..';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const list: AmplitudeEndpoints['dashboardsList'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['dashboardsList']
	>('/api/3/dashboards', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'amplitude.dashboards.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: AmplitudeEndpoints['dashboardsGet'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['dashboardsGet']
	>(`/api/3/dashboards/${input.dashboard_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'amplitude.dashboards.get',
		{ ...input },
		'completed',
	);
	return result;
};
