import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { z } from 'zod';
import { endpoints } from './endpoints';
import * as contracts from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DeeplineSchema } from './schema';

export type DeeplinePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDeeplinePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type DeeplineContext = CorsairPluginContext<
	typeof DeeplineSchema,
	DeeplinePluginOptions
>;
export type DeeplineBoundEndpoints = BindEndpoints<typeof endpoints>;
export const deeplineEndpointSchemas = {
	'datasets.rows': {
		input: contracts.ExportRowsInputSchema,
		output: contracts.ExportRowsOutputSchema,
	},
	'datasets.history': {
		input: contracts.RowHistoryInputSchema,
		output: contracts.RowHistoryOutputSchema,
	},
	'runs.logs': {
		input: contracts.RunLogsInputSchema,
		output: contracts.RunLogsOutputSchema,
	},

	'health.get': {
		input: contracts.GetRuntimeHealthInputSchema,
		output: contracts.GetRuntimeHealthOutputSchema,
	},
	'tools.list': {
		input: contracts.ListToolsInputSchema,
		output: contracts.ListToolsOutputSchema,
	},
	'tools.search': {
		input: contracts.SearchToolsInputSchema,
		output: contracts.SearchToolsOutputSchema,
	},
	'search.query': {
		input: contracts.SearchInputSchema,
		output: contracts.SearchOutputSchema,
	},
	'tools.get': {
		input: contracts.GetToolInputSchema,
		output: contracts.GetToolOutputSchema,
	},
	'tools.execute': {
		input: contracts.ExecuteToolInputSchema,
		output: contracts.ExecuteToolOutputSchema,
	},
	'executions.getByKey': {
		input: contracts.GetToolExecutionByKeyInputSchema,
		output: contracts.GetToolExecutionByKeyOutputSchema,
	},
	'plays.run': {
		input: contracts.StartPlayRunInputSchema,
		output: contracts.StartPlayRunOutputSchema,
	},
	'plays.list': {
		input: contracts.ListPlaysInputSchema,
		output: contracts.ListPlaysOutputSchema,
	},
	'plays.activity': {
		input: contracts.GetPlaysActivityInputSchema,
		output: contracts.GetPlaysActivityOutputSchema,
	},
	'runs.history': {
		input: contracts.GetRunsHistoryInputSchema,
		output: contracts.GetRunsHistoryOutputSchema,
	},
	'plays.get': {
		input: contracts.GetPlayInputSchema,
		output: contracts.GetPlayOutputSchema,
	},
	'runs.get': {
		input: contracts.GetRunInputSchema,
		output: contracts.GetRunOutputSchema,
	},
	'runs.children': {
		input: contracts.ListRunChildrenInputSchema,
		output: contracts.ListRunChildrenOutputSchema,
	},
	'billing.entitlements': {
		input: contracts.GetBillingEntitlementsInputSchema,
		output: contracts.GetBillingEntitlementsOutputSchema,
	},
	'billing.balance': {
		input: contracts.GetBillingBalanceInputSchema,
		output: contracts.GetBillingBalanceOutputSchema,
	},
	'billing.usage': {
		input: contracts.GetBillingUsageInputSchema,
		output: contracts.GetBillingUsageOutputSchema,
	},
	'billing.ledger': {
		input: contracts.GetBillingLedgerInputSchema,
		output: contracts.GetBillingLedgerOutputSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export type DeeplineEndpointInputs = {
	[K in keyof typeof deeplineEndpointSchemas]: z.input<
		(typeof deeplineEndpointSchemas)[K]['input']
	>;
};
export type DeeplineEndpointOutputs = {
	[K in keyof typeof deeplineEndpointSchemas]: z.output<
		(typeof deeplineEndpointSchemas)[K]['output']
	>;
};
const meta = {
	'datasets.rows': {
		riskLevel: 'read',
		description:
			'Read a page of saved dataset rows, optionally scoped to a run',
	},
	'datasets.history': {
		riskLevel: 'read',
		description:
			'Read immutable run row history with coverage and continuation cursor',
	},
	'runs.logs': {
		riskLevel: 'read',
		description: 'Read retained run logs; continue with lastSeq as afterSeq',
	},
	'health.get': {
		riskLevel: 'read',
		description: 'Check Runtime API availability',
	},
	'tools.list': {
		riskLevel: 'read',
		description: 'List callable provider tools',
	},
	'tools.search': {
		riskLevel: 'read',
		description: 'Search callable provider tools',
	},
	'search.query': {
		riskLevel: 'read',
		description: 'Search tools, monitor types, plays, and docs',
	},
	'tools.get': {
		riskLevel: 'read',
		description: 'Describe one provider-backed tool',
	},
	'tools.execute': {
		riskLevel: 'destructive',
		description:
			'Execute one provider-backed tool (may spend credits or perform external actions)',
	},
	'executions.getByKey': {
		riskLevel: 'read',
		description: 'Recover a tool execution by its idempotency key',
	},
	'plays.run': {
		riskLevel: 'destructive',
		description:
			'Start a saved or prebuilt Play run (may spend credits or perform external actions)',
	},
	'plays.list': {
		riskLevel: 'read',
		description: 'List and search callable Plays',
	},
	'plays.activity': {
		riskLevel: 'read',
		description: 'Count Play runs and delivered Monitor findings by day',
	},
	'runs.history': {
		riskLevel: 'read',
		description: 'Search and page workspace run history',
	},
	'plays.get': { riskLevel: 'read', description: 'Describe one callable Play' },
	'runs.get': { riskLevel: 'read', description: 'Get one Play run status' },
	'runs.children': {
		riskLevel: 'read',
		description: 'List one page of async child Runs',
	},
	'billing.entitlements': {
		riskLevel: 'read',
		description: 'Read current workspace provider benefits',
	},
	'billing.balance': {
		riskLevel: 'read',
		description: 'Get workspace credit balance',
	},
	'billing.usage': {
		riskLevel: 'read',
		description: 'Get usage and recent charges',
	},
	'billing.ledger': {
		riskLevel: 'read',
		description: 'List or export the credit ledger',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const deeplineAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseDeeplinePlugin<T extends DeeplinePluginOptions> = CorsairPlugin<
	'deepline',
	typeof DeeplineSchema,
	typeof endpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalDeeplinePlugin = BaseDeeplinePlugin<DeeplinePluginOptions>;
export type ExternalDeeplinePlugin<T extends DeeplinePluginOptions> =
	BaseDeeplinePlugin<T>;

export function deepline(): ExternalDeeplinePlugin<{}>;
export function deepline<const T extends DeeplinePluginOptions>(
	options: DeeplinePluginOptions & T,
): ExternalDeeplinePlugin<T>;
export function deepline(
	incomingOptions: DeeplinePluginOptions = {},
): InternalDeeplinePlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'deepline',
		authConfig: deeplineAuthConfig,
		schema: DeeplineSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: meta,
		endpointSchemas: deeplineEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (
			ctx: KeyBuilderContext<DeeplinePluginOptions>,
			source,
		) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			const key = await ctx.keys?.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('deepline', 'api_key');
		},
	};
}
