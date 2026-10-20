import {
	DataForSeoAmazonProduct,
	DataForSeoBacklinkTarget,
	DataForSeoKeyword,
} from './database';

export const DataForSeoSchema = {
	version: '1.0.0',
	entities: {
		keywords: DataForSeoKeyword,
		backlinkTargets: DataForSeoBacklinkTarget,
		amazonProducts: DataForSeoAmazonProduct,
	},
} as const;

export type {
	DataForSeoAmazonProduct,
	DataForSeoBacklinkTarget,
	DataForSeoKeyword,
} from './database';
