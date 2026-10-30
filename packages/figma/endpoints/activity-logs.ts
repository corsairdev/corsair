import { logEventFromContext } from 'corsair/core';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpoints } from '../index';
import type { FigmaEndpointOutputs } from './types';

export const list: FigmaEndpoints['activityLogsList'] = async (ctx, input) => {
	const result = await makeFigmaRequest<
		FigmaEndpointOutputs['activityLogsList']
	>(`v1/activity_logs`, ctx.key, { method: 'GET', query: { ...input } });

	await logEventFromContext(
		ctx,
		'figma.activityLogs.list',
		{ ...input },
		'completed',
	);
	return result;
};
