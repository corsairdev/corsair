import {
	abortUploadFromUrl,
	getUploadFromUrlStatus,
	uploadFromUrl,
} from './assets';
import { list as galleryList } from './gallery';
import { getUploadIframe, ping } from './general';

export const Gallery = {
	list: galleryList,
};

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
