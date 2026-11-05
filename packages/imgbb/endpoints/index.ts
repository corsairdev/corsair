import { getApiKey } from './auth';
import { upload } from './images';

export const Auth = {
	getApiKey,
};

export const Images = {
	upload,
};

export * from './types';
