import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import { makeBenzingaRequest } from '../client';
import { persistEntities } from './persist';
import type { BenzingaEndpointOutputs } from './types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './types';

export const listRemovedCalendarEvents: BenzingaEndpoints['listRemovedCalendarEvents'] =
	async (ctx, rawInput) => {
		const input =
			BenzingaEndpointInputSchemas.listRemovedCalendarEvents.parse(rawInput);
		const raw = await makeBenzingaRequest<
			BenzingaEndpointOutputs['listRemovedCalendarEvents']
		>('/api/v2.1/calendar-removed/', ctx.key, {
			page: input.page,
			pageSize: input.pageSize,
			type: input.type,
			updated: input.updated,
		});
		const response =
			BenzingaEndpointOutputSchemas.listRemovedCalendarEvents.parse(raw);

		await persistEntities(
			ctx.db.removedCalendarEvents,
			response.removed,
			(r) => r.id,
		);

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
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.listRemovedNews.parse(rawInput);
	const raw = await makeBenzingaRequest<
		BenzingaEndpointOutputs['listRemovedNews']
	>('/api/v2/news-removed', ctx.key, {
		page: input.page,
		pageSize: input.pageSize,
		updatedSince: input.updatedSince,
	});
	const response = BenzingaEndpointOutputSchemas.listRemovedNews.parse(raw);

	await persistEntities(
		ctx.db.removedNewsItems,
		Object.values(response).flat(),
		(r) => String(r.id),
	);

	await logEventFromContext(
		ctx,
		'benzinga.news.listRemoved',
		{ ...input },
		'completed',
	);

	return response;
};
