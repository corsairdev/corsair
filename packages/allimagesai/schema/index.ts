import {
	AllimagesaiDownloadedImage,
	AllimagesaiImageGeneration,
	AllimagesaiWebhook,
} from './database';

export const AllimagesaiSchema = {
	version: '1.0.0',
	entities: {
		imageGenerations: AllimagesaiImageGeneration,
		downloadedImages: AllimagesaiDownloadedImage,
		webhooks: AllimagesaiWebhook,
	},
} as const;

export {
	AllimagesaiDownloadedImage,
	AllimagesaiImageGeneration,
	AllimagesaiWebhook,
};
