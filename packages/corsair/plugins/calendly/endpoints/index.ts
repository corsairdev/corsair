import {
	get as scheduledEventsGet,
	list as scheduledEventsList,
	cancel as scheduledEventsCancel,
	deleteData as scheduledEventsDeleteData,
} from './scheduled-events';
import {
	get as eventTypesGet,
	list as eventTypesList,
	create as eventTypesCreate,
	createOneOff as eventTypesCreateOneOff,
	update as eventTypesUpdate,
	updateAvailability as eventTypesUpdateAvailability,
	listAvailableTimes as eventTypesListAvailableTimes,
	listHosts as eventTypesListHosts,
} from './event-types';
import {
	get as inviteesGet,
	list as inviteesList,
	create as inviteesCreate,
	deleteData as inviteesDeleteData,
	getNoShow as inviteesGetNoShow,
	markNoShow as inviteesMarkNoShow,
	deleteNoShow as inviteesDeleteNoShow,
} from './invitees';
import {
	get as usersGet,
	getCurrent as usersGetCurrent,
	getAvailabilitySchedule as usersGetAvailabilitySchedule,
	listAvailabilitySchedules as usersListAvailabilitySchedules,
	listBusyTimes as usersListBusyTimes,
	listMeetingLocations as usersListMeetingLocations,
	listEventTypes as usersListEventTypes,
} from './users';
import {
	get as organizationsGet,
	getInvitation as organizationsGetInvitation,
	getMembership as organizationsGetMembership,
	listInvitations as organizationsListInvitations,
	listMemberships as organizationsListMemberships,
	deleteMembership as organizationsDeleteMembership,
	invite as organizationsInvite,
	removeMember as organizationsRemoveMember,
	revokeInvitation as organizationsRevokeInvitation,
} from './organizations';
import {
	get as groupsGet,
	getRelationship as groupsGetRelationship,
	list as groupsList,
	listRelationships as groupsListRelationships,
} from './groups';
import {
	get as routingFormsGet,
	getSubmission as routingFormsGetSubmission,
	list as routingFormsList,
	getSampleWebhookData as routingFormsGetSampleWebhookData,
} from './routing-forms';
import {
	create as schedulingLinksCreate,
	createSingleUse as schedulingLinksCreateSingleUse,
	createShare as schedulingLinksCreateShare,
} from './scheduling-links';
import {
	create as webhookSubscriptionsCreate,
	get as webhookSubscriptionsGet,
	list as webhookSubscriptionsList,
	deleteSubscription as webhookSubscriptionsDelete,
} from './webhook-subscriptions';
import {
	listEntries as activityLogList,
	listOutgoingCommunications as activityLogListOutgoingCommunications,
} from './activity-log';

export const ScheduledEvents = {
	get: scheduledEventsGet,
	list: scheduledEventsList,
	cancel: scheduledEventsCancel,
	deleteData: scheduledEventsDeleteData,
};

export const EventTypes = {
	get: eventTypesGet,
	list: eventTypesList,
	create: eventTypesCreate,
	createOneOff: eventTypesCreateOneOff,
	update: eventTypesUpdate,
	updateAvailability: eventTypesUpdateAvailability,
	listAvailableTimes: eventTypesListAvailableTimes,
	listHosts: eventTypesListHosts,
};

export const Invitees = {
	get: inviteesGet,
	list: inviteesList,
	create: inviteesCreate,
	deleteData: inviteesDeleteData,
	getNoShow: inviteesGetNoShow,
	markNoShow: inviteesMarkNoShow,
	deleteNoShow: inviteesDeleteNoShow,
};

export const Users = {
	get: usersGet,
	getCurrent: usersGetCurrent,
	getAvailabilitySchedule: usersGetAvailabilitySchedule,
	listAvailabilitySchedules: usersListAvailabilitySchedules,
	listBusyTimes: usersListBusyTimes,
	listMeetingLocations: usersListMeetingLocations,
	listEventTypes: usersListEventTypes,
};

export const Organizations = {
	get: organizationsGet,
	getInvitation: organizationsGetInvitation,
	getMembership: organizationsGetMembership,
	listInvitations: organizationsListInvitations,
	listMemberships: organizationsListMemberships,
	deleteMembership: organizationsDeleteMembership,
	invite: organizationsInvite,
	removeMember: organizationsRemoveMember,
	revokeInvitation: organizationsRevokeInvitation,
};

export const Groups = {
	get: groupsGet,
	getRelationship: groupsGetRelationship,
	list: groupsList,
	listRelationships: groupsListRelationships,
};

export const RoutingForms = {
	get: routingFormsGet,
	getSubmission: routingFormsGetSubmission,
	list: routingFormsList,
	getSampleWebhookData: routingFormsGetSampleWebhookData,
};

export const SchedulingLinks = {
	create: schedulingLinksCreate,
	createSingleUse: schedulingLinksCreateSingleUse,
	createShare: schedulingLinksCreateShare,
};

export const WebhookSubscriptions = {
	create: webhookSubscriptionsCreate,
	get: webhookSubscriptionsGet,
	list: webhookSubscriptionsList,
	delete: webhookSubscriptionsDelete,
};

export const ActivityLog = {
	list: activityLogList,
	listOutgoingCommunications: activityLogListOutgoingCommunications,
};

export * from './types';
