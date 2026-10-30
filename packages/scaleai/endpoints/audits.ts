import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';

export const getFixlessAudits: ScaleAiEndpoints['getFixlessAudits'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<unknown>('audits', ctx.key, {
		method: 'GET',
		query: { task_id: input.task_id, id: input.id },
	});
	await logEventFromContext(
		ctx,
		'scaleai.audits.getFixless',
		{ task_id: input.task_id, id: input.id },
		'completed',
	);
	return response;
};
