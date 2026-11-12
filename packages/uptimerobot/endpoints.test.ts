import { UptimeRobotAPIError } from './client';
import {
	Account,
	Incidents,
	MaintenanceWindows,
	MonitorGroups,
	Monitors,
	Stats,
	StatusPages,
	Tags,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

import {
	announcement,
	announcementsPage,
	healthyMonitor,
	heartbeatMonitor,
	incident,
	incidentComment,
	incidentCommentsPage,
	incidentsFilteredPage,
	incidentsPage,
	incidentWithRootCause,
	invalidToken,
	maintenanceWindow,
	maintenanceWindowsPage,
	monitor,
	monitorGroup,
	monitorGroupsPage,
	monitorsLastPage,
	monitorsPage,
	monitorUptime,
	pausedMonitor,
	responseTime,
	statusPage,
	statusPagesPage,
	tag,
	tagsFirstPage,
	tagsPage,
	uptimeStats,
	user,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	mockLog,
	respond,
	respondEmpty,
} from './test-support';

const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});
describe('monitors', () => {
	it('lists monitors with every filter comma-joined', async () => {
		respond(fetchMock, monitorsPage);

		const result = await invoke(Monitors.list, {
			status: ['UP', 'DOWN'],
			tags: ['production', 'staging'],
			limit: 20,
			name: 'acme',
		});

		expect(result).toEqual(monitorsPage);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/monitors');
		expect(sent.query.status).toBe('UP,DOWN');
		expect(sent.query.tags).toBe('production,staging');
		expect(sent.query.limit).toBe('20');
		expect(sent.query.name).toBe('acme');
	});

	it('sends one query key per filter, not a repeated key', async () => {
		respond(fetchMock, monitorsPage);

		await invoke(Monitors.list, { status: ['UP', 'DOWN'] });

		const pairs = lastRequest(fetchMock).queryPairs;
		expect(pairs.filter(([key]) => key === 'status')).toEqual([
			['status', 'UP,DOWN'],
		]);
	});

	it('logs how many came back and whether more pages remain', async () => {
		respond(fetchMock, monitorsPage);

		await invoke(Monitors.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.monitors.list',
			{ count: 2, hasMore: true },
			'completed',
		);
	});

	it('reports no more pages when nextLink is absent', async () => {
		respond(fetchMock, monitorsLastPage);

		const result = await invoke(Monitors.list, {});
		expect(result).toEqual(monitorsLastPage);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.monitors.list',
			{ count: 1, hasMore: false },
			'completed',
		);
	});

	it('rejects an unknown status before any request', async () => {
		await expect(
			invoke(Monitors.list, { status: ['BROKEN'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads one monitor', async () => {
		respond(fetchMock, monitor);

		await expect(invoke(Monitors.get, { id: 778_001 })).resolves.toEqual(
			monitor,
		);
		expect(lastRequest(fetchMock).path).toBe('/v3/monitors/778001');
	});

	it('creates an HTTP monitor', async () => {
		respond(fetchMock, monitor, 201);

		const result = await invoke(Monitors.create, {
			friendlyName: 'Acme storefront',
			type: 'HTTP',
			interval: 300,
			url: 'https://shop.acme.example',
			timeout: 30,
		});

		expect(result).toEqual(monitor);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v3/monitors');
		expect(sent.body).toMatchObject({
			friendlyName: 'Acme storefront',
			type: 'HTTP',
			interval: 300,
			url: 'https://shop.acme.example',
		});
	});

	it('creates a heartbeat monitor with no url', async () => {
		respond(fetchMock, heartbeatMonitor, 201);

		await invoke(Monitors.create, {
			friendlyName: 'Nightly backup',
			type: 'HEARTBEAT',
			interval: 86_400,
			gracePeriod: 3600,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.body).toMatchObject({ type: 'HEARTBEAT', gracePeriod: 3600 });
		expect((sent.body as { url?: string }).url).toBeUndefined();
	});

	it('requires a url for an HTTP monitor', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'No url',
				type: 'HTTP',
				interval: 300,
			}),
		).rejects.toThrow('A HTTP monitor needs a url.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a url on a heartbeat monitor', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'Heartbeat',
				type: 'HEARTBEAT',
				interval: 300,
				url: 'https://example.com',
			}),
		).rejects.toThrow('A HEARTBEAT monitor takes no url');
	});

	it('requires a port for a PORT monitor', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'Postgres',
				type: 'PORT',
				interval: 300,
				url: 'db.acme.example',
			}),
		).rejects.toThrow('A PORT monitor needs a port.');
	});

	it('requires the keyword settings for a KEYWORD monitor', async () => {
		const attempt = invoke(Monitors.create, {
			friendlyName: 'Login page',
			type: 'KEYWORD',
			interval: 300,
			url: 'https://acme.example/login',
			timeout: 30,
		});

		await expect(attempt).rejects.toThrow(
			'A KEYWORD monitor needs keywordType.',
		);
	});

	it('creates a KEYWORD monitor once its settings are present', async () => {
		respond(fetchMock, { ...monitor, type: 'KEYWORD' }, 201);

		await invoke(Monitors.create, {
			friendlyName: 'Login page',
			type: 'KEYWORD',
			interval: 300,
			url: 'https://acme.example/login',
			timeout: 30,
			keywordType: 'ALERT_NOT_EXISTS',
			keywordCaseType: 'CaseInsensitive',
			keywordValue: 'Application error',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			keywordType: 'ALERT_NOT_EXISTS',
			keywordValue: 'Application error',
		});
	});

	it('rejects an interval below UptimeRobot minimum', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'Too eager',
				type: 'PING',
				interval: 10,
				url: 'acme.example',
			}),
		).rejects.toThrow();
	});

	it('updates only the fields given', async () => {
		respond(fetchMock, { ...monitor, friendlyName: 'Storefront (prod)' });

		await invoke(Monitors.update, {
			id: 778_001,
			friendlyName: 'Storefront (prod)',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v3/monitors/778001');
		expect(sent.body).toEqual({ friendlyName: 'Storefront (prod)' });
	});

	it('states what a delete did, since the answer has no body', async () => {
		respondEmpty(fetchMock, 204);

		const result = await invoke(Monitors.remove, { id: 778_001 });

		expect(result).toEqual({ id: 778_001, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('pauses a monitor and reports its new status', async () => {
		respond(fetchMock, pausedMonitor, 201);

		const result = await invoke(Monitors.pause, { id: 778_001 });

		expect(result).toEqual(pausedMonitor);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v3/monitors/778001/pause');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.monitors.pause',
			{ id: 778_001, status: 'PAUSED' },
			'completed',
		);
	});

	it('starts a monitor', async () => {
		respond(fetchMock, monitor, 201);

		await invoke(Monitors.start, { id: 778_001 });

		expect(lastRequest(fetchMock).path).toBe('/v3/monitors/778001/start');
	});

	it('states what a reset did, since the answer has no body', async () => {
		respondEmpty(fetchMock, 201);

		const result = await invoke(Monitors.reset, { id: 778_001 });

		expect(result).toEqual({ id: 778_001, reset: true });
		expect(lastRequest(fetchMock).path).toBe('/v3/monitors/778001/reset');
	});

	it('surfaces a bad key as an UptimeRobotAPIError', async () => {
		respond(fetchMock, invalidToken, 401);

		await expect(invoke(Monitors.get, { id: 1 })).rejects.toBeInstanceOf(
			UptimeRobotAPIError,
		);
	});
});

describe('stats', () => {
	it('reads aggregate uptime for a timeframe', async () => {
		respond(fetchMock, uptimeStats);

		const result = await invoke(Stats.uptime, { timeFrame: 'DAYS_30' });

		expect(result).toEqual(uptimeStats);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/monitors/uptime-stats');
		expect(sent.query.timeFrame).toBe('DAYS_30');
	});

	it('sends the bounds for a CUSTOM range', async () => {
		respond(fetchMock, uptimeStats);

		await invoke(Stats.uptime, {
			timeFrame: 'CUSTOM',
			start: 1_759_000_000,
			end: 1_759_600_000,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.start).toBe('1759000000');
		expect(sent.query.end).toBe('1759600000');
	});

	it('rejects CUSTOM without a start', async () => {
		await expect(invoke(Stats.uptime, { timeFrame: 'CUSTOM' })).rejects.toThrow(
			'CUSTOM needs a start.',
		);
	});

	it('rejects a range that ends before it starts', async () => {
		await expect(
			invoke(Stats.uptime, {
				timeFrame: 'CUSTOM',
				start: 1_759_600_000,
				end: 1_759_000_000,
			}),
		).rejects.toThrow('end must be after start.');
	});

	it('reads one monitor uptime', async () => {
		respond(fetchMock, monitorUptime);

		const result = await invoke(Stats.monitorUptime, {
			id: 778_001,
			from: '2025-09-01T00:00:00Z',
		});

		expect(result).toEqual(monitorUptime);
		expect(lastRequest(fetchMock).path).toBe(
			'/v3/monitors/778001/stats/uptime',
		);
	});

	it('reads response time with the time series', async () => {
		respond(fetchMock, responseTime);

		const result = await invoke(Stats.responseTime, {
			id: 778_001,
			includeTimeSeries: true,
		});

		expect(result).toEqual(responseTime);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/monitors/778001/stats/response-time');
		expect(sent.query.includeTimeSeries).toBe('true');
	});
});

describe('incidents', () => {
	it('lists incidents newest first', async () => {
		respond(fetchMock, incidentsPage);

		const result = await invoke(Incidents.list, { limit: 50 });

		expect(result).toEqual(incidentsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/incidents');
		expect(sent.query.limit).toBe('50');
	});

	it('passes the filters through in the documented names', async () => {
		respond(fetchMock, incidentsPage);

		await invoke(Incidents.list, {
			monitor_id: 778_001,
			monitor_name: 'storefront',
			started_after: '2025-09-01T00:00:00Z',
			type: 'Downtime',
			cause: '5xx',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.monitor_id).toBe('778001');
		expect(sent.query.monitor_name).toBe('storefront');
		expect(sent.query.started_after).toBe('2025-09-01T00:00:00Z');
		expect(sent.query.type).toBe('Downtime');
		expect(sent.query.cause).toBe('5xx');
	});

	it('keeps paging on an empty page while nextLink is set', async () => {
		respond(fetchMock, incidentsFilteredPage);

		await invoke(Incidents.list, { cause: 'DNS' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.incidents.list',
			{ count: 0, hasMore: true },
			'completed',
		);
	});

	it('reads one incident', async () => {
		respond(fetchMock, incidentWithRootCause);

		const result = await invoke(Incidents.get, { id: incident.id });

		expect(result).toEqual(incidentWithRootCause);
		expect(lastRequest(fetchMock).path).toBe(`/v3/incidents/${incident.id}`);
	});

	it('lists the comments on an incident', async () => {
		respond(fetchMock, incidentCommentsPage);

		const result = await invoke(Incidents.comments, { id: incident.id });

		expect(result).toEqual(incidentCommentsPage);
		expect(lastRequest(fetchMock).path).toBe(
			`/v3/incidents/${incident.id}/comments`,
		);
	});

	it('adds a comment, defaulting to not published', async () => {
		respond(fetchMock, incidentComment, 201);

		await invoke(Incidents.addComment, {
			id: incident.id,
			content: 'Rolled back the deployment.',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/v3/incidents/${incident.id}/comments`);
		expect(sent.body).toEqual({
			content: 'Rolled back the deployment.',
			publishOnStatusPage: undefined,
		});
	});
});

describe('status pages', () => {
	it('lists status pages', async () => {
		respond(fetchMock, statusPagesPage);

		await expect(invoke(StatusPages.list, {})).resolves.toEqual(
			statusPagesPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/v3/psps');
	});

	it('reads one status page', async () => {
		respond(fetchMock, statusPage);

		await expect(invoke(StatusPages.get, { id: 2_214 })).resolves.toEqual(
			statusPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/v3/psps/2214');
	});

	it('creates a status page', async () => {
		respond(fetchMock, statusPage, 201);

		await invoke(StatusPages.create, {
			friendlyName: 'Acme status',
			monitorIds: [778_001, 778_002],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v3/psps');
		expect(sent.body).toEqual({
			friendlyName: 'Acme status',
			monitorIds: [778_001, 778_002],
		});
	});

	it('accepts the every-monitor sentinel', async () => {
		respond(fetchMock, statusPage, 201);

		await invoke(StatusPages.create, {
			friendlyName: 'Everything',
			monitorIds: [0],
		});

		expect(lastRequest(fetchMock).body).toMatchObject({ monitorIds: [0] });
	});

	it('states what a status page delete did', async () => {
		respondEmpty(fetchMock, 200);

		await expect(invoke(StatusPages.remove, { id: 2_214 })).resolves.toEqual({
			id: 2_214,
			deleted: true,
		});
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('lists announcements, filtered by status', async () => {
		respond(fetchMock, announcementsPage);

		const result = await invoke(StatusPages.announcements, {
			pspId: 2_214,
			status: 'PUBLISHED',
		});

		expect(result).toEqual(announcementsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/psps/2214/announcements');
		expect(sent.query.status).toBe('PUBLISHED');
	});

	it('creates an announcement', async () => {
		respond(fetchMock, announcement, 201);

		await invoke(StatusPages.createAnnouncement, {
			pspId: 2_214,
			title: 'Planned database maintenance',
			content: 'We will be performing scheduled maintenance.',
			status: 'Published',
			type: 'Maintenance',
			startDate: '2025-10-01T02:00:00.000Z',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v3/psps/2214/announcements');
		expect(sent.body).toEqual({
			title: 'Planned database maintenance',
			content: 'We will be performing scheduled maintenance.',
			status: 'Published',
			type: 'Maintenance',
			startDate: '2025-10-01T02:00:00.000Z',
		});
	});
});

describe('maintenance windows', () => {
	it('lists maintenance windows', async () => {
		respond(fetchMock, maintenanceWindowsPage);

		await expect(invoke(MaintenanceWindows.list, {})).resolves.toEqual(
			maintenanceWindowsPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/v3/maintenance-windows');
	});

	it('creates a weekly window', async () => {
		respond(fetchMock, maintenanceWindow, 201);

		await invoke(MaintenanceWindows.create, {
			name: 'Sunday release window',
			interval: 'weekly',
			date: '2025-10-05',
			time: '02:00:00',
			duration: 120,
			days: [7],
			monitorIds: [778_001],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v3/maintenance-windows');
		expect(sent.body).toMatchObject({ interval: 'weekly', days: [7] });
	});

	it('rejects a time that is not HH:mm:ss', async () => {
		await expect(
			invoke(MaintenanceWindows.create, {
				name: 'Bad time',
				interval: 'once',
				date: '2025-10-05',
				time: '2am',
				duration: 60,
			}),
		).rejects.toThrow();
	});

	it('updates a window status', async () => {
		respond(fetchMock, { ...maintenanceWindow, status: 'paused' });

		await invoke(MaintenanceWindows.update, { id: 3_317, status: 'paused' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v3/maintenance-windows/3317');
		expect(sent.body).toEqual({ status: 'paused' });
	});

	it('states what a window delete did', async () => {
		respondEmpty(fetchMock, 204);

		await expect(
			invoke(MaintenanceWindows.remove, { id: 3_317 }),
		).resolves.toEqual({ id: 3_317, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});

describe('monitor groups', () => {
	it('lists groups', async () => {
		respond(fetchMock, monitorGroupsPage);

		await expect(invoke(MonitorGroups.list, {})).resolves.toEqual(
			monitorGroupsPage,
		);
		expect(lastRequest(fetchMock).path).toBe('/v3/monitor-groups');
	});

	it('creates a group from monitor ids', async () => {
		respond(fetchMock, monitorGroup, 201);

		await invoke(MonitorGroups.create, {
			name: 'Storefront',
			monitorIds: [778_001],
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({ name: 'Storefront', monitorIds: [778_001] });
	});

	it('states what a group delete did', async () => {
		respondEmpty(fetchMock, 204);

		await expect(invoke(MonitorGroups.remove, { id: 1_102 })).resolves.toEqual({
			id: 1_102,
			deleted: true,
		});
	});
});

describe('tags', () => {
	it('lists tags paging by nextCursorId', async () => {
		respond(fetchMock, tagsFirstPage);

		const result = await invoke(Tags.list, {});

		expect(result).toEqual(tagsFirstPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/v3/tags');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.tags.list',
			{ count: 1, hasMore: true },
			'completed',
		);
	});

	it('reports no more pages when the cursor is null', async () => {
		respond(fetchMock, tagsPage);

		await invoke(Tags.list, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.tags.list',
			{ count: 1, hasMore: false },
			'completed',
		);
	});

	it('states what a tag delete did', async () => {
		respondEmpty(fetchMock, 204);

		await expect(invoke(Tags.remove, { id: tag.id })).resolves.toEqual({
			id: tag.id,
			deleted: true,
		});
	});
});

describe('account', () => {
	it('reads the account behind the key', async () => {
		respond(fetchMock, user);

		const result = await invoke(Account.me, {});

		expect(result).toEqual(user);
		expect(lastRequest(fetchMock).path).toBe('/v3/user/me');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'uptimerobot.account.me',
			{ plan: 'Solo', monitors: 12, limit: 50 },
			'completed',
		);
	});

	it('reports a healthy monitor with no last incident', async () => {
		respond(fetchMock, healthyMonitor);

		const result = await invoke(Monitors.get, { id: 778_002 });
		expect(result).toEqual(healthyMonitor);
	});
});

describe('review fixes', () => {
	it('accepts an opaque incident cursor and sends it back verbatim', async () => {
		respond(fetchMock, { data: [], nextLink: null });

		// The v3 cursor is a string, not a number.
		await invoke(Incidents.list, { cursor: 'MTc4OTA0' });

		expect(lastRequest(fetchMock).query.cursor).toBe('MTc4OTA0');
	});

	it('accepts an empty monitor selection, which shows no monitors', async () => {
		respond(fetchMock, { id: 9, friendlyName: 'Status' });

		await invoke(StatusPages.create, {
			friendlyName: 'Status',
			monitorIds: [],
			autoAddMonitors: true,
		});

		const sent = lastRequest(fetchMock).body as { monitorIds?: number[] };
		expect(sent.monitorIds).toEqual([]);
	});

	it('publishes an announcement immediately when no start date is given', async () => {
		respond(fetchMock, announcement);

		await invoke(StatusPages.createAnnouncement, {
			pspId: 42,
			title: 'All clear',
			content: 'Everything is back to normal.',
			status: 'Published',
			type: 'Info',
		});

		// unknown: the sent body is whatever the endpoint serialized; only one key is read.
		const sent = lastRequest(fetchMock).body as Record<string, unknown>;
		expect(sent.startDate).toBeUndefined();
	});

	it('sends a JSON body on a monitor action so the content type is set', async () => {
		respond(fetchMock, monitor);

		await invoke(Monitors.pause, { id: 778_001 });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		// The body is present so the transport sets a JSON content type, which
		// UptimeRobot requires on these actions.
		expect(request.body).toEqual({});
		expect(
			request.headers['content-type'] ?? request.headers['Content-Type'],
		).toContain('application/json');
	});

	it('passes monitor config and HTTP settings through instead of dropping them', async () => {
		respond(fetchMock, monitor);

		await invoke(Monitors.create, {
			friendlyName: 'Acme API',
			type: 'API',
			interval: 60,
			url: 'https://api.acme.example/health',
			timeout: 30,
			config: { apiAssertions: { assertions: [] } },
			httpMethodType: 'POST',
			customHttpHeaders: { 'X-Token': 'abc' },
		});

		// unknown: the sent body is whatever the endpoint serialized; a few keys are read.
		const body = lastRequest(fetchMock).body as Record<string, unknown>;
		expect(body.config).toEqual({ apiAssertions: { assertions: [] } });
		expect(body.httpMethodType).toBe('POST');
		expect(body.customHttpHeaders).toEqual({ 'X-Token': 'abc' });
	});

	it('creates a third-party service monitor from a provider id alone', async () => {
		respond(fetchMock, monitor);

		await invoke(Monitors.create, {
			type: 'THIRD_PARTY_SERVICE',
			config: { thirdPartyService: { providerId: 4317 } },
		});

		// unknown: the sent body is whatever the endpoint serialized; a few keys are read.
		const body = lastRequest(fetchMock).body as Record<string, unknown>;
		expect(body.type).toBe('THIRD_PARTY_SERVICE');
		expect(body.url).toBeUndefined();
		expect(body.friendlyName).toBeUndefined();
	});
});

describe('fixes from the 11-12 review and live run', () => {
	it('requires a timeout on an HTTP monitor, which UptimeRobot rejects without one', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'No timeout',
				type: 'HTTP',
				interval: 300,
				url: 'https://shop.acme.example',
			}),
		).rejects.toThrow('A HTTP monitor needs a timeout.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('caps the timeout at 60 seconds, as UptimeRobot does', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'Slow',
				type: 'HTTP',
				interval: 300,
				url: 'https://shop.acme.example',
				timeout: 90,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires keywordValue on a KEYWORD monitor', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'Login page',
				type: 'KEYWORD',
				interval: 300,
				url: 'https://acme.example/login',
				timeout: 30,
				keywordType: 'ALERT_NOT_EXISTS',
				keywordCaseType: 'CaseInsensitive',
			}),
		).rejects.toThrow('A KEYWORD monitor needs keywordValue.');
	});

	it('requires config on a DNS monitor', async () => {
		await expect(
			invoke(Monitors.create, {
				friendlyName: 'DNS',
				type: 'DNS',
				interval: 300,
				url: 'acme.example',
			}),
		).rejects.toThrow('A DNS monitor needs config.');
	});
});
