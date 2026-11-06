import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import {
	AnalysisConfigGetInputSchema,
	AnalysisConfigGetOutputSchema,
	parseEndpointInput,
} from './types';

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
	const { provider, organization_name, repository_name } = parseEndpointInput(
		AnalysisConfigGetInputSchema,
		input,
	);
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<
		CodacyEndpointOutputs['analysisConfigGet']
	>(
		`/analysis/organizations/${encodeURIComponent(provider)}/${encodeURIComponent(organization_name)}/repositories/${encodeURIComponent(repository_name)}/tools`,
		token,
	);

	// Not saved to the `tools` entity: these rows carry one repository's
	// settings, and an upsert would replace the tool definition that
	// tools.list stored under the same UUID.
	const parsed = AnalysisConfigGetOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		'codacy.analysis.getConfig',
		{ provider, organization_name, repository_name },
		'completed',
	);
	return parsed;
};
