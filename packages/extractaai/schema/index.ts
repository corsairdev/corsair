import { ExtractaaiClassification, ExtractaaiExtraction } from './database';

export const ExtractaaiSchema = {
	version: '1.0.0',
	entities: {
		extractions: ExtractaaiExtraction,
		classifications: ExtractaaiClassification,
	},
};

export { ExtractaaiClassification, ExtractaaiExtraction } from './database';
