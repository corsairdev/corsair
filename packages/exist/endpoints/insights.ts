import { logEventFromContext } from 'corsair/core';
import { compactQuery } from '../client';
import type { ExistEndpoints } from '../index';
import { parseExistInput, validatedExistRequest } from './validate';

/**
 * List the insights Exist has generated about the user's data.
 * @see https://developer.exist.io/reference/insights/
 */
export const list: ExistEndpoints['insightsList'] = async (ctx, input) => {
	const parsed = parseExistInput('insightsList', input);
	const result = await validatedExistRequest('insightsList', 'insights/', ctx, {
		method: 'GET',
		query: compactQuery({
			page: parsed.page,
			limit: parsed.limit,
			date_min: parsed.date_min,
			date_max: parsed.date_max,
			priority: parsed.priority,
		}),
	});

	if (ctx.db.insights) {
		try {
			for (const insight of result.results) {
				const id = `${insight.type.name}:${insight.target_date ?? insight.created}`;
				await ctx.db.insights.upsertByEntityId(id, {
					id,
					type_name: insight.type.name,
					target_date: insight.target_date,
					created: insight.created,
					attribute: insight.type.attribute?.name ?? null,
					text: insight.text,
					html: insight.html,
				});
			}
		} catch (error) {
			console.warn('Failed to save Exist insights to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exist.insights.list',
		{ ...input },
		'completed',
	);
	return result;
};
