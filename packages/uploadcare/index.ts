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
import {
	Addons,
	Cdn,
	Files,
	Groups,
	Project,
	Upload,
	Webhooks,
} from './endpoints';
import type {
	UploadcareEndpointInputs,
	UploadcareEndpointOutputs,
} from './endpoints/types';
import {
	UploadcareEndpointInputSchemas,
	UploadcareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { UploadcareSchema } from './schema';

export type UploadcarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalUploadcarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof uploadcareEndpointsNested>;
};

export type UploadcareContext = CorsairPluginContext<
	typeof UploadcareSchema,
	UploadcarePluginOptions
>;

export type UploadcareKeyBuilderContext =
	KeyBuilderContext<UploadcarePluginOptions>;

export type UploadcareBoundEndpoints = BindEndpoints<
	typeof uploadcareEndpointsNested
>;

type UploadcareEndpoint<K extends keyof UploadcareEndpointOutputs> =
	CorsairEndpoint<
		UploadcareContext,
		UploadcareEndpointInputs[K],
		UploadcareEndpointOutputs[K]
	>;

export type UploadcareEndpoints = {
	[K in keyof UploadcareEndpointOutputs]: UploadcareEndpoint<K>;
};

const uploadcareEndpointsNested = {
	files: {
		list: Files.list,
		get: Files.get,
		store: Files.store,
		delete: Files.delete,
		batchStore: Files.batchStore,
		batchDelete: Files.batchDelete,
		copyLocal: Files.copyLocal,
		getMetadata: Files.getMetadata,
		getMetadataKey: Files.getMetadataKey,
		updateMetadataKey: Files.updateMetadataKey,
		deleteMetadataKey: Files.deleteMetadataKey,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
		delete: Groups.delete,
	},
	project: {
		get: Project.get,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.delete,
		deleteByUrl: Webhooks.deleteByUrl,
	},
	upload: {
		fromUrl: Upload.fromUrl,
		fromUrlStatus: Upload.fromUrlStatus,
		fileInfo: Upload.fileInfo,
		createGroup: Upload.createGroup,
		groupInfo: Upload.groupInfo,
		startMultipart: Upload.startMultipart,
	},
	addons: {
		executeClamav: Addons.executeClamav,
		clamavStatus: Addons.clamavStatus,
		rekognitionStatus: Addons.rekognitionStatus,
		rekognitionModerationStatus: Addons.rekognitionModerationStatus,
		removeBgStatus: Addons.removeBgStatus,
	},
	cdn: {
		mirror: Cdn.mirror,
		rotate: Cdn.rotate,
	},
} as const;

const uploadcareWebhooksNested = {} as const;

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
	'files.copyLocal': {
		input: UploadcareEndpointInputSchemas.copyLocal,
		output: UploadcareEndpointOutputSchemas.copyLocal,
	},
	'files.getMetadata': {
		input: UploadcareEndpointInputSchemas.getFileMetadata,
		output: UploadcareEndpointOutputSchemas.getFileMetadata,
	},
	'files.getMetadataKey': {
		input: UploadcareEndpointInputSchemas.getFileMetadataKey,
		output: UploadcareEndpointOutputSchemas.getFileMetadataKey,
	},
	'files.updateMetadataKey': {
		input: UploadcareEndpointInputSchemas.updateFileMetadataKey,
		output: UploadcareEndpointOutputSchemas.updateFileMetadataKey,
	},
	'files.deleteMetadataKey': {
		input: UploadcareEndpointInputSchemas.deleteFileMetadataKey,
		output: UploadcareEndpointOutputSchemas.deleteFileMetadataKey,
	},
	'groups.list': {
		input: UploadcareEndpointInputSchemas.groupsList,
		output: UploadcareEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: UploadcareEndpointInputSchemas.groupGet,
		output: UploadcareEndpointOutputSchemas.groupGet,
	},
	'groups.delete': {
		input: UploadcareEndpointInputSchemas.groupDelete,
		output: UploadcareEndpointOutputSchemas.groupDelete,
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
	'webhooks.deleteByUrl': {
		input: UploadcareEndpointInputSchemas.webhookDeleteByUrl,
		output: UploadcareEndpointOutputSchemas.webhookDeleteByUrl,
	},
	'upload.fromUrl': {
		input: UploadcareEndpointInputSchemas.uploadFromUrl,
		output: UploadcareEndpointOutputSchemas.uploadFromUrl,
	},
	'upload.fromUrlStatus': {
		input: UploadcareEndpointInputSchemas.getUrlUploadStatus,
		output: UploadcareEndpointOutputSchemas.getUrlUploadStatus,
	},
	'upload.fileInfo': {
		input: UploadcareEndpointInputSchemas.getUploadedFileInfo,
		output: UploadcareEndpointOutputSchemas.getUploadedFileInfo,
	},
	'upload.createGroup': {
		input: UploadcareEndpointInputSchemas.createFileGroupUpload,
		output: UploadcareEndpointOutputSchemas.createFileGroupUpload,
	},
	'upload.groupInfo': {
		input: UploadcareEndpointInputSchemas.getFileGroupInfoUpload,
		output: UploadcareEndpointOutputSchemas.getFileGroupInfoUpload,
	},
	'upload.startMultipart': {
		input: UploadcareEndpointInputSchemas.startMultipartUpload,
		output: UploadcareEndpointOutputSchemas.startMultipartUpload,
	},
	'addons.executeClamav': {
		input: UploadcareEndpointInputSchemas.executeClamavScan,
		output: UploadcareEndpointOutputSchemas.executeClamavScan,
	},
	'addons.clamavStatus': {
		input: UploadcareEndpointInputSchemas.getClamavScanStatus,
		output: UploadcareEndpointOutputSchemas.getClamavScanStatus,
	},
	'addons.rekognitionStatus': {
		input: UploadcareEndpointInputSchemas.getAwsRekognitionExecutionStatus,
		output: UploadcareEndpointOutputSchemas.getAwsRekognitionExecutionStatus,
	},
	'addons.rekognitionModerationStatus': {
		input: UploadcareEndpointInputSchemas.checkAwsRekognitionModerationStatus,
		output: UploadcareEndpointOutputSchemas.checkAwsRekognitionModerationStatus,
	},
	'addons.removeBgStatus': {
		input: UploadcareEndpointInputSchemas.checkRemoveBgStatus,
		output: UploadcareEndpointOutputSchemas.checkRemoveBgStatus,
	},
	'cdn.mirror': {
		input: UploadcareEndpointInputSchemas.imageMirror,
		output: UploadcareEndpointOutputSchemas.imageMirror,
	},
	'cdn.rotate': {
		input: UploadcareEndpointInputSchemas.rotateImage,
		output: UploadcareEndpointOutputSchemas.rotateImage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof uploadcareEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const uploadcareEndpointMeta = {
	'files.list': {
		riskLevel: 'read',
		description: 'List files with pagination, stored/removed filters',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Get file info by UUID (official REST v0.7)',
	},
	'files.store': {
		riskLevel: 'write',
		description: 'Permanently store a file by UUID',
	},
	'files.delete': {
		riskLevel: 'write',
		description: 'Delete a stored file by UUID',
	},
	'files.batchStore': {
		riskLevel: 'write',
		description: 'Store up to 100 files in one request',
	},
	'files.batchDelete': {
		riskLevel: 'write',
		description: 'Delete up to 100 files; problems lists invalid UUIDs',
	},
	'files.copyLocal': {
		riskLevel: 'write',
		description: 'Copy a file to local storage in the same project',
	},
	'files.getMetadata': {
		riskLevel: 'read',
		description: 'Get all metadata key-value pairs for a file',
	},
	'files.getMetadataKey': {
		riskLevel: 'read',
		description: 'Get one metadata value by key',
	},
	'files.updateMetadataKey': {
		riskLevel: 'write',
		description: 'Set a metadata key on a file',
	},
	'files.deleteMetadataKey': {
		riskLevel: 'write',
		description: 'Delete a metadata key from a file',
	},
	'groups.list': { riskLevel: 'read', description: 'List file groups' },
	'groups.get': { riskLevel: 'read', description: 'Get group info by ID' },
	'groups.delete': {
		riskLevel: 'write',
		description: 'Delete a group (files are not deleted)',
	},
	'project.get': { riskLevel: 'read', description: 'Get current project info' },
	'webhooks.list': { riskLevel: 'read', description: 'List project webhooks' },
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription',
	},
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': {
		riskLevel: 'write',
		description: 'Delete a webhook by ID',
	},
	'webhooks.deleteByUrl': {
		riskLevel: 'write',
		description: 'Unsubscribe a webhook by target URL',
	},
	'upload.fromUrl': {
		riskLevel: 'write',
		description: 'Upload a file from a public URL',
	},
	'upload.fromUrlStatus': {
		riskLevel: 'read',
		description: 'Check from-URL upload status',
	},
	'upload.fileInfo': {
		riskLevel: 'read',
		description: 'Get uploaded file info from Upload API',
	},
	'upload.createGroup': {
		riskLevel: 'write',
		description: 'Create a file group via Upload API',
	},
	'upload.groupInfo': {
		riskLevel: 'read',
		description: 'Get file group info from Upload API',
	},
	'upload.startMultipart': {
		riskLevel: 'write',
		description: 'Start multipart upload for files over 100MB',
	},
	'addons.executeClamav': {
		riskLevel: 'write',
		description: 'Start a ClamAV virus scan',
	},
	'addons.clamavStatus': {
		riskLevel: 'read',
		description: 'Check ClamAV scan status',
	},
	'addons.rekognitionStatus': {
		riskLevel: 'read',
		description: 'Check AWS Rekognition labels job status',
	},
	'addons.rekognitionModerationStatus': {
		riskLevel: 'read',
		description: 'Check AWS Rekognition moderation job status',
	},
	'addons.removeBgStatus': {
		riskLevel: 'read',
		description: 'Check Remove.bg add-on status',
	},
	'cdn.mirror': {
		riskLevel: 'read',
		description: 'CDN URL for a horizontally mirrored image',
	},
	'cdn.rotate': {
		riskLevel: 'read',
		description: 'CDN URL for a counterclockwise rotated image',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof uploadcareEndpointsNested
>;

export const uploadcareAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseUploadcarePlugin<T extends UploadcarePluginOptions> =
	CorsairPlugin<
		'uploadcare',
		typeof UploadcareSchema,
		typeof uploadcareEndpointsNested,
		typeof uploadcareWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalUploadcarePlugin =
	BaseUploadcarePlugin<UploadcarePluginOptions>;

export type ExternalUploadcarePlugin<T extends UploadcarePluginOptions> =
	BaseUploadcarePlugin<T>;

export function uploadcare<const T extends UploadcarePluginOptions>(
	incomingOptions: UploadcarePluginOptions & T = {} as UploadcarePluginOptions &
		T,
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
		webhookHooks: undefined,
		endpoints: uploadcareEndpointsNested,
		webhooks: uploadcareWebhooksNested,
		endpointMeta: uploadcareEndpointMeta,
		endpointSchemas: uploadcareEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: UploadcareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				if (!ctx.keys) return '';
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalUploadcarePlugin;
}

export type {
	UploadcareEndpointInputs,
	UploadcareEndpointOutputs,
} from './endpoints/types';
