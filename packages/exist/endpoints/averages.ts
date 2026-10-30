import { logEventFromContext } from 'corsair/core';
import { compactQuery, toCommaList, toFlag } from '../client';
import type { ExistEndpoints } from '../index';
import { parseExistInput, validatedExistRequest } from './validate';

/**
 * Get weekly average values per attribute, optionally including history.
 * @see https://developer.exist.io/reference/averages/
 */
export const list: ExistEndpoints['averagesList'] = async (ctx, input) => {
	const parsed = parseExistInput('averagesList', input);
	const result = await validatedExistRequest('averagesList', 'averages/', ctx, {
		method: 'GET',
		query: compactQuery({
			page: parsed.page,
			limit: parsed.limit,
			date_min: parsed.date_min,
			date_max: parsed.date_max,
			groups: toCommaList(parsed.groups),
			attributes: toCommaList(parsed.attributes),
			include_historical: toFlag(parsed.include_historical),
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
