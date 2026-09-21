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
	RepositoryLanguagesOutputSchema,
	RepositoryOutputSchema,
} from './types';

/**
 * List all repositories accessible by the authenticated user.
 *
 * API: GET /repositories
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const list: CodacyEndpoints['repositoryList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryList'],
): Promise<CodacyEndpointOutputs['repositoryList']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof RepositoryOutputSchema>
	>('/repositories', token, { query: input });

	const parsed = RepositoryOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.repositories.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single repository by ID.
 *
 * API: GET /repositories/:repository_id
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const get: CodacyEndpoints['repositoryGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryGet'],
): Promise<CodacyEndpointOutputs['repositoryGet']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof CodacyEndpointOutputSchemas.repositoryGet>
	>(`/repositories/${input.repository_id}`, token);

	const parsed = CodacyEndpointOutputSchemas.repositoryGet.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.repositories.get',
		{ repository_id: input.repository_id },
		'completed',
	);
	return parsed;
};

/**
 * Get repository languages statistics.
 *
 * API: GET /repositories/:repository_id/languages
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const languages: CodacyEndpoints['repositoryLanguages'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryLanguages'],
): Promise<CodacyEndpointOutputs['repositoryLanguages']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		z.infer<typeof RepositoryLanguagesOutputSchema>
	>(`/repositories/${input.repository_id}/languages`, token);

	const parsed = RepositoryLanguagesOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.repositories.languages',
		{ repository_id: input.repository_id },
		'completed',
	);
	return parsed;
};
