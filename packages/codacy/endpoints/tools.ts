import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import { ToolListOutputSchema } from './types';

/**
 * Retrieve the list of analysis tools available on Codacy.
 *
 * API: GET /tools
 * Docs: https://api.codacy.com/api/api-docs
 */
export const list: CodacyEndpoints['toolList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['toolList'],
): Promise<CodacyEndpointOutputs['toolList']> => {
	const token = await getCodacyCredentials(ctx);
	const { cursor, limit } = input;

	const response = await makeCodacyRequest<CodacyEndpointOutputs['toolList']>(
		'/tools',
		token,
		{
			query: { cursor, limit },
		},
	);

	const parsed = ToolListOutputSchema.parse(response);

	if (ctx.db.tools) {
		try {
			for (const tool of parsed.data) {
				await ctx.db.tools.upsertByEntityId(tool.uuid, { ...tool });
			}
		} catch (error) {
			console.warn('Failed to save tools to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.tools.list',
		{ ...input },
		'completed',
	);
	return parsed;
};
