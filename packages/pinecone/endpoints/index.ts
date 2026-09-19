import {
	chatAssistant,
	chatCompletionAssistant,
	createAssistant,
	deleteAssistant,
	deleteFile,
	describeFile,
	getAssistant,
	listAssistants,
	listFiles,
	retrieveContext,
	updateAssistant,
	uploadFile,
} from './assistant';
import {
	configureIndex,
	createBackup,
	createIndex,
	createIndexForModel,
	createIndexFromBackup,
	deleteBackup,
	deleteIndex,
	describeBackup,
	describeIndex,
	describeRestoreJob,
	listCollections,
	listIndexBackups,
	listIndexes,
	listProjectBackups,
	listRestoreJobs,
} from './control';
import {
	cancelBulkImport,
	createNamespace,
	deleteNamespace,
	deleteVectors,
	describeBulkImport,
	describeIndexStats,
	describeNamespace,
	fetchVectors,
	listBulkImports,
	listNamespaces,
	listVectors,
	queryVectors,
	searchRecords,
	startBulkImport,
	updateVector,
	upsertRecords,
	upsertVectors,
} from './data';
import { embed, getModel, listModels, rerank } from './inference';

export const Indexes = {
	create: createIndex,
	createForModel: createIndexForModel,
	list: listIndexes,
	describe: describeIndex,
	configure: configureIndex,
	delete: deleteIndex,
};

export const Backups = {
	create: createBackup,
	listForIndex: listIndexBackups,
	listForProject: listProjectBackups,
	describe: describeBackup,
	delete: deleteBackup,
	createIndex: createIndexFromBackup,
};

export const RestoreJobs = {
	list: listRestoreJobs,
	describe: describeRestoreJob,
};

export const Collections = { list: listCollections };

export const Inference = {
	embed,
	rerank,
	listModels,
	getModel,
};

export const Vectors = {
	upsert: upsertVectors,
	query: queryVectors,
	fetch: fetchVectors,
	update: updateVector,
	delete: deleteVectors,
	list: listVectors,
	describeIndexStats,
};

export const Namespaces = {
	list: listNamespaces,
	create: createNamespace,
	describe: describeNamespace,
	delete: deleteNamespace,
};

export const BulkImports = {
	list: listBulkImports,
	start: startBulkImport,
	describe: describeBulkImport,
	cancel: cancelBulkImport,
};

export const Records = {
	upsert: upsertRecords,
	search: searchRecords,
};

export const Assistants = {
	list: listAssistants,
	create: createAssistant,
	get: getAssistant,
	update: updateAssistant,
	delete: deleteAssistant,
};

export const AssistantFiles = {
	list: listFiles,
	upload: uploadFile,
	describe: describeFile,
	delete: deleteFile,
};

export const AssistantChat = {
	chat: chatAssistant,
	completion: chatCompletionAssistant,
	context: retrieveContext,
};

export * from './types';
