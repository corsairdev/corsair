import {
	ClaidAiEditedImage,
	ClaidAiGeneratedImage,
	ClaidAiImageTask,
	ClaidAiStorage,
	ClaidAiStorageType,
} from './database';

export const ClaidAiSchema = {
	version: '1.0.0',
	entities: {
		editedImages: ClaidAiEditedImage,
		generatedImages: ClaidAiGeneratedImage,
		imageTasks: ClaidAiImageTask,
		storages: ClaidAiStorage,
		storageTypes: ClaidAiStorageType,
	},
} as const;
