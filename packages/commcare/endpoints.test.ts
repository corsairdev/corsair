import { logEventFromContext } from 'corsair/core';
import { Cases, Device, Directory, Forms, Groups, Users } from './endpoints';
import {
	bulkActionAccepted,
	bulkActionComplete,
	caseList,
	fixtureItem,
	form,
	formList,
	group,
	groupList,
	location,
	locationType,
	lookupTable,
	otaRestoreXml,
	reportData,
	reportList,
	submissionResponseXml,
	user,
	userList,
	webUser,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const DOMAIN = 'my-project';
const USERNAME = 'jdoe@my-project.commcarehq.org';
const API_KEY = 'cc-test-key';

// unknown: every concrete endpoint satisfies this because parameters are
// contravariant, while each endpoint returns its own output type, so the
// shared return can only be unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: raw caller input and the result stay unknown until the
// operation's zod schemas have run; negative cases pass values no schema
// accepts.
async function invoke<T = unknown>(
	endpoint: AnyEndpoint,
	input: unknown,
): Promise<T> {
	const ctx = { key: API_KEY };
	// Every op is user-scoped: inject the auth username into the input.
	const withAuth = {
		...(input as Record<string, unknown>),
		username: USERNAME,
	};
	return endpoint(ctx as never, withAuth as never) as Promise<T>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/xml' : 'application/json',
			},
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
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
		// unknown: the request body is whatever the endpoint serialized.
		body:
			init.body instanceof FormData
				? init.body
				: init.body
					? (JSON.parse(String(init.body)) as unknown)
					: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://www.commcarehq.org');
	expect(sent.headers.get('authorization')).toBe(
		`ApiKey ${USERNAME}:${API_KEY}`,
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('forms', () => {
	it('lists with paging filters and flattens the next-page link', async () => {
		respond(formList);
		const result = await invoke<{
			objects: unknown[];
			nextPageUrl?: string;
			meta?: { total_count?: number };
		}>(Forms.list, { domain: DOMAIN, limit: 20, offset: 0 });
		expect(result.objects).toHaveLength(1);
		expect(result.nextPageUrl).toContain('offset=20');
		expect(result.meta?.total_count).toBe(29);
		expectAuthenticated();
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/api/form/v1/`);
	});

	it('reads one form', async () => {
		respond(form);
		const result = await invoke<{ id?: string }>(Forms.get, {
			domain: DOMAIN,
			formId: form.id!,
		});
		expect(result.id).toBe(form.id);
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/api/form/v1/${form.id}/`);
	});

	it('starts a bulk action and answers the job id', async () => {
		respond(bulkActionAccepted, 202);
		const result = await invoke<{ id: string; status?: string }>(
			Forms.bulkAction,
			{ domain: DOMAIN, action: 'archive', formIds: ['a', 'b'] },
		);
		expect(result.id).toBe('0f3a9c');
		expectAuthenticated();
		expect(lastRequest().body).toEqual({
			action: 'archive',
			form_ids: ['a', 'b'],
		});
	});

	it('reads the bulk action status', async () => {
		respond(bulkActionComplete);
		const result = await invoke<{ status?: string; succeeded?: number }>(
			Forms.bulkActionStatus,
			{ domain: DOMAIN, actionId: '0f3a9c' },
		);
		expect(result.status).toBe('complete');
		expect(lastRequest().path).toContain('/bulk-action/0f3a9c');
	});

	it('rejects more than 5000 form ids without calling the API', async () => {
		const ids = Array.from({ length: 5001 }, (_, i) => `id-${i}`);
		await expect(
			invoke(Forms.bulkAction, {
				domain: DOMAIN,
				action: 'archive',
				formIds: ids,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cases', () => {
	it('lists v2 cases with filters and the cursor', async () => {
		respond(caseList);
		const result = await invoke<{
			cases: unknown[];
			next?: string;
			matching_records?: number;
		}>(Cases.list, {
			domain: DOMAIN,
			caseType: 'patient',
			closed: false,
			cursor: 'abc',
		});
		expect(result.cases).toHaveLength(1);
		expect(result.next).toContain('cursor=abc');
		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe(`/a/${DOMAIN}/api/case/v2/`);
		expect(sent.query.case_type).toBe('patient');
		expect(sent.query.cursor).toBe('abc');
	});

	it('reads one case with properties', async () => {
		const onlyCase = caseList.cases[0]!;
		respond(onlyCase);
		const result = await invoke<{
			case_id?: string;
			properties?: Record<string, unknown>;
		}>(Cases.get, { domain: DOMAIN, caseId: onlyCase.case_id });
		expect(result.case_id).toBe(onlyCase.case_id);
	});

	it('bulk-fetches cases by ids', async () => {
		respond(caseList);
		const result = await invoke<{ cases: unknown[] }>(Cases.bulkFetch, {
			domain: DOMAIN,
			caseIds: ['a', 'b'],
			fields: ['case_id'],
		});
		expect(result.cases).toHaveLength(1);
		const sent = lastRequest();
		// The bulk-fetch view reads the ids from a JSON POST body; a GET
		// with query ids answers 400 "Payload must be valid JSON".
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/a/${DOMAIN}/api/case/v2/bulk-fetch/`);
		expect(sent.body).toEqual({ case_ids: ['a', 'b'] });
		expect(sent.query.case_ids).toBeUndefined();
		expect(sent.query.fields).toBe('case_id');
	});

	it('looks up a case by external id', async () => {
		respond(caseList.cases[0]);
		const result = await invoke<{ case_id?: string }>(Cases.getByExternalId, {
			domain: DOMAIN,
			externalId: '1',
		});
		expect(result.case_id).toBeDefined();
		expect(lastRequest().path).toContain('/api/case/v2/ext/1/');
	});

	it('sends no case type on the external-id lookup, which ignores it', async () => {
		// HQ's ext view looks the case up by domain and external id only, so
		// a case_type would read as a filter that never applies.
		respond(caseList.cases[0]);
		await invoke(Cases.getByExternalId, {
			domain: DOMAIN,
			externalId: '1',
			caseType: 'household',
		});
		expect(lastRequest().query).toEqual({});
	});

	it('rejects a wrong-shaped case list body', async () => {
		respond({ objects: 'nope' }, 200);
		await expect(invoke(Cases.list, { domain: DOMAIN })).rejects.toThrow();
	});
});

describe('users', () => {
	it('lists mobile workers', async () => {
		respond(userList);
		const result = await invoke<{
			objects: unknown[];
			meta?: { total_count?: number };
		}>(Users.list, { domain: DOMAIN });
		expect(result.objects).toHaveLength(1);
		expect(result.meta?.total_count).toBe(29);
	});

	it('reads one worker', async () => {
		respond(user);
		const result = await invoke<{ username?: string }>(Users.get, {
			domain: DOMAIN,
			userId: user.id!,
		});
		expect(result.username).toBe(user.username);
	});

	it('creates a worker with snake_case fields', async () => {
		respond(user, 201);
		const result = await invoke<{ id?: string }>(Users.create, {
			domain: DOMAIN,
			username: USERNAME,
			workerUsername: 'new@my-project.commcarehq.org',
			password: 'pw',
			firstName: 'Jo',
			lastName: 'Lee',
			phoneNumber: '+15551234567',
		});
		expect(result.id).toBe(user.id);
		expect(lastRequest().body).toMatchObject({
			username: 'new@my-project.commcarehq.org',
			first_name: 'Jo',
			last_name: 'Lee',
			default_phone_number: '+15551234567',
		});
		expect(lastRequest().body).not.toHaveProperty('phone_number');
	});

	it('updates a worker', async () => {
		respond(user);
		await invoke(Users.update, {
			domain: DOMAIN,
			userId: user.id!,
			phoneNumber: '+15551234567',
		});
		// CommCare's user updater knows default_phone_number and
		// phone_numbers; phone_number is "unknown or non-editable" (400).
		expect(lastRequest().body).toEqual({
			default_phone_number: '+15551234567',
		});
	});

	it('deletes a worker and parses the empty answer', async () => {
		respondEmpty(204);
		await invoke(Users.delete, { domain: DOMAIN, userId: user.id! });
		expect(lastRequest().method).toBe('DELETE');
	});

	it('accepts the empty text/html 202 that a worker delete answers', async () => {
		// Django's HttpAccepted() carries no body and a text/html type, so
		// core hands back an empty string, not undefined.
		fetchMock.mockResolvedValueOnce(
			new Response('', {
				status: 202,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			}),
		);
		await expect(
			invoke(Users.delete, { domain: DOMAIN, userId: user.id! }),
		).resolves.toEqual({});
	});

	it('addresses one worker with the trailing slash the detail route needs', async () => {
		respond(user);
		await invoke(Users.get, { domain: DOMAIN, userId: 'u1' });
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/api/user/v1/u1/`);
		respond(user);
		await invoke(Users.update, {
			domain: DOMAIN,
			userId: 'u1',
			firstName: 'A',
		});
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/api/user/v1/u1/`);
		respondEmpty(204);
		await invoke(Users.delete, { domain: DOMAIN, userId: 'u1' });
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/api/user/v1/u1/`);
	});

	it('sends a password reset and parses the empty 202', async () => {
		respondEmpty(202);
		await invoke(Users.sendPasswordReset, { domain: DOMAIN, userId: user.id! });
		expect(lastRequest().method).toBe('POST');
	});
});

describe('groups', () => {
	it('lists groups', async () => {
		respond(groupList);
		const result = await invoke<{ objects: { name?: string }[] }>(Groups.list, {
			domain: DOMAIN,
		});
		expect(result.objects[0]!.name).toBe('Field team A');
	});

	it('reads, creates and updates a group', async () => {
		respond(group);
		const got = await invoke<{ name?: string }>(Groups.get, {
			domain: DOMAIN,
			groupId: group.id!,
		});
		expect(got.name).toBe('Field team A');

		respond(group, 201);
		await invoke(Groups.create, { domain: DOMAIN, name: 'New team' });
		expect(lastRequest().body).toEqual({ name: 'New team' });

		respond(group);
		await invoke(Groups.update, {
			domain: DOMAIN,
			groupId: group.id!,
			reporting: true,
		});
		expect(lastRequest().body).toEqual({ reporting: true });
	});
});

describe('directory', () => {
	it('lists web users', async () => {
		respond({ objects: [webUser] });
		const result = await invoke<{ objects: { email?: string }[] }>(
			Directory.listWebUsers,
			{ domain: DOMAIN },
		);
		expect(result.objects[0]!.email).toBe('admin@example.com');
	});

	it('lists and reads locations', async () => {
		respond({ objects: [location] });
		const result = await invoke<{ objects: { name?: string }[] }>(
			Directory.listLocations,
			{ domain: DOMAIN, locationTypeCode: 'county' },
		);
		expect(result.objects[0]!.name).toBe('Fairfax County');
		expect(lastRequest().query.location_type_code).toBe('county');

		respond(location);
		const got = await invoke<{ location_id?: string }>(Directory.getLocation, {
			domain: DOMAIN,
			locationId: location.location_id!,
		});
		expect(got.location_id).toBe(location.location_id);
	});

	it('lists and reads location types', async () => {
		respond({ objects: [locationType] });
		const result = await invoke<{ objects: { code?: string }[] }>(
			Directory.listLocationTypes,
			{ domain: DOMAIN },
		);
		expect(result.objects[0]!.code).toBe('country');

		respond(locationType);
		const got = await invoke<{ code?: string }>(Directory.getLocationType, {
			domain: DOMAIN,
			typeId: 1,
		});
		expect(got.code).toBe('country');
	});

	it('lists fixtures and reads one item', async () => {
		respond({ objects: [fixtureItem] });
		const result = await invoke<{ objects: unknown[] }>(
			Directory.listFixtures,
			{
				domain: DOMAIN,
				fixtureType: 'city',
			},
		);
		expect(result.objects).toHaveLength(1);
		expect(lastRequest().query.fixture_type).toBe('city');

		respond(fixtureItem);
		const got = await invoke<{ id?: string }>(Directory.getFixtureItem, {
			domain: DOMAIN,
			itemId: '1J9NF7B4FT',
		});
		expect(got.id).toBe(fixtureItem.id);
	});

	it('lists and reads lookup tables', async () => {
		respond({ objects: [lookupTable] });
		const result = await invoke<{ objects: { name?: string }[] }>(
			Directory.listLookupTables,
			{ domain: DOMAIN },
		);
		expect(result.objects[0]!.name).toBe('prices');

		respond(lookupTable);
		const got = await invoke<{ name?: string }>(Directory.getLookupTable, {
			domain: DOMAIN,
			tableId: 'tbl_01',
		});
		expect(got.name).toBe('prices');
	});

	it('lists reports and runs report data', async () => {
		respond(reportList);
		const result = await invoke<{ reports: { id?: string }[] }>(
			Directory.listReports,
			{ domain: DOMAIN },
		);
		expect(result.reports[0]!.id).toBeDefined();

		respond(reportData);
		const data = await invoke<{ data?: unknown[]; total_records?: number }>(
			Directory.getReportData,
			{ domain: DOMAIN, reportId: reportList[0]!.id, limit: 10 },
		);
		expect(data.data).toHaveLength(1);
		expect(data.total_records).toBe(30);
		expect(lastRequest().query.limit).toBe('10');
	});

	it('lists DET exports', async () => {
		respond({ objects: [{ id: 'det_1', name: 'Case export', type: 'case' }] });
		const result = await invoke<{ detExports: { id?: string }[] }>(
			Directory.listDetExports,
			{ domain: DOMAIN },
		);
		expect(result.detExports[0]!.id).toBe('det_1');
	});
});

describe('device', () => {
	it('pulls the OTA restore XML', async () => {
		respond(otaRestoreXml);
		const result = await invoke<{ raw: string }>(Device.restore, {
			domain: DOMAIN,
		});
		expect(result.raw).toContain('OpenRosaResponse');
		expect(lastRequest().path).toBe(`/a/${DOMAIN}/phone/restore/`);
	});

	it('submits an XForm and surfaces the message', async () => {
		respond(submissionResponseXml, 201);
		const result = await invoke<{ message?: string }>(Device.submit, {
			domain: DOMAIN,
			appId: 'app-1',
			xml: '<xform></xform>',
		});
		expect(result.message).toContain('successfully submitted');
		const sent = lastRequest();
		expect(sent.path).toBe(`/a/${DOMAIN}/receiver/app-1/`);
		// The submission goes out as a file part (Blob), which is what the
		// receiver requires; the XML content matches what was signed in.
		const part = (sent.body as FormData).get('xml_submission_file');
		expect(part).toBeInstanceOf(Blob);
		expect(await (part as Blob).text()).toBe('<xform></xform>');
	});
});

describe('error transport', () => {
	it('surfaces a 503 with its status', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ message: 'boom' }), {
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(invoke(Users.list, { domain: DOMAIN })).rejects.toMatchObject({
			status: 503,
		});
	});
});
