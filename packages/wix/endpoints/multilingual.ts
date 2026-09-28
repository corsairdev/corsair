import { defineOp } from './factory';

export const bulkDeleteTranslationContent = defineOp(
	'bulkDeleteTranslationContent',
);
export const bulkUpdateTranslationContentByKey = defineOp(
	'bulkUpdateTranslationContentByKey',
);

export const MultilingualEndpoints = {
	bulkDeleteTranslationContent,
	bulkUpdateTranslationContentByKey,
} as const;
