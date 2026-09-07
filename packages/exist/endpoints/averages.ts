import { logEventFromContext } from 'corsair/core';
import {
	compactQuery,
	makeAuthenticatedExistRequest,
	toCommaList,
	toFlag,
} from '../client';
import type { ExistEndpoints } from '../index';
import type { ExistEndpointOutputs } from './types';

/**
 * Get weekly average values per attribute, optionally including history.
 * @see https://developer.exist.io/reference/averages/
 */
export const list: ExistEndpoints['averagesList'] = async (ctx, input) => {
	const result = await makeAuthenticatedExistRequest<
		ExistEndpointOutputs['averagesList']
	>('averages/', ctx, {
		method: 'GET',
		query: compactQuery({
			page: input.page,
			limit: input.limit,
			date_min: input.date_min,
			date_max: input.date_max,
			groups: toCommaList(input.groups),
			attributes: toCommaList(input.attributes),
			include_historical: toFlag(input.include_historical),
		}),
	});

	if (ctx.db.averages) {
		try {
			for (const average of result.results) {
				const id = `${average.attribute}:${average.date}`;
				await ctx.db.averages.upsertByEntityId(id, { ...average, id });
			}
		} catch (error) {
			console.warn('Failed to save Exist averages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exist.averages.list',
		{ ...input },
		'completed',
	);
	return result;
};
