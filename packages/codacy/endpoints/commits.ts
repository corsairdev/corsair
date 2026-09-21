import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import { CommitOutputSchema, IssueOutputSchema } from './types';

/**
 * List commits for a repository.
 *
 * API: GET /repositories/:repository_id/commits
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const list: CodacyEndpoints['commitList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['commitList'],
): Promise<CodacyEndpointOutputs['commitList']> => {
	const token = await getCodacyCredentials(ctx);
	const { repository_id, branch, ...query } = input;

	const response = await makeCodacyRequest<z.infer<typeof CommitOutputSchema>>(
		`/repositories/${repository_id}/commits`,
		token,
		{ query: { ...query, branch } },
	);

	const parsed = CommitOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.commits.list',
		{ repository_id, branch, ...query },
		'completed',
	);
	return parsed;
};

/**
 * List issues for a repository.
 *
 * API: GET /repositories/:repository_id/issues
 * Docs: https://docs.codacy.com/codacy-api/using-the-codacy-api/
 */
export const listIssues: CodacyEndpoints['issueList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['issueList'],
): Promise<CodacyEndpointOutputs['issueList']> => {
	const token = await getCodacyCredentials(ctx);
	const { repository_id, ...query } = input;

	const response = await makeCodacyRequest<z.infer<typeof IssueOutputSchema>>(
		`/repositories/${repository_id}/issues`,
		token,
		{ query },
	);

	const parsed = IssueOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.issues.list',
		{ repository_id, ...query },
		'completed',
	);
	return parsed;
};
