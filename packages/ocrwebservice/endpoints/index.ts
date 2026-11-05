import { getCredentials, getInformation, log } from './account';
import { recognize } from './process-document';

export const Account = {
	getCredentials,
	getInformation,
	log,
};

export const Ocr = {
	recognize,
};

export * from './types';
