import {
	create as classificationCreate,
	deleteClassification as classificationDelete,
	update as classificationUpdate,
	view as classificationView,
} from './classification';
import { get as creditsGet } from './credits-get';
import {
	create as extractionCreate,
	deleteExtraction as extractionDelete,
	getBatchResults as extractionGetBatchResults,
	update as extractionUpdate,
	view as extractionView,
} from './extraction';

export const Extraction = {
	create: extractionCreate,
	view: extractionView,
	update: extractionUpdate,
	delete: extractionDelete,
	getBatchResults: extractionGetBatchResults,
};

export const Classification = {
	create: classificationCreate,
	view: classificationView,
	update: classificationUpdate,
	delete: classificationDelete,
};

export const Credits = {
	get: creditsGet,
};

export * from './types';
