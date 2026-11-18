import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import {
	parseEndpointInput,
	RepositoryGetInputSchema,
	RepositoryGetOutputSchema,
	RepositoryLanguagesInputSchema,
	RepositoryLanguagesOutputSchema,
	RepositoryListInputSchema,
	RepositoryListOutputSchema,
} from './types';

/** Path of one repository, with each segment URL-encoded. */
function repositoryPath(
	provider: string,
	organizationName: string,
	repositoryName: string,
): string {
	return `/organizations/${encodeURIComponent(provider)}/${encodeURIComponent(organizationName)}/repositories/${encodeURIComponent(repositoryName)}`;
}

function repositoryEntityId(input: {
	provider: string;
	owner: string;
	name: string;
}): string {
	return `${input.provider}/${input.owner}/${input.name}`;
}

/**
 * List repositories of an organization for the authenticated user.
 *
 * API: GET /organizations/{provider}/{remoteOrganizationName}/repositories
 * Docs: https://api.codacy.com/api/api-docs
 */
export const list: CodacyEndpoints['repositoryList'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryList'],
): Promise<CodacyEndpointOutputs['repositoryList']> => {
	const valid = parseEndpointInput(RepositoryListInputSchema, input);
	const token = await getCodacyCredentials(ctx);
	const { provider, organization_name, cursor, limit, search } = valid;

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['repositoryList']
	>(
		`/organizations/${encodeURIComponent(provider)}/${encodeURIComponent(organization_name)}/repositories`,
		token,
		{ query: { cursor, limit, search } },
	);

	const parsed = RepositoryListOutputSchema.parse(response);

	if (ctx.db.repositories) {
		try {
			for (const repository of parsed.data) {
				await ctx.db.repositories.upsertByEntityId(
					repositoryEntityId(repository),
					{ ...repository },
				);
			}
		} catch (error) {
			console.warn('Failed to save repositories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.repositories.list',
		{ ...valid },
		'completed',
	);
	return parsed;
};

/**
 * Fetch a single repository by provider, organization, and name.
 *
 * API: GET
 * /organizations/{provider}/{remoteOrganizationName}/repositories/{repositoryName}
 * Docs: https://api.codacy.com/api/api-docs
 */
export const get: CodacyEndpoints['repositoryGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryGet'],
): Promise<CodacyEndpointOutputs['repositoryGet']> => {
	const { provider, organization_name, repository_name } = parseEndpointInput(
		RepositoryGetInputSchema,
		input,
	);
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['repositoryGet']
	>(repositoryPath(provider, organization_name, repository_name), token);

	const parsed = RepositoryGetOutputSchema.parse(response);

	if (ctx.db.repositories) {
		try {
			await ctx.db.repositories.upsertByEntityId(
				repositoryEntityId(parsed.data),
				{ ...parsed.data },
			);
		} catch (error) {
			console.warn('Failed to save repository to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.repositories.get',
		{ provider, organization_name, repository_name },
		'completed',
	);
	return parsed;
};

/**
 * Get the language settings of a repository (supported extensions and
 * enabled/detected status per language).
 *
 * API: GET
 * /organizations/{provider}/{remoteOrganizationName}/repositories/{repositoryName}/settings/languages
 * Docs: https://api.codacy.com/api/api-docs
 */
export const languages: CodacyEndpoints['repositoryLanguages'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['repositoryLanguages'],
): Promise<CodacyEndpointOutputs['repositoryLanguages']> => {
	const { provider, organization_name, repository_name } = parseEndpointInput(
		RepositoryLanguagesInputSchema,
		input,
	);
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['repositoryLanguages']
	>(
		`${repositoryPath(provider, organization_name, repository_name)}/settings/languages`,
		token,
	);

	const parsed = RepositoryLanguagesOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.repositories.languages',
		{ provider, organization_name, repository_name },
		'completed',
	);
	return parsed;
};
