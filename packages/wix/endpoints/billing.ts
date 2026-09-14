import { defineOp } from './factory';

export const bulkDeleteBillableItems = defineOp('bulkDeleteBillableItems');
export const bulkUpdateBillableItems = defineOp('bulkUpdateBillableItems');
export const createTaxRegion = defineOp('createTaxRegion');
export const listDefaultTaxGroups = defineOp('listDefaultTaxGroups');
export const listDefaultTaxGroupsByAppIds = defineOp(
	'listDefaultTaxGroupsByAppIds',
);
export const listManualTaxMappings = defineOp('listManualTaxMappings');
export const queryManualTaxMappings = defineOp('queryManualTaxMappings');
export const queryTaxGroups = defineOp('queryTaxGroups');
export const deleteReceiptPreset = defineOp('deleteReceiptPreset');
export const setDefaultReceiptPreset = defineOp('setDefaultReceiptPreset');
export const updateReceiptPreset = defineOp('updateReceiptPreset');

export const BillingEndpoints = {
	bulkDeleteBillableItems,
	bulkUpdateBillableItems,
	createTaxRegion,
	listDefaultTaxGroups,
	listDefaultTaxGroupsByAppIds,
	listManualTaxMappings,
	queryManualTaxMappings,
	queryTaxGroups,
	deleteReceiptPreset,
	setDefaultReceiptPreset,
	updateReceiptPreset,
} as const;
