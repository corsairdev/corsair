import { logEventFromContext } from '../../utils/events';
import type { AmplitudeEndpoints } from '..';
import { makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const get: AmplitudeEndpoints['chartsGet'] = async (ctx, input) => {
	const result = await makeAmplitudeRequest<AmplitudeEndpointOutputs['chartsGet']>(
		`/api/3/chart/${input.chart_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'amplitude.charts.get', { ...input }, 'completed');
	return result;
};
