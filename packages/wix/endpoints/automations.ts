import { defineOp } from './factory';

export const cancelEvent = defineOp('cancelAutomationEvent');
export const bulkUpdateStorageItemTags = defineOp('bulkUpdateStorageItemTags');
export const bulkUpdateStorageItemTagsByFilter = defineOp(
	'bulkUpdateStorageItemTagsByFilter',
);

export const AutomationsEndpoints = {
	cancelEvent,
	bulkUpdateStorageItemTags,
	bulkUpdateStorageItemTagsByFilter,
} as const;
