import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairKeyBuilder,
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
import { tryGetStoredValue } from './client';
import { Endpoints } from './endpoints';
import type {
	CodacyEndpointInputs as CodacyEndpointInputMap,
	CodacyEndpointOutputs as CodacyEndpointOutputMap,
} from './endpoints/types';
import {
	AccountGetInputSchema,
	AccountGetOutputSchema,
	AnalysisConfigGetInputSchema,
	AnalysisConfigGetOutputSchema,
	OrganizationGetInputSchema,
	OrganizationGetOutputSchema,
	OrganizationListInputSchema,
	OrganizationListOutputSchema,
	PatternGetInputSchema,
	PatternGetOutputSchema,
	PatternListInputSchema,
	PatternListOutputSchema,
	RepositoryGetInputSchema,
	RepositoryGetOutputSchema,
	RepositoryLanguagesInputSchema,
	RepositoryLanguagesOutputSchema,
	RepositoryListInputSchema,
	RepositoryListOutputSchema,
	ToolListInputSchema,
	ToolListOutputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodacySchema } from './schema';

export type CodacyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCodacyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codacyEndpointsNested>;
};

export type CodacyContext = CorsairPluginContext<
	typeof CodacySchema,
	CodacyPluginOptions
>;

export type CodacyKeyBuilderContext = KeyBuilderContext<CodacyPluginOptions>;

const codacyAuthConfig = {
	api_key: {
		account: [],
	},
} satisfies PluginAuthConfig;

type CodacyEndpoint<K extends keyof CodacyEndpointInputMap> = CorsairEndpoint<
	CodacyContext,
	CodacyEndpointInputMap[K],
	CodacyEndpointOutputMap[K]
>;

export type CodacyEndpoints = {
	accountGet: CodacyEndpoint<'accountGet'>;
	organizationList: CodacyEndpoint<'organizationList'>;
	organizationGet: CodacyEndpoint<'organizationGet'>;
	repositoryList: CodacyEndpoint<'repositoryList'>;
	repositoryGet: CodacyEndpoint<'repositoryGet'>;
	repositoryLanguages: CodacyEndpoint<'repositoryLanguages'>;
	analysisConfigGet: CodacyEndpoint<'analysisConfigGet'>;
	toolList: CodacyEndpoint<'toolList'>;
	patternList: CodacyEndpoint<'patternList'>;
	patternGet: CodacyEndpoint<'patternGet'>;
};

export type CodacyBoundEndpoints = BindEndpoints<typeof codacyEndpointsNested>;

const codacyEndpointsNested = {
	Account: {
		get: Endpoints.accountGet,
	},
	Organizations: {
		list: Endpoints.organizationList,
		get: Endpoints.organizationGet,
	},
	Repositories: {
		list: Endpoints.repositoryList,
		get: Endpoints.repositoryGet,
		languages: Endpoints.repositoryLanguages,
	},
	Analysis: {
		getConfig: Endpoints.analysisConfigGet,
	},
	Tools: {
		list: Endpoints.toolList,
	},
	Patterns: {
		list: Endpoints.patternList,
		get: Endpoints.patternGet,
	},
} as const;

const endpointMeta = {
	'Account.get': { riskLevel: 'read', description: 'Get account details' },
	'Organizations.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'Organizations.get': { riskLevel: 'read', description: 'Get organization' },
	'Repositories.list': { riskLevel: 'read', description: 'List repositories' },
	'Repositories.get': { riskLevel: 'read', description: 'Get repository' },
	'Repositories.languages': {
		riskLevel: 'read',
		description: 'Get repository languages',
	},
	'Analysis.getConfig': {
		riskLevel: 'read',
		description: 'Get repository analysis configuration',
	},
	'Tools.list': { riskLevel: 'read', description: 'List analysis tools' },
	'Patterns.list': { riskLevel: 'read', description: 'List tool patterns' },
	'Patterns.get': { riskLevel: 'read', description: 'Get tool pattern' },
} as const satisfies RequiredPluginEndpointMeta<typeof codacyEndpointsNested>;

const codacyEndpointSchemas = {
	'Account.get': {
		input: AccountGetInputSchema,
		output: AccountGetOutputSchema,
	},
	'Organizations.list': {
		input: OrganizationListInputSchema,
		output: OrganizationListOutputSchema,
	},
	'Organizations.get': {
		input: OrganizationGetInputSchema,
		output: OrganizationGetOutputSchema,
	},
	'Repositories.list': {
		input: RepositoryListInputSchema,
		output: RepositoryListOutputSchema,
	},
	'Repositories.get': {
		input: RepositoryGetInputSchema,
		output: RepositoryGetOutputSchema,
	},
	'Repositories.languages': {
		input: RepositoryLanguagesInputSchema,
		output: RepositoryLanguagesOutputSchema,
	},
	'Analysis.getConfig': {
		input: AnalysisConfigGetInputSchema,
		output: AnalysisConfigGetOutputSchema,
	},
	'Tools.list': { input: ToolListInputSchema, output: ToolListOutputSchema },
	'Patterns.list': {
		input: PatternListInputSchema,
		output: PatternListOutputSchema,
	},
	'Patterns.get': {
		input: PatternGetInputSchema,
		output: PatternGetOutputSchema,
	},
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
		const res = await tryGetStoredValue(async () => ctx.keys?.get_api_key?.());
		if (res) {
			return res;
		}
	}

	throw new AuthMissingError('codacy', 'api_key');
};

const defaultAuthType = 'api_key' as const;

export function codacy<const PluginOptions extends CodacyPluginOptions>(
	incomingOptions: CodacyPluginOptions &
		PluginOptions = {} as CodacyPluginOptions & PluginOptions,
): ExternalCodacyPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'codacy',
		schema: CodacySchema,
		options,
		authConfig: codacyAuthConfig,
		hooks: options.hooks,
		endpoints: codacyEndpointsNested,
		endpointMeta,
		endpointSchemas: codacyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder,
	} satisfies InternalCodacyPlugin;
}

export { codacyEndpointsNested, endpointMeta };
export type {
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
} from './endpoints/types';
export type {
	CodacyAccount,
	CodacyOrganization,
	CodacyPattern,
	CodacyRepository,
	CodacyTool,
} from './schema';
