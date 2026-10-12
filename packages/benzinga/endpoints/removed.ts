import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import type { BenzingaEndpointOutputs } from './types';

export const listRemovedCalendarEvents: BenzingaEndpoints['listRemovedCalendarEvents'] =
	async (ctx, input) => {
		const response = await makeBenzingaRequest<
			BenzingaEndpointOutputs['listRemovedCalendarEvents']
		>('/api/v2.1/calendar-removed/', ctx.key, {
			page: input.page,
			pageSize: input.pageSize,
			type: input.type,
			updated: input.updated,
		});

		await logEventFromContext(
			ctx,
			'benzinga.calendar.listRemoved',
			{ ...input },
			'completed',
		);

		return response;
	};

export const listRemovedNews: BenzingaEndpoints['listRemovedNews'] = async (
	ctx,
	input,
) => {
	const response = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listRemovedNews']
	>('/api/v2/news-removed', ctx.key, {
		page: input.page,
		pageSize: input.pageSize,
		updatedSince: input.updatedSince,
	});

	await logEventFromContext(
		ctx,
		'benzinga.news.listRemoved',
		{ ...input },
		'completed',
	);

	return response;
};
