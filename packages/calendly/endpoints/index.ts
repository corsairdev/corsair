import {
	listEntries as activityLogList,
	listOutgoingCommunications as activityLogListOutgoingCommunications,
} from './activity-log';
import {
	create as eventTypesCreate,
	createOneOff as eventTypesCreateOneOff,
	get as eventTypesGet,
	list as eventTypesList,
	listAvailableTimes as eventTypesListAvailableTimes,
	listHosts as eventTypesListHosts,
	update as eventTypesUpdate,
	updateAvailability as eventTypesUpdateAvailability,
} from './event-types';
import {
	get as groupsGet,
	getRelationship as groupsGetRelationship,
	list as groupsList,
	listRelationships as groupsListRelationships,
} from './groups';
import {
	create as inviteesCreate,
	deleteData as inviteesDeleteData,
	deleteNoShow as inviteesDeleteNoShow,
	get as inviteesGet,
	getNoShow as inviteesGetNoShow,
	list as inviteesList,
	markNoShow as inviteesMarkNoShow,
} from './invitees';
import {
	deleteMembership as organizationsDeleteMembership,
	get as organizationsGet,
	getInvitation as organizationsGetInvitation,
	getMembership as organizationsGetMembership,
	invite as organizationsInvite,
	listInvitations as organizationsListInvitations,
	listMemberships as organizationsListMemberships,
	removeMember as organizationsRemoveMember,
	revokeInvitation as organizationsRevokeInvitation,
} from './organizations';
import {
	get as routingFormsGet,
	getSampleWebhookData as routingFormsGetSampleWebhookData,
	getSubmission as routingFormsGetSubmission,
	list as routingFormsList,
} from './routing-forms';
import {
	cancel as scheduledEventsCancel,
	deleteData as scheduledEventsDeleteData,
	get as scheduledEventsGet,
	list as scheduledEventsList,
} from './scheduled-events';
import {
	create as schedulingLinksCreate,
	createShare as schedulingLinksCreateShare,
	createSingleUse as schedulingLinksCreateSingleUse,
} from './scheduling-links';
import {
	get as usersGet,
	getAvailabilitySchedule as usersGetAvailabilitySchedule,
	getCurrent as usersGetCurrent,
	listAvailabilitySchedules as usersListAvailabilitySchedules,
	listBusyTimes as usersListBusyTimes,
	listEventTypes as usersListEventTypes,
	listMeetingLocations as usersListMeetingLocations,
} from './users';
import {
	create as webhookSubscriptionsCreate,
	deleteSubscription as webhookSubscriptionsDelete,
	get as webhookSubscriptionsGet,
	list as webhookSubscriptionsList,
} from './webhook-subscriptions';

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
