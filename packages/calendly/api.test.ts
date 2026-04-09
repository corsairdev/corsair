import 'dotenv/config';
import { makeCalendlyRequest } from './client';
import type {
	EventTypesCreateResponse,
	EventTypesGetResponse,
	EventTypesListResponse,
	EventTypesUpdateResponse,
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
import { CalendlyEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.CALENDLY_API_KEY!;

// Resolved once in beforeAll and reused across all tests
let userUri: string;
let userUuid: string;
let orgUri: string;
let orgUuid: string;

// Resolved from fetched data — may be undefined if account has none
let eventTypeUri: string | undefined;
let eventTypeUuid: string | undefined;
let scheduledEventUri: string | undefined;
let scheduledEventUuid: string | undefined;
let activeScheduledEventUuid: string | undefined; // active event for cancel test
let activeInviteeUri: string | undefined; // invitee on the active event
let membershipUuid: string | undefined;
let availabilityScheduleUuid: string | undefined;
let pastInviteeUri: string | undefined;

// Created during tests — tracked for cleanup
let createdEventTypeUuid: string | undefined;
let createdWebhookUuid: string | undefined;
let createdNoShowUri: string | undefined;
let createdOrgInvitationUuid: string | undefined;

beforeAll(async () => {
	// Fetch current user
	const me = await makeCalendlyRequest<UsersGetCurrentResponse>(
		'users/me',
		TEST_TOKEN,
		{ method: 'GET' },
	);
	userUri = me.resource.uri;
	// URI always ends with the UUID segment
	userUuid = userUri.split('/').at(-1)!;
	orgUri = me.resource.current_organization!;
	orgUuid = orgUri.split('/').at(-1)!;

	const now = new Date();
	// Strip milliseconds for Calendly's strict ISO 8601 format
	const nowISO = now.toISOString().replace(/\.\d{3}Z$/, 'Z');

	// Fetch first event type
	const eventTypesList = await makeCalendlyRequest<EventTypesListResponse>(
		'event_types',
		TEST_TOKEN,
		{ method: 'GET', query: { user: userUri, count: 1 } },
	);
	if (eventTypesList.collection.length > 0) {
		eventTypeUri = eventTypesList.collection[0]!.uri;
		eventTypeUuid = eventTypeUri.split('/').at(-1)!;
	}

	// Fetch any scheduled event for read-only get test
	const scheduledEventsList =
		await makeCalendlyRequest<ScheduledEventsListResponse>(
			'scheduled_events',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri, count: 1 } },
		);
	if (scheduledEventsList.collection.length > 0) {
		scheduledEventUri = scheduledEventsList.collection[0]!.uri;
		scheduledEventUuid = scheduledEventUri.split('/').at(-1)!;
	}

	// Find the first active upcoming event that has at least one invitee.
	// Calendly's REST API does not expose a booking endpoint — scheduled events
	// can only be created through the scheduling URL UI. These tests therefore
	// require at least one booked event on the account.
	// To (re-)enable cancel / invitees tests: open the account's scheduling URL,
	// book a meeting, then re-run the tests.
	const activeEvents = await makeCalendlyRequest<ScheduledEventsListResponse>(
		'scheduled_events',
		TEST_TOKEN,
		{ method: 'GET', query: { user: userUri, status: 'active', count: 10 } },
	);
	for (const evt of activeEvents.collection) {
		const evtUuid = evt.uri.split('/').at(-1)!;
		const invs = await makeCalendlyRequest<InviteesListResponse>(
			`scheduled_events/${evtUuid}/invitees`,
			TEST_TOKEN,
			{ method: 'GET', query: { count: 1 } },
		);
		if (invs.collection.length > 0) {
			activeScheduledEventUuid = evtUuid;
			activeInviteeUri = invs.collection[0]!.uri;
			break;
		}
	}

	// Fetch first membership
	const memberships =
		await makeCalendlyRequest<OrganizationsListMembershipsResponse>(
			'organization_memberships',
			TEST_TOKEN,
			{ method: 'GET', query: { organization: orgUri, count: 1 } },
		);
	if (memberships.collection.length > 0) {
		membershipUuid = memberships.collection[0]!.uri.split('/').at(-1)!;
	}

	// Fetch first availability schedule
	const schedules = await makeCalendlyRequest(
		'user_availability_schedules',
		TEST_TOKEN,
		{ method: 'GET', query: { user: userUri } },
	);
	// any: Calendly availability schedule list has no strongly typed collection key in all plan levels
	const schedulesTyped = schedules as { collection: { uri: string }[] };
	if (schedulesTyped.collection?.length > 0) {
		availabilityScheduleUuid =
			schedulesTyped.collection[0]!.uri.split('/').at(-1)!;
	}

	// Find a past event's invitee for the no-show lifecycle test
	const pastEvents = await makeCalendlyRequest<ScheduledEventsListResponse>(
		'scheduled_events',
		TEST_TOKEN,
		{
			method: 'GET',
			query: { user: userUri, count: 20, max_start_time: nowISO },
		},
	);
	for (const evt of pastEvents.collection) {
		const evtUuid = evt.uri.split('/').at(-1)!;
		const invs = await makeCalendlyRequest<InviteesListResponse>(
			`scheduled_events/${evtUuid}/invitees`,
			TEST_TOKEN,
			{ method: 'GET', query: { count: 1 } },
		);
		if (invs.collection.length > 0) {
			pastInviteeUri = invs.collection[0]!.uri;
			break;
		}
	}
});

afterAll(async () => {
	// Best-effort cleanup of resources created during beforeAll / tests
	if (activeScheduledEventUuid) {
		try {
			await makeCalendlyRequest(
				`scheduled_events/${activeScheduledEventUuid}/cancellation`,
				TEST_TOKEN,
				{ method: 'POST', body: { reason: 'Cleanup after api.test.ts' } },
			);
		} catch {
			/* already canceled by the cancel test — ignore */
		}
	}
	if (createdWebhookUuid) {
		try {
			await makeCalendlyRequest(
				`webhook_subscriptions/${createdWebhookUuid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
		} catch {
			/* best-effort */
		}
	}
	if (createdNoShowUri) {
		try {
			const uuid = createdNoShowUri.split('/').at(-1)!;
			await makeCalendlyRequest(`invitee_no_shows/${uuid}`, TEST_TOKEN, {
				method: 'DELETE',
			});
		} catch {
			/* best-effort */
		}
	}
	if (createdOrgInvitationUuid) {
		try {
			await makeCalendlyRequest(
				`organizations/${orgUuid}/invitations/${createdOrgInvitationUuid}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);
		} catch {
			/* best-effort */
		}
	}
});

// ── Users ─────────────────────────────────────────────────────────────────────

describe('users', () => {
	it('usersGetCurrent returns correct type', async () => {
		const response = await makeCalendlyRequest<UsersGetCurrentResponse>(
			'users/me',
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.usersGetCurrent.parse(response);
		expect(response.resource.uri).toContain('users/');
		expect(response.resource.email).toBeDefined();
	});

	it('usersGet returns correct type', async () => {
		const response = await makeCalendlyRequest<UsersGetResponse>(
			`users/${userUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.usersGet.parse(response);
		expect(response.resource.uri).toBe(userUri);
	});

	it('usersListAvailabilitySchedules returns correct type', async () => {
		const response = await makeCalendlyRequest(
			'user_availability_schedules',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri } },
		);

		CalendlyEndpointOutputSchemas.usersListAvailabilitySchedules.parse(
			response,
		);
	});

	it('usersGetAvailabilitySchedule returns correct type', async () => {
		if (!availabilityScheduleUuid) {
			console.warn('No availability schedules — skipping');
			return;
		}

		const response = await makeCalendlyRequest(
			`user_availability_schedules/${availabilityScheduleUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.usersGetAvailabilitySchedule.parse(response);
	});

	it('usersListBusyTimes returns correct type', async () => {
		const now = new Date();
		// strip milliseconds — Calendly requires clean ISO 8601; window must be ≤ 7 days
		const start = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
		const future = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
		const end = future.toISOString().replace(/\.\d{3}Z$/, 'Z');

		const response = await makeCalendlyRequest('user_busy_times', TEST_TOKEN, {
			method: 'GET',
			query: { user: userUri, start_time: start, end_time: end },
		});

		CalendlyEndpointOutputSchemas.usersListBusyTimes.parse(response);
	});

	// user_meeting_locations endpoint is not available on standard/free Calendly plans
	it.skip('usersListMeetingLocations returns correct type', async () => {
		const response = await makeCalendlyRequest(
			'user_meeting_locations',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri } },
		);
		CalendlyEndpointOutputSchemas.usersListMeetingLocations.parse(response);
	});

	it('usersListEventTypes returns correct type', async () => {
		const response = await makeCalendlyRequest<EventTypesListResponse>(
			'event_types',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri, count: 10 } },
		);

		CalendlyEndpointOutputSchemas.usersListEventTypes.parse(response);
		expect(Array.isArray(response.collection)).toBe(true);
	});
});

// ── Event Types ───────────────────────────────────────────────────────────────

describe('eventTypes', () => {
	it('eventTypesList returns correct type', async () => {
		const response = await makeCalendlyRequest<EventTypesListResponse>(
			'event_types',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri, count: 10 } },
		);

		CalendlyEndpointOutputSchemas.eventTypesList.parse(response);
		expect(Array.isArray(response.collection)).toBe(true);
	});

	it('eventTypesGet returns correct type', async () => {
		if (!eventTypeUuid) {
			console.warn('No event types — skipping');
			return;
		}

		const response = await makeCalendlyRequest<EventTypesGetResponse>(
			`event_types/${eventTypeUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.eventTypesGet.parse(response);
		expect(response.resource.uri).toBe(eventTypeUri);
	});

	// POST /event_types requires Teams plan and is not available on standard/free accounts
	it.skip('eventTypesCreate and eventTypesUpdate returns correct type', async () => {
		const createResponse = await makeCalendlyRequest<EventTypesCreateResponse>(
			'event_types',
			TEST_TOKEN,
			{
				method: 'POST',
				body: {
					name: `Test Event ${Date.now()}`,
					host: userUri,
					duration: 30,
					timezone: 'UTC',
					date_setting: { type: 'rolling', rolling_period_days: 60 },
					description_plain: 'Created by api.test.ts',
					color: '#4d5055',
					kind: 'solo',
				},
			},
		);

		CalendlyEndpointOutputSchemas.eventTypesCreate.parse(createResponse);
		expect(createResponse.resource.name).toContain('Test Event');
		createdEventTypeUuid = createResponse.resource.uri.split('/').at(-1)!;

		const updateResponse = await makeCalendlyRequest<EventTypesUpdateResponse>(
			`event_types/${createdEventTypeUuid}`,
			TEST_TOKEN,
			{
				method: 'PATCH',
				body: { description_plain: 'Updated by api.test.ts' },
			},
		);

		CalendlyEndpointOutputSchemas.eventTypesUpdate.parse(updateResponse);
		expect(updateResponse.resource.description_plain).toBe(
			'Updated by api.test.ts',
		);
	});

	it('eventTypesCreateOneOff returns correct type', async () => {
		const now = new Date();
		const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const response = await makeCalendlyRequest(
			'one_off_event_types',
			TEST_TOKEN,
			{
				method: 'POST',
				body: {
					name: `One-Off Test ${Date.now()}`,
					host: userUri,
					duration: 30,
					timezone: 'UTC',
					date_setting: {
						type: 'date_range',
						start_date: now.toISOString().split('T')[0],
						end_date: future.toISOString().split('T')[0],
					},
				},
			},
		);

		CalendlyEndpointOutputSchemas.eventTypesCreateOneOff.parse(response);
	});

	it.skip('eventTypesListAvailableTimes returns correct type', async () => {
		const now = new Date();
		const start = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
		const end = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
			.toISOString()
			.replace(/\.\d{3}Z$/, 'Z');

		const response = await makeCalendlyRequest(
			'event_type_available_times',
			TEST_TOKEN,
			{
				method: 'GET',
				query: { event_type: eventTypeUri!, start_time: start, end_time: end },
			},
		);
		CalendlyEndpointOutputSchemas.eventTypesListAvailableTimes.parse(response);
	});

	it('eventTypesListHosts returns correct type', async () => {
		if (!eventTypeUri) {
			console.warn('No event types — skipping list hosts test');
			return;
		}

		const response = await makeCalendlyRequest(
			'event_type_memberships',
			TEST_TOKEN,
			{ method: 'GET', query: { event_type: eventTypeUri } },
		);

		CalendlyEndpointOutputSchemas.eventTypesListHosts.parse(response);
	});
});

// ── Scheduled Events ──────────────────────────────────────────────────────────

describe('scheduledEvents', () => {
	it('scheduledEventsList returns correct type', async () => {
		const response = await makeCalendlyRequest<ScheduledEventsListResponse>(
			'scheduled_events',
			TEST_TOKEN,
			{ method: 'GET', query: { user: userUri, count: 10 } },
		);

		CalendlyEndpointOutputSchemas.scheduledEventsList.parse(response);
		expect(Array.isArray(response.collection)).toBe(true);
	});

	it('scheduledEventsGet returns correct type', async () => {
		if (!scheduledEventUuid) {
			console.warn('No scheduled events — skipping get test');
			return;
		}

		const response = await makeCalendlyRequest<ScheduledEventsGetResponse>(
			`scheduled_events/${scheduledEventUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.scheduledEventsGet.parse(response);
		expect(response.resource.uri).toBe(scheduledEventUri);
	});

	it('scheduledEventsCancel cancels an active event', async () => {
		// activeScheduledEventUuid is booked fresh in beforeAll on every run
		if (!activeScheduledEventUuid) {
			console.warn('No active scheduled event — skipping cancel test');
			return;
		}

		const response = await makeCalendlyRequest(
			`scheduled_events/${activeScheduledEventUuid}/cancellation`,
			TEST_TOKEN,
			{
				method: 'POST',
				body: { reason: 'Canceled by api.test.ts automated test' },
			},
		);

		CalendlyEndpointOutputSchemas.scheduledEventsCancel.parse(response);
	});
});

// ── Invitees ──────────────────────────────────────────────────────────────────

describe('invitees', () => {
	it('inviteesList returns correct type', async () => {
		if (!activeScheduledEventUuid) {
			console.warn('No active scheduled events — skipping invitees list test');
			return;
		}

		const response = await makeCalendlyRequest<InviteesListResponse>(
			`scheduled_events/${activeScheduledEventUuid}/invitees`,
			TEST_TOKEN,
			{ method: 'GET', query: { count: 10 } },
		);

		CalendlyEndpointOutputSchemas.inviteesList.parse(response);
		expect(Array.isArray(response.collection)).toBe(true);
	});

	it('inviteesGet returns correct type', async () => {
		if (!activeScheduledEventUuid || !activeInviteeUri) {
			console.warn('No active invitee — skipping invitee get test');
			return;
		}

		// URI always ends with the UUID segment
		const inviteeUuid = activeInviteeUri.split('/').at(-1)!;

		const response = await makeCalendlyRequest<InviteesGetResponse>(
			`scheduled_events/${activeScheduledEventUuid}/invitees/${inviteeUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.inviteesGet.parse(response);
		expect(response.resource.email).toBeDefined();
	});

	it('inviteesMarkNoShow and inviteesGetNoShow and inviteesDeleteNoShow', async () => {
		if (!pastInviteeUri) {
			console.warn('No past invitees found — skipping no-show lifecycle test');
			return;
		}

		// Mark as no-show (requires event to have already occurred)
		const markResponse = await makeCalendlyRequest(
			'invitee_no_shows',
			TEST_TOKEN,
			{ method: 'POST', body: { invitee: pastInviteeUri } },
		);

		CalendlyEndpointOutputSchemas.inviteesMarkNoShow.parse(markResponse);
		// any: no_show resource has a uri field
		const noShowUri = (markResponse as { resource: { uri: string } }).resource
			.uri;
		createdNoShowUri = noShowUri;
		const noShowUuid = noShowUri.split('/').at(-1)!;

		// Get no-show record
		const getResponse = await makeCalendlyRequest(
			`invitee_no_shows/${noShowUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);
		CalendlyEndpointOutputSchemas.inviteesGetNoShow.parse(getResponse);

		// Delete no-show record — returns 204 No Content
		await makeCalendlyRequest(`invitee_no_shows/${noShowUuid}`, TEST_TOKEN, {
			method: 'DELETE',
		});
		createdNoShowUri = undefined; // cleaned up, skip afterAll
	});
});

// ── Organizations ─────────────────────────────────────────────────────────────

describe('organizations', () => {
	it('organizationsGet returns correct type', async () => {
		const response = await makeCalendlyRequest(
			`organizations/${orgUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.organizationsGet.parse(response);
	});

	it('organizationsListMemberships returns correct type', async () => {
		const response =
			await makeCalendlyRequest<OrganizationsListMembershipsResponse>(
				'organization_memberships',
				TEST_TOKEN,
				{ method: 'GET', query: { organization: orgUri, count: 10 } },
			);

		CalendlyEndpointOutputSchemas.organizationsListMemberships.parse(response);
		expect(Array.isArray(response.collection)).toBe(true);
	});

	it('organizationsGetMembership returns correct type', async () => {
		if (!membershipUuid) {
			console.warn('No memberships — skipping get test');
			return;
		}

		const response = await makeCalendlyRequest(
			`organization_memberships/${membershipUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.organizationsGetMembership.parse(response);
	});

	it('organizationsInvite and organizationsListInvitations and organizationsGetInvitation and organizationsRevokeInvitation', async () => {
		// Send invite
		const inviteResponse = await makeCalendlyRequest(
			`organizations/${orgUuid}/invitations`,
			TEST_TOKEN,
			{
				method: 'POST',
				body: { email: `test+${Date.now()}@example.com` },
			},
		);

		CalendlyEndpointOutputSchemas.organizationsInvite.parse(inviteResponse);
		// any: invitation resource has uri
		const invUri = (inviteResponse as { resource: { uri: string } }).resource
			.uri;
		createdOrgInvitationUuid = invUri.split('/').at(-1)!;

		// List invitations
		const listResponse = await makeCalendlyRequest(
			`organizations/${orgUuid}/invitations`,
			TEST_TOKEN,
			{ method: 'GET', query: { count: 10 } },
		);

		CalendlyEndpointOutputSchemas.organizationsListInvitations.parse(
			listResponse,
		);

		// Get single invitation
		const getResponse = await makeCalendlyRequest(
			`organizations/${orgUuid}/invitations/${createdOrgInvitationUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.organizationsGetInvitation.parse(getResponse);

		// Revoke it — returns 204 No Content
		await makeCalendlyRequest(
			`organizations/${orgUuid}/invitations/${createdOrgInvitationUuid}`,
			TEST_TOKEN,
			{ method: 'DELETE' },
		);
		createdOrgInvitationUuid = undefined; // cleaned up, skip afterAll
	});
});

// ── Groups ────────────────────────────────────────────────────────────────────

describe('groups', () => {
	it('groupsList returns correct type', async () => {
		const response = await makeCalendlyRequest('groups', TEST_TOKEN, {
			method: 'GET',
			query: { organization: orgUri, count: 10 },
		});

		CalendlyEndpointOutputSchemas.groupsList.parse(response);
	});

	it('groupsGet returns correct type', async () => {
		const listResponse = await makeCalendlyRequest('groups', TEST_TOKEN, {
			method: 'GET',
			query: { organization: orgUri, count: 1 },
		});

		// any: groups collection array
		const groups = (listResponse as { collection: { uri: string }[] })
			.collection;
		if (!groups?.length) {
			console.warn('No groups — skipping get test');
			return;
		}

		const groupUuid = groups[0]!.uri.split('/').at(-1)!;
		const response = await makeCalendlyRequest(
			`groups/${groupUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.groupsGet.parse(response);
	});

	it('groupsListRelationships returns correct type', async () => {
		const listResponse = await makeCalendlyRequest('groups', TEST_TOKEN, {
			method: 'GET',
			query: { organization: orgUri, count: 1 },
		});

		// any: groups collection array
		const groups = (listResponse as { collection: { uri: string }[] })
			.collection;
		if (!groups?.length) {
			console.warn('No groups — skipping relationships test');
			return;
		}

		const groupUri = groups[0]!.uri;
		const response = await makeCalendlyRequest(
			'group_relationships',
			TEST_TOKEN,
			{ method: 'GET', query: { group: groupUri, count: 10 } },
		);

		CalendlyEndpointOutputSchemas.groupsListRelationships.parse(response);
	});

	it('groupsGetRelationship returns correct type', async () => {
		const listResponse = await makeCalendlyRequest('groups', TEST_TOKEN, {
			method: 'GET',
			query: { organization: orgUri, count: 1 },
		});

		// any: groups collection array
		const groups = (listResponse as { collection: { uri: string }[] })
			.collection;
		if (!groups?.length) {
			console.warn('No groups — skipping relationship get test');
			return;
		}

		const groupUri = groups[0]!.uri;
		const relResponse = await makeCalendlyRequest(
			'group_relationships',
			TEST_TOKEN,
			{ method: 'GET', query: { group: groupUri, count: 1 } },
		);

		// any: group relationships collection array
		const rels = (relResponse as { collection: { uri: string }[] }).collection;
		if (!rels?.length) {
			console.warn('No group relationships — skipping');
			return;
		}

		const relUuid = rels[0]!.uri.split('/').at(-1)!;
		const response = await makeCalendlyRequest(
			`group_relationships/${relUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.groupsGetRelationship.parse(response);
	});
});

// ── Routing Forms ─────────────────────────────────────────────────────────────

describe('routingForms', () => {
	it('routingFormsList returns correct type', async () => {
		const response = await makeCalendlyRequest('routing_forms', TEST_TOKEN, {
			method: 'GET',
			query: { organization: orgUri, count: 10 },
		});

		CalendlyEndpointOutputSchemas.routingFormsList.parse(response);
	});

	it('routingFormsGet returns correct type', async () => {
		const listResponse = await makeCalendlyRequest(
			'routing_forms',
			TEST_TOKEN,
			{ method: 'GET', query: { organization: orgUri, count: 1 } },
		);

		// any: routing_forms collection array
		const forms = (listResponse as { collection: { uri: string }[] })
			.collection;
		if (!forms?.length) {
			console.warn('No routing forms — skipping get test');
			return;
		}

		const formUuid = forms[0]!.uri.split('/').at(-1)!;
		const response = await makeCalendlyRequest(
			`routing_forms/${formUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);

		CalendlyEndpointOutputSchemas.routingFormsGet.parse(response);
	});

	// sample_webhook_data endpoint requires a paid plan with routing forms enabled
	it.skip('routingFormsGetSampleWebhookData returns correct type', async () => {
		const response = await makeCalendlyRequest(
			'sample_webhook_data',
			TEST_TOKEN,
			{
				method: 'GET',
				query: {
					organization: orgUri,
					scope: 'organization',
					event: 'invitee.created',
				},
			},
		);
		CalendlyEndpointOutputSchemas.routingFormsGetSampleWebhookData.parse(
			response,
		);
	});
});

// ── Scheduling Links ──────────────────────────────────────────────────────────

describe('schedulingLinks', () => {
	it('schedulingLinksCreate returns correct type', async () => {
		if (!eventTypeUri) {
			console.warn('No event types — skipping scheduling link create test');
			return;
		}

		const response = await makeCalendlyRequest('scheduling_links', TEST_TOKEN, {
			method: 'POST',
			body: {
				max_event_count: 1,
				owner: eventTypeUri,
				owner_type: 'EventType',
			},
		});

		CalendlyEndpointOutputSchemas.schedulingLinksCreate.parse(response);
		// any: booking_url is in resource
		expect(
			(response as { resource: { booking_url: string } }).resource.booking_url,
		).toBeDefined();
	});

	it('schedulingLinksCreateSingleUse returns correct type', async () => {
		if (!eventTypeUri) {
			console.warn('No event types — skipping single-use scheduling link test');
			return;
		}

		const response = await makeCalendlyRequest('scheduling_links', TEST_TOKEN, {
			method: 'POST',
			body: {
				max_event_count: 1,
				owner: eventTypeUri,
				owner_type: 'EventType',
			},
		});

		CalendlyEndpointOutputSchemas.schedulingLinksCreateSingleUse.parse(
			response,
		);
	});

	it('schedulingLinksCreateShare returns correct type', async () => {
		if (!eventTypeUri) {
			console.warn('No event types — skipping create share test');
			return;
		}

		const response = await makeCalendlyRequest('shares', TEST_TOKEN, {
			method: 'POST',
			body: { event_type: eventTypeUri },
		});

		CalendlyEndpointOutputSchemas.schedulingLinksCreateShare.parse(response);
	});
});

// ── Webhook Subscriptions ─────────────────────────────────────────────────────

describe('webhookSubscriptions', () => {
	it('webhookSubscriptionsCreate, get, list, delete lifecycle', async () => {
		// Create
		const createResponse =
			await makeCalendlyRequest<WebhookSubscriptionsCreateResponse>(
				'webhook_subscriptions',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						url: process.env.CALENDLY_WEBHOOK_URL,
						events: ['invitee.created', 'invitee.cancelled'],
						organization: orgUri,
						scope: 'organization',
						signature_secret: 'test-secret',
					},
				},
			);

		CalendlyEndpointOutputSchemas.webhookSubscriptionsCreate.parse(
			createResponse,
		);
		expect(createResponse.resource.callback_url).toBe(
			process.env.CALENDLY_WEBHOOK_URL,
		);
		createdWebhookUuid = createResponse.resource.uri.split('/').at(-1)!;

		// Get
		const getResponse = await makeCalendlyRequest(
			`webhook_subscriptions/${createdWebhookUuid}`,
			TEST_TOKEN,
			{ method: 'GET' },
		);
		CalendlyEndpointOutputSchemas.webhookSubscriptionsGet.parse(getResponse);
		// any: getResponse is untyped generic result
		expect((getResponse as { resource: { uri: string } }).resource.uri).toBe(
			createResponse.resource.uri,
		);

		// List
		const listResponse =
			await makeCalendlyRequest<WebhookSubscriptionsListResponse>(
				'webhook_subscriptions',
				TEST_TOKEN,
				{
					method: 'GET',
					query: { organization: orgUri, scope: 'organization' },
				},
			);

		CalendlyEndpointOutputSchemas.webhookSubscriptionsList.parse(listResponse);
		expect(listResponse.collection.length).toBeGreaterThan(0);

		// Delete — returns 204 No Content
		await makeCalendlyRequest(
			`webhook_subscriptions/${createdWebhookUuid}`,
			TEST_TOKEN,
			{ method: 'DELETE' },
		);
		createdWebhookUuid = undefined; // cleaned up, skip afterAll
	});
});

// ── Activity Log ──────────────────────────────────────────────────────────────

describe('activityLog', () => {
	// activity_log_entries requires Enterprise plan
	it.skip('activityLogList returns correct type', async () => {
		const response = await makeCalendlyRequest(
			'activity_log_entries',
			TEST_TOKEN,
			{ method: 'GET', query: { organization: orgUri, count: 10 } },
		);
		CalendlyEndpointOutputSchemas.activityLogList.parse(response);
	});

	// outgoing communications endpoint not available on standard plans
	it.skip('activityLogListOutgoingCommunications returns correct type', async () => {
		const response = await makeCalendlyRequest(
			'scheduled_event_notifications',
			TEST_TOKEN,
			{ method: 'GET', query: { organization: orgUri, count: 10 } },
		);
		CalendlyEndpointOutputSchemas.activityLogListOutgoingCommunications.parse(
			response,
		);
	});
});

// ── Scheduled Events Data Compliance ─────────────────────────────────────────

describe('dataCompliance', () => {
	// data_compliance/deletion endpoint requires Enterprise plan
	it.skip('scheduledEventsDeleteData returns correct type', async () => {
		// Use a far-past date range with no events to avoid deleting real data
		await makeCalendlyRequest(
			'data_compliance/deletion/scheduled_events',
			TEST_TOKEN,
			{
				method: 'POST',
				body: {
					start_time: '2020-01-01T00:00:00Z',
					end_time: '2020-01-02T00:00:00Z',
				},
			},
		);
		// 204 No Content — no body to parse
	});
});
