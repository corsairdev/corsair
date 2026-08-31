import {
	PineconeAssistant,
	PineconeAssistantFile,
	PineconeBackup,
	PineconeCollection,
	PineconeIndex,
	PineconeModel,
	PineconeNamespace,
	PineconeRestoreJob,
	PineconeVector,
} from './database';

export const PineconeSchema = {
	version: '1.0.0',
	entities: {
		indexes: PineconeIndex,
		backups: PineconeBackup,
		restoreJobs: PineconeRestoreJob,
		collections: PineconeCollection,
		namespaces: PineconeNamespace,
		vectors: PineconeVector,
		models: PineconeModel,
		assistants: PineconeAssistant,
		assistantFiles: PineconeAssistantFile,
	},
} as const;

export {
	PineconeAssistant,
	PineconeAssistantFile,
	PineconeBackup,
	PineconeCollection,
	PineconeIndex,
	PineconeModel,
	PineconeNamespace,
	PineconeRestoreJob,
	PineconeVector,
} from './database';
