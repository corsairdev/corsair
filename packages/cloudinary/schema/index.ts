import {
	CloudinaryFolder,
	CloudinaryLiveStream,
	CloudinaryMetadataField,
	CloudinaryMetadataRule,
	CloudinaryResource,
	CloudinaryTransformation,
	CloudinaryTrigger,
	CloudinaryUploadMapping,
	CloudinaryUploadPreset,
	CloudinaryUsage,
} from './database';

export const CloudinarySchema = {
	version: '1.0.0',
	entities: {
		resources: CloudinaryResource,
		folders: CloudinaryFolder,
		transformations: CloudinaryTransformation,
		uploadPresets: CloudinaryUploadPreset,
		metadataFields: CloudinaryMetadataField,
		metadataRules: CloudinaryMetadataRule,
		uploadMappings: CloudinaryUploadMapping,
		triggers: CloudinaryTrigger,
		liveStreams: CloudinaryLiveStream,
		usage: CloudinaryUsage,
	},
} as const;
