import type {
	AuthTypes,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	collectionAdd,
	collectionRemove,
	collectionReset,
	collectionSet,
	databaseCreate,
	databaseDelete,
	databaseRename,
	documentGet,
	documentGetBatch,
	documentUpdate,
	documentUpdateBatch,
	entityCreate,
	entityDelete,
	entityQuery,
	entityUpdate,
	entityUpsert,
	enumCreate,
	fieldCreate,
	fieldDelete,
	fieldRename,
	fieldSetMeta,
	fileDownload,
	fileSignUrls,
	fileUpload,
	historySearch,
	installMixins,
	schemaQuery,
	viewsCreate,
	viewsDelete,
	viewsQuery,
	viewsUpdate,
} from './endpoints';
import type {
	FiberyEndpointInputs,
	FiberyEndpointOutputs,
} from './endpoints/types';
import {
	FiberyEndpointInputSchemas,
	FiberyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FiberySchema } from './schema';

export type FiberyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	workspaceUrl: string;
	hooks?: InternalFiberyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fiberyEndpointsNested>;
};

export type FiberyContext = CorsairPluginContext<
	typeof FiberySchema,
	FiberyPluginOptions
>;
export type FiberyKeyBuilderContext = KeyBuilderContext<FiberyPluginOptions>;
export type FiberyBoundEndpoints = BindEndpoints<typeof fiberyEndpointsNested>;

type FiberyEndpoint<K extends keyof FiberyEndpointOutputs> = CorsairEndpoint<
	FiberyContext,
	FiberyEndpointInputs[K],
	FiberyEndpointOutputs[K]
>;

export type FiberyEndpoints = {
	[K in keyof FiberyEndpointOutputs]: FiberyEndpoint<K>;
};

const fiberyEndpointsNested = {
	schema: {
		query: schemaQuery,
		createDatabase: databaseCreate,
		renameDatabase: databaseRename,
		deleteDatabase: databaseDelete,
		createField: fieldCreate,
		createEnum: enumCreate,
		renameField: fieldRename,
		deleteField: fieldDelete,
		setFieldMeta: fieldSetMeta,
		installMixins,
	},
	entity: {
		query: entityQuery,
		create: entityCreate,
		update: entityUpdate,
		delete: entityDelete,
		upsert: entityUpsert,
	},
	collection: {
		add: collectionAdd,
		remove: collectionRemove,
		set: collectionSet,
		reset: collectionReset,
	},
	document: {
		get: documentGet,
		getBatch: documentGetBatch,
		update: documentUpdate,
		updateBatch: documentUpdateBatch,
	},
	file: {
		upload: fileUpload,
		download: fileDownload,
		signUrls: fileSignUrls,
	},
	views: {
		query: viewsQuery,
		create: viewsCreate,
		update: viewsUpdate,
		delete: viewsDelete,
	},
	history: {
		search: historySearch,
	},
} as const;

export const fiberyEndpointSchemas = {
	'schema.query': {
		input: FiberyEndpointInputSchemas.schemaQuery,
		output: FiberyEndpointOutputSchemas.schemaQuery,
	},
	'schema.createDatabase': {
		input: FiberyEndpointInputSchemas.databaseCreate,
		output: FiberyEndpointOutputSchemas.databaseCreate,
	},
	'schema.renameDatabase': {
		input: FiberyEndpointInputSchemas.databaseRename,
		output: FiberyEndpointOutputSchemas.databaseRename,
	},
	'schema.deleteDatabase': {
		input: FiberyEndpointInputSchemas.databaseDelete,
		output: FiberyEndpointOutputSchemas.databaseDelete,
	},
	'schema.createField': {
		input: FiberyEndpointInputSchemas.fieldCreate,
		output: FiberyEndpointOutputSchemas.fieldCreate,
	},
	'schema.createEnum': {
		input: FiberyEndpointInputSchemas.enumCreate,
		output: FiberyEndpointOutputSchemas.enumCreate,
	},
	'schema.renameField': {
		input: FiberyEndpointInputSchemas.fieldRename,
		output: FiberyEndpointOutputSchemas.fieldRename,
	},
	'schema.deleteField': {
		input: FiberyEndpointInputSchemas.fieldDelete,
		output: FiberyEndpointOutputSchemas.fieldDelete,
	},
	'schema.setFieldMeta': {
		input: FiberyEndpointInputSchemas.fieldSetMeta,
		output: FiberyEndpointOutputSchemas.fieldSetMeta,
	},
	'schema.installMixins': {
		input: FiberyEndpointInputSchemas.installMixins,
		output: FiberyEndpointOutputSchemas.installMixins,
	},
	'entity.query': {
		input: FiberyEndpointInputSchemas.entityQuery,
		output: FiberyEndpointOutputSchemas.entityQuery,
	},
	'entity.create': {
		input: FiberyEndpointInputSchemas.entityCreate,
		output: FiberyEndpointOutputSchemas.entityCreate,
	},
	'entity.update': {
		input: FiberyEndpointInputSchemas.entityUpdate,
		output: FiberyEndpointOutputSchemas.entityUpdate,
	},
	'entity.delete': {
		input: FiberyEndpointInputSchemas.entityDelete,
		output: FiberyEndpointOutputSchemas.entityDelete,
	},
	'entity.upsert': {
		input: FiberyEndpointInputSchemas.entityUpsert,
		output: FiberyEndpointOutputSchemas.entityUpsert,
	},
	'collection.add': {
		input: FiberyEndpointInputSchemas.collectionAdd,
		output: FiberyEndpointOutputSchemas.collectionAdd,
	},
	'collection.remove': {
		input: FiberyEndpointInputSchemas.collectionRemove,
		output: FiberyEndpointOutputSchemas.collectionRemove,
	},
	'collection.set': {
		input: FiberyEndpointInputSchemas.collectionSet,
		output: FiberyEndpointOutputSchemas.collectionSet,
	},
	'collection.reset': {
		input: FiberyEndpointInputSchemas.collectionReset,
		output: FiberyEndpointOutputSchemas.collectionReset,
	},
	'document.get': {
		input: FiberyEndpointInputSchemas.documentGet,
		output: FiberyEndpointOutputSchemas.documentGet,
	},
	'document.getBatch': {
		input: FiberyEndpointInputSchemas.documentGetBatch,
		output: FiberyEndpointOutputSchemas.documentGetBatch,
	},
	'document.update': {
		input: FiberyEndpointInputSchemas.documentUpdate,
		output: FiberyEndpointOutputSchemas.documentUpdate,
	},
	'document.updateBatch': {
		input: FiberyEndpointInputSchemas.documentUpdateBatch,
		output: FiberyEndpointOutputSchemas.documentUpdateBatch,
	},
	'file.upload': {
		input: FiberyEndpointInputSchemas.fileUpload,
		output: FiberyEndpointOutputSchemas.fileUpload,
	},
	'file.download': {
		input: FiberyEndpointInputSchemas.fileDownload,
		output: FiberyEndpointOutputSchemas.fileDownload,
	},
	'file.signUrls': {
		input: FiberyEndpointInputSchemas.fileSignUrls,
		output: FiberyEndpointOutputSchemas.fileSignUrls,
	},
	'views.query': {
		input: FiberyEndpointInputSchemas.viewsQuery,
		output: FiberyEndpointOutputSchemas.viewsQuery,
	},
	'views.create': {
		input: FiberyEndpointInputSchemas.viewsCreate,
		output: FiberyEndpointOutputSchemas.viewsCreate,
	},
	'views.update': {
		input: FiberyEndpointInputSchemas.viewsUpdate,
		output: FiberyEndpointOutputSchemas.viewsUpdate,
	},
	'views.delete': {
		input: FiberyEndpointInputSchemas.viewsDelete,
		output: FiberyEndpointOutputSchemas.viewsDelete,
	},
	'history.search': {
		input: FiberyEndpointInputSchemas.historySearch,
		output: FiberyEndpointOutputSchemas.historySearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fiberyEndpointsNested
>;

const fiberyEndpointMeta = {
	'schema.query': {
		riskLevel: 'read',
		description: 'Read Fibery workspace databases, fields, and schema metadata',
	},
	'schema.createDatabase': {
		riskLevel: 'write',
		description:
			'Create a Fibery database with its documented fields and metadata',
	},
	'schema.renameDatabase': {
		riskLevel: 'write',
		description: 'Rename a Fibery database',
	},
	'schema.deleteDatabase': {
		riskLevel: 'destructive',
		description:
			'Delete a Fibery database and optionally its entities and related fields',
	},
	'schema.createField': {
		riskLevel: 'write',
		description: 'Create a primitive or relation field in a Fibery database',
	},
	'schema.createEnum': {
		riskLevel: 'write',
		description: 'Create a Fibery enum database for select-field options',
	},
	'schema.renameField': {
		riskLevel: 'write',
		description: 'Rename a field in a Fibery database',
	},
	'schema.deleteField': {
		riskLevel: 'destructive',
		description: 'Delete a Fibery field and optionally its stored values',
	},
	'schema.setFieldMeta': {
		riskLevel: 'write',
		description: 'Set documented metadata on a Fibery database field',
	},
	'schema.installMixins': {
		riskLevel: 'write',
		description: 'Install documented Fibery mixins on databases',
	},
	'entity.query': {
		riskLevel: 'read',
		description:
			'Query Fibery entities with select, filter, order, and bounded pagination clauses',
	},
	'entity.create': {
		riskLevel: 'write',
		description:
			'Create a Fibery entity with primitive and relation field values',
	},
	'entity.update': {
		riskLevel: 'write',
		description:
			'Update primitive and relation field values on a Fibery entity',
	},
	'entity.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Fibery entity by database and UUID',
	},
	'entity.upsert': {
		riskLevel: 'write',
		description:
			'Create or resolve duplicate Fibery entities using documented conflict actions',
	},
	'collection.add': {
		riskLevel: 'write',
		description: 'Add existing entities to a Fibery collection field',
	},
	'collection.remove': {
		riskLevel: 'write',
		description: 'Remove existing entities from a Fibery collection field',
	},
	'collection.set': {
		riskLevel: 'destructive',
		description:
			'Replace the contents of a Fibery collection field, unlinking every item not in the new list',
	},
	'collection.reset': {
		riskLevel: 'destructive',
		description: 'Clear all items from a Fibery collection field',
	},
	'document.get': {
		riskLevel: 'read',
		description:
			'Read a Fibery collaborative document in Markdown, HTML, JSON, or plain text',
	},
	'document.getBatch': {
		riskLevel: 'read',
		description: 'Read several Fibery collaborative documents in one request',
	},
	'document.update': {
		riskLevel: 'write',
		description: 'Replace the content of a Fibery collaborative document',
	},
	'document.updateBatch': {
		riskLevel: 'write',
		description:
			'Create or replace several Fibery collaborative documents in one request',
	},
	'file.upload': {
		riskLevel: 'write',
		description: 'Upload a base64-encoded file to Fibery storage',
	},
	'file.download': {
		riskLevel: 'read',
		description: 'Download a Fibery file as base64-encoded binary data',
	},
	'file.signUrls': {
		riskLevel: 'read',
		description: 'Create temporary 60-minute public URLs for Fibery files',
	},
	'views.query': {
		riskLevel: 'read',
		description:
			'Query Fibery views by UUID, public ID, privacy, or entity container',
	},
	'views.create': {
		riskLevel: 'write',
		description: 'Create one or more Fibery views',
	},
	'views.update': {
		riskLevel: 'write',
		description: 'Update one or more Fibery views',
	},
	'views.delete': {
		riskLevel: 'destructive',
		description: 'Delete Fibery views by UUID',
	},
	'history.search': {
		riskLevel: 'read',
		description:
			'Search paginated Fibery entity change history with filters and time bounds',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fiberyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const fiberyAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseFiberyPlugin<T extends FiberyPluginOptions> = CorsairPlugin<
	'fibery',
	typeof FiberySchema,
	typeof fiberyEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalFiberyPlugin = BaseFiberyPlugin<FiberyPluginOptions>;
export type ExternalFiberyPlugin<T extends FiberyPluginOptions> =
	BaseFiberyPlugin<T>;

export function fibery<const T extends FiberyPluginOptions>(
	incomingOptions: FiberyPluginOptions & T = {} as FiberyPluginOptions & T,
): ExternalFiberyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	return {
		id: 'fibery',
		authConfig: fiberyAuthConfig,
		oauthConfig: {
			providerName: 'Fibery',
			authUrl: 'https://auth.fibery.io/oauth2/auth',
			tokenUrl: 'https://auth.fibery.io/oauth2/token',
			scopes: ['openid', 'offline'],
			tokenAuthMethod: 'basic',
		},
		schema: FiberySchema,
		options,
		hooks: options.hooks,
		endpoints: fiberyEndpointsNested,
		webhooks: {},
		endpointMeta: fiberyEndpointMeta,
		endpointSchemas: fiberyEndpointSchemas,
		errorHandlers: {
			...callerHandlers,
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: FiberyKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'fibery',
					tokenUrl: 'https://auth.fibery.io/oauth2/token',
					tokenAuthMethod: 'basic',
				});
			}
			if (ctx.authType === 'api_key') {
				const credential = await ctx.keys.get_api_key();
				if (!credential) throw new AuthMissingError('fibery', 'api_key');
				return credential;
			}
			throw new AuthMissingError('fibery', 'api_key');
		},
	} satisfies InternalFiberyPlugin;
}

export type { FiberyEndpointInputs, FiberyEndpointOutputs };
