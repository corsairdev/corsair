import type { JsonValue } from './client';
import { HoneybadgerAPIError } from './client';
import type { HoneybadgerContext } from './index';
import { honeybadger } from './index';
import { rejection } from './test-helpers';

const TOKEN = 'hbu_test_token';

let fetchMock: jest.SpyInstance;

function respond(body: JsonValue | undefined, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function makeContext() {
	// The endpoints read `key`, `options.region` and the log path's
	// `$getAccountId`. The log writer tolerates a missing database (it warns and
	// returns null), so only the account lookup is provided.
	const ctx = {
		key: TOKEN,
		options: { region: 'us' },
		$getAccountId: jest.fn(async () => 'account-1'),
	};
	// A fixture supplies only the members the endpoints read; the real context,
	// a full AccountKeyManager among them, carries the rest. A cast is the only
	// way to stand in for it, because implementing all of it would be a copy of
	// core's key manager.
	// unknown: a stand-in for a context whose type brings the whole key manager.
	return ctx as unknown as HoneybadgerContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = honeybadger({ key: TOKEN });
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

const PROJECT = 'Xk9mZp';
const FAULT = '12345';
const NOTICE_UUID = '1e2ba1f0-4f3c-4b1a-9c7e-6f2f5c0f1a3b';
const SITE_ID = '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47';

/** A project as Honeybadger returns one, trimmed to the required fields. */
const project = {
	id: PROJECT,
	account_id: 'Ab3kL9',
	name: 'Billing API',
	asana_workspace_id: null,
	active: true,
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp' },
	disable_public_links: false,
	environments: ['production'],
	language: 'ruby',
	resolve_errors_on_deploy: true,
	user_url: null,
	source_url: null,
	user_search_field: null,
	customer_throttle: null,
	fault_count: 3,
	unresolved_fault_count: 1,
	last_notice_at: '2026-01-01T00:00:00Z',
	earliest_notice_at: '2025-12-01T00:00:00Z',
	purge_days: 30,
	created_at: '2025-01-01T00:00:00Z',
};

const fault = {
	id: FAULT,
	project_id: PROJECT,
	message: "undefined method 'foo' for nil",
	created_at: '2026-01-01T00:00:00Z',
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp/faults/12345' },
};

const notice = {
	id: NOTICE_UUID,
	fault_id: FAULT,
	project_id: PROJECT,
	message: 'boom',
	created_at: '2026-01-01T00:00:00Z',
};

const comment = {
	id: 'Cm7pLx',
	fault_id: FAULT,
	author: { id: 'Uz4wKm', name: 'Jane', email: 'jane@example.com' },
	body: 'Fixed',
	source: 'api',
	event: null,
	created_at: '2026-01-01T00:00:00Z',
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp/faults/12345' },
};

const deploy = {
	id: 'Dp2yNk',
	project_id: PROJECT,
	environment: 'production',
	revision: 'a1b2c3d4',
	repository: 'acme/app',
	local_username: 'jane',
	created_at: '2026-01-01T00:00:00Z',
};

const environment = {
	id: 'En6tRm',
	project_id: PROJECT,
	name: 'production',
	notifications: true,
	created_at: '2026-01-01T00:00:00Z',
};

const checkIn = {
	id: 'Ci5xWq',
	project_id: PROJECT,
	schedule_type: 'simple',
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp/check_ins/Ci5xWq' },
	name: 'Nightly',
	slug: 'nightly',
	state: 'reporting',
	reported_at: '2026-01-01T00:00:00Z',
	expected_at: '2026-01-02T00:00:00Z',
	missed_count: 0,
	grace_period: '00:10:00',
	report_url: 'https://api.honeybadger.io/v1/check_in/abc/nightly',
	cron_timezone: 'UTC',
	created_at: '2025-01-01T00:00:00Z',
};

const site = {
	id: SITE_ID,
	project_id: PROJECT,
	name: 'Marketing',
	url: 'https://example.com',
	active: true,
	links: { web: 'https://app.honeybadger.io/projects/Xk9mZp/sites/x' },
	state: 'up',
	last_checked_at: '2026-01-01T00:00:00Z',
	match_type: 'success',
	match: null,
	request_method: 'GET',
	frequency: 5,
	locations: [],
	validate_ssl: true,
	request_headers: {},
	request_body: null,
	outage_threshold: null,
	timeout: null,
	created_at: '2025-01-01T00:00:00Z',
};

describe('request shape', () => {
	/**
	 * One row per operation: the input to send and the exact path, query and body
	 * the published spec documents for it. `path` is the URL path after `/v3`.
	 */
	const cases: Array<{
		name: string;
		run: (ctx: HoneybadgerContext) => Promise<object>;
		method: string;
		path: string;
		query?: Record<string, string>;
		body?: JsonValue;
	}> = [
		{
			name: 'projects.list',
			run: (ctx) =>
				endpoints.projects.list(ctx, { name: 'Billing API', per_page: 10 }),
			method: 'GET',
			path: '/v3/projects',
			query: { name: 'Billing API', per_page: '10' },
		},
		{
			name: 'projects.get',
			run: (ctx) => endpoints.projects.get(ctx, { project_id: PROJECT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}`,
		},
		{
			name: 'projects.create',
			run: (ctx) =>
				endpoints.projects.create(ctx, {
					name: 'Billing API',
					language: 'ruby',
					disable_email_notifications: true,
				}),
			method: 'POST',
			path: '/v3/projects',
			body: {
				name: 'Billing API',
				language: 'ruby',
				disable_email_notifications: true,
			},
		},
		{
			name: 'projects.update',
			run: (ctx) =>
				endpoints.projects.update(ctx, {
					project_id: PROJECT,
					name: 'Renamed',
					language: null,
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}`,
			// `null` clears the field, so it is sent rather than dropped.
			body: { name: 'Renamed', language: null },
		},
		{
			name: 'projects.delete',
			run: (ctx) => endpoints.projects.delete(ctx, { project_id: PROJECT }),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}`,
		},
		{
			name: 'projects.stats',
			run: (ctx) => endpoints.projects.stats(ctx, { project_id: PROJECT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/stats`,
		},
		{
			name: 'projects.occurrences',
			run: (ctx) =>
				endpoints.projects.occurrences(ctx, {
					project_id: PROJECT,
					period: 'day',
					environment: 'production',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/occurrences`,
			query: { period: 'day', environment: 'production' },
		},
		{
			name: 'occurrences.list',
			run: (ctx) => endpoints.occurrences.list(ctx, { period: 'week' }),
			method: 'GET',
			path: '/v3/projects/occurrences',
			query: { period: 'week' },
		},
		{
			name: 'faults.list',
			run: (ctx) =>
				endpoints.faults.list(ctx, {
					project_id: PROJECT,
					q: 'is:resolved',
					order: 'frequent',
					sort: 'desc',
					occurred_after: 1_700_000_000,
					per_page: 5,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults`,
			query: {
				q: 'is:resolved',
				order: 'frequent',
				sort: 'desc',
				occurred_after: '1700000000',
				per_page: '5',
			},
		},
		{
			name: 'faults.get',
			run: (ctx) =>
				endpoints.faults.get(ctx, { project_id: PROJECT, fault_id: FAULT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}`,
		},
		{
			name: 'faults.update',
			run: (ctx) =>
				endpoints.faults.update(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					resolved: true,
					assignee_id: null,
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}`,
			body: { resolved: true, assignee_id: null },
		},
		{
			name: 'faults.delete',
			run: (ctx) =>
				endpoints.faults.delete(ctx, { project_id: PROJECT, fault_id: FAULT }),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}`,
		},
		{
			name: 'faults.resolve',
			run: (ctx) =>
				endpoints.faults.resolve(ctx, {
					project_id: PROJECT,
					fault_ids: [FAULT],
					dry_run: true,
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/resolve`,
			body: { fault_ids: [FAULT], dry_run: true },
		},
		{
			name: 'faults.unresolve',
			run: (ctx) =>
				endpoints.faults.unresolve(ctx, { project_id: PROJECT, all: true }),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/unresolve`,
			body: { all: true },
		},
		{
			name: 'faults.ignore',
			run: (ctx) =>
				endpoints.faults.ignore(ctx, {
					project_id: PROJECT,
					all: true,
					q: 'environment:development',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/ignore`,
			body: { all: true, q: 'environment:development' },
		},
		{
			name: 'faults.unignore',
			run: (ctx) =>
				endpoints.faults.unignore(ctx, { project_id: PROJECT, all: true }),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/unignore`,
			body: { all: true },
		},
		{
			name: 'faults.summary',
			run: (ctx) =>
				endpoints.faults.summary(ctx, {
					project_id: PROJECT,
					q: 'is:resolved',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/summary`,
			query: { q: 'is:resolved' },
		},
		{
			name: 'faults.assign',
			run: (ctx) =>
				endpoints.faults.assign(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					assignee_id: 'Uz4wKm',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/assign`,
			body: { assignee_id: 'Uz4wKm' },
		},
		{
			name: 'faults.unassign',
			run: (ctx) =>
				endpoints.faults.unassign(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/assign`,
		},
		{
			name: 'faults.merge',
			run: (ctx) =>
				endpoints.faults.merge(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					target_fault_id: '67890',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/merge`,
			body: { target_fault_id: '67890' },
		},
		{
			name: 'faults.pauseRecording',
			run: (ctx) =>
				endpoints.faults.pauseRecording(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					time: 'day',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/pause_recording`,
			body: { time: 'day' },
		},
		{
			name: 'faults.resumeRecording',
			run: (ctx) =>
				endpoints.faults.resumeRecording(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/resume_recording`,
		},
		{
			name: 'faults.snooze',
			run: (ctx) =>
				endpoints.faults.snooze(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					count: 100,
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/snooze`,
			body: { count: 100 },
		},
		{
			name: 'faults.unsnooze',
			run: (ctx) =>
				endpoints.faults.unsnooze(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/snooze`,
		},
		{
			name: 'faults.affectedUsers',
			run: (ctx) =>
				endpoints.faults.affectedUsers(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					q: 'is:resolved',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/affected_users`,
			query: { q: 'is:resolved' },
		},
		{
			name: 'faults.occurrences',
			run: (ctx) =>
				endpoints.faults.occurrences(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					occurred_after: 1_700_000_000,
					occurred_before: 1_700_003_600,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/occurrences`,
			query: {
				occurred_after: '1700000000',
				occurred_before: '1700003600',
			},
		},
		{
			name: 'notices.list',
			run: (ctx) =>
				endpoints.notices.list(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					limit: 10,
					unmapped: true,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/notices`,
			query: { limit: '10', unmapped: 'true' },
		},
		{
			name: 'notices.get',
			run: (ctx) => endpoints.notices.get(ctx, { uuid: NOTICE_UUID }),
			method: 'GET',
			path: `/v3/notices/${NOTICE_UUID}`,
		},
		{
			name: 'comments.list',
			run: (ctx) =>
				endpoints.comments.list(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					limit: 5,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/comments`,
			query: { limit: '5' },
		},
		{
			name: 'comments.get',
			run: (ctx) =>
				endpoints.comments.get(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					comment_id: 'Cm7pLx',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/comments/Cm7pLx`,
		},
		{
			name: 'comments.create',
			run: (ctx) =>
				endpoints.comments.create(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					body: 'Rolled back',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/comments`,
			body: { body: 'Rolled back' },
		},
		{
			name: 'comments.update',
			run: (ctx) =>
				endpoints.comments.update(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					comment_id: 'Cm7pLx',
					body: 'Updated',
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/comments/Cm7pLx`,
			body: { body: 'Updated' },
		},
		{
			name: 'comments.delete',
			run: (ctx) =>
				endpoints.comments.delete(ctx, {
					project_id: PROJECT,
					fault_id: FAULT,
					comment_id: 'Cm7pLx',
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/faults/${FAULT}/comments/Cm7pLx`,
		},
		{
			name: 'deploys.list',
			run: (ctx) =>
				endpoints.deploys.list(ctx, {
					project_id: PROJECT,
					limit: 10,
					environment: 'production',
					local_username: 'jane',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/deploys`,
			query: { limit: '10', environment: 'production', local_username: 'jane' },
		},
		{
			name: 'deploys.get',
			run: (ctx) =>
				endpoints.deploys.get(ctx, {
					project_id: PROJECT,
					deploy_id: 'Dp2yNk',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/deploys/Dp2yNk`,
		},
		{
			name: 'deploys.delete',
			run: (ctx) =>
				endpoints.deploys.delete(ctx, {
					project_id: PROJECT,
					deploy_id: 'Dp2yNk',
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/deploys/Dp2yNk`,
		},
		{
			name: 'environments.list',
			run: (ctx) =>
				endpoints.environments.list(ctx, { project_id: PROJECT, per_page: 50 }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/environments`,
			query: { per_page: '50' },
		},
		{
			name: 'environments.get',
			run: (ctx) =>
				endpoints.environments.get(ctx, {
					project_id: PROJECT,
					environment_id: 'En6tRm',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/environments/En6tRm`,
		},
		{
			name: 'environments.create',
			run: (ctx) =>
				endpoints.environments.create(ctx, {
					project_id: PROJECT,
					name: 'staging',
					notifications: false,
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/environments`,
			body: { name: 'staging', notifications: false },
		},
		{
			name: 'environments.update',
			run: (ctx) =>
				endpoints.environments.update(ctx, {
					project_id: PROJECT,
					environment_id: 'En6tRm',
					notifications: true,
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/environments/En6tRm`,
			body: { notifications: true },
		},
		{
			name: 'environments.delete',
			run: (ctx) =>
				endpoints.environments.delete(ctx, {
					project_id: PROJECT,
					environment_id: 'En6tRm',
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/environments/En6tRm`,
		},
		{
			name: 'environments.bulkDelete',
			run: (ctx) =>
				endpoints.environments.bulkDelete(ctx, {
					project_id: PROJECT,
					environment_ids: ['En6tRm', 'En7uSn'],
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/environments/bulk_delete`,
			body: { environment_ids: ['En6tRm', 'En7uSn'] },
		},
		{
			name: 'environments.bulkUpdate',
			run: (ctx) =>
				endpoints.environments.bulkUpdate(ctx, {
					project_id: PROJECT,
					environment_ids: ['En6tRm'],
					notifications: false,
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/environments/bulk_update`,
			body: { environment_ids: ['En6tRm'], notifications: false },
		},
		{
			name: 'checkIns.list',
			run: (ctx) => endpoints.checkIns.list(ctx, { project_id: PROJECT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/check_ins`,
		},
		{
			name: 'checkIns.get',
			run: (ctx) =>
				endpoints.checkIns.get(ctx, {
					project_id: PROJECT,
					check_in_id: 'Ci5xWq',
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/check_ins/Ci5xWq`,
		},
		{
			name: 'checkIns.create',
			run: (ctx) =>
				endpoints.checkIns.create(ctx, {
					project_id: PROJECT,
					name: 'Nightly billing',
					slug: 'nightly-billing',
					report_period: '1 day',
					grace_period: '15 minutes',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/check_ins`,
			body: {
				name: 'Nightly billing',
				slug: 'nightly-billing',
				report_period: '1 day',
				grace_period: '15 minutes',
			},
		},
		{
			name: 'checkIns.update',
			run: (ctx) =>
				endpoints.checkIns.update(ctx, {
					project_id: PROJECT,
					check_in_id: 'Ci5xWq',
					grace_period: '30 minutes',
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/check_ins/Ci5xWq`,
			body: { grace_period: '30 minutes' },
		},
		{
			name: 'checkIns.delete',
			run: (ctx) =>
				endpoints.checkIns.delete(ctx, {
					project_id: PROJECT,
					check_in_id: 'Ci5xWq',
				}),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/check_ins/Ci5xWq`,
		},
		{
			name: 'checkIns.replace',
			run: (ctx) =>
				endpoints.checkIns.replace(ctx, {
					project_id: PROJECT,
					check_ins: [
						{ slug: 'nightly', report_period: '1 day', name: 'Nightly' },
					],
				}),
			method: 'PUT',
			path: `/v3/projects/${PROJECT}/check_ins/bulk_update`,
			body: {
				check_ins: [
					{ report_period: '1 day', name: 'Nightly', slug: 'nightly' },
				],
			},
		},
		{
			name: 'checkIns.events',
			run: (ctx) =>
				endpoints.checkIns.events(ctx, {
					project_id: PROJECT,
					check_in_id: 'Ci5xWq',
					limit: 10,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/check_ins/Ci5xWq/events`,
			query: { limit: '10' },
		},
		{
			name: 'sites.list',
			run: (ctx) => endpoints.sites.list(ctx, { project_id: PROJECT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/sites`,
		},
		{
			name: 'sites.get',
			run: (ctx) =>
				endpoints.sites.get(ctx, { project_id: PROJECT, site_id: SITE_ID }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/sites/${SITE_ID}`,
		},
		{
			name: 'sites.create',
			run: (ctx) =>
				endpoints.sites.create(ctx, {
					project_id: PROJECT,
					url: 'https://example.com/health',
					name: 'Marketing',
					frequency: 5,
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/sites`,
			body: {
				url: 'https://example.com/health',
				name: 'Marketing',
				frequency: 5,
			},
		},
		{
			name: 'sites.update',
			run: (ctx) =>
				endpoints.sites.update(ctx, {
					project_id: PROJECT,
					site_id: SITE_ID,
					active: false,
				}),
			method: 'PATCH',
			path: `/v3/projects/${PROJECT}/sites/${SITE_ID}`,
			body: { active: false },
		},
		{
			name: 'sites.delete',
			run: (ctx) =>
				endpoints.sites.delete(ctx, { project_id: PROJECT, site_id: SITE_ID }),
			method: 'DELETE',
			path: `/v3/projects/${PROJECT}/sites/${SITE_ID}`,
		},
		{
			name: 'sites.checks',
			run: (ctx) =>
				endpoints.sites.checks(ctx, {
					project_id: PROJECT,
					site_id: SITE_ID,
					limit: 10,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/sites/${SITE_ID}/checks`,
			query: { limit: '10' },
		},
		{
			name: 'sites.outages',
			run: (ctx) =>
				endpoints.sites.outages(ctx, {
					project_id: PROJECT,
					site_id: SITE_ID,
				}),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/sites/${SITE_ID}/outages`,
		},
		{
			name: 'streams.list',
			run: (ctx) => endpoints.streams.list(ctx, { project_id: PROJECT }),
			method: 'GET',
			path: `/v3/projects/${PROJECT}/streams`,
		},
		{
			name: 'insights.query',
			run: (ctx) =>
				endpoints.insights.query(ctx, {
					project_id: PROJECT,
					query: '@size > 0 | limit 10',
					ts: '1h',
				}),
			method: 'POST',
			path: `/v3/projects/${PROJECT}/insights/queries`,
			body: { query: '@size > 0 | limit 10', ts: '1h' },
		},
		{
			name: 'account.get',
			run: (ctx) => endpoints.account.get(ctx, {}),
			method: 'GET',
			path: '/v3/account',
		},
		{
			name: 'account.usage',
			run: (ctx) => endpoints.account.usage(ctx, {}),
			method: 'GET',
			path: '/v3/account/usage',
		},
		{
			name: 'token.get',
			run: (ctx) => endpoints.token.get(ctx, {}),
			method: 'GET',
			path: '/v3/token',
		},
	];

	/** The document a successful call of the operation returns. */
	function bodyFor(name: string): JsonValue | undefined {
		const list = (item: JsonValue) => ({
			data: [item],
			pagination: { page: 1, per_page: 25 },
			links: { self: '/v3/x' },
			meta: { request_id: 'r1' },
		});
		const one = (item: JsonValue) => ({
			data: item,
			meta: { request_id: 'r1' },
		});
		switch (name) {
			case 'projects.list':
				return list(project);
			case 'projects.get':
			case 'projects.create':
			case 'projects.update':
				return one(project);
			case 'projects.stats':
				return one({
					id: PROJECT,
					fault_count: 3,
					unresolved_fault_count: 1,
					notice_count_today: 4,
					notice_count_week: 9,
					notice_count_month: 20,
				});
			case 'projects.occurrences':
				return one({
					project_id: PROJECT,
					buckets: [{ timestamp: 1, count: 2 }],
				});
			case 'occurrences.list':
				return list({
					project_id: PROJECT,
					buckets: [{ timestamp: 1, count: 2 }],
				});
			case 'faults.list':
				return list(fault);
			case 'faults.get':
			case 'faults.update':
			case 'faults.assign':
			case 'faults.unassign':
			case 'faults.pauseRecording':
			case 'faults.resumeRecording':
			case 'faults.snooze':
			case 'faults.unsnooze':
				return one(fault);
			case 'faults.resolve':
			case 'faults.unresolve':
			case 'faults.ignore':
			case 'faults.unignore':
				return one({
					count: 1,
					dry_run: false,
					fault_ids: [FAULT],
					fault_ids_truncated: false,
				});
			case 'faults.summary':
				return one({
					total: 3,
					environments: [
						{
							environment: 'production',
							resolved: false,
							ignored: false,
							count: 3,
						},
					],
				});
			case 'faults.merge':
				return one({ batch_id: 'b1', source_id: FAULT, target_id: '67890' });
			case 'faults.affectedUsers':
				return one([{ user: 'jane@example.com', count: 12 }]);
			case 'faults.occurrences':
				return one([{ timestamp: 1_700_000_000, count: 4 }]);
			case 'notices.list':
				return list(notice);
			case 'notices.get':
				return one(notice);
			case 'comments.list':
				return list(comment);
			case 'comments.get':
			case 'comments.create':
			case 'comments.update':
				return one(comment);
			case 'deploys.list':
				return list(deploy);
			case 'deploys.get':
				return one(deploy);
			case 'environments.list':
				return list(environment);
			case 'environments.get':
			case 'environments.create':
			case 'environments.update':
				return one(environment);
			case 'environments.bulkDelete':
			case 'environments.bulkUpdate':
				return one({ count: 2 });
			case 'checkIns.list':
				return list(checkIn);
			case 'checkIns.replace':
				// A replace answers one result per entry, not the check-ins.
				return {
					data: [
						{ operation: 'update', slug: 'nightly', success: true },
						{ operation: 'delete', slug: 'old-job', success: true },
					],
					meta: { request_id: 'r1' },
				};
			case 'checkIns.get':
			case 'checkIns.create':
			case 'checkIns.update':
				return one(checkIn);
			case 'checkIns.events':
				return list({
					check_in_id: 'Ci5xWq',
					state: 'reporting',
					created_at: '2026-01-01T00:00:00Z',
					payload: null,
				});
			case 'sites.list':
				return list(site);
			case 'sites.get':
			case 'sites.create':
			case 'sites.update':
				return one(site);
			case 'sites.checks':
				return list({
					created_at: '2026-01-01T00:00:00Z',
					duration: 182,
					location: 'Virginia',
					up: true,
				});
			case 'sites.outages':
				return list({
					id: 'o1',
					site_id: SITE_ID,
					down_at: '2026-01-01T00:00:00Z',
					up_at: null,
					status: 502,
					reason: 'Expected 200, got 502',
					headers: {},
					duration_seconds: null,
					created_at: '2026-01-01T00:00:00Z',
				});
			case 'streams.list':
				return list({
					id: 'a3f19c02b7de',
					name: 'Default',
					slug: 'default',
					internal: false,
					project_id: PROJECT,
					created_at: '2025-01-01T00:00:00Z',
				});
			case 'insights.query':
				return {
					data: { count: 3 },
					links: { web: 'https://app.honeybadger.io/projects/Xk9mZp/insights' },
					meta: { request_id: 'r1' },
				};
			case 'account.get':
				return one({
					id: 'Ab3kL9',
					name: 'Acme Corp',
					email: 'billing@acme.com',
					active: true,
					parked: false,
					created_at: '2025-01-01T00:00:00Z',
					links: { web: 'https://app.honeybadger.io' },
				});
			case 'account.usage':
				return one({
					id: 'Ab3kL9',
					quota: {
						errors_limit: 1000,
						errors_consumed: 10,
						uptime_limit: null,
						uptime_consumed: 2,
						check_ins_limit: null,
						check_ins_consumed: 1,
					},
				});
			case 'token.get':
				return one({
					kind: 'user',
					name: 'CI',
					scopes: ['faults:read'],
					account_id: 'Ab3kL9',
					project_ids: [PROJECT],
					expires_at: null,
					last_used_at: null,
				});
			default:
				// A 204 is answered with no body, so undefined is the right
				// response for a delete that does not change state.
				return undefined;
		}
	}

	it.each(cases)('$name sends $method $path', async (testCase) => {
		const deletes = [
			'projects.delete',
			'faults.delete',
			'comments.delete',
			'deploys.delete',
			'environments.delete',
			'checkIns.delete',
			'sites.delete',
		];
		if (deletes.includes(testCase.name)) {
			respond(undefined, 204);
		} else {
			respond(bodyFor(testCase.name));
		}

		const ctx = makeContext();
		await testCase.run(ctx);

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe(testCase.method);
		expect(parsed.pathname).toBe(testCase.path);
		// The token is a Bearer header, never a query parameter.
		expect(headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(parsed.searchParams.get('auth_token')).toBeNull();

		for (const [key, value] of Object.entries(testCase.query ?? {})) {
			expect([key, parsed.searchParams.get(key)]).toEqual([key, value]);
		}
		// Nothing beyond the documented query fields is sent.
		const expected = Object.keys(testCase.query ?? {}).sort();
		expect([...parsed.searchParams.keys()].sort()).toEqual(expected);

		if (testCase.body !== undefined) {
			expect(lastCall().body).toEqual(testCase.body);
			expect(headers.get('content-type')).toBe('application/json');
		} else {
			expect(init.body).toBeUndefined();
		}
	});

	it('covers every registered operation', () => {
		const registered: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			for (const name of Object.keys(members as object)) {
				registered.push(`${group}.${name}`);
			}
		}
		expect(registered.sort()).toEqual(cases.map((c) => c.name).sort());
	});

	it('sends to the EU host when the region option says so', async () => {
		respond(bodyFor('projects.get'));
		const ctx = {
			key: TOKEN,
			options: { region: 'eu' },
			$getAccountId: async () => 'account-1',
			// unknown: fixture, see makeContext.
		} as unknown as HoneybadgerContext;

		await endpoints.projects.get(ctx, { project_id: PROJECT });

		expect(lastCall().parsed.origin).toBe('https://eu-app.honeybadger.io');
	});

	// Every writable field of a check-in is pinned: a builder that knows only
	// some of them drops the rest silently, and the caller is told the update
	// succeeded.
	it('forwards every writable check-in field on update', async () => {
		respond(bodyFor('checkIns.update'));

		await endpoints.checkIns.update(makeContext(), {
			project_id: PROJECT,
			check_in_id: 'Ci5xWq',
			name: 'Nightly',
			slug: 'nightly',
			schedule_type: 'cron',
			cron_schedule: '0 3 * * *',
			cron_timezone: 'Central Time (US & Canada)',
			grace_period: '15 minutes',
		});

		expect(lastCall().body).toEqual({
			name: 'Nightly',
			slug: 'nightly',
			schedule_type: 'cron',
			cron_schedule: '0 3 * * *',
			cron_timezone: 'Central Time (US & Canada)',
			grace_period: '15 minutes',
		});
	});

	it('forwards every writable site field on update', async () => {
		respond(bodyFor('sites.update'));

		await endpoints.sites.update(makeContext(), {
			project_id: PROJECT,
			site_id: SITE_ID,
			name: 'Marketing',
			url: 'https://example.com/health',
			match_type: 'include',
			match: 'ok',
			request_method: 'POST',
			validate_ssl: false,
			request_body: '{"ping":true}',
			request_headers: { 'X-Probe': '1' },
			frequency: 15,
			locations: ['Virginia', 'London'],
			outage_threshold: 2,
			active: true,
			timeout: 30,
		});

		expect(lastCall().body).toEqual({
			name: 'Marketing',
			url: 'https://example.com/health',
			match_type: 'include',
			match: 'ok',
			request_method: 'POST',
			validate_ssl: false,
			request_body: '{"ping":true}',
			request_headers: { 'X-Probe': '1' },
			frequency: 15,
			locations: ['Virginia', 'London'],
			outage_threshold: 2,
			active: true,
			timeout: 30,
		});
	});

	it('forwards every writable project field on update', async () => {
		respond(bodyFor('projects.update'));

		await endpoints.projects.update(makeContext(), {
			project_id: PROJECT,
			name: 'Billing',
			resolve_errors_on_deploy: false,
			disable_public_links: true,
			language: 'ruby',
			user_url: 'https://admin.example.com/users/[user_id]',
			source_url: 'https://github.com/acme/app/blob/main/[file]#L[line]',
			user_search_field: 'context.account_id',
			asana_workspace_id: 'Ab3kL9',
			customer_throttle: 100,
			purge_days: 30,
		});

		expect(lastCall().body).toEqual({
			name: 'Billing',
			resolve_errors_on_deploy: false,
			disable_public_links: true,
			language: 'ruby',
			user_url: 'https://admin.example.com/users/[user_id]',
			source_url: 'https://github.com/acme/app/blob/main/[file]#L[line]',
			user_search_field: 'context.account_id',
			asana_workspace_id: 'Ab3kL9',
			customer_throttle: 100,
			purge_days: 30,
		});
	});

	it('drops a create-only field from an update body', async () => {
		respond(bodyFor('projects.update'));

		await endpoints.projects.update(makeContext(), {
			project_id: PROJECT,
			name: 'Renamed',
			// A field the API documents as create-only. It is accepted by the
			// loose input and must not be forwarded.
			team_id: 'Ab3kL9',
		} as never);

		expect(lastCall().body).toEqual({ name: 'Renamed' });
	});

	it('encodes every path segment, so an odd ID cannot change the route', async () => {
		respond(bodyFor('faults.get'));

		await endpoints.faults.get(makeContext(), {
			project_id: 'a/../b',
			fault_id: '1 2',
		});

		const { parsed } = lastCall();
		// A slash and a space are both encoded, so the ID cannot escape its
		// segment and reach a different route.
		expect(parsed.pathname).toBe('/v3/projects/a%2F..%2Fb/faults/1%202');
	});

	it('defaults to the US host', async () => {
		respond(bodyFor('projects.get'));
		const ctx = {
			key: TOKEN,
			$getAccountId: async () => 'account-1',
			// unknown: fixture, see makeContext.
		} as unknown as HoneybadgerContext;

		await endpoints.projects.get(ctx, { project_id: PROJECT });

		expect(lastCall().parsed.origin).toBe('https://app.honeybadger.io');
	});
});

describe('deletes', () => {
	it('reports the IDs it removed on a 204', async () => {
		respond(undefined, 204);

		const result = await endpoints.deploys.delete(makeContext(), {
			project_id: PROJECT,
			deploy_id: 'Dp2yNk',
		});

		expect(result).toEqual({
			deleted: true,
			project_id: PROJECT,
			deploy_id: 'Dp2yNk',
		});
	});

	// A 200 with a body is not the documented answer. Reporting a delete on it
	// would tell the caller something the provider did not say.
	it('refuses a delete that answers with a body', async () => {
		respond({ data: { id: 'Dp2yNk' } }, 200);

		const error = await rejection(
			endpoints.deploys.delete(makeContext(), {
				project_id: PROJECT,
				deploy_id: 'Dp2yNk',
			}),
		);

		expect((error as Error).message).toMatch(/empty 204/);
	});
});

describe('error translation', () => {
	it('keeps the stable code from body.error.code and drops the body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: {
						code: 'validation_error',
						message: 'The body is invalid.',
						details: [{ field: 'name', message: "can't be blank" }],
					},
					meta: { request_id: 'r1' },
				}),
				{ status: 422, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const error = (await rejection(
			endpoints.projects.create(makeContext(), { name: 'x' }),
		)) as HoneybadgerAPIError;

		expect(error).toBeInstanceOf(HoneybadgerAPIError);
		expect(error.status).toBe(422);
		expect(error.code).toBe('validation_error');
		// The field list is carried in the message, because the body is dropped.
		expect(error.message).toContain('name');
		expect(error.message).toContain("can't be blank");
		// The token is not in the error, and neither is the request body.
		expect(JSON.stringify(error)).not.toContain(TOKEN);
		expect(Object.keys(error)).not.toContain('body');
	});

	it('names the scope a 403 needs', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: {
						code: 'insufficient_scope',
						message: 'This token lacks a scope.',
						details: {
							required_scope: 'faults:write',
							token_scopes: ['faults:read'],
						},
					},
				}),
				{ status: 403, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const error = (await rejection(
			endpoints.faults.update(makeContext(), {
				project_id: PROJECT,
				fault_id: FAULT,
				resolved: true,
			}),
		)) as HoneybadgerAPIError;

		expect(error.code).toBe('insufficient_scope');
		expect(error.message).toContain('faults:write');
		expect(error.message).toContain('faults:read');
	});

	it('records the method so a write is not replayed', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					error: { code: 'service_unavailable', message: 'Try later.' },
				}),
				{ status: 503, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const error = (await rejection(
			endpoints.comments.create(makeContext(), {
				project_id: PROJECT,
				fault_id: FAULT,
				body: 'hi',
			}),
		)) as HoneybadgerAPIError;

		expect(error.method).toBe('POST');
		expect(error.replayable).toBe(false);
	});

	it('marks a BadgerQL query replayable even though it is a POST', async () => {
		respond(
			{
				data: { count: 1 },
				links: { web: 'https://app.honeybadger.io/x' },
				meta: { request_id: 'r1' },
			},
			200,
		);

		await endpoints.insights.query(makeContext(), {
			project_id: PROJECT,
			query: 'limit 1',
		});

		expect(lastCall().init.method).toBe('POST');
	});
});
