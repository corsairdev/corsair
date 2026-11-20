import { logEventFromContext } from 'corsair/core';
import { Locations, Projects, SpecialHours, Users } from './endpoints';
import { LocationSchema } from './endpoints/types';
import {
	geocoding,
	listPage,
	location,
	project,
	rule,
	unauthenticated,
	user,
	validationError,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'sr-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
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
		body: init.body === undefined ? undefined : String(init.body),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('users', () => {
	it('get reads the token profile', async () => {
		respond({ data: user });

		await expect(invoke(Users.get, {})).resolves.toEqual({ data: user });
		const sent = lastRequest();
		expect(sent.origin).toBe('https://storerocket.io');
		expect(sent.path).toBe('/api/v2/user');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});
});

describe('projects', () => {
	it('list reads the project array', async () => {
		respond({ data: [project] });

		await expect(invoke(Projects.list, {})).resolves.toEqual({
			data: [project],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects',
		});
	});
});

describe('locations', () => {
	it('list sends page, limit, include flags and bracket filters', async () => {
		respond(listPage);

		await expect(
			invoke(Locations.list, {
				projectId: 'PROJECT_ID',
				page: 2,
				limit: 25,
				includeHours: true,
				includeFields: true,
				filters: [
					{ field: 'city', op: 'eq', value: 'Seattle' },
					{ field: 'name', op: 'like', value: 'Downtown' },
				],
			}),
		).resolves.toEqual(listPage);
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects/PROJECT_ID/locations',
			query: {
				page: '2',
				limit: '25',
				includeHours: '1',
				includeFields: '1',
				'city[eq]': 'Seattle',
				'name[like]': 'Downtown',
			},
		});
	});

	it('encodes false include flags as 0, not false', async () => {
		respond(listPage);

		await invoke(Locations.list, {
			projectId: 'PROJECT_ID',
			includeHours: false,
		});

		expect(lastRequest().query.includeHours).toBe('0');
	});

	it('rejects an operator the field does not document', async () => {
		respond(listPage);

		// postalCode only documents eq.
		await expect(
			invoke(Locations.list, {
				projectId: 'PROJECT_ID',
				filters: [{ field: 'postalCode', op: 'like', value: '98101' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a duplicate field/operator filter pair', async () => {
		respond(listPage);

		await expect(
			invoke(Locations.list, {
				projectId: 'PROJECT_ID',
				filters: [
					{ field: 'name', op: 'ne', value: 'Warehouse A' },
					{ field: 'name', op: 'ne', value: 'Warehouse B' },
				],
			}),
		).rejects.toThrow('Duplicate name[ne] filter');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an impossible calendar date on a rule create', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'Bad date',
				start_date: '2026-02-30',
				hours: 'closed',
				applies_to: { type: 'all' },
			}),
		).rejects.toThrow('real calendar date');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a leap day', async () => {
		respond({ data: rule }, 201);

		await invoke(SpecialHours.create, {
			projectId: 'PROJECT_ID',
			name: 'Leap day',
			start_date: '2028-02-29',
			hours: 'closed',
			applies_to: { type: 'all' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('rejects a partial week that pads with an unrecognized key', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.create, {
				projectId: 'PROJECT_ID',
				name: 'Padded Week',
				city: 'Seattle',
				hours: {
					mon: '09:00-17:00',
					tue: '09:00-17:00',
					wed: '09:00-17:00',
					thu: '09:00-17:00',
					fri: '09:00-17:00',
					sat: '10:00-14:00',
					extra: 'nonsense',
				} as never,
			}),
		).rejects.toThrow('all seven days');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above the documented 100', async () => {
		respond(listPage);

		await expect(
			invoke(Locations.list, { projectId: 'PROJECT_ID', limit: 101 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('get reads one location with include flags', async () => {
		respond({ data: location });

		await expect(
			invoke(Locations.get, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
				includeHours: true,
			}),
		).resolves.toEqual({ data: location });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects/PROJECT_ID/locations/LOCATION_ID',
			query: { includeHours: '1' },
		});
	});

	it('create POSTs name and city with the full week of hours', async () => {
		respond({ data: location, geocoding });

		const hours = {
			mon: '09:00-17:00',
			tue: '09:00-17:00',
			wed: '09:00-17:00',
			thu: '09:00-17:00',
			fri: '09:00-17:00',
			sat: '10:00-14:00',
			sun: 'closed',
		};
		await expect(
			invoke(Locations.create, {
				projectId: 'PROJECT_ID',
				name: 'Downtown Store',
				city: 'Seattle',
				lat: 47.6062,
				lng: -122.3321,
				hours,
				fields: { Manager: 'Sam' },
			}),
		).resolves.toEqual({ data: location, geocoding });
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/api/v2/projects/PROJECT_ID/locations',
		});
		expect(sent.body).toContain('"hours"');
		expect(sent.body).toContain('"fields":{"Manager":"Sam"}');
	});

	it('create accepts hours {} for a coming-soon location', async () => {
		respond({ data: location, geocoding });

		await invoke(Locations.create, {
			projectId: 'PROJECT_ID',
			name: 'Coming Soon Store',
			city: 'Seattle',
			visible: false,
			hours: {},
		});

		expect(lastRequest().body).toContain('"hours":{}');
	});

	it('create rejects a partial week of hours', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.create, {
				projectId: 'PROJECT_ID',
				name: 'Partial Week',
				city: 'Seattle',
				hours: { mon: '09:00-17:00' },
			}),
		).rejects.toThrow('all seven days');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('create rejects a latitude outside the documented range', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.create, {
				projectId: 'PROJECT_ID',
				name: 'Off World',
				city: 'Seattle',
				lat: 95,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('update refuses null for name and city, which the API requires', async () => {
		// Live 11-20: PATCH {"name":null} and {"city":null} answer 422.
		for (const field of ['name', 'city']) {
			await expect(
				invoke(Locations.update, {
					projectId: 'PROJECT_ID',
					locationId: 'LOCATION_ID',
					[field]: null,
				}),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('update PATCHes only the sent fields and clears with null', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.update, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
				phone: '555-0101',
				hours: null,
				fields: { Manager: 'Alex', 'Old label': null },
			}),
		).resolves.toEqual({ data: location, geocoding });
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/projects/PROJECT_ID/locations/LOCATION_ID',
		});
		expect(JSON.parse(sent.body as string)).toEqual({
			phone: '555-0101',
			hours: null,
			fields: { Manager: 'Alex', 'Old label': null },
		});
	});

	it('replace PUTs the full contract with the ids kept out of the body', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.replace, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
				name: 'Downtown Store',
				city: 'Seattle',
				visible: false,
				hours: location.hours,
			}),
		).resolves.toEqual({ data: location, geocoding });
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'PUT',
			path: '/api/v2/projects/PROJECT_ID/locations/LOCATION_ID',
		});
		expect(sent.headers.get('content-type')).toContain('application/json');
		expect(JSON.parse(sent.body as string)).toEqual({
			name: 'Downtown Store',
			city: 'Seattle',
			visible: false,
			hours: location.hours,
		});
	});

	it('replace rejects a partial week', async () => {
		respond({ data: location, geocoding });

		await expect(
			invoke(Locations.replace, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
				name: 'Downtown Store',
				city: 'Seattle',
				hours: { mon: '09:00-17:00' },
			}),
		).rejects.toThrow('all seven days');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('delete validates the success flag the docs promise', async () => {
		respond({ success: true });

		await expect(
			invoke(Locations.remove, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
			}),
		).resolves.toEqual({ success: true });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/projects/PROJECT_ID/locations/LOCATION_ID',
		});
	});

	it('delete rejects a body without success true', async () => {
		respond(unauthenticated, 404);

		await expect(
			invoke(Locations.remove, {
				projectId: 'PROJECT_ID',
				locationId: 'LOCATION_ID',
			}),
		).rejects.toThrow();
	});
});

describe('specialHours', () => {
	it('list and get read rules', async () => {
		respond({ data: [rule] });
		await expect(
			invoke(SpecialHours.list, { projectId: 'PROJECT_ID' }),
		).resolves.toEqual({ data: [rule] });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects/PROJECT_ID/special-hours',
		});

		respond({ data: rule });
		await expect(
			invoke(SpecialHours.get, {
				projectId: 'PROJECT_ID',
				ruleId: 'k4ZqP0mE7d',
			}),
		).resolves.toEqual({ data: rule });
		expect(lastRequest()).toMatchObject({
			path: '/api/v2/projects/PROJECT_ID/special-hours/k4ZqP0mE7d',
		});
	});

	it('create POSTs the rule with the idempotency key', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'Thanksgiving',
				holiday_key: 'US:thanksgiving-day',
				start_date: '2026-11-26',
				hours: 'closed',
				repeats_yearly: true,
				applies_to: { type: 'countries', values: ['US'] },
				idempotencyKey: 'thanksgiving-2026-us',
			}),
		).resolves.toEqual({ data: rule });
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/api/v2/projects/PROJECT_ID/special-hours',
		});
		expect(sent.headers.get('idempotency-key')).toBe('thanksgiving-2026-us');
	});

	it('create accepts a range array of hours', async () => {
		respond({ data: rule }, 201);

		await invoke(SpecialHours.create, {
			projectId: 'PROJECT_ID',
			name: 'Christmas Eve',
			start_date: '2026-12-24',
			hours: [{ opens: '09:00', closes: '14:00' }],
			applies_to: {
				type: 'locations',
				values: ['LOCATION_ID_1', 'LOCATION_ID_2'],
			},
		});

		expect(lastRequest().body).toContain(
			'"hours":[{"opens":"09:00","closes":"14:00"}]',
		);
	});

	it('create rejects an empty values list for a non-all type', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'Nobody',
				start_date: '2026-12-24',
				hours: 'closed',
				applies_to: { type: 'countries', values: [] },
			}),
		).rejects.toThrow('at least one');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('create rejects the all type with values', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'Everyone',
				start_date: '2026-12-24',
				hours: 'closed',
				applies_to: { type: 'all', values: ['US'] },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('create rejects repeats_yearly without a holiday key', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'No key',
				start_date: '2026-12-24',
				hours: 'closed',
				repeats_yearly: true,
				applies_to: { type: 'all' },
			}),
		).rejects.toThrow('holiday_key');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('create rejects an open-ended closure with an end date', async () => {
		respond({ data: rule }, 201);

		await expect(
			invoke(SpecialHours.create, {
				projectId: 'PROJECT_ID',
				name: 'Renovation',
				start_date: '2026-11-23',
				end_date: '2026-12-14',
				until_further_notice: true,
				hours: 'closed',
				applies_to: { type: 'all' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('update PATCHes selected fields', async () => {
		respond({ data: rule });

		await expect(
			invoke(SpecialHours.update, {
				projectId: 'PROJECT_ID',
				ruleId: 'k4ZqP0mE7d',
				hours: [{ opens: '10:00', closes: '15:00' }],
			}),
		).resolves.toEqual({ data: rule });
		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/projects/PROJECT_ID/special-hours/k4ZqP0mE7d',
		});
		expect(sent.body).toBe('{"hours":[{"opens":"10:00","closes":"15:00"}]}');
	});

	it('update lets repeats_yearly rely on the saved holiday_key', async () => {
		// Live 11-20: PATCH {"repeats_yearly":true} on a rule with a saved
		// holiday_key answers 200.
		respond({ data: rule });

		await expect(
			invoke(SpecialHours.update, {
				projectId: 'PROJECT_ID',
				ruleId: 'k4ZqP0mE7d',
				repeats_yearly: true,
			}),
		).resolves.toEqual({ data: rule });
		expect(lastRequest().body).toBe('{"repeats_yearly":true}');
	});

	it('update refuses repeats_yearly while clearing the holiday_key', async () => {
		await expect(
			invoke(SpecialHours.update, {
				projectId: 'PROJECT_ID',
				ruleId: 'k4ZqP0mE7d',
				repeats_yearly: true,
				holiday_key: null,
			}),
		).rejects.toThrow('repeats_yearly needs a holiday_key');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('delete shapes the 204 to the documented contract', async () => {
		// A 204 Response takes no body.
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 204,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await expect(
			invoke(SpecialHours.remove, {
				projectId: 'PROJECT_ID',
				ruleId: 'k4ZqP0mE7d',
			}),
		).resolves.toEqual({ id: 'k4ZqP0mE7d', success: true });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/projects/PROJECT_ID/special-hours/k4ZqP0mE7d',
		});
	});
});

describe('output parsing', () => {
	it('rejects a list answer that is not the data envelope', async () => {
		respond(validationError, 422);

		await expect(
			invoke(Locations.list, { projectId: 'PROJECT_ID' }),
		).rejects.toThrow();
	});

	it('rejects a location with no id rather than returning a blank row', async () => {
		respond({ data: { name: 'No id' } });

		await expect(
			invoke(Locations.get, { projectId: 'PROJECT_ID', locationId: 'X' }),
		).rejects.toThrow();
	});

	it('accepts enum values the provider adds later on responses', async () => {
		respond({
			data: {
				...rule,
				hours: 'by_appointment',
				applies_to: { type: 'zones', values: ['Z1'] },
			},
		});

		await expect(
			invoke(SpecialHours.get, { projectId: 'PROJECT_ID', ruleId: 'R' }),
		).resolves.toMatchObject({ data: { hours: 'by_appointment' } });

		respond({
			data: location,
			geocoding: { status: 'partial', match: 'neighbourhood' },
		});

		await expect(
			invoke(Locations.update, {
				projectId: 'PROJECT_ID',
				locationId: 'X',
				phone: '555-0102',
			}),
		).resolves.toMatchObject({ geocoding: { status: 'partial' } });
	});

	it('types the special_hours block that includeSpecialHours returns', async () => {
		// Trimmed from a live GET with includeSpecialHours=1 (11-20).
		const special_hours = {
			window: { from: '2026-11-18', to: '2027-01-20' },
			dates: [
				{
					name: 'corsair-plugin-test',
					start_date: '2026-12-24',
					end_date: '2026-12-24',
					hours: 'closed',
					note: null,
				},
			],
		};
		respond({ data: { ...location, special_hours } });

		const result = (await invoke(Locations.get, {
			projectId: 'PROJECT_ID',
			locationId: 'X',
			includeSpecialHours: true,
		})) as { data: { special_hours?: unknown } };
		expect(result.data.special_hours).toEqual(special_hours);
		expect(LocationSchema.shape.special_hours).toBeDefined();
	});

	it('passes through extra fields the docs do not spell out', async () => {
		respond({ data: { ...location, socials: [] } });

		await expect(
			invoke(Locations.get, { projectId: 'PROJECT_ID', locationId: 'X' }),
		).resolves.toEqual({ data: { ...location, socials: [] } });
	});
});
