import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const PaginationSchema = z.object({
	count: z.number().optional(),
	next_page: z.string().nullable().optional(),
	previous_page: z.string().nullable().optional(),
	next_page_token: z.string().nullable().optional(),
	previous_page_token: z.string().nullable().optional(),
});

const LocationSchema = z
	.object({
		type: z.string(),
		location: z.string().optional(),
		join_url: z.string().optional(),
		status: z.string().optional(),
		additional_info: z.string().optional(),
	})
	.passthrough();

const ScheduledEventSchema = z
	.object({
		uri: z.string(),
		name: z.string().optional(),
		status: z.enum(['active', 'canceled']).optional(),
		start_time: z.string(),
		end_time: z.string(),
		event_type: z.string(),
		location: LocationSchema.optional(),
		invitees_counter: z
			.object({
				total: z.number(),
				active: z.number(),
				limit: z.number(),
			})
			.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		event_memberships: z
			.array(
				z.object({
					user: z.string(),
					user_email: z.string().optional(),
					user_name: z.string().optional(),
				}),
			)
			.optional(),
		event_guests: z
			.array(
				z.object({
					email: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
				}),
			)
			.optional(),
	})
	.passthrough();

const EventTypeSchema = z
	.object({
		uri: z.string(),
		name: z.string(),
		active: z.boolean(),
		slug: z.string().optional(),
		scheduling_url: z.string(),
		duration: z.number(),
		duration_options: z.array(z.number()).nullable().optional(),
		kind: z.string().optional(),
		pooling_type: z.string().nullable().optional(),
		type: z.string().optional(),
		color: z.string().optional(),
		created_at: z.string(),
		updated_at: z.string(),
		internal_note: z.string().nullable().optional(),
		description_plain: z.string().nullable().optional(),
		description_html: z.string().nullable().optional(),
		profile: z
			.object({
				type: z.string(),
				name: z.string(),
				owner: z.string(),
			})
			.optional(),
		secret: z.boolean().optional(),
		booking_method: z.string().optional(),
		custom_questions: z
			.array(
				z.object({
					name: z.string(),
					type: z.string(),
					position: z.number(),
					enabled: z.boolean(),
					required: z.boolean(),
					answer_choices: z.array(z.string()).optional(),
					include_other: z.boolean().optional(),
				}),
			)
			.optional(),
		deleted_at: z.string().nullable().optional(),
	})
	.passthrough();

const InviteeSchema = z
	.object({
		uri: z.string(),
		email: z.string(),
		name: z.string(),
		status: z.enum(['active', 'canceled']).optional(),
		questions_and_answers: z
			.array(
				z.object({
					question: z.string(),
					answer: z.string(),
					position: z.number(),
				}),
			)
			.optional(),
		timezone: z.string().optional(),
		event: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		tracking: z
			.object({
				utm_campaign: z.string().nullable().optional(),
				utm_source: z.string().nullable().optional(),
				utm_medium: z.string().nullable().optional(),
				utm_content: z.string().nullable().optional(),
				utm_term: z.string().nullable().optional(),
				salesforce_uuid: z.string().nullable().optional(),
			})
			.optional(),
		text_reminder_number: z.string().nullable().optional(),
		rescheduled: z.boolean().optional(),
		old_invitee: z.string().nullable().optional(),
		new_invitee: z.string().nullable().optional(),
		cancel_url: z.string().optional(),
		reschedule_url: z.string().optional(),
		routing_form_submission: z.string().nullable().optional(),
		payment: z
			.object({
				external_id: z.string(),
				provider: z.string(),
				amount: z.number(),
				currency: z.string(),
				terms: z.string(),
				successful: z.boolean(),
			})
			.nullable()
			.optional(),
		no_show: z.object({ uri: z.string() }).nullable().optional(),
		scheduling_method: z.string().nullable().optional(),
		invitee_scheduled_by: z.string().nullable().optional(),
	})
	.passthrough();

const UserSchema = z
	.object({
		uri: z.string(),
		name: z.string(),
		slug: z.string(),
		email: z.string(),
		scheduling_url: z.string(),
		timezone: z.string(),
		avatar_url: z.string().nullable().optional(),
		created_at: z.string(),
		updated_at: z.string(),
		current_organization: z.string().optional(),
	})
	.passthrough();

const WebhookSubscriptionSchema = z
	.object({
		uri: z.string(),
		callback_url: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		retry_started_at: z.string().nullable().optional(),
		state: z.enum(['active', 'disabled']),
		events: z.array(z.string()),
		scope: z.string(),
		organization: z.string(),
		user: z.string().nullable().optional(),
		creator: z.string(),
	})
	.passthrough();

const OrganizationMembershipSchema = z
	.object({
		uri: z.string(),
		role: z.string(),
		user: UserSchema,
		organization: z.string(),
		updated_at: z.string(),
		created_at: z.string(),
	})
	.passthrough();

const OrganizationInvitationSchema = z
	.object({
		uri: z.string(),
		organization: z.string(),
		email: z.string(),
		status: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
		last_sent_at: z.string().optional(),
		user: z.string().nullable().optional(),
	})
	.passthrough();

const GroupSchema = z
	.object({
		uri: z.string(),
		name: z.string(),
		slug: z.string().optional(),
		organization: z.string(),
		user_count: z.number().optional(),
		scheduling_url: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

const RoutingFormSchema = z
	.object({
		uri: z.string(),
		name: z.string(),
		organization: z.string(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

const AvailabilityScheduleSchema = z
	.object({
		uri: z.string(),
		default: z.boolean().optional(),
		name: z.string(),
		user: z.string(),
		timezone: z.string(),
		// Availability rule objects vary in shape by type (wday, date, etc.); structure is not stable in the public API
		rules: z.array(z.record(z.unknown())).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

// Scheduled Events
const ScheduledEventsGetInputSchema = z.object({
	uuid: z.string(),
});

const ScheduledEventsListInputSchema = z.object({
	user: z.string().optional(),
	organization: z.string().optional(),
	status: z.enum(['active', 'canceled']).optional(),
	min_start_time: z.string().optional(),
	max_start_time: z.string().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	sort: z.string().optional(),
	invitee_email: z.string().optional(),
});

const ScheduledEventsCancelInputSchema = z.object({
	uuid: z.string(),
	reason: z.string().optional(),
});

const ScheduledEventsDeleteDataInputSchema = z.object({
	start_time: z.string(),
	end_time: z.string(),
});

// Event Types
const EventTypesGetInputSchema = z.object({
	uuid: z.string(),
});

const EventTypesListInputSchema = z.object({
	user: z.string().optional(),
	organization: z.string().optional(),
	active: z.boolean().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	sort: z.string().optional(),
});

const EventTypesCreateInputSchema = z.object({
	name: z.string(),
	host: z.string(),
	co_hosts: z.array(z.string()).optional(),
	duration: z.number().optional(),
	timezone: z.string().optional(),
	date_setting: z
		.object({
			type: z.string(),
			num_days: z.number().optional(),
		})
		.optional(),
	location_configurations: z
		.array(
			z.object({
				kind: z.string(),
				location: z.string().optional(),
				additional_info: z.string().optional(),
			}),
		)
		.optional(),
	description_plain: z.string().optional(),
	color: z.string().optional(),
	slug: z.string().optional(),
});

const EventTypesCreateOneOffInputSchema = z.object({
	name: z.string(),
	host: z.string(),
	duration: z.number(),
	timezone: z.string(),
	date_setting: z.object({
		type: z.string(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
	}),
	location_configuration: z
		.object({
			kind: z.string(),
			location: z.string().optional(),
		})
		.optional(),
});

const EventTypesUpdateInputSchema = z.object({
	uuid: z.string(),
	name: z.string().optional(),
	description_plain: z.string().optional(),
	color: z.string().optional(),
	duration: z.number().optional(),
	slug: z.string().optional(),
});

const EventTypesUpdateAvailabilityInputSchema = z.object({
	uuid: z.string(),
	rules: z
		.array(
			z.object({
				type: z.string(),
				wday: z.string().optional(),
				date: z.string().optional(),
				intervals: z.array(
					z.object({
						from: z.string(),
						to: z.string(),
					}),
				),
			}),
		)
		.optional(),
	timezone: z.string().optional(),
});

const EventTypesListAvailableTimesInputSchema = z.object({
	event_type: z.string(),
	start_time: z.string(),
	end_time: z.string(),
	timezone: z.string().optional(),
	diagnostics: z.boolean().optional(),
});

const EventTypesListHostsInputSchema = z.object({
	event_type: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
});

// Invitees
const InviteesGetInputSchema = z.object({
	event_uuid: z.string(),
	invitee_uuid: z.string(),
});

const InviteesListInputSchema = z.object({
	event_uuid: z.string(),
	status: z.enum(['active', 'canceled']).optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	sort: z.string().optional(),
	email: z.string().optional(),
});

const InviteesCreateInputSchema = z.object({
	event_type_uuid: z.string(),
	email: z.string(),
	name: z.string().optional(),
	timezone: z.string().optional(),
	additional_guests: z
		.array(
			z.object({
				email: z.string(),
			}),
		)
		.optional(),
	questions_and_answers: z
		.array(
			z.object({
				question: z.string(),
				answer: z.string(),
				position: z.number(),
			}),
		)
		.optional(),
});

const InviteesDeleteDataInputSchema = z.object({
	emails: z.array(z.string()),
});

const InviteesGetNoShowInputSchema = z.object({
	uuid: z.string(),
});

const InviteesMarkNoShowInputSchema = z.object({
	invitee: z.string(),
});

const InviteesDeleteNoShowInputSchema = z.object({
	uuid: z.string(),
});

// Users
const UsersGetInputSchema = z.object({
	uuid: z.string(),
});

const UsersGetCurrentInputSchema = z.object({});

const UsersGetAvailabilityScheduleInputSchema = z.object({
	uuid: z.string(),
});

const UsersListAvailabilitySchedulesInputSchema = z.object({
	user: z.string(),
});

const UsersListBusyTimesInputSchema = z.object({
	user: z.string(),
	start_time: z.string(),
	end_time: z.string(),
});

const UsersListMeetingLocationsInputSchema = z.object({
	user: z.string(),
});

const UsersListEventTypesInputSchema = z.object({
	user: z.string(),
	organization: z.string().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	active: z.boolean().optional(),
});

// Organizations
const OrganizationsGetInputSchema = z.object({
	uuid: z.string(),
});

const OrganizationsGetInvitationInputSchema = z.object({
	org_uuid: z.string(),
	uuid: z.string(),
});

const OrganizationsGetMembershipInputSchema = z.object({
	uuid: z.string(),
});

const OrganizationsListInvitationsInputSchema = z.object({
	org_uuid: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	email: z.string().optional(),
	status: z.string().optional(),
	sort: z.string().optional(),
});

const OrganizationsListMembershipsInputSchema = z.object({
	organization: z.string().optional(),
	user: z.string().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	email: z.string().optional(),
});

const OrganizationsDeleteMembershipInputSchema = z.object({
	uuid: z.string(),
});

const OrganizationsInviteInputSchema = z.object({
	org_uuid: z.string(),
	email: z.string(),
});

const OrganizationsRemoveMemberInputSchema = z.object({
	uuid: z.string(),
});

const OrganizationsRevokeInvitationInputSchema = z.object({
	org_uuid: z.string(),
	uuid: z.string(),
});

// Groups
const GroupsGetInputSchema = z.object({
	uuid: z.string(),
});

const GroupsGetRelationshipInputSchema = z.object({
	uuid: z.string(),
});

const GroupsListInputSchema = z.object({
	organization: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	sort: z.string().optional(),
});

const GroupsListRelationshipsInputSchema = z.object({
	group: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
});

// Routing Forms
const RoutingFormsGetInputSchema = z.object({
	uuid: z.string(),
});

const RoutingFormsGetSubmissionInputSchema = z.object({
	uuid: z.string(),
});

const RoutingFormsListInputSchema = z.object({
	organization: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	sort: z.string().optional(),
});

const RoutingFormsGetSampleWebhookDataInputSchema = z.object({
	organization: z.string(),
	scope: z.string(),
	event: z.string(),
});

// Scheduling Links
const SchedulingLinksCreateInputSchema = z.object({
	max_event_count: z.number(),
	owner: z.string(),
	owner_type: z.string(),
});

const SchedulingLinksCreateSingleUseInputSchema = z.object({
	max_event_count: z.number(),
	owner: z.string(),
	owner_type: z.string(),
});

const SchedulingLinksCreateShareInputSchema = z.object({
	event_type: z.string(),
});

// Webhook Subscriptions
const WebhookSubscriptionsCreateInputSchema = z.object({
	url: z.string(),
	events: z.array(z.string()),
	organization: z.string(),
	scope: z.string(),
	user: z.string().optional(),
	signature_secret: z.string().optional(),
});

const WebhookSubscriptionsGetInputSchema = z.object({
	uuid: z.string(),
});

const WebhookSubscriptionsListInputSchema = z.object({
	organization: z.string(),
	scope: z.string(),
	user: z.string().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
});

const WebhookSubscriptionsDeleteInputSchema = z.object({
	uuid: z.string(),
});

// Activity Log
const ActivityLogListInputSchema = z.object({
	organization: z.string(),
	sort: z.string().optional(),
	count: z.number().optional(),
	page_token: z.string().optional(),
	min_occurred_at: z.string().optional(),
	max_occurred_at: z.string().optional(),
	search_term: z.string().optional(),
});

const ActivityLogListOutgoingCommunicationsInputSchema = z.object({
	organization: z.string(),
	count: z.number().optional(),
	page_token: z.string().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

// Scheduled Events
const ScheduledEventsGetResponseSchema = z.object({
	resource: ScheduledEventSchema,
});

const ScheduledEventsListResponseSchema = z.object({
	collection: z.array(ScheduledEventSchema),
	pagination: PaginationSchema,
});

const ScheduledEventsCancelResponseSchema = z.object({
	resource: z
		.object({
			canceled_by: z.string().optional(),
			canceler_type: z.string().optional(),
			reason: z.string().optional(),
		})
		.passthrough(),
});

// 204 No Content — empty body
const ScheduledEventsDeleteDataResponseSchema = z.unknown();

// Event Types
const EventTypesGetResponseSchema = z.object({
	resource: EventTypeSchema,
});

const EventTypesListResponseSchema = z.object({
	collection: z.array(EventTypeSchema),
	pagination: PaginationSchema,
});

const EventTypesCreateResponseSchema = z.object({
	resource: EventTypeSchema,
});

const EventTypesCreateOneOffResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			scheduling_url: z.string(),
		})
		.passthrough(),
});

const EventTypesUpdateResponseSchema = z.object({
	resource: EventTypeSchema,
});

const EventTypesUpdateAvailabilityResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			user: z.string(),
			timezone: z.string(),
			// Availability rule objects vary in shape by type (wday, date, etc.); structure is not stable in the public API
			rules: z.array(z.record(z.unknown())).optional(),
		})
		.passthrough(),
});

const EventTypesListAvailableTimesResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				status: z.string(),
				invitees_remaining: z.number(),
				start_time: z.string(),
				scheduling_url: z.string(),
			})
			.passthrough(),
	),
});

const EventTypesListHostsResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				uri: z.string(),
				// field name varies by plan; may be user, user_membership_uri, or absent
				user: z.string().optional(),
				user_membership_uri: z.string().optional(),
			})
			.passthrough(),
	),
	pagination: PaginationSchema,
});

// Invitees
const InviteesGetResponseSchema = z.object({
	resource: InviteeSchema,
});

const InviteesListResponseSchema = z.object({
	collection: z.array(InviteeSchema),
	pagination: PaginationSchema,
});

const InviteesCreateResponseSchema = z.object({
	resource: InviteeSchema,
});

// 204 No Content — empty body
const InviteesDeleteDataResponseSchema = z.unknown();

const InviteesGetNoShowResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			invitee: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.passthrough(),
});

const InviteesMarkNoShowResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			invitee: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.passthrough(),
});

// 204 No Content — empty body
const InviteesDeleteNoShowResponseSchema = z.unknown();

// Users
const UsersGetResponseSchema = z.object({
	resource: UserSchema,
});

const UsersGetCurrentResponseSchema = z.object({
	resource: UserSchema,
});

const UsersGetAvailabilityScheduleResponseSchema = z.object({
	resource: AvailabilityScheduleSchema,
});

const UsersListAvailabilitySchedulesResponseSchema = z.object({
	collection: z.array(AvailabilityScheduleSchema),
});

const UsersListBusyTimesResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				type: z.string(),
				start_time: z.string(),
				end_time: z.string(),
				buffered_start_time: z.string().optional(),
				buffered_end_time: z.string().optional(),
				// event can be a nested object (event details) or a URI string
				event: z
					.union([z.string(), z.record(z.unknown())])
					.nullable()
					.optional(),
			})
			.passthrough(),
	),
});

const UsersListMeetingLocationsResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				kind: z.string(),
				additional_info: z.string().optional(),
				location: z.string().optional(),
			})
			.passthrough(),
	),
});

const UsersListEventTypesResponseSchema = z.object({
	collection: z.array(EventTypeSchema),
	pagination: PaginationSchema,
});

// Organizations
const OrganizationsGetResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			stage: z.string().optional(),
			billing_email: z.string().optional(),
			plan: z.string().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		})
		.passthrough(),
});

const OrganizationsGetInvitationResponseSchema = z.object({
	resource: OrganizationInvitationSchema,
});

const OrganizationsGetMembershipResponseSchema = z.object({
	resource: OrganizationMembershipSchema,
});

const OrganizationsListInvitationsResponseSchema = z.object({
	collection: z.array(OrganizationInvitationSchema),
	pagination: PaginationSchema,
});

const OrganizationsListMembershipsResponseSchema = z.object({
	collection: z.array(OrganizationMembershipSchema),
	pagination: PaginationSchema,
});

// 204 No Content — empty body
const OrganizationsDeleteMembershipResponseSchema = z.unknown();

const OrganizationsInviteResponseSchema = z.object({
	resource: OrganizationInvitationSchema,
});

// 204 No Content — empty body
const OrganizationsRemoveMemberResponseSchema = z.unknown();

// 204 No Content — empty body
const OrganizationsRevokeInvitationResponseSchema = z.unknown();

// Groups
const GroupsGetResponseSchema = z.object({
	resource: GroupSchema,
});

const GroupsGetRelationshipResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			type: z.string(),
			group: z.string(),
			user_or_event_type: z.string().optional(),
			managed_event_types: z.array(z.string()).optional(),
		})
		.passthrough(),
});

const GroupsListResponseSchema = z.object({
	collection: z.array(GroupSchema),
	pagination: PaginationSchema,
});

const GroupsListRelationshipsResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				uri: z.string(),
				type: z.string(),
				group: z.string(),
			})
			.passthrough(),
	),
	pagination: PaginationSchema,
});

// Routing Forms
const RoutingFormsGetResponseSchema = z.object({
	resource: RoutingFormSchema,
});

const RoutingFormsGetSubmissionResponseSchema = z.object({
	resource: z
		.object({
			uri: z.string(),
			routing_form: z.string(),
			// Each Q&A entry differs by question type; no fixed schema in Calendly's docs
			questions_and_answers: z.array(z.record(z.unknown())).optional(),
			// UTM/source tracking fields vary by integration and campaign
			tracking: z.record(z.unknown()).optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			// Routing result structure depends on the form's routing rules configuration
			result: z.record(z.unknown()).optional(),
		})
		.passthrough(),
});

const RoutingFormsListResponseSchema = z.object({
	collection: z.array(RoutingFormSchema),
	pagination: PaginationSchema,
});

const RoutingFormsGetSampleWebhookDataResponseSchema = z.object({
	// Sample webhook body mirrors live webhook payloads, which are open-ended by event type
	body: z.record(z.unknown()),
});

// Scheduling Links
const SchedulingLinksCreateResponseSchema = z.object({
	resource: z
		.object({
			booking_url: z.string(),
			owner: z.string(),
			owner_type: z.string(),
		})
		.passthrough(),
});

const SchedulingLinksCreateSingleUseResponseSchema = z.object({
	resource: z
		.object({
			booking_url: z.string(),
			owner: z.string(),
			owner_type: z.string(),
		})
		.passthrough(),
});

const SchedulingLinksCreateShareResponseSchema = z.object({
	resource: z
		.object({
			// shares endpoint response shape varies; fields are optional
			booking_url: z.string().optional(),
			created_at: z.string().optional(),
			last_booking_at: z.string().nullable().optional(),
			event_type: z.string().optional(),
		})
		.passthrough(),
});

// Webhook Subscriptions
const WebhookSubscriptionsCreateResponseSchema = z.object({
	resource: WebhookSubscriptionSchema,
});

const WebhookSubscriptionsGetResponseSchema = z.object({
	resource: WebhookSubscriptionSchema,
});

const WebhookSubscriptionsListResponseSchema = z.object({
	collection: z.array(WebhookSubscriptionSchema),
	pagination: PaginationSchema,
});

// 204 No Content — empty body
const WebhookSubscriptionsDeleteResponseSchema = z.unknown();

// Activity Log
const ActivityLogListResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				uri: z.string().optional(),
				action: z.string(),
				// Actor shape varies by actor type (user, system, API key, etc.)
				actor: z.record(z.unknown()),
				// Details are action-specific; each action type has a different payload shape
				details: z.record(z.unknown()),
				organization: z.string(),
				occurred_at: z.string(),
				namespace: z.string().optional(),
			})
			.passthrough(),
	),
	pagination: PaginationSchema,
});

const ActivityLogListOutgoingCommunicationsResponseSchema = z.object({
	collection: z.array(
		z
			.object({
				uri: z.string().optional(),
				channel: z.string().optional(),
				sent_at: z.string().optional(),
				status: z.string().optional(),
				to: z.string().optional(),
			})
			.passthrough(),
	),
	pagination: PaginationSchema,
});

// ── Input/Output Schema Maps ──────────────────────────────────────────────────

export const CalendlyEndpointInputSchemas = {
	scheduledEventsGet: ScheduledEventsGetInputSchema,
	scheduledEventsList: ScheduledEventsListInputSchema,
	scheduledEventsCancel: ScheduledEventsCancelInputSchema,
	scheduledEventsDeleteData: ScheduledEventsDeleteDataInputSchema,
	eventTypesGet: EventTypesGetInputSchema,
	eventTypesList: EventTypesListInputSchema,
	eventTypesCreate: EventTypesCreateInputSchema,
	eventTypesCreateOneOff: EventTypesCreateOneOffInputSchema,
	eventTypesUpdate: EventTypesUpdateInputSchema,
	eventTypesUpdateAvailability: EventTypesUpdateAvailabilityInputSchema,
	eventTypesListAvailableTimes: EventTypesListAvailableTimesInputSchema,
	eventTypesListHosts: EventTypesListHostsInputSchema,
	inviteesGet: InviteesGetInputSchema,
	inviteesList: InviteesListInputSchema,
	inviteesCreate: InviteesCreateInputSchema,
	inviteesDeleteData: InviteesDeleteDataInputSchema,
	inviteesGetNoShow: InviteesGetNoShowInputSchema,
	inviteesMarkNoShow: InviteesMarkNoShowInputSchema,
	inviteesDeleteNoShow: InviteesDeleteNoShowInputSchema,
	usersGet: UsersGetInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersGetAvailabilitySchedule: UsersGetAvailabilityScheduleInputSchema,
	usersListAvailabilitySchedules: UsersListAvailabilitySchedulesInputSchema,
	usersListBusyTimes: UsersListBusyTimesInputSchema,
	usersListMeetingLocations: UsersListMeetingLocationsInputSchema,
	usersListEventTypes: UsersListEventTypesInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsGetInvitation: OrganizationsGetInvitationInputSchema,
	organizationsGetMembership: OrganizationsGetMembershipInputSchema,
	organizationsListInvitations: OrganizationsListInvitationsInputSchema,
	organizationsListMemberships: OrganizationsListMembershipsInputSchema,
	organizationsDeleteMembership: OrganizationsDeleteMembershipInputSchema,
	organizationsInvite: OrganizationsInviteInputSchema,
	organizationsRemoveMember: OrganizationsRemoveMemberInputSchema,
	organizationsRevokeInvitation: OrganizationsRevokeInvitationInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsGetRelationship: GroupsGetRelationshipInputSchema,
	groupsList: GroupsListInputSchema,
	groupsListRelationships: GroupsListRelationshipsInputSchema,
	routingFormsGet: RoutingFormsGetInputSchema,
	routingFormsGetSubmission: RoutingFormsGetSubmissionInputSchema,
	routingFormsList: RoutingFormsListInputSchema,
	routingFormsGetSampleWebhookData: RoutingFormsGetSampleWebhookDataInputSchema,
	schedulingLinksCreate: SchedulingLinksCreateInputSchema,
	schedulingLinksCreateSingleUse: SchedulingLinksCreateSingleUseInputSchema,
	schedulingLinksCreateShare: SchedulingLinksCreateShareInputSchema,
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateInputSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetInputSchema,
	webhookSubscriptionsList: WebhookSubscriptionsListInputSchema,
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteInputSchema,
	activityLogList: ActivityLogListInputSchema,
	activityLogListOutgoingCommunications:
		ActivityLogListOutgoingCommunicationsInputSchema,
} as const;

export type CalendlyEndpointInputs = {
	[K in keyof typeof CalendlyEndpointInputSchemas]: z.infer<
		(typeof CalendlyEndpointInputSchemas)[K]
	>;
};

export const CalendlyEndpointOutputSchemas = {
	scheduledEventsGet: ScheduledEventsGetResponseSchema,
	scheduledEventsList: ScheduledEventsListResponseSchema,
	scheduledEventsCancel: ScheduledEventsCancelResponseSchema,
	scheduledEventsDeleteData: ScheduledEventsDeleteDataResponseSchema,
	eventTypesGet: EventTypesGetResponseSchema,
	eventTypesList: EventTypesListResponseSchema,
	eventTypesCreate: EventTypesCreateResponseSchema,
	eventTypesCreateOneOff: EventTypesCreateOneOffResponseSchema,
	eventTypesUpdate: EventTypesUpdateResponseSchema,
	eventTypesUpdateAvailability: EventTypesUpdateAvailabilityResponseSchema,
	eventTypesListAvailableTimes: EventTypesListAvailableTimesResponseSchema,
	eventTypesListHosts: EventTypesListHostsResponseSchema,
	inviteesGet: InviteesGetResponseSchema,
	inviteesList: InviteesListResponseSchema,
	inviteesCreate: InviteesCreateResponseSchema,
	inviteesDeleteData: InviteesDeleteDataResponseSchema,
	inviteesGetNoShow: InviteesGetNoShowResponseSchema,
	inviteesMarkNoShow: InviteesMarkNoShowResponseSchema,
	inviteesDeleteNoShow: InviteesDeleteNoShowResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersGetCurrent: UsersGetCurrentResponseSchema,
	usersGetAvailabilitySchedule: UsersGetAvailabilityScheduleResponseSchema,
	usersListAvailabilitySchedules: UsersListAvailabilitySchedulesResponseSchema,
	usersListBusyTimes: UsersListBusyTimesResponseSchema,
	usersListMeetingLocations: UsersListMeetingLocationsResponseSchema,
	usersListEventTypes: UsersListEventTypesResponseSchema,
	organizationsGet: OrganizationsGetResponseSchema,
	organizationsGetInvitation: OrganizationsGetInvitationResponseSchema,
	organizationsGetMembership: OrganizationsGetMembershipResponseSchema,
	organizationsListInvitations: OrganizationsListInvitationsResponseSchema,
	organizationsListMemberships: OrganizationsListMembershipsResponseSchema,
	organizationsDeleteMembership: OrganizationsDeleteMembershipResponseSchema,
	organizationsInvite: OrganizationsInviteResponseSchema,
	organizationsRemoveMember: OrganizationsRemoveMemberResponseSchema,
	organizationsRevokeInvitation: OrganizationsRevokeInvitationResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	groupsGetRelationship: GroupsGetRelationshipResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsListRelationships: GroupsListRelationshipsResponseSchema,
	routingFormsGet: RoutingFormsGetResponseSchema,
	routingFormsGetSubmission: RoutingFormsGetSubmissionResponseSchema,
	routingFormsList: RoutingFormsListResponseSchema,
	routingFormsGetSampleWebhookData:
		RoutingFormsGetSampleWebhookDataResponseSchema,
	schedulingLinksCreate: SchedulingLinksCreateResponseSchema,
	schedulingLinksCreateSingleUse: SchedulingLinksCreateSingleUseResponseSchema,
	schedulingLinksCreateShare: SchedulingLinksCreateShareResponseSchema,
	webhookSubscriptionsCreate: WebhookSubscriptionsCreateResponseSchema,
	webhookSubscriptionsGet: WebhookSubscriptionsGetResponseSchema,
	webhookSubscriptionsList: WebhookSubscriptionsListResponseSchema,
	webhookSubscriptionsDelete: WebhookSubscriptionsDeleteResponseSchema,
	activityLogList: ActivityLogListResponseSchema,
	activityLogListOutgoingCommunications:
		ActivityLogListOutgoingCommunicationsResponseSchema,
} as const;

export type CalendlyEndpointOutputs = {
	[K in keyof typeof CalendlyEndpointOutputSchemas]: z.infer<
		(typeof CalendlyEndpointOutputSchemas)[K]
	>;
};

// Named response type exports
export type ScheduledEventsGetResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.scheduledEventsGet
>;
export type ScheduledEventsListResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.scheduledEventsList
>;
export type EventTypesGetResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.eventTypesGet
>;
export type EventTypesListResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.eventTypesList
>;
export type EventTypesCreateResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.eventTypesCreate
>;
export type EventTypesUpdateResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.eventTypesUpdate
>;
export type InviteesGetResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.inviteesGet
>;
export type InviteesListResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.inviteesList
>;
export type InviteesCreateResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.inviteesCreate
>;
export type UsersGetResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.usersGet
>;
export type UsersGetCurrentResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.usersGetCurrent
>;
export type WebhookSubscriptionsCreateResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.webhookSubscriptionsCreate
>;
export type WebhookSubscriptionsListResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.webhookSubscriptionsList
>;
export type OrganizationsListMembershipsResponse = z.infer<
	typeof CalendlyEndpointOutputSchemas.organizationsListMemberships
>;
