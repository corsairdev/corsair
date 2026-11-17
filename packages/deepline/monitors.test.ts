import { logEventFromContext } from 'corsair/core';
import * as monitors from './endpoints/monitors';
import * as notifications from './endpoints/notifications';
import type { DeeplineContext } from './index';
import { monitorsMeta, monitorsSchemas } from './registry-monitors';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const ctx = {
	key: 'tenant-resolved-key',
	database: {},
	options: { key: 'wrong-option-key' },
} as DeeplineContext;
// Response bodies are arbitrary JSON fixtures, including deliberately malformed
// ones, so the helper takes unknown; a stricter type would block those cases.
function reply(value: unknown, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
beforeEach(() => {
	jest.clearAllMocks();
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});
function requestAt(index: number) {
	const [url, init] = fetchMock.mock.calls.at(index) as [string, RequestInit];
	return { url: new URL(url), init, headers: new Headers(init.headers) };
}
const definition = {
	key: 'job-openings',
	tool: 'deepline_native.company_radar',
	payload: { domain: 'stripe.com', radar_type: 'company_job_openings' },
};
const job = {
	ok: true,
	job: {
		id: 'job-1',
		kind: 'batch_deploy',
		state: 'queued',
		phase: 'queued',
		target: { monitor_key: 'job-openings' },
	},
	operation_id: 'op-1',
};
const batchOperation = {
	ok: true,
	operation: {
		runId: 'run-1',
		kind: 'reactivate',
		state: 'running',
		dryRun: true,
		scope: { kind: 'keys' },
		submittedAt: 1,
		updatedAt: 1,
	},
};
const configuration = {
	workspaceVersion: 4,
	groups: [],
	destinations: [],
	rules: [],
};
const group = {
	groupKey: 'group-1',
	name: 'On call',
	enabled: true,
	deliveryTiming: { mode: 'rolling_limit' as const, windowMs: 3600000 },
	source: 'workspace',
	configMode: 'custom',
	version: 2,
};
const destination = {
	destinationKey: 'destination-1',
	groupKey: 'group-1',
	name: 'Email recipients',
	enabled: true,
	source: 'workspace',
	configMode: 'custom',
	version: 0,
	status: 'active',
	settings: { kind: 'email_addresses' as const, to: ['oncall@example.com'] },
};
const rule = {
	ruleKey: 'rule-1',
	groupKey: 'group-1',
	enabled: true,
	notificationType: 'play_run',
	eventName: 'play.cron.failed',
	eventFilter: { source: 'cron' },
	trigger: { kind: 'each_match' },
	repeatMode: 'on_enter',
	conditionGeneration: 0,
	source: 'workspace',
	configMode: 'custom',
	version: 1,
};
const notification = {
	id: 'notification-1',
	name: 'pipeline-watchdog',
	provider: 'slack',
	target: { id: 'C123', name: 'alerts', kind: 'channel' },
	enabled: true,
	status: 'active',
	eventTypes: ['play.cron.failed'],
};

type Case = {
	name: string;
	call: () => Promise<unknown>;
	path: string;
	method?: string;
	query?: Record<string, string | string[]>;
	body?: unknown;
	headers?: Record<string, string | RegExp>;
	response: unknown;
	// The value the endpoint returns, when it adds to the provider response.
	result?: unknown;
	// Open server-owned records accept any JSON object.
	openOutput?: boolean;
};
// Every operation runs through its real input parser, HTTP transport and
// output parser. Fixtures for the access, tools, deployed, ledger, health,
// fleets, check, notifications, configuration and DLQ list responses follow
// shapes read from the live API on 2026-11-17; the rest follow the SDK types.
const cases: Case[] = [
	{
		name: 'monitors.access',
		call: () => monitors.access(ctx, {}),
		path: '/api/v2/monitors/access',
		response: { has_access: true, reason: 'Enabled by the feature rollout.' },
	},
	{
		name: 'monitors.available',
		call: () => monitors.available(ctx, { provider: 'rb2b', limit: 3 }),
		path: '/api/v2/monitors/tools',
		query: { provider: 'rb2b', limit: '3', compact: 'true' },
		response: {
			tools: [
				{
					tool: 'rb2b.visitor_events',
					display_name: 'RB2B Visitor Events',
					description: 'Visitors',
					streams: ['events'],
					deployed_count: 0,
				},
			],
			total: 5,
			returned: 1,
			limit: 3,
			is_truncated: true,
			filters: {},
		},
	},
	{
		name: 'monitors.list',
		call: () =>
			monitors.list(ctx, {
				state: 'all',
				limit: 5,
				cursor: 'next',
				includeConsumers: true,
			}),
		path: '/api/v2/monitors/deployed',
		query: {
			state: 'all',
			limit: '5',
			cursor: 'next',
			include_consumers: 'true',
		},
		response: {
			monitors: [{ key: 'job-openings', state: 'active', tool: 'x' }],
			total: 1,
			returned: 1,
			has_more: false,
			next_cursor: null,
			capacity: { can_create: true, limit: 100 },
		},
	},
	{
		name: 'monitors.get',
		call: () => monitors.get(ctx, { key: 'team/hires ?#' }),
		path: '/api/v2/monitors/deployed/team%2Fhires%20%3F%23',
		response: {
			key: 'team/hires ?#',
			tool: 'deepline_native.company_radar',
			state: 'active',
			monitor_spec: { available: true },
		},
	},
	{
		name: 'monitors.dependents',
		call: () => monitors.dependents(ctx, { key: 'job-openings' }),
		path: '/api/v2/monitors/deployed/job-openings/dependents',
		response: { plays: [{ name: 'route-hires' }] },
		openOutput: true,
	},
	{
		name: 'monitors.check',
		call: () => monitors.check(ctx, { ...definition, name: 'Jobs' }),
		path: '/api/v2/monitors/check',
		method: 'POST',
		body: { ...definition, name: 'Jobs' },
		response: {
			valid: true,
			mode: 'check',
			issues: [],
			monitor: { key: 'job-openings', status: 'planned' },
			deploy_cost_estimate: { credits: 0 },
		},
	},
	{
		name: 'monitors.preview',
		call: () =>
			monitors.preview(ctx, {
				...definition,
				limit: 2,
				idempotencyKey: 'hires-sample-1',
			}),
		path: '/api/v2/monitors/preview',
		method: 'POST',
		body: { ...definition, limit: 2 },
		headers: { 'Idempotency-Key': 'hires-sample-1' },
		response: { updates: [], charged_credits: 0 },
		result: {
			updates: [],
			charged_credits: 0,
			idempotency_key: 'hires-sample-1',
		},
		openOutput: true,
	},
	{
		name: 'monitors.deploy',
		call: () => monitors.deploy(ctx, definition),
		path: '/api/v2/monitors/deploy',
		method: 'POST',
		body: definition,
		response: { monitor: { key: 'job-openings', state: 'provisioning' } },
		openOutput: true,
	},
	{
		name: 'monitors.update',
		call: () =>
			monitors.update(ctx, {
				key: 'job-openings',
				payload: { job_titles: 'CEO OR CFO' },
			}),
		path: '/api/v2/monitors/deployed/job-openings',
		method: 'PATCH',
		body: { payload: { job_titles: 'CEO OR CFO' } },
		response: { change_summary: { upstream: { resource_replaced: true } } },
		openOutput: true,
	},
	{
		name: 'monitors.delete',
		call: () => monitors.delete(ctx, { key: 'job-openings', dryRun: true }),
		path: '/api/v2/monitors/deployed/job-openings',
		method: 'DELETE',
		query: { dry_run: 'true' },
		response: { plan: { monitor_key: 'job-openings' } },
		openOutput: true,
	},
	{
		name: 'monitors.reactivate',
		call: () => monitors.reactivate(ctx, { key: 'job-openings' }),
		path: '/api/v2/monitors/deployed/job-openings/reactivate',
		method: 'POST',
		query: {},
		body: {},
		response: { reactivated: true },
		openOutput: true,
	},
	{
		name: 'monitors.start',
		call: () =>
			monitors.start(ctx, { key: 'job-openings', idempotencyKey: 'start-1' }),
		path: '/api/v2/monitors/deployed/job-openings/start',
		method: 'POST',
		body: {},
		headers: { 'Idempotency-Key': 'start-1' },
		response: job,
		openOutput: true,
	},
	{
		name: 'monitors.stop',
		call: () => monitors.stop(ctx, { key: 'job-openings' }),
		path: '/api/v2/monitors/deployed/job-openings/stop',
		method: 'POST',
		body: {},
		headers: {
			'Idempotency-Key': /^monitor-job-stop-[0-9a-f-]{36}$/,
		},
		response: job,
		openOutput: true,
	},
	{
		name: 'monitors.test',
		call: () =>
			monitors.test(ctx, {
				key: 'rb2b-visitors',
				payload: { Website: 'https://example.com' },
			}),
		path: '/api/v2/monitors/deployed/rb2b-visitors/test',
		method: 'POST',
		body: {
			payload: { Website: 'https://example.com' },
			mode: 'validation_only',
		},
		response: { accepted: true, persisted_rows: 0, dispatched_bound_plays: 0 },
		openOutput: true,
	},
	{
		name: 'monitors.health',
		call: () => monitors.health(ctx, { fleetId: 'fleet-1' }),
		path: '/api/v2/monitors/health',
		query: { fleet_id: 'fleet-1' },
		response: {
			ok: true,
			scope: { org_id: 'org-1', fleet_id: 'fleet-1' },
			scanned: 0,
			truncated: false,
			converged: 0,
			needs_repair: 0,
		},
	},
	{
		name: 'monitors.ledger.list',
		call: () =>
			monitors.ledger.list(ctx, {
				search: 'stripe',
				states: ['active', 'errored'],
				signals: ['hires', 'jobs'],
				sort: 'findings',
				window: '7d',
				limit: 1,
				cursor: 'next',
			}),
		path: '/api/v2/monitors/ledger',
		query: {
			q: 'stripe',
			state: ['active', 'errored'],
			signal: ['hires', 'jobs'],
			sort: 'findings',
			window: '7d',
			limit: '1',
			cursor: 'next',
		},
		response: {
			schemaVersion: 1,
			monitors: [],
			total: 0,
			next_cursor: null,
			status_counts: { active: 0 },
		},
	},
	{
		name: 'monitors.ledger.get',
		call: () => monitors.ledger.get(ctx, { key: 'a/b' }),
		path: '/api/v2/monitors/ledger/a%2Fb',
		response: { key: 'a/b', status: 'active' },
		openOutput: true,
	},
	{
		name: 'monitors.ledger.findings',
		call: () =>
			monitors.ledger.findings(ctx, { key: 'job-openings', cursor: 'c1' }),
		path: '/api/v2/monitors/ledger/job-openings/findings',
		query: { cursor: 'c1' },
		response: { findings: [], next_cursor: null },
		openOutput: true,
	},
	{
		name: 'monitors.jobs.get',
		call: () => monitors.jobs.get(ctx, { jobId: 'job-1' }),
		path: '/api/v2/monitors/jobs/job-1',
		response: job,
		openOutput: true,
	},
	{
		name: 'monitors.jobs.logs',
		call: () => monitors.jobs.logs(ctx, { jobId: 'job-1', limit: 5 }),
		path: '/api/v2/monitors/jobs/job-1/logs',
		query: { limit: '5' },
		response: {
			...job,
			logs: [
				{
					level: 'info',
					phase: 'queued',
					message: 'Queued',
					at: '2026-11-17T00:00:00Z',
				},
			],
		},
		openOutput: true,
	},
	{
		name: 'monitors.jobs.cancel',
		call: () => monitors.jobs.cancel(ctx, { jobId: 'job-1' }),
		path: '/api/v2/monitors/jobs/job-1/cancel',
		method: 'POST',
		body: {},
		response: { ...job, already_terminal: false },
		openOutput: true,
	},
	{
		name: 'monitors.batch.get',
		call: () => monitors.batch.get(ctx, { runId: 'run-1', cursor: 'c2' }),
		path: '/api/v2/monitors/batch/run-1',
		query: { cursor: 'c2' },
		response: batchOperation,
	},
	{
		name: 'monitors.fleets.list',
		call: () => monitors.fleets.list(ctx, {}),
		path: '/api/v2/monitors/fleets',
		query: {},
		response: { schemaVersion: 1, fleets: [] },
	},
	{
		name: 'notifications.list',
		call: () => notifications.list(ctx, {}),
		path: '/api/v2/notifications',
		response: {
			contractVersion: 1,
			catalog: [
				{
					id: 'play.cron.failed',
					label: 'Cron run failed',
					description: 'A cron run failed',
					source: 'cron',
					outcome: 'failed',
					defaultEnabled: true,
				},
			],
			notifications: [notification],
			providers: [{ kind: 'slack', targetLabel: 'channel' }],
			destinations: [],
			subscriptions: [],
			dlq: { count: 0, capped: false },
			slackConnection: { connected: false, status: 'not_connected' },
		},
	},
	{
		name: 'notifications.configuration.get',
		call: () => notifications.configuration.get(ctx, {}),
		path: '/api/v2/notifications/configuration',
		response: {
			configuration: { ...configuration, defaultPolicy: { version: 1 } },
			catalog: [{ id: 'play_run', name: 'Play runs' }],
			defaults: { version: 1 },
			slackConnection: { connected: false, status: 'not_connected' },
		},
	},
	{
		name: 'notifications.configuration.change',
		call: () =>
			notifications.configuration.change(ctx, {
				expectedWorkspaceVersion: 4,
				change: {
					kind: 'save_group',
					draft: { group, destinations: [destination], rules: [rule] },
				},
			}),
		path: '/api/v2/notifications/configuration',
		method: 'PUT',
		body: {
			expectedWorkspaceVersion: 4,
			change: {
				kind: 'save_group',
				draft: { group, destinations: [destination], rules: [rule] },
			},
		},
		response: { configuration: { ...configuration, workspaceVersion: 5 } },
	},
	{
		name: 'notifications.create',
		call: () =>
			notifications.create(ctx, {
				name: 'pipeline-watchdog',
				channel: '#alerts',
				eventTypes: ['play.cron.failed'],
			}),
		path: '/api/v2/notifications',
		method: 'POST',
		body: {
			name: 'pipeline-watchdog',
			provider: 'slack',
			channel: '#alerts',
			eventTypes: ['play.cron.failed'],
		},
		response: notification,
		openOutput: true,
	},
	{
		name: 'notifications.update',
		call: () =>
			notifications.update(ctx, {
				notificationId: 'notification/1',
				enabled: false,
			}),
		path: '/api/v2/notifications/notification%2F1',
		method: 'PATCH',
		body: { enabled: false },
		response: { ...notification, enabled: false },
		openOutput: true,
	},
	{
		name: 'notifications.delete',
		call: () => notifications.delete(ctx, { notificationId: 'notification-1' }),
		path: '/api/v2/notifications/notification-1',
		method: 'DELETE',
		response: { deleted: true, id: 'notification-1' },
	},
	{
		name: 'notifications.test',
		call: () => notifications.test(ctx, { notificationId: 'notification-1' }),
		path: '/api/v2/notifications/notification-1/test',
		method: 'POST',
		body: {},
		response: {
			ok: true,
			deliveryId: 'delivery-1',
			state: 'delivered',
			message: 'Sent',
		},
	},
	{
		name: 'notifications.channels',
		call: () => notifications.channels(ctx, { search: 'pipeline alerts' }),
		path: '/api/v2/notifications/slack/channels',
		query: { search: 'pipeline alerts' },
		response: {
			identity: { teamId: 'T1', teamName: 'Team' },
			channels: [{ id: 'C1', name: 'pipeline-alerts', isPrivate: false }],
		},
	},
	{
		name: 'notifications.dlq.list',
		call: () => notifications.dlq.list(ctx, { limit: 2 }),
		path: '/api/v2/settings/notifications/dlq',
		query: { limit: '2' },
		response: { count: 0, deliveries: [], hasMore: false },
	},
	{
		name: 'notifications.dlq.get',
		call: () => notifications.dlq.get(ctx, { deliveryId: 'delivery 1' }),
		path: '/api/v2/settings/notifications/dlq/delivery%201',
		response: { id: 'delivery 1', state: 'dead_lettered' },
		openOutput: true,
	},
	{
		name: 'notifications.dlq.update',
		call: () =>
			notifications.dlq.update(ctx, {
				deliveryId: 'delivery-1',
				action: 'archive',
			}),
		path: '/api/v2/settings/notifications/dlq/delivery-1',
		method: 'POST',
		body: { action: 'archive' },
		response: { ok: true, state: 'archived' },
		openOutput: true,
	},
];

describe('Deepline monitors and notifications HTTP contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.result ?? test.response);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const { url, init, headers } = requestAt(-1);
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe(test.method ?? 'GET');
			expect(headers.get('Authorization')).toBe('Bearer tenant-resolved-key');
			if (test.query) {
				const actual: Record<string, string | string[]> = {};
				for (const name of new Set(url.searchParams.keys())) {
					const all = url.searchParams.getAll(name);
					actual[name] = all.length > 1 ? all : all[0]!;
				}
				expect(actual).toEqual(test.query);
			}
			if (test.body === undefined)
				expect(init.body ?? undefined).toBeUndefined();
			else expect(JSON.parse(String(init.body))).toEqual(test.body);
			for (const [name, value] of Object.entries(test.headers ?? {})) {
				if (typeof value === 'string') expect(headers.get(name)).toBe(value);
				else expect(headers.get(name)).toMatch(value);
			}
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);

	it('covers every registered operation', () => {
		expect(cases.map((t) => t.name).sort()).toEqual(
			Object.keys(monitorsSchemas).sort(),
		);
		expect(Object.keys(monitorsMeta).sort()).toEqual(
			Object.keys(monitorsSchemas).sort(),
		);
	});

	it.each(cases.filter((t) => !t.openOutput))(
		'$name rejects a malformed success response',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply({ unrelated: true }));
			await expect(test.call()).rejects.toThrow();
			expect(logEventFromContext).not.toHaveBeenCalled();
		},
	);

	it.each(cases)('$name rejects a non-object response', async (test) => {
		fetchMock.mockResolvedValueOnce(reply(['unexpected']));
		await expect(test.call()).rejects.toThrow();
	});

	it('assigns risk levels: reads read, spend/delete/send destructive', () => {
		const levels = Object.fromEntries(
			Object.entries(monitorsMeta).map(([name, m]) => [name, m.riskLevel]),
		);
		const destructive = [
			'monitors.preview',
			'monitors.deploy',
			'monitors.update',
			'monitors.delete',
			'monitors.reactivate',
			'monitors.start',
			'monitors.stop',
			'monitors.jobs.cancel',
			'notifications.delete',
			'notifications.test',
			'notifications.dlq.update',
		];
		const write = [
			'notifications.configuration.change',
			'notifications.create',
			'notifications.update',
		];
		for (const [name, level] of Object.entries(levels))
			expect([name, level]).toEqual([
				name,
				destructive.includes(name)
					? 'destructive'
					: write.includes(name)
						? 'write'
						: 'read',
			]);
	});
});

describe('monitor write safety', () => {
	it('deploy dryRun plans through the free check endpoint and never deploys', async () => {
		fetchMock.mockResolvedValueOnce(reply({ valid: true, mode: 'check' }));
		expect(await monitors.deploy(ctx, { ...definition, dryRun: true })).toEqual(
			{ valid: true, mode: 'check' },
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const { url, init } = requestAt(0);
		expect(url.pathname).toBe('/api/v2/monitors/check');
		expect(JSON.parse(String(init.body))).toEqual(definition);
	});

	it('deploys a deepline.analytics monitor and then sets up its tracker, as the SDK does', async () => {
		fetchMock
			.mockResolvedValueOnce(
				reply({ monitor: { key: 'site', state: 'active' } }),
			)
			.mockResolvedValueOnce(
				reply({ tracking: { snippet: '<script>' }, ip2company: null }),
			);
		const analytics = {
			key: 'site',
			tool: 'deepline.analytics',
			payload: { domain: 'example.com' },
		};
		expect(await monitors.deploy(ctx, analytics)).toEqual({
			monitor: {
				key: 'site',
				state: 'active',
				tracking: { snippet: '<script>' },
				ip2company: null,
			},
		});
		expect(requestAt(0).url.pathname).toBe('/api/v2/monitors/deploy');
		const setup = requestAt(1);
		expect(setup.url.pathname).toBe(
			'/api/v2/monitors/setup/deepline.analytics',
		);
		expect(setup.init.method).toBe('POST');
		expect(JSON.parse(String(setup.init.body))).toEqual({
			domain: 'example.com',
			monitor_key: 'site',
		});
	});

	it('requires a caller-owned preview key, sends it and returns it for recovery', async () => {
		await expect(
			monitors.preview(
				ctx,
				definition as unknown as Parameters<typeof monitors.preview>[1],
			),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
		fetchMock.mockResolvedValueOnce(reply({ updates: [] }));
		const result = await monitors.preview(ctx, {
			...definition,
			idempotencyKey: 'preview-1',
		});
		expect(requestAt(0).headers.get('Idempotency-Key')).toBe('preview-1');
		expect(result.idempotency_key).toBe('preview-1');
	});

	it('rejects a malformed analytics setup reply instead of reporting success', async () => {
		fetchMock
			.mockResolvedValueOnce(reply({ monitor: { key: 'site' } }))
			.mockResolvedValueOnce(reply(['unexpected']));
		await expect(
			monitors.deploy(ctx, {
				key: 'site',
				tool: 'deepline.analytics',
				payload: { domain: 'example.com' },
			}),
		).rejects.toThrow('malformed analytics setup');
	});

	it.each([
		['start', 'reactivate'],
		['stop', 'deactivate'],
	] as const)(
		'%s dryRun submits a dry-run batch plan with one idempotency key',
		async (action, kind) => {
			fetchMock.mockResolvedValueOnce(reply(batchOperation));
			expect(
				await monitors[action](ctx, {
					key: 'job-openings',
					dryRun: true,
					idempotencyKey: 'plan-1',
				}),
			).toEqual(batchOperation);
			const { url, init, headers } = requestAt(0);
			expect(url.pathname).toBe('/api/v2/monitors/batch');
			expect(init.method).toBe('POST');
			expect(headers.get('Idempotency-Key')).toBe('plan-1');
			expect(JSON.parse(String(init.body))).toEqual({
				kind,
				scope: { kind: 'keys', monitor_keys: ['job-openings'] },
				dry_run: true,
				idempotency_key: 'plan-1',
			});
		},
	);

	it('omits dry_run on a real delete and sends the fleets overview filters', async () => {
		fetchMock.mockResolvedValueOnce(reply({ deleted: true }));
		await monitors.delete(ctx, { key: 'job-openings' });
		expect(requestAt(0).url.search).toBe('');
		fetchMock.mockResolvedValueOnce(reply({ fleets: [], total: 0 }));
		await monitors.fleets.list(ctx, {
			overview: true,
			states: ['running', 'setting_up'],
			sort: 'name',
		});
		const { url } = requestAt(1);
		expect(url.searchParams.get('view')).toBe('overview');
		expect(url.searchParams.getAll('state')).toEqual(['running', 'setting_up']);
		expect(url.searchParams.get('sort')).toBe('name');
	});

	it('describes one monitor tool without forcing compact mode', async () => {
		const description = {
			provider: 'deepline_native',
			tool: 'deepline_native.company_radar',
			payload_schema: { type: 'object' },
		};
		fetchMock.mockResolvedValueOnce(reply(description));
		expect(
			await monitors.available(ctx, { tool: 'deepline_native.company_radar' }),
		).toEqual(description);
		expect(Object.fromEntries(requestAt(0).url.searchParams)).toEqual({
			tool: 'deepline_native.company_radar',
		});
	});

	it('validates inputs before HTTP', async () => {
		const invalid = [
			() => monitors.get(ctx, { key: '..' }),
			() => monitors.jobs.get(ctx, { jobId: '.' }),
			() => notifications.dlq.get(ctx, { deliveryId: '..' }),
			() =>
				monitors.check(ctx, {
					...definition,
					play: 'route',
				} as unknown as typeof definition),
			() => monitors.check(ctx, { ...definition, key: '  ' }),
			() =>
				monitors.preview(ctx, { ...definition, limit: 4, idempotencyKey: 'p' }),
			() => monitors.preview(ctx, { ...definition, idempotencyKey: 'bad key' }),
			() =>
				monitors.start(ctx, {
					key: 'job-openings',
					idempotencyKey: 'x'.repeat(97),
				}),
			() => monitors.list(ctx, { includeConsumers: true }),
			() => monitors.list(ctx, { includeConsumers: true, limit: 21 }),
			() => monitors.update(ctx, { key: 'job-openings' }),
			() => monitors.fleets.list(ctx, { sort: 'name' }),
			() =>
				monitors.ledger.list(ctx, {
					states: ['paused'] as unknown as ['active'],
				}),
			() =>
				notifications.create(ctx, {
					name: 'a',
					eventTypes: [],
					channel: '#a',
					memberId: 'U1',
				}),
			() => notifications.create(ctx, { name: 'a', eventTypes: [] }),
			() =>
				notifications.update(ctx, {
					notificationId: 'n',
					enabled: true,
					name: 'b',
				}),
			() => notifications.update(ctx, { notificationId: 'n', name: 'b' }),
			() =>
				notifications.dlq.update(ctx, {
					deliveryId: 'd',
					action: 'replay' as 'retry',
				}),
			() =>
				notifications.configuration.change(ctx, {
					expectedWorkspaceVersion: 1,
					change: { kind: 'delete_group' } as unknown as {
						kind: 'delete_group';
						groupKey: string;
					},
				}),
		];
		for (const call of invalid) await expect(call()).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a full notification edit with a member target', async () => {
		fetchMock.mockResolvedValueOnce(reply(notification));
		await notifications.update(ctx, {
			notificationId: 'notification-1',
			name: 'owner-alerts',
			eventTypes: ['play.cron.failed'],
			memberId: 'U0123456789',
		});
		expect(JSON.parse(String(requestAt(0).init.body))).toEqual({
			name: 'owner-alerts',
			eventTypes: ['play.cron.failed'],
			memberId: 'U0123456789',
		});
	});

	it('does not retry a failed write', async () => {
		fetchMock.mockResolvedValueOnce(reply({ error: 'boom' }, 500));
		await expect(
			notifications.dlq.update(ctx, { deliveryId: 'd', action: 'retry' }),
		).rejects.toThrow('HTTP 500');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
