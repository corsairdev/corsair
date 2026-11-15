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
import { AuthMissingError } from 'corsair/core';
import { Account, Conversions, Files, Tasks } from './endpoints';
import type {
	ConversiontoolsEndpointInputs,
	ConversiontoolsEndpointOutputs,
} from './endpoints/types';
import {
	ConversiontoolsEndpointInputSchemas,
	ConversiontoolsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MAX_TRANSFER_TIMEOUT_MS, MIN_TRANSFER_TIMEOUT_MS } from './limits';
import { ConversiontoolsSchema } from './schema';

const PUBLIC_ENDPOINTS = new Set([
	'conversions.list',
	'conversions.get',
	'files.downloadFromLink',
	'files.uploadToSession',
]);

export type ConversiontoolsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Timeout for file uploads and downloads in milliseconds. Defaults to five
	 * minutes; valid values are 20 seconds through 10 minutes.
	 */
	transferTimeoutMs?: number;
	hooks?: InternalConversiontoolsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof conversiontoolsEndpointsNested>;
};

export type ConversiontoolsContext = CorsairPluginContext<
	typeof ConversiontoolsSchema,
	ConversiontoolsPluginOptions
>;

export type ConversiontoolsKeyBuilderContext =
	KeyBuilderContext<ConversiontoolsPluginOptions>;

export type ConversiontoolsBoundEndpoints = BindEndpoints<
	typeof conversiontoolsEndpointsNested
>;

type ConversiontoolsEndpoint<K extends keyof ConversiontoolsEndpointOutputs> =
	CorsairEndpoint<
		ConversiontoolsContext,
		ConversiontoolsEndpointInputs[K],
		ConversiontoolsEndpointOutputs[K]
	>;

export type ConversiontoolsEndpoints = {
	account: {
		verify: ConversiontoolsEndpoint<'accountVerify'>;
		getInfo: ConversiontoolsEndpoint<'accountGetInfo'>;
		getConfig: ConversiontoolsEndpoint<'accountGetConfig'>;
	};
	conversions: {
		list: ConversiontoolsEndpoint<'conversionsList'>;
		get: ConversiontoolsEndpoint<'conversionsGet'>;
	};
	files: {
		upload: ConversiontoolsEndpoint<'filesUpload'>;
		getInfo: ConversiontoolsEndpoint<'filesGetInfo'>;
		createDownloadLink: ConversiontoolsEndpoint<'filesCreateDownloadLink'>;
		downloadById: ConversiontoolsEndpoint<'filesDownloadById'>;
		downloadFromLink: ConversiontoolsEndpoint<'filesDownloadFromLink'>;
		createUploadSession: ConversiontoolsEndpoint<'filesCreateUploadSession'>;
		uploadToSession: ConversiontoolsEndpoint<'filesUploadToSession'>;
	};
	tasks: {
		create: ConversiontoolsEndpoint<'tasksCreate'>;
		list: ConversiontoolsEndpoint<'tasksList'>;
		get: ConversiontoolsEndpoint<'tasksGet'>;
		updateRetention: ConversiontoolsEndpoint<'tasksUpdateRetention'>;
		remove: ConversiontoolsEndpoint<'tasksRemove'>;
	};
};

const conversiontoolsEndpointsNested = {
	account: {
		verify: Account.verify,
		getInfo: Account.getInfo,
		getConfig: Account.getConfig,
	},
	conversions: {
		list: Conversions.list,
		get: Conversions.get,
	},
	files: {
		upload: Files.upload,
		getInfo: Files.getInfo,
		createDownloadLink: Files.createDownloadLink,
		downloadById: Files.downloadById,
		downloadFromLink: Files.downloadFromLink,
		createUploadSession: Files.createUploadSession,
		uploadToSession: Files.uploadToSession,
	},
	tasks: {
		create: Tasks.create,
		list: Tasks.list,
		get: Tasks.get,
		updateRetention: Tasks.updateRetention,
		remove: Tasks.remove,
	},
} as const;

export const conversiontoolsEndpointSchemas = {
	'account.verify': {
		input: ConversiontoolsEndpointInputSchemas.accountVerify,
		output: ConversiontoolsEndpointOutputSchemas.accountVerify,
	},
	'account.getInfo': {
		input: ConversiontoolsEndpointInputSchemas.accountGetInfo,
		output: ConversiontoolsEndpointOutputSchemas.accountGetInfo,
	},
	'account.getConfig': {
		input: ConversiontoolsEndpointInputSchemas.accountGetConfig,
		output: ConversiontoolsEndpointOutputSchemas.accountGetConfig,
	},
	'conversions.list': {
		input: ConversiontoolsEndpointInputSchemas.conversionsList,
		output: ConversiontoolsEndpointOutputSchemas.conversionsList,
	},
	'conversions.get': {
		input: ConversiontoolsEndpointInputSchemas.conversionsGet,
		output: ConversiontoolsEndpointOutputSchemas.conversionsGet,
	},
	'files.upload': {
		input: ConversiontoolsEndpointInputSchemas.filesUpload,
		output: ConversiontoolsEndpointOutputSchemas.filesUpload,
	},
	'files.getInfo': {
		input: ConversiontoolsEndpointInputSchemas.filesGetInfo,
		output: ConversiontoolsEndpointOutputSchemas.filesGetInfo,
	},
	'files.createDownloadLink': {
		input: ConversiontoolsEndpointInputSchemas.filesCreateDownloadLink,
		output: ConversiontoolsEndpointOutputSchemas.filesCreateDownloadLink,
	},
	'files.downloadById': {
		input: ConversiontoolsEndpointInputSchemas.filesDownloadById,
		output: ConversiontoolsEndpointOutputSchemas.filesDownloadById,
	},
	'files.downloadFromLink': {
		input: ConversiontoolsEndpointInputSchemas.filesDownloadFromLink,
		output: ConversiontoolsEndpointOutputSchemas.filesDownloadFromLink,
	},
	'files.createUploadSession': {
		input: ConversiontoolsEndpointInputSchemas.filesCreateUploadSession,
		output: ConversiontoolsEndpointOutputSchemas.filesCreateUploadSession,
	},
	'files.uploadToSession': {
		input: ConversiontoolsEndpointInputSchemas.filesUploadToSession,
		output: ConversiontoolsEndpointOutputSchemas.filesUploadToSession,
	},
	'tasks.create': {
		input: ConversiontoolsEndpointInputSchemas.tasksCreate,
		output: ConversiontoolsEndpointOutputSchemas.tasksCreate,
	},
	'tasks.list': {
		input: ConversiontoolsEndpointInputSchemas.tasksList,
		output: ConversiontoolsEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: ConversiontoolsEndpointInputSchemas.tasksGet,
		output: ConversiontoolsEndpointOutputSchemas.tasksGet,
	},
	'tasks.updateRetention': {
		input: ConversiontoolsEndpointInputSchemas.tasksUpdateRetention,
		output: ConversiontoolsEndpointOutputSchemas.tasksUpdateRetention,
	},
	'tasks.remove': {
		input: ConversiontoolsEndpointInputSchemas.tasksRemove,
		output: ConversiontoolsEndpointOutputSchemas.tasksRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof conversiontoolsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const conversiontoolsEndpointMeta = {
	'account.verify': {
		riskLevel: 'read',
		description:
			'Verify the API token at the API root. https://conversiontools.io/llms-full.txt',
	},
	'account.getInfo': {
		riskLevel: 'read',
		description:
			'Get authenticated account information. https://api.conversiontools.io/openapi.yaml',
	},
	'account.getConfig': {
		riskLevel: 'read',
		description:
			'Get account-specific converter configuration. https://api.conversiontools.io/openapi.yaml',
	},
	'conversions.list': {
		riskLevel: 'read',
		description:
			'List conversion types with optional format and AI filters. https://conversiontools.io/api-documentation#building-a-connector',
	},
	'conversions.get': {
		riskLevel: 'read',
		description:
			'Get one conversion type and its options. https://api.conversiontools.io/openapi.yaml',
	},
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload a file as multipart form data. https://conversiontools.io/api-documentation#upload-file-to-server',
	},
	'files.getInfo': {
		riskLevel: 'read',
		description:
			'Get file metadata and a text preview when available. https://api.conversiontools.io/openapi.yaml',
	},
	'files.createDownloadLink': {
		riskLevel: 'write',
		description:
			'Mint a temporary download credential for a file. https://conversiontools.io/llms-full.txt',
	},
	'files.downloadById': {
		riskLevel: 'read',
		description:
			'Download file bytes by file ID as base64 with response metadata. https://conversiontools.io/llms-full.txt',
	},
	'files.downloadFromLink': {
		riskLevel: 'read',
		description:
			'Download file bytes using a temporary download ID; the ID is sent without API-key auth. https://conversiontools.io/llms-full.txt',
	},
	'files.createUploadSession': {
		riskLevel: 'write',
		description:
			'Create a one-time upload session for a large file. https://conversiontools.io/llms-full.txt',
	},
	'files.uploadToSession': {
		riskLevel: 'write',
		description:
			'Upload raw file bytes to a one-time session URL. https://conversiontools.io/llms-full.txt',
	},
	'tasks.create': {
		riskLevel: 'destructive',
		description:
			'Create an asynchronous conversion task. https://conversiontools.io/api-documentation#run-conversion-task',
	},
	'tasks.list': {
		riskLevel: 'read',
		description:
			'List recent tasks, optionally filtered by status, with page and limit (up to 100 a page). https://api.conversiontools.io/openapi.yaml',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Get the current state of a conversion task. https://conversiontools.io/api-documentation#get-task-status',
	},
	'tasks.updateRetention': {
		riskLevel: 'write',
		description:
			'Update task file retention mode. https://api.conversiontools.io/openapi.yaml',
	},
	'tasks.remove': {
		riskLevel: 'destructive',
		description:
			'Permanently schedule deletion of task files. https://api.conversiontools.io/openapi.yaml',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof conversiontoolsEndpointsNested
>;

export const conversiontoolsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseConversiontoolsPlugin<T extends ConversiontoolsPluginOptions> =
	CorsairPlugin<
		'conversiontools',
		typeof ConversiontoolsSchema,
		typeof conversiontoolsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalConversiontoolsPlugin =
	BaseConversiontoolsPlugin<ConversiontoolsPluginOptions>;

export type ExternalConversiontoolsPlugin<
	T extends ConversiontoolsPluginOptions,
> = BaseConversiontoolsPlugin<T>;

export function conversiontools<const T extends ConversiontoolsPluginOptions>(
	incomingOptions: ConversiontoolsPluginOptions &
		T = {} as ConversiontoolsPluginOptions & T,
): ExternalConversiontoolsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	if (
		options.transferTimeoutMs !== undefined &&
		(!Number.isInteger(options.transferTimeoutMs) ||
			options.transferTimeoutMs < MIN_TRANSFER_TIMEOUT_MS ||
			options.transferTimeoutMs > MAX_TRANSFER_TIMEOUT_MS)
	) {
		throw new RangeError(
			`transferTimeoutMs must be an integer between ${MIN_TRANSFER_TIMEOUT_MS} and ${MAX_TRANSFER_TIMEOUT_MS} milliseconds`,
		);
	}

	return {
		id: 'conversiontools',
		authConfig: conversiontoolsAuthConfig,
		schema: ConversiontoolsSchema,
		options,
		hooks: options.hooks,
		endpoints: conversiontoolsEndpointsNested,
		// The API has outbound task callbacks, but this plugin handles no inbound webhooks.
		webhooks: {},
		endpointMeta: conversiontoolsEndpointMeta,
		endpointSchemas: conversiontoolsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ConversiontoolsKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) {
				throw new AuthMissingError('conversiontools', 'api_key');
			}
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('conversiontools', 'api_key');
			return apiKey;
		},
	} satisfies InternalConversiontoolsPlugin;
}

export type {
	AccountGetConfigInput,
	AccountGetConfigResponse,
	AccountGetInfoInput,
	AccountGetInfoResponse,
	AccountVerifyInput,
	AccountVerifyResponse,
	Conversion,
	ConversionOption,
	ConversionsGetInput,
	ConversionsGetResponse,
	ConversionsListInput,
	ConversionsListResponse,
	ConversiontoolsEndpointInputs,
	ConversiontoolsEndpointOutputs,
	FilesCreateDownloadLinkInput,
	FilesCreateDownloadLinkResponse,
	FilesCreateUploadSessionInput,
	FilesCreateUploadSessionResponse,
	FilesDownloadByIdInput,
	FilesDownloadFromLinkInput,
	FilesDownloadOutput,
	FilesGetInfoInput,
	FilesGetInfoResponse,
	FilesUploadInput,
	FilesUploadResponse,
	FilesUploadToSessionInput,
	FilesUploadToSessionResponse,
	JsonObject,
	JsonValue,
	TasksCreateInput,
	TasksCreateResponse,
	TasksGetInput,
	TasksGetResponse,
	TasksListInput,
	TasksListResponse,
	TasksRemoveInput,
	TasksRemoveResponse,
	TasksUpdateRetentionInput,
	TasksUpdateRetentionResponse,
} from './endpoints/types';
