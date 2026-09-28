import { defineOp } from './factory';

export const bulkDeleteBenefitItems = defineOp('bulkDeleteBenefitItems');
export const bulkDeleteBenefitItemsByFilter = defineOp(
	'bulkDeleteBenefitItemsByFilter',
);
export const bulkDeletePoolDefinitions = defineOp('bulkDeletePoolDefinitions');
export const deleteProgramDefinition = defineOp('deleteProgramDefinition');

export const BenefitsEndpoints = {
	bulkDeleteBenefitItems,
	bulkDeleteBenefitItemsByFilter,
	bulkDeletePoolDefinitions,
	deleteProgramDefinition,
} as const;
