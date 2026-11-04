import { getCompressionCount } from './account';
import { compressAndStoreInAzure, output, shrink, transform } from './images';

export const Images = {
	shrink,
	output,
	transform,
	compressAndStoreInAzure,
};

export const Account = {
	getCompressionCount,
};

export * from './types';
