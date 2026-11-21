import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import {
	ContactGroups,
	Heartbeat,
	Locations,
	MaintenanceWindows,
	Pagespeed,
	SSL,
	Uptime,
} from './endpoints';
import { StatusCakeEndpointInputSchemas } from './endpoints/types';
import {
	contactGroup,
	contactGroupsList,
	heartbeat,
	heartbeatList,
	locations,
	maintenanceWindow,
	maintenanceWindowsList,
	newId,
	pagespeedHistoryPage,
	pagespeedList,
	pagespeedTest,
	sslList,
	sslTest,
	uptime,
	uptimeAlertsPage,
	uptimeHistoryPage,
	uptimeList,
	uptimePeriodsPage,
	validationError,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_TOKEN = 'sc-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_TOKEN } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or empty.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const params = new URLSearchParams(String(init.body));
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		queryKeys: [...parsed.searchParams.keys()],
		queryAll: (key: string) => parsed.searchParams.getAll(key),
		method: init.method,
		headers: new Headers(init.headers),
		form: Object.fromEntries(params),
		formKeys: [...params.keys()],
		formAll: (key: string) => params.getAll(key),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.statuscake.com');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_TOKEN}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('contactGroups', () => {
	it('lists paged and keeps the metadata envelope', async () => {
		respond(contactGroupsList);

		const result = (await invoke(ContactGroups.list, {
			page: 1,
			limit: 25,
		})) as { data: unknown[]; metadata: { total_count: number } };
		expect(result.data).toEqual([contactGroup]);
		expect(result.metadata.total_count).toBe(87);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/contact-groups',
			query: { page: '1', limit: '25' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'statuscake.contactGroups.list',
			{ count: 1, totalCount: 87 },
			'completed',
		);
	});

	it('creates a group and returns new_id', async () => {
		respond(newId, 201);

		await expect(
			invoke(ContactGroups.create, {
				name: 'DevOps',
				email_addresses: ['oncall@example.com'],
			}),
		).resolves.toEqual(newId);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/contact-groups',
			formKeys: ['name', 'email_addresses[]'],
		});
	});

	it('rejects a create without name before sending', async () => {
		respond(newId, 201);

		await expect(
			invoke(ContactGroups.create, { email_addresses: ['a@b.c'] }),
		).rejects.toThrow('"name"');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets one group through the data envelope', async () => {
		respond({ data: contactGroup });

		await expect(
			invoke(ContactGroups.get, { group_id: '123' }),
		).resolves.toEqual({ data: contactGroup });
		expect(lastRequest().path).toBe('/v1/contact-groups/123');
	});

	it('updates with only the passed fields', async () => {
		respond(undefined, 204);

		await expect(
			invoke(ContactGroups.update, { group_id: '123', name: 'DevOps primary' }),
		).resolves.toEqual({ success: true, id: '123' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/contact-groups/123',
			form: { name: 'DevOps primary' },
		});
	});

	it('deletes and shapes the bodyless 204', async () => {
		respond(undefined, 204);

		await expect(
			invoke(ContactGroups.remove, { group_id: '123' }),
		).resolves.toEqual({ success: true, id: '123' });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/contact-groups/123',
		});
	});
});

describe('heartbeat', () => {
	it('lists with status and tag filters as one comma-separated tags value', async () => {
		respond(heartbeatList);

		await invoke(Heartbeat.list, {
			status: 'up',
			tags: ['batch', 'jobs'],
			matchany: true,
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/heartbeat');
		// Live, a tags[] array answers 400 "Tags must be a comma-separated string".
		expect(sent.query).toMatchObject({
			status: 'up',
			matchany: 'true',
			tags: 'batch,jobs',
		});
		expect(sent.queryKeys).not.toContain('tags[]');
	});

	it('leaves matchany out when false, since the API reads it by presence', async () => {
		respond(heartbeatList);

		await invoke(Heartbeat.list, { tags: ['batch', 'jobs'], matchany: false });

		expect(lastRequest().queryKeys).not.toContain('matchany');
	});

	it('create requires period', async () => {
		respond(newId, 201);

		await expect(
			invoke(Heartbeat.create, { name: 'nightly backup' }),
		).rejects.toThrow('"period"');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates with contact groups as an array field', async () => {
		respond(newId, 201);

		await invoke(Heartbeat.create, {
			name: 'nightly backup',
			period: 86400,
			contact_groups: ['123'],
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({ method: 'POST', path: '/v1/heartbeat' });
		expect(sent.formKeys).toContain('contact_groups[]');
		expect(sent.form).toMatchObject({
			name: 'nightly backup',
			period: '86400',
		});
	});

	it('gets the full check model', async () => {
		respond({ data: heartbeat });

		await expect(invoke(Heartbeat.get, { test_id: '123456' })).resolves.toEqual(
			{ data: heartbeat },
		);
		expect(lastRequest().path).toBe('/v1/heartbeat/123456');
	});

	it('updates and deletes with shaped 204 answers', async () => {
		respond(undefined, 204);

		await expect(
			invoke(Heartbeat.update, { test_id: '123456', paused: true }),
		).resolves.toEqual({ success: true, id: '123456' });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/heartbeat/123456',
			form: { paused: 'true' },
		});

		respond(undefined, 204);
		await expect(
			invoke(Heartbeat.remove, { test_id: '123456' }),
		).resolves.toEqual({ success: true, id: '123456' });
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('maintenanceWindows', () => {
	it('lists filtered by state', async () => {
		respond(maintenanceWindowsList);

		await invoke(MaintenanceWindows.list, { state: 'pending' });

		expect(lastRequest()).toMatchObject({
			path: '/v1/maintenance-windows',
			query: { state: 'pending' },
		});
	});

	it('create requires the window fields and tests-or-tags', async () => {
		respond(newId, 201);

		await expect(
			invoke(MaintenanceWindows.create, { name: 'deploy window' }),
		).rejects.toThrow(/"start_at"/);
		await expect(
			invoke(MaintenanceWindows.create, {
				name: 'deploy window',
				start_at: '2026-12-01T02:00:00Z',
				end_at: '2026-12-01T04:00:00Z',
				timezone: 'Europe/London',
			}),
		).rejects.toThrow('must cover at least one of them');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates with tests as an array field', async () => {
		respond(newId, 201);

		await invoke(MaintenanceWindows.create, {
			name: 'deploy window',
			start_at: '2026-12-01T02:00:00Z',
			end_at: '2026-12-01T04:00:00Z',
			timezone: 'Europe/London',
			tests: ['123456'],
			repeat_interval: '1w',
		});

		const sent = lastRequest();
		expect(sent.formKeys).toContain('tests[]');
		expect(sent.form).toMatchObject({ repeat_interval: '1w' });
	});

	it('rejects an undocumented repeat interval before sending', async () => {
		respond(newId, 201);

		await expect(
			invoke(MaintenanceWindows.create, {
				name: 'deploy window',
				start_at: '2026-12-01T02:00:00Z',
				end_at: '2026-12-01T04:00:00Z',
				timezone: 'Europe/London',
				tests: ['1'],
				repeat_interval: 'daily',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets, updates and deletes', async () => {
		respond({ data: maintenanceWindow });

		await expect(
			invoke(MaintenanceWindows.get, { window_id: '42' }),
		).resolves.toEqual({ data: maintenanceWindow });
		expect(lastRequest().path).toBe('/v1/maintenance-windows/42');

		respond(undefined, 204);
		await expect(
			invoke(MaintenanceWindows.update, {
				window_id: '42',
				end_at: '2026-12-01T05:00:00Z',
			}),
		).resolves.toEqual({ success: true, id: '42' });

		respond(undefined, 204);
		await expect(
			invoke(MaintenanceWindows.remove, { window_id: '42' }),
		).resolves.toEqual({ success: true, id: '42' });
	});
});

describe('pagespeed', () => {
	it('lists checks with their latest stats', async () => {
		respond(pagespeedList);

		await expect(invoke(Pagespeed.list, {})).resolves.toEqual(pagespeedList);
		expect(lastRequest()).toMatchObject({ path: '/v1/pagespeed' });
	});

	it('create requires name, website_url, check_rate and region', async () => {
		respond(newId, 201);

		await expect(
			invoke(Pagespeed.create, { name: 'marketing site' }),
		).rejects.toThrow(/"website_url"/);
		await expect(
			invoke(Pagespeed.create, {
				name: 'marketing site',
				website_url: 'https://www.example.com',
				check_rate: 3600,
			}),
		).rejects.toThrow('"region"');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates and accepts the check rate as a number', async () => {
		respond(newId, 201);

		await invoke(Pagespeed.create, {
			name: 'marketing site',
			website_url: 'https://www.example.com',
			check_rate: 3600,
			region: 'UK',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/pagespeed',
			form: { check_rate: '3600', region: 'UK' },
		});
	});

	it('rejects an undocumented check rate', async () => {
		respond(newId, 201);

		await expect(
			invoke(Pagespeed.create, {
				name: 'marketing site',
				website_url: 'https://www.example.com',
				check_rate: 30,
				region: 'UK',
			}),
		).rejects.toThrow('check_rate must be one of');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets, updates and deletes', async () => {
		respond({ data: pagespeedTest });

		await expect(invoke(Pagespeed.get, { test_id: '123456' })).resolves.toEqual(
			{ data: pagespeedTest },
		);
		expect(lastRequest().path).toBe('/v1/pagespeed/123456');

		respond(undefined, 204);
		await expect(
			invoke(Pagespeed.update, { test_id: '123456', paused: true }),
		).resolves.toEqual({ success: true, id: '123456' });

		respond(undefined, 204);
		await expect(
			invoke(Pagespeed.remove, { test_id: '123456' }),
		).resolves.toEqual({ success: true, id: '123456' });
	});

	it('history returns the page with its next link', async () => {
		respond(pagespeedHistoryPage);

		await expect(
			invoke(Pagespeed.history, { test_id: '123456', limit: 100 }),
		).resolves.toEqual(pagespeedHistoryPage);
		expect(lastRequest()).toMatchObject({
			path: '/v1/pagespeed/123456/history',
			query: { limit: '100' },
		});
	});

	it('history keeps the documented metadata.aggregates', async () => {
		const aggregates = {
			loadtime: { min: 300, max: 900, avg: 450 },
			filesize: { min: 1000, max: 1200, avg: 1100 },
			requests: { min: 10, max: 12, avg: 11 },
		};
		respond({ ...pagespeedHistoryPage, metadata: { aggregates } });

		const result = (await invoke(Pagespeed.history, {
			test_id: '123456',
		})) as { metadata?: { aggregates?: unknown } };
		expect(result.metadata?.aggregates).toEqual(aggregates);
	});
});

describe('ssl', () => {
	it('lists certificate state', async () => {
		respond(sslList);

		await expect(invoke(SSL.list, {})).resolves.toEqual(sslList);
		expect(lastRequest()).toMatchObject({ path: '/v1/ssl' });
	});

	it('create requires website_url, check_rate and exactly 3 alert days', async () => {
		respond(newId, 201);

		await expect(
			invoke(SSL.create, { check_rate: 86400, alert_at: [30, 14, 7] }),
		).rejects.toThrow('"website_url"');
		await expect(
			invoke(SSL.create, {
				website_url: 'https://www.example.com',
				check_rate: 86400,
				alert_at: [30, 14],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates with alert_at as an array field', async () => {
		respond(newId, 201);

		await invoke(SSL.create, {
			website_url: 'https://www.example.com',
			check_rate: 86400,
			alert_at: [30, 14, 7],
			alert_expiry: true,
		});

		const sent = lastRequest();
		expect(sent.formKeys).toContain('alert_at[]');
		expect(sent.form).toMatchObject({ alert_expiry: 'true' });
	});

	it('gets the certificate model', async () => {
		respond({ data: sslTest });

		await expect(invoke(SSL.get, { test_id: '123456' })).resolves.toEqual({
			data: sslTest,
		});
		expect(lastRequest().path).toBe('/v1/ssl/123456');
	});

	it('updates and deletes', async () => {
		respond(undefined, 204);

		await expect(
			invoke(SSL.update, { test_id: '123456', alert_at: [21, 14, 7] }),
		).resolves.toEqual({ success: true, id: '123456' });
		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.formKeys).toContain('alert_at[]');

		respond(undefined, 204);
		await expect(invoke(SSL.remove, { test_id: '123456' })).resolves.toEqual({
			success: true,
			id: '123456',
		});
	});
});

describe('uptime', () => {
	it('lists with status and tags filters', async () => {
		respond(uptimeList);

		await invoke(Uptime.list, { status: 'up', tags: ['production'] });

		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'GET',
			path: '/v1/uptime',
			query: { status: 'up', tags: 'production' },
		});
		expect(sent.queryKeys).not.toContain('tags[]');
	});

	it('update does not offer test_type, which the API cannot change', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await invoke(Uptime.update, {
			test_id: '1',
			test_type: 'TCP',
			paused: true,
		});

		expect(lastRequest().formKeys).not.toContain('test_type');
		expect(
			Object.keys(StatusCakeEndpointInputSchemas.uptimeUpdate.shape),
		).not.toContain('test_type');
	});

	it('create schemas declare their required fields, so types and docs show them', () => {
		const required = (schema: z.ZodType) =>
			(z.toJSONSchema(schema, { io: 'input' }) as { required?: string[] })
				.required ?? [];
		expect(
			required(StatusCakeEndpointInputSchemas.uptimeCreate).sort(),
		).toEqual(['check_rate', 'name', 'test_type', 'website_url']);
		expect(
			required(StatusCakeEndpointInputSchemas.contactGroupsCreate),
		).toEqual(['name']);
	});

	it('create requires name, test_type, website_url and check_rate', async () => {
		respond(newId, 201);

		await expect(invoke(Uptime.create, { name: 'x' })).rejects.toThrow(
			/"test_type"/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates a check with the documented field names', async () => {
		respond(newId, 201);

		await invoke(Uptime.create, {
			name: 'statuscake.com',
			test_type: 'HTTP',
			website_url: 'https://www.statuscake.com',
			check_rate: 300,
			tags: ['production'],
			status_codes_csv: '200,301',
			regions: ['UK'],
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/v1/uptime',
			form: {
				name: 'statuscake.com',
				test_type: 'HTTP',
				website_url: 'https://www.statuscake.com',
				check_rate: '300',
				status_codes_csv: '200,301',
			},
		});
		expect(sent.formKeys).toContain('tags[]');
		expect(sent.formKeys).toContain('regions[]');
	});

	it('rejects an undocumented test type before sending', async () => {
		respond(newId, 201);

		await expect(
			invoke(Uptime.create, {
				name: 'x',
				test_type: 'WEBSOCKET',
				website_url: 'https://example.com',
				check_rate: 60,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets the full model including processing state and servers', async () => {
		respond({ data: uptime });

		await expect(invoke(Uptime.get, { test_id: '123456' })).resolves.toEqual({
			data: uptime,
		});
		expect(lastRequest().path).toBe('/v1/uptime/123456');
	});

	it('update clears tags with the documented empty-array marker', async () => {
		respond(undefined, 204);

		await invoke(Uptime.update, { test_id: '123456', tags: [] });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/uptime/123456',
			form: { 'tags[]': '' },
		});
	});

	it('omits unset fields on update so they stay unchanged', async () => {
		respond(undefined, 204);

		await invoke(Uptime.update, { test_id: '123456', paused: true });

		expect(lastRequest().form).toEqual({ paused: 'true' });
	});

	it('deletes', async () => {
		respond(undefined, 204);

		await expect(invoke(Uptime.remove, { test_id: '123456' })).resolves.toEqual(
			{ success: true, id: '123456' },
		);
		expect(lastRequest().method).toBe('DELETE');
	});

	it.each(['alerts', 'history', 'periods'] as const)(
		'%s reads a record window',
		async (record) => {
			const body = {
				alerts: uptimeAlertsPage,
				history: uptimeHistoryPage,
				periods: uptimePeriodsPage,
			}[record];
			respond(body);

			await expect(
				invoke(Uptime[record], {
					test_id: '123456',
					limit: 100,
					after: 1791000000,
				}),
			).resolves.toEqual(body);
			expect(lastRequest()).toMatchObject({
				path: `/v1/uptime/123456/${record}`,
				query: { limit: '100', after: '1791000000' },
			});
		},
	);
});

describe('locations', () => {
	it('lists uptime locations filtered by region code', async () => {
		respond(locations);

		await expect(
			invoke(Locations.uptime, { region_code: 'UK' }),
		).resolves.toEqual(locations);
		expect(lastRequest()).toMatchObject({
			path: '/v1/uptime-locations',
			query: { region_code: 'UK' },
		});
	});

	it('lists pagespeed locations', async () => {
		respond(locations);

		await expect(invoke(Locations.pagespeed, {})).resolves.toEqual(locations);
		expect(lastRequest()).toMatchObject({
			path: '/v1/pagespeed-locations',
			query: {},
		});
	});
});

describe('error surfaces', () => {
	it('surfaces the documented validation error shape', async () => {
		respond(validationError, 400);

		await expect(invoke(Uptime.list, {})).rejects.toMatchObject({
			name: 'StatusCakeAPIError',
			status: 400,
		});
	});

	it('fails loudly when a list answer is not the documented envelope', async () => {
		respond({ data: 'not-an-array' });

		await expect(invoke(Uptime.list, {})).rejects.toThrow();
	});

	it('fails loudly when a metadata envelope is missing on a paged list', async () => {
		respond({ data: uptimeList.data });

		await expect(invoke(Uptime.list, {})).rejects.toThrow();
	});
});
