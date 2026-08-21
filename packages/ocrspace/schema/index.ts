import { ConversionStats, OcrResult } from './database';

export const OcrSpaceSchema = {
	version: '1.0.0',
	entities: {
		ocrResults: OcrResult,
		conversions: ConversionStats,
	},
} as const;

export type { ConversionStats, OcrResult } from './database';
