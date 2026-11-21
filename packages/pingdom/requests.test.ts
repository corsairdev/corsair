import { logEventFromContext } from 'corsair/core';
import {
	Alerting,
	Checks,
	Maintenance,
	Occurrences,
	Results,
	Summaries,
	Tools,
} from './endpoints';
import {
	checkCreated,
	checkDetail,
	checkModified,
	checksDeleted,
	checksList,
	contactCreated,
	contactsList,
	credits,
	maintenanceCreated,
	maintenanceList,
	maintenanceModified,
	occurrencesList,
	probesList,
	resultsList,
	singleResult,
	summaryAverage,
	summaryHoursOfDay,
	summaryProbes,
	teamsList,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'pd-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: TOKEN, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
	};
}

function expectCall(expected: Partial<ReturnType<typeof lastRequest>>) {
	const sent = lastRequest();
	for (const [key, value] of Object.entries(expected)) {
		expect(sent[key as keyof typeof sent]).toEqual(value);
	}
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('checks', () => {
	it('list sends paging and tag filters', async () => {
		respond(checksList);
		await invoke(Checks.list, {
			limit: 20,
			offset: 40,
			includeTags: true,
			tags: 'prod',
		});
		expectCall({
			origin: 'https://api.pingdom.com',
			path: '/api/3.1/checks',
			query: { limit: '20', offset: '40', include_tags: 'true', tags: 'prod' },
			method: 'GET',
		});
		expect(lastRequest().headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('create maps type settings and common fields onto the body', async () => {
		respond(checkCreated);
		await invoke(Checks.create, {
			name: 'api',
			host: 'example.com',
			type: 'http',
			typeSettings: { url: '/health', encryption: true, port: 443 },
			resolution: '5',
			teamIds: [63],
			probeFilters: [{ region: 'EU' }],
			notifyWhenBackup: true,
		});
		expectCall({
			path: '/api/3.1/checks',
			method: 'POST',
			body: {
				name: 'api',
				host: 'example.com',
				type: 'http',
				url: '/health',
				encryption: true,
				port: 443,
				resolution: 5,
				teamids: [63],
				probe_filters: [{ region: 'EU' }],
				notifywhenbackup: true,
			},
		});
	});

	it('get, update and delete hang off the check id', async () => {
		respond(checkDetail);
		await invoke(Checks.get, { checkId: 100 });
		expectCall({ path: '/api/3.1/checks/100', method: 'GET' });

		respond(checkModified);
		await invoke(Checks.update, { checkId: 100, name: 'renamed' });
		expectCall({
			path: '/api/3.1/checks/100',
			method: 'PUT',
			body: { name: 'renamed' },
		});

		respond(checksDeleted);
		await invoke(Checks.deleteCheck, { checkId: 100 });
		expectCall({ path: '/api/3.1/checks/100', method: 'DELETE' });
	});

	it('multi pause and delete use the collection route', async () => {
		respond(checkModified);
		await invoke(Checks.updateMulti, { checkIds: [1, 2], paused: true });
		expectCall({
			path: '/api/3.1/checks',
			method: 'PUT',
			body: { checkids: '1,2', paused: true },
		});
		// Without checkids Pingdom changes every check in the account.
		await expect(
			invoke(Checks.updateMulti, { paused: true }),
		).rejects.toThrow();

		respond(checksDeleted);
		await invoke(Checks.deleteMulti, { checkIds: [1, 2, 3] });
		expectCall({
			path: '/api/3.1/checks',
			method: 'DELETE',
			query: { delcheckids: '1,2,3' },
		});
	});
});

describe('results and summaries', () => {
	it('results sends the filters', async () => {
		respond(resultsList);
		await invoke(Results.listResults, {
			checkId: 100,
			from: 1000,
			to: 2000,
			probes: '33,17',
			status: 'down',
			limit: 50,
		});
		expectCall({
			path: '/api/3.1/results/100',
			query: {
				from: '1000',
				to: '2000',
				probes: '33,17',
				status: 'down',
				limit: '50',
			},
		});
	});

	it('analysis hangs off the check and analysis ids', async () => {
		respond({ analysis: [] });
		await invoke(Results.listAnalysis, { checkId: 100 });
		expectCall({ path: '/api/3.1/analysis/100' });

		respond({});
		await invoke(Results.getAnalysis, { checkId: 100, analysisId: 123 });
		expectCall({ path: '/api/3.1/analysis/100/123' });
	});

	it('summaries hit their routes', async () => {
		respond(summaryAverage);
		await invoke(Summaries.average, {
			checkId: 100,
			byCountry: true,
			includeUptime: true,
		});
		expectCall({
			path: '/api/3.1/summary.average/100',
			query: { bycountry: 'true', includeuptime: 'true' },
		});

		respond(summaryHoursOfDay);
		await invoke(Summaries.hoursOfDay, { checkId: 100 });
		expectCall({ path: '/api/3.1/summary.hoursofday/100' });

		respond({ summary: {} });
		await invoke(Summaries.outage, { checkId: 100 });
		expectCall({ path: '/api/3.1/summary.outage/100' });

		respond({ summary: {} });
		await invoke(Summaries.performance, { checkId: 100, resolution: 'week' });
		expectCall({
			path: '/api/3.1/summary.performance/100',
			query: { resolution: 'week' },
		});

		respond(summaryProbes);
		await invoke(Summaries.probes, { checkId: 100 });
		expectCall({ path: '/api/3.1/summary.probes/100' });
	});
});

describe('tools', () => {
	it('actions send the check filter', async () => {
		respond({ actions: { alerts: [] } });
		await invoke(Tools.listActions, { checkId: 100 });
		expectCall({
			path: '/api/3.1/actions',
			query: { checkids: '100' },
		});
	});

	it('credits and probes hit their routes', async () => {
		respond(credits);
		const cr = (await invoke(Tools.getCredits, {})) as {
			credits?: { availablesms?: number };
		};
		expect(cr.credits?.availablesms).toBe(20);
		expectCall({ path: '/api/3.1/credits' });

		respond(probesList);
		await invoke(Tools.listProbes, {});
		expectCall({ path: '/api/3.1/probes' });
	});

	it('reference hits its route', async () => {
		respond({ regions: [{ id: 1, description: 'EU' }] });
		await invoke(Tools.getReference, {});
		expectCall({ path: '/api/3.1/reference' });
	});

	it('single sends the host', async () => {
		respond(singleResult);
		await invoke(Tools.runSingle, {
			host: 'example.com',
			type: 'http',
			typeSettings: { encryption: true, url: '/' },
		});
		expectCall({
			path: '/api/3.1/single',
			query: {
				host: 'example.com',
				type: 'http',
				encryption: 'true',
				url: '/',
			},
		});
	});
});

describe('maintenance', () => {
	it('create posts the window body', async () => {
		respond(maintenanceCreated);
		await invoke(Maintenance.create, {
			description: 'New window',
			from: 1500471702,
			to: 1500475302,
			recurrenceType: 'week',
			repeatEvery: 1,
			uptimeIds: [100],
			effectiveTo: 1503063702,
		});
		expectCall({
			path: '/api/3.1/maintenance',
			method: 'POST',
			body: {
				description: 'New window',
				from: 1500471702,
				to: 1500475302,
				recurrencetype: 'week',
				repeatevery: 1,
				uptimeids: [100],
				effectiveto: 1503063702,
			},
		});
	});

	it('update posts only the given fields and multi delete uses the query', async () => {
		respond(maintenanceModified);
		await invoke(Maintenance.update, {
			id: 777,
			description: 'Changed',
			from: 1500471702,
			to: 1500475302,
			recurrenceType: 'none',
		});
		expectCall({
			path: '/api/3.1/maintenance/777',
			method: 'PUT',
			body: {
				description: 'Changed',
				from: 1500471702,
				to: 1500475302,
				recurrencetype: 'none',
			},
		});

		respond(checksDeleted);
		await invoke(Maintenance.deleteMulti, { windowIds: [1, 2] });
		expectCall({
			path: '/api/3.1/maintenance',
			method: 'DELETE',
			query: { maintenanceids: '1,2' },
		});
	});

	it('list and delete hang off the window routes', async () => {
		respond(maintenanceList);
		await invoke(Maintenance.list, { limit: 10 });
		expectCall({
			path: '/api/3.1/maintenance',
			query: { limit: '10' },
		});

		respond(checksDeleted);
		await invoke(Maintenance.deleteWindow, { id: 777 });
		expectCall({ path: '/api/3.1/maintenance/777', method: 'DELETE' });
	});

	it('occurrences hit the occurrences routes', async () => {
		respond(occurrencesList);
		await invoke(Occurrences.list, { maintenanceId: 777 });
		expectCall({
			path: '/api/3.1/maintenance.occurrences',
			query: { maintenanceid: '777' },
		});

		respond({});
		await invoke(Occurrences.update, {
			id: 3,
			from: 1500471702,
			to: 1500475302,
		});
		expectCall({
			path: '/api/3.1/maintenance.occurrences/3',
			method: 'PUT',
			body: { from: 1500471702, to: 1500475302 },
		});

		respond(checksDeleted);
		await invoke(Occurrences.deleteOccurrence, { id: 3 });
		expectCall({
			path: '/api/3.1/maintenance.occurrences/3',
			method: 'DELETE',
		});
	});
});

describe('alerting', () => {
	it('contact get and delete hang off the contact id', async () => {
		respond({ contact: contactsList.contacts[0] });
		await invoke(Alerting.getContact, { contactId: 14901345 });
		expectCall({ path: '/api/3.1/alerting/contacts/14901345' });

		respond(checksDeleted);
		await invoke(Alerting.deleteContact, { contactId: 14901345 });
		expectCall({
			path: '/api/3.1/alerting/contacts/14901345',
			method: 'DELETE',
		});
	});

	it('occurrence get hangs off the occurrence id', async () => {
		respond({ occurrence: { id: 3, maintenanceid: 777, from: 1, to: 2 } });
		await invoke(Occurrences.get, { id: 3 });
		expectCall({ path: '/api/3.1/maintenance.occurrences/3' });
	});

	it('team create and update send the member ids', async () => {
		respond({ team: { id: 12345678 } });
		await invoke(Alerting.createTeam, {
			name: 'API Team',
			memberIds: [12345, 54321],
		});
		expectCall({
			path: '/api/3.1/alerting/teams',
			method: 'POST',
			body: { name: 'API Team', member_ids: [12345, 54321] },
		});

		respond({ team: teamsList.teams[0] });
		await invoke(Alerting.updateTeam, {
			teamId: 63,
			name: 'Engineering',
			memberIds: [111250],
		});
		expectCall({
			path: '/api/3.1/alerting/teams/63',
			method: 'PUT',
			body: { name: 'Engineering', member_ids: [111250] },
		});
	});

	it('team get and delete hang off the team id', async () => {
		respond({ team: teamsList.teams[0] });
		await invoke(Alerting.getTeam, { teamId: 63 });
		expectCall({ path: '/api/3.1/alerting/teams/63' });

		respond(checksDeleted);
		await invoke(Alerting.deleteTeam, { teamId: 63 });
		expectCall({
			path: '/api/3.1/alerting/teams/63',
			method: 'DELETE',
		});
	});

	it('contact create and update map the notification targets', async () => {
		respond(contactCreated);
		await invoke(Alerting.createContact, {
			name: 'John Doe',
			notificationTargets: [
				{ email: 'john@example.com', severity: 'HIGH' },
				{ number: '5555555', countryCode: '372', severity: 'LOW' },
			],
		});
		expectCall({
			path: '/api/3.1/alerting/contacts',
			method: 'POST',
			body: {
				name: 'John Doe',
				notification_targets: {
					email: [{ severity: 'HIGH', address: 'john@example.com' }],
					sms: [{ severity: 'LOW', country_code: '372', number: '5555555' }],
				},
			},
		});

		respond({ contact: contactsList.contacts[0] });
		await invoke(Alerting.updateContact, {
			contactId: 111250,
			name: 'John Doe',
			paused: true,
			notificationTargets: [
				{ email: 'john@example.com', severity: 'HIGH' },
				{ email: 'john@example.com', severity: 'LOW' },
			],
		});
		expectCall({
			path: '/api/3.1/alerting/contacts/111250',
			method: 'PUT',
			body: {
				name: 'John Doe',
				paused: true,
				notification_targets: {
					email: [
						{ severity: 'HIGH', address: 'john@example.com' },
						{ severity: 'LOW', address: 'john@example.com' },
					],
				},
			},
		});
		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('notification_targets');
	});
});
