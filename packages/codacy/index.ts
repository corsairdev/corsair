import type {
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairKeyBuilder,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { CodacyEndpoints } from './endpoints';
import { codacyEndpointsNested, endpointMeta } from './endpoints';
import type {
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
} from './endpoints/types';
import {
	AccountGetInputSchema,
	AnalysisConfigGetInputSchema,
	AnalysisConfigOutputSchema,
	CodacyAccountResponseSchema,
	CodacyOrganizationResponseSchema,
	CodacyRepositoryResponseSchema,
	CommitListInputSchema,
	CommitOutputSchema,
	IssueListInputSchema,
	IssueOutputSchema,
	OrganizationGetInputSchema,
	OrganizationListInputSchema,
	OrganizationOutputSchema,
	PatternListInputSchema,
	PatternOutputSchema,
	RepositoryGetInputSchema,
	RepositoryLanguagesInputSchema,
	RepositoryLanguagesOutputSchema,
	RepositoryListInputSchema,
	RepositoryOutputSchema,
	ToolListInputSchema,
	ToolOutputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodacySchema } from './schema';
import { codacyWebhooksNested, webhookSchemas } from './webhooks';

export type CodacyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCodacyPlugin['hooks'];
	webhookHooks?: InternalCodacyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codacyEndpointsNested>;
};

export type CodacyContext = CorsairPluginContext<
	typeof CodacySchema,
	CodacyPluginOptions
>;

export type CodacyKeyBuilderContext = KeyBuilderContext<CodacyPluginOptions>;

type CodacyEndpoint<K extends keyof CodacyEndpoints> = CorsairEndpoint<
	CodacyContext,
	CodacyEndpointInputs[K],
	CodacyEndpointOutputs[K]
>;

const codacyAuthConfig = {
	api_key: {
		account: [],
	},
} satisfies PluginAuthConfig;

const codacyEndpointSchemas = {
	'Account.get': {
		input: AccountGetInputSchema,
		output: CodacyAccountResponseSchema,
	},
	'Organizations.list': {
		input: OrganizationListInputSchema,
		output: OrganizationOutputSchema,
	},
	'Organizations.get': {
		input: OrganizationGetInputSchema,
		output: CodacyOrganizationResponseSchema,
	},
	'Repositories.list': {
		input: RepositoryListInputSchema,
		output: RepositoryOutputSchema,
	},
	'Repositories.get': {
		input: RepositoryGetInputSchema,
		output: CodacyRepositoryResponseSchema,
	},
	'Repositories.languages': {
		input: RepositoryLanguagesInputSchema,
		output: RepositoryLanguagesOutputSchema,
	},
	'Analysis.getConfig': {
		input: AnalysisConfigGetInputSchema,
		output: AnalysisConfigOutputSchema,
	},
	'Analysis.tools': { input: ToolListInputSchema, output: ToolOutputSchema },
	'Analysis.patterns': {
		input: PatternListInputSchema,
		output: PatternOutputSchema,
	},
	'Commits.list': { input: CommitListInputSchema, output: CommitOutputSchema },
	'Issues.list': { input: IssueListInputSchema, output: IssueOutputSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof codacyEndpointsNested
>;

export type InternalCodacyPlugin = CorsairPlugin<
	'codacy',
	typeof CodacySchema,
	typeof codacyEndpointsNested,
	never,
	CodacyPluginOptions,
	'api_key'
>;

export type ExternalCodacyPlugin<PluginOptions extends CodacyPluginOptions> =
	CorsairPlugin<
		'codacy',
		typeof CodacySchema,
		typeof codacyEndpointsNested,
		never,
		PluginOptions,
		'api_key'
	>;

const keyBuilder: CorsairKeyBuilder<CodacyPluginOptions> = async (
	ctx: CodacyKeyBuilderContext,
	source,
) => {
	const options = ctx.options as CodacyPluginOptions;
	if (options.key) {
		return options.key;
	}

	if (source === 'endpoint') {
		const res = await ctx.keys.get_api_key?.();
		if (res) return res;
	}

	throw new AuthMissingError('codacy', 'api_key');
};

export const codacy = (
	options: CodacyPluginOptions = {},
): CorsairPlugin<
	'codacy',
	typeof CodacySchema,
	typeof codacyEndpointsNested,
	typeof codacyWebhooksNested,
	CodacyPluginOptions,
	'api_key'
> => {
	const authType = options.authType ?? 'api_key';

	const resolvedOptions = {
		...options,
		authType,
	};

	return {
		id: 'codacy',
		schema: CodacySchema,
		options: resolvedOptions,
		authConfig: codacyAuthConfig,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codacyEndpointsNested,
		endpointMeta,
		endpointSchemas: codacyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder,
		webhooks: codacyWebhooksNested,
		webhookSchemas,
	};
};

export type { CodacyEndpoints } from './endpoints';
export { codacyEndpointsNested, endpointMeta } from './endpoints';
export type {
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
} from './endpoints/types';
export type {
	CodacyAccount,
	CodacyCommit,
	CodacyIssue,
	CodacyOrganization,
	CodacyRepository,
	CodacyTool,
} from './schema';
