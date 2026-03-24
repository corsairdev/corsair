import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const list: FigmaEndpoints['activityLogsList'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['activityLogsList']>(
		`v1/activity_logs`,
		ctx.key,
		{
			method: 'GET',
			query: {
				start_time: input.start_time,
				end_time: input.end_time,
				limit: input.limit,
				order: input.order,
				events: input.events,
			},
		},
	);

	await logEventFromContext(ctx, 'figma.activityLogs.list', { ...input }, 'completed');
	return result;
};
