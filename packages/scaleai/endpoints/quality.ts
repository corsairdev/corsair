import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';

export const getQualityLabelers: ScaleAiEndpoints['getQualityLabelers'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<unknown>(
			'quality/labelers',
			ctx.key,
			{
				method: 'GET',
				query: {
					quality_task_ids: input.quality_task_ids,
					labeler_emails: input.labeler_emails,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'scaleai.quality.getLabelers',
			{
				quality_task_count: input.quality_task_ids?.length ?? 0,
				labeler_count: input.labeler_emails?.length ?? 0,
			},
			'completed',
		);
		return response;
	};
