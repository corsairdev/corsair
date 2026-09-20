import {
	abortUploadFromUrl,
	getUploadFromUrlStatus,
	uploadFromUrl,
} from './assets';
import { getUploadIframe, ping } from './general';

export const General = {
	ping,
	getUploadIframe,
};

export const Assets = {
	uploadFromUrl,
	getUploadFromUrlStatus,
	abortUploadFromUrl,
};

export * from './types';
