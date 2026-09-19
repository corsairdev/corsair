/**
 * Covers every operation: the method and path it calls, what it writes to the local
 * mirror, what it evicts, and exactly what reaches the event log.
 *
 * Three sweeps make this hard to leave incomplete:
 *
 * - **Coverage** asserts the operations exercised here are precisely the operations
 *   registered, so an operation cannot be added without a test.
 * - **Privacy** runs every operation against a response poisoned with a secret, an email
 *   address, a name and a metadata value, and asserts none of them reaches the event log.
 *   A per-operation assertion would only cover the operations someone remembered.
 * - **Retry safety** asserts every name in the non-idempotent set is a registered
 *   operation, so an entry cannot outlive or precede the endpoint it describes.
 *
 * All ids and values are fictional.
 */
import { readFileSync } from 'node:fs';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Collaborators,
	DataDeletions,
	DataRequests,
	Errors,
	EventFields,
	Events,
	FeatureFlags,
	Integrations,
	Organizations,
	Pivots,
	Projects,
	Releases,
	SavedSearches,
	Teams,
	Trends,
} from './endpoints';
import { BugsnagMirrorEvictionError } from './endpoints/persist';
import { buildQuery, withQuery } from './endpoints/shared';
import {
	errorHandlers,
	isNonIdempotent,
	isPaginationLimit,
	isRouteMissing,
	NON_IDEMPOTENT_OPERATIONS,
} from './error-handlers';
import { bugsnagEndpointMeta } from './index';

// The event-log payload is asserted directly further down: it is the one place
// caller-supplied text or a secret could leak into durable storage, so it needs to
// be inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const BASE = 'https://api.bugsnag.com';
const ORG = 'organization-1';
const PROJECT = 'project-1';
const COLLABORATOR = 'collaborator-1';
const TEAM = 'team-1';
const ERROR_ID = 'error-1';
const SEARCH = 'saved-search-1';
const INTEGRATION = 'configured-integration-1';
const REQUEST_ID = 'data-request-1';
const DELETION_ID = 'data-deletion-1';

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

const makeStore = (): Store => ({
	upsertByEntityId: jest.fn(async () => undefined),
	deleteByEntityId: jest.fn(async () => true),
});

type Ctx = Parameters<typeof Organizations.list>[0];

function makeCtx() {
	const db = {
		organizations: makeStore(),
		projects: makeStore(),
		collaborators: makeStore(),
		teams: makeStore(),
	};
	const ctx = { key: 'test-token', db } as unknown as Ctx;
	return { ctx, db };
}

let captured: { url: string; method: string; body?: string } | undefined;

/** The real `fetch`, restored after the suite so no stub leaks into another file. */
const originalFetch = global.fetch;

afterAll(() => {
	global.fetch = originalFetch;
});

/** Answers every request with `payload`, recording what was asked for. */
function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

/* ------------------------------ canned records ---------------------------- */

const organization = {
	id: ORG,
	name: 'Example Org',
	slug: 'example-org',
	api_key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	billing_emails: ['billing@example.com'],
	creator: {
		id: COLLABORATOR,
		name: 'Test Tester',
		email: 'tester@example.com',
	},
};
const project = {
	id: PROJECT,
	organization_id: ORG,
	name: 'Example App',
	type: 'android',
	api_key: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
	upload_api_key: 'cccccccccccccccccccccccccccccccc',
};
const collaborator = {
	id: COLLABORATOR,
	name: 'Test Tester',
	email: 'tester@example.com',
	project_ids: [PROJECT],
};
const team = {
	id: TEAM,
	name: 'Example Team',
	collaborator_count: 1,
	project_count: 1,
};
const errorRecord = {
	id: ERROR_ID,
	project_id: PROJECT,
	error_class: 'ExampleError',
	message: 'something a user typed',
	status: 'open',
	events: 3,
};
const eventRecord = {
	id: 'event-1',
	error_id: ERROR_ID,
	received_at: '2026-08-14T00:00:00.000Z',
	user: { id: 'user-1', name: 'Test Tester', email: 'tester@example.com' },
};
const eventField = {
	display_id: 'metaData.example.field',
	custom: true,
	path: 'metaData.example.field',
	filter_options: { name: 'Example', match_types: ['eq'] },
};
const pivot = {
	event_field_display_id: 'error',
	name: 'Errors',
	cardinality: 3,
};
const pivotValue = { event_field_value: 'user-1', events: 1, proportion: 0.33 };
const release = { id: 'release-1', project_id: PROJECT, app_version: '1.4.0' };
const releaseGroup = {
	id: 'release-group-1',
	project_id: PROJECT,
	release_stage_name: 'production',
};
const savedSearch = {
	id: SEARCH,
	project_id: PROJECT,
	name: 'Open errors',
	filters: { 'error.status': [{ type: 'eq', value: 'open' }] },
};
const usageSummary = {
	project_notifications_count: 0,
	collaborator_email_notifications_count: 0,
	performance_monitor_count: 0,
};
const trendBucket = {
	from: '2026-08-13T00:00:00Z',
	to: '2026-08-14T00:00:00Z',
	events_count: 3,
};
const supportedIntegration = { key: 'slack', name: 'Slack', type: 'chat' };
const configuredIntegration = {
	id: INTEGRATION,
	integration_key: 'slack',
	project_id: PROJECT,
};
const projectAccess = {
	project_summary: { id: PROJECT, name: 'Example App' },
	is_admin: true,
	project_role: 'project_owner',
};
const projectAccessCount = {
	collaborator_id: COLLABORATOR,
	project_count: 1,
	is_admin: true,
};
const networkGrouping = { project_id: PROJECT, endpoints: [] };
const dataRequest = { id: REQUEST_ID, status: 'PREPARING' };
const dataDeletion = { id: DELETION_ID, status: 'AWAITING_CONFIRMATION' };
const featureFlag = { name: 'new-checkout', active: true };
const featureFlagSummary = { name: 'new-checkout', error_count: 0 };

/** A filter used wherever an operation accepts one. */
const FILTERS = { 'error.status': [{ type: 'eq', value: 'open' }] };

/** Every registered operation with the request it is expected to make. */
const OPERATIONS: Array<
	[
		op: string,
		method: string,
		path: string,
		run: (ctx: Ctx) => Promise<unknown>,
		payload: unknown,
	]
> = [
	/* ------------------------------ organizations ---------------------------- */
	[
		'organizations.list',
		'GET',
		'user/organizations',
		(c) => Organizations.list(c, {}),
		[organization],
	],
	[
		'organizations.get',
		'GET',
		`organizations/${ORG}`,
		(c) => Organizations.get(c, { organization_id: ORG }),
		organization,
	],
	[
		'organizations.delete',
		'DELETE',
		`organizations/${ORG}`,
		(c) => Organizations.remove(c, { organization_id: ORG }),
		{},
	],

	/* --------------------------------- projects ------------------------------ */
	[
		'projects.list',
		'GET',
		`organizations/${ORG}/projects`,
		(c) => Projects.list(c, { organization_id: ORG }),
		[project],
	],
	[
		'projects.get',
		'GET',
		`projects/${PROJECT}`,
		(c) => Projects.get(c, { project_id: PROJECT }),
		project,
	],
	[
		'projects.create',
		'POST',
		`organizations/${ORG}/projects`,
		(c) =>
			Projects.create(c, {
				organization_id: ORG,
				name: 'Example App',
				type: 'android',
			}),
		project,
	],
	[
		'projects.delete',
		'DELETE',
		`projects/${PROJECT}`,
		(c) => Projects.remove(c, { project_id: PROJECT }),
		{},
	],
	[
		'projects.regenerateApiKey',
		'DELETE',
		`projects/${PROJECT}/api_key`,
		(c) => Projects.regenerateApiKey(c, { project_id: PROJECT }),
		project,
	],
	[
		'projects.networkGroupingRuleset',
		'GET',
		`projects/${PROJECT}/network_endpoint_grouping`,
		(c) => Projects.networkGroupingRuleset(c, { project_id: PROJECT }),
		networkGrouping,
	],

	/* ------------------------------ collaborators ---------------------------- */
	[
		'collaborators.list',
		'GET',
		`organizations/${ORG}/collaborators`,
		(c) => Collaborators.list(c, { organization_id: ORG }),
		[collaborator],
	],
	[
		'collaborators.get',
		'GET',
		`organizations/${ORG}/collaborators/${COLLABORATOR}`,
		(c) =>
			Collaborators.get(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		collaborator,
	],
	[
		'collaborators.invite',
		'POST',
		`organizations/${ORG}/collaborators`,
		(c) =>
			Collaborators.invite(c, {
				organization_id: ORG,
				email: 'invitee@example.com',
			}),
		collaborator,
	],
	[
		'collaborators.updatePermissions',
		'PATCH',
		`organizations/${ORG}/collaborators/${COLLABORATOR}`,
		(c) =>
			Collaborators.updatePermissions(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
				admin: true,
			}),
		collaborator,
	],
	[
		'collaborators.delete',
		'DELETE',
		`organizations/${ORG}/collaborators/${COLLABORATOR}`,
		(c) =>
			Collaborators.remove(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		{},
	],
	[
		'collaborators.listOnProject',
		'GET',
		`projects/${PROJECT}/collaborators`,
		(c) => Collaborators.listOnProject(c, { project_id: PROJECT }),
		[collaborator],
	],
	[
		'collaborators.getOnProject',
		'GET',
		`projects/${PROJECT}/collaborators/${COLLABORATOR}`,
		(c) =>
			Collaborators.getOnProject(c, {
				project_id: PROJECT,
				collaborator_id: COLLABORATOR,
			}),
		collaborator,
	],
	[
		'collaborators.listProjects',
		'GET',
		`organizations/${ORG}/collaborators/${COLLABORATOR}/projects`,
		(c) =>
			Collaborators.listProjects(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		[project],
	],
	[
		'collaborators.projectAccessCounts',
		'GET',
		`organizations/${ORG}/collaborators/project_access_counts`,
		(c) =>
			Collaborators.projectAccessCounts(c, {
				organization_id: ORG,
				collaborator_ids: [COLLABORATOR],
			}),
		[projectAccessCount],
	],
	[
		'collaborators.listProjectAccesses',
		'GET',
		`organizations/${ORG}/collaborators/${COLLABORATOR}/project_accesses`,
		(c) =>
			Collaborators.listProjectAccesses(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		[projectAccess],
	],
	[
		'collaborators.getProjectAccess',
		'GET',
		`organizations/${ORG}/collaborators/${COLLABORATOR}/project_accesses/${PROJECT}`,
		(c) =>
			Collaborators.getProjectAccess(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
				project_id: PROJECT,
			}),
		projectAccess,
	],

	/* ---------------------------------- teams -------------------------------- */
	[
		'teams.list',
		'GET',
		`organizations/${ORG}/teams`,
		(c) => Teams.list(c, { organization_id: ORG }),
		[team],
	],
	[
		'teams.create',
		'POST',
		`organizations/${ORG}/teams`,
		(c) => Teams.create(c, { organization_id: ORG, name: 'Example Team' }),
		team,
	],
	[
		'teams.get',
		'GET',
		`organizations/${ORG}/teams/${TEAM}`,
		(c) => Teams.get(c, { organization_id: ORG, team_id: TEAM }),
		team,
	],
	[
		'teams.delete',
		'DELETE',
		`organizations/${ORG}/teams/${TEAM}`,
		(c) => Teams.remove(c, { organization_id: ORG, team_id: TEAM }),
		{},
	],
	[
		'teams.addMembers',
		'POST',
		`organizations/${ORG}/teams/${TEAM}/team_memberships`,
		(c) =>
			Teams.addMembers(c, {
				organization_id: ORG,
				team_id: TEAM,
				collaborator_ids: [COLLABORATOR],
			}),
		team,
	],
	[
		'teams.addCollaboratorMemberships',
		'POST',
		`organizations/${ORG}/collaborators/${COLLABORATOR}/team_memberships`,
		(c) =>
			Teams.addCollaboratorMemberships(c, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
				team_ids: [TEAM],
			}),
		collaborator,
	],

	/* --------------------------------- errors -------------------------------- */
	[
		'errors.list',
		'GET',
		`projects/${PROJECT}/errors`,
		(c) => Errors.list(c, { project_id: PROJECT, filters: FILTERS }),
		[errorRecord],
	],
	[
		'errors.bulkUpdate',
		'PATCH',
		`projects/${PROJECT}/errors`,
		(c) =>
			Errors.bulkUpdate(c, {
				project_id: PROJECT,
				error_ids: [ERROR_ID],
				operation: 'fix',
			}),
		{ operation: 'fix' },
	],
	[
		'errors.deleteAll',
		'DELETE',
		`projects/${PROJECT}/errors`,
		(c) => Errors.deleteAll(c, { project_id: PROJECT }),
		{},
	],

	/* --------------------------------- events -------------------------------- */
	[
		'events.list',
		'GET',
		`projects/${PROJECT}/events`,
		(c) => Events.list(c, { project_id: PROJECT }),
		[eventRecord],
	],
	[
		'events.listForError',
		'GET',
		`projects/${PROJECT}/errors/${ERROR_ID}/events`,
		(c) => Events.listForError(c, { project_id: PROJECT, error_id: ERROR_ID }),
		[eventRecord],
	],

	/* ------------------------------- event fields ---------------------------- */
	[
		'eventFields.list',
		'GET',
		`projects/${PROJECT}/event_fields`,
		(c) => EventFields.list(c, { project_id: PROJECT }),
		[eventField],
	],
	[
		'eventFields.create',
		'POST',
		`projects/${PROJECT}/event_fields`,
		(c) =>
			EventFields.create(c, {
				project_id: PROJECT,
				path: 'metaData.example.field',
				filter_options: { name: 'Example', match_types: ['eq'] },
			}),
		eventField,
	],
	[
		'eventFields.delete',
		'DELETE',
		`projects/${PROJECT}/event_fields/metaData.example.field`,
		(c) =>
			EventFields.remove(c, {
				project_id: PROJECT,
				display_id: 'metaData.example.field',
			}),
		{},
	],

	/* --------------------------------- pivots -------------------------------- */
	[
		'pivots.list',
		'GET',
		`projects/${PROJECT}/pivots`,
		(c) => Pivots.list(c, { project_id: PROJECT }),
		[pivot],
	],
	[
		'pivots.values',
		'GET',
		`projects/${PROJECT}/pivots/error/values`,
		(c) =>
			Pivots.values(c, {
				project_id: PROJECT,
				event_field_display_id: 'error',
			}),
		[pivotValue],
	],

	/* -------------------------------- releases ------------------------------- */
	[
		'releases.list',
		'GET',
		`projects/${PROJECT}/releases`,
		(c) => Releases.list(c, { project_id: PROJECT }),
		[release],
	],
	[
		'releases.listGroups',
		'GET',
		`projects/${PROJECT}/release_groups`,
		(c) =>
			Releases.listGroups(c, {
				project_id: PROJECT,
				release_stage_name: 'production',
			}),
		[releaseGroup],
	],

	/* ----------------------------- saved searches ---------------------------- */
	[
		'savedSearches.list',
		'GET',
		`projects/${PROJECT}/saved_searches`,
		(c) => SavedSearches.list(c, { project_id: PROJECT }),
		[savedSearch],
	],
	[
		'savedSearches.create',
		'POST',
		'saved_searches',
		(c) =>
			SavedSearches.create(c, {
				project_id: PROJECT,
				name: 'Open errors',
				filters: FILTERS,
			}),
		savedSearch,
	],
	[
		'savedSearches.get',
		'GET',
		`saved_searches/${SEARCH}`,
		(c) => SavedSearches.get(c, { saved_search_id: SEARCH }),
		savedSearch,
	],
	[
		'savedSearches.delete',
		'DELETE',
		`saved_searches/${SEARCH}`,
		(c) => SavedSearches.remove(c, { saved_search_id: SEARCH }),
		{},
	],
	[
		'savedSearches.usageSummary',
		'GET',
		`saved_searches/${SEARCH}/usage_summary`,
		(c) => SavedSearches.usageSummary(c, { saved_search_id: SEARCH }),
		usageSummary,
	],

	/* --------------------------------- trends -------------------------------- */
	[
		'trends.projectBuckets',
		'GET',
		`projects/${PROJECT}/trend`,
		(c) => Trends.projectBuckets(c, { project_id: PROJECT, buckets_count: 3 }),
		[trendBucket],
	],

	/* ------------------------------ integrations ----------------------------- */
	[
		'integrations.listSupported',
		'GET',
		'integrations',
		(c) => Integrations.listSupported(c, {}),
		[supportedIntegration],
	],
	[
		'integrations.listConfigured',
		'GET',
		`projects/${PROJECT}/configured_integrations`,
		(c) => Integrations.listConfigured(c, { project_id: PROJECT }),
		[configuredIntegration],
	],
	[
		'integrations.configure',
		'POST',
		`projects/${PROJECT}/configured_integrations`,
		(c) =>
			Integrations.configure(c, {
				project_id: PROJECT,
				integration_key: 'slack',
				configuration: { webhook: 'https://example.com/hook' },
			}),
		configuredIntegration,
	],
	[
		'integrations.getConfigured',
		'GET',
		`configured_integrations/${INTEGRATION}`,
		(c) => Integrations.getConfigured(c, { integration_id: INTEGRATION }),
		configuredIntegration,
	],
	[
		'integrations.deleteConfigured',
		'DELETE',
		`configured_integrations/${INTEGRATION}`,
		(c) => Integrations.deleteConfigured(c, { integration_id: INTEGRATION }),
		{},
	],
	[
		'integrations.test',
		'POST',
		'integrations/test',
		(c) =>
			Integrations.test(c, {
				key: 'slack',
				configuration: { webhook: 'https://example.com/hook' },
			}),
		{ success: true },
	],

	/* ----------------------------- GDPR requests ----------------------------- */
	[
		'dataRequests.createForOrganization',
		'POST',
		`organizations/${ORG}/event_data_requests`,
		(c) =>
			DataRequests.createForOrganization(c, {
				organization_id: ORG,
				filters: FILTERS,
			}),
		dataRequest,
	],
	[
		'dataRequests.getForOrganization',
		'GET',
		`organizations/${ORG}/event_data_requests/${REQUEST_ID}`,
		(c) =>
			DataRequests.getForOrganization(c, {
				organization_id: ORG,
				request_id: REQUEST_ID,
			}),
		dataRequest,
	],
	[
		'dataRequests.createForProject',
		'POST',
		`projects/${PROJECT}/event_data_requests`,
		(c) =>
			DataRequests.createForProject(c, {
				project_id: PROJECT,
				filters: FILTERS,
			}),
		dataRequest,
	],
	[
		'dataRequests.getForProject',
		'GET',
		`projects/${PROJECT}/event_data_requests/${REQUEST_ID}`,
		(c) =>
			DataRequests.getForProject(c, {
				project_id: PROJECT,
				request_id: REQUEST_ID,
			}),
		dataRequest,
	],

	/* ---------------------------- GDPR deletions ----------------------------- */
	[
		'dataDeletions.createForOrganization',
		'POST',
		`organizations/${ORG}/event_data_deletions`,
		(c) =>
			DataDeletions.createForOrganization(c, {
				organization_id: ORG,
				filters: FILTERS,
			}),
		dataDeletion,
	],
	[
		'dataDeletions.getForOrganization',
		'GET',
		`organizations/${ORG}/event_data_deletions/${DELETION_ID}`,
		(c) =>
			DataDeletions.getForOrganization(c, {
				organization_id: ORG,
				deletion_id: DELETION_ID,
			}),
		dataDeletion,
	],
	[
		'dataDeletions.createForProject',
		'POST',
		`projects/${PROJECT}/event_data_deletions`,
		(c) =>
			DataDeletions.createForProject(c, {
				project_id: PROJECT,
				filters: FILTERS,
			}),
		dataDeletion,
	],
	[
		'dataDeletions.getForProject',
		'GET',
		`projects/${PROJECT}/event_data_deletions/${DELETION_ID}`,
		(c) =>
			DataDeletions.getForProject(c, {
				project_id: PROJECT,
				deletion_id: DELETION_ID,
			}),
		dataDeletion,
	],
	[
		'dataDeletions.confirmForProject',
		'POST',
		`projects/${PROJECT}/event_data_deletions/${DELETION_ID}/confirm`,
		(c) =>
			DataDeletions.confirmForProject(c, {
				project_id: PROJECT,
				deletion_id: DELETION_ID,
			}),
		dataDeletion,
	],

	/* ------------------------------ feature flags ---------------------------- */
	[
		'featureFlags.list',
		'GET',
		`projects/${PROJECT}/feature_flags`,
		(c) =>
			FeatureFlags.list(c, {
				project_id: PROJECT,
				release_stage_name: 'production',
			}),
		[featureFlag],
	],
	[
		'featureFlags.listSummaries',
		'GET',
		`projects/${PROJECT}/feature_flag_summaries`,
		(c) => FeatureFlags.listSummaries(c, { project_id: PROJECT }),
		[featureFlagSummary],
	],
];

/**
 * The number of endpoints the plugin registers: the catalog's 60 operations plus
 * `projects.get`, which is not a catalog operation.
 *
 * Declared once rather than repeated, so a deliberate change to the surface has to be made
 * in a single place and the assertions cannot disagree with each other.
 */
const EXPECTED_ENDPOINTS = 61;
const EXPECTED_CATALOG_OPERATIONS = 60;

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('routing', () => {
	for (const [op, method, path, run, payload] of OPERATIONS) {
		it(`${op} calls ${method} ${path}`, async () => {
			mockFetch(payload);
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.method).toBe(method);
			// `encodeURI` is applied to the path by the transport, so a dotted display
			// id survives unchanged while a query string stays separated by `?`.
			const actual = decodeURIComponent(captured?.url ?? '');
			expect(actual.startsWith(`${BASE}/${path}`)).toBe(true);
		});
	}

	/**
	 * Organizations are reached relative to the token's owner. There is no way to
	 * list organizations globally, so the path is asserted rather than assumed.
	 */
	it('lists organizations relative to the token owner', async () => {
		mockFetch([organization]);
		const { ctx } = makeCtx();

		await Organizations.list(ctx, {});

		expect(captured?.url).toBe(`${BASE}/user/organizations`);
		expect(captured?.url).not.toContain('/organizations?');
	});

	/**
	 * The paths that recon had wrong. Each was corrected against a live account, and
	 * each is pinned here because the wrong version failed in a way that looked like
	 * something else - a resource-missing 404 or a 400 about an absent id, rather than
	 * an obvious route error.
	 */
	it('uses the corrected paths rather than the plausible wrong ones', async () => {
		// Each operation is pinned to its **exact** expected path, keyed by operation name.
		//
		// Two earlier versions of this test were weaker in different ways, and both are
		// worth recording. The first asserted that a path did not contain a wrong
		// substring - but `memberships` is a substring of the correct `team_memberships`,
		// so the assertion could never hold. The second fixed that by comparing whole
		// segments, which could pass while a path had regressed to something else
		// entirely: "does not contain the one wrong spelling I thought of" is a much
		// weaker claim than "is exactly this". Only the exact form fails on any
		// regression.
		const CORRECTED: Record<string, string> = {
			'teams.addMembers': `organizations/${ORG}/teams/${TEAM}/team_memberships`,
			'teams.addCollaboratorMemberships': `organizations/${ORG}/collaborators/${COLLABORATOR}/team_memberships`,
			'collaborators.listProjectAccesses': `organizations/${ORG}/collaborators/${COLLABORATOR}/project_accesses`,
			'collaborators.getProjectAccess': `organizations/${ORG}/collaborators/${COLLABORATOR}/project_accesses/${PROJECT}`,
			'featureFlags.listSummaries': `projects/${PROJECT}/feature_flag_summaries`,
			'projects.networkGroupingRuleset': `projects/${PROJECT}/network_endpoint_grouping`,
			'savedSearches.create': 'saved_searches',
			'savedSearches.get': `saved_searches/${SEARCH}`,
			'savedSearches.delete': `saved_searches/${SEARCH}`,
			'savedSearches.usageSummary': `saved_searches/${SEARCH}/usage_summary`,
			'integrations.getConfigured': `configured_integrations/${INTEGRATION}`,
			'integrations.deleteConfigured': `configured_integrations/${INTEGRATION}`,
			'integrations.test': 'integrations/test',
		};

		for (const [op, expectedPath] of Object.entries(CORRECTED)) {
			const entry = OPERATIONS.find(([name]) => name === op);

			// Without this, a renamed or removed operation would make the loop body skip
			// silently rather than fail.
			expect(entry).toBeDefined();
			expect(entry?.[2]).toBe(expectedPath);
		}

		// And every corrected operation is actually registered, so this table cannot
		// drift into describing operations that no longer exist.
		for (const op of Object.keys(CORRECTED)) {
			expect(Object.keys(bugsnagEndpointMeta)).toContain(op);
		}

		// And the saved-search writes are top-level, not nested under the project.
		const topLevel = OPERATIONS.filter(([op]) =>
			[
				'savedSearches.create',
				'savedSearches.get',
				'savedSearches.delete',
				'savedSearches.usageSummary',
			].includes(op),
		);
		expect(topLevel).toHaveLength(4);
		for (const [, , path] of topLevel) {
			expect(path.startsWith('saved_searches')).toBe(true);
			expect(path).not.toContain('projects/');
		}
	});
});

describe('coverage', () => {
	it('exercises every registered operation and no others', () => {
		const exercised = OPERATIONS.map(([op]) => op).sort();
		const registered = Object.keys(bugsnagEndpointMeta).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(EXPECTED_ENDPOINTS);
	});

	it('has no duplicate entries in the routing table', () => {
		const ops = OPERATIONS.map(([op]) => op);
		expect(new Set(ops).size).toBe(ops.length);
	});

	it('assigns every operation a risk level and a description', () => {
		const entries = Object.entries(bugsnagEndpointMeta);

		expect(entries).toHaveLength(EXPECTED_ENDPOINTS);
		for (const [op, meta] of entries) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(0);
			expect(op).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});
});

describe('risk levels', () => {
	const meta = Object.entries(bugsnagEndpointMeta);

	/**
	 * Every irreversible operation, listed explicitly rather than inferred from the
	 * name. `projects.regenerateApiKey` deletes nothing yet stops every deployed
	 * notifier; `errors.bulkUpdate` can apply `delete` to an arbitrary batch. Neither
	 * would be caught by a rule about names ending in `.delete`.
	 */
	it('marks everything irreversible destructive', () => {
		const expected = [
			'organizations.delete',
			'projects.delete',
			'projects.regenerateApiKey',
			'collaborators.delete',
			'teams.delete',
			'errors.bulkUpdate',
			'errors.deleteAll',
			'eventFields.delete',
			'savedSearches.delete',
			'integrations.deleteConfigured',
			'dataDeletions.createForOrganization',
			'dataDeletions.createForProject',
			'dataDeletions.confirmForProject',
		];

		for (const op of expected) {
			expect(
				bugsnagEndpointMeta[op as keyof typeof bugsnagEndpointMeta].riskLevel,
			).toBe('destructive');
		}

		// The set is exactly these - so a new destructive operation has to be
		// considered here rather than added silently.
		const destructive = meta
			.filter(([, m]) => m.riskLevel === 'destructive')
			.map(([op]) => op)
			.sort();
		expect(destructive).toEqual([...expected].sort());
	});

	/**
	 * A GDPR export destroys nothing, but it gathers everything the account holds about
	 * an identified person and returns a download link. That is not a read.
	 */
	it('treats a data export as a write rather than a read', () => {
		expect(
			bugsnagEndpointMeta['dataRequests.createForOrganization'].riskLevel,
		).toBe('write');
		expect(bugsnagEndpointMeta['dataRequests.createForProject'].riskLevel).toBe(
			'write',
		);
		// Reading the status of one is a genuine read.
		expect(bugsnagEndpointMeta['dataRequests.getForProject'].riskLevel).toBe(
			'read',
		);
	});

	it('marks every GET read', () => {
		const gets = OPERATIONS.filter(([, method]) => method === 'GET');

		expect(gets.length).toBeGreaterThan(30);
		for (const [op] of gets) {
			expect(
				bugsnagEndpointMeta[op as keyof typeof bugsnagEndpointMeta].riskLevel,
			).toBe('read');
		}
	});
});

describe('retry safety', () => {
	/**
	 * The drift check the comment in `error-handlers.ts` promises. Without it a name in
	 * the set could refer to an endpoint that does not exist - which was true of
	 * `projects.regenerateApiKey` while the scaffold only had eight operations.
	 */
	it('names only registered operations in the non-idempotent set', () => {
		const registered = new Set(Object.keys(bugsnagEndpointMeta));

		expect(NON_IDEMPOTENT_OPERATIONS.size).toBeGreaterThan(0);
		for (const op of NON_IDEMPOTENT_OPERATIONS) {
			expect(registered.has(op)).toBe(true);
		}
	});

	it('treats every create as unsafe to replay', () => {
		for (const op of [
			'projects.create',
			'teams.create',
			'eventFields.create',
			'savedSearches.create',
			'integrations.configure',
		]) {
			expect(isNonIdempotent(op)).toBe(true);
		}
	});

	/**
	 * Deleting a named resource is safe to replay - the second attempt reports
	 * not-found, which `NOT_FOUND_ERROR` handles - so those are absent from the set.
	 */
	it('treats a delete of a named resource as safe to replay', () => {
		for (const op of [
			'projects.delete',
			'teams.delete',
			'collaborators.delete',
			'savedSearches.delete',
			'eventFields.delete',
		]) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	/**
	 * Two POSTs that are nonetheless safe to repeat, for stated reasons: re-inviting an
	 * existing address returns the existing collaborator, and testing a configuration
	 * creates nothing.
	 */
	it('treats the idempotent POSTs as safe to replay', () => {
		expect(isNonIdempotent('collaborators.invite')).toBe(false);
		expect(isNonIdempotent('integrations.test')).toBe(false);
		expect(isNonIdempotent('teams.addMembers')).toBe(false);
	});

	it('never marks a read unsafe to replay', () => {
		const reads = OPERATIONS.filter(([, method]) => method === 'GET').map(
			([op]) => op,
		);

		expect(reads.length).toBeGreaterThan(30);
		for (const op of reads) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	it('does not match an operation name it does not know', () => {
		expect(isNonIdempotent('projects.somethingElse')).toBe(false);
	});
});

describe('the two 404 shapes', () => {
	/**
	 * BugSnag returns `{"status":404,"error":"Not Found"}` when the route does not
	 * exist and `{"errors":["... not found"]}` when the route exists and the resource
	 * does not.
	 *
	 * The rule was confirmed live and is narrower than it first appears: a garbage
	 * **path parameter** still matches its route, so `projects/<garbage>` returns the
	 * resource-missing shape, while only a path matching no route at all returns
	 * route-absent. That distinction is what mapped the GDPR endpoints, and misreading
	 * it in the other direction is what produced two false "enterprise-only" verdicts.
	 */
	const apiError = (status: number, body: unknown) =>
		Object.assign(new ApiError({} as never, {} as never, 'boom'), {
			status,
			body,
		});

	it('recognises a missing route', () => {
		expect(
			isRouteMissing(apiError(404, { status: 404, error: 'Not Found' })),
		).toBe(true);
	});

	it('does not mistake a missing resource for a missing route', () => {
		expect(
			isRouteMissing(
				apiError(404, { errors: ['Event data deletion not found'] }),
			),
		).toBe(false);
	});

	it('reports neither for a non-404', () => {
		expect(isRouteMissing(apiError(500, { errors: ['boom'] }))).toBe(false);
		expect(isRouteMissing(new Error('plain error'))).toBe(false);
	});

	it('never retries either shape', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const context = { operation: 'projects.get' } as unknown as Parameters<
			typeof errorHandlers.NOT_FOUND_ERROR.handler
		>[1];

		const missingRoute = await errorHandlers.NOT_FOUND_ERROR.handler(
			apiError(404, { status: 404, error: 'Not Found' }),
			context,
		);
		const missingRecord = await errorHandlers.NOT_FOUND_ERROR.handler(
			apiError(404, { errors: ['not found'] }),
			context,
		);

		expect(missingRoute.maxRetries).toBe(0);
		expect(missingRecord.maxRetries).toBe(0);
		warn.mockRestore();
	});
});

describe('the deep-offset 422', () => {
	/**
	 * A 422 with code 60000 means the requested page is too deep to serve, not that the
	 * request was malformed. Distinguished because the remedy differs: narrow the query
	 * rather than correct it, and do not retry.
	 */
	const apiError = (status: number, body: unknown) =>
		Object.assign(new ApiError({} as never, {} as never, 'boom'), {
			status,
			body,
		});

	it('recognises the pagination limit', () => {
		expect(
			isPaginationLimit(
				apiError(422, {
					errors: ['Unable to return complete results'],
					code: 60000,
				}),
			),
		).toBe(true);
	});

	it('does not mistake an ordinary validation failure for it', () => {
		expect(
			isPaginationLimit(apiError(422, { errors: ["Name can't be blank"] })),
		).toBe(false);
		expect(isPaginationLimit(apiError(400, { code: 60000 }))).toBe(false);
		expect(isPaginationLimit(new Error('plain error'))).toBe(false);
	});

	it('explains the depth limit rather than reporting a bad request', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const context = { operation: 'errors.list' } as unknown as Parameters<
			typeof errorHandlers.VALIDATION_ERROR.handler
		>[1];

		const result = await errorHandlers.VALIDATION_ERROR.handler(
			apiError(422, {
				errors: ['Unable to return complete results'],
				code: 60000,
			}),
			context,
		);

		expect(result.maxRetries).toBe(0);
		const message = String(warn.mock.calls[0]?.[0]);
		expect(message).toContain('too deep');
		// The message the API suggests is a dead end with an offset, so the warning says
		// so rather than repeating advice that does not work.
		expect(message).toContain('sort=unsorted');
		warn.mockRestore();
	});
});

describe('query construction', () => {
	/**
	 * These assert the exact string, because the reason the plugin builds its own is
	 * that a *plausible* string is silently the wrong query. See `endpoints/shared.ts`.
	 */
	it('returns nothing when there is nothing to send', () => {
		expect(buildQuery({})).toBe('');
		expect(buildQuery({ per_page: undefined })).toBe('');
		expect(withQuery('projects/p/errors')).toBe('projects/p/errors');
	});

	it('brackets an array, because the bare repeated form is rejected', () => {
		const query = buildQuery({ collaborator_ids: ['a', 'b'] });

		expect(decodeURIComponent(query)).toBe(
			'?collaborator_ids[]=a&collaborator_ids[]=b',
		);
		// The bare form is what the shared transport would have produced, and the API
		// answers it with "Collaborator_ids must be an array".
		expect(decodeURIComponent(query)).not.toBe(
			'?collaborator_ids=a&collaborator_ids=b',
		);
	});

	it('keeps each filter comparison type/value pair adjacent', () => {
		const query = decodeURIComponent(
			buildQuery({}, { 'error.status': [{ type: 'eq', value: 'open' }] }),
		);

		expect(query).toBe(
			'?filters[error.status][][type]=eq&filters[error.status][][value]=open',
		);
	});

	/**
	 * The case that matters. Grouped keys - which is what a generic serialiser produces
	 * for an array of objects - are answered 400 by the API, and the flat form it
	 * produces instead resolves last-wins, silently meaning only the final comparison.
	 */
	it('pairs two comparisons on one field without grouping the keys', () => {
		const query = decodeURIComponent(
			buildQuery(
				{},
				{
					'error.status': [
						{ type: 'eq', value: 'open' },
						{ type: 'eq', value: 'fixed' },
					],
				},
			),
		);

		expect(query).toBe(
			'?filters[error.status][][type]=eq&filters[error.status][][value]=open' +
				'&filters[error.status][][type]=eq&filters[error.status][][value]=fixed',
		);
		// Grouped - type,type,value,value - is the form the API rejects.
		expect(query).not.toContain('[][type]=eq&filters[error.status][][type]=eq');
	});

	it('accepts a single comparison as well as an array', () => {
		const one = decodeURIComponent(
			buildQuery({}, { 'error.status': { type: 'eq', value: 'open' } }),
		);
		const asArray = decodeURIComponent(
			buildQuery({}, { 'error.status': [{ type: 'eq', value: 'open' }] }),
		);

		expect(one).toBe(asArray);
	});

	it('orders comparison keys deterministically so the string is assertable', () => {
		const query = decodeURIComponent(
			buildQuery({}, { 'user.email': { value: 'x', type: 'eq', extra: '1' } }),
		);

		expect(query).toBe(
			'?filters[user.email][][type]=eq&filters[user.email][][value]=x&filters[user.email][][extra]=1',
		);
	});

	it('percent-encodes keys and values', () => {
		expect(buildQuery({ q: 'a b&c' })).toBe('?q=a%20b%26c');
		expect(buildQuery({ collaborator_ids: ['a'] })).toContain('%5B%5D');
	});

	it('puts paging before filters', () => {
		const query = decodeURIComponent(
			buildQuery({ per_page: 10 }, { 'error.status': { type: 'eq' } }),
		);

		expect(query.indexOf('per_page')).toBeLessThan(query.indexOf('filters'));
	});
});

describe('caching', () => {
	it('mirrors a fetched project under its id', async () => {
		mockFetch(project);
		const { ctx, db } = makeCtx();

		await Projects.get(ctx, { project_id: PROJECT });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			PROJECT,
			expect.objectContaining({ id: PROJECT }),
		);
	});

	it('mirrors every row of a list response', async () => {
		mockFetch([project, { ...project, id: 'project-2' }]);
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('mirrors a team under its id', async () => {
		mockFetch(team);
		const { ctx, db } = makeCtx();

		await Teams.get(ctx, { organization_id: ORG, team_id: TEAM });

		expect(db.teams.upsertByEntityId).toHaveBeenCalledWith(
			TEAM,
			expect.objectContaining({ id: TEAM }),
		);
	});

	/**
	 * The collaborator's projects operation returns full project records, so they belong
	 * in the project mirror rather than the collaborator one.
	 */
	it("mirrors a collaborator's projects as projects", async () => {
		mockFetch([project]);
		const { ctx, db } = makeCtx();

		await Collaborators.listProjects(ctx, {
			organization_id: ORG,
			collaborator_id: COLLABORATOR,
		});

		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			PROJECT,
			expect.objectContaining({ id: PROJECT }),
		);
		expect(db.collaborators.upsertByEntityId).not.toHaveBeenCalled();
	});

	/**
	 * The membership operation returns the updated collaborator, not a team, despite
	 * living in the teams group. Asserted because the two membership operations look
	 * symmetrical and are not.
	 */
	it('mirrors a collaborator when team memberships are added to one', async () => {
		mockFetch(collaborator);
		const { ctx, db } = makeCtx();

		await Teams.addCollaboratorMemberships(ctx, {
			organization_id: ORG,
			collaborator_id: COLLABORATOR,
			team_ids: [TEAM],
		});

		expect(db.collaborators.upsertByEntityId).toHaveBeenCalledWith(
			COLLABORATOR,
			expect.objectContaining({ id: COLLABORATOR }),
		);
		expect(db.teams.upsertByEntityId).not.toHaveBeenCalled();
	});

	/**
	 * Rotation returns the whole project with the new key, so the row is refreshed
	 * rather than evicted - the project still exists.
	 */
	it('refreshes rather than evicts the project when the api key is rotated', async () => {
		mockFetch(project);
		const { ctx, db } = makeCtx();

		await Projects.regenerateApiKey(ctx, { project_id: PROJECT });

		expect(db.projects.upsertByEntityId).toHaveBeenCalledWith(
			PROJECT,
			expect.objectContaining({ id: PROJECT }),
		);
		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
	});

	/**
	 * Errors and events are not mirrored at all - the premise is a live stream, so a
	 * cached copy would be stale on arrival. There is no store for them, and none of the
	 * existing stores should receive their rows either.
	 */
	it('mirrors nothing when errors or events are read', async () => {
		mockFetch([errorRecord]);
		const { ctx, db } = makeCtx();
		await Errors.list(ctx, { project_id: PROJECT });

		mockFetch([eventRecord]);
		await Events.list(ctx, { project_id: PROJECT });

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});

	it('skips a row the entity schema rejects rather than storing it', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		// No id, so the schema cannot accept it.
		mockFetch([{ name: 'Nameless' }]);
		const { ctx, db } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(db.projects.upsertByEntityId).not.toHaveBeenCalled();
		// Silence would turn a schema gap into a row that simply never appears.
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('does not fail the call when a cache write throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch(project);
		const { ctx, db } = makeCtx();
		db.projects.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(
			Projects.get(ctx, { project_id: PROJECT }),
		).resolves.toMatchObject({ id: PROJECT });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('evicts the mirrored project on delete', async () => {
		mockFetch({});
		const { ctx, db } = makeCtx();

		await Projects.remove(ctx, { project_id: PROJECT });

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith(PROJECT);
	});

	/**
	 * A read must not evict. A project or collaborator dropping out of a list is
	 * usually a permissions change rather than a deletion, and the row still resolves
	 * ids that older errors reference.
	 */
	it('never evicts on a read', async () => {
		for (const [op, method, , run, payload] of OPERATIONS) {
			if (method !== 'GET') continue;
			mockFetch(payload);
			const { ctx, db } = makeCtx();

			await run(ctx);

			for (const [name, store] of Object.entries(db)) {
				if (store.deleteByEntityId.mock.calls.length > 0) {
					throw new Error(`${op} evicted from ${name} during a read`);
				}
			}
		}
	});

	/**
	 * The project eviction is best-effort: a project carries no personal data of its
	 * own, so a stale row is untidy rather than a privacy problem.
	 */
	it('does not fail the delete when a best-effort eviction throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch({});
		const { ctx, db } = makeCtx();
		db.projects.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(
			Projects.remove(ctx, { project_id: PROJECT }),
		).resolves.toMatchObject({ success: true });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	/**
	 * The collaborator and organization deletes are different: both rows hold personal
	 * data - a name and email address, and billing email addresses - so a failed
	 * eviction must not be reported as a success.
	 */
	it.each([
		[
			'collaborator',
			'collaborators' as const,
			(ctx: Ctx) =>
				Collaborators.remove(ctx, {
					organization_id: ORG,
					collaborator_id: COLLABORATOR,
				}),
		],
		[
			'organization',
			'organizations' as const,
			(ctx: Ctx) => Organizations.remove(ctx, { organization_id: ORG }),
		],
	])(
		'fails the %s delete when its required eviction fails',
		async (_label, storeName, run) => {
			const error = jest
				.spyOn(console, 'error')
				.mockImplementation(() => undefined);
			mockFetch({});
			const { ctx, db } = makeCtx();
			db[storeName].deleteByEntityId.mockRejectedValueOnce(
				new Error('db down'),
			);

			await expect(run(ctx)).rejects.toBeInstanceOf(BugsnagMirrorEvictionError);
			error.mockRestore();
		},
	);

	/**
	 * And the audit record must survive that failure, reporting what actually happened
	 * rather than being lost with the error. Logging `'completed'` before the eviction
	 * would claim a success that had not happened; letting the error propagate first
	 * would lose the record of a removal that did happen remotely.
	 */
	it('still records a failed eviction in the event log, as failed', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch({});
		const { ctx, db } = makeCtx();
		db.collaborators.deleteByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);

		await expect(
			Collaborators.remove(ctx, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		).rejects.toThrow();

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
			'bugsnag.collaborators.delete',
		);
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			mirror_evicted: false,
		});
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('failed');
		error.mockRestore();
	});

	it('records a successful eviction as completed', async () => {
		mockFetch({});
		const { ctx } = makeCtx();

		await Collaborators.remove(ctx, {
			organization_id: ORG,
			collaborator_id: COLLABORATOR,
		});

		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			mirror_evicted: true,
		});
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
	});

	it('exposes a typed error for a required eviction failure', () => {
		const error = new BugsnagMirrorEvictionError(
			'collaborator',
			COLLABORATOR,
			new Error('db down'),
		);

		expect(error.message).toContain('BugSnag removed the collaborator');
		expect(error.message).toContain('local mirror');
		expect(error.message).toContain('does not need repeating');
		expect(error.message).toContain('db down');
	});
});

describe('request bodies and queries', () => {
	it('omits unset fields rather than sending null', async () => {
		mockFetch(project);
		const { ctx } = makeCtx();

		await Projects.create(ctx, {
			organization_id: ORG,
			name: 'Example App',
			type: 'android',
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({ name: 'Example App', type: 'android' });
		// The organization id addresses the URL, so it must not also be in the body.
		expect('organization_id' in body).toBe(false);
	});

	it('passes offset paging through as query parameters', async () => {
		mockFetch([project]);
		const { ctx } = makeCtx();

		await Projects.list(ctx, {
			organization_id: ORG,
			per_page: 50,
			offset: 100,
		});

		expect(captured?.url).toContain('per_page=50');
		expect(captured?.url).toContain('offset=100');
	});

	it('sends no paging parameters when none are given', async () => {
		mockFetch([project]);
		const { ctx } = makeCtx();

		await Projects.list(ctx, { organization_id: ORG });

		expect(captured?.url).not.toContain('per_page');
		expect(captured?.url).not.toContain('offset');
	});

	/**
	 * `project_id` belongs in the body for a saved search, because the path is
	 * top-level. The mirror image of the project create above, and asserted for the same
	 * reason: putting an id in the wrong half of the request is a silent 404 or a
	 * silently ignored field.
	 */
	it('sends project_id in the body when creating a saved search', async () => {
		mockFetch(savedSearch);
		const { ctx } = makeCtx();

		await SavedSearches.create(ctx, {
			project_id: PROJECT,
			name: 'Open errors',
			filters: FILTERS,
		});

		expect(captured?.url).toBe(`${BASE}/saved_searches`);
		expect(JSON.parse(captured?.body ?? '{}')).toMatchObject({
			project_id: PROJECT,
			name: 'Open errors',
		});
	});

	/**
	 * `error_ids` is a query parameter and `operation` is a body field. Confirmed live,
	 * and asserted because the asymmetry is the kind of thing a later refactor would
	 * quietly normalise.
	 */
	it('splits the bulk update across query and body as the API requires', async () => {
		mockFetch({ operation: 'fix' });
		const { ctx } = makeCtx();

		await Errors.bulkUpdate(ctx, {
			project_id: PROJECT,
			error_ids: [ERROR_ID, 'error-2'],
			operation: 'fix',
		});

		const url = decodeURIComponent(captured?.url ?? '');
		expect(url).toContain('error_ids[]=error-1');
		expect(url).toContain('error_ids[]=error-2');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({ operation: 'fix' });
	});

	/**
	 * `display_id` is a dotted path, so it must be URL-encoded. Deleting by an
	 * unencoded or wrong id is exactly how a probe left a field behind on a live
	 * account.
	 */
	it('encodes a dotted event field display id in the path', async () => {
		mockFetch({});
		const { ctx } = makeCtx();

		await EventFields.remove(ctx, {
			project_id: PROJECT,
			display_id: 'metaData.user.accountId',
		});

		expect(decodeURIComponent(captured?.url ?? '')).toBe(
			`${BASE}/projects/${PROJECT}/event_fields/metaData.user.accountId`,
		);
	});

	/**
	 * `display_id` is deliberately absent from the create input, because the API assigns
	 * it from `path` and ignores anything sent. Asserted so it cannot be reintroduced as
	 * a convenience.
	 */
	it('does not send a display_id when creating an event field', async () => {
		mockFetch(eventField);
		const { ctx } = makeCtx();

		await EventFields.create(ctx, {
			project_id: PROJECT,
			path: 'metaData.example.field',
			filter_options: { name: 'Example', match_types: ['eq'] },
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({
			path: 'metaData.example.field',
			filter_options: { name: 'Example', match_types: ['eq'] },
		});
		expect('display_id' in body).toBe(false);
	});

	/**
	 * The API calls the same value `integration_key` on configure and `key` on test.
	 * Both are asserted, because sending the wrong one produces a blank-field error that
	 * reads as though the value were missing.
	 */
	it('uses integration_key to configure and key to test', async () => {
		mockFetch(configuredIntegration);
		const { ctx } = makeCtx();
		await Integrations.configure(ctx, {
			project_id: PROJECT,
			integration_key: 'slack',
			configuration: { webhook: 'https://example.com/hook' },
		});
		expect(JSON.parse(captured?.body ?? '{}')).toMatchObject({
			integration_key: 'slack',
		});

		mockFetch({ success: true });
		await Integrations.test(ctx, {
			key: 'slack',
			configuration: { webhook: 'https://example.com/hook' },
		});
		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toMatchObject({ key: 'slack' });
		expect('integration_key' in body).toBe(false);
	});

	it('sends the required filters on a GDPR request', async () => {
		mockFetch(dataRequest);
		const { ctx } = makeCtx();

		await DataRequests.createForProject(ctx, {
			project_id: PROJECT,
			filters: FILTERS,
		});

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({ filters: FILTERS });
	});

	it('sends no body when confirming a deletion', async () => {
		mockFetch(dataDeletion);
		const { ctx } = makeCtx();

		await DataDeletions.confirmForProject(ctx, {
			project_id: PROJECT,
			deletion_id: DELETION_ID,
		});

		expect(captured?.body).toBeUndefined();
	});
});

describe('event payloads', () => {
	/**
	 * These assertions are the point of the file. BugSnag carries collaborator
	 * identities, end-user personal data and two kinds of API key, and
	 * `logEventFromContext` persists whatever it is handed.
	 */
	it('records no secret when an organization is read', async () => {
		mockFetch(organization);
		const { ctx } = makeCtx();

		await Organizations.get(ctx, { organization_id: ORG });

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain(organization.api_key);
		expect(payload).not.toContain('billing@example.com');
		expect(payload).toContain(ORG);
	});

	it('records neither api key when a project is created', async () => {
		mockFetch(project);
		const { ctx } = makeCtx();

		await Projects.create(ctx, {
			organization_id: ORG,
			name: 'Example App',
			type: 'android',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'bugsnag.projects.create',
			{ project_id: PROJECT, type: 'android' },
			'completed',
		);
		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain(project.api_key);
		expect(payload).not.toContain(project.upload_api_key);
		// The name is caller-authored, so it is not recorded either.
		expect(payload).not.toContain('Example App');
	});

	it('records only ids when a collaborator is read', async () => {
		mockFetch(collaborator);
		const { ctx } = makeCtx();

		await Collaborators.get(ctx, {
			organization_id: ORG,
			collaborator_id: COLLABORATOR,
		});

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('Test Tester');
		expect(payload).not.toContain('tester@example.com');
		expect(payload).toContain(COLLABORATOR);
	});

	/**
	 * The invited address is the one piece of personal data a caller supplies directly
	 * rather than reading back, and it must not be logged either.
	 */
	it('records no email address when a collaborator is invited', async () => {
		mockFetch(collaborator);
		const { ctx } = makeCtx();

		await Collaborators.invite(ctx, {
			organization_id: ORG,
			email: 'invitee@example.com',
			project_ids: [PROJECT],
		});

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('invitee@example.com');
		expect(payload).toContain(COLLABORATOR);
		// The shape of the grant is recorded, without who received it.
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			admin: false,
			project_count: 1,
		});
	});

	/**
	 * A filter value can be an end-user's email address - that is the normal way to
	 * answer a subject access request - so the field *names* are recorded and the values
	 * are not.
	 */
	it('records which fields a filter used but not the values', async () => {
		mockFetch([errorRecord]);
		const { ctx } = makeCtx();

		await Errors.list(ctx, {
			project_id: PROJECT,
			filters: { 'user.email': { type: 'eq', value: 'someone@example.com' } },
		});

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ filtered_fields: ['user.email'] });
		expect(JSON.stringify(logged)).not.toContain('someone@example.com');
	});

	it('records a count rather than the rows when errors are listed', async () => {
		mockFetch([errorRecord, { ...errorRecord, id: 'error-2' }]);
		const { ctx } = makeCtx();

		await Errors.list(ctx, { project_id: PROJECT });

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ error_count: 2 });
		expect(JSON.stringify(logged)).not.toContain('something a user typed');
	});

	/**
	 * Whether full reports were requested is worth recording precisely because it says
	 * whether personal data was pulled.
	 */
	it('records whether full event reports were requested', async () => {
		mockFetch([eventRecord]);
		const { ctx } = makeCtx();

		await Events.list(ctx, { project_id: PROJECT, full_reports: true });

		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			full_reports: true,
		});
	});

	/**
	 * A configured integration's `configuration` is a credential for another service.
	 */
	it('records configuration field names but never their values', async () => {
		mockFetch(configuredIntegration);
		const { ctx } = makeCtx();

		await Integrations.configure(ctx, {
			project_id: PROJECT,
			integration_key: 'slack',
			configuration: { apiToken: 'not-a-real-token-value' },
		});

		const logged = mockLogEvent.mock.calls[0]?.[2];
		expect(logged).toMatchObject({ configuration_fields: ['apiToken'] });
		expect(JSON.stringify(logged)).not.toContain('not-a-real-token-value');
	});

	/** A deletion's status distinguishes "prepared" from "carried out". */
	it('records the status of a GDPR deletion it created', async () => {
		mockFetch(dataDeletion);
		const { ctx } = makeCtx();

		await DataDeletions.createForProject(ctx, {
			project_id: PROJECT,
			filters: FILTERS,
		});

		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			deletion_id: DELETION_ID,
			status: 'AWAITING_CONFIRMATION',
		});
	});

	it('logs every operation exactly once, under its own event name', async () => {
		for (const [op, , , run, payload] of OPERATIONS) {
			mockLogEvent.mockClear();
			mockFetch(payload);
			const { ctx } = makeCtx();

			await run(ctx);

			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(`bugsnag.${op}`);
		}
	});

	/**
	 * The sweep. Every operation is run against a response carrying a planted secret, a
	 * planted email address, a planted name and a planted metadata value, and none of
	 * them may appear in what is logged.
	 *
	 * A per-operation assertion only covers the operations someone thought of; this
	 * covers the ones nobody did, including any added later.
	 */
	describe('privacy sweep', () => {
		const POISON = {
			secret: 'PLANTED-SECRET-0123456789abcdef',
			email: 'planted.person@poison.invalid',
			name: 'Planted Personname',
			meta: 'PLANTED-METADATA-VALUE',
		};

		/** Adds the planted values to every object in a response. */
		const poison = (payload: unknown): unknown => {
			if (Array.isArray(payload)) return payload.map(poison);
			if (payload === null || typeof payload !== 'object') return payload;
			return {
				...(payload as Record<string, unknown>),
				api_key: POISON.secret,
				upload_api_key: POISON.secret,
				email: POISON.email,
				name: POISON.name,
				billing_emails: [POISON.email],
				user: { name: POISON.name, email: POISON.email },
				metaData: { anything: POISON.meta },
				request: { url: `https://poison.invalid/${POISON.meta}` },
			};
		};

		for (const [op, , , run, payload] of OPERATIONS) {
			it(`${op} leaks nothing into the event log`, async () => {
				mockFetch(poison(payload));
				const { ctx } = makeCtx();

				await run(ctx);

				const logged = JSON.stringify(mockLogEvent.mock.calls[0]?.[2] ?? {});
				for (const [label, value] of Object.entries(POISON)) {
					if (logged.includes(value)) {
						throw new Error(
							`${op} wrote the planted ${label} into the event log: ${logged}`,
						);
					}
				}
			});
		}

		/**
		 * Guards the guard. If `poison` stopped injecting anything, every assertion above
		 * would pass vacuously - so this proves the planted values really are present in
		 * what the operations receive.
		 */
		it('actually plants the values it searches for', () => {
			const poisoned = JSON.stringify(poison({ id: 'x' }));

			for (const value of Object.values(POISON)) {
				expect(poisoned).toContain(value);
			}
			expect(JSON.stringify(poison([{ id: 'a' }, { id: 'b' }]))).toContain(
				POISON.secret,
			);
		});
	});
});

describe('a replayed delete still evicts the mirror', () => {
	/**
	 * The P1 this suite previously missed, and the reason `endpoints/delete-flow.ts`
	 * exists.
	 *
	 * A delete of a named resource is safe to replay, so `collaborators.delete` and
	 * `organizations.delete` are deliberately absent from `NON_IDEMPOTENT_OPERATIONS` and
	 * therefore *are* retried after a network or 5xx failure. But if the first attempt
	 * succeeded remotely and only its response was lost, the replay receives a 404. In the
	 * original code the request threw before the eviction ran, so the caller was told the
	 * deletion failed **while the mirror still held the deleted person's name and email**.
	 *
	 * A 404 is now read as confirmed absence: the record is gone, whether this call removed
	 * it or an earlier attempt did, so the eviction must still happen.
	 */
	const NOT_FOUND_BODY = { errors: ['User not found'] };
	const ROUTE_MISSING_BODY = { status: 404, error: 'Not Found' };

	const deletes = [
		[
			'collaborator',
			'collaborators' as const,
			COLLABORATOR,
			(ctx: Ctx) =>
				Collaborators.remove(ctx, {
					organization_id: ORG,
					collaborator_id: COLLABORATOR,
				}),
		],
		[
			'organization',
			'organizations' as const,
			ORG,
			(ctx: Ctx) => Organizations.remove(ctx, { organization_id: ORG }),
		],
	] as const;

	for (const [label, storeName, entityId, run] of deletes) {
		it(`evicts the mirrored ${label} even when the API answers 404`, async () => {
			const warn = jest
				.spyOn(console, 'warn')
				.mockImplementation(() => undefined);
			mockFetch(NOT_FOUND_BODY, 404);
			const { ctx, db } = makeCtx();

			// The caller is told the record is gone, because it is.
			await expect(run(ctx)).resolves.toMatchObject({
				success: true,
				id: entityId,
				already_absent: true,
			});

			// And - the whole point - the mirror was still cleared.
			expect(db[storeName].deleteByEntityId).toHaveBeenCalledWith(entityId);
			warn.mockRestore();
		});

		it(`records already_absent for a replayed ${label} delete`, async () => {
			const warn = jest
				.spyOn(console, 'warn')
				.mockImplementation(() => undefined);
			mockFetch(NOT_FOUND_BODY, 404);
			const { ctx } = makeCtx();

			await run(ctx);

			// An operator can still distinguish "this call removed it" from "it was
			// already gone", which is what a replay looks like.
			expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
				already_absent: true,
				mirror_evicted: true,
			});
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			warn.mockRestore();
		});

		/**
		 * The distinction that keeps this from being a blanket 404 swallow. A route-missing
		 * 404 means the plugin asked for a path that does not exist - a bug in the
		 * request, not evidence that anything was deleted - and must never be reported as
		 * a successful deletion.
		 */
		it(`does not treat a route-missing 404 as a deleted ${label}`, async () => {
			mockFetch(ROUTE_MISSING_BODY, 404);
			const { ctx, db } = makeCtx();

			await expect(run(ctx)).rejects.toMatchObject({ status: 404 });

			expect(db[storeName].deleteByEntityId).not.toHaveBeenCalled();
			// No event either: nothing happened that an audit trail should record as a
			// deletion.
			expect(mockLogEvent).not.toHaveBeenCalled();
		});
	}

	it('reports already_absent as false when the delete really removed something', async () => {
		mockFetch({}, 200);
		const { ctx } = makeCtx();

		await expect(
			Collaborators.remove(ctx, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		).resolves.toMatchObject({ already_absent: false });
	});

	/**
	 * A 404 confirms absence; it does not excuse leaving the row behind. If the eviction
	 * itself then fails, the caller must still be told - otherwise the replay path becomes
	 * a way to silently keep personal data.
	 */
	it('still fails when a 404 delete cannot clear the mirror', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(NOT_FOUND_BODY, 404);
		const { ctx, db } = makeCtx();
		db.collaborators.deleteByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);

		await expect(
			Collaborators.remove(ctx, {
				organization_id: ORG,
				collaborator_id: COLLABORATOR,
			}),
		).rejects.toBeInstanceOf(BugsnagMirrorEvictionError);

		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			already_absent: true,
			mirror_evicted: false,
		});
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('failed');
		warn.mockRestore();
		error.mockRestore();
	});

	/**
	 * Every other error stays an error. Without this, "treat 404 as absence" could quietly
	 * widen into "treat failures as success".
	 */
	it.each([
		[500, { errors: ['boom'] }],
		[403, { errors: ['Forbidden'] }],
		[401, { errors: ['Unauthorized'] }],
	])(
		'propagates a %i rather than reporting a deletion',
		async (status, body) => {
			mockFetch(body, status);
			const { ctx, db } = makeCtx();

			await expect(
				Collaborators.remove(ctx, {
					organization_id: ORG,
					collaborator_id: COLLABORATOR,
				}),
			).rejects.toMatchObject({ status });

			expect(db.collaborators.deleteByEntityId).not.toHaveBeenCalled();
		},
	);

	/**
	 * The same 404 tolerance applies to every delete, including those that mirror nothing -
	 * a replayed saved-search delete should report the search gone rather than fail. Swept
	 * rather than asserted per operation, so an operation added later is covered.
	 */
	it('treats a 404 as absence on every delete operation', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		/**
		 * Operations that use HTTP DELETE but are **not** deletions, so a 404 must stay an
		 * error for them.
		 *
		 * `projects.regenerateApiKey` is the case, and an earlier version of this sweep
		 * filtered on `method === 'DELETE'` and wrongly demanded absence-handling from it.
		 * It rotates a key and returns the whole project; a 404 means the project is
		 * missing, which is a genuine failure and must not be reported as
		 * `{success: true}`. The HTTP verb is not what makes an operation a deletion.
		 */
		const DELETE_METHOD_BUT_NOT_A_DELETION = ['projects.regenerateApiKey'];

		const deleteOps = OPERATIONS.filter(
			([op, method]) =>
				method === 'DELETE' && !DELETE_METHOD_BUT_NOT_A_DELETION.includes(op),
		);

		// Guards the exclusion list: if `regenerateApiKey` stopped using DELETE, the
		// entry would be dead and this sweep would quietly narrow.
		for (const op of DELETE_METHOD_BUT_NOT_A_DELETION) {
			expect(OPERATIONS.find(([name]) => name === op)?.[1]).toBe('DELETE');
		}

		expect(deleteOps.length).toBeGreaterThanOrEqual(7);
		for (const [op, , , run] of deleteOps) {
			mockFetch(NOT_FOUND_BODY, 404);
			const { ctx } = makeCtx();

			const result = await run(ctx).catch((error: unknown) => {
				throw new Error(
					`${op} rejected a 404 instead of reporting absence: ${error}`,
				);
			});

			expect(result).toMatchObject({ success: true, already_absent: true });
		}
		warn.mockRestore();
	});

	/**
	 * The invariant a reviewer asked to have confirmed: a failing eviction must never
	 * prevent the audit event.
	 *
	 * It holds for two independent reasons, and both are asserted here rather than
	 * described, because "I checked" is not a durable guarantee:
	 *
	 * 1. A best-effort `evictEntity` cannot reject at all - it routes through `safely()`,
	 *    which try/catches internally (`endpoints/persist.ts`).
	 * 2. Even if it could, `deleteAndEvict` wraps every eviction and logs before
	 *    rethrowing, so the event survives regardless.
	 *
	 * The second is what makes the first not worth relying on. These tests would catch a
	 * regression in either.
	 */
	it.each([
		[
			'project',
			'projects' as const,
			(ctx: Ctx) => Projects.remove(ctx, { project_id: PROJECT }),
			'bugsnag.projects.delete',
		],
		[
			'team',
			'teams' as const,
			(ctx: Ctx) => Teams.remove(ctx, { organization_id: ORG, team_id: TEAM }),
			'bugsnag.teams.delete',
		],
	])(
		'still logs the %s delete when its best-effort eviction throws',
		async (_label, storeName, run, event) => {
			const warn = jest
				.spyOn(console, 'warn')
				.mockImplementation(() => undefined);
			mockFetch({}, 200);
			const { ctx, db } = makeCtx();
			db[storeName].deleteByEntityId.mockRejectedValueOnce(
				new Error('db down'),
			);

			// The call still succeeds: a stale row for these entities is untidy, not a
			// disclosure.
			await expect(run(ctx)).resolves.toMatchObject({ success: true });

			// And the audit record is still written, as completed.
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(event);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			warn.mockRestore();
		},
	);

	/**
	 * And the required case: the call fails, but the event is written **first** so a
	 * deletion that did happen remotely is not lost from the audit trail.
	 */
	it('logs before rethrowing when a required eviction throws', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch({}, 200);
		const { ctx, db } = makeCtx();
		db.organizations.deleteByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);

		await expect(
			Organizations.remove(ctx, { organization_id: ORG }),
		).rejects.toBeInstanceOf(BugsnagMirrorEvictionError);

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			mirror_evicted: false,
		});
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('failed');
		error.mockRestore();
	});

	/**
	 * The other half of that distinction: an operation that merely uses the DELETE verb
	 * must still fail on a 404. Without this, "treat 404 as absence" could creep into
	 * operations where absence is not the meaning.
	 */
	it('still fails a key rotation when the project is missing', async () => {
		mockFetch(NOT_FOUND_BODY, 404);
		const { ctx } = makeCtx();

		await expect(
			Projects.regenerateApiKey(ctx, { project_id: PROJECT }),
		).rejects.toMatchObject({ status: 404 });
	});
});

describe('no message-matching handler claims an error that has a status', () => {
	/**
	 * The property the `hasNoStatus` comment asserts, tested rather than trusted.
	 *
	 * Every handler that sniffs the message was supposed to be gated on the error having
	 * no status. Four were; `NETWORK_ERROR` was missed, and the comment claimed the whole
	 * class was covered while it was not. A sweep is the only version of this that cannot
	 * drift - it covers a handler added later without anyone remembering to extend it.
	 *
	 * Corsair takes the first matching handler in declaration order
	 * (`packages/corsair/core/errors/handler.ts:41`), and `ApiError`'s message embeds the
	 * response body, so an unlucky body is all it takes.
	 */
	const apiError = (status: number, body: unknown, message: string) =>
		Object.assign(new ApiError({} as never, {} as never, message), {
			status,
			body,
		});

	/** The words each message-matching handler looks for. */
	const TRIGGER_WORDS = [
		'too many requests',
		'unauthorized',
		'forbidden',
		'not found',
		'network',
		'connection',
		'econnrefused',
		'enotfound',
		'etimedout',
		'fetch failed',
	];

	/**
	 * Statuses no status-matching handler claims, so an ungated message matcher would be
	 * reached. 402 is the realistic one - a plan limit - and retrying it is pointless.
	 */
	const UNCLAIMED_STATUSES = [402, 405, 409, 410, 451];

	/** Resolves an error to the handler name that would claim it, as Corsair does. */
	const matchingHandler = (error: Error): string | undefined => {
		const context = { operation: 'errors.list' } as never;
		return Object.keys(errorHandlers).find((name) =>
			(
				errorHandlers[name as keyof typeof errorHandlers] as {
					match: (e: Error, c: never) => boolean;
				}
			).match(error, context),
		);
	};

	it.each(UNCLAIMED_STATUSES)(
		'sends a %i to DEFAULT however its body reads',
		(status) => {
			for (const word of TRIGGER_WORDS) {
				const error = apiError(
					status,
					{ errors: [`something about ${word}`] },
					`Generic Error: status: ${status}; body: {"errors":["something about ${word}"]}`,
				);

				const handler = matchingHandler(error);
				if (handler !== 'DEFAULT') {
					throw new Error(
						`a ${status} whose body mentions "${word}" was claimed by ${handler} ` +
							`on the strength of its message; only DEFAULT should take it`,
					);
				}
			}
		},
	);

	/**
	 * The specific case that was broken: an unclaimed status mentioning a network word was
	 * treated as a transport failure and retried.
	 */
	it('does not treat a 402 mentioning a connection as a network error', () => {
		const error = apiError(
			402,
			{ errors: ['Upgrade required to use this connection'] },
			'Generic Error: status: 402; body: {"errors":["Upgrade required to use this connection"]}',
		);

		expect(matchingHandler(error)).toBe('DEFAULT');
		expect(errorHandlers.NETWORK_ERROR.match(error, {} as never)).toBe(false);
	});

	/**
	 * And a genuine transport failure - no status at all - still reaches NETWORK_ERROR, so
	 * the gating did not simply disable it.
	 */
	it('still matches a statusless transport failure', () => {
		for (const message of [
			'fetch failed',
			'ECONNREFUSED 127.0.0.1:443',
			'network timeout',
		]) {
			expect(
				errorHandlers.NETWORK_ERROR.match(new Error(message), {} as never),
			).toBe(true);
		}
	});

	it('still routes each status to its own handler', () => {
		// The gating must not have broken the status-based matching it sits alongside.
		const cases: Array<[number, string]> = [
			[429, 'RATE_LIMIT_ERROR'],
			[401, 'AUTH_ERROR'],
			[403, 'PERMISSION_ERROR'],
			[404, 'NOT_FOUND_ERROR'],
			[400, 'VALIDATION_ERROR'],
			[422, 'VALIDATION_ERROR'],
			[500, 'SERVER_ERROR'],
			[503, 'SERVER_ERROR'],
		];

		for (const [status, expected] of cases) {
			expect(matchingHandler(apiError(status, { errors: ['x'] }, 'boom'))).toBe(
				expected,
			);
		}
	});
});

describe('filter values that a query string cannot express', () => {
	/**
	 * `NaN` and `Infinity` are numbers, so an earlier version of the guard let them through
	 * and `String()` rendered them as the text `"NaN"` and `"Infinity"` - which the API
	 * would have matched literally. Exactly the silent corruption the guard exists to stop,
	 * one `typeof` check away from being missed.
	 */
	it.each([
		['NaN', Number.NaN],
		['Infinity', Number.POSITIVE_INFINITY],
		['-Infinity', Number.NEGATIVE_INFINITY],
	])('rejects %s rather than filtering on its text form', (_label, value) => {
		expect(() =>
			buildQuery({}, { 'error.status': { type: 'eq', value } }),
		).toThrow(TypeError);
	});

	it('names the problem as the number rather than as the type', () => {
		// "must be a number; received number" would be baffling - the caller did pass a
		// number, and which number is the point.
		expect(() =>
			buildQuery({}, { 'error.status': { type: 'eq', value: Number.NaN } }),
		).toThrow(/NaN/);
		expect(() =>
			buildQuery({}, { x: { type: 'eq', value: Number.POSITIVE_INFINITY } }),
		).toThrow(/non-finite number/);
	});

	it.each([
		['null', null],
		['an array', ['a', 'b']],
		['an object', { nested: true }],
	])('still rejects %s', (_label, value) => {
		expect(() =>
			buildQuery({}, { 'error.status': { type: 'eq', value } }),
		).toThrow(TypeError);
	});

	it('still accepts the scalars the API can express', () => {
		expect(
			decodeURIComponent(buildQuery({}, { a: { type: 'eq', value: 'open' } })),
		).toContain('=open');
		expect(
			decodeURIComponent(buildQuery({}, { a: { type: 'eq', value: 0 } })),
		).toContain('=0');
		expect(
			decodeURIComponent(buildQuery({}, { a: { type: 'eq', value: -1.5 } })),
		).toContain('=-1.5');
		expect(
			decodeURIComponent(buildQuery({}, { a: { type: 'eq', value: false } })),
		).toContain('=false');
	});

	/**
	 * Zero and `false` are the values a truthiness check would have dropped, so they are
	 * asserted explicitly - a filter silently losing `value: 0` would be the same class of
	 * bug in a different place.
	 */
	it('does not confuse a falsy value with an absent one', () => {
		const zero = decodeURIComponent(
			buildQuery({}, { a: { type: 'eq', value: 0 } }),
		);
		expect(zero).toBe('?filters[a][][type]=eq&filters[a][][value]=0');
	});
});

describe('the plugin is honest about its scope', () => {
	/**
	 * The catalog lists 60 operations and all 60 are registered, plus `projects.get`,
	 * which is **not** a catalog operation - the catalog has no get-single-project. So
	 * 61 endpoints implement 60 catalog operations, and the difference is deliberate
	 * rather than a miscount.
	 *
	 * Asserted because the last integration shipped a description claiming a number that
	 * the code did not support, and `greptile.json` treats a description that disagrees
	 * with the implementation as a P1.
	 */
	it('registers the full surface, counted once and asserted everywhere', () => {
		const registered = Object.keys(bugsnagEndpointMeta);

		expect(registered).toHaveLength(EXPECTED_ENDPOINTS);
		expect(registered).toContain('projects.get');
	});

	it('carries no generator or template residue', () => {
		for (const file of [
			'client.ts',
			'error-handlers.ts',
			'index.ts',
			'endpoints/shared.ts',
			'endpoints/persist.ts',
			'endpoints/logging.ts',
			'schema/database.ts',
			'schema/responses.ts',
		]) {
			const source = readFileSync(`${__dirname}/${file}`, 'utf8');
			expect(source).not.toMatch(/TODO|FIXME|example\.com\/api|loyverse/i);
		}
	});
});
