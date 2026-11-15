import {
	DocmosisBatchUploadJob,
	DocmosisEnvironment,
	DocmosisImage,
	DocmosisRender,
	DocmosisTemplate,
} from './database';

export const DocmosisSchema = {
	version: '1.0.0',
	entities: {
		templates: DocmosisTemplate,
		images: DocmosisImage,
		batchUploadJobs: DocmosisBatchUploadJob,
		environments: DocmosisEnvironment,
		renders: DocmosisRender,
	},
} as const;
