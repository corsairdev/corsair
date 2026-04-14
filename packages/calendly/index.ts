import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	ActivityLog,
	EventTypes,
	Groups,
	Invitees,
	Organizations,
	RoutingForms,
	ScheduledEvents,
	SchedulingLinks,
	Users,
	WebhookSubscriptions,
} from './endpoints';
import type {
	CalendlyEndpointInputs,
	CalendlyEndpointOutputs,
} from './endpoints/types';
import {
	CalendlyEndpointInputSchemas,
	CalendlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CalendlySchema } from './schema';
import {
	EventTypeWebhooks,
	InviteeWebhooks,
	RoutingFormWebhooks,
	UserWebhooks,
} from './webhooks';
import type {
	CalendlyWebhookOutputs,
	EventTypeUpdatedPayload,
	InviteeCanceledPayload,
	InviteeCreatedPayload,
	InviteeNoShowCreatedPayload,
	RoutingFormSubmissionCreatedPayload,
	UserUpdatedPayload,
} from './webhooks/types';
import {
	EventTypeUpdatedPayloadSchema,
	InviteeCanceledPayloadSchema,
	InviteeCreatedPayloadSchema,
	InviteeNoShowCreatedPayloadSchema,
	RoutingFormSubmissionCreatedPayloadSchema,
	UserUpdatedPayloadSchema,
} from './webhooks/types';

export type CalendlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCalendlyPlugin['hooks'];
	webhookHooks?: InternalCalendlyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Calendly plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Calendly endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof calendlyEndpointsNested>;
};

export type CalendlyContext = CorsairPluginContext<
	typeof CalendlySchema,
	CalendlyPluginOptions
>;

export type CalendlyKeyBuilderContext =
	KeyBuilderContext<CalendlyPluginOptions>;

export type CalendlyBoundEndpoints = BindEndpoints<
	typeof calendlyEndpointsNested
>;

type CalendlyEndpoint<
	K extends keyof CalendlyEndpointOutputs,
	Input = CalendlyEndpointInputs[K],
> = CorsairEndpoint<CalendlyContext, Input, CalendlyEndpointOutputs[K]>;

export type CalendlyEndpoints = {
	scheduledEventsGet: CalendlyEndpoint<'scheduledEventsGet'>;
	scheduledEventsList: CalendlyEndpoint<'scheduledEventsList'>;
	scheduledEventsCancel: CalendlyEndpoint<'scheduledEventsCancel'>;
	scheduledEventsDeleteData: CalendlyEndpoint<'scheduledEventsDeleteData'>;
	eventTypesGet: CalendlyEndpoint<'eventTypesGet'>;
	eventTypesList: CalendlyEndpoint<'eventTypesList'>;
	eventTypesCreate: CalendlyEndpoint<'eventTypesCreate'>;
	eventTypesCreateOneOff: CalendlyEndpoint<'eventTypesCreateOneOff'>;
	eventTypesUpdate: CalendlyEndpoint<'eventTypesUpdate'>;
	eventTypesUpdateAvailability: CalendlyEndpoint<'eventTypesUpdateAvailability'>;
	eventTypesListAvailableTimes: CalendlyEndpoint<'eventTypesListAvailableTimes'>;
	eventTypesListHosts: CalendlyEndpoint<'eventTypesListHosts'>;
	inviteesGet: CalendlyEndpoint<'inviteesGet'>;
	inviteesList: CalendlyEndpoint<'inviteesList'>;
	inviteesCreate: CalendlyEndpoint<'inviteesCreate'>;
	inviteesDeleteData: CalendlyEndpoint<'inviteesDeleteData'>;
	inviteesGetNoShow: CalendlyEndpoint<'inviteesGetNoShow'>;
	inviteesMarkNoShow: CalendlyEndpoint<'inviteesMarkNoShow'>;
	inviteesDeleteNoShow: CalendlyEndpoint<'inviteesDeleteNoShow'>;
	usersGet: CalendlyEndpoint<'usersGet'>;
	usersGetCurrent: CalendlyEndpoint<'usersGetCurrent'>;
	usersGetAvailabilitySchedule: CalendlyEndpoint<'usersGetAvailabilitySchedule'>;
	usersListAvailabilitySchedules: CalendlyEndpoint<'usersListAvailabilitySchedules'>;
	usersListBusyTimes: CalendlyEndpoint<'usersListBusyTimes'>;
	usersListMeetingLocations: CalendlyEndpoint<'usersListMeetingLocations'>;
	usersListEventTypes: CalendlyEndpoint<'usersListEventTypes'>;
	organizationsGet: CalendlyEndpoint<'organizationsGet'>;
	organizationsGetInvitation: CalendlyEndpoint<'organizationsGetInvitation'>;
	organizationsGetMembership: CalendlyEndpoint<'organizationsGetMembership'>;
	organizationsListInvitations: CalendlyEndpoint<'organizationsListInvitations'>;
	organizationsListMemberships: CalendlyEndpoint<'organizationsListMemberships'>;
	organizationsDeleteMembership: CalendlyEndpoint<'organizationsDeleteMembership'>;
	organizationsInvite: CalendlyEndpoint<'organizationsInvite'>;
	organizationsRemoveMember: CalendlyEndpoint<'organizationsRemoveMember'>;
	organizationsRevokeInvitation: CalendlyEndpoint<'organizationsRevokeInvitation'>;
	groupsGet: CalendlyEndpoint<'groupsGet'>;
	groupsGetRelationship: CalendlyEndpoint<'groupsGetRelationship'>;
	groupsList: CalendlyEndpoint<'groupsList'>;
	groupsListRelationships: CalendlyEndpoint<'groupsListRelationships'>;
	routingFormsGet: CalendlyEndpoint<'routingFormsGet'>;
	routingFormsGetSubmission: CalendlyEndpoint<'routingFormsGetSubmission'>;
	routingFormsList: CalendlyEndpoint<'routingFormsList'>;
	routingFormsGetSampleWebhookData: CalendlyEndpoint<'routingFormsGetSampleWebhookData'>;
	schedulingLinksCreate: CalendlyEndpoint<'schedulingLinksCreate'>;
	schedulingLinksCreateSingleUse: CalendlyEndpoint<'schedulingLinksCreateSingleUse'>;
	schedulingLinksCreateShare: CalendlyEndpoint<'schedulingLinksCreateShare'>;
	webhookSubscriptionsCreate: CalendlyEndpoint<'webhookSubscriptionsCreate'>;
	webhookSubscriptionsGet: CalendlyEndpoint<'webhookSubscriptionsGet'>;
	webhookSubscriptionsList: CalendlyEndpoint<'webhookSubscriptionsList'>;
	webhookSubscriptionsDelete: CalendlyEndpoint<'webhookSubscriptionsDelete'>;
	activityLogList: CalendlyEndpoint<'activityLogList'>;
	activityLogListOutgoingCommunications: CalendlyEndpoint<'activityLogListOutgoingCommunications'>;
};

type CalendlyWebhook<
	K extends keyof CalendlyWebhookOutputs,
	TEvent,
> = CorsairWebhook<CalendlyContext, TEvent, CalendlyWebhookOutputs[K]>;

export type CalendlyWebhooks = {
	inviteeCreated: CalendlyWebhook<'inviteeCreated', InviteeCreatedPayload>;
	inviteeCanceled: CalendlyWebhook<'inviteeCanceled', InviteeCanceledPayload>;
	inviteeNoShow: CalendlyWebhook<'inviteeNoShow', InviteeNoShowCreatedPayload>;
	routingFormSubmission: CalendlyWebhook<
		'routingFormSubmission',
		RoutingFormSubmissionCreatedPayload
	>;
	eventTypeUpdated: CalendlyWebhook<
		'eventTypeUpdated',
		EventTypeUpdatedPayload
	>;
	userUpdated: CalendlyWebhook<'userUpdated', UserUpdatedPayload>;
};

export type CalendlyBoundWebhooks = BindWebhooks<CalendlyWebhooks>;

const calendlyEndpointsNested = {
	scheduledEvents: {
		get: ScheduledEvents.get,
		list: ScheduledEvents.list,
		cancel: ScheduledEvents.cancel,
		deleteData: ScheduledEvents.deleteData,
	},
	eventTypes: {
		get: EventTypes.get,
		list: EventTypes.list,
		create: EventTypes.create,
		createOneOff: EventTypes.createOneOff,
		update: EventTypes.update,
		updateAvailability: EventTypes.updateAvailability,
		listAvailableTimes: EventTypes.listAvailableTimes,
		listHosts: EventTypes.listHosts,
	},
	invitees: {
		get: Invitees.get,
		list: Invitees.list,
		create: Invitees.create,
		deleteData: Invitees.deleteData,
		getNoShow: Invitees.getNoShow,
		markNoShow: Invitees.markNoShow,
		deleteNoShow: Invitees.deleteNoShow,
	},
	users: {
		get: Users.get,
		getCurrent: Users.getCurrent,
		getAvailabilitySchedule: Users.getAvailabilitySchedule,
		listAvailabilitySchedules: Users.listAvailabilitySchedules,
		listBusyTimes: Users.listBusyTimes,
		listMeetingLocations: Users.listMeetingLocations,
		listEventTypes: Users.listEventTypes,
	},
	organizations: {
		get: Organizations.get,
		getInvitation: Organizations.getInvitation,
		getMembership: Organizations.getMembership,
		listInvitations: Organizations.listInvitations,
		listMemberships: Organizations.listMemberships,
		deleteMembership: Organizations.deleteMembership,
		invite: Organizations.invite,
		removeMember: Organizations.removeMember,
		revokeInvitation: Organizations.revokeInvitation,
	},
	groups: {
		get: Groups.get,
		getRelationship: Groups.getRelationship,
		list: Groups.list,
		listRelationships: Groups.listRelationships,
	},
	routingForms: {
		get: RoutingForms.get,
		getSubmission: RoutingForms.getSubmission,
		list: RoutingForms.list,
		getSampleWebhookData: RoutingForms.getSampleWebhookData,
	},
	schedulingLinks: {
		create: SchedulingLinks.create,
		createSingleUse: SchedulingLinks.createSingleUse,
		createShare: SchedulingLinks.createShare,
	},
	webhookSubscriptions: {
		create: WebhookSubscriptions.create,
		get: WebhookSubscriptions.get,
		list: WebhookSubscriptions.list,
		delete: WebhookSubscriptions.delete,
	},
	activityLog: {
		list: ActivityLog.list,
		listOutgoingCommunications: ActivityLog.listOutgoingCommunications,
	},
} as const;

const calendlyWebhooksNested = {
	invitees: {
		created: InviteeWebhooks.created,
		canceled: InviteeWebhooks.canceled,
		noShow: InviteeWebhooks.noShow,
	},
	routingForms: {
		submission: RoutingFormWebhooks.submission,
	},
	eventTypes: {
		updated: EventTypeWebhooks.updated,
	},
	users: {
		updated: UserWebhooks.updated,
	},
} as const;

export const calendlyEndpointSchemas = {
	'scheduledEvents.get': {
		input: CalendlyEndpointInputSchemas.scheduledEventsGet,
		output: CalendlyEndpointOutputSchemas.scheduledEventsGet,
	},
	'scheduledEvents.list': {
		input: CalendlyEndpointInputSchemas.scheduledEventsList,
		output: CalendlyEndpointOutputSchemas.scheduledEventsList,
	},
	'scheduledEvents.cancel': {
		input: CalendlyEndpointInputSchemas.scheduledEventsCancel,
		output: CalendlyEndpointOutputSchemas.scheduledEventsCancel,
	},
	'scheduledEvents.deleteData': {
		input: CalendlyEndpointInputSchemas.scheduledEventsDeleteData,
		output: CalendlyEndpointOutputSchemas.scheduledEventsDeleteData,
	},
	'eventTypes.get': {
		input: CalendlyEndpointInputSchemas.eventTypesGet,
		output: CalendlyEndpointOutputSchemas.eventTypesGet,
	},
	'eventTypes.list': {
		input: CalendlyEndpointInputSchemas.eventTypesList,
		output: CalendlyEndpointOutputSchemas.eventTypesList,
	},
	'eventTypes.create': {
		input: CalendlyEndpointInputSchemas.eventTypesCreate,
		output: CalendlyEndpointOutputSchemas.eventTypesCreate,
	},
	'eventTypes.createOneOff': {
		input: CalendlyEndpointInputSchemas.eventTypesCreateOneOff,
		output: CalendlyEndpointOutputSchemas.eventTypesCreateOneOff,
	},
	'eventTypes.update': {
		input: CalendlyEndpointInputSchemas.eventTypesUpdate,
		output: CalendlyEndpointOutputSchemas.eventTypesUpdate,
	},
	'eventTypes.updateAvailability': {
		input: CalendlyEndpointInputSchemas.eventTypesUpdateAvailability,
		output: CalendlyEndpointOutputSchemas.eventTypesUpdateAvailability,
	},
	'eventTypes.listAvailableTimes': {
		input: CalendlyEndpointInputSchemas.eventTypesListAvailableTimes,
		output: CalendlyEndpointOutputSchemas.eventTypesListAvailableTimes,
	},
	'eventTypes.listHosts': {
		input: CalendlyEndpointInputSchemas.eventTypesListHosts,
		output: CalendlyEndpointOutputSchemas.eventTypesListHosts,
	},
	'invitees.get': {
		input: CalendlyEndpointInputSchemas.inviteesGet,
		output: CalendlyEndpointOutputSchemas.inviteesGet,
	},
	'invitees.list': {
		input: CalendlyEndpointInputSchemas.inviteesList,
		output: CalendlyEndpointOutputSchemas.inviteesList,
	},
	'invitees.create': {
		input: CalendlyEndpointInputSchemas.inviteesCreate,
		output: CalendlyEndpointOutputSchemas.inviteesCreate,
	},
	'invitees.deleteData': {
		input: CalendlyEndpointInputSchemas.inviteesDeleteData,
		output: CalendlyEndpointOutputSchemas.inviteesDeleteData,
	},
	'invitees.getNoShow': {
		input: CalendlyEndpointInputSchemas.inviteesGetNoShow,
		output: CalendlyEndpointOutputSchemas.inviteesGetNoShow,
	},
	'invitees.markNoShow': {
		input: CalendlyEndpointInputSchemas.inviteesMarkNoShow,
		output: CalendlyEndpointOutputSchemas.inviteesMarkNoShow,
	},
	'invitees.deleteNoShow': {
		input: CalendlyEndpointInputSchemas.inviteesDeleteNoShow,
		output: CalendlyEndpointOutputSchemas.inviteesDeleteNoShow,
	},
	'users.get': {
		input: CalendlyEndpointInputSchemas.usersGet,
		output: CalendlyEndpointOutputSchemas.usersGet,
	},
	'users.getCurrent': {
		input: CalendlyEndpointInputSchemas.usersGetCurrent,
		output: CalendlyEndpointOutputSchemas.usersGetCurrent,
	},
	'users.getAvailabilitySchedule': {
		input: CalendlyEndpointInputSchemas.usersGetAvailabilitySchedule,
		output: CalendlyEndpointOutputSchemas.usersGetAvailabilitySchedule,
	},
	'users.listAvailabilitySchedules': {
		input: CalendlyEndpointInputSchemas.usersListAvailabilitySchedules,
		output: CalendlyEndpointOutputSchemas.usersListAvailabilitySchedules,
	},
	'users.listBusyTimes': {
		input: CalendlyEndpointInputSchemas.usersListBusyTimes,
		output: CalendlyEndpointOutputSchemas.usersListBusyTimes,
	},
	'users.listMeetingLocations': {
		input: CalendlyEndpointInputSchemas.usersListMeetingLocations,
		output: CalendlyEndpointOutputSchemas.usersListMeetingLocations,
	},
	'users.listEventTypes': {
		input: CalendlyEndpointInputSchemas.usersListEventTypes,
		output: CalendlyEndpointOutputSchemas.usersListEventTypes,
	},
	'organizations.get': {
		input: CalendlyEndpointInputSchemas.organizationsGet,
		output: CalendlyEndpointOutputSchemas.organizationsGet,
	},
	'organizations.getInvitation': {
		input: CalendlyEndpointInputSchemas.organizationsGetInvitation,
		output: CalendlyEndpointOutputSchemas.organizationsGetInvitation,
	},
	'organizations.getMembership': {
		input: CalendlyEndpointInputSchemas.organizationsGetMembership,
		output: CalendlyEndpointOutputSchemas.organizationsGetMembership,
	},
	'organizations.listInvitations': {
		input: CalendlyEndpointInputSchemas.organizationsListInvitations,
		output: CalendlyEndpointOutputSchemas.organizationsListInvitations,
	},
	'organizations.listMemberships': {
		input: CalendlyEndpointInputSchemas.organizationsListMemberships,
		output: CalendlyEndpointOutputSchemas.organizationsListMemberships,
	},
	'organizations.deleteMembership': {
		input: CalendlyEndpointInputSchemas.organizationsDeleteMembership,
		output: CalendlyEndpointOutputSchemas.organizationsDeleteMembership,
	},
	'organizations.invite': {
		input: CalendlyEndpointInputSchemas.organizationsInvite,
		output: CalendlyEndpointOutputSchemas.organizationsInvite,
	},
	'organizations.removeMember': {
		input: CalendlyEndpointInputSchemas.organizationsRemoveMember,
		output: CalendlyEndpointOutputSchemas.organizationsRemoveMember,
	},
	'organizations.revokeInvitation': {
		input: CalendlyEndpointInputSchemas.organizationsRevokeInvitation,
		output: CalendlyEndpointOutputSchemas.organizationsRevokeInvitation,
	},
	'groups.get': {
		input: CalendlyEndpointInputSchemas.groupsGet,
		output: CalendlyEndpointOutputSchemas.groupsGet,
	},
	'groups.getRelationship': {
		input: CalendlyEndpointInputSchemas.groupsGetRelationship,
		output: CalendlyEndpointOutputSchemas.groupsGetRelationship,
	},
	'groups.list': {
		input: CalendlyEndpointInputSchemas.groupsList,
		output: CalendlyEndpointOutputSchemas.groupsList,
	},
	'groups.listRelationships': {
		input: CalendlyEndpointInputSchemas.groupsListRelationships,
		output: CalendlyEndpointOutputSchemas.groupsListRelationships,
	},
	'routingForms.get': {
		input: CalendlyEndpointInputSchemas.routingFormsGet,
		output: CalendlyEndpointOutputSchemas.routingFormsGet,
	},
	'routingForms.getSubmission': {
		input: CalendlyEndpointInputSchemas.routingFormsGetSubmission,
		output: CalendlyEndpointOutputSchemas.routingFormsGetSubmission,
	},
	'routingForms.list': {
		input: CalendlyEndpointInputSchemas.routingFormsList,
		output: CalendlyEndpointOutputSchemas.routingFormsList,
	},
	'routingForms.getSampleWebhookData': {
		input: CalendlyEndpointInputSchemas.routingFormsGetSampleWebhookData,
		output: CalendlyEndpointOutputSchemas.routingFormsGetSampleWebhookData,
	},
	'schedulingLinks.create': {
		input: CalendlyEndpointInputSchemas.schedulingLinksCreate,
		output: CalendlyEndpointOutputSchemas.schedulingLinksCreate,
	},
	'schedulingLinks.createSingleUse': {
		input: CalendlyEndpointInputSchemas.schedulingLinksCreateSingleUse,
		output: CalendlyEndpointOutputSchemas.schedulingLinksCreateSingleUse,
	},
	'schedulingLinks.createShare': {
		input: CalendlyEndpointInputSchemas.schedulingLinksCreateShare,
		output: CalendlyEndpointOutputSchemas.schedulingLinksCreateShare,
	},
	'webhookSubscriptions.create': {
		input: CalendlyEndpointInputSchemas.webhookSubscriptionsCreate,
		output: CalendlyEndpointOutputSchemas.webhookSubscriptionsCreate,
	},
	'webhookSubscriptions.get': {
		input: CalendlyEndpointInputSchemas.webhookSubscriptionsGet,
		output: CalendlyEndpointOutputSchemas.webhookSubscriptionsGet,
	},
	'webhookSubscriptions.list': {
		input: CalendlyEndpointInputSchemas.webhookSubscriptionsList,
		output: CalendlyEndpointOutputSchemas.webhookSubscriptionsList,
	},
	'webhookSubscriptions.delete': {
		input: CalendlyEndpointInputSchemas.webhookSubscriptionsDelete,
		output: CalendlyEndpointOutputSchemas.webhookSubscriptionsDelete,
	},
	'activityLog.list': {
		input: CalendlyEndpointInputSchemas.activityLogList,
		output: CalendlyEndpointOutputSchemas.activityLogList,
	},
	'activityLog.listOutgoingCommunications': {
		input: CalendlyEndpointInputSchemas.activityLogListOutgoingCommunications,
		output: CalendlyEndpointOutputSchemas.activityLogListOutgoingCommunications,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const calendlyEndpointMeta = {
	'scheduledEvents.get': {
		riskLevel: 'read',
		description: 'Get a scheduled event by UUID',
	},
	'scheduledEvents.list': {
		riskLevel: 'read',
		description: 'List all scheduled events',
	},
	'scheduledEvents.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a scheduled event [DESTRUCTIVE]',
	},
	'scheduledEvents.deleteData': {
		riskLevel: 'destructive',
		description:
			'Delete all scheduled event data in a time range [DESTRUCTIVE]',
	},
	'eventTypes.get': {
		riskLevel: 'read',
		description: 'Get an event type by UUID',
	},
	'eventTypes.list': { riskLevel: 'read', description: 'List all event types' },
	'eventTypes.create': {
		riskLevel: 'write',
		description: 'Create a new event type',
	},
	'eventTypes.createOneOff': {
		riskLevel: 'write',
		description: 'Create a one-off event type',
	},
	'eventTypes.update': {
		riskLevel: 'write',
		description: 'Update an event type',
	},
	'eventTypes.updateAvailability': {
		riskLevel: 'write',
		description: 'Update availability for an event type',
	},
	'eventTypes.listAvailableTimes': {
		riskLevel: 'read',
		description: 'List available times for an event type',
	},
	'eventTypes.listHosts': {
		riskLevel: 'read',
		description: 'List hosts for an event type',
	},
	'invitees.get': {
		riskLevel: 'read',
		description: 'Get an event invitee by UUID',
	},
	'invitees.list': {
		riskLevel: 'read',
		description: 'List invitees for a scheduled event',
	},
	'invitees.create': {
		riskLevel: 'write',
		description: 'Create an invitee for a one-off event type',
	},
	'invitees.deleteData': {
		riskLevel: 'destructive',
		description: 'Delete all data for specified invitee emails [DESTRUCTIVE]',
	},
	'invitees.getNoShow': {
		riskLevel: 'read',
		description: 'Get an invitee no-show record',
	},
	'invitees.markNoShow': {
		riskLevel: 'write',
		description: 'Mark an invitee as a no-show',
	},
	'invitees.deleteNoShow': {
		riskLevel: 'destructive',
		description: 'Delete an invitee no-show record [DESTRUCTIVE]',
	},
	'users.get': { riskLevel: 'read', description: 'Get a user by UUID' },
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the currently authenticated user (deprecated)',
	},
	'users.getAvailabilitySchedule': {
		riskLevel: 'read',
		description: 'Get a user availability schedule',
	},
	'users.listAvailabilitySchedules': {
		riskLevel: 'read',
		description: 'List all availability schedules for a user',
	},
	'users.listBusyTimes': {
		riskLevel: 'read',
		description: 'List busy times for a user',
	},
	'users.listMeetingLocations': {
		riskLevel: 'read',
		description: 'List meeting locations for a user',
	},
	'users.listEventTypes': {
		riskLevel: 'read',
		description: 'List event types for a user (deprecated)',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by UUID',
	},
	'organizations.getInvitation': {
		riskLevel: 'read',
		description: 'Get an organization invitation',
	},
	'organizations.getMembership': {
		riskLevel: 'read',
		description: 'Get an organization membership',
	},
	'organizations.listInvitations': {
		riskLevel: 'read',
		description: 'List organization invitations',
	},
	'organizations.listMemberships': {
		riskLevel: 'read',
		description: 'List organization memberships',
	},
	'organizations.deleteMembership': {
		riskLevel: 'destructive',
		description: 'Delete an organization membership [DESTRUCTIVE]',
	},
	'organizations.invite': {
		riskLevel: 'write',
		description: 'Invite a user to an organization',
	},
	'organizations.removeMember': {
		riskLevel: 'destructive',
		description: 'Remove a user from the organization [DESTRUCTIVE]',
	},
	'organizations.revokeInvitation': {
		riskLevel: 'destructive',
		description: "Revoke a user's organization invitation [DESTRUCTIVE]",
	},
	'groups.get': { riskLevel: 'read', description: 'Get a group by UUID' },
	'groups.getRelationship': {
		riskLevel: 'read',
		description: 'Get a group relationship by UUID',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List groups in an organization',
	},
	'groups.listRelationships': {
		riskLevel: 'read',
		description: 'List relationships for a group',
	},
	'routingForms.get': {
		riskLevel: 'read',
		description: 'Get a routing form by UUID',
	},
	'routingForms.getSubmission': {
		riskLevel: 'read',
		description: 'Get a routing form submission by UUID',
	},
	'routingForms.list': {
		riskLevel: 'read',
		description: 'List routing forms in an organization',
	},
	'routingForms.getSampleWebhookData': {
		riskLevel: 'read',
		description: 'Get sample webhook data for an event type',
	},
	'schedulingLinks.create': {
		riskLevel: 'write',
		description: 'Create a scheduling link',
	},
	'schedulingLinks.createSingleUse': {
		riskLevel: 'write',
		description: 'Create a single-use scheduling link',
	},
	'schedulingLinks.createShare': {
		riskLevel: 'write',
		description: 'Create a share link for an event type',
	},
	'webhookSubscriptions.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription',
	},
	'webhookSubscriptions.get': {
		riskLevel: 'read',
		description: 'Get a webhook subscription by UUID',
	},
	'webhookSubscriptions.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'webhookSubscriptions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription [DESTRUCTIVE]',
	},
	'activityLog.list': {
		riskLevel: 'read',
		description: 'List activity log entries for an organization',
	},
	'activityLog.listOutgoingCommunications': {
		riskLevel: 'read',
		description: 'List outgoing communications for an organization',
	},
} satisfies RequiredPluginEndpointMeta<typeof calendlyEndpointsNested>;

export const calendlyAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const calendlyWebhookSchemas = {
	'invitees.created': {
		description: 'An invitee booked a meeting',
		payload: InviteeCreatedPayloadSchema,
		response: InviteeCreatedPayloadSchema,
	},
	'invitees.canceled': {
		description: 'An invitee canceled a meeting',
		payload: InviteeCanceledPayloadSchema,
		response: InviteeCanceledPayloadSchema,
	},
	'invitees.noShow': {
		description: 'An invitee was marked as a no-show',
		payload: InviteeNoShowCreatedPayloadSchema,
		response: InviteeNoShowCreatedPayloadSchema,
	},
	'routingForms.submission': {
		description: 'A routing form submission was created',
		payload: RoutingFormSubmissionCreatedPayloadSchema,
		response: RoutingFormSubmissionCreatedPayloadSchema,
	},
	'eventTypes.updated': {
		description: 'An event type was updated',
		payload: EventTypeUpdatedPayloadSchema,
		response: EventTypeUpdatedPayloadSchema,
	},
	'users.updated': {
		description: 'A user was updated',
		payload: UserUpdatedPayloadSchema,
		response: UserUpdatedPayloadSchema,
	},
} as const;

export type BaseCalendlyPlugin<T extends CalendlyPluginOptions> = CorsairPlugin<
	'calendly',
	typeof CalendlySchema,
	typeof calendlyEndpointsNested,
	typeof calendlyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCalendlyPlugin = BaseCalendlyPlugin<CalendlyPluginOptions>;

export type ExternalCalendlyPlugin<T extends CalendlyPluginOptions> =
	BaseCalendlyPlugin<T>;

export function calendly<const T extends CalendlyPluginOptions>(
	// Default to empty object when no options are supplied; required fields (e.g. authType) are set below
	incomingOptions: CalendlyPluginOptions & T = {} as CalendlyPluginOptions & T,
): ExternalCalendlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'calendly',
		schema: CalendlySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: calendlyEndpointsNested,
		webhooks: calendlyWebhooksNested,
		endpointMeta: calendlyEndpointMeta,
		endpointSchemas: calendlyEndpointSchemas,
		webhookSchemas: calendlyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'calendly-webhook-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CalendlyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalCalendlyPlugin;
}

// ── Webhook Type Exports ──────────────────────────────────────────────────────

export type {
	CalendlyWebhookOutputs,
	EventTypeUpdatedPayload,
	InviteeCanceledPayload,
	InviteeCreatedPayload,
	InviteeNoShowCreatedPayload,
	RoutingFormSubmissionCreatedPayload,
	UserUpdatedPayload,
} from './webhooks/types';

// ── Endpoint Type Exports ─────────────────────────────────────────────────────

export type {
	CalendlyEndpointInputs,
	CalendlyEndpointOutputs,
	EventTypesCreateResponse,
	EventTypesGetResponse,
	EventTypesListResponse,
	EventTypesUpdateResponse,
	InviteesCreateResponse,
	InviteesGetResponse,
	InviteesListResponse,
	OrganizationsListMembershipsResponse,
	ScheduledEventsGetResponse,
	ScheduledEventsListResponse,
	UsersGetCurrentResponse,
	UsersGetResponse,
	WebhookSubscriptionsCreateResponse,
	WebhookSubscriptionsListResponse,
} from './endpoints/types';
