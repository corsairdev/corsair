import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import { AnalysisConfigGetOutputSchema } from './types';

/**
 * Get the analysis tools settings of a repository (the repository's
 * analysis configuration: which tools run and how they are set).
 *
 * API: GET
 * /analysis/organizations/{provider}/{remoteOrganizationName}/repositories/{repositoryName}/tools
 * Docs: https://api.codacy.com/api/api-docs
 */
export const getConfig: CodacyEndpoints['analysisConfigGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['analysisConfigGet'],
): Promise<CodacyEndpointOutputs['analysisConfigGet']> => {
	const token = await getCodacyCredentials(ctx);
	const { provider, organization_name, repository_name } = input;

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['analysisConfigGet']
	>(
		`/analysis/organizations/${provider}/${organization_name}/repositories/${repository_name}/tools`,
		token,
	);

	const parsed = AnalysisConfigGetOutputSchema.parse(response);

	if (ctx.db.tools) {
		try {
			for (const tool of parsed.data) {
				await ctx.db.tools.upsertByEntityId(tool.uuid, { ...tool });
			}
		} catch (error) {
			console.warn('Failed to save analysis tools to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.analysis.getConfig',
		{ provider, organization_name, repository_name },
		'completed',
	);
	return parsed;
};
