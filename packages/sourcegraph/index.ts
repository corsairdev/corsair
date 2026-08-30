import type {
	BindEndpoints,
	CorsairEndpoint,
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
import { Repository, Site, User } from './endpoints';
import type {
	SourcegraphEndpointInputs,
	SourcegraphEndpointOutputs,
} from './endpoints/types';
import {
	SourcegraphEndpointInputSchemas,
	SourcegraphEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SourcegraphSchema } from './schema';

export type SourcegraphPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Sourcegraph instance origin. Defaults to https://sourcegraph.com */
	instanceUrl?: string;
	hooks?: InternalSourcegraphPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof sourcegraphEndpointsNested>;
};

export type SourcegraphContext = CorsairPluginContext<
	typeof SourcegraphSchema,
	SourcegraphPluginOptions
>;

export type SourcegraphKeyBuilderContext =
	KeyBuilderContext<SourcegraphPluginOptions>;

export type SourcegraphBoundEndpoints = BindEndpoints<
	typeof sourcegraphEndpointsNested
>;

type SourcegraphEndpoint<K extends keyof SourcegraphEndpointOutputs> =
	CorsairEndpoint<
		SourcegraphContext,
		SourcegraphEndpointInputs[K],
		SourcegraphEndpointOutputs[K]
	>;

export type SourcegraphEndpoints = {
	checkSiteSettingsEditPermission: SourcegraphEndpoint<'checkSiteSettingsEditPermission'>;
	compareCommits: SourcegraphEndpoint<'compareCommits'>;
	getCommitDetails: SourcegraphEndpoint<'getCommitDetails'>;
	getCurrentUser: SourcegraphEndpoint<'getCurrentUser'>;
	getFileContents: SourcegraphEndpoint<'getFileContents'>;
	listRepositories: SourcegraphEndpoint<'listRepositories'>;
	listRepositoryFiles: SourcegraphEndpoint<'listRepositoryFiles'>;
	listRepositoryLanguages: SourcegraphEndpoint<'listRepositoryLanguages'>;
};

const sourcegraphEndpointsNested = {
	site: {
		checkSettingsEditPermission: Site.checkSettingsEditPermission,
	},
	user: {
		getCurrent: User.getCurrent,
	},
	repository: {
		compareCommits: Repository.compareCommits,
		getCommitDetails: Repository.getCommitDetails,
		getFileContents: Repository.getFileContents,
		list: Repository.list,
		listFiles: Repository.listFiles,
		listLanguages: Repository.listLanguages,
	},
} as const;

export const sourcegraphEndpointSchemas = {
	'site.checkSettingsEditPermission': {
		input: SourcegraphEndpointInputSchemas.checkSiteSettingsEditPermission,
		output: SourcegraphEndpointOutputSchemas.checkSiteSettingsEditPermission,
	},
	'user.getCurrent': {
		input: SourcegraphEndpointInputSchemas.getCurrentUser,
		output: SourcegraphEndpointOutputSchemas.getCurrentUser,
	},
	'repository.compareCommits': {
		input: SourcegraphEndpointInputSchemas.compareCommits,
		output: SourcegraphEndpointOutputSchemas.compareCommits,
	},
	'repository.getCommitDetails': {
		input: SourcegraphEndpointInputSchemas.getCommitDetails,
		output: SourcegraphEndpointOutputSchemas.getCommitDetails,
	},
	'repository.getFileContents': {
		input: SourcegraphEndpointInputSchemas.getFileContents,
		output: SourcegraphEndpointOutputSchemas.getFileContents,
	},
	'repository.list': {
		input: SourcegraphEndpointInputSchemas.listRepositories,
		output: SourcegraphEndpointOutputSchemas.listRepositories,
	},
	'repository.listFiles': {
		input: SourcegraphEndpointInputSchemas.listRepositoryFiles,
		output: SourcegraphEndpointOutputSchemas.listRepositoryFiles,
	},
	'repository.listLanguages': {
		input: SourcegraphEndpointInputSchemas.listRepositoryLanguages,
		output: SourcegraphEndpointOutputSchemas.listRepositoryLanguages,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof sourcegraphEndpointsNested
>;

const sourcegraphEndpointMeta = {
	'site.checkSettingsEditPermission': {
		riskLevel: 'read',
		description:
			'Check whether the viewer can edit site settings through the GraphQL API',
	},
	'user.getCurrent': {
		riskLevel: 'read',
		description: 'Retrieve the currently authenticated Sourcegraph user',
	},
	'repository.compareCommits': {
		riskLevel: 'read',
		description: 'Compare two commits and list file diffs',
	},
	'repository.getCommitDetails': {
		riskLevel: 'read',
		description: 'Get details for a commit, branch, or tag',
	},
	'repository.getFileContents': {
		riskLevel: 'read',
		description: 'Fetch file contents on the default branch (HEAD)',
	},
	'repository.list': {
		riskLevel: 'read',
		description: 'List repositories on the Sourcegraph instance',
	},
	'repository.listFiles': {
		riskLevel: 'read',
		description: 'List files and directories in a repository path',
	},
	'repository.listLanguages': {
		riskLevel: 'read',
		description: 'List languages used in a repository',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof sourcegraphEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const sourcegraphAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSourcegraphPlugin<T extends SourcegraphPluginOptions> =
	CorsairPlugin<
		'sourcegraph',
		typeof SourcegraphSchema,
		typeof sourcegraphEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalSourcegraphPlugin =
	BaseSourcegraphPlugin<SourcegraphPluginOptions>;

export type ExternalSourcegraphPlugin<T extends SourcegraphPluginOptions> =
	BaseSourcegraphPlugin<T>;

export function sourcegraph<const T extends SourcegraphPluginOptions>(
	incomingOptions: SourcegraphPluginOptions &
		T = {} as SourcegraphPluginOptions & T,
): ExternalSourcegraphPlugin<T> {
	const options: SourcegraphPluginOptions & T = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'sourcegraph',
		authConfig: sourcegraphAuthConfig,
		schema: SourcegraphSchema,
		options,
		hooks: options.hooks,
		endpoints: sourcegraphEndpointsNested,
		endpointMeta: sourcegraphEndpointMeta,
		endpointSchemas: sourcegraphEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SourcegraphKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('sourcegraph', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('sourcegraph', 'api_key');
		},
	} satisfies InternalSourcegraphPlugin;
}

export type {
	CheckSiteSettingsEditPermissionInput,
	CheckSiteSettingsEditPermissionResponse,
	CompareCommitsInput,
	CompareCommitsResponse,
	GetCommitDetailsInput,
	GetCommitDetailsResponse,
	GetCurrentUserInput,
	GetCurrentUserResponse,
	GetFileContentsInput,
	GetFileContentsResponse,
	ListRepositoriesInput,
	ListRepositoriesResponse,
	ListRepositoryFilesInput,
	ListRepositoryFilesResponse,
	ListRepositoryLanguagesInput,
	ListRepositoryLanguagesResponse,
	SourcegraphEndpointInputs,
	SourcegraphEndpointOutputs,
} from './endpoints/types';
