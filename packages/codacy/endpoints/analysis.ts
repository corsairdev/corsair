import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import {
	CodacyEndpointOutputSchemas,
	PatternOutputSchema,
	ToolOutputSchema,
} from './types';

/**
 * Get the analysis configuration for a repository.
 *
 * API: GET /repositories/:repository_id/analysis
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const getConfig: CodacyEndpoints['analysisConfigGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['analysisConfigGet'],
): Promise<CodacyEndpointOutputs['analysisConfigGet']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof CodacyEndpointOutputSchemas.analysisConfigGet>
	>(`/repositories/${input.repository_id}/analysis`, token);

	const parsed = CodacyEndpointOutputSchemas.analysisConfigGet.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.analysis.getConfig',
		{ repository_id: input.repository_id },
		'completed',
	);
	return parsed;
};

/**
 * List all available analysis tools.
 *
 * API: GET /tools
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const listTools: CodacyEndpoints['toolList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['toolList'],
): Promise<CodacyEndpointOutputs['toolList']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<z.infer<typeof ToolOutputSchema>>(
		'/tools',
		token,
		{ query: input },
	);

	const parsed = ToolOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.tools.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List all available analysis patterns.
 *
 * API: GET /patterns
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const listPatterns: CodacyEndpoints['patternList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['patternList'],
): Promise<CodacyEndpointOutputs['patternList']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<z.infer<typeof PatternOutputSchema>>(
		'/patterns',
		token,
		{ query: input },
	);

	const parsed = PatternOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.patterns.list',
		{ ...input },
		'completed',
	);
	return parsed;
};
