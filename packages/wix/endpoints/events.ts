import { defineOp } from './factory';

export const find = defineOp('findEvent');
export const queryEventsGraphql = defineOp('queryEventsGraphql');
export const bulkDeleteRsvpsByFilter = defineOp('bulkDeleteRsvpsByFilter');
export const bulkDeleteTicketDefinitions = defineOp(
	'bulkDeleteTicketDefinitions',
);
export const deleteTicketCheckIn = defineOp('deleteTicketCheckIn');
export const deleteTicketReservation = defineOp('deleteTicketReservation');
export const deleteScheduleItem = defineOp('deleteScheduleItem');
export const deleteScheduleBookmark = defineOp('deleteScheduleBookmark');
export const discardDraft = defineOp('discardDraftSchedule');
export const publishDraft = defineOp('publishDraftSchedule');
export const rescheduleDraft = defineOp('rescheduleDraftSchedule');
export const bulkUnassignFromCategories = defineOp(
	'bulkUnassignEventsFromCategories',
);

export const EventsEndpoints = {
	find,
	queryEventsGraphql,
	bulkDeleteRsvpsByFilter,
	bulkDeleteTicketDefinitions,
	deleteTicketCheckIn,
	deleteTicketReservation,
	deleteScheduleItem,
	deleteScheduleBookmark,
	discardDraft,
	publishDraft,
	rescheduleDraft,
	bulkUnassignFromCategories,
} as const;
