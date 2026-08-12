import {
	HuggingFaceCollection,
	HuggingFaceDataset,
	HuggingFaceDiscussion,
	HuggingFaceModel,
	HuggingFacePaper,
	HuggingFaceSpace,
} from './database';

export const HuggingFaceSchema = {
	version: '1.0.0',
	entities: {
		models: HuggingFaceModel,
		datasets: HuggingFaceDataset,
		spaces: HuggingFaceSpace,
		collections: HuggingFaceCollection,
		discussions: HuggingFaceDiscussion,
		papers: HuggingFacePaper,
	},
} as const;

export * from './database';
