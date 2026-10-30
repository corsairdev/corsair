import { defineOp } from './factory';

export const queryCategories = defineOp('queryBookingsCategories');
export const deleteService = defineOp('deleteBookingsService');
export const bulkDeleteServices = defineOp('bulkDeleteBookingsServices');
export const bulkDeleteServicesByFilter = defineOp(
	'bulkDeleteBookingsServicesByFilter',
);
export const deleteAddOnGroup = defineOp('deleteBookingsAddOnGroup');
export const queryExtendedBookings = defineOp('queryExtendedBookings');
export const countExtendedBookings = defineOp('countExtendedBookings');
export const listSessions = defineOp('listBookingsSessions');
export const updateStaffMemberTagsByFilter = defineOp(
	'updateStaffMemberTagsByFilter',
);

export const BookingsEndpoints = {
	queryCategories,
	deleteService,
	bulkDeleteServices,
	bulkDeleteServicesByFilter,
	deleteAddOnGroup,
	queryExtendedBookings,
	countExtendedBookings,
	listSessions,
	updateStaffMemberTagsByFilter,
} as const;
