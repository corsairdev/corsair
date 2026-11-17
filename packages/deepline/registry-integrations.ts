import * as c from './endpoints/types-integrations';

export const integrationsSchemas = {
	'tools.providers': {
		input: c.ListProvidersInputSchema,
		output: c.ListProvidersOutputSchema,
	},
	'tools.quote': {
		input: c.QuoteInferenceToolInputSchema,
		output: c.QuoteInferenceToolOutputSchema,
	},
	'tools.describeModel': {
		input: c.DescribeModelInputSchema,
		output: c.DescribeModelOutputSchema,
	},
	'integrations.connectLink': {
		input: c.GetConnectLinkInputSchema,
		output: c.GetConnectLinkOutputSchema,
	},
	'integrations.setCredentials': {
		input: c.SetCredentialsInputSchema,
		output: c.SetCredentialsOutputSchema,
	},
	'integrations.startOAuth': {
		input: c.StartOAuthInputSchema,
		output: c.StartOAuthOutputSchema,
	},
	'integrations.balance': {
		input: c.GetIntegrationBalanceInputSchema,
		output: c.GetIntegrationBalanceOutputSchema,
	},
	'secrets.list': {
		input: c.ListSecretsInputSchema,
		output: c.ListSecretsOutputSchema,
	},
	'secrets.inspect': {
		input: c.InspectSecretInputSchema,
		output: c.InspectSecretOutputSchema,
	},
	'secrets.set': {
		input: c.SetSecretInputSchema,
		output: c.SetSecretOutputSchema,
	},
	'secrets.updateNote': {
		input: c.UpdateSecretNoteInputSchema,
		output: c.UpdateSecretNoteOutputSchema,
	},
	'workspace.members.list': {
		input: c.ListWorkspaceMembersInputSchema,
		output: c.ListWorkspaceMembersOutputSchema,
	},
	'workspace.serviceAccounts.list': {
		input: c.ListServiceAccountsInputSchema,
		output: c.ListServiceAccountsOutputSchema,
	},
	'auth.status': {
		input: c.AuthStatusInputSchema,
		output: c.AuthStatusOutputSchema,
	},
} as const;

export const integrationsMeta = {
	'tools.providers': {
		riskLevel: 'read',
		description:
			'List discoverable providers with tool counts and categories, or only recent additions',
	},
	'tools.quote': {
		riskLevel: 'read',
		description:
			'Price an ai_inference, deeplineagent or ai_evaluate payload without running it',
	},
	'tools.describeModel': {
		riskLevel: 'read',
		description:
			'Describe an AI Gateway model: metadata, provider options and an example input',
	},
	'integrations.connectLink': {
		riskLevel: 'read',
		description:
			'Get the dashboard link where a workspace admin connects a provider',
	},
	'integrations.setCredentials': {
		riskLevel: 'destructive',
		description:
			'Save provider credential fields for the workspace (replaces the stored credential; values never returned)',
	},
	'integrations.startOAuth': {
		riskLevel: 'write',
		description:
			'Start provider OAuth and return the URL a person opens to grant access',
	},
	'integrations.balance': {
		riskLevel: 'read',
		description:
			"Read the live balance of the workspace's own provider credential (LeadMagic)",
	},
	'secrets.list': {
		riskLevel: 'read',
		description: 'List Play secret metadata (never values)',
	},
	'secrets.inspect': {
		riskLevel: 'read',
		description:
			'Check whether a secret is active for the org or a Play, without its value',
	},
	'secrets.set': {
		riskLevel: 'destructive',
		description:
			'Create or rotate a Play or org secret (replaces the stored value; value never returned)',
	},
	'secrets.updateNote': {
		riskLevel: 'write',
		description: 'Add, replace or clear the non-sensitive note on one secret',
	},
	'workspace.members.list': {
		riskLevel: 'read',
		description: 'List one page of workspace members and their grants',
	},
	'workspace.serviceAccounts.list': {
		riskLevel: 'read',
		description:
			'List workspace service accounts and key metadata (prefix and last 4 only)',
	},
	'auth.status': {
		riskLevel: 'read',
		description:
			'Show the API key, user, workspace and rate-limit tier this plugin is using',
	},
} as const;
