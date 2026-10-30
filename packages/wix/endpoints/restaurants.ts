import { defineOp } from './factory';

export const deleteMenu = defineOp('deleteRestaurantMenu');
export const bulkDeleteModifiers = defineOp('bulkDeleteMenuModifiers');
export const bulkDeleteVariants = defineOp('bulkDeleteMenuVariants');
export const listCatalogs = defineOp('listRestaurantCatalogs');
export const bulkDeleteNotificationRecipients = defineOp(
	'bulkDeleteNotificationRecipients',
);
export const deleteServiceFeeRule = defineOp('deleteServiceFeeRule');
export const calculateFirstAvailableSlots = defineOp(
	'calculateFirstAvailableSlots',
);

export const RestaurantsEndpoints = {
	deleteMenu,
	bulkDeleteModifiers,
	bulkDeleteVariants,
	listCatalogs,
	bulkDeleteNotificationRecipients,
	deleteServiceFeeRule,
	calculateFirstAvailableSlots,
} as const;
