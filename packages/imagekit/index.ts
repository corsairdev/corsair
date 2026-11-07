import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Cache, Files, FileVersions, Folders, Metadata } from './endpoints';
import type {
	ImageKitEndpointInputs,
	ImageKitEndpointOutputs,
} from './endpoints/types';
import {
	ImageKitEndpointInputSchemas,
	ImageKitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ImageKitSchema } from './schema';

export type ImageKitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalImageKitPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof imageKitEndpointsNested>;
};

export type ImageKitContext = CorsairPluginContext<
	typeof ImageKitSchema,
	ImageKitPluginOptions
>;

export type ImageKitKeyBuilderContext =
	KeyBuilderContext<ImageKitPluginOptions>;

export type ImageKitBoundEndpoints = BindEndpoints<
	typeof imageKitEndpointsNested
>;

type ImageKitEndpoint<K extends keyof ImageKitEndpointOutputs> =
	CorsairEndpoint<
		ImageKitContext,
		ImageKitEndpointInputs[K],
		ImageKitEndpointOutputs[K]
	>;

export type ImageKitEndpoints = {
	filesUpload: ImageKitEndpoint<'filesUpload'>;
	filesList: ImageKitEndpoint<'filesList'>;
	filesGetDetails: ImageKitEndpoint<'filesGetDetails'>;
	filesUpdateDetails: ImageKitEndpoint<'filesUpdateDetails'>;
	filesDelete: ImageKitEndpoint<'filesDelete'>;
	filesBulkDelete: ImageKitEndpoint<'filesBulkDelete'>;
	filesCopy: ImageKitEndpoint<'filesCopy'>;
	filesMove: ImageKitEndpoint<'filesMove'>;
	filesRename: ImageKitEndpoint<'filesRename'>;
	filesAddTags: ImageKitEndpoint<'filesAddTags'>;
	filesRemoveTags: ImageKitEndpoint<'filesRemoveTags'>;
	filesRemoveAITags: ImageKitEndpoint<'filesRemoveAITags'>;
	fileVersionsList: ImageKitEndpoint<'fileVersionsList'>;
	fileVersionsGetDetails: ImageKitEndpoint<'fileVersionsGetDetails'>;
	fileVersionsDelete: ImageKitEndpoint<'fileVersionsDelete'>;
	fileVersionsRestore: ImageKitEndpoint<'fileVersionsRestore'>;
	metadataGetByFileId: ImageKitEndpoint<'metadataGetByFileId'>;
	metadataGetByUrl: ImageKitEndpoint<'metadataGetByUrl'>;
	foldersCreate: ImageKitEndpoint<'foldersCreate'>;
	foldersDelete: ImageKitEndpoint<'foldersDelete'>;
	foldersCopy: ImageKitEndpoint<'foldersCopy'>;
	foldersMove: ImageKitEndpoint<'foldersMove'>;
	foldersRename: ImageKitEndpoint<'foldersRename'>;
	foldersGetJobStatus: ImageKitEndpoint<'foldersGetJobStatus'>;
	cachePurge: ImageKitEndpoint<'cachePurge'>;
	cacheGetPurgeStatus: ImageKitEndpoint<'cacheGetPurgeStatus'>;
};

const imageKitEndpointsNested = {
	files: {
		upload: Files.upload,
		list: Files.list,
		getDetails: Files.getDetails,
		updateDetails: Files.updateDetails,
		delete: Files.delete,
		bulkDelete: Files.bulkDelete,
		copy: Files.copy,
		move: Files.move,
		rename: Files.rename,
		addTags: Files.addTags,
		removeTags: Files.removeTags,
		removeAITags: Files.removeAITags,
	},
	fileVersions: {
		list: FileVersions.list,
		getDetails: FileVersions.getDetails,
		delete: FileVersions.delete,
		restore: FileVersions.restore,
	},
	metadata: {
		getByFileId: Metadata.getByFileId,
		getByUrl: Metadata.getByUrl,
	},
	folders: {
		create: Folders.create,
		delete: Folders.delete,
		copy: Folders.copy,
		move: Folders.move,
		rename: Folders.rename,
		getJobStatus: Folders.getJobStatus,
	},
	cache: {
		purge: Cache.purge,
		getPurgeStatus: Cache.getPurgeStatus,
	},
} as const;

export const imageKitEndpointSchemas = {
	'files.upload': {
		input: ImageKitEndpointInputSchemas.filesUpload,
		output: ImageKitEndpointOutputSchemas.filesUpload,
	},
	'files.list': {
		input: ImageKitEndpointInputSchemas.filesList,
		output: ImageKitEndpointOutputSchemas.filesList,
	},
	'files.getDetails': {
		input: ImageKitEndpointInputSchemas.filesGetDetails,
		output: ImageKitEndpointOutputSchemas.filesGetDetails,
	},
	'files.updateDetails': {
		input: ImageKitEndpointInputSchemas.filesUpdateDetails,
		output: ImageKitEndpointOutputSchemas.filesUpdateDetails,
	},
	'files.delete': {
		input: ImageKitEndpointInputSchemas.filesDelete,
		output: ImageKitEndpointOutputSchemas.filesDelete,
	},
	'files.bulkDelete': {
		input: ImageKitEndpointInputSchemas.filesBulkDelete,
		output: ImageKitEndpointOutputSchemas.filesBulkDelete,
	},
	'files.copy': {
		input: ImageKitEndpointInputSchemas.filesCopy,
		output: ImageKitEndpointOutputSchemas.filesCopy,
	},
	'files.move': {
		input: ImageKitEndpointInputSchemas.filesMove,
		output: ImageKitEndpointOutputSchemas.filesMove,
	},
	'files.rename': {
		input: ImageKitEndpointInputSchemas.filesRename,
		output: ImageKitEndpointOutputSchemas.filesRename,
	},
	'files.addTags': {
		input: ImageKitEndpointInputSchemas.filesAddTags,
		output: ImageKitEndpointOutputSchemas.filesAddTags,
	},
	'files.removeTags': {
		input: ImageKitEndpointInputSchemas.filesRemoveTags,
		output: ImageKitEndpointOutputSchemas.filesRemoveTags,
	},
	'files.removeAITags': {
		input: ImageKitEndpointInputSchemas.filesRemoveAITags,
		output: ImageKitEndpointOutputSchemas.filesRemoveAITags,
	},
	'fileVersions.list': {
		input: ImageKitEndpointInputSchemas.fileVersionsList,
		output: ImageKitEndpointOutputSchemas.fileVersionsList,
	},
	'fileVersions.getDetails': {
		input: ImageKitEndpointInputSchemas.fileVersionsGetDetails,
		output: ImageKitEndpointOutputSchemas.fileVersionsGetDetails,
	},
	'fileVersions.delete': {
		input: ImageKitEndpointInputSchemas.fileVersionsDelete,
		output: ImageKitEndpointOutputSchemas.fileVersionsDelete,
	},
	'fileVersions.restore': {
		input: ImageKitEndpointInputSchemas.fileVersionsRestore,
		output: ImageKitEndpointOutputSchemas.fileVersionsRestore,
	},
	'metadata.getByFileId': {
		input: ImageKitEndpointInputSchemas.metadataGetByFileId,
		output: ImageKitEndpointOutputSchemas.metadataGetByFileId,
	},
	'metadata.getByUrl': {
		input: ImageKitEndpointInputSchemas.metadataGetByUrl,
		output: ImageKitEndpointOutputSchemas.metadataGetByUrl,
	},
	'folders.create': {
		input: ImageKitEndpointInputSchemas.foldersCreate,
		output: ImageKitEndpointOutputSchemas.foldersCreate,
	},
	'folders.delete': {
		input: ImageKitEndpointInputSchemas.foldersDelete,
		output: ImageKitEndpointOutputSchemas.foldersDelete,
	},
	'folders.copy': {
		input: ImageKitEndpointInputSchemas.foldersCopy,
		output: ImageKitEndpointOutputSchemas.foldersCopy,
	},
	'folders.move': {
		input: ImageKitEndpointInputSchemas.foldersMove,
		output: ImageKitEndpointOutputSchemas.foldersMove,
	},
	'folders.rename': {
		input: ImageKitEndpointInputSchemas.foldersRename,
		output: ImageKitEndpointOutputSchemas.foldersRename,
	},
	'folders.getJobStatus': {
		input: ImageKitEndpointInputSchemas.foldersGetJobStatus,
		output: ImageKitEndpointOutputSchemas.foldersGetJobStatus,
	},
	'cache.purge': {
		input: ImageKitEndpointInputSchemas.cachePurge,
		output: ImageKitEndpointOutputSchemas.cachePurge,
	},
	'cache.getPurgeStatus': {
		input: ImageKitEndpointInputSchemas.cacheGetPurgeStatus,
		output: ImageKitEndpointOutputSchemas.cacheGetPurgeStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof imageKitEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// Folder bulk jobs and cache purges run on ImageKit after submit returns.
// Status values are only Pending and Completed; ImageKit documents no failed
// state, so failed stays empty and jobs.test.ts keeps that in step.
const FOLDER_JOB = {
	idPath: 'jobId',
	status: {
		op: 'folders.getJobStatus',
		idArg: 'jobId',
		statusPath: 'status',
		done: ['Completed'],
		failed: [],
	},
} as const;

const PURGE_JOB = {
	idPath: 'requestId',
	status: {
		op: 'cache.getPurgeStatus',
		idArg: 'requestId',
		statusPath: 'status',
		done: ['Completed'],
		failed: [],
	},
} as const;

const imageKitEndpointMeta = {
	'files.upload': {
		riskLevel: 'write',
		description:
			'Upload a file from an https URL or base64 content into the media library, optionally into a folder and with tags',
	},
	'files.list': {
		riskLevel: 'read',
		description:
			'List and search files and folders with paging (limit and skip), a folder path filter, file type and a searchQuery expression',
	},
	'files.getDetails': {
		riskLevel: 'read',
		description:
			'Read one file by ID: path, URL, tags, AI tags, size, versions and custom metadata',
	},
	'files.updateDetails': {
		riskLevel: 'write',
		description:
			'Change a file: replace tags, set custom metadata, coordinates or description, remove AI tags (names or all), or publish or unpublish it (that call alone)',
	},
	'files.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a file and all of its versions; there is no trash and no restore',
	},
	'files.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete up to 100 files by ID; a 207 answer lists per-file failures in errors',
	},
	'files.copy': {
		riskLevel: 'write',
		description:
			'Copy a file to another folder, optionally with all of its versions',
	},
	'files.move': {
		riskLevel: 'write',
		description: 'Move a file to another folder',
	},
	'files.rename': {
		riskLevel: 'write',
		description:
			'Rename a file in place; with purgeCache the old URL stops resolving from CDN cache, reported by purgeRequestId',
	},
	'files.addTags': {
		riskLevel: 'write',
		description:
			'Add tags to up to 50 files at once; the answer splits successes from per-file errors',
	},
	'files.removeTags': {
		riskLevel: 'write',
		description: 'Remove tags from up to 50 files at once',
	},
	'files.removeAITags': {
		riskLevel: 'write',
		description: 'Remove AI-generated tags from up to 50 files at once',
	},
	'fileVersions.list': {
		riskLevel: 'read',
		description: 'List every stored version of a file, newest first',
	},
	'fileVersions.getDetails': {
		riskLevel: 'read',
		description: 'Read one stored version of a file',
	},
	'fileVersions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete one non-current version of a file; the current version cannot be deleted',
	},
	'fileVersions.restore': {
		riskLevel: 'write',
		description: 'Make a stored version the current version of a file',
	},
	'metadata.getByFileId': {
		riskLevel: 'read',
		description:
			'Read image or video metadata of a stored file: dimensions, format, pHash, EXIF',
	},
	'metadata.getByUrl': {
		riskLevel: 'read',
		description:
			'Read metadata of any delivered file URL, including transformed variants',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder in a parent folder path',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a folder and everything inside it; there is no trash and no restore',
	},
	'folders.copy': {
		riskLevel: 'write',
		description:
			'Copy a folder subtree into another folder as a background job; follow with folders.getJobStatus until status is Completed',
		job: FOLDER_JOB,
	},
	'folders.move': {
		riskLevel: 'write',
		description:
			'Move a folder subtree into another folder as a background job; follow with folders.getJobStatus',
		job: FOLDER_JOB,
	},
	'folders.rename': {
		riskLevel: 'write',
		description:
			'Rename a folder as a background job; follow with folders.getJobStatus. purgeCache also purges old CDN paths',
		job: FOLDER_JOB,
	},
	'folders.getJobStatus': {
		riskLevel: 'read',
		description: 'Where a folder bulk job stands; status Pending or Completed',
	},
	'cache.purge': {
		riskLevel: 'write',
		description:
			'Purge the CDN cache of one delivered file URL; follow with cache.getPurgeStatus until status is Completed',
		job: PURGE_JOB,
	},
	'cache.getPurgeStatus': {
		riskLevel: 'read',
		description: 'Where a cache purge stands; status Pending or Completed',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof imageKitEndpointsNested>;

export type BaseImageKitPlugin<T extends ImageKitPluginOptions> = CorsairPlugin<
	'imagekit',
	typeof ImageKitSchema,
	typeof imageKitEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalImageKitPlugin = BaseImageKitPlugin<ImageKitPluginOptions>;

export type ExternalImageKitPlugin<T extends ImageKitPluginOptions> =
	BaseImageKitPlugin<T>;

export function imagekit<const T extends ImageKitPluginOptions>(
	incomingOptions: ImageKitPluginOptions & T = {} as ImageKitPluginOptions & T,
): ExternalImageKitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'imagekit',
		schema: ImageKitSchema,
		options: options,
		hooks: options.hooks,
		endpoints: imageKitEndpointsNested,
		webhooks: {},
		endpointMeta: imageKitEndpointMeta,
		endpointSchemas: imageKitEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ImageKitKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('imagekit', ctx.authType ?? 'api_key');
		},
	} satisfies InternalImageKitPlugin;
}

export { ImageKitAPIError } from './client';

export type {
	CacheGetPurgeStatusInput,
	CachePurgeInput,
	FilesAddTagsInput,
	FilesBulkDeleteInput,
	FilesCopyInput,
	FilesDeleteInput,
	FilesGetDetailsInput,
	FilesListInput,
	FilesMoveInput,
	FilesRemoveAITagsInput,
	FilesRemoveTagsInput,
	FilesRenameInput,
	FilesUpdateDetailsInput,
	FilesUploadInput,
	FileVersionsDeleteInput,
	FileVersionsGetDetailsInput,
	FileVersionsListInput,
	FileVersionsRestoreInput,
	FoldersCopyInput,
	FoldersCreateInput,
	FoldersDeleteInput,
	FoldersGetJobStatusInput,
	FoldersMoveInput,
	FoldersRenameInput,
	ImageKitBulkDelete,
	ImageKitBulkUpdate,
	ImageKitEndpointInputs,
	ImageKitEndpointOutputs,
	ImageKitFile,
	ImageKitFolder,
	ImageKitJob,
	ImageKitMetadata,
	ImageKitUpload,
	MetadataGetByFileIdInput,
	MetadataGetByUrlInput,
} from './endpoints/types';
