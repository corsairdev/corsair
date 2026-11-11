// Response bodies built from the examples in
// https://cdn.uptimerobot.com/api/openapi.yaml, with made-up names and hosts.
// They were not captured from the live API.

export const monitor = {
	id: 778_001,
	friendlyName: 'Acme storefront',
	url: 'https://shop.acme.example',
	type: 'HTTP',
	status: 'UP',
	interval: 300,
	timeout: 30,
	createDateTime: '2025-04-02T09:14:00.000Z',
	groupId: 0,
	customFields: { environment: 'production' },
	tags: [{ id: 11, name: 'production', color: '#2563eb' }],
	assignedAlertContacts: [{ alertContactId: 42, threshold: 0, recurrence: 0 }],
	lastIncident: {
		id: 'inc_778001',
		status: { code: 'RESOLVED' },
		cause: 1,
		reason: 'HTTP 503 returned',
		startedAt: '2025-09-18T02:11:00.000Z',
		duration: 312,
	},
};

/** A monitor that has never failed has no lastIncident at all. */
export const healthyMonitor = {
	id: 778_002,
	friendlyName: 'Acme API',
	url: 'https://api.acme.example/health',
	type: 'HTTP',
	status: 'UP',
	interval: 60,
	timeout: 30,
	createDateTime: '2025-06-01T12:00:00.000Z',
	groupId: null,
	customFields: null,
	tags: [],
	assignedAlertContacts: [],
	lastIncident: null,
};

export const monitorsPage = {
	data: [monitor, healthyMonitor],
	nextLink: 'https://api.uptimerobot.com/v3/monitors?cursor=778002',
};

export const monitorsLastPage = {
	data: [healthyMonitor],
	nextLink: null,
};

/** A heartbeat monitor is its own ping endpoint and takes no url. */
export const heartbeatMonitor = {
	id: 778_003,
	friendlyName: 'Nightly backup',
	type: 'HEARTBEAT',
	status: 'STARTED',
	interval: 86_400,
	gracePeriod: 3600,
	heartbeatUrl: 'https://heartbeat.uptimerobot.com/abc123',
	url: null,
	createDateTime: '2025-07-04T22:00:00.000Z',
};

export const pausedMonitor = {
	...monitor,
	status: 'PAUSED',
};

export const user = {
	email: 'ops@acme.example',
	fullName: 'Jordan Ruiz',
	monitorsCount: 12,
	monitorLimit: 50,
	dependencyMonitorsCount: 0,
	dependencyMonitorLimit: 0,
	smsCredits: 20,
	activeSubscription: {
		plan: 'Solo',
		monitorLimit: 50,
		expirationDate: '2027-01-01T00:00:00.000Z',
		status: 'active',
	},
};

export const uptimeStats = {
	overallUptime: 99.982,
	totalIncidents: 3,
	totalTimeWithoutIncidents: 2_591_000,
	affectedMonitors: 2,
	mtbf: 863_666,
	logs: [
		{
			type: 'DOWNTIME',
			datetime: '2025-09-18T02:11:00.000Z',
			duration: 312,
		},
	],
};

export const monitorUptime = {
	uptime: 99.94,
	total_downtime_seconds: 312,
	incident_count: 2,
	mtbf: 1_296_000,
	from: '2025-09-01T00:00:00.000Z',
	to: '2025-09-30T00:00:00.000Z',
};

export const responseTime = {
	summary: { min: 84, max: 1_902, avg: 213 },
	data_points: 2_880,
	from: '2025-09-01T00:00:00.000Z',
	to: '2025-09-02T00:00:00.000Z',
	time_series: [
		{ timestamp: '2025-09-01T00:00:00.000Z', value: 210 },
		{ timestamp: '2025-09-01T00:01:00.000Z', value: 198 },
	],
};

export const incident = {
	id: 'inc_778001',
	status: { code: 'RESOLVED' },
	cause: 1,
	reason: 'HTTP 503 returned',
	duration: 312,
	startedAt: '2025-09-18T02:11:00.000Z',
	resolvedAt: '2025-09-18T02:16:12.000Z',
};

export const incidentWithRootCause = {
	...incident,
	rootCause: {
		url: 'https://shop.acme.example',
		httpResponseCode: 503,
		responseDownloadUrl:
			'https://cdn.uptimerobot.com/incidents/inc_778001.html',
		requestHeaders: { 'User-Agent': 'UptimeRobot/3' },
		responseHeaders: { 'content-type': 'text/html' },
	},
};

export const incidentsPage = {
	data: [incident],
	nextLink: null,
};

/** A filtered page can be empty while more pages remain. */
export const incidentsFilteredPage = {
	data: [],
	nextLink: 'https://api.uptimerobot.com/v3/incidents?cursor=MTc4OTA0',
};

export const incidentComment = {
	id: 5_531,
	comment: 'Rolled back the deployment; traffic is healthy again.',
	publishOnStatusPage: true,
	created: '2025-09-18T02:20:00.000Z',
	user: { id: 7_001, fullName: 'Jordan Ruiz' },
};

export const incidentCommentsPage = {
	data: [incidentComment],
	nextLink: null,
};

export const statusPage = {
	id: 2_214,
	friendlyName: 'Acme status',
	customDomain: 'status.acme.example',
	isPasswordSet: false,
	monitorIds: [778_001, 778_002],
	tagIds: [],
	monitorsCount: 2,
	status: { code: 'UP' },
	urlKey: 'acme-status',
	homepageLink: 'https://acme.example',
	gaCode: null,
	logo: null,
	icon: null,
	hideUrlLinks: false,
	subscription: true,
	showCookieBar: false,
	pinnedAnnouncementId: null,
	noIndex: false,
};

export const statusPagesPage = {
	data: [statusPage],
	nextLink: null,
};

export const announcement = {
	id: 9_904,
	pspId: 2_214,
	title: 'Planned database maintenance',
	content:
		'We will be performing scheduled maintenance from 02:00 to 04:00 UTC.',
	status: 'Published',
	type: 'Maintenance',
	deliveryStatus: 'Sent',
	startDate: '2025-10-01T02:00:00.000Z',
	endDate: '2025-10-01T04:00:00.000Z',
	creationDate: '2025-09-25T10:00:00.000Z',
	submitDate: '2025-09-25T10:05:00.000Z',
	sentCount: 118,
};

export const announcementsPage = {
	data: [announcement],
	nextLink: null,
};

export const maintenanceWindow = {
	id: 3_317,
	name: 'Sunday release window',
	interval: 'weekly',
	date: '2025-10-05',
	time: '02:00:00',
	duration: 120,
	days: [7],
	monitorIds: [778_001],
	autoAddMonitors: false,
	status: 'active',
	created: '2025-09-20T08:00:00.000Z',
};

export const maintenanceWindowsPage = {
	data: [maintenanceWindow],
	nextLink: null,
};

export const monitorGroup = {
	id: 1_102,
	name: 'Storefront',
	createdAt: '2025-05-01T10:00:00.000Z',
	updatedAt: '2025-05-01T10:00:00.000Z',
};

export const monitorGroupsPage = {
	data: [monitorGroup],
	nextLink: null,
};

export const tag = { id: 11, name: 'production' };

/** Tags page by nextCursorId rather than by a link. */
export const tagsPage = { data: [tag], nextCursorId: null };

export const tagsFirstPage = { data: [tag], nextCursorId: 12 };

/** The error body every 4xx and 5xx uses. */
export const invalidToken = {
	code: '003-005',
	message: 'Invalid token.',
};

export const notFound = {
	code: '009-002',
	message: 'Monitor not found.',
};

/** A validation failure sends `message` as an array of per-field strings. */
export const validationFailure = {
	code: '000-005',
	statusCode: 400,
	error: 'Bad Request',
	message: ['friendlyName should not be empty', 'interval must be at least 30'],
};

export const rateLimited = {
	code: '000-006',
	message: 'You are sending too many requests. Slow down.',
};
