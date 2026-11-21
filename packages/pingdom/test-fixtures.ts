/**
 * Response fixtures shaped after the Pingdom API 3.1 spec
 * (docs.pingdom.com/API_3.1.yaml).
 */

export const unauthorized = {
	error: {
		statuscode: 401,
		statusdesc: 'Unauthorized',
		errormessage: 'Please provide a valid API token',
	},
};

export const checkSummary = {
	id: 100,
	name: 'mycheck',
	type: 'http',
	hostname: 'my.pingdom.com',
	lasterrortime: 1297446423,
	lasttesttime: 1300977363,
	lastresponsetime: 355,
	lastdownstart: 1297446423,
	lastdownend: 1297446546,
	created: 1297446423,
	paused: false,
	resolution: 5,
	status: 'up',
};

export const checksList = {
	checks: [checkSummary],
};

export const checkDetail = {
	check: {
		id: 100,
		name: 'mycheck',
		hostname: 'my.pingdom.com',
		type: {
			http: {
				url: '/path',
				encryption: true,
				port: 443,
				verify_certificate: true,
			},
		},
		created: 1297446423,
		paused: false,
		resolution: 5,
		sendnotificationwhendown: 3,
		notify_again_every: 0,
		notify_when_backup: true,
		userids: [111250],
		teamids: [63],
		integrationids: [42],
		tags: [{ name: 'prod', type: 'u' }],
		probe_filters: [{ region: 'EU' }],
		ipv6: false,
		status: 'up',
		lasterrortime: 1297446423,
		lasttesttime: 1300977363,
		lastresponsetime: 355,
	},
};

export const checkCreated = {
	check: { id: 138631, name: 'My new HTTP check' },
};

export const checkModified = {
	message: 'Modification of check successful',
};

export const checksDeleted = {
	message: 'Selected check(s) deleted',
};

export const analysisEntry = {
	id: 123,
	time: 1294245226,
	rootcause: { error: 'Connection refused' },
};

export const analysisList = { analysis: [analysisEntry] };

export const analysisRaw = {
	rootcause: { error: 'Connection refused', detail: [] },
};

export const result = {
	probeid: 33,
	time: 1294235764,
	status: 'up',
	responsetime: 205,
	probedesc: 'Amsterdam 2, Netherlands',
	probeip: '85.17.97.15',
	version: '1.4',
	activelytested: true,
	checkid: 100,
	checkname: 'mycheck',
	hostname: 'my.pingdom.com',
};

export const resultsList = { results: [result] };

export const summaryAverage = {
	summary: {
		responsetime: { from: 0, to: 1294245226, avgresponse: 458 },
		status: { totalup: 253, totalunknown: 0 },
	},
};

// Live shape (11-21): a top-level hoursofday array.
export const summaryHoursOfDay = {
	hoursofday: [{ hour: 0, avgresponse: 350 }],
};

export const summaryOutage = {
	summary: {
		state: 'up',
		outages: [{ status: 'down', timefrom: 1297446423 }],
	},
};

export const summaryPerformance = {
	summary: {
		weeks: [{ starttime: 1287957600, avgresponse: 468, uptime: 99.9 }],
	},
};

// Live shape (11-21): a top-level array of probe ids.
export const summaryProbes = {
	probes: [33, 34],
};

export const action = {
	username: 'John Doe',
	userid: 111250,
	checkid: 241688,
	checkname: 'mycheck',
	time: 1292248276,
	via: 'sms',
};

export const actionsList = {
	actions: { alerts: [action] },
};

export const credits = {
	credits: {
		checklimit: 18,
		availablechecks: 5,
		useddefault: 6,
		usedtransaction: 7,
		availablesms: 20,
		availablesmstests: 10,
	},
};

export const probe = {
	id: 2,
	country: 'United States',
	city: 'New York',
	name: 'New York, NY',
	active: true,
	hostname: 's413.pingdom.com',
	ip: '70.32.40.2',
	ipv6: '2001:0db8:85a3::',
	region: 'NA',
};

export const probesList = { probes: [probe] };

export const singleResult = {
	result: {
		status: 'up',
		responsetime: 73,
		statusdesc: 'OK',
		statusdesclong: 'OK',
		probeid: 17,
		probedesc: 'Stockholm, Sweden',
	},
};

export const maintenanceWindow = {
	id: 777,
	description: 'Maintenance window from DB',
	from: 1500471702,
	to: 1500475302,
	duration: 1,
	durationunit: 'hour',
	recurrencetype: 'week',
	repeatevery: 1,
	dayofweekinmonth: 0,
	effectiveto: 1503063702,
	checks: { uptime: [100], tms: [] },
};

export const maintenanceList = { maintenance: [maintenanceWindow] };

export const maintenanceCreated = {
	maintenance: { id: 777 },
};

export const maintenanceModified = {
	message: 'Maintenance window successfully modified!',
};

export const occurrence = {
	id: 3,
	maintenanceid: 777,
	from: 1500471702,
	to: 1500475302,
	duration: 1,
	durationunit: 'hour',
};

// Shapes as the live API answered them (11-21).
export const occurrencesList = { occurrences: [occurrence] };

export const team = {
	id: 63,
	name: 'Engineering',
	members: [{ id: 111250, name: 'John Doe' }],
};

export const teamsList = { teams: [team] };

export const teamCreated = { team: { id: 12345678 } };

export const contact = {
	id: 111250,
	name: 'John Doe',
	paused: false,
	type: 'contact',
	notification_targets: {
		email: [
			{ severity: 'HIGH', address: 'john@example.com' },
			{ severity: 'LOW', address: 'john@example.com' },
		],
	},
	teams: [{ id: 63, name: 'Engineering' }],
};

export const contactsList = { contacts: [contact] };

export const contactCreated = { contact: { id: 12345678 } };
