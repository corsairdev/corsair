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
import { Content, Migration } from './endpoints';
import type {
	PrismicEndpointInputs,
	PrismicEndpointOutputs,
} from './endpoints/types';
import {
	PrismicEndpointInputSchemas,
	PrismicEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PrismicSchema } from './schema';

export const prismicAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PrismicPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The Migration API write token, which the key manager stores as `api_key`.
	 * Only the `migration.*` operations need it.
	 */
	key?: string;
	/** The repository id. Required for every call. */
	repository?: string;
	/** A private repository's access token, sent on Content API reads. */
	accessToken?: string;
	/**
	 * Overrides the stored write token. Prefer `key` or the stored `api_key`.
	 */
	writeToken?: string;
	hooks?: InternalPrismicPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof prismicEndpointsNested>;
};

export type PrismicContext = CorsairPluginContext<
	typeof PrismicSchema,
	PrismicPluginOptions,
	undefined,
	typeof prismicAuthConfig
>;

export type PrismicKeyBuilderContext = KeyBuilderContext<
	PrismicPluginOptions,
	typeof prismicAuthConfig
>;

export type PrismicBoundEndpoints = BindEndpoints<
	typeof prismicEndpointsNested
>;

type PrismicEndpoint<K extends keyof PrismicEndpointOutputs> = CorsairEndpoint<
	PrismicContext,
	PrismicEndpointInputs[K],
	PrismicEndpointOutputs[K]
>;

export type PrismicEndpoints = {
	repositoryInfo: PrismicEndpoint<'repositoryInfo'>;
	documentsSearch: PrismicEndpoint<'documentsSearch'>;
	documentsGet: PrismicEndpoint<'documentsGet'>;
	migrationCreate: PrismicEndpoint<'migrationCreate'>;
	migrationUpdate: PrismicEndpoint<'migrationUpdate'>;
};

const prismicEndpointsNested = {
	repository: {
		info: Content.info,
	},
	documents: {
		search: Content.search,
		get: Content.get,
	},
	migration: {
		create: Migration.create,
		update: Migration.update,
	},
} as const;

export const prismicEndpointSchemas = {
	'repository.info': {
		input: PrismicEndpointInputSchemas.repositoryInfo,
		output: PrismicEndpointOutputSchemas.repositoryInfo,
	},
	'documents.search': {
		input: PrismicEndpointInputSchemas.documentsSearch,
		output: PrismicEndpointOutputSchemas.documentsSearch,
	},
	'documents.get': {
		input: PrismicEndpointInputSchemas.documentsGet,
		output: PrismicEndpointOutputSchemas.documentsGet,
	},
	'migration.create': {
		input: PrismicEndpointInputSchemas.migrationCreate,
		output: PrismicEndpointOutputSchemas.migrationCreate,
	},
	'migration.update': {
		input: PrismicEndpointInputSchemas.migrationUpdate,
		output: PrismicEndpointOutputSchemas.migrationUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof prismicEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const prismicEndpointMeta = {
	'repository.info': {
		riskLevel: 'read',
		description:
			"Read the repository's refs, custom types, languages and tags, which a document query needs since it is pinned to a ref",
	},
	'documents.search': {
		riskLevel: 'read',
		description:
			'Query published documents with Prismic predicates, ordering, tags and locale, paged by number or by a `next_page` cursor',
	},
	'documents.get': {
		riskLevel: 'read',
		description: 'Read one published document by id, optionally at a ref',
	},
	'migration.create': {
		riskLevel: 'write',
		description:
			'Create one page as a draft in a migration release. It is not published until the release is published, and Prismic accepts one page per request at one request per second',
	},
	'migration.update': {
		riskLevel: 'write',
		description:
			'Update one existing page. The type, locale and translation link cannot be changed, and omitting `tags` deletes them all',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof prismicEndpointsNested>;

export type BasePrismicPlugin<T extends PrismicPluginOptions> = CorsairPlugin<
	'prismic',
	typeof PrismicSchema,
	typeof prismicEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof prismicAuthConfig
>;

export type InternalPrismicPlugin = BasePrismicPlugin<PrismicPluginOptions>;

export type ExternalPrismicPlugin<T extends PrismicPluginOptions> =
	BasePrismicPlugin<T>;

export function prismic<const T extends PrismicPluginOptions>(
	incomingOptions: PrismicPluginOptions & T = {} as PrismicPluginOptions & T,
): ExternalPrismicPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'prismic',
		authConfig: prismicAuthConfig,
		schema: PrismicSchema,
		options,
		hooks: options.hooks,
		endpoints: prismicEndpointsNested,
		webhooks: {},
		endpointMeta: prismicEndpointMeta,
		endpointSchemas: prismicEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PrismicKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			// A public repository needs no token for a read, so the key builder
			// returns empty there and only `migration.*` insists on one.
			if (source === 'endpoint') return '';

			throw new AuthMissingError('prismic', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPrismicPlugin;
}

export { PrismicAPIError } from './client';
export type {
	DocumentsGetInput,
	DocumentsGetOutput,
	DocumentsSearchInput,
	DocumentsSearchOutput,
	LanguageSchema as PrismicLanguageSchema,
	MigrationCreateInput,
	MigrationUpdateInput,
	MigrationWriteOutput,
	PrismicDocument,
	PrismicEndpointInputs,
	PrismicEndpointOutputs,
	PrismicRef,
	RepositoryInfoInput,
	RepositoryInfoOutput,
} from './endpoints/types';
