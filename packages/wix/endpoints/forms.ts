import { defineOp } from './factory';

export const bulkDeleteSchemas = defineOp('bulkDeleteFormSchemas');
export const queryDeletedForms = defineOp('queryDeletedForms');
export const querySubmissionsByNamespace = defineOp(
	'queryFormSubmissionsByNamespace',
);
export const queryFormsSubmissions = defineOp('queryFormsFormSubmissions');
export const removeDeletedFields = defineOp('removeDeletedFields');

export const FormsEndpoints = {
	bulkDeleteSchemas,
	queryDeletedForms,
	querySubmissionsByNamespace,
	queryFormsSubmissions,
	removeDeletedFields,
} as const;
