import { AuthMissingError } from 'corsair/core';
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
import { Datasets, Exports, Rows, Upload, User, Views } from './endpoints';
import type {
	GigasheetEndpointInputs,
	GigasheetEndpointOutputs,
} from './endpoints/types';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GigasheetSchema } from './schema';

export type GigasheetPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGigasheetPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gigasheetEndpointsNested>;
};

export type GigasheetContext = CorsairPluginContext<
	typeof GigasheetSchema,
	GigasheetPluginOptions
>;

export type GigasheetKeyBuilderContext =
	KeyBuilderContext<GigasheetPluginOptions>;

export type GigasheetBoundEndpoints = BindEndpoints<
	typeof gigasheetEndpointsNested
>;

type GigasheetEndpoint<K extends keyof GigasheetEndpointOutputs> =
	CorsairEndpoint<
		GigasheetContext,
		GigasheetEndpointInputs[K],
		GigasheetEndpointOutputs[K]
	>;

export type GigasheetEndpoints = {
	'user.whoami': GigasheetEndpoint<'user.whoami'>;
	'user.getDetails': GigasheetEndpoint<'user.getDetails'>;
	'user.getSpaceUsed': GigasheetEndpoint<'user.getSpaceUsed'>;
	'user.getEnrichmentCredits': GigasheetEndpoint<'user.getEnrichmentCredits'>;
	'upload.fromUrl': GigasheetEndpoint<'upload.fromUrl'>;
	'upload.direct': GigasheetEndpoint<'upload.direct'>;
	'datasets.get': GigasheetEndpoint<'datasets.get'>;
	'datasets.delete': GigasheetEndpoint<'datasets.delete'>;
	'datasets.getColumns': GigasheetEndpoint<'datasets.getColumns'>;
	'datasets.list': GigasheetEndpoint<'datasets.list'>;
	'datasets.getOperationStatus': GigasheetEndpoint<'datasets.getOperationStatus'>;
	'rows.appendByName': GigasheetEndpoint<'rows.appendByName'>;
	'rows.insertBlankRow': GigasheetEndpoint<'rows.insertBlankRow'>;
	'rows.deleteRows': GigasheetEndpoint<'rows.deleteRows'>;
	'views.list': GigasheetEndpoint<'views.list'>;
	'views.get': GigasheetEndpoint<'views.get'>;
	'exports.create': GigasheetEndpoint<'exports.create'>;
	'exports.download': GigasheetEndpoint<'exports.download'>;
};

const gigasheetEndpointsNested = {
	user: {
		whoami: User.whoami,
		getDetails: User.getDetails,
		getSpaceUsed: User.getSpaceUsed,
		getEnrichmentCredits: User.getEnrichmentCredits,
	},
	upload: {
		fromUrl: Upload.fromUrl,
		direct: Upload.direct,
	},
	datasets: {
		get: Datasets.get,
		delete: Datasets.delete,
		getColumns: Datasets.getColumns,
		list: Datasets.list,
		getOperationStatus: Datasets.getOperationStatus,
	},
	rows: {
		appendByName: Rows.appendByName,
		insertBlankRow: Rows.insertBlankRow,
		deleteRows: Rows.deleteRows,
	},
	views: {
		list: Views.list,
		get: Views.get,
	},
	exports: {
		create: Exports.create,
		download: Exports.download,
	},
} as const;

export const gigasheetEndpointSchemas = {
	'user.whoami': {
		input: GigasheetEndpointInputSchemas['user.whoami'],
		output: GigasheetEndpointOutputSchemas['user.whoami'],
	},
	'user.getDetails': {
		input: GigasheetEndpointInputSchemas['user.getDetails'],
		output: GigasheetEndpointOutputSchemas['user.getDetails'],
	},
	'user.getSpaceUsed': {
		input: GigasheetEndpointInputSchemas['user.getSpaceUsed'],
		output: GigasheetEndpointOutputSchemas['user.getSpaceUsed'],
	},
	'user.getEnrichmentCredits': {
		input: GigasheetEndpointInputSchemas['user.getEnrichmentCredits'],
		output: GigasheetEndpointOutputSchemas['user.getEnrichmentCredits'],
	},
	'upload.fromUrl': {
		input: GigasheetEndpointInputSchemas['upload.fromUrl'],
		output: GigasheetEndpointOutputSchemas['upload.fromUrl'],
	},
	'upload.direct': {
		input: GigasheetEndpointInputSchemas['upload.direct'],
		output: GigasheetEndpointOutputSchemas['upload.direct'],
	},
	'datasets.get': {
		input: GigasheetEndpointInputSchemas['datasets.get'],
		output: GigasheetEndpointOutputSchemas['datasets.get'],
	},
	'datasets.delete': {
		input: GigasheetEndpointInputSchemas['datasets.delete'],
		output: GigasheetEndpointOutputSchemas['datasets.delete'],
	},
	'datasets.getColumns': {
		input: GigasheetEndpointInputSchemas['datasets.getColumns'],
		output: GigasheetEndpointOutputSchemas['datasets.getColumns'],
	},
	'datasets.list': {
		input: GigasheetEndpointInputSchemas['datasets.list'],
		output: GigasheetEndpointOutputSchemas['datasets.list'],
	},
	'datasets.getOperationStatus': {
		input: GigasheetEndpointInputSchemas['datasets.getOperationStatus'],
		output: GigasheetEndpointOutputSchemas['datasets.getOperationStatus'],
	},
	'rows.appendByName': {
		input: GigasheetEndpointInputSchemas['rows.appendByName'],
		output: GigasheetEndpointOutputSchemas['rows.appendByName'],
	},
	'rows.insertBlankRow': {
		input: GigasheetEndpointInputSchemas['rows.insertBlankRow'],
		output: GigasheetEndpointOutputSchemas['rows.insertBlankRow'],
	},
	'rows.deleteRows': {
		input: GigasheetEndpointInputSchemas['rows.deleteRows'],
		output: GigasheetEndpointOutputSchemas['rows.deleteRows'],
	},
	'views.list': {
		input: GigasheetEndpointInputSchemas['views.list'],
		output: GigasheetEndpointOutputSchemas['views.list'],
	},
	'views.get': {
		input: GigasheetEndpointInputSchemas['views.get'],
		output: GigasheetEndpointOutputSchemas['views.get'],
	},
	'exports.create': {
		input: GigasheetEndpointInputSchemas['exports.create'],
		output: GigasheetEndpointOutputSchemas['exports.create'],
	},
	'exports.download': {
		input: GigasheetEndpointInputSchemas['exports.download'],
		output: GigasheetEndpointOutputSchemas['exports.download'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gigasheetEndpointsNested
>;

const gigasheetEndpointMeta = {
	'user.whoami': {
		riskLevel: 'read',
		description:
			'Check authentication status and retrieve username of the current request',
	},
	'user.getDetails': {
		riskLevel: 'read',
		description:
			'Retrieve detailed account and profile information for the authenticated user',
	},
	'user.getSpaceUsed': {
		riskLevel: 'read',
		description:
			'Retrieve total storage space used by the authenticated user in bytes',
	},
	'user.getEnrichmentCredits': {
		riskLevel: 'read',
		description:
			'Retrieve enrichment credit limit and used credit balance for the authenticated user',
	},
	'upload.fromUrl': {
		riskLevel: 'write',
		description:
			'Upload a dataset into Gigasheet from a publicly accessible or presigned URL',
	},
	'upload.direct': {
		riskLevel: 'write',
		description:
			'Upload raw file contents or byte array directly into Gigasheet',
	},
	'datasets.get': {
		riskLevel: 'read',
		description:
			'Retrieve metadata, column names, types, and processing status of a dataset',
	},
	'datasets.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a sheet or folder by handle, optionally deleting child files',
	},
	'datasets.getColumns': {
		riskLevel: 'read',
		description:
			'Retrieve column IDs, headers, and data types for a given sheet',
	},
	'datasets.list': {
		riskLevel: 'read',
		description:
			'List files and directories in root library or specified folder handle',
	},
	'datasets.getOperationStatus': {
		riskLevel: 'read',
		description:
			'Retrieve operation status for an asynchronous dataset task (Working, Done, Error)',
	},
	'rows.appendByName': {
		riskLevel: 'write',
		description:
			'Append new records to an existing sheet matching columns by name',
	},
	'rows.insertBlankRow': {
		riskLevel: 'write',
		description:
			'Insert one or more blank rows with null values at a given row index',
	},
	'rows.deleteRows': {
		riskLevel: 'destructive',
		description:
			'Permanently delete specified rows from a dataset by iterator number',
	},
	'views.list': {
		riskLevel: 'read',
		description:
			'Retrieve all saved views and configurations associated with a dataset',
	},
	'views.get': {
		riskLevel: 'read',
		description:
			'Retrieve metadata and client state identifier for a specific saved view',
	},
	'exports.create': {
		riskLevel: 'write',
		description:
			'Queue an asynchronous export job with optional AgGrid filter and sort state',
	},
	'exports.download': {
		riskLevel: 'read',
		description:
			'Retrieve a temporary presigned S3 download URL for a completed export',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof gigasheetEndpointsNested
>;

export const gigasheetAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const PUBLIC_ENDPOINTS = new Set(['user.whoami']);

export type BaseGigasheetPlugin<T extends GigasheetPluginOptions> =
	CorsairPlugin<
		'gigasheet',
		typeof GigasheetSchema,
		typeof gigasheetEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalGigasheetPlugin =
	BaseGigasheetPlugin<GigasheetPluginOptions>;

export type ExternalGigasheetPlugin<T extends GigasheetPluginOptions> =
	BaseGigasheetPlugin<T>;

export function gigasheet<const T extends GigasheetPluginOptions>(
	incomingOptions: GigasheetPluginOptions &
		T = {} as GigasheetPluginOptions & T,
): ExternalGigasheetPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'gigasheet',
		authConfig: gigasheetAuthConfig,
		schema: GigasheetSchema,
		options,
		hooks: options.hooks,
		endpoints: gigasheetEndpointsNested,
		webhooks: {},
		endpointMeta: gigasheetEndpointMeta,
		endpointSchemas: gigasheetEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: GigasheetKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) {
				return (await ctx.keys?.get_api_key()) || '';
			}
			if (!ctx.keys) throw new AuthMissingError('gigasheet', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('gigasheet', 'api_key');
			return apiKey;
		},
	} satisfies InternalGigasheetPlugin;
}

export type {
	DatasetsDeleteInput,
	DatasetsDeleteResponse,
	DatasetsGetColumnsInput,
	DatasetsGetColumnsResponse,
	DatasetsGetInput,
	DatasetsGetOperationStatusInput,
	DatasetsGetOperationStatusResponse,
	DatasetsGetResponse,
	DatasetsListInput,
	DatasetsListResponse,
	ExportsCreateInput,
	ExportsCreateResponse,
	ExportsDownloadInput,
	ExportsDownloadResponse,
	GigasheetEndpointInputs,
	GigasheetEndpointOutputs,
	RowsAppendByNameInput,
	RowsAppendByNameResponse,
	RowsDeleteRowsInput,
	RowsDeleteRowsResponse,
	RowsInsertBlankRowInput,
	RowsInsertBlankRowResponse,
	UploadDirectInput,
	UploadDirectResponse,
	UploadFromUrlInput,
	UploadFromUrlResponse,
	UserGetDetailsInput,
	UserGetDetailsResponse,
	UserGetEnrichmentCreditsInput,
	UserGetEnrichmentCreditsResponse,
	UserGetSpaceUsedInput,
	UserGetSpaceUsedResponse,
	UserWhoamiInput,
	UserWhoamiResponse,
	ViewsGetInput,
	ViewsGetResponse,
	ViewsListInput,
	ViewsListResponse,
} from './endpoints/types';
export {
	Datasets,
	Exports,
	Rows,
	Upload,
	User,
	Views,
} from './endpoints';
