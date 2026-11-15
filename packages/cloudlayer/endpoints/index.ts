import { accountGet } from './account';
import { assetsGet, assetsList } from './assets';
import { htmlToImage, htmlToImageV1, htmlToPdf, htmlToPdfV1 } from './html';
import { jobsGet, jobsList, jobsListV2 } from './jobs';
import {
	storageCreate,
	storageGet,
	storageGetCurrent,
	storageRemove,
} from './storage';
import {
	templateToImage,
	templateToImageV1,
	templateToPdf,
	templateToPdfV1,
} from './template';
import {
	urlToImage,
	urlToImageQuick,
	urlToImageQuickV1,
	urlToImageV1,
	urlToPdf,
	urlToPdfQuick,
	urlToPdfQuickV1,
	urlToPdfV1,
} from './url';

export const Html = {
	toPdf: htmlToPdf,
	toPdfV1: htmlToPdfV1,
	toImage: htmlToImage,
	toImageV1: htmlToImageV1,
};

export const Url = {
	toPdf: urlToPdf,
	toPdfV1: urlToPdfV1,
	toPdfQuick: urlToPdfQuick,
	toPdfQuickV1: urlToPdfQuickV1,
	toImage: urlToImage,
	toImageV1: urlToImageV1,
	toImageQuick: urlToImageQuick,
	toImageQuickV1: urlToImageQuickV1,
};

export const Template = {
	toPdf: templateToPdf,
	toPdfV1: templateToPdfV1,
	toImage: templateToImage,
	toImageV1: templateToImageV1,
};

export const Account = {
	get: accountGet,
};

export const Assets = {
	list: assetsList,
	get: assetsGet,
};

export const Jobs = {
	list: jobsList,
	listV2: jobsListV2,
	get: jobsGet,
};

export const Storage = {
	create: storageCreate,
	getCurrent: storageGetCurrent,
	get: storageGet,
	remove: storageRemove,
};

export * from './types';
