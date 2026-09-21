import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import { PatternGetOutputSchema, PatternListOutputSchema } from './types';

/**
 * Retrieve the list of code patterns of a tool.
 *
 * API: GET /tools/{toolUuid}/patterns
 * Docs: https://api.codacy.com/api/api-docs
 */
export const list: CodacyEndpoints['patternList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['patternList'],
): Promise<CodacyEndpointOutputs['patternList']> => {
	const token = await getCodacyCredentials(ctx);
	const { tool_uuid, cursor, limit, enabled, search } = input;

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['patternList']
	>(`/tools/${tool_uuid}/patterns`, token, {
		query: { cursor, limit, enabled, search },
	});

	const parsed = PatternListOutputSchema.parse(response);

	if (ctx.db.patterns) {
		try {
			for (const pattern of parsed.data) {
				await ctx.db.patterns.upsertByEntityId(`${tool_uuid}/${pattern.id}`, {
					...pattern,
				});
			}
		} catch (error) {
			console.warn('Failed to save patterns to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.patterns.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Retrieve the definition of a single code pattern of a tool.
 *
 * API: GET /tools/{toolUuid}/patterns/{patternId}
 * Docs: https://api.codacy.com/api/api-docs
 */
export const get: CodacyEndpoints['patternGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['patternGet'],
): Promise<CodacyEndpointOutputs['patternGet']> => {
	const token = await getCodacyCredentials(ctx);
	const { tool_uuid, pattern_id } = input;

	const response = await makeCodacyRequest<CodacyEndpointOutputs['patternGet']>(
		`/tools/${tool_uuid}/patterns/${pattern_id}`,
		token,
	);

	const parsed = PatternGetOutputSchema.parse(response);

	if (ctx.db.patterns) {
		try {
			await ctx.db.patterns.upsertByEntityId(`${tool_uuid}/${parsed.data.id}`, {
				...parsed.data,
			});
		} catch (error) {
			console.warn('Failed to save pattern to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.patterns.get',
		{ tool_uuid, pattern_id },
		'completed',
	);
	return parsed;
};
