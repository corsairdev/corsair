import { logEventFromContext } from 'corsair/core';
import { compactQuery, makeAuthenticatedExistRequest, toFlag } from '../client';
import type { ExistEndpoints } from '../index';
import type { ExistEndpointOutputs } from './types';

/**
 * List the correlations Exist has computed between the user's attributes.
 * @see https://developer.exist.io/reference/correlations/
 */
export const list: ExistEndpoints['correlationsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedExistRequest<
		ExistEndpointOutputs['correlationsList']
	>('correlations/', ctx, {
		method: 'GET',
		query: compactQuery({
			page: input.page,
			limit: input.limit,
			strong: toFlag(input.strong),
			confident: toFlag(input.confident),
			attribute: input.attribute,
		}),
	});

	if (ctx.db.correlations) {
		try {
			for (const correlation of result.results) {
				const id = `${correlation.attribute}:${correlation.attribute2}:${correlation.date}`;
				await ctx.db.correlations.upsertByEntityId(id, {
					id,
					attribute: correlation.attribute,
					attribute2: correlation.attribute2,
					date: correlation.date,
					period: correlation.period,
					offset: correlation.offset,
					value: correlation.value,
					p: correlation.p,
					percentage: correlation.percentage,
					stars: correlation.stars,
					second_person: correlation.second_person,
					strength_description: correlation.strength_description ?? null,
					stars_description: correlation.stars_description ?? null,
				});
			}
		} catch (error) {
			console.warn('Failed to save Exist correlations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exist.correlations.list',
		{ ...input },
		'completed',
	);
	return result;
};
