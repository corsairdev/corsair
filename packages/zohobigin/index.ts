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
	attachments,
	bulk,
	metadata,
	notes,
	notifications,
	records,
	tags,
	users,
} from './endpoints';
import type {
	ZohoBiginEndpointInputs,
	ZohoBiginEndpointOutputs,
} from './endpoints/types';
import {
	ZohoBiginEndpointInputSchemas,
	ZohoBiginEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZohoBiginSchema } from './schema';

export const zohoBiginAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const zohoBiginEndpointsNested = {
	records: {
		add: records.addRecords,
		get: records.getRecords,
		getRecord: records.getRecord,
		update: records.updateRecords,
		updateRecord: records.updateRecord,
		delete: records.deleteRecords,
		deleteRecord: records.deleteRecord,
		deletePhoto: records.deleteRecordPhoto,
		downloadPhoto: records.downloadRecordPhoto,
		uploadPhoto: records.uploadRecordPhoto,
		getDeleted: records.getDeletedRecords,
		count: records.getRecordsCount,
		search: records.searchRecords,
		upsert: records.upsertRecords,
		getRelated: records.getRelatedRecords,
		updateRelated: records.updateRelatedRecords,
		getPipelines: records.getTeamPipelineRecords,
	},
	notes: {
		create: notes.createNotes,
		createRecordNotes: notes.createRecordNotes,
		delete: notes.deleteNotes,
		deleteRecordNote: notes.deleteNote,
		getAll: notes.getAllNotes,
		getRecordNotes: notes.getRecordNotes,
		update: notes.updateNote,
	},
	tags: {
		create: tags.createTags,
		addToRecords: tags.addTagsToRecords,
		delinkRelated: tags.delinkRelatedRecords,
	},
	attachments: {
		get: attachments.getAttachments,
		delete: attachments.deleteAttachment,
		download: attachments.downloadAttachment,
		upload: attachments.uploadAttachment,
	},
	bulk: {
		createReadJob: bulk.createBulkReadJob,
		downloadReadResult: bulk.downloadBulkReadResult,
		getReadJobStatus: bulk.getBulkReadJobStatus,
	},
	notifications: {
		enable: notifications.enableNotifications,
		disable: notifications.disableNotifications,
		getDetails: notifications.getNotificationDetails,
		updateDetails: notifications.updateNotificationDetails,
		updateInfo: notifications.updateNotificationInfo,
	},
	metadata: {
		getModules: metadata.getModules,
		getModule: metadata.getModuleMetadata,
		getFields: metadata.getFields,
		getLayouts: metadata.getLayouts,
		getLayout: metadata.getLayout,
		getCustomViews: metadata.getCustomViews,
		getCustomView: metadata.getCustomView,
		getRelatedLists: metadata.getRelatedListsMetadata,
	},
	users: {
		getUsers: users.getUsers,
		getUser: users.getUser,
		updateUser: users.updateUser,
		updateUsers: users.updateUsers,
		getRoles: users.getRoles,
		getProfiles: users.getProfiles,
		getOrganization: users.getOrganization,
		uploadOrgPhoto: users.uploadOrganizationPhoto,
	},
} as const;

export type ZohoBiginPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZohoBiginPlugin['hooks'];
	webhookHooks?: InternalZohoBiginPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoBiginEndpointsNested>;
};

export type ZohoBiginContext = CorsairPluginContext<
	typeof ZohoBiginSchema,
	ZohoBiginPluginOptions
>;

export type ZohoBiginKeyBuilderContext =
	KeyBuilderContext<ZohoBiginPluginOptions>;

export type ZohoBiginBoundEndpoints = BindEndpoints<
	typeof zohoBiginEndpointsNested
>;

type ZohoBiginEndpoint<K extends keyof ZohoBiginEndpointOutputs> =
	CorsairEndpoint<
		ZohoBiginContext,
		ZohoBiginEndpointInputs[K],
		ZohoBiginEndpointOutputs[K]
	>;

export type ZohoBiginEndpoints = {
	addRecords: ZohoBiginEndpoint<'addRecords'>;
	getRecords: ZohoBiginEndpoint<'getRecords'>;
	getRecord: ZohoBiginEndpoint<'getRecord'>;
	updateRecord: ZohoBiginEndpoint<'updateRecord'>;
	updateRecords: ZohoBiginEndpoint<'updateRecords'>;
	deleteRecord: ZohoBiginEndpoint<'deleteRecord'>;
	deleteRecords: ZohoBiginEndpoint<'deleteRecords'>;
	deleteRecordPhoto: ZohoBiginEndpoint<'deleteRecordPhoto'>;
	downloadRecordPhoto: ZohoBiginEndpoint<'downloadRecordPhoto'>;
	uploadRecordPhoto: ZohoBiginEndpoint<'uploadRecordPhoto'>;
	getDeletedRecords: ZohoBiginEndpoint<'getDeletedRecords'>;
	getRecordsCount: ZohoBiginEndpoint<'getRecordsCount'>;
	searchRecords: ZohoBiginEndpoint<'searchRecords'>;
	upsertRecords: ZohoBiginEndpoint<'upsertRecords'>;
	getRelatedRecords: ZohoBiginEndpoint<'getRelatedRecords'>;
	updateRelatedRecords: ZohoBiginEndpoint<'updateRelatedRecords'>;
	getTeamPipelineRecords: ZohoBiginEndpoint<'getTeamPipelineRecords'>;
	createNotes: ZohoBiginEndpoint<'createNotes'>;
	createRecordNotes: ZohoBiginEndpoint<'createRecordNotes'>;
	deleteNote: ZohoBiginEndpoint<'deleteNote'>;
	deleteNotes: ZohoBiginEndpoint<'deleteNotes'>;
	getAllNotes: ZohoBiginEndpoint<'getAllNotes'>;
	getRecordNotes: ZohoBiginEndpoint<'getRecordNotes'>;
	updateNote: ZohoBiginEndpoint<'updateNote'>;
	createTags: ZohoBiginEndpoint<'createTags'>;
	addTagsToRecords: ZohoBiginEndpoint<'addTagsToRecords'>;
	delinkRelatedRecords: ZohoBiginEndpoint<'delinkRelatedRecords'>;
	deleteAttachment: ZohoBiginEndpoint<'deleteAttachment'>;
	downloadAttachment: ZohoBiginEndpoint<'downloadAttachment'>;
	getAttachments: ZohoBiginEndpoint<'getAttachments'>;
	uploadAttachment: ZohoBiginEndpoint<'uploadAttachment'>;
	createBulkReadJob: ZohoBiginEndpoint<'createBulkReadJob'>;
	downloadBulkReadResult: ZohoBiginEndpoint<'downloadBulkReadResult'>;
	getBulkReadJobStatus: ZohoBiginEndpoint<'getBulkReadJobStatus'>;
	disableNotifications: ZohoBiginEndpoint<'disableNotifications'>;
	enableNotifications: ZohoBiginEndpoint<'enableNotifications'>;
	getNotificationDetails: ZohoBiginEndpoint<'getNotificationDetails'>;
	updateNotificationDetails: ZohoBiginEndpoint<'updateNotificationDetails'>;
	updateNotificationInfo: ZohoBiginEndpoint<'updateNotificationInfo'>;
	getModules: ZohoBiginEndpoint<'getModules'>;
	getModuleMetadata: ZohoBiginEndpoint<'getModuleMetadata'>;
	getFields: ZohoBiginEndpoint<'getFields'>;
	getLayouts: ZohoBiginEndpoint<'getLayouts'>;
	getLayout: ZohoBiginEndpoint<'getLayout'>;
	getCustomViews: ZohoBiginEndpoint<'getCustomViews'>;
	getCustomView: ZohoBiginEndpoint<'getCustomView'>;
	getRelatedListsMetadata: ZohoBiginEndpoint<'getRelatedListsMetadata'>;
	getUsers: ZohoBiginEndpoint<'getUsers'>;
	getUser: ZohoBiginEndpoint<'getUser'>;
	updateUser: ZohoBiginEndpoint<'updateUser'>;
	updateUsers: ZohoBiginEndpoint<'updateUsers'>;
	getRoles: ZohoBiginEndpoint<'getRoles'>;
	getProfiles: ZohoBiginEndpoint<'getProfiles'>;
	getOrganization: ZohoBiginEndpoint<'getOrganization'>;
	uploadOrganizationPhoto: ZohoBiginEndpoint<'uploadOrganizationPhoto'>;
};

const zohoBiginWebhooksNested = {} as const;

export const zohoBiginEndpointSchemas = {
	'records.add': {
		input: ZohoBiginEndpointInputSchemas.addRecords,
		output: ZohoBiginEndpointOutputSchemas.addRecords,
	},
	'records.get': {
		input: ZohoBiginEndpointInputSchemas.getRecords,
		output: ZohoBiginEndpointOutputSchemas.getRecords,
	},
	'records.getRecord': {
		input: ZohoBiginEndpointInputSchemas.getRecord,
		output: ZohoBiginEndpointOutputSchemas.getRecord,
	},
	'records.update': {
		input: ZohoBiginEndpointInputSchemas.updateRecords,
		output: ZohoBiginEndpointOutputSchemas.updateRecords,
	},
	'records.updateRecord': {
		input: ZohoBiginEndpointInputSchemas.updateRecord,
		output: ZohoBiginEndpointOutputSchemas.updateRecord,
	},
	'records.delete': {
		input: ZohoBiginEndpointInputSchemas.deleteRecords,
		output: ZohoBiginEndpointOutputSchemas.deleteRecords,
	},
	'records.deleteRecord': {
		input: ZohoBiginEndpointInputSchemas.deleteRecord,
		output: ZohoBiginEndpointOutputSchemas.deleteRecord,
	},
	'records.deletePhoto': {
		input: ZohoBiginEndpointInputSchemas.deleteRecordPhoto,
		output: ZohoBiginEndpointOutputSchemas.deleteRecordPhoto,
	},
	'records.downloadPhoto': {
		input: ZohoBiginEndpointInputSchemas.downloadRecordPhoto,
		output: ZohoBiginEndpointOutputSchemas.downloadRecordPhoto,
	},
	'records.uploadPhoto': {
		input: ZohoBiginEndpointInputSchemas.uploadRecordPhoto,
		output: ZohoBiginEndpointOutputSchemas.uploadRecordPhoto,
	},
	'records.getDeleted': {
		input: ZohoBiginEndpointInputSchemas.getDeletedRecords,
		output: ZohoBiginEndpointOutputSchemas.getDeletedRecords,
	},
	'records.count': {
		input: ZohoBiginEndpointInputSchemas.getRecordsCount,
		output: ZohoBiginEndpointOutputSchemas.getRecordsCount,
	},
	'records.search': {
		input: ZohoBiginEndpointInputSchemas.searchRecords,
		output: ZohoBiginEndpointOutputSchemas.searchRecords,
	},
	'records.upsert': {
		input: ZohoBiginEndpointInputSchemas.upsertRecords,
		output: ZohoBiginEndpointOutputSchemas.upsertRecords,
	},
	'records.getRelated': {
		input: ZohoBiginEndpointInputSchemas.getRelatedRecords,
		output: ZohoBiginEndpointOutputSchemas.getRelatedRecords,
	},
	'records.updateRelated': {
		input: ZohoBiginEndpointInputSchemas.updateRelatedRecords,
		output: ZohoBiginEndpointOutputSchemas.updateRelatedRecords,
	},
	'records.getPipelines': {
		input: ZohoBiginEndpointInputSchemas.getTeamPipelineRecords,
		output: ZohoBiginEndpointOutputSchemas.getTeamPipelineRecords,
	},
	'notes.create': {
		input: ZohoBiginEndpointInputSchemas.createNotes,
		output: ZohoBiginEndpointOutputSchemas.createNotes,
	},
	'notes.createRecordNotes': {
		input: ZohoBiginEndpointInputSchemas.createRecordNotes,
		output: ZohoBiginEndpointOutputSchemas.createRecordNotes,
	},
	'notes.delete': {
		input: ZohoBiginEndpointInputSchemas.deleteNotes,
		output: ZohoBiginEndpointOutputSchemas.deleteNotes,
	},
	'notes.deleteRecordNote': {
		input: ZohoBiginEndpointInputSchemas.deleteNote,
		output: ZohoBiginEndpointOutputSchemas.deleteNote,
	},
	'notes.getAll': {
		input: ZohoBiginEndpointInputSchemas.getAllNotes,
		output: ZohoBiginEndpointOutputSchemas.getAllNotes,
	},
	'notes.getRecordNotes': {
		input: ZohoBiginEndpointInputSchemas.getRecordNotes,
		output: ZohoBiginEndpointOutputSchemas.getRecordNotes,
	},
	'notes.update': {
		input: ZohoBiginEndpointInputSchemas.updateNote,
		output: ZohoBiginEndpointOutputSchemas.updateNote,
	},
	'tags.create': {
		input: ZohoBiginEndpointInputSchemas.createTags,
		output: ZohoBiginEndpointOutputSchemas.createTags,
	},
	'tags.addToRecords': {
		input: ZohoBiginEndpointInputSchemas.addTagsToRecords,
		output: ZohoBiginEndpointOutputSchemas.addTagsToRecords,
	},
	'tags.delinkRelated': {
		input: ZohoBiginEndpointInputSchemas.delinkRelatedRecords,
		output: ZohoBiginEndpointOutputSchemas.delinkRelatedRecords,
	},
	'attachments.get': {
		input: ZohoBiginEndpointInputSchemas.getAttachments,
		output: ZohoBiginEndpointOutputSchemas.getAttachments,
	},
	'attachments.delete': {
		input: ZohoBiginEndpointInputSchemas.deleteAttachment,
		output: ZohoBiginEndpointOutputSchemas.deleteAttachment,
	},
	'attachments.download': {
		input: ZohoBiginEndpointInputSchemas.downloadAttachment,
		output: ZohoBiginEndpointOutputSchemas.downloadAttachment,
	},
	'attachments.upload': {
		input: ZohoBiginEndpointInputSchemas.uploadAttachment,
		output: ZohoBiginEndpointOutputSchemas.uploadAttachment,
	},
	'bulk.createReadJob': {
		input: ZohoBiginEndpointInputSchemas.createBulkReadJob,
		output: ZohoBiginEndpointOutputSchemas.createBulkReadJob,
	},
	'bulk.downloadReadResult': {
		input: ZohoBiginEndpointInputSchemas.downloadBulkReadResult,
		output: ZohoBiginEndpointOutputSchemas.downloadBulkReadResult,
	},
	'bulk.getReadJobStatus': {
		input: ZohoBiginEndpointInputSchemas.getBulkReadJobStatus,
		output: ZohoBiginEndpointOutputSchemas.getBulkReadJobStatus,
	},
	'notifications.enable': {
		input: ZohoBiginEndpointInputSchemas.enableNotifications,
		output: ZohoBiginEndpointOutputSchemas.enableNotifications,
	},
	'notifications.disable': {
		input: ZohoBiginEndpointInputSchemas.disableNotifications,
		output: ZohoBiginEndpointOutputSchemas.disableNotifications,
	},
	'notifications.getDetails': {
		input: ZohoBiginEndpointInputSchemas.getNotificationDetails,
		output: ZohoBiginEndpointOutputSchemas.getNotificationDetails,
	},
	'notifications.updateDetails': {
		input: ZohoBiginEndpointInputSchemas.updateNotificationDetails,
		output: ZohoBiginEndpointOutputSchemas.updateNotificationDetails,
	},
	'notifications.updateInfo': {
		input: ZohoBiginEndpointInputSchemas.updateNotificationInfo,
		output: ZohoBiginEndpointOutputSchemas.updateNotificationInfo,
	},
	'metadata.getModules': {
		input: ZohoBiginEndpointInputSchemas.getModules,
		output: ZohoBiginEndpointOutputSchemas.getModules,
	},
	'metadata.getModule': {
		input: ZohoBiginEndpointInputSchemas.getModuleMetadata,
		output: ZohoBiginEndpointOutputSchemas.getModuleMetadata,
	},
	'metadata.getFields': {
		input: ZohoBiginEndpointInputSchemas.getFields,
		output: ZohoBiginEndpointOutputSchemas.getFields,
	},
	'metadata.getLayouts': {
		input: ZohoBiginEndpointInputSchemas.getLayouts,
		output: ZohoBiginEndpointOutputSchemas.getLayouts,
	},
	'metadata.getLayout': {
		input: ZohoBiginEndpointInputSchemas.getLayout,
		output: ZohoBiginEndpointOutputSchemas.getLayout,
	},
	'metadata.getCustomViews': {
		input: ZohoBiginEndpointInputSchemas.getCustomViews,
		output: ZohoBiginEndpointOutputSchemas.getCustomViews,
	},
	'metadata.getCustomView': {
		input: ZohoBiginEndpointInputSchemas.getCustomView,
		output: ZohoBiginEndpointOutputSchemas.getCustomView,
	},
	'metadata.getRelatedLists': {
		input: ZohoBiginEndpointInputSchemas.getRelatedListsMetadata,
		output: ZohoBiginEndpointOutputSchemas.getRelatedListsMetadata,
	},
	'users.getUsers': {
		input: ZohoBiginEndpointInputSchemas.getUsers,
		output: ZohoBiginEndpointOutputSchemas.getUsers,
	},
	'users.getUser': {
		input: ZohoBiginEndpointInputSchemas.getUser,
		output: ZohoBiginEndpointOutputSchemas.getUser,
	},
	'users.updateUser': {
		input: ZohoBiginEndpointInputSchemas.updateUser,
		output: ZohoBiginEndpointOutputSchemas.updateUser,
	},
	'users.updateUsers': {
		input: ZohoBiginEndpointInputSchemas.updateUsers,
		output: ZohoBiginEndpointOutputSchemas.updateUsers,
	},
	'users.getRoles': {
		input: ZohoBiginEndpointInputSchemas.getRoles,
		output: ZohoBiginEndpointOutputSchemas.getRoles,
	},
	'users.getProfiles': {
		input: ZohoBiginEndpointInputSchemas.getProfiles,
		output: ZohoBiginEndpointOutputSchemas.getProfiles,
	},
	'users.getOrganization': {
		input: ZohoBiginEndpointInputSchemas.getOrganization,
		output: ZohoBiginEndpointOutputSchemas.getOrganization,
	},
	'users.uploadOrgPhoto': {
		input: ZohoBiginEndpointInputSchemas.uploadOrganizationPhoto,
		output: ZohoBiginEndpointOutputSchemas.uploadOrganizationPhoto,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoBiginEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export const zohoBiginEndpointMeta = {
	'records.add': { riskLevel: 'write', description: 'Add records to module' },
	'records.get': { riskLevel: 'read', description: 'Get records from module' },
	'records.getRecord': { riskLevel: 'read', description: 'Get single record' },
	'records.update': {
		riskLevel: 'write',
		description: 'Update multiple records',
	},
	'records.updateRecord': {
		riskLevel: 'write',
		description: 'Update single record',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Delete multiple records',
	},
	'records.deleteRecord': {
		riskLevel: 'destructive',
		description: 'Delete single record',
	},
	'records.deletePhoto': {
		riskLevel: 'destructive',
		description: 'Delete record photo',
	},
	'records.downloadPhoto': {
		riskLevel: 'read',
		description: 'Download record photo',
	},
	'records.uploadPhoto': {
		riskLevel: 'write',
		description: 'Upload record photo',
	},
	'records.getDeleted': {
		riskLevel: 'read',
		description: 'Get deleted records',
	},
	'records.count': { riskLevel: 'read', description: 'Count records' },
	'records.search': { riskLevel: 'read', description: 'Search records' },
	'records.upsert': { riskLevel: 'write', description: 'Upsert records' },
	'records.getRelated': {
		riskLevel: 'read',
		description: 'Get related records',
	},
	'records.updateRelated': {
		riskLevel: 'write',
		description: 'Update related records',
	},
	'records.getPipelines': {
		riskLevel: 'read',
		description: 'Get team pipelines',
	},
	'notes.create': { riskLevel: 'write', description: 'Create notes' },
	'notes.createRecordNotes': {
		riskLevel: 'write',
		description: 'Create record notes',
	},
	'notes.delete': { riskLevel: 'destructive', description: 'Delete notes' },
	'notes.deleteRecordNote': {
		riskLevel: 'destructive',
		description: 'Delete record note',
	},
	'notes.getAll': { riskLevel: 'read', description: 'Get all notes' },
	'notes.getRecordNotes': {
		riskLevel: 'read',
		description: 'Get record notes',
	},
	'notes.update': { riskLevel: 'write', description: 'Update note' },
	'tags.create': { riskLevel: 'write', description: 'Create tags' },
	'tags.addToRecords': {
		riskLevel: 'write',
		description: 'Add tags to records',
	},
	'tags.delinkRelated': {
		riskLevel: 'destructive',
		description: 'Delink related records',
	},
	'attachments.get': { riskLevel: 'read', description: 'Get attachments' },
	'attachments.delete': {
		riskLevel: 'destructive',
		description: 'Delete attachment',
	},
	'attachments.download': {
		riskLevel: 'read',
		description: 'Download attachment',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description: 'Upload attachment',
	},
	'bulk.createReadJob': {
		riskLevel: 'write',
		description: 'Create bulk read job',
	},
	'bulk.downloadReadResult': {
		riskLevel: 'read',
		description: 'Download bulk read result',
	},
	'bulk.getReadJobStatus': {
		riskLevel: 'read',
		description: 'Get bulk read job status',
	},
	'notifications.enable': {
		riskLevel: 'write',
		description: 'Enable notifications',
	},
	'notifications.disable': {
		riskLevel: 'write',
		description: 'Disable notifications',
	},
	'notifications.getDetails': {
		riskLevel: 'read',
		description: 'Get notification details',
	},
	'notifications.updateDetails': {
		riskLevel: 'write',
		description: 'Update notification details',
	},
	'notifications.updateInfo': {
		riskLevel: 'write',
		description: 'Update notification info',
	},
	'metadata.getModules': { riskLevel: 'read', description: 'Get modules' },
	'metadata.getModule': {
		riskLevel: 'read',
		description: 'Get module metadata',
	},
	'metadata.getFields': { riskLevel: 'read', description: 'Get fields' },
	'metadata.getLayouts': { riskLevel: 'read', description: 'Get layouts' },
	'metadata.getLayout': { riskLevel: 'read', description: 'Get layout' },
	'metadata.getCustomViews': {
		riskLevel: 'read',
		description: 'Get custom views',
	},
	'metadata.getCustomView': {
		riskLevel: 'read',
		description: 'Get custom view',
	},
	'metadata.getRelatedLists': {
		riskLevel: 'read',
		description: 'Get related lists',
	},
	'users.getUsers': { riskLevel: 'read', description: 'Get users' },
	'users.getUser': { riskLevel: 'read', description: 'Get user' },
	'users.updateUser': { riskLevel: 'write', description: 'Update user' },
	'users.updateUsers': { riskLevel: 'write', description: 'Update users' },
	'users.getRoles': { riskLevel: 'read', description: 'Get roles' },
	'users.getProfiles': { riskLevel: 'read', description: 'Get profiles' },
	'users.getOrganization': {
		riskLevel: 'read',
		description: 'Get organization details',
	},
	'users.uploadOrgPhoto': {
		riskLevel: 'write',
		description: 'Upload organization photo',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof zohoBiginEndpointsNested
>;

export type BaseZohoBiginPlugin<T extends ZohoBiginPluginOptions> =
	CorsairPlugin<
		'zohobigin',
		typeof ZohoBiginSchema,
		typeof zohoBiginEndpointsNested,
		typeof zohoBiginWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalZohoBiginPlugin =
	BaseZohoBiginPlugin<ZohoBiginPluginOptions>;
export type ExternalZohoBiginPlugin<T extends ZohoBiginPluginOptions> =
	BaseZohoBiginPlugin<T>;

export function zohobigin<const T extends ZohoBiginPluginOptions>(
	incomingOptions: ZohoBiginPluginOptions & T = {} as ZohoBiginPluginOptions &
		T,
): ExternalZohoBiginPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohobigin',
		authConfig: zohoBiginAuthConfig,
		schema: ZohoBiginSchema,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		options,
		endpoints: zohoBiginEndpointsNested,
		webhooks: zohoBiginWebhooksNested,
		endpointMeta: zohoBiginEndpointMeta,
		endpointSchemas: zohoBiginEndpointSchemas,
	};
}

export * from './endpoints';
export type { ZohoBiginWebhooks } from './webhooks';
