import { defineOp } from './factory';

export const addSpecialPermissions = defineOp('addSpecialPermissions');
export const cancelTask = defineOp('cancelBackgroundTask');
export const deleteDataCollectionField = defineOp('deleteDataCollectionField');
export const deleteUserDefinedFields = defineOp('deleteUserDefinedFields');

export const CmsEndpoints = {
	addSpecialPermissions,
	cancelTask,
	deleteDataCollectionField,
	deleteUserDefinedFields,
} as const;
