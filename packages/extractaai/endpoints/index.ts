import { create as classificationCreate } from './classification-create';
import { deleteClassification as classificationDelete } from './classification-delete';
import { update as classificationUpdate } from './classification-update';
import { view as classificationView } from './classification-view';
import { get as creditsGet } from './credits-get';
import { create as extractionCreate } from './extraction-create';
import { deleteExtraction as extractionDelete } from './extraction-delete';
import { getBatchResults as extractionGetBatchResults } from './extraction-results';
import { update as extractionUpdate } from './extraction-update';
import { view as extractionView } from './extraction-view';

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
