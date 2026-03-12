import { logEventFromContext } from '../../utils/events';
import type { ExaEndpoints } from '..';
import { makeExaRequest } from '../client';
import type { ExaEndpointOutputs } from './types';

export const getAnswer: ExaEndpoints['answerGet'] = async (ctx, input) => {
	const result = await makeExaRequest<ExaEndpointOutputs['answerGet']>(
		'answer',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (result.citations && ctx.db.searchResults) {
		try {
			for (const citation of result.citations) {
				await ctx.db.searchResults.upsertByEntityId(citation.id, {
					...citation,
					query: input.query,
					createdAt: citation.publishedDate
						? new Date(citation.publishedDate)
						: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save answer citations to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'exa.answer.get',
		{ query: input.query },
		'completed',
	);
	return result;
};
