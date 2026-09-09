import { z } from 'zod';

export const CodacyEndpointInputSchemas = {
	createApiToken: z
		.object({
			name: z.string().describe('The name of the new API token to create.'),
		})
		.describe(
			'Creates a new account API token for the authenticated user. The token inherits all permissions from the account owner and provides access to the same organizations and repositories. Note: The token is created with default settings. To configure expiration dates or other settings, use the Codacy web interface. The newly created token can be used to authenticate API requests by including it in the api-token header.',
		),

	deleteApiToken: z
		.object({
			tokenId: z.string().describe('The ID of the API token to delete.'),
		})
		.describe(
			"Tool to delete a specific API token from the authenticated user's account. Use after confirming the token ID.",
		),

	getAccountDetails: z
		.object({})
		.describe(
			"Tool to retrieve details of the authenticated user's account. Use when confirming authentication before user-level operations.",
		),

	getConfigurationStatus: z
		.object({})
		.describe(
			'Tool to retrieve the current configuration status of the Codacy system. Use when checking system setup completion or first-time configuration status.',
		),

	getHealth: z
		.object({})
		.describe(
			'Tool to check the health status of the Codacy API. Use when verifying API connectivity and service availability.',
		),

	getOrganizationsRepositoriesSettingsLanguages: z
		.object({
			provider: z.string().describe('The Git provider (e.g. gh, gl, bb)'),
			organizationName: z.string().describe('The organization name'),
			repositoryName: z.string().describe('The repository name'),
		})
		.describe(
			'Tool to get the list of all languages with their extensions and enabled status for a repository. Use when you need to understand which programming languages are detected and enabled for analysis in a specific Codacy repository.',
		),

	getToolPattern: z
		.object({
			toolUuid: z.string().describe('The UUID of the tool'),
			patternId: z.string().describe('The ID of the pattern'),
		})
		.describe(
			'Tool to retrieve the definition of a specific pattern for a given tool. Use when you need to get detailed information about a specific code pattern including its description, examples, parameters, and configuration.',
		),

	getUserOrganizations: z
		.object({
			provider: z.string().describe('The Git provider (e.g. gh, gl, bb)'),
		})
		.describe(
			'Retrieves all organizations the authenticated user belongs to for a specific Git provider. Returns organization details including name, provider, avatar, access permissions (DAST, SCA), and join status. Use this to discover which organizations a user can access on Codacy for a given Git provider (GitHub, GitLab, or Bitbucket). Requires the user to have connected the specified provider to their Codacy account.',
		),

	getVersion: z
		.object({})
		.describe(
			'Tool to retrieve the version of the Codacy installation. Use when checking the Codacy API version for compatibility or debugging purposes.',
		),

	listAnalysisOrganizationsRepositories: z
		.object({
			provider: z.string().describe('The Git provider (e.g. gh, gl, bb)'),
			organizationName: z.string().describe('The organization name'),
			cursor: z
				.string()
				.optional()
				.describe(
					'Pagination cursor. For Bitbucket, ensure you URL encode the cursor before using it in subsequent API calls.',
				),
		})
		.describe(
			'Tool to list organization repositories with analysis information for the authenticated user. Use when you need to retrieve repositories from a specific organization with their analysis status. For Bitbucket, ensure you URL encode the cursor before using it in subsequent API calls.',
		),

	listDuplicationTools: z
		.object({})
		.describe(
			'Tool to retrieve the list of duplication detection tools available in Codacy. Use when you need to identify which tools can analyze code duplication for different programming languages.',
		),

	listLanguagesAndTools: z
		.object({})
		.describe(
			"Tool to retrieve the list of languages supported by available tools. Use when you need to determine which programming languages are supported by Codacy's analysis tools.",
		),

	listLoginIntegrations: z
		.object({})
		.describe(
			"Tool to list configured login providers on Codacy's platform. Use when you need to discover available authentication methods for Codacy login.",
		),

	listMetricsTools: z
		.object({})
		.describe(
			'Tool to retrieve the list of metrics tools available in Codacy. Use when you need to discover which tools calculate metrics on projects and which languages they support.',
		),

	listProjects: z
		.object({})
		.describe(
			'Tool to list all projects accessible to the authenticated user. Use when you need a list of repositories after confirming API token validity.',
		),

	listProviderIntegrations: z
		.object({})
		.describe(
			"Tool to list provider integrations existing on Codacy's platform. Use when you need to discover available Git providers that can be integrated with Codacy for authentication and repository management.",
		),

	listTools: z
		.object({})
		.describe(
			'Tool to retrieve the list of analysis tools available in Codacy. Use when you need to identify which code analysis tools are available and which programming languages they support.',
		),

	listToolsPatterns: z
		.object({
			toolUuid: z.string().describe('The UUID of the tool'),
			cursor: z.string().optional().describe('Pagination cursor.'),
			limit: z.number().optional().describe('Number of items per page.'),
		})
		.describe(
			'Tool to retrieve the list of patterns for a specific tool. Returns code patterns that the tool can use to find issues, with pagination support.',
		),
};

export const CodacyEndpointOutputSchemas = {
	createApiToken: z.any(),
	deleteApiToken: z.any(),
	getAccountDetails: z.any(),
	getConfigurationStatus: z.any(),
	getHealth: z.any(),
	getOrganizationsRepositoriesSettingsLanguages: z.any(),
	getToolPattern: z.any(),
	getUserOrganizations: z.any(),
	getVersion: z.any(),
	listAnalysisOrganizationsRepositories: z.any(),
	listDuplicationTools: z.any(),
	listLanguagesAndTools: z.any(),
	listLoginIntegrations: z.any(),
	listMetricsTools: z.any(),
	listProjects: z.any(),
	listProviderIntegrations: z.any(),
	listTools: z.any(),
	listToolsPatterns: z.any(),
};

export type CodacyEndpointInputs = {
	createApiToken: z.infer<typeof CodacyEndpointInputSchemas.createApiToken>;
	deleteApiToken: z.infer<typeof CodacyEndpointInputSchemas.deleteApiToken>;
	getAccountDetails: z.infer<
		typeof CodacyEndpointInputSchemas.getAccountDetails
	>;
	getConfigurationStatus: z.infer<
		typeof CodacyEndpointInputSchemas.getConfigurationStatus
	>;
	getHealth: z.infer<typeof CodacyEndpointInputSchemas.getHealth>;
	getOrganizationsRepositoriesSettingsLanguages: z.infer<
		typeof CodacyEndpointInputSchemas.getOrganizationsRepositoriesSettingsLanguages
	>;
	getToolPattern: z.infer<typeof CodacyEndpointInputSchemas.getToolPattern>;
	getUserOrganizations: z.infer<
		typeof CodacyEndpointInputSchemas.getUserOrganizations
	>;
	getVersion: z.infer<typeof CodacyEndpointInputSchemas.getVersion>;
	listAnalysisOrganizationsRepositories: z.infer<
		typeof CodacyEndpointInputSchemas.listAnalysisOrganizationsRepositories
	>;
	listDuplicationTools: z.infer<
		typeof CodacyEndpointInputSchemas.listDuplicationTools
	>;
	listLanguagesAndTools: z.infer<
		typeof CodacyEndpointInputSchemas.listLanguagesAndTools
	>;
	listLoginIntegrations: z.infer<
		typeof CodacyEndpointInputSchemas.listLoginIntegrations
	>;
	listMetricsTools: z.infer<typeof CodacyEndpointInputSchemas.listMetricsTools>;
	listProjects: z.infer<typeof CodacyEndpointInputSchemas.listProjects>;
	listProviderIntegrations: z.infer<
		typeof CodacyEndpointInputSchemas.listProviderIntegrations
	>;
	listTools: z.infer<typeof CodacyEndpointInputSchemas.listTools>;
	listToolsPatterns: z.infer<
		typeof CodacyEndpointInputSchemas.listToolsPatterns
	>;
};

export type CodacyEndpointOutputs = {
	createApiToken: z.infer<typeof CodacyEndpointOutputSchemas.createApiToken>;
	deleteApiToken: z.infer<typeof CodacyEndpointOutputSchemas.deleteApiToken>;
	getAccountDetails: z.infer<
		typeof CodacyEndpointOutputSchemas.getAccountDetails
	>;
	getConfigurationStatus: z.infer<
		typeof CodacyEndpointOutputSchemas.getConfigurationStatus
	>;
	getHealth: z.infer<typeof CodacyEndpointOutputSchemas.getHealth>;
	getOrganizationsRepositoriesSettingsLanguages: z.infer<
		typeof CodacyEndpointOutputSchemas.getOrganizationsRepositoriesSettingsLanguages
	>;
	getToolPattern: z.infer<typeof CodacyEndpointOutputSchemas.getToolPattern>;
	getUserOrganizations: z.infer<
		typeof CodacyEndpointOutputSchemas.getUserOrganizations
	>;
	getVersion: z.infer<typeof CodacyEndpointOutputSchemas.getVersion>;
	listAnalysisOrganizationsRepositories: z.infer<
		typeof CodacyEndpointOutputSchemas.listAnalysisOrganizationsRepositories
	>;
	listDuplicationTools: z.infer<
		typeof CodacyEndpointOutputSchemas.listDuplicationTools
	>;
	listLanguagesAndTools: z.infer<
		typeof CodacyEndpointOutputSchemas.listLanguagesAndTools
	>;
	listLoginIntegrations: z.infer<
		typeof CodacyEndpointOutputSchemas.listLoginIntegrations
	>;
	listMetricsTools: z.infer<
		typeof CodacyEndpointOutputSchemas.listMetricsTools
	>;
	listProjects: z.infer<typeof CodacyEndpointOutputSchemas.listProjects>;
	listProviderIntegrations: z.infer<
		typeof CodacyEndpointOutputSchemas.listProviderIntegrations
	>;
	listTools: z.infer<typeof CodacyEndpointOutputSchemas.listTools>;
	listToolsPatterns: z.infer<
		typeof CodacyEndpointOutputSchemas.listToolsPatterns
	>;
};

export type CreateApiTokenInput = CodacyEndpointInputs['createApiToken'];
export type CreateApiTokenResponse = CodacyEndpointOutputs['createApiToken'];
export type DeleteApiTokenInput = CodacyEndpointInputs['deleteApiToken'];
export type DeleteApiTokenResponse = CodacyEndpointOutputs['deleteApiToken'];
export type GetAccountDetailsInput = CodacyEndpointInputs['getAccountDetails'];
export type GetAccountDetailsResponse =
	CodacyEndpointOutputs['getAccountDetails'];
export type GetConfigurationStatusInput =
	CodacyEndpointInputs['getConfigurationStatus'];
export type GetConfigurationStatusResponse =
	CodacyEndpointOutputs['getConfigurationStatus'];
export type GetHealthInput = CodacyEndpointInputs['getHealth'];
export type GetHealthResponse = CodacyEndpointOutputs['getHealth'];
export type GetOrganizationsRepositoriesSettingsLanguagesInput =
	CodacyEndpointInputs['getOrganizationsRepositoriesSettingsLanguages'];
export type GetOrganizationsRepositoriesSettingsLanguagesResponse =
	CodacyEndpointOutputs['getOrganizationsRepositoriesSettingsLanguages'];
export type GetToolPatternInput = CodacyEndpointInputs['getToolPattern'];
export type GetToolPatternResponse = CodacyEndpointOutputs['getToolPattern'];
export type GetUserOrganizationsInput =
	CodacyEndpointInputs['getUserOrganizations'];
export type GetUserOrganizationsResponse =
	CodacyEndpointOutputs['getUserOrganizations'];
export type GetVersionInput = CodacyEndpointInputs['getVersion'];
export type GetVersionResponse = CodacyEndpointOutputs['getVersion'];
export type ListAnalysisOrganizationsRepositoriesInput =
	CodacyEndpointInputs['listAnalysisOrganizationsRepositories'];
export type ListAnalysisOrganizationsRepositoriesResponse =
	CodacyEndpointOutputs['listAnalysisOrganizationsRepositories'];
export type ListDuplicationToolsInput =
	CodacyEndpointInputs['listDuplicationTools'];
export type ListDuplicationToolsResponse =
	CodacyEndpointOutputs['listDuplicationTools'];
export type ListLanguagesAndToolsInput =
	CodacyEndpointInputs['listLanguagesAndTools'];
export type ListLanguagesAndToolsResponse =
	CodacyEndpointOutputs['listLanguagesAndTools'];
export type ListLoginIntegrationsInput =
	CodacyEndpointInputs['listLoginIntegrations'];
export type ListLoginIntegrationsResponse =
	CodacyEndpointOutputs['listLoginIntegrations'];
export type ListMetricsToolsInput = CodacyEndpointInputs['listMetricsTools'];
export type ListMetricsToolsResponse =
	CodacyEndpointOutputs['listMetricsTools'];
export type ListProjectsInput = CodacyEndpointInputs['listProjects'];
export type ListProjectsResponse = CodacyEndpointOutputs['listProjects'];
export type ListProviderIntegrationsInput =
	CodacyEndpointInputs['listProviderIntegrations'];
export type ListProviderIntegrationsResponse =
	CodacyEndpointOutputs['listProviderIntegrations'];
export type ListToolsInput = CodacyEndpointInputs['listTools'];
export type ListToolsResponse = CodacyEndpointOutputs['listTools'];
export type ListToolsPatternsInput = CodacyEndpointInputs['listToolsPatterns'];
export type ListToolsPatternsResponse =
	CodacyEndpointOutputs['listToolsPatterns'];
