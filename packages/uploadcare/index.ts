import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { UploadcareEndpointInputs, UploadcareEndpointOutputs } from './endpoints/types';
import { UploadcareEndpointInputSchemas, UploadcareEndpointOutputSchemas } from './endpoints/types';
import type {
	FileUploadedEvent,
	UploadcareWebhookOutputs,
} from './webhooks/types';
import { FileUploadedEventSchema } from './webhooks/types';
import { Files, Groups, Project, Webhooks } from './endpoints';
import { UploadcareSchema } from './schema';
import { UploadcareWebhooksList } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchUploadcareTenantWebhook } from './webhooks/tenant-matcher';
import { resolveUploadcareOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type UploadcarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalUploadcarePlugin['hooks'];
	webhookHooks?: InternalUploadcarePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof uploadcareEndpointsNested>;
};

export type UploadcareContext = CorsairPluginContext<
	typeof UploadcareSchema,
	UploadcarePluginOptions
>;

export type UploadcareKeyBuilderContext = KeyBuilderContext<UploadcarePluginOptions>;

export type UploadcareBoundEndpoints = BindEndpoints<typeof uploadcareEndpointsNested>;

type UploadcareEndpoint<
	K extends keyof UploadcareEndpointOutputs,
> = CorsairEndpoint<
	UploadcareContext,
	UploadcareEndpointInputs[K],
	UploadcareEndpointOutputs[K]
>;

export type UploadcareEndpoints = {
	filesList: UploadcareEndpoint<'filesList'>;
	fileGet: UploadcareEndpoint<'fileGet'>;
	fileStore: UploadcareEndpoint<'fileStore'>;
	fileDelete: UploadcareEndpoint<'fileDelete'>;
	batchStoreFiles: UploadcareEndpoint<'batchStoreFiles'>;
	batchDeleteFiles: UploadcareEndpoint<'batchDeleteFiles'>;
	groupsList: UploadcareEndpoint<'groupsList'>;
	groupGet: UploadcareEndpoint<'groupGet'>;
	projectGet: UploadcareEndpoint<'projectGet'>;
	webhooksList: UploadcareEndpoint<'webhooksList'>;
	webhookCreate: UploadcareEndpoint<'webhookCreate'>;
	webhookUpdate: UploadcareEndpoint<'webhookUpdate'>;
	webhookDelete: UploadcareEndpoint<'webhookDelete'>;
};

type UploadcareWebhook<
	K extends keyof UploadcareWebhookOutputs,
	TEvent,
> = CorsairWebhook<UploadcareContext, TEvent, UploadcareWebhookOutputs[K]>;

export type UploadcareWebhooks = {
	fileUploaded: UploadcareWebhook<'fileUploaded', FileUploadedEvent>;
};

export type UploadcareBoundWebhooks = BindWebhooks<UploadcareWebhooks>;

const uploadcareEndpointsNested = {
	files: {
		list: Files.list,
		get: Files.get,
		store: Files.store,
		delete: Files.delete,
		batchStore: Files.batchStore,
		batchDelete: Files.batchDelete,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
	},
	project: {
		get: Project.get,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.delete,
	},
} as const;

const uploadcareWebhooksNested = {
	fileUploaded: {
		fileUploaded: UploadcareWebhooksList.fileUploaded,
	},
} as const;

export const uploadcareEndpointSchemas = {
	'files.list': {
		input: UploadcareEndpointInputSchemas.filesList,
		output: UploadcareEndpointOutputSchemas.filesList,
	},
	'files.get': {
		input: UploadcareEndpointInputSchemas.fileGet,
		output: UploadcareEndpointOutputSchemas.fileGet,
	},
	'files.store': {
		input: UploadcareEndpointInputSchemas.fileStore,
		output: UploadcareEndpointOutputSchemas.fileStore,
	},
	'files.delete': {
		input: UploadcareEndpointInputSchemas.fileDelete,
		output: UploadcareEndpointOutputSchemas.fileDelete,
	},
	'files.batchStore': {
		input: UploadcareEndpointInputSchemas.batchStoreFiles,
		output: UploadcareEndpointOutputSchemas.batchStoreFiles,
	},
	'files.batchDelete': {
		input: UploadcareEndpointInputSchemas.batchDeleteFiles,
		output: UploadcareEndpointOutputSchemas.batchDeleteFiles,
	},
	'groups.list': {
		input: UploadcareEndpointInputSchemas.groupsList,
		output: UploadcareEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: UploadcareEndpointInputSchemas.groupGet,
		output: UploadcareEndpointOutputSchemas.groupGet,
	},
	'project.get': {
		input: UploadcareEndpointInputSchemas.projectGet,
		output: UploadcareEndpointOutputSchemas.projectGet,
	},
	'webhooks.list': {
		input: UploadcareEndpointInputSchemas.webhooksList,
		output: UploadcareEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: UploadcareEndpointInputSchemas.webhookCreate,
		output: UploadcareEndpointOutputSchemas.webhookCreate,
	},
	'webhooks.update': {
		input: UploadcareEndpointInputSchemas.webhookUpdate,
		output: UploadcareEndpointOutputSchemas.webhookUpdate,
	},
	'webhooks.delete': {
		input: UploadcareEndpointInputSchemas.webhookDelete,
		output: UploadcareEndpointOutputSchemas.webhookDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof uploadcareEndpointsNested>;

const uploadcareWebhookSchemas = {
	'fileUploaded.fileUploaded': {
		description: 'File uploaded webhook event',
		payload: FileUploadedEventSchema,
		response: FileUploadedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof uploadcareWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const uploadcareEndpointMeta = {
	'files.list': { riskLevel: 'read', description: 'List files in project' },
	'files.get': { riskLevel: 'read', description: 'Get file info by UUID' },
	'files.store': { riskLevel: 'write', description: 'Store a file' },
	'files.delete': { riskLevel: 'write', description: 'Delete a file' },
	'files.batchStore': { riskLevel: 'write', description: 'Batch store files' },
	'files.batchDelete': { riskLevel: 'write', description: 'Batch delete files' },
	'groups.list': { riskLevel: 'read', description: 'List file groups' },
	'groups.get': { riskLevel: 'read', description: 'Get group info by ID' },
	'project.get': { riskLevel: 'read', description: 'Get project info' },
	'webhooks.list': { riskLevel: 'read', description: 'List registered webhooks' },
	'webhooks.create': { riskLevel: 'write', description: 'Create a webhook' },
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': { riskLevel: 'write', description: 'Delete a webhook' },
} as const satisfies RequiredPluginEndpointMeta<typeof uploadcareEndpointsNested>;

export const uploadcareAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUploadcarePlugin<T extends UploadcarePluginOptions> = CorsairPlugin<
	'uploadcare',
	typeof UploadcareSchema,
	typeof uploadcareEndpointsNested,
	typeof uploadcareWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalUploadcarePlugin = BaseUploadcarePlugin<UploadcarePluginOptions>;

export type ExternalUploadcarePlugin<T extends UploadcarePluginOptions> =
	BaseUploadcarePlugin<T>;

export function uploadcare<const T extends UploadcarePluginOptions>(
	incomingOptions: UploadcarePluginOptions & T = {} as UploadcarePluginOptions & T,
): ExternalUploadcarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'uploadcare',
		authConfig: uploadcareAuthConfig,
		schema: UploadcareSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: uploadcareEndpointsNested,
		webhooks: uploadcareWebhooksNested,
		endpointMeta: uploadcareEndpointMeta,
		endpointSchemas: uploadcareEndpointSchemas,
		webhookSchemas: uploadcareWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			return true;
		},
		pluginTenantWebhookMatcher: matchUploadcareTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveUploadcareOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: UploadcareKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalUploadcarePlugin;
}

export type {
	FileUploadedEvent,
	UploadcareWebhookOutputs,
} from './webhooks/types';

export type {
	UploadcareEndpointInputs,
	UploadcareEndpointOutputs,
	FilesListInput,
	FilesListResponse,
} from './endpoints/types';
