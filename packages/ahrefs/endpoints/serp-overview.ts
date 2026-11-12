import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { checkAhrefsOutput } from './request';
import { AhrefsEndpointInputSchemas } from './types';

export const overview: AhrefsEndpoints['serpOverview'] = async (ctx, input) => {
	const response = checkAhrefsOutput(
		'serpOverview',
		'ahrefs.serp.overview',
		await makeAhrefsRequest<unknown>('/serp-overview/serp-overview', ctx.key, {
			query: AhrefsEndpointInputSchemas.serpOverview.parse(input),
		}),
	);

	for (const position of response.positions) {
		try {
			const entityId = [
				input.country,
				input.keyword,
				input.date ?? 'latest',
				position.position,
			].join(':');

			await ctx.db.serpPositions.upsertByEntityId(entityId, {
				...position,
				country: input.country,
				keyword: input.keyword,
				requestedDate: input.date,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save SERP position ${position.position}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.serp.overview',
		{
			country: input.country,
			keyword: input.keyword,
			resultCount: response.positions.length,
		},
		'completed',
	);

	return response;
};
