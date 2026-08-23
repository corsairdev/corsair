import { check as apiKeysCheck, credits as creditsGet } from './account';
import {
	remove as imageGenerationsDelete,
	list as imageGenerationsList,
} from './image-generations';
import { listDownloaded as imagesListDownloaded } from './images';
import { create as webhooksCreate, get as webhooksGet } from './webhooks';

export const ApiKeys = {
	check: apiKeysCheck,
};

export const Credits = {
	get: creditsGet,
};

export const Webhooks = {
	create: webhooksCreate,
	get: webhooksGet,
};

export const ImageGenerations = {
	list: imageGenerationsList,
	delete: imageGenerationsDelete,
};

export const Images = {
	listDownloaded: imagesListDownloaded,
};

export * from './types';
