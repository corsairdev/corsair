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
	action,
	actionsList,
	analysisList,
	analysisRaw,
	checkCreated,
	checkDetail,
	checksList,
	contactCreated,
	contactsList,
	credits,
	maintenanceCreated,
	maintenanceList,
	maintenanceModified,
	maintenanceWindow,
	occurrence,
	occurrencesList,
	probe,
	probesList,
	resultsList,
	singleResult,
	summaryAverage,
	summaryHoursOfDay,
	summaryOutage,
	summaryPerformance,
	summaryProbes,
	teamCreated,
	teamsList,
	unauthorized,
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
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

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses a checks page', async () => {
		respond(checksList);
		const page = (await invoke(Checks.list, {})) as {
			checks: Array<{ id?: number; status?: string }>;
		};
		expect(page.checks[0]?.id).toBe(100);
		expect(page.checks[0]?.status).toBe('up');
	});

	it('parses a check detail with type settings', async () => {
		respond(checkDetail);
		const detail = (await invoke(Checks.get, { checkId: 100 })) as {
			check?: { type?: Record<string, unknown> };
		};
		expect(detail.check?.type?.http).toBeDefined();
	});

	it('parses a created check reference', async () => {
		respond(checkCreated, 200);
		const created = (await invoke(Checks.create, {
			name: 'My new HTTP check',
			host: 'example.com',
			type: 'http',
			typeSettings: { url: '/', encryption: true },
		})) as { check?: { id?: number } };
		expect(created.check?.id).toBe(138631);
	});

	it('parses analysis lists and raw results', async () => {
		respond(analysisList);
		const page = (await invoke(Results.listAnalysis, {
			checkId: 100,
		})) as { analysis?: Array<{ id?: number }> };
		expect(page.analysis?.[0]?.id).toBe(123);

		respond(analysisRaw);
		const raw = (await invoke(Results.getAnalysis, {
			checkId: 100,
			analysisId: 123,
		})) as { rootcause?: unknown };
		expect(raw.rootcause).toBeDefined();
	});

	it('parses raw test results', async () => {
		respond(resultsList);
		const page = (await invoke(Results.listResults, {
			checkId: 100,
			status: 'up',
		})) as { results?: Array<{ status?: string }> };
		expect(page.results?.[0]?.status).toBe('up');
	});

	it('parses every summary shape', async () => {
		respond(summaryAverage);
		const avg = (await invoke(Summaries.average, { checkId: 100 })) as {
			summary?: { responsetime?: unknown };
		};
		expect(avg.summary?.responsetime).toBeDefined();

		respond(summaryHoursOfDay);
		const hod = (await invoke(Summaries.hoursOfDay, { checkId: 100 })) as {
			hoursofday?: unknown[];
		};
		expect(hod.hoursofday).toHaveLength(1);

		respond(summaryOutage);
		const outage = (await invoke(Summaries.outage, { checkId: 100 })) as {
			summary?: { state?: string };
		};
		expect(outage.summary?.state).toBe('up');

		respond(summaryPerformance);
		const perf = (await invoke(Summaries.performance, {
			checkId: 100,
			resolution: 'week',
		})) as { summary?: { weeks?: unknown[] } };
		expect(perf.summary?.weeks).toHaveLength(1);

		respond(summaryProbes);
		const sp = (await invoke(Summaries.probes, { checkId: 100 })) as {
			probes?: number[];
		};
		expect(sp.probes).toEqual([33, 34]);
	});

	it('parses actions, credits, probes and single check', async () => {
		respond(actionsList);
		const actions = (await invoke(Tools.listActions, { limit: 5 })) as {
			actions?: { alerts?: Array<{ via?: string }> };
		};
		expect(actions.actions?.alerts?.[0]?.via).toBe(action.via);

		respond(credits);
		const cr = (await invoke(Tools.getCredits, {})) as {
			credits?: { availablechecks?: number };
		};
		expect(cr.credits?.availablechecks).toBe(5);

		respond(probesList);
		const pr = (await invoke(Tools.listProbes, {})) as {
			probes?: Array<{ region?: string }>;
		};
		expect(pr.probes?.[0]?.region).toBe(probe.region);

		respond(singleResult);
		const single = (await invoke(Tools.runSingle, {
			host: 'example.com',
			type: 'http',
		})) as { result?: { status?: string } };
		expect(single.result?.status).toBe('up');
	});

	it('parses maintenance windows and occurrences', async () => {
		respond(maintenanceList);
		const page = (await invoke(Maintenance.list, {})) as {
			maintenance?: Array<{ id?: number }>;
		};
		expect(page.maintenance?.[0]?.id).toBe(777);

		respond(maintenanceCreated);
		const created = (await invoke(Maintenance.create, {
			description: 'New window',
			from: 1500471702,
			to: 1500475302,
			recurrenceType: 'week',
		})) as { maintenance?: { id?: number } };
		expect(created.maintenance?.id).toBe(777);

		respond({ maintenance: maintenanceWindow });
		const one = (await invoke(Maintenance.get, { id: 777 })) as {
			maintenance?: { description?: string };
		};
		expect(one.maintenance?.description).toBe('Maintenance window from DB');

		respond(maintenanceModified);
		const modified = (await invoke(Maintenance.update, {
			id: 777,
			description: 'Changed',
		})) as { message?: string };
		expect(modified.message).toBe('Maintenance window successfully modified!');

		respond(occurrencesList);
		const occPage = (await invoke(Occurrences.list, {
			maintenanceId: 777,
		})) as { occurrences?: Array<{ id?: number }> };
		expect(occPage.occurrences?.[0]?.id).toBe(occurrence.id);
	});

	it('parses teams and contacts', async () => {
		respond(teamsList);
		const page = (await invoke(Alerting.listTeams, {})) as {
			teams?: Array<{ name?: string; members?: unknown[] }>;
		};
		expect(page.teams?.[0]?.name).toBe('Engineering');

		respond(teamCreated);
		const created = (await invoke(Alerting.createTeam, {
			name: 'API Team',
			memberIds: [12345, 54321],
		})) as { team?: { id?: number } };
		expect(created.team?.id).toBe(12345678);

		respond(contactsList);
		const contacts = (await invoke(Alerting.listContacts, {})) as {
			contacts?: Array<{ notification_targets?: { email?: unknown[] } }>;
		};
		expect(contacts.contacts?.[0]?.notification_targets?.email).toHaveLength(2);

		respond(contactCreated);
		const contactOut = (await invoke(Alerting.createContact, {
			name: 'John Doe',
			notificationTargets: [{ email: 'john@example.com', severity: 'HIGH' }],
		})) as { contact?: { id?: number } };
		expect(contactOut.contact?.id).toBe(12345678);
	});

	it('raises the provider error message through an endpoint call', async () => {
		respond(unauthorized, 401);
		await expect(invoke(Checks.list, {})).rejects.toThrow(
			'Pingdom 401: Please provide a valid API token',
		);
	});
});

describe('input validation', () => {
	it('rejects a create without host or type', async () => {
		await rejects(Checks.create, { name: 'x' }, 'host');
		await rejects(Checks.create, { name: 'x', host: 'h' }, 'type');
	});

	it('rejects a resolution the spec does not enumerate', async () => {
		await rejects(
			Checks.create,
			{
				name: 'x',
				host: 'h',
				type: 'http',
				resolution: 3,
			},
			'resolution',
		);
	});

	it('rejects a results status the spec does not list', async () => {
		await rejects(
			Results.listResults,
			{ checkId: 100, status: 'flapping' },
			'status',
		);
	});

	it('rejects a maintenance window without description, from or to', async () => {
		await rejects(
			Maintenance.create,
			{ from: 1500471702, to: 1500475302, recurrenceType: 'week' },
			'description',
		);
		await rejects(
			Maintenance.create,
			{ description: 'x', to: 1500475302, recurrenceType: 'week' },
			'from',
		);
	});

	it('rejects a recurrence the spec does not list', async () => {
		await rejects(
			Maintenance.create,
			{
				description: 'x',
				from: 1500471702,
				to: 1500475302,
				recurrenceType: 'year',
			},
			'recurrenceType',
		);
	});

	it('rejects a multi delete without ids', async () => {
		await rejects(Checks.deleteMulti, { checkIds: [] }, 'checkIds');
	});

	it('rejects a team create without members', async () => {
		await rejects(Alerting.createTeam, { name: 'solo' }, 'memberIds');
	});

	it('rejects a contact create without notification targets', async () => {
		await rejects(Alerting.createContact, { name: 'x' }, 'notificationTargets');
	});

	it('rejects a contact update without the paused flag', async () => {
		await rejects(
			Alerting.updateContact,
			{
				contactId: 1,
				name: 'x',
				notificationTargets: [{ email: 'a@b.sea' }],
			},
			'paused',
		);
	});
});
