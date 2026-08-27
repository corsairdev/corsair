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

export * from './types';
